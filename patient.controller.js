const Patient = require("./Patient");

// GET /api/patients/lookup/:fileNumber
// Used by the "returning patient" step of the booking flow.
async function lookupByFileNumber(req, res) {
  try {
    const fileNumber = req.params.fileNumber.trim();
    if (!/^[0-9]{6}$/.test(fileNumber)) {
      return res.status(400).json({ message: "File number must be exactly 6 digits" });
    }
    const patient = await Patient.findOne({ fileNumber });
    if (!patient) return res.status(404).json({ message: "No patient found with that file number" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Lookup failed", error: err.message });
  }
}

// POST /api/patients  (new patient registration during booking)
async function registerPatient(req, res) {
  try {
    const { name, age, gender, phone, email, address } = req.body;
    if (!name || !age || !gender || !phone) {
      return res.status(400).json({ message: "name, age, gender and phone are required" });
    }
    const patient = await Patient.create({ name, age, gender, phone, email, address });
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: "Failed to register patient", error: err.message });
  }
}

// GET /api/patients/:id
async function getPatient(req, res) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch patient", error: err.message });
  }
}

module.exports = { lookupByFileNumber, registerPatient, getPatient };
