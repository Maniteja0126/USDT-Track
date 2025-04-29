import { Router } from "express";


import {
    getPaginationEvents,
    getEventsByFilter,
    getEventByHash,
} from "../controllers/event.controller";


const router = Router();



router.get("/"  , getPaginationEvents);
router.get("/filter" , getEventsByFilter);
router.get("/:tx_hash" , getEventByHash);


export default router;


