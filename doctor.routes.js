const express = require("express");
const router = express.Router();
const { listDoctors, getDoctor, createDoctor, updateDoctor } = require("./doctor.controller");
const protect = require("./auth");
const allowRoles = require("./role");

router.get("/", listDoctors);
router.get("/:id", getDoctor);
router.post("/", protect, allowRoles("admin"), createDoctor);
router.patch("/:id", protect, allowRoles("admin", "doctor"), updateDoctor);

module.exports = router;
