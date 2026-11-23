const User = require("./userModels");
const Expense = require("./expenseModels");

// User -> Expenses
User.hasMany(Expense, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Expense.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = {
  User,
  Expense,
};
