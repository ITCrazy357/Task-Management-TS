import express, { Express } from "express";
import * as database from "./config/database";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainV1Routes from "./api/v1/routes/index.route";
import bodyParser from "body-parser";

dotenv.config();
database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// Middleware đọc JSON
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

mainV1Routes(app);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port} 🚀`);
});
