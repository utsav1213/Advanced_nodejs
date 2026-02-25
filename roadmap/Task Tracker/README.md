# Task Tracker CLI

A simple command-line interface (CLI) application to track and manage your tasks. This project helps you practice working with the filesystem, handling user inputs, and building CLI applications.

## Features

- ✅ Add, update, and delete tasks
- ✅ Mark tasks as in-progress or done
- ✅ List all tasks or filter by status
- ✅ Store tasks in a JSON file
- ✅ Handle errors and edge cases gracefully
- ✅ No external dependencies required

## Requirements

- Node.js (v12 or higher)

## Installation

1. Clone or download this project to your local machine
2. Navigate to the project directory:

   ```bash
   cd "Task Tracker"
   ```

3. Make the script executable (Linux/macOS):

   ```bash
   chmod +x task-cli.js
   ```

4. (Optional) Create a symlink to run from anywhere:

   ```bash
   # Linux/macOS
   sudo ln -s $(pwd)/task-cli.js /usr/local/bin/task-cli

   # Or add an alias to your shell config (.bashrc, .zshrc, etc.)
   alias task-cli="node /path/to/task-cli.js"
   ```

## Usage

### Basic Command Structure

```bash
node task-cli.js <command> [arguments]

# Or if you've set up the symlink/alias:
task-cli <command> [arguments]
```

### Commands

#### Add a New Task

```bash
task-cli add "Buy groceries"
# Output: Task added successfully (ID: 1)
```

#### Update a Task

```bash
task-cli update 1 "Buy groceries and cook dinner"
# Output: Task 1 updated successfully
```

#### Delete a Task

```bash
task-cli delete 1
# Output: Task 1 deleted successfully
```

#### Mark Task as In Progress

```bash
task-cli mark-in-progress 1
# Output: Task 1 marked as in-progress
```

#### Mark Task as Done

```bash
task-cli mark-done 1
# Output: Task 1 marked as done
```

#### List All Tasks

```bash
task-cli list
```

#### List Tasks by Status

```bash
# List all tasks that are marked as done
task-cli list done

# List all tasks that are not done (todo)
task-cli list todo

# List all tasks that are in progress
task-cli list in-progress
```

#### Get Help

```bash
task-cli help
# Or
task-cli --help
# Or
task-cli -h
```

## Task Properties

Each task in the system has the following properties:

| Property      | Type   | Description                                            |
| ------------- | ------ | ------------------------------------------------------ |
| `id`          | Number | A unique identifier for the task                       |
| `description` | String | A short description of the task                        |
| `status`      | String | The status of the task (`todo`, `in-progress`, `done`) |
| `createdAt`   | String | ISO 8601 timestamp of when the task was created        |
| `updatedAt`   | String | ISO 8601 timestamp of when the task was last updated   |

## Data Storage

Tasks are stored in a `tasks.json` file in the same directory as the script. The file is automatically created when you add your first task.

Example `tasks.json` structure:

```json
[
  {
    "id": 1,
    "description": "Buy groceries",
    "status": "todo",
    "createdAt": "2026-02-25T10:30:00.000Z",
    "updatedAt": "2026-02-25T10:30:00.000Z"
  },
  {
    "id": 2,
    "description": "Write documentation",
    "status": "in-progress",
    "createdAt": "2026-02-25T11:00:00.000Z",
    "updatedAt": "2026-02-25T11:15:00.000Z"
  }
]
```

## Examples

Here's a typical workflow:

```bash
# Add some tasks
task-cli add "Buy groceries"
task-cli add "Write blog post"
task-cli add "Exercise for 30 minutes"

# View all tasks
task-cli list

# Start working on a task
task-cli mark-in-progress 1

# Complete a task
task-cli mark-done 1

# Update a task description
task-cli update 2 "Write blog post about CLI tools"

# View only tasks in progress
task-cli list in-progress

# View only completed tasks
task-cli list done

# Delete a task
task-cli delete 3
```

## Error Handling

The application handles various error scenarios:

- Empty task descriptions
- Invalid task IDs
- Non-existent tasks
- File system errors
- Invalid commands
- Invalid status filters

## Project Structure

```
Task Tracker/
├── task-cli.js      # Main CLI application
├── tasks.json       # Task data storage (created automatically)
└── README.md        # Documentation
```

## Technical Implementation

- **Language**: Node.js (JavaScript)
- **File System**: Uses Node.js native `fs` module
- **Data Format**: JSON
- **Dependencies**: None (uses only Node.js built-in modules)

## Constraints Followed

✅ No external libraries or frameworks  
✅ Positional arguments for user inputs  
✅ JSON file storage in current directory  
✅ Native file system module usage  
✅ Proper error handling  
✅ Automatic file creation if it doesn't exist

## Contributing

This is a learning project based on the [roadmap.sh Task Tracker project](https://roadmap.sh/projects/task-tracker). Feel free to fork and modify for your own learning purposes.

## License

This project is open source and available for educational purposes.

## Future Enhancements

Possible improvements you could add:

- Task priority levels
- Due dates for tasks
- Task categories/tags
- Search functionality
- Export tasks to different formats
- Task statistics and reports
- Color-coded output
- Interactive mode
- Task archiving
- Undo/redo functionality

---

**Happy Task Tracking! 📝**
