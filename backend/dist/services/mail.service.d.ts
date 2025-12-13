export interface ContactEmailPayload {
    name: string;
    email: string;
    subject?: string;
    message: string;
}
export declare function sendContactEmail(payload: ContactEmailPayload): Promise<void>;
//# sourceMappingURL=mail.service.d.ts.map