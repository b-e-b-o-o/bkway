import { Router } from "express";
import type { Request, Response } from "express";
import { stops } from "gtfs/models";
import { getStops } from "gtfs";

import { searchStops } from "../utils/query";

const router = Router()

router.get('/', (req: Request, res: Response) => {
  let filter: Record<string, any> = {};
  // why https://stackoverflow.com/q/17781472
  for (const { name } of stops.schema) {
    if (name in req.query)
      filter[name] = req.query[name];
  }
  res.send(getStops(filter));
})

router.get('/search', async (req: Request, res: Response) => {
  res.send(await searchStops(req.query['q']?.toString() ?? ''))
});

export default router;
