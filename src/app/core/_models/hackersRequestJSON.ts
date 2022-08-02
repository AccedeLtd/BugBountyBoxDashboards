export interface HackersRequestJson {
    id:                number;
    email?:             string;
    fullName?:          string;
    userName?:          string;
    country?:           string;
    userId?:            string;
    image?:             string;
    phoneNumber?:       string;
    level?:             string;
    proficiencyLevels?: any[];
    ratings?:           string;
    payout:            number;
    reports:            number;
}