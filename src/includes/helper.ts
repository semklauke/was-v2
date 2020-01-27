import { Course, WalkerRender, DonationRender } from './../types';

export function round(x: number) : number {
    return Math.round((x + Number.EPSILON) * 100) / 100;
}

export function courseToString(c: Course | string) : string {
    switch (c) {
        case Course.DE:
        case "DE":
            return "Deustch"
            break;
        case Course.EN:
        case "EN":
            return "Englisch"
            break;
        case Course.MA:
        case "ME":
            return "Mathe";
            break;
        case Course.PA:
        case "PA":
            return "Pädagogik"
            break;
        default:
            return ""
            break;
    }
}

export function getNameFunction(this: WalkerRender | DonationRender) : string {
    return this.firstname + " " + this.lastname;
}