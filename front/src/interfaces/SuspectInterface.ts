export interface SuspectResult {
    total:    number;
    limit:    number;
    offset:   number;
    suspects: Suspect[];
}

export interface Suspect {
    id:             number;
    phone:          string;
    state:          string;
    identification: string;
    deleted:        boolean;
    updated_at:     Date;
    email:          string;
    name:           string;
    city:           string;
    country:        string;
    status:         string;
    created_at:     Date;
}
