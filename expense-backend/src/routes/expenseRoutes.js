const express = require("express");
const { addExpense, getExpenses, deleteExpense, updateExpense } = require("../controllers/expenseControllers");
const router = express.Router();


router.post("/expense", addExpense);
router.get("/expense", getExpenses);
router.put("/expense/:id", updateExpense);
router.delete("/expense/:id", deleteExpense);

module.exports = router;
