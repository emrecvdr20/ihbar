// FireReportController.kt - Güncellenmiş
package com.forestFire.ihbar.controller

import com.forestFire.ihbar.dto.FireReportRequest
import com.forestFire.ihbar.dto.FireReportResponse
import com.forestFire.ihbar.service.FireReportService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/fire-reports")
@CrossOrigin(origins = ["*"])
class FireReportController(
    private val fireReportService: FireReportService
) {

    @PostMapping
    fun createFireReport(
        @RequestPart("data") request: FireReportRequest,
        @RequestPart("photo", required = false) photo: MultipartFile?
    ): ResponseEntity<FireReportResponse> {
        return try {
            val response = fireReportService.createReport(request, photo)
            ResponseEntity.status(HttpStatus.CREATED).body(response)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                FireReportResponse(
                    success = false,
                    message = "Hata: ${e.message}",
                    reportId = null
                )
            )
        }
    }

    // Return type güncellendi
    @GetMapping
    fun getAllReports(): ResponseEntity<List<FireReportResponse.ReportData>> {
        val reports = fireReportService.getAllReports()
        return ResponseEntity.ok(reports)
    }

    // Return type güncellendi
    @GetMapping("/{id}")
    fun getReportById(@PathVariable id: Long): ResponseEntity<FireReportResponse.ReportData> {
        return try {
            val report = fireReportService.getReportById(id)
            ResponseEntity.ok(report)
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @PutMapping("/{id}/status")
    fun updateReportStatus(
        @PathVariable id: Long,
        @RequestParam status: String
    ): ResponseEntity<FireReportResponse> {
        return try {
            val updated = fireReportService.updateStatus(id, status)
            ResponseEntity.ok(updated)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body(
                FireReportResponse(
                    success = false,
                    message = "Hata: ${e.message}",
                    reportId = null
                )
            )
        }
    }

    // Return type güncellendi
    @GetMapping("/nearby")
    fun getNearbyReports(
        @RequestParam lat: Double,
        @RequestParam lon: Double,
        @RequestParam radius: Double = 5.0 // km
    ): ResponseEntity<List<FireReportResponse.ReportData>> {
        val reports = fireReportService.getNearbyReports(lat, lon, radius)
        return ResponseEntity.ok(reports)
    }
}