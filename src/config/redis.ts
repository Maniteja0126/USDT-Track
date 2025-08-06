import {createClient} from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.connect();



redisClient.on("error", (err : unknown) => {
    console.error("Redis error: ", err);
});


redisClient.on("connect", () => {
    console.log("Redis connected successfully");
});


export default redisClient;


