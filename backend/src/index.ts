import express, { json } from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import stopsRouter from "./routes/stops.route";
import geojsonRouter from "./routes/geojson.route";
import { } from "./utils/database";

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT ?? 3000;

if (process.env.NODE_ENV?.toLowerCase() === 'development') {
  app.use(cors());
}
else {
  app.use(cors({
    origin: 'https://bee-612.space',
    methods: 'GET'
  }));
}

app.use(json());
app.use('/data', express.static('/usr/data/public/', { index: false }));
app.use('/stops', stopsRouter);
app.use('/geojson', geojsonRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('BKWay API');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
