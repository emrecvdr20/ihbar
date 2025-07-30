package com.forestFire.ihbar.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*

@Service
class PhotoUploadService {

    @Value("\${app.upload.dir:uploads}")
    private lateinit var uploadDir: String

    fun uploadPhoto(file: MultipartFile): String {
        // Dosya uzantısını kontrol et
        val allowedExtensions = listOf("jpg", "jpeg", "png", "webp")
        val fileExtension = file.originalFilename?.substringAfterLast(".")?.lowercase()

        if (fileExtension !in allowedExtensions) {
            throw IllegalArgumentException("Desteklenmeyen dosya formatı. JPG, PNG veya WebP kullanın.")
        }

        // Dosya boyutunu kontrol et (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw IllegalArgumentException("Dosya boyutu 5MB'dan küçük olmalıdır.")
        }

        // Unique filename oluştur
        val filename = "${UUID.randomUUID()}.${fileExtension}"
        val uploadPath = Paths.get(uploadDir)

        // Upload klasörü yoksa oluştur
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath)
        }

        // Dosyayı kaydet
        val filePath = uploadPath.resolve(filename)
        Files.copy(file.inputStream, filePath)

        // URL return et
        return "/api/photos/$filename"
    }
}