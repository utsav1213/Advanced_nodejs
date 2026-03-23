import https from 'https';

function fetchGitHubActivity(username) {
    return new Promise((resolve, reject) => {
        const options={
            hostname: "api.github.com",
            path: "/users/${username}/events",
            method: "GET",
            headers: {
                "User-Agent":"github-activity-cli"
            }
        }
        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            })
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const events = JSON.parse(data);
                        resolve();
                    }
                    catch (error) {
                        reject(new Error("Failed to parse JSON response"));
                    }
                        
                }
                else if (res.statusCode === 404) {
                    reject(new Error(`User ${username} not found`))
                }
                else if (res.statusCode === 403) {
                    reject(new Error("API rate limit exceeded. Pleasex try again later."))
                }
                else {
                    reject(
                        new Error(
                            `API request failed with status code: ${res.statusCode}`,
                        ),
                    );
                }
            })

        });
        req.on("error", (error) => {
            reject(new Error(`Network error: ${error.message}`));
        });
        req.end();
    }
    )

}

function formatEvent(even) {
    const repo = even.repo.name;
    const type = event.type;
    let action;
    switch (type) {
        case "PushEvent":
            const commitCount=
    }
}