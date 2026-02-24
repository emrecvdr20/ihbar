import type {FireReportData, FireReportRequest, FireReportResponse} from "../types/FireReport.ts";

export class FireReportService {
    private baseUrl = 'http://localhost:8080/api/fire-reports';

    async submitReport(
        reportData: FireReportRequest,
        photo?: File
    ): Promise<FireReportResponse> {
        const formData = new FormData();

        // JSON data'yı blob olarak ekle
        const jsonBlob = new Blob([JSON.stringify(reportData)], {
            type: 'application/json'
        });
        formData.append('data', jsonBlob);

        // Fotoğraf varsa ekle
        if (photo) {
            formData.append('photo', photo);
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('İhbar gönderilirken hata oluştu');
        }

        return response.json();
    }

    async getAllReports(): Promise<FireReportData[]> {
        const response = await fetch(this.baseUrl);
        return response.json();
    }

    async getNearbyReports(lat: number, lon: number, radius: number = 5): Promise<FireReportData[]> {
        const response = await fetch(
            `${this.baseUrl}/nearby?lat=${lat}&lon=${lon}&radius=${radius}`
        );
        return response.json();
    }

    async updateReportStatus(reportId: number, status: string): Promise<void> {
        const response = await fetch(
            `${this.baseUrl}/${reportId}/status?status=${status}`,
            { method: 'PUT' }
        );
        if (!response.ok) {
            throw new Error('Status güncellenirken hata oluştu');
        }
    }
}