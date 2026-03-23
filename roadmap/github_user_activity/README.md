# GitHub User Activity CLI

A simple command-line interface (CLI) tool to fetch and display the recent activity of any GitHub user directly in your terminal.

## Features

- ✅ Fetch recent activity of any GitHub user
- ✅ Display activity in a clean, readable format
- ✅ Handle various event types (pushes, issues, stars, forks, etc.)
- ✅ Graceful error handling
- ✅ No external dependencies (uses Node.js built-in modules only)

## Requirements

- Node.js (version 14 or higher)

## Installation

1. Clone or download this project
2. Navigate to the project directory
3. Make the script executable:

```bash
chmod +x index.js
```

4. (Optional) Install globally to use from anywhere:

```bash
npm install -g .
```

Or create a symlink:

```bash
npm link
```

## Usage

### Basic Usage

```bash
node index.js <username>
```

### If Installed Globally

```bash
github-activity <username>
```

### Examples

```bash
# Fetch activity for user 'kamranahmedse'
node index.js kamranahmedse

# Or if installed globally
github-activity kamranahmedse
```

### Sample Output

```
Fetching activity for GitHub user: kamranahmedse...

Recent Activity:
================
- Pushed 3 commits to kamranahmedse/developer-roadmap
- Opened an issue in kamranahmedse/developer-roadmap
- Starred kamranahmedse/developer-roadmap
- Created branch in kamranahmedse/developer-roadmap
- Forked kamranahmedse/developer-roadmap

Total events: 5
```

## Supported Event Types

The CLI recognizes and formats the following GitHub event types:

- **PushEvent** - Code commits pushed to a repository
- **IssuesEvent** - Issues opened, closed, or reopened
- **WatchEvent** - Repository starred
- **ForkEvent** - Repository forked
- **CreateEvent** - Branch or tag created
- **DeleteEvent** - Branch or tag deleted
- **PullRequestEvent** - Pull request opened, closed, or merged
- **PullRequestReviewEvent** - Pull request reviewed
- **PullRequestReviewCommentEvent** - Comment on pull request
- **IssueCommentEvent** - Comment on issue
- **CommitCommentEvent** - Comment on commit
- **ReleaseEvent** - Release published
- **MemberEvent** - Collaborator added
- **PublicEvent** - Repository made public
- **GollumEvent** - Wiki page updated

## Error Handling

The CLI handles the following error scenarios:

- **Invalid username**: If the username doesn't exist on GitHub
- **API rate limit**: If GitHub API rate limit is exceeded
- **Network errors**: Connection issues
- **No username provided**: Missing command-line argument

## Technical Details

- Uses Node.js built-in `https` module for API requests
- No external dependencies required
- GitHub API endpoint: `https://api.github.com/users/<username>/events`
- Returns up to 30 most recent public events

## Limitations

- Only displays public events (private repository events are not accessible)
- Subject to GitHub API rate limits (60 requests per hour for unauthenticated requests)

## License

MIT

## Author

Built as a project to practice working with APIs, handling JSON data, and building CLI applications.
