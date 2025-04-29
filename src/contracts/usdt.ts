import { RpcProvider, hash, num } from 'starknet';

const provider = new RpcProvider({   nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_6', 
});

const USDT_ADDRESS = "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";


// https://starknetjs.com/docs/guides/events/

export async function fetchTransferEvents() {
  console.log("Fetching transfer events...");
  const transferKey = num.toHex(hash.starknetKeccak('Transfer'));
  console.log("Encoded key:", transferKey);

  try {
    const latestBlock = await provider.getBlock('latest');
    const latestBlockNumber = latestBlock.block_number;
    console.log("Latest block number:", latestBlockNumber);

    const fromBlock = Math.max(0, latestBlockNumber - 100);
    console.log(`Querying blocks from ${fromBlock} to ${latestBlockNumber}`);

    const events: any[] = [];
    let token: string | undefined;

    do {
      try {
        const res = await provider.getEvents({
          address: USDT_ADDRESS,
          keys: [[transferKey]],
          from_block: { block_number: fromBlock },
          to_block: 'latest',
          chunk_size: 20, 
          continuation_token: token,
        });

        if (res.events && Array.isArray(res.events)) {
          events.push(...res.events);
          console.log(`Fetched ${res.events.length} events in this chunk`);
        }

        token = res.continuation_token;
      } catch (error) {
        console.error("Error fetching events chunk:", error);
        break; 
      }
    } while (token);

    console.log(`Total events fetched: ${events.length}`);
    return events;
  } catch (error) {
    console.error("Error in fetchTransferEvents:", error);
    return []; 
  }
}