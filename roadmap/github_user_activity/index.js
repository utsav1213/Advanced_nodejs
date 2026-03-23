#!/usr/bin/env node

import https from "https";

/**
 * Fetches GitHub user events from the GitHub API
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} Array of event objects
 */
function fetchGitHubActivity(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: `/users/${username}/events`, // Ensure valid endpoint: /users/:username/events
      method: "GET",
      headers: {
        "User-Agent": "github-activity-cli",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      // Collect data chunks
      res.on("data", (chunk) => {
        data += chunk;
      });

      // Process complete response
      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const events = JSON.parse(data);
            resolve(events);
          } catch (error) {
            reject(new Error("Failed to parse JSON response"));
          }
        } else if (res.statusCode === 404) {
          reject(new Error(`User '${username}' not found`));
        } else if (res.statusCode === 403) {
          reject(new Error("API rate limit exceeded. Please try again later."));
        } else {
          reject(
            new Error(`API request failed with status code: ${res.statusCode}`),
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Formats an event into a readable string
 * @param {Object} event - GitHub event object
 * @returns {string} Formatted event string
 */
function formatEvent(event) {
  const repo = event.repo.name;
  const type = event.type;
  let action;

  switch (type) {
    case "PushEvent":
      const commitCount =
        event.payload.size ?? event.payload.commits?.length ?? 0;
      return `- Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${repo}`;

    case "IssuesEvent":
      action = event.payload.action;
      return `- ${action.charAt(0).toUpperCase() + action.slice(1)} an issue in ${repo}`;

    case "WatchEvent":
      return `- Starred ${repo}`;

    case "ForkEvent":
      return `- Forked ${repo}`;

    case "CreateEvent":
      const refType = event.payload.ref_type;
      if (refType === "repository") {
        return `- Created repository ${repo}`;
      } else if (refType === "branch" || refType === "tag") {
        return `- Created ${refType} '${event.payload.ref}' in ${repo}`;
      }
      return `- Created ${refType} in ${repo}`;

    case "DeleteEvent":
      const delRefType = event.payload.ref_type;
      return `- Deleted ${delRefType} '${event.payload.ref}' in ${repo}`;

    case "PullRequestEvent":
      const prAction = event.payload.action;
      return `- ${prAction.charAt(0).toUpperCase() + prAction.slice(1)} a pull request in ${repo}`;

    case "PullRequestReviewEvent":
      return `- Reviewed a pull request in ${repo}`;

    case "PullRequestReviewCommentEvent":
      return `- Commented on a pull request in ${repo}`;

    case "IssueCommentEvent":
      return `- Commented on an issue in ${repo}`;

    case "CommitCommentEvent":
      return `- Commented on a commit in ${repo}`;

    case "ReleaseEvent":
      return `- Published a release in ${repo}`;

    case "MemberEvent":
      return `- Added a collaborator to ${repo}`;

    case "PublicEvent":
      return `- Made ${repo} public`;

    case "GollumEvent":
      return `- Updated wiki pages in ${repo}`;

    default:
      return `- ${type.replace("Event", "")} in ${repo}`;
  }
}

/**
 * Displays GitHub user activity
 * @param {Array} events - Array of GitHub event objects
 */
function displayActivity(events) {
  if (!Array.isArray(events) || events.length === 0) {
    console.log("No recent activity found.");
    return;
  }

  console.log("\nRecent Activity:");
  console.log("================");
  events.forEach((event) => {
    try {
      console.log(formatEvent(event));
    } catch (err) {
      console.log(`- Unknown event: ${event.type}`);
    }
  });
  console.log(`\nTotal events: ${events.length}`);
}

/**
 * Main function
 */
async function main() {
  // Get username from command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Error: Please provide a GitHub username");
    console.log("Usage: github-activity <username>");
    process.exit(1);
  }

  const username = args[0];

  console.log(`Fetching activity for GitHub user: ${username}...`);

  try {
    const events = await fetchGitHubActivity(username);
    displayActivity(events);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the CLI
main();
