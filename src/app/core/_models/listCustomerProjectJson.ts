export interface ListCustomerProjectJson {
    id:               number;
    title:            string;
    description:      string;
    bounty:           number;
    postedAt:         null;
    closedAt:         null;
    projectStatus:    number;
    domains:          RequirementLevel[];
    customer:         Customer;
    requirementLevel?: RequirementLevel;
    testType:         RequirementLevel;
    reviews:          Reviews[];
}

export interface Customer {    
    id:              number;
    email:           string;
    fullName:        string;
    userName:        string;
    country:         string;
    businessName:    string;
    userId:          string;
    logoUrl:         string;
    phoneNumber:     string;
    assets:          number; 
    walletId:        number;
    isActive:        boolean;
    activationNotes: ActivationNote[];
}

export interface ActivationNote {
    title:       string;
    userId:      string;
    reason:      string;
    adminUserId: string;
    adminName:   string;
    date:        Date;
}

export interface RequirementLevel {
    id:   number;
    name: string;
    type:string;
}

export interface Reviews {
    comment:  string;
    date:     Date;
    userName?: string;
}
