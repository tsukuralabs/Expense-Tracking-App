const { Expense, User } = require("../models/associations");

// Add a new expense
// POST /api/expenses
const addExpense = async (req, res) => {
  try {
    const { amount, description, category, date } = req.body;
    const userId = req.user ? req.user.id : req.body.userId;

    if (!amount || !description || !category || !userId) {
      return res.status(400).json({ success: false, message: "Please provide amount, description, category, and userId." });
    }

    const expense = await Expense.create({
      amount,
      description,
      category,
      date: date || new Date(),
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all old expenses for the user (on page refresh)
// GET /api/expenses?userId=1
const getExpenses = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.query.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const expenses = await Expense.findAll({
      where: { userId },
      include: [{ model: User, attributes: ["fullName", "currency"] }],
      order: [["date", "DESC"], ["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Edit / Update an existing expense
// PUT /api/expenses/:id
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, date } = req.body;
    const userId = req.user ? req.user.id : (req.query.userId || req.body?.userId);

    const whereClause = userId ? { id, userId } : { id };
    const expense = await Expense.findOne({ where: whereClause });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found." });
    }

    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.description = description !== undefined ? description : expense.description;
    expense.category = category !== undefined ? category : expense.category;
    expense.date = date !== undefined ? date : expense.date;

    await expense.save();

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete an expense
// DELETE /api/expenses/:id?userId=1
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : (req.query.userId || req.body?.userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const expense = await Expense.findOne({ where: { id, userId } });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found or unauthorized." });
    }

    await expense.destroy();

    res.status(200).json({ success: true, message: "Expense deleted successfully", id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
