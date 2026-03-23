const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

let isConnected = false;

const connectRedis = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log("Connected to Redis");
  }
  return client;
};

module.exports = { client, connectRedis };
