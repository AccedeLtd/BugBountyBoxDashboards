export interface UpcomingPaymentResponseJSON {
    id:               string;
    amount:           number;
    charge:           number;
    date:             Date;
    description:      string;
    receiverWalletId: number;
    receiverUserId:   null;
    receiverPhone:    null;
    senderWalletId:   number;
    senderUserId:     string;
    senderPhone:      string;
    state:            number;
    status:           number;
    type:             number;
    platform:         number;
    project:          Project;
}

export interface Project {
    projectId:      number;
    projectTitle:   string;
    businessName:   string;
    customerUserId: string;
    companyLogo:    null;
    hackerUserId:   string;
    hackerName:     null;
    avatarUrl:      null;
}
