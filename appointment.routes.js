const express = require("express");
const router = express.Router();
const {
  getAvailability,
  createAppointment,
  listByPatient,
  cancelAppointment,
  rescheduleAppointment,
} = require("./appointment.controller");

router.get("/availability", getAvailability);
router.post("/", createAppointment);
router.get("/patient/:patientId", listByPatient);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/reschedule", rescheduleAppointment);

module.exports = router;
