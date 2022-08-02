export interface UpcomingPaymentsJSON {
    transactionId: string;
    amount:        number;
    project:       Project;
}

export interface Project {
    projectId:      number;
    projectTitle:   string;   
    businessName:   string;
    customerUserId: string;
    companyLogo:    string;
    hackerUserId:   string;
    hackerName:     string;
    avatarUrl:      string;
}