export interface HTTPResultWrapper {
    targetUrl: string;
    success:   boolean;
    error:     Error;
    result:    string;
}

export interface Error {
    code:    number;
    message: string;
    details: string;
}