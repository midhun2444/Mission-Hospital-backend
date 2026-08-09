const Appointment = require("./Appointment");
const Doctor = require("./Doctor");
const { tokenToArrivalTime } = require("./tokenTime");

// GET /api/appointments/availability?doctorId=&date=YYYY-MM-DD
// Returns the full token grid for that doctor/date with booked vs available.
async function getAvailability(req, res) {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) return res.status(400).json({ message: "doctorId and date are required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const booked = await Appointment.find({
      doctor: doctorId,
      date,
      status: { $in: ["upcoming", "completed"] },
    }).select("token -_id");

    const bookedTokens = new Set(booked.map((b) => b.token));
    const tokens = Array.from({ length: doctor.maxTokensPerDay }, (_, i) => {
      const tokenNumber = i + 1;
      return {
        token: tokenNumber,
        booked: bookedTokens.has(tokenNumber),
        arrivalTime: tokenToArrivalTime(tokenNumber, doctor.consultationStart, doctor.slotMinutes),
      };
    });

    res.json({ doctor: { id: doctor._id, name: doctor.name }, date, tokens });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch availability", error: err.message });
  }
}

// POST /api/appointments
// body: { patientId, doctorId, date, token, bookedVia }
async function createAppointment(req, res) {
  try {
    const { patientId, doctorId, date, token, bookedVia } = req.body;
    if (!patientId || !doctorId || !date || !token) {
      return res.status(400).json({ message: "patientId, doctorId, date and token are required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (token < 1 || token > doctor.maxTokensPerDay) {
      return res.status(400).json({ message: `Token must be between 1 and ${doctor.maxTokensPerDay}` });
    }

    const arrivalTime = tokenToArrivalTime(token, doctor.consultationStart, doctor.slotMinutes);

    // The unique index on {doctor, date, token} is what actually prevents
    // double-booking under concurrent requests — this create() will throw
    // a duplicate-key error (code 11000) if the token was just taken.
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      department: doctor.department,
      date,
      token,
      arrivalTime,
      bookedVia: bookedVia || "web",
    });

    const populated = await appointment.populate([
      { path: "patient", select: "name fileNumber phone" },
      { path: "doctor", select: "name" },
      { path: "department", select: "name" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "That token was just booked by someone else — please pick another." });
    }
    res.status(400).json({ message: "Failed to create appointment", error: err.message });
  }
}

// GET /api/appointments/patient/:patientId
async function listByPatient(req, res) {
  try {
    const appointments = await Appointment.find({ patient: req.params.patientId })
      .populate("doctor", "name")
      .populate("department", "name")
      .sort({ date: -1, token: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments", error: err.message });
  }
}

// PATCH /api/appointments/:id/cancel
async function cancelAppointment(req, res) {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel appointment", error: err.message });
  }
}

// PATCH /api/appointments/:id/reschedule
// body: { date, token }
async function rescheduleAppointment(req, res) {
  try {
    const { date, token } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const doctor = await Doctor.findById(appointment.doctor);
    const arrivalTime = tokenToArrivalTime(token, doctor.consultationStart, doctor.slotMinutes);

    appointment.date = date;
    appointment.token = token;
    appointment.arrivalTime = arrivalTime;
    appointment.status = "upcoming";
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "That token is already taken on the new date." });
    }
    res.status(400).json({ message: "Failed to reschedule appointment", error: err.message });
  }
}

module.exports = {
  getAvailability,
  createAppointment,
  listByPatient,
  cancelAppointment,
  rescheduleAppointment,
};
