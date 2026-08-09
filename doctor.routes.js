const express = require("express");
const router = express.Router();
const { listDoctors, getDoctor, createDoctor, updateDoctor } = require("../controllers/doctor.controller");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");

router.get("/", listDoctors);
router.get("/:id", getDoctor);
router.post("/", protect, allowRoles("admin"), createDoctor);
router.patch("/:id", protect, allowRoles("admin", "doctor"), updateDoctor);

module.exports = router;
