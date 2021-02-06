export declare function generateHttpHead(statusCode: number, statusMessage: string, end?: boolean): string;
export declare function parseBasicAuthenticationHeader(data: string): {
    username: string;
    password: string;
};
