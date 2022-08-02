export interface BugReviewJsonList {
    id:               number;
    projectDomainId:  number;
    projectBounty:    number;
    projectTitle?:     string;
    domainName:       string;
    hackerRating:     number;
    hacker:           Hacker;
    dateOfSubmission: Date;
    modifiedAt:       Date;
    title:            string;
    description:      string;
    impact:           string;
    status:           number;
    severity:         number;
    vulnerability:    Vulnerability;
    reviews:          BugReviews[];
}

export interface BugReviews {
    bugReportId?: number;
    comment:     string;
    date:        Date;
    adminId?:     number;
    username?:    string;
}

export interface Hacker {
    id:                number;
    email:             string;
    fullName:          string;  
    userName:          string;
    country:           string;
    userId:            string;
    image:             string;
    phoneNumber:       string;
    level:             string;
    isActive:          boolean;
    proficiencyLevels: ProficiencyLevel[];
    activationNotes:   ActivationNote[];
    ratings:           Ratings;
}

export interface ActivationNote {
    title:       string;
    userId:      string;
    reason:      string;
    adminUserId: string;
    adminName:   string;
    date:        Date;
}

export interface ProficiencyLevel {
    id:    number;
    type:  string;
    level: string;
}

export interface Ratings {
    level: number;
    stats: Stat[];
}

export interface Stat {
    testingType: string;
    rating:      number;
}


export interface Vulnerability {
    id:   number;
    type: null;
}
