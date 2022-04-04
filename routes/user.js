const express = require("express");
const router = express.Router();
const { getUserById, getUser } = require("../controllers/user");

router.param("userId", getUserById);

// User Routes
router.get("/:userId", getUser);

module.exports = router;