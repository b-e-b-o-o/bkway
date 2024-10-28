import { getStoptimes, getStops } from "gtfs";
import { Router } from "express";
import type { Request, Response } from "express";

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const query: {
    stops?: string[],
    start_time?: string,
    end_time?: string
  } = {}
  if (typeof req.query.stop_id === 'string')
    query.stops = getStops({
        stop_id: req.query.stop_id
      },
      [ 'stop_id' ],
      [],
      {
        bounding_box_side_m: 150
      }
    ).map(stop => stop.stop_id);
  else
    return res.status(400).send('Missing "stop" parameter');
  if (req.query.from)
    query.start_time = req.query.from.toString();
  if (req.query.to)
    query.end_time = req.query.to.toString();
  res.send(getStoptimes(query));
});

export default router;
