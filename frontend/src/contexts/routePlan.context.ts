import { createContext, useContext } from 'react';
import type { Dayjs } from 'dayjs';
import type { Stop } from '../types/Stop';


export const RoutePlanContext = createContext<undefined | {
    startStop: Stop | undefined,
    setStartStop: React.Dispatch<React.SetStateAction<Stop | undefined>>,
    endStop: Stop | undefined,
    setEndStop: React.Dispatch<React.SetStateAction<Stop | undefined>>,
    startTime: Dayjs
    setStartTime?: (time: Dayjs) => void
}>(undefined); 

export function useRoutePlanContext() {
    const routePlan = useContext(RoutePlanContext);
    if (routePlan === undefined)
        throw new Error('useRoutePlanContext must be used within a RoutePlanContext.Provider');
    return routePlan;
}
