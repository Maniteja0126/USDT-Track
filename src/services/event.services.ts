import prisma from "../config/db";
import redisClient from "../config/redis";
import { TransferEvent } from "../types/event";

export async function getAllEvents(page : number , limit : number){
    return prisma.event.findMany({
        skip : (page - 1) * limit,
        take : limit,
        orderBy : {timestamp : "desc"}
    });
}


export async function getEventsByAddress(from?: string , to?:string){
    return prisma.event.findMany({
        where : {
            from : from || undefined,
            to : to || undefined
        }
    });
}


export async function getEventByTxHash(tx_hash : string){
    const cached = await redisClient.get(tx_hash);
    if(cached){
        return JSON.parse(cached) as TransferEvent;
    }

    const event = await prisma.event.findFirst({
        where : {
            tx_hash : tx_hash
        }
    });

    if(event){
        await redisClient.setEx(tx_hash  , 3600 , JSON.stringify(event));
    }

    return event;

    
}


export async function saveEvents(events : TransferEvent[]){
    return prisma.event.createMany({
        data : events,
        skipDuplicates : true
    })
}