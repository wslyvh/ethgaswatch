import * as dotenv from "dotenv";

dotenv.config();

console.log("configure dotenv")
export const AppConfig = {
  NODE_ENV: process.env.NODE_ENV,

  GASSTATION_APIKEY: process.env.REACT_APP_GASSTATION_APIKEY || "",
  ETHERSCAN_APIKEY: process.env.REACT_APP_ETHERSCAN_APIKEY || "",
};