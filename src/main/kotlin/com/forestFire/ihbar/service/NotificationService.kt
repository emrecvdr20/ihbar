package com.forestFire.ihbar.service

import com.forestFire.ihbar.entity.FireReport
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class NotificationService {

    private val logger = LoggerFactory.getLogger(NotificationService::class.java)

    fun sendEmergencyNotification(fireReport: FireReport) {
        // SMS gönderme (Turkcell/Vodafone API)
        sendSMSNotification(fireReport)

        // Email gönderme
        sendEmailNotification(fireReport)

        // WhatsApp bildirimi (gelecekte)
        // sendWhatsAppNotification(fireReport)

        logger.info("Emergency notification sent for report ID: ${fireReport.id}")
    }

    private fun sendSMSNotification(fireReport: FireReport) {
        // SMS API entegrasyonu (şimdilik log)
        val message = """
            🔥 ACİL YANGIN İHBARI!
            Konum: ${fireReport.latitude}, ${fireReport.longitude}
            Açıklama: ${fireReport.description ?: "Açıklama yok"}
            Zaman: ${fireReport.reportedAt}
            Aciliyet: ${fireReport.urgencyLevel}
        """.trimIndent()

        logger.info("SMS would be sent: $message")

        // Gerçek SMS gönderimi için:
        // val smsApi = SmsApiClient()
        // smsApi.sendSms(emergencyNumbers, message)
    }

    private fun sendEmailNotification(fireReport: FireReport) {
        logger.info("Email notification would be sent for report: ${fireReport.id}")

        // Spring Mail ile email gönderimi
        // mailSender.send(createFireReportEmail(fireReport))
    }
}