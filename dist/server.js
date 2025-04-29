"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const poller_1 = require("./sync/poller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
app.use("/events", event_routes_1.default);
(0, poller_1.pollAndStoreEvents)();
setInterval(poller_1.pollAndStoreEvents, 60000);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
