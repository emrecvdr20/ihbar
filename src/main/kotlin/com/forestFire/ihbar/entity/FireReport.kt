package com.forestFire.ihbar.entity

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "fire_reports")
data class FireReport(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val latitude: Double,

    @Column(nullable = false)
    val longitude: Double,

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @Column(name = "photo_url")
    val photoUrl: String? = null,

    @Column(name = "reporter_phone")
    val reporterPhone: String? = null,

    @Column(name = "reported_at", nullable = false)
    val reportedAt: LocalDateTime = LocalDateTime.now(),

    @Enumerated(EnumType.STRING)
    val status: ReportStatus = ReportStatus.PENDING,

    @Column(name = "address")
    val address: String? = null,

    @Column(name = "urgency_level")
    val urgencyLevel: UrgencyLevel = UrgencyLevel.MEDIUM
)

enum class ReportStatus {
    PENDING, VERIFIED, IN_PROGRESS, RESOLVED, FALSE_ALARM
}

enum class UrgencyLevel {
    LOW, MEDIUM, HIGH, CRITICAL
}