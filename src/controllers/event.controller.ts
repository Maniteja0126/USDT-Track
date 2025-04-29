import {Request , Response } from "express";
import * as service from "../services/event.services";


export async function getPaginationEvents(req : Request , res : Response){
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const events = await service.getAllEvents(page , limit);

    console.log("Events : " , events.length);

    res.json({page , limit , data : events});
}



export async function getEventsByFilter(req : Request , res : Response){
    const {from , to } = req.query;

    const event = await service.getEventsByAddress(from as string , to as string);
    console.log("Events : " , event.length);


    res.json(event);
}


export async function getEventByHash(req : Request , res : Response): Promise<void>{
    const {tx_hash} = req.params;

    const event = await service.getEventByTxHash(tx_hash);
    console.log("Events : " , event);


    if(!event) {
         res.status(404).json({message : "Event not found"});
         return
    }

    res.json(event);
} 