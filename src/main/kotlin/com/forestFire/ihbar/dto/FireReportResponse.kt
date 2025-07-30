package com.forestFire.ihbar.dto

import java.time.LocalDateTime

data class FireReportResponse(
    val success: Boolean,
    val message: String,
    val reportId: Long?,
    val data: ReportData? = null
) {
    data class ReportData(
        val id: Long,
        val latitude: Double,
        val longitude: Double,
        val description: String?,
        val photoUrl: String?,
        val reporterPhone: String?,
        val reportedAt: LocalDateTime,
        val status: String,
        val address: String?,
        val urgencyLevel: String
    )
}