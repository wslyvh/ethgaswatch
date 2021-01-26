import * as dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  NODE_ENV: process.env.NODE_ENV,

  HOST: process.env.REACT_APP_HOST || "http://localhost:3000/",
  AIRTABLE_APIKEY: process.env.REACT_APP_AIRTABLE_APIKEY || "",
  AIRTABLE_BASEID: process.env.REACT_APP_AIRTABLE_BASEID || "",
  ETHERSCAN_APIKEY: process.env.REACT_APP_ETHERSCAN_APIKEY || "",
  GASSTATION_APIKEY: process.env.REACT_APP_GASSTATION_APIKEY || "",
  SENDGRID_APIKEY: process.env.REACT_APP_SENDGRID_APIKEY || "",
  MONGODB_CONNECTIONSTRING: process.env.REACT_APP_MONGODB_CONNECTIONSTRING || "",
  MONGODB_DB: process.env.REACT_APP_MONGODB_DB || "ethgas",
  MAILJET_APIKEY: process.env.REACT_APP_MAILJET_APIKEY || "",
  MAILJET_PASSWORD: process.env.REACT_APP_MAILJET_PASSWORD || "",
};