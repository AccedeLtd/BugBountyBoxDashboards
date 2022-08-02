export interface CreateBugReportInput {
    projectDomainId: number,
    dateOfSubmission: string,
    title?: string,
    description?: string,
    impact?: string,
    vulnerabilityId: number,
    status: number,
    severity: number,
}