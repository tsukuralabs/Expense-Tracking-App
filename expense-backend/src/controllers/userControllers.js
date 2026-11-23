const { User } = require("../models/associations");

// Add a new user
// POST /user
const addUser = async (req, res) => {
  try {
    const { fullName, email, password, currency } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide fullName, email, and password." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User with this email already exists." });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      currency: currency || "INR",
    });

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all users
// GET /users or GET /user
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "fullName", "email", "currency", "createdAt"],
      order: [["id", "ASC"]],
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  addUser,
  getUsers,
};
