const express = require("express");
const cors = require('cors');
const expenseRouter = require('./src/routes/expenseRoutes');
const userRouter = require('./src/routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Expense Tracker API!", success: true });
});

app.use("/", userRouter);
app.use("/", expenseRouter);

app.use((req, res) => {
    res.status(404).json({ message: "404 - Route Not Found" });
});

module.exports = app;