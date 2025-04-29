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
exports.fetchTransferEvents = void 0;
const starknet_1 = require("starknet");
const provider = new starknet_1.RpcProvider({ nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_6', // Use a reliable public/mainnet RPC endpoint
});
const USDT_ADDRESS = "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";
function fetchTransferEvents() {
    return __awaiter(this, arguments, void 0, function* (fromBlock = 0, toBlock = 'latest') {
        const transferKey = starknet_1.num.toHex(starknet_1.hash.starknetKeccak('Transfer'));
        console.log("Encoded key : ", transferKey);
        const events = [];
        let token;
        do {
            const res = yield provider.getEvents({
                address: USDT_ADDRESS,
                keys: [[transferKey]],
                from_block: { block_number: fromBlock },
                to_block: toBlock === 'latest' ? 'latest' : { block_number: toBlock },
                chunk_size: 100,
                continuation_token: token,
            });
            events.push(...res.events);
            token = res.continuation_token;
        } while (token);
        console.log("Events :", events);
        return events;
    });
}
exports.fetchTransferEvents = fetchTransferEvents;
