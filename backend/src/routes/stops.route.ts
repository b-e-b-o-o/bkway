import { Router } from "express";
import type { Request, Response } from "express";
import { stops } from "gtfs/models";
import { getStops } from "gtfs";

import { getNeighbors, getWalkingNeighbors, searchStops } from "../utils/query";

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

router.get('/:stopId/nearby', async (req: Request, res: Response) => {
  const { stopId } = req.params;
  res.send(await getWalkingNeighbors(stopId));
});

router.get('/:stopId/neighbors', async (req: Request, res: Response) => {
  const { stopId } = req.params;
  const { time } = req.query;
  if (typeof time !== 'string')
    return res.status(400).send('`time` parameter must be formatted as hh:mm:ss');
  res.send(await getNeighbors(stopId, time));
});

router.get('/search', async (req: Request, res: Response) => {
  res.send(await searchStops(req.query['q']?.toString() ?? ''))
});

export default router;
