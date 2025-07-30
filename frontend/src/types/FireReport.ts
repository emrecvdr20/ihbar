export interface FireReportRequest {
    latitude: number;
    longitude: number;
    description?: string;
    reporterPhone?: string;
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface FireReportResponse {
    success: boolean;
    message: string;
    reportId: number | null;
    data?: {
        id: number;
        latitude: number;
        longitude: number;
        description: string | null;
        photoUrl: string | null;
        reporterPhone: string | null;
        reportedAt: string;
        status: string;
        address: string | null;
        urgencyLevel: string;
    };
}

export interface FireReportData {
    id: number;
    latitude: number;
    longitude: number;
    description: string | null;
    photoUrl: string | null;
    reporterPhone: string | null;
    reportedAt: string;
    status: string;
    address: string | null;
    urgencyLevel: string;
}
