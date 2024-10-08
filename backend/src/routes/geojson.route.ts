import { Router } from "express";
import { getShapesAsGeoJSON, getStopsAsGeoJSON } from "gtfs";

import type { Request, Response } from "express";

const router = Router();

router.get("/stops", (req: Request, res: Response) => {
    res.json(getStopsAsGeoJSON());
});

router.get("/shapes", (req: Request, res: Response) => {
    res.json(getShapesAsGeoJSON());
});

export default router;
