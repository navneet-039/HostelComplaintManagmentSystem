import dotenv from "dotenv";
dotenv.config();

import { connect } from "./config/mongodb.js";

import "./models/index.js";

import { startEmailWorker } from "./workers/email-worker.js";

await connect();
startEmailWorker();


