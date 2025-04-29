"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
redisClient.connect();
redisClient.on("error", (err) => {
    console.error("Redis error: ", err);
});
redisClient.on("connect", () => {
    console.log("Redis connected successfully");
});
exports.default = redisClient;
