import { createContext, useContext } from "react";

import type { MapViewState } from "deck.gl";

export const ViewStateContext = createContext<undefined | {
    initialViewState: MapViewState,
    setInitialViewState: React.Dispatch<React.SetStateAction<MapViewState>>
}>(undefined);

export function useViewStateContext() {
    const viewState = useContext(ViewStateContext);
    if (viewState === undefined)
        throw new Error('useViewStateContext must be used within a ViewStateContext.Provider');
    return viewState;
}
