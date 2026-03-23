#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");

const program = new Command();
const EXPENSES_FILE = path.join(__dirname, "expenses.json");

// Helper to load expenses
function loadExpenses() {
  if (!fs.existsSync(EXPENSES_FILE)) {
    return [];
  }
  const data = fs.readFileSync(EXPENSES_FILE, "utf-8");
  try {
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper to save expenses
function saveExpenses(expenses) {
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(expenses, null, 2));
}

// Commands
program
  .name("expense-tracker")
  .description("A simple CLI to track expenses")
  .version("1.0.0");

// Add expense
program
  .command("add")
  .description("Add a new expense")
  .requiredOption("--description <desc>", "Description of the expense")
  .requiredOption("--amount <amt>", "Amount of the expense")
  .action((options) => {
    const { description, amount } = options;
    const expenseAmount = parseFloat(amount);

    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      console.error("Error: Amount must be a positive number.");
      process.exit(1);
    }

    const expenses = loadExpenses();
    const newId =
      expenses.length > 0 ? Math.max(...expenses.map((e) => e.id)) + 1 : 1;

    // Format date as YYYY-MM-DD
    const date = new Date().toISOString().split("T")[0];

    const newExpense = {
      id: newId,
      date,
      description,
      amount: expenseAmount,
    };

    expenses.push(newExpense);
    saveExpenses(expenses);
    console.log(`Expense added successfully (ID: ${newId})`);
  });

// Update expense
program
  .command("update")
  .description("Update an expense")
  .requiredOption("--id <id>", "ID of the expense to update")
  .option("--description <desc>", "New description")
  .option("--amount <amt>", "New amount")
  .action((options) => {
    const { id, description, amount } = options;
    const expenses = loadExpenses();
    const expenseIndex = expenses.findIndex((e) => e.id === parseInt(id));

    if (expenseIndex === -1) {
      console.error(`Error: Expense with ID ${id} not found.`);
      process.exit(1);
    }

    if (description) expenses[expenseIndex].description = description;
    if (amount) {
      const expenseAmount = parseFloat(amount);
      if (isNaN(expenseAmount) || expenseAmount <= 0) {
        console.error("Error: Amount must be a positive number.");
        process.exit(1);
      }
      expenses[expenseIndex].amount = expenseAmount;
    }

    saveExpenses(expenses);
    console.log(`Expense updated successfully (ID: ${id})`);
  });

// Delete expense
program
  .command("delete")
  .description("Delete an expense")
   .requiredOption("--id <id>", "ID of the expense to delete")
  .action((options) => {
    const { id } = options;
    let expenses = loadExpenses();
    const initialLength = expenses.length;
    expenses = expenses.filter((e) => e.id !== parseInt(id));

    if (expenses.length === initialLength) {
      console.error(`Error: Expense with ID ${id} not found.`);
      process.exit(1);
    }

    saveExpenses(expenses);
    console.log("Expense deleted successfully");
  });

// List expenses
program
  .command("list")
  .description("List all expenses")
  .action(() => {
    const expenses = loadExpenses();
    console.log("ID\tDate\t\tDescription\tAmount");
    expenses.forEach((e) => {
      console.log(`${e.id}\t${e.date}\t${e.description}\t$${e.amount}`);
    });
  });

// Summary
program
  .command("summary")
  .description("Show summary of expenses")
  .option("--month <month>", "Month number (1-12) to view summary for")
  .action((options) => {
      const { month } = options;
    const expenses = loadExpenses();
    let total = 0;

    if (month) {
      const monthNum = parseInt(month);
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        console.error("Error: Month must be between 1 and 12.");
        process.exit(1);
      }
      // Filter by month (assuming current year or any year?)
      // Requirement says "specific month (of current year)"
      const currentYear = new Date().getFullYear();

      const filteredExpenses = expenses.filter((e) => {
        const [year, expenseMonth] = e.date.split("-");
        return (
          parseInt(expenseMonth) === monthNum && parseInt(year) === currentYear
        );
      });

      total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

      // Month names array for nice output
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      console.log(`Total expenses for ${monthNames[monthNum - 1]}: $${total}`);
    } else {
      total = expenses.reduce((sum, e) => sum + e.amount, 0);
      console.log(`Total expenses: $${total}`);
    }
  });

program.parse(process.argv);
