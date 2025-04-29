"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const router = (0, express_1.Router)();
router.get("/", event_controller_1.getPaginationEvents);
router.get("/filter", event_controller_1.getEventsByFilter);
router.get("/:tx_hash", event_controller_1.getEventByHash);
exports.default = router;
