import { Logger, LeveledLogMethod } from 'winston';

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
    participates: number
}

interface Donation {
    rec_id?: number,
    walker_id: number,
    donation_each_km: number,
    donation_amout_recived: number,
    needs_donation_receipt: number,
    donation_recived: number,
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
    class: string,
    walker: WalkerRender[],
    sum: number,
    minsum?: number
}

type SQL = string;