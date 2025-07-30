// FireReportService.kt - Düzeltilmiş Versiyon
package com.forestFire.ihbar.service

import com.forestFire.ihbar.dto.FireReportRequest
import com.forestFire.ihbar.dto.FireReportResponse
import com.forestFire.ihbar.entity.FireReport
import com.forestFire.ihbar.entity.ReportStatus
import com.forestFire.ihbar.entity.UrgencyLevel
import com.forestFire.ihbar.repository.FireReportRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime

@Service
class FireReportService(
    private val fireReportRepository: FireReportRepository,
    private val photoUploadService: PhotoUploadService,
    private val notificationService: NotificationService
) {

    fun createReport(request: FireReportRequest, photo: MultipartFile?): FireReportResponse {
        // Fotoğraf upload
        val photoUrl = photo?.let { photoUploadService.uploadPhoto(it) }

        // Adres bilgisi al (reverse geocoding)
        val address = getAddressFromCoordinates(request.latitude, request.longitude)

        // Fire report oluştur
        val fireReport = FireReport(
            latitude = request.latitude,
            longitude = request.longitude,
            description = request.description,
            photoUrl = photoUrl,
            reporterPhone = request.reporterPhone,
            address = address,
            urgencyLevel = UrgencyLevel.valueOf(request.urgencyLevel.uppercase())
        )

        val saved = fireReportRepository.save(fireReport)

        // Bildirimleri gönder
        notificationService.sendEmergencyNotification(saved)

        return FireReportResponse(
            success = true,
            message = "Yangın ihbarınız başarıyla kaydedildi. Yetkililere bildirildi.",
            reportId = saved.id,
            data = mapToResponseData(saved)
        )
    }

    // Return type'ı List<FireReportResponse.ReportData> olarak değiştir
    fun getAllReports(): List<FireReportResponse.ReportData> {
        return fireReportRepository.findAll()
            .map { mapToResponseData(it) }
    }

    // Return type'ı FireReportResponse.ReportData olarak değiştir
    fun getReportById(id: Long): FireReportResponse.ReportData {
        val report = fireReportRepository.findById(id)
            .orElseThrow { Exception("Rapor bulunamadı") }
        return mapToResponseData(report)
    }

    fun updateStatus(id: Long, status: String): FireReportResponse {
        val report = fireReportRepository.findById(id)
            .orElseThrow { Exception("Rapor bulunamadı") }

        val updatedReport = report.copy(status = ReportStatus.valueOf(status.uppercase()))
        val saved = fireReportRepository.save(updatedReport)

        return FireReportResponse(
            success = true,
            message = "Rapor durumu başarıyla güncellendi.",
            reportId = saved.id,
            data = mapToResponseData(saved)
        )
    }

    fun getNearbyReports(lat: Double, lon: Double, radiusKm: Double): List<FireReportResponse.ReportData> {
        // Basit koordinat hesaplama (daha hassas için Haversine formula kullanılabilir)
        val latDiff = radiusKm / 111.0 // 1 derece ≈ 111 km
        val lonDiff = radiusKm / (111.0 * kotlin.math.cos(Math.toRadians(lat)))

        val reports = fireReportRepository.findByLocationAndDateRange(
            minLat = lat - latDiff,
            maxLat = lat + latDiff,
            minLon = lon - lonDiff,
            maxLon = lon + lonDiff,
            since = LocalDateTime.now().minusDays(7)
        )

        return reports.map { mapToResponseData(it) }
    }

    // Fonksiyon adını daha açık yap
    private fun mapToResponseData(fireReport: FireReport) = FireReportResponse.ReportData(
        id = fireReport.id,
        latitude = fireReport.latitude,
        longitude = fireReport.longitude,
        description = fireReport.description,
        photoUrl = fireReport.photoUrl,
        reporterPhone = fireReport.reporterPhone,
        reportedAt = fireReport.reportedAt,
        status = fireReport.status.name,
        address = fireReport.address,
        urgencyLevel = fireReport.urgencyLevel.name
    )

    private fun getAddressFromCoordinates(lat: Double, lon: Double): String {
        // Nominatim API (OpenStreetMap) kullanarak reverse geocoding
        // Şimdilik basit implementasyon
        return "Lat: $lat, Lon: $lon"
    }
}