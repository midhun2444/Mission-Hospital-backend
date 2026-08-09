const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true }, // maps to a lucide-react icon name on the frontend
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
