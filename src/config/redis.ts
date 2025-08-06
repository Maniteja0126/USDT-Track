import {createClient} from "redis";

const redisClient = createClient({
    url: "REDIS_URL=redis://127.0.0.1:6379",
});

redisClient.connect();



redisClient.on("error", (err : unknown) => {
    console.error("Redis error: ", err);
});


redisClient.on("connect", () => {
    console.log("Redis connected successfully");
});


export default redisClient;

