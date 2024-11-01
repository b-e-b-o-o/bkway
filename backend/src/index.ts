import express, { json } from "express";
import type { Express, Request, Response } from "express";
import { importGtfs, openDb, getAgencies } from "gtfs";
import { SqliteError } from "better-sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import config from './configs/gtfs.config'
import stopsRouter from "./routes/stops.route";
import geojsonRouter from "./routes/geojson.route";
import stopTimesRouter from "./routes/stoptimes.route";

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT ?? 3000;

try {
  openDb(config);
  getAgencies();
  console.log("Loaded database from config");
}
catch (e) {
  if (e instanceof SqliteError) {
    await importGtfs(config);
  }
  else {
    throw e;
  }
};

app.use(json());
app.use(cors());
app.use('/data', express.static('/usr/data/public/', { index: false }));
app.use('/stops', stopsRouter);
app.use('/geojson', geojsonRouter);
app.use('/stoptimes', stopTimesRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('BKWay API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
