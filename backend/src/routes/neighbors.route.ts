import { Router } from "express";
import type { Request, Response } from "express";
import { getNeighbors, getWalkingNeighbors, searchStops } from "../utils/query";

const router = Router()

router.get('/:stopId/by-walking', async (req: Request, res: Response) => {
  const { stopId } = req.params;
  res.send(await getWalkingNeighbors(stopId));
});

router.get('/:stopId/by-transit', async (req: Request, res: Response) => {
  const { stopId } = req.params;
  const { time } = req.query;
  if (typeof time !== 'string')
    return res.status(400).send('`time` parameter must be formatted as hh:mm:ss');
  res.send(await getNeighbors(stopId, time));
});

export default router;
