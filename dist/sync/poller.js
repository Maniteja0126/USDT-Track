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
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollAndStoreEvents = void 0;
const usdt_1 = require("../contracts/usdt");
const event_services_1 = require("../services/event.services");
function pollAndStoreEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        const events = yield (0, usdt_1.fetchTransferEvents)();
        const formatted = events.map((e) => ({
            from: e.data[0],
            to: e.data[1],
            value: e.data[2],
            tx_hash: e.transaction_hash,
            timestamp: new Date(e.block_timestamp * 1000)
        }));
        yield (0, event_services_1.saveEvents)(formatted);
    });
}
exports.pollAndStoreEvents = pollAndStoreEvents;
