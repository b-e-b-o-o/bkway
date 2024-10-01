import express from "express";
import type { Express, Request, Response } from "express";
import { importGtfs, getStops, openDb, getAgencies, getShapesAsGeoJSON } from "gtfs";
import { SqliteError } from "better-sqlite3";
import dotenv from "dotenv";
import config from './configs/gtfs.config'
import { stops } from "gtfs/models";
import { searchStops } from "./routes/stops";

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT ?? 3000;

// access control middleware
app.use(function (_req: Request, res: Response, next: VoidFunction) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET"); // read-only api
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

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
}

app.get('/stops.geo.json', async (req: Request, res: Response) => {
  res.sendFile('/usr/data/stops.geo.json');
});

app.get('/shapes.geo.json', async (req: Request, res: Response) => {
  res.sendFile('/usr/data/shapes.geo.json');
});

app.get('/stops', (req: Request, res: Response) => {
  let filter: Record<string, any> = {};
  // why https://stackoverflow.com/q/17781472
  for (const { name } of stops.schema) {
    if (name in req.query)
      filter[name] = req.query[name];
  }
  res.send(getStops(filter));
});

app.get('/search_stops', async (req: Request, res: Response) => {
  res.send(await searchStops(req.query['q']?.toString() ?? ''))
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! :)');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
