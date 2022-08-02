export interface CreateProjectRequestJson {
    id?:                 number;
    title?:              string;
    description?:        string;
    projectLogoUrl?:     string;
    bounty?:             number;
    projectStatus?:      number;
    domains?:            Domain[];
    requirementLevelId?: number;
    testTypeId?:         number;
}

export interface Domain {
    id?:           number;
    projectId?:   number;
    name?:         string;
    type?:        string;
    assetTypeId?: number;
    domain?:      string;
    assetType?:     string;
}

export interface Customer {
    id:number;
    userId:       string;
    email:        string;
    fullName:     string;
    userName:     string;
    country:      string;
    businessName: string;
    logoUrl:      string;
    phoneNumber:  string;
}