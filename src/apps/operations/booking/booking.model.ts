import { StateBooking } from "src/helpers/enums/state.enum";

export interface BookingModel {
    id: string;
    numero_reel: string;
    numero_change: string;
    state: StateBooking;
    created: Date;
    created_by: string;
    updated: Date;
    updated_by: string;
}