import type { Color as DeckglColor } from "deck.gl";
import type { Coordinate } from "src/models/coordinate";

export interface Path {
    name: string;
    points: Coordinate[];
    color: DeckglColor;
}
