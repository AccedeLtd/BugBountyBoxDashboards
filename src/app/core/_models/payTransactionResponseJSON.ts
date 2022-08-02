export interface PayTransactionResponseJSON {
    isSuccess:           boolean;
    status:              number;
    errorMessages:       string[];
    sentTransaction:     Transaction;
    receivedTransaction: Transaction;
    wallet:              Wallet; 
    orderDto:            OrderDto;   
}

export interface OrderDto {
    id:     string;
    status: string;
    links:  Link[];
}

export interface Link {
    href:   string;
    rel:    string;
    method: string;
}

export interface Transaction {
    id:               string;
    amount:           number;
    charge:           number;
    date:             Date;
    description:      string;
    receiverWalletId: number;
    receiverUserId:   string;
    receiverPhone:    string;
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
    companyLogo:    string;
    hackerUserId:   string;
    hackerName:     string;
    avatarUrl:      string;
}

export interface Wallet {
    id:          number;
    balance:     number;
    userId:      string;
    fullName:    string;
    email:       string;
    phoneNumber: string;
    walletType:  number;
}
