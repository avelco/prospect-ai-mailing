import { Suspect } from "./SuspectInterface";

export interface ParticipantResult {
    total:        number;
    limit:        number;
    offset:       number;
    pages:        number;
    current_page: number;
    participants: Participant[];
}

export interface Participant {
    suspect_id:  number;
    product_id:  number;
    campaign_id: number;
    status:      string;
    id:          number;
    created_at:  Date;
    updated_at:  Date;
    suspect:     Suspect;
    has_email:    boolean;
}
