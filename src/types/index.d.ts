import { Logger, LeveledLogMethod } from 'winston';
import { Course } from './../includes/helper';

interface WasLogger extends Logger {
    app: LeveledLogMethod;
}

interface User {
    name: string,
    uuid: string,
    id: number | null
}

interface Walker {
    rec_id?: number,
    class: string,
    distance_m: number
    lastname: string,
    firstname: string,
    participates: number,
    course?: string | Course | null
}

interface Donation {
    rec_id?: number,
    walker_id: number,
    donation_each_km: number,
    donation_amount_received: number,
    needs_donation_receipt: number,
    donation_received: number,
    zipcode?: number,
    city?: string,
    address?: string,
    firstname: string,
    lastname: string
}

interface Login {
    rec_id?: number,
    uuid: string,
    name: string,
    stamp: string
}

interface WalkerTransfer {
    walker: Walker, 
    donations: Donation[]
}

interface DonationRender {
    rec_id?: number,
    donation_each_km: number,
    firstname: string,
    lastname: string,
    sum: number,
    minsum?: number,
    getName?: (this: this) => string
}

interface WalkerRender extends Walker {
    donations: DonationRender[],
    sum: number,
    minsum?: number,
    getName?: (this: this) => string
}

interface ClassRender {
    className: string,
    walker: WalkerRender[],
    sum: number,
    minsum?: number
}

type SQL = string;