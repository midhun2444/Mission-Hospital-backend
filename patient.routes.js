const express = require("express");
const router = express.Router();
const { lookupByFileNumber, registerPatient, getPatient } = require("../controllers/patient.controller");

router.get("/lookup/:fileNumber", lookupByFileNumber);
router.post("/", registerPatient);
router.get("/:id", getPatient);

module.exports = router;
