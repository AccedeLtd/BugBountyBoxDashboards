export interface AllProjectsResponseJson {
    id:               number;
    title:            string;
    description:      string;
    bounty:           number;
    postedAt:         Date;
    closedAt:         Date;
    projectStatus:    number;
    domains:          RequirementLevel[];
    customer:         Customer;
    requirementLevel: RequirementLevel;
    testType:         RequirementLevel;
    reviews:          Review[];
}

export interface Customer {
    id:           number;
    email:        string;
    fullName:     string;
    userName:     string;
    country:      string;
    businessName: string;
    userId:       string;
    logoUrl:      string;
    phoneNumber:  string;
    walletId:     number;
}

export interface RequirementLevel {
    id:   number;
    name: string;
    type:string;
}

export interface Review {
    comment:  string;
    date:     Date;
    userName: string;
}
