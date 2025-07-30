package com.forestFire.ihbar.dto

data class FireReportRequest(
    val latitude: Double,
    val longitude: Double,
    val description: String? = null,
    val reporterPhone: String? = null,
    val urgencyLevel: String = "MEDIUM"
)