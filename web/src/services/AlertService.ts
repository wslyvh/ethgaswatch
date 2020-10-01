import { MongoClient, ObjectId } from 'mongodb';
import { AlertsData, RegisteredEmailAddress } from "../types";
import { AppConfig } from "../config/app";
import { GetAverage, GetMode } from '../utils/stats';
require('encoding');
require('mongodb-client-encryption');
const qs = require('querystring');

const db_collection = "alerts"

export async function RegisterMany(alerts: RegisteredEmailAddress[]) { 

    const client = new MongoClient(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
    try { 
        await client.connect();
        const db = client.db(AppConfig.MONGODB_DB);
        const collection = db.collection(db_collection);

        console.log(`Importing ${alerts.length} alerts...`);
        const result = await collection.insertMany(alerts);
        console.log(`${result.insertedCount} alerts inserted!`);
    } 
    catch (ex) { 
        console.log("ERROR insertMany", ex);
    }
    finally {
        await client.close();
    }
}

export async function RegisterUserAlert(email: string, gasprice: string): Promise<string> { 

    const client = new MongoClient(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
    try { 
        await client.connect();
        const db = client.db(AppConfig.MONGODB_DB);
        const collection = db.collection(db_collection);
        const result = await collection.insertOne({ 
            email: email,
            price: Number(gasprice),
            registered: new Date()
        });
        
        return result.insertedId;
    } 
    catch (ex) { 
        console.log("ERROR registering user alert", ex);
    }
    finally {
        await client.close();
    }

    return "";
}

export async function UpdateUserAlert(id: string, fields: any): Promise<boolean> { 

    const client = new MongoClient(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
    try { 
        await client.connect();
        const db = client.db(AppConfig.MONGODB_DB);
        const collection = db.collection(db_collection);
        const result = await collection.updateOne({ _id : new ObjectId(id) }, { $set: fields });
        
        return result.modifiedCount > 0;
    } 
    catch (ex) { 
        console.log("ERROR updating user alert", ex);
    }
    finally {
        await client.close();
    }

    return false;
}

export async function GetUserAlerts(view: "Active" | "Flagged", gasprice: number): Promise<RegisteredEmailAddress[]> { 

    let priceQuery = {};
    if (view === "Active") { 
        priceQuery = { 
            price: { $gte: gasprice },
            confirmed: true,
            emailSent: { $ne: true },
            disabled: { $ne: true },
        } 
    }
    if (view === "Flagged") { 
        priceQuery = { 
            price: { $lte: gasprice },
            confirmed: true,
            emailSent: true,
            disabled: { $ne: true },
        } 
    }

    const client = new MongoClient(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
    try { 
        await client.connect();
        const db = client.db(AppConfig.MONGODB_DB);
        const collection = db.collection(db_collection);
        return await collection.find(priceQuery).toArray();
    } 
    catch (ex) { 
        console.log("ERROR getting user alerts", ex);
    }
    finally {
        await client.close();
    }

    return [];
}


export async function GetUserAlertsData(): Promise<AlertsData | null> { 

    const client = new MongoClient(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
    try { 
        await client.connect();
        const db = client.db(AppConfig.MONGODB_DB);
        const collection = db.collection(db_collection);
        const items = await collection.find().toArray();
        const uniques = items.filter((item: RegisteredEmailAddress, index: number, array: RegisteredEmailAddress[]) => 
            array.findIndex(i => i.email === item.email) === index);
        const values = items.map((i: RegisteredEmailAddress) => i.price);

        return {
            alerts: items.length,
            unique: uniques.length,
            average: Math.round(GetAverage(values)),
            mode: GetMode(values),
        } as AlertsData; 
    } 
    catch (ex) { 
        console.log("ERROR getting user alerts", ex);
    }
    finally {
        await client.close();
    }

    return null;
}

export async function GetLatestUserAlerts(count: number, uniques?: boolean): Promise<RegisteredEmailAddress[]> { 

    const client = new MongoClient(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
    try { 
        await client.connect();
        const db = client.db(AppConfig.MONGODB_DB);
        const collection = db.collection(db_collection);
        let items = await collection.find().sort({ _id: -1 }).limit(count).toArray();
        
        if (uniques) {
            items = items.filter((item: RegisteredEmailAddress, index: number, array: RegisteredEmailAddress[]) => 
                array.findIndex(i => i.email === item.email) === index);
        }

        return items;
    } 
    catch (ex) { 
        console.log("ERROR getting last user alerts", count, ex);
    }
    finally {
        await client.close();
    }

    return [];
}