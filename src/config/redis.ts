import {createClient} from "redis";

const redisClient = createClient({
    url: "redis://localhost:6379",
});

redisClient.connect();



redisClient.on("error", (err : unknown) => {
    console.error("Redis error: ", err);
});


redisClient.on("connect", () => {
    console.log("Redis connected successfully");
});


export default redisClient;
