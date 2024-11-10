import { createContext, useContext } from 'react';
import type { Pathfinding } from '../models/pathfinding/pathfinding';
import type { Path } from '../types/mapdata';

export const PathfindingContext = createContext<undefined | {
    pathfinding: Pathfinding | undefined,
    setPathfinding: React.Dispatch<React.SetStateAction<Pathfinding | undefined>>,
    incompletePaths: Path[],
    setIncompletePaths: React.Dispatch<React.SetStateAction<Path[]>>,
    completePath: Path[] | undefined,
    setCompletePath: React.Dispatch<React.SetStateAction<Path[] | undefined>>
}>(undefined); 

export function usePathfindingContext() {
    const routePlan = useContext(PathfindingContext);
    if (routePlan === undefined)
        throw new Error('useRoutePlanContext must be used within a RoutePlanContext.Provider');
    return routePlan;
}
