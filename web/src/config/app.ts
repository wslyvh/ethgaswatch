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
  FAUNADB_KEY: process.env.REACT_APP_FAUNADB_KEY || "",
  FAUNADB_SECRET: process.env.REACT_APP_FAUNADB_SECRET || ""
};