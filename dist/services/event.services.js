"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEvents = exports.getEventByTxHash = exports.getEventsByAddress = exports.getAllEvents = void 0;
const db_1 = __importDefault(require("../config/db"));
const redis_1 = __importDefault(require("../config/redis"));
function getAllEvents(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.event.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { timestamp: "desc" }
        });
    });
}
exports.getAllEvents = getAllEvents;
function getEventsByAddress(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.event.findMany({
            where: {
                from: from || undefined,
                to: to || undefined
            }
        });
    });
}
exports.getEventsByAddress = getEventsByAddress;
function getEventByTxHash(tx_hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const cached = yield redis_1.default.get(tx_hash);
        if (cached) {
            return JSON.parse(cached);
        }
        const event = yield db_1.default.event.findFirst({
            where: {
                tx_hash: tx_hash
            }
        });
        if (event) {
            yield redis_1.default.setEx(tx_hash, 3600, JSON.stringify(event));
        }
        return event;
    });
}
exports.getEventByTxHash = getEventByTxHash;
function saveEvents(events) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.default.event.createMany({
            data: events,
            skipDuplicates: true
        });
    });
}
exports.saveEvents = saveEvents;
