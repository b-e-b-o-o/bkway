import { getStoptimes, getStops } from "gtfs";
import { Router } from "express";
import type { Request, Response } from "express";

const router = Router()

router.get('/', (req: Request, res: Response) => {
  const query: {
    stop_id?: string[],
    start_time?: string,
    end_time?: string
  } = {}
  if (typeof req.query.stop_id === 'string') {
    const stop = getStops({ stop_id: req.query.stop_id }, ['stop_lat', 'stop_lon'], [], { bounding_box_side_m: 150 })[0];
    query.stop_id = getStops({
        stop_lat: stop.stop_lat,
        stop_lon: stop.stop_lon
      },
      ['stop_id'],
      [],
      {
        bounding_box_side_m: 150
      }
    ).map(stop => stop.stop_id);
  }
  else {
    return res.status(400).send('Missing "stop" parameter');
  }
  if (req.query.from)
    query.start_time = req.query.from.toString();
  if (req.query.to)
    query.end_time = req.query.to.toString();
  const result = getStoptimes(query, ['trip_id', 'departure_time', 'departure_timestamp', 'stop_id', 'stop_sequence', 'stop_headsign', 'shape_dist_traveled']);
  res.json({ result });
  res.end();
});

export default router;
