const Department = require("../models/Department");
const Doctor = require("../models/Doctor");

// GET /api/departments
async function listDepartments(req, res) {
  try {
    const departments = await Department.find().sort({ name: 1 }).lean();
    // attach a live doctor count to each department
    const counts = await Doctor.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    const result = departments.map((d) => ({ ...d, doctorCount: countMap[String(d._id)] || 0 }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch departments", error: err.message });
  }
}

// POST /api/departments (admin)
async function createDepartment(req, res) {
  try {
    const { name, slug, description, icon } = req.body;
    const dept = await Department.create({ name, slug, description, icon });
    res.status(201).json(dept);
  } catch (err) {
    res.status(400).json({ message: "Failed to create department", error: err.message });
  }
}

module.exports = { listDepartments, createDepartment };
