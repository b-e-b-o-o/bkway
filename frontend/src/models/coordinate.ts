import distFrom from 'distance-from';

export class Coordinate {
    readonly latLon: [number, number];

    constructor(latitude: number, longitude: number) {
        this.latLon = [latitude, longitude];
    }

    get lat(): number {
        return this.latLon[0];
    }

    set lat(lat: number) {
        this.latLon[0] = lat;
    }

    get lon(): number {
        return this.latLon[1];
    }

    set lon(lon: number) {
        this.latLon[1] = lon;
    }

    distanceMeters(other: Coordinate): number {
        try {
            return distFrom(this.latLon)
                .to(other.latLon)
                .in('meters');
        }
        catch (e) {
            // idk?
            console.log(other);
            console.log(this);
            return 0;
        }
    }
}
