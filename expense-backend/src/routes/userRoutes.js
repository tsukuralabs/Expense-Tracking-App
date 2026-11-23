const express = require("express");
const router = express.Router();
const { addUser, getUsers } = require("../controllers/userControllers");

router.post("/user", addUser);
router.get("/users", getUsers);
router.get("/user", getUsers);

module.exports = router;
