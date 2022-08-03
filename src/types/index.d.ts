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

declare global {
    namespace Express {
        interface User {
            name: string,
            uuid: string,
            id: number | null
        }
    }
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
    pdf: boolean,
    minsum?: number
}

type SQL = string;

// socket io

interface ServerToClientEvents {
    walker_added: (w: Walker) => void;
    walker_deleted: (walker_id: number) => void;
    walker_updated: (w: { w: Walker, walker_id: number }) => void;
    post_progress_done: (ref: string) => void;
    post_progress_progress: (url_index: number) => void;
    user_count_changed: (nr: number) => void;
    walker_lock: (walker_id: number) => void;
    walker_unlock: (walker_id: number) => void;
}

interface ClientToServerEvents {
    connection: () => void;
    disconnect: () => void;
    heartbeat: () => void;
    walker_lock: (walker_id: number) => void;
    walker_unlock: (walker_id: number) => void;
}

// interface InterServerEvents {}

// interface SocketData {}