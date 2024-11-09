import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

/** Anything that can be converted to a time using `Time.of` */
type TimeLike = Parameters<typeof Time.of>[0];

export class Time {
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;

    static readonly INFINITY = Object.create(Time.prototype, {
        hours: { value: Number.POSITIVE_INFINITY },
        minutes: { value: Number.POSITIVE_INFINITY },
        seconds: { value: Number.POSITIVE_INFINITY }
    }) as Time;

    constructor(hours: number, minutes: number, seconds: number = 0) {
        let value = Time.value(hours, minutes, seconds);
        this.seconds = value % 60;
        value = Math.floor(value / 60);
        this.minutes = value % 60;
        value = Math.floor(value / 60);
        this.hours = value;
    }

    public static of(time: string | number | Time | Dayjs | Date): Time {
        if (time instanceof Time)
            return time;
        if (time instanceof Date)
            return new Time(time.getHours(), time.getMinutes(), time.getSeconds());
        if (time instanceof dayjs)
            return new Time(time.hour(), time.minute(), time.second());
        if (typeof time === 'number')
            return new Time(0, 0, time);
        if (typeof time === 'string')
            return Time.parse(time);
        throw new Error('Invalid time');
    }

    public static parse(time: string): Time {
        const [hours, minutes, seconds = 0] = time.split(':').map(s => parseInt(s));
        return new Time(hours, minutes, seconds);
    }

    protected static value(hours: number, minutes: number, seconds: number): number {
        return (hours * 60 + minutes) * 60 + seconds;
    }

    public valueOf(): number {
        return Time.value(this.hours, this.minutes, this.seconds);
    }

    public toString({ seconds = true } = {}): string {
        return `${this.hours}:${this.minutes}` + (seconds ? `:${this.seconds}` : '');
    }

    public before(other: TimeLike): boolean {
        other = Time.of(other);
        if (this.hours < other.hours) return true;
        if (this.hours > other.hours) return false;
        if (this.minutes < other.minutes) return true;
        if (this.minutes > other.minutes) return false;
        return this.seconds < other.seconds;
    }

    public equals(other: TimeLike): boolean {
        other = Time.of(other);
        return this.hours === other.hours && this.minutes === other.minutes && this.seconds === other.seconds;
    }

    public after(other: TimeLike): boolean {
        other = Time.of(other);
        if (this.hours > other.hours) return true;
        if (this.hours < other.hours) return false;
        if (this.minutes > other.minutes) return true;
        if (this.minutes < other.minutes) return false;
        return this.seconds > other.seconds;
    }

    public plus(time: TimeLike): Time {
        time = Time.of(time);
        return new Time(this.hours + time.hours, this.minutes + time.minutes, this.seconds + time.seconds);
    }

    public minus(time: TimeLike): Time {
        time = Time.of(time);
        return new Time(this.hours - time.hours, this.minutes - time.minutes, this.seconds - time.seconds);
    }
}
