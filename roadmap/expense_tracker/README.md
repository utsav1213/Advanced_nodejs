# Expense Tracker CLI

A simple command-line application to manage your finances.

## Installation

1. Make sure you have Node.js installed.
2. Clone this repository.
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the application using `node index.js` or `npm start` (if you add a script).
Or if you link it: `expense-tracker`.

### Commands

#### Add an expense

```bash
node index.js add --description "Lunch" --amount 20
```

#### List all expenses

```bash
node index.js list
```

#### Update an expense

```bash
node index.js update --id 1 --amount 25
```

#### Delete an expense

```bash
node index.js delete --id 1
```

#### View summary

```bash
# Total of all expenses
node index.js summary

# Total for a specific month (e.g., August)
node index.js summary --month 8
```

## Data Storage

Expenses are stored in `expenses.json` in the current directory.
