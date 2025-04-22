export interface LeadResult {
    total:    number;
    limit:    number;
    offset:   number;
    leads: Lead[];
}

export interface Lead {
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
