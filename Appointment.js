const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    token: { type: Number, required: true },
    arrivalTime: { type: String, required: true }, // e.g. "9:20 AM", derived from token
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled", "expired"],
      default: "upcoming",
    },
    bookedVia: { type: String, enum: ["web", "ai_assistant", "reception"], default: "web" },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// A doctor can only have one appointment per token per day
appointmentSchema.index({ doctor: 1, date: 1, token: 1 }, { unique: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
