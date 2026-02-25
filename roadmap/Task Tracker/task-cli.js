#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Path to the JSON file
const TASKS_FILE = path.join(__dirname, "tasks.json");

// Initialize tasks file if it doesn't exist
function initializeTasksFile() {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  }
}

// Read tasks from JSON file
function readTasks() {
  try {
    initializeTasksFile();
    const data = fs.readFileSync(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tasks file:", error.message);
    return [];
  }
}

// Write tasks to JSON file
function writeTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error writing to tasks file:", error.message);
  }
}

// Generate unique ID
function generateId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((task) => task.id)) + 1;
}

// Add a new task
function addTask(description) {
  if (!description || description.trim() === "") {
    console.error("Error: Task description cannot be empty");
    return;
  }

    const tasks = readTasks();
  const newTask = {
    id: generateId(tasks),
    description: description.trim(),
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  writeTasks(tasks);
  console.log(`Task added successfully (ID: ${newTask.id})`);
}

// Update a task
function updateTask(id, newDescription) {
  const taskId = parseInt(id);
  if (isNaN(taskId)) {
    console.error("Error: Invalid task ID");
    return;
  }

  if (!newDescription || newDescription.trim() === "") {
    console.error("Error: Task description cannot be empty");
    return;
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    console.error(`Error: Task with ID ${taskId} not found`);
    return;
  }

  tasks[taskIndex].description = newDescription.trim();
  tasks[taskIndex].updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task ${taskId} updated successfully`);
}

// Delete a task
function deleteTask(id) {
  const taskId = parseInt(id);
  if (isNaN(taskId)) {
    console.error("Error: Invalid task ID");
    return;
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    console.error(`Error: Task with ID ${taskId} not found`);
    return;
  }

  tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  console.log(`Task ${taskId} deleted successfully`);
}

// Mark task as in progress
function markInProgress(id) {
  updateTaskStatus(id, "in-progress");
}

// Mark task as done
function markDone(id) {
  updateTaskStatus(id, "done");
}

// Update task status
function updateTaskStatus(id, status) {
  const taskId = parseInt(id);
  if (isNaN(taskId)) {
    console.error("Error: Invalid task ID");
    return;
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    console.error(`Error: Task with ID ${taskId} not found`);
    return;
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();
  writeTasks(tasks);
  console.log(`Task ${taskId} marked as ${status}`);
}

// List tasks
function listTasks(filterStatus = null) {
  const tasks = readTasks();

  if (tasks.length === 0) {
    console.log("No tasks found");
    return;
  }

  let filteredTasks = tasks;

  if (filterStatus) {
    filteredTasks = tasks.filter((task) => task.status === filterStatus);
    if (filteredTasks.length === 0) {
      console.log(`No tasks with status "${filterStatus}"`);
      return;
    }
  }

  console.log("TASK LIST");
  console.log("\n" + "=".repeat(80));
  console.log("=".repeat(80));

  filteredTasks.forEach((task) => {
    const statusEmoji = {
      todo: "📝",
      "in-progress": "⏳",
      done: "✅",
    };

    console.log(`\nID: ${task.id}`);
    console.log(`Description: ${task.description}`);
    console.log(`Status: ${statusEmoji[task.status] || ""} ${task.status}`);
    console.log(`Created: ${new Date(task.createdAt).toLocaleString()}`);
    console.log(`Updated: ${new Date(task.updatedAt).toLocaleString()}`);
    console.log("-".repeat(80));
  });

  console.log(`\nTotal tasks: ${filteredTasks.length}\n`);
}

// Display help message
function showHelp() {
  console.log(`
Task Tracker CLI - Manage your tasks from the command line

USAGE:
  task-cli <command> [arguments]

COMMANDS:
  add <description>              Add a new task
  update <id> <description>      Update a task description
  delete <id>                    Delete a task
  mark-in-progress <id>          Mark a task as in progress
  mark-done <id>                 Mark a task as done
  list [status]                  List all tasks or filter by status
                                 Status options: todo, in-progress, done

EXAMPLES:
  task-cli add "Buy groceries"
  task-cli update 1 "Buy groceries and cook dinner"
  task-cli delete 1
  task-cli mark-in-progress 1
  task-cli mark-done 1
  task-cli list
  task-cli list done
  task-cli list todo
  task-cli list in-progress

For more information, visit: https://roadmap.sh/projects/task-tracker
  `);
}

// Main function to handle CLI commands
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    return;
  }

  const command = args[0].toLowerCase();

  switch (command) {
    case "add":
      if (args.length < 2) {
        console.error("Error: Please provide a task description");
        console.log("Usage: task-cli add <description>");
      } else {
        addTask(args.slice(1).join(" "));
      }
      break;

    case "update":
      if (args.length < 3) {
        console.error("Error: Please provide task ID and new description");
        console.log("Usage: task-cli update <id> <description>");
      } else {
        updateTask(args[1], args.slice(2).join(" "));
      }
      break;

    case "delete":
      if (args.length < 2) {
        console.error("Error: Please provide a task ID");
        console.log("Usage: task-cli delete <id>");
      } else {
        deleteTask(args[1]);
      }
      break;

    case "mark-in-progress":
      if (args.length < 2) {
        console.error("Error: Please provide a task ID");
        console.log("Usage: task-cli mark-in-progress <id>");
      } else {
        markInProgress(args[1]);
      }
      break;

    case "mark-done":
      if (args.length < 2) {
        console.error("Error: Please provide a task ID");
        console.log("Usage: task-cli mark-done <id>");
      } else {
        markDone(args[1]);
      }
      break;

    case "list":
      const validStatuses = ["todo", "in-progress", "done"];
      if (args.length > 1 && !validStatuses.includes(args[1])) {
        console.error(
          `Error: Invalid status "${args[1]}". Valid options: todo, in-progress, done`,
        );
      } else {
        listTasks(args[1]);
      }
      break;

    case "help":
    case "--help":
    case "-h":
      showHelp();
      break;

    default:
      console.error(`Error: Unknown command "${command}"`);
      console.log('Run "task-cli help" for usage information');
  }
}

// Run the CLI
main();
