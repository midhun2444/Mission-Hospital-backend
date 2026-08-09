const Doctor = require("./Doctor");

// GET /api/doctors?department=cardiology&search=aanya&day=Mon
async function listDoctors(req, res) {
  try {
    const { department, search, day } = req.query;
    const filter = { isActive: true };
    if (department) filter.department = department;
    if (day) filter.availableDays = day;
    if (search) filter.name = { $regex: search, $options: "i" };

    const doctors = await Doctor.find(filter).populate("department", "name slug").sort({ name: 1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors", error: err.message });
  }
}

// GET /api/doctors/:id
async function getDoctor(req, res) {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("department", "name slug");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctor", error: err.message });
  }
}

// POST /api/doctors (admin)
async function createDoctor(req, res) {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ message: "Failed to create doctor", error: err.message });
  }
}

// PATCH /api/doctors/:id (admin)
async function updateDoctor(req, res) {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ message: "Failed to update doctor", error: err.message });
  }
}

module.exports = { listDoctors, getDoctor, createDoctor, updateDoctor };
