package com.forestFire.ihbar.repository

import com.forestFire.ihbar.entity.FireReport
import com.forestFire.ihbar.entity.ReportStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface FireReportRepository : JpaRepository<FireReport, Long> {

    fun findByStatusOrderByReportedAtDesc(status: ReportStatus): List<FireReport>

    fun findByReportedAtBetweenOrderByReportedAtDesc(
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ): List<FireReport>

    @Query(
        """
        SELECT f FROM FireReport f 
        WHERE f.latitude BETWEEN :minLat AND :maxLat 
        AND f.longitude BETWEEN :minLon AND :maxLon
        AND f.reportedAt >= :since
        ORDER BY f.reportedAt DESC
    """
    )
    fun findByLocationAndDateRange(
        minLat: Double, maxLat: Double,
        minLon: Double, maxLon: Double,
        since: LocalDateTime
    ): List<FireReport>
}