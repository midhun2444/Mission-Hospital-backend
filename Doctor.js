const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    experienceYears: { type: Number, required: true, min: 0 },
    availableDays: [{ type: String, enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] }],
    consultationStart: { type: String, required: true }, // "09:00" 24hr
    consultationEnd: { type: String, required: true },
    slotMinutes: { type: Number, default: 10 }, // minutes per patient/token
    maxTokensPerDay: { type: Number, default: 30 },
    languages: [{ type: String, trim: true }],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    photoInitials: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    // optional link to the doctor's login account
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
