export interface notificationHubJson {
        id?:                   string;
        createdBy?:            string;
        createdAt:            Date;
        modifiedBy?:           string;
        modifiedAt?:           Date;
        message?:              string;
        title?:                string;
        subject?:              string;
        notificationName?:     string;
        userId?:               string;
        userEmail?:            string;
        emailTemplate?:        string;
        htmlFormattedMessage?: string;
        linkText?:             string;
        linkUrl?:              string;
        firebaseToken?:        string;
        status?:               number;   
    }