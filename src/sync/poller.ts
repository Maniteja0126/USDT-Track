import { fetchTransferEvents } from "../contracts/usdt";
import { saveEvents } from "../services/event.services";
import { TransferEvent } from "../types/event";

const FETCH_TIMEOUT = 60000; //for RPC calls
const SAVE_TIMEOUT = 30000; //  for database operations

async function timeoutPromise(promise: Promise<any>, ms: number, operation: string): Promise<any> {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
    )
  ]);
}

export async function pollAndStoreEvents() {
  console.log("pollAndStoreEvents() called");
  try {
    console.log("Fetching transfer events...");
    const events = await timeoutPromise(
      fetchTransferEvents(),
      FETCH_TIMEOUT,
      "Fetching events from RPC"
    );

    console.log(`Fetched ${events.length} events`);

    if (!events.length) {
      console.warn("No transfer events found.");
      return;
    }

    const formatted: TransferEvent[] = events.map((e: any) => ({
      from: e.data[0],
      to: e.data[1],
      value: e.data[2],
      tx_hash: e.transaction_hash,
      timestamp: e.block_timestamp ? new Date(e.block_timestamp * 1000) : new Date(),
    }));

    console.log(`Formatted ${formatted.length} transfer events.`);
    console.log("Saving events to database...");
    
    await timeoutPromise(
      saveEvents(formatted),
      SAVE_TIMEOUT,
      "Saving events to database"
    );
    console.log("Events saved successfully");
  } catch (error: any) {
    if (error.message.includes('timed out')) {
      console.error(`${error.message}`);
    } else {
      console.error(" Error during pollAndStoreEvents:", error);
    }
  }
}
