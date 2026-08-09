const express = require("express");
const router = express.Router();
const { listDepartments, createDepartment } = require("./department.controller");
const protect = require("../middleware/auth");
const allowRoles = require("../middleware/role");

router.get("/", listDepartments);
router.post("/", protect, allowRoles("admin"), createDepartment);

module.exports = router;
