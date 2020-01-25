import { Logger, LeveledLogMethod } from 'winston';

interface WasLogger extends Logger {
    app: LeveledLogMethod;
}

interface User {
    name: string,
    uuid: string,
    id: number | null
}

interface WalkerRow {
    rec_id: number,
    class: string,
    distance_m: number
    lastname?: string,
    firstname?: string
}

interface DonationRow {
    rec_id: number,
    walker_id: number,
    donation_each_km: number,
    donation_amout_recived: number,
    needs_donation_receipt: number,
    donation_recived: number,
    zipcode: number,
    city?: string,
    adrdess?: string,
    firstname?: string,
    lastname?: string
}

interface LoginRow {
    rec_id: number,
    uuid: string,
    name: string,
    stamp: string
}