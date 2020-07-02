import * as dotenv from "dotenv";

dotenv.config();

export const AppConfig = {
  NODE_ENV: process.env.NODE_ENV,
  EXECUTE_MODE: Boolean(process.env.EXECUTE_MODE) || true,

  ETHERSCAN_APIKEY: process.env.ETHERSCAN_APIKEY,
};