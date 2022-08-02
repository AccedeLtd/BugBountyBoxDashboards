export class HTTPResponseWrapper<T> {
    targetUrl!: string;
    success!:   boolean;
    error!:     Error;
    result!:    T;
}

export class Error {
    code!:    number;
    message!: string;
    details!: string;
}


