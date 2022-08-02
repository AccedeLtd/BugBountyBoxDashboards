export interface PaymentTransactionRequestJSON {
    transactionId?: string;
    amount:        number;
    charge:        number;  
    project:       Project;
}

export interface Project {
    projectId?:      number;
    projectTitle?:   string;
    businessName?:   string;
    customerUserId?: string;
    companyLogo?:    string;
    hackerUserId?:   string;
    hackerName?:     string;
    avatarUrl?:      string;
}