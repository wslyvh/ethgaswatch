import { MongoClient, ObjectId } from 'mongodb';
import { AlertsChartData, AlertsData, RegisteredEmailAddress } from "../types";
import { AppConfig } from "../config/app";
import { GetAverage, GetMode } from '../utils/stats';
import moment from 'moment';
require('encoding');
require('mongodb-client-encryption');
const qs = require('querystring');

const db_collection = "alerts"
let dbClient: MongoClient | null = null;

export async function Connect(): Promise<MongoClient> {
    if (!dbClient) {
        dbClient = await MongoClient.connect(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
        console.log("alerts Connected..");
    }

    return dbClient;
}

export async function RegisterMany(alerts: RegisteredEmailAddress[]) { 

    try { 
        const collection = await getDatabaseCollection();

        console.log(`Importing ${alerts.length} alerts...`);
        const result = await collection.insertMany(alerts);
        console.log(`${result.insertedCount} alerts inserted!`);
    } 
    catch (ex) { 
        console.log("ERROR insertMany", ex);
    }
}

export async function RegisterUserAlert(email: string, gasprice: string): Promise<string> { 

    try { 
        const collection = await getDatabaseCollection();
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

    return "";
}

export async function UpdateUserAlert(id: string, fields: any): Promise<boolean> { 

    try { 
        const collection = await getDatabaseCollection();
        const result = await collection.updateOne({ _id : new ObjectId(id) }, { $set: fields });
        
        return result.modifiedCount > 0;
    } 
    catch (ex) { 
        console.log("ERROR updating user alert", ex);
    }

    return false;
}

export async function UpdateMultipleUserAlerts(addresses: RegisteredEmailAddress[], fields: any): Promise<boolean> { 

    try { 
        const collection = await getDatabaseCollection();
        const ids = addresses.map(i => new ObjectId(i._id));
        const result = await collection.updateMany(
            { _id : { $in: ids } },
            { $set: fields });
        
        console.log("Update results", addresses.length === result.modifiedCount, addresses.length, result.modifiedCount)
        return result.modifiedCount > 0;
    } 
    catch (ex) { 
        console.log("ERROR updating user alert", ex);
    }

    return false;
}
export async function GetUserAlerts(view: "Active" | "Flagged", gasprice: number): Promise<RegisteredEmailAddress[]> { 

    let priceQuery = {};
    if (view === "Active") { 
        priceQuery = { 
            price: { $gt: gasprice },
            confirmed: true,
            emailSent: { $ne: true },
            disabled: { $ne: true },
        } 
    }
    if (view === "Flagged") { 
        priceQuery = { 
            price: { $lt: gasprice },
            confirmed: true,
            emailSent: true,
            disabled: { $ne: true },
        } 
    }

    try { 
        const collection = await getDatabaseCollection();
        return await collection.find(priceQuery).toArray();
    } 
    catch (ex) { 
        console.log("ERROR getting user alerts", ex);
    }

    return [];
}

export async function ExportUserAlerts(): Promise<Array<string>> { 

    try { 
        const collection = await getDatabaseCollection();
        const items = await collection.find().toArray();
        const uniques = items.filter((item: RegisteredEmailAddress, index: number, array: RegisteredEmailAddress[]) => 
            array.findIndex(i => i.email === item.email) === index);
        return uniques.map((i: RegisteredEmailAddress) => i.email);
    } 
    catch (ex) { 
        console.log("ERROR getting user alerts", ex);
    }

    return [];
}

export async function GetUserAlertsData(): Promise<AlertsData | null> { 

    try { 
        const collection = await getDatabaseCollection();
        const all = await collection.countDocuments()
        const uniques = await collection.distinct("email")
        console.log('Unique addresses', uniques.length)

        const stats = await collection.aggregate([
            { "$match": { 
                "confirmed": true,
                "price": { $lte: 10000 }
            }},
            { "$group": {
                _id: null,
                count: { $sum: 1 },
                min: { $min: "$price" },
                max: { $max: "$price" },
                avg: { $avg: "$price" }
              }
            }
        ]).toArray();

        return {
            alerts: all,
            unique: stats[0].count,
            average: Math.round(stats[0].avg),
            mode: 0 //GetMode(values),
        } as AlertsData; 
    } 
    catch (ex) { 
        console.log("ERROR getting user alerts", ex);
    }

    return null;
}

export async function GetLatestUserAlerts(count: number, uniques?: boolean): Promise<RegisteredEmailAddress[]> { 

    try { 
        const collection = await getDatabaseCollection();
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

    return [];
}

export async function GetDailyUserAlertsRegistrations(days: number): Promise<any> { 

    try {
        const collection = await getDatabaseCollection();
        const since = moment().subtract(days, "days").valueOf();

        const items = await collection.aggregate([
            { $match: { "registered": { $gte: since } } },
            { $project: {
                  year: { $year: "$registered" },
                  month: { $month: "$registered" },
                  dayOfMonth: { $dayOfMonth: "$registered" }
            }},
            { $group: {
                _id: {
                    year: '$year',
                    month: '$month',
                    dayOfMonth: '$dayOfMonth'
                },
                count: {
                    $sum: 1
                }
            }}
        ]).toArray();
        
        const results = {
            labels: Array<string>(),
            registrations: Array<number>(),
        } as AlertsChartData;

        items.forEach((i: any) => {
            const mt = moment(`${i._id.year} ${i._id.month} ${i._id.dayOfMonth}`, "YYYY MM DD");
            results.labels.push(mt.format("ll"));
            results.registrations.push(i.count);
        });
        
        return results;
    }
    catch (ex) { 
        console.log("ERROR GetDailyUserAlertsRegistrations", ex);
    }

    return [];
}

async function getDatabaseCollection(): Promise<any> { 
    const client = await Connect();
    const db = client.db(AppConfig.MONGODB_DB);
    return db.collection(db_collection); 
}