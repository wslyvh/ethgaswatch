import * as dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  NODE_ENV: process.env.NODE_ENV,

  GASSTATION_APIKEY: process.env.REACT_APP_GASSTATION_APIKEY || "",
  ETHERSCAN_APIKEY: process.env.REACT_APP_ETHERSCAN_APIKEY || "",
  AIRTABLE_APIKEY: process.env.REACT_APP_AIRTABLE_APIKEY || "",
  AIRTABLE_BASEID: process.env.REACT_APP_AIRTABLE_BASEID || ""
};