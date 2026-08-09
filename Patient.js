const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    fileNumber: { type: String, unique: true, sparse: true, index: true, match: /^[0-9]{6}$/ },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);

// Auto-generate a plain 6-digit file number (numeric only, no letters) — e.g. 000123
patientSchema.pre("save", async function (next) {
  if (this.fileNumber) return next();
  const count = await mongoose.model("Patient").countDocuments();
  this.fileNumber = String(count + 1).padStart(6, "0");
  next();
});

module.exports = mongoose.model("Patient", patientSchema);
