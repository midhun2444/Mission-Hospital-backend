const express = require("express");
const router = express.Router();
const { listDepartments, createDepartment } = require("./department.controller");
const protect = require("./auth");
const allowRoles = require("./role");

router.get("/", listDepartments);
router.post("/", protect, allowRoles("admin"), createDepartment);

module.exports = router;
