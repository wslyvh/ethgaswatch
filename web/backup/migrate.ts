import { GetAllUsersIterative } from "./services/AirtableService";
import { RegisterMany } from "./services/AlertService";
import { RegisteredEmailAddress } from "./types";

console.log("TESTING MIGRATE..")
Run();

export async function Run() {
    const users = await GetAllUsersIterative(new Array<RegisteredEmailAddress>());
    console.log("TOTAL USERS", users.length);

    await RegisterMany(users);
    console.log("ALL DONE!")
}
