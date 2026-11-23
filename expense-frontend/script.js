import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "./api.js";

const USER_ID = localStorage.getItem("userId") || 1;

const expenseForm = document.getElementById("expenseForm");
const amountInput = document.getElementById("expenseAmount");
const descriptionInput = document.getElementById("expenseDescription");
const categoryInput = document.getElementById("expenseCategory");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const expenseList = document.getElementById("expenseList");

let editingExpenseId = null;

// Load existing expenses on page load
window.addEventListener("DOMContentLoaded", loadExpenses);

async function loadExpenses() {
  try {
    const data = await getExpenses(USER_ID);
    expenseList.innerHTML = "";

    if (data.expenses && data.expenses.length > 0) {
      data.expenses.forEach(renderExpenseItem);
    } else {
      expenseList.innerHTML = `<li class="text-muted text-center py-3">No expenses added yet.</li>`;
    }
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
  }
}

// Handle Form Submit (Add or Update)
expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const expenseData = {
    amount: amountInput.value,
    description: descriptionInput.value.trim(),
    category: categoryInput.value,
    userId: USER_ID,
  };

  try {
    if (editingExpenseId) {
      await updateExpense(editingExpenseId, expenseData, USER_ID);
      resetForm();
    } else {
      await addExpense(expenseData);
      expenseForm.reset();
    }
    await loadExpenses();
  } catch (error) {
    console.error("Error saving expense:", error);
    alert("Could not save expense. Check console for details.");
  }
});

// Render a single expense item: "• 100 - Movie - On vacation [Delete Expense] [Edit Expense]"
function renderExpenseItem(expense) {
  const li = document.createElement("li");
  li.className = "list-group-item d-flex align-items-center justify-content-between py-2";

  const infoSpan = document.createElement("span");
  infoSpan.className = "fw-medium";
  infoSpan.textContent = `• ${expense.amount} - ${expense.category} - ${expense.description}`;

  const btnGroup = document.createElement("div");
  btnGroup.className = "d-flex gap-2";

  // Delete Expense Button
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-sm btn-outline-danger";
  deleteBtn.textContent = "Delete Expense";
  deleteBtn.addEventListener("click", async () => {
    try {
      await deleteExpense(expense.id, USER_ID);
      li.remove();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  });

  // Edit Expense Button
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-sm btn-outline-secondary";
  editBtn.textContent = "Edit Expense";
  editBtn.addEventListener("click", () => {
    amountInput.value = expense.amount;
    descriptionInput.value = expense.description;
    categoryInput.value = expense.category;

    editingExpenseId = expense.id;
    submitBtn.textContent = "Update Expense";
    submitBtn.classList.replace("btn-primary", "btn-success");
    cancelBtn.classList.remove("d-none");
    amountInput.focus();
  });

  btnGroup.appendChild(deleteBtn);
  btnGroup.appendChild(editBtn);

  li.appendChild(infoSpan);
  li.appendChild(btnGroup);
  expenseList.appendChild(li);
}

// Cancel edit mode
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editingExpenseId = null;
  expenseForm.reset();
  submitBtn.textContent = "Add Expense";
  submitBtn.classList.remove("btn-success");
  submitBtn.classList.add("btn-primary");
  cancelBtn.classList.add("d-none");
}
