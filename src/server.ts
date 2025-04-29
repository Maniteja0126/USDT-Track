import express from 'express';

import eventRoutes from "./routes/event.routes"
import { pollAndStoreEvents } from './sync/poller';




const app  = express();
app.use(express.json());




const PORT = process.env.PORT || 3000;

app.use("/events" , eventRoutes);



let isPolling = false;

async function startPolling() {
  if (isPolling) {
    console.log("Previous polling cycle still running, skipping this cycle");
    return;
  }

  const now = new Date().toISOString();
  console.log("-----------------------------------");
  console.log(`Polling cycle started at ${now}`);
  
  try {
    isPolling = true;
    console.log("Fetching new events...");
    await pollAndStoreEvents();
    console.log("Polling cycle completed successfully");
  } catch (err) {
    console.error("Polling failed:", err);
  } finally {
    isPolling = false;
    console.log("Scheduling next poll in 60 seconds");
    console.log("-----------------------------------");
    
    setTimeout(startPolling, 60 * 1000);
  }
}

const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await pollAndStoreEvents();
    console.log("Initial poll complete.");
  } catch (err) {
    console.error("Polling failed on server start:", err);
  }

  startPolling();
});




