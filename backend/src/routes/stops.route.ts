import { Router } from "express";
import type { Request, Response } from "express";
import { stops } from "gtfs/models";
import { getStops } from "gtfs";

import { getNeighbors, getWalkingNeighbors, searchStops } from "../utils/query";

const router = Router()

router.get('/:stopId/nearby', async (req: Request, res: Response) => {
  const { stopId } = req.params;
  const { distance } = req.query;
  const distanceM = Number.parseInt(distance?.toString() ?? 'NaN', 10);
  if (isNaN(distanceM) || distanceM < 0)
      return res.status(400).json({ message: '`distance` must be a valid non-negative number!' })
  const result = await getWalkingNeighbors(stopId, distanceM);
  if (result === undefined)
    return res.status(404).json({ message: 'Stop not found' });
  res.json(result);
});

router.get('/:stopId/neighbors', async (req: Request, res: Response) => {
  const { stopId } = req.params;
  const { time } = req.query;
  if (typeof time !== 'string' || time.match(/^\d\d:\d\d(:\d\d)?$/g) === null)
    return res.status(400).json({ message: '`time` parameter must be formatted as hh:mm:ss'});
  const result = await getNeighbors(stopId, time);
  if (result === undefined)
    return res.status(404).json({ message: 'Stop not found' });
  res.json(result);
});

router.get('/search', async (req: Request, res: Response) => {
  res.send(await searchStops(req.query['q']?.toString() ?? ''))
});

export default router;
