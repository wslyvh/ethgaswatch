import { MongoClient, ObjectId } from 'mongodb';
import { RegisteredEmailAddress } from "../types";
import { AppConfig } from "../config/app";
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
        const result = await collection.insertOne({ email: email, price: Number(gasprice) });
        
        return result.insertedId;
    } 
    catch (ex) { 
        console.log("ERROR insertMany", ex);
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
        console.log("ERROR insertMany", ex);
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