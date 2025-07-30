// components/FireReportForm.tsx - Ant Design ile güncellenmiş
import React, {useRef, useState} from 'react';
import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    List,
    Row,
    Select,
    Space,
    Spin,
    Statistic,
    Tag,
    Typography
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    EnvironmentOutlined,
    FireOutlined,
    LoadingOutlined,
    PhoneOutlined,
    ReloadOutlined,
    WarningOutlined
} from '@ant-design/icons';
import {useGeolocation} from '../hooks/useGeolocation';
import {FireReportService} from "../services/FireReportService.ts";
import type {FireReportRequest} from "../types/FireReport.ts";

const {Title, Text, Paragraph} = Typography;
const {TextArea} = Input;
const {Option} = Select;

const fireReportService = new FireReportService();

export const FireReportForm: React.FC = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState<FireReportRequest>({
        latitude: 0,
        longitude: 0,
        description: '',
        reporterPhone: '',
        urgencyLevel: 'MEDIUM'
    });

    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
        reportId?: number | null;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const {latitude, longitude, error: locationError, loading: locationLoading, refreshLocation} = useGeolocation();

    // Konum güncellemesi
    React.useEffect(() => {
        if (latitude && longitude) {
            setFormData(prev => ({
                ...prev,
                latitude,
                longitude
            }));
        }
    }, [latitude, longitude]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Dosya boyut kontrolü (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Dosya boyutu 5MB\'dan küçük olmalıdır');
                return;
            }

            // Dosya türü kontrolü
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                alert('Sadece JPG, PNG veya WebP formatları desteklenir');
                return;
            }

            setPhoto(file);

            // Preview oluştur
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!latitude || !longitude) {
            alert('Konum bilgisi alınamadı. Lütfen konum erişimine izin verin.');
            return;
        }

        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const response = await fireReportService.submitReport(formData, photo || undefined);

            setSubmitResult({
                success: response.success,
                message: response.message,
                reportId: response.reportId
            });

            if (response.success) {
                // Form reset
                form.resetFields();
                setFormData(prev => ({
                    ...prev,
                    description: '',
                    reporterPhone: ''
                }));
                setPhoto(null);
                setPhotoPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            setSubmitResult({
                success: false,
                message: 'Hata: ' + (error as Error).message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const urgencyOptions = [
        {value: 'LOW', label: 'Düşük', color: 'success', description: 'Küçük çapta, kontrol altına alınabilir'},
        {value: 'MEDIUM', label: 'Orta', color: 'warning', description: 'Orta büyüklükte, dikkat gerektirir'},
        {value: 'HIGH', label: 'Yüksek', color: 'error', description: 'Büyük yangın, acil müdahale gerekli'},
        {value: 'CRITICAL', label: 'Kritik', color: 'error', description: 'Çok büyük yangın, hayati tehlike var'}
    ];

    const getCurrentUrgencyDesc = () => {
        return urgencyOptions.find(opt => opt.value === formData.urgencyLevel)?.description || '';
    };

    return (
        <div style={{maxWidth: 480, margin: '0 auto', padding: '20px'}}>
            <Card>
                {/* Header */}
                <div style={{textAlign: 'center', marginBottom: 24}}>
                    <Title level={2} style={{color: '#ff4d4f', marginBottom: 8}}>
                        <FireOutlined/> Yangın İhbar
                    </Title>
                    <Text type="secondary">Acil yangın durumu bildirin</Text>
                </div>

                {/* Konum durumu */}
                <Card size="small" style={{marginBottom: 24, backgroundColor: '#fafafa'}}>
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Space>
                                <EnvironmentOutlined/>
                                <Text strong>Konum Bilgisi</Text>
                                {locationLoading && <Spin size="small"/>}
                            </Space>
                        </Col>
                    </Row>

                    {locationError && (
                        <Alert
                            message={locationError}
                            type="error"
                            style={{marginTop: 12}}
                            action={
                                <Button
                                    size="small"
                                    type="link"
                                    icon={<ReloadOutlined/>}
                                    onClick={refreshLocation}
                                >
                                    Tekrar dene
                                </Button>
                            }
                        />
                    )}

                    {latitude && longitude && (
                        <div style={{marginTop: 12}}>
                            <Alert
                                message="Konum başarıyla alındı"
                                type="success"
                                style={{marginBottom: 8}}
                            />
                            <Text type="secondary" style={{fontSize: 12}}>
                                Lat: {latitude.toFixed(6)}, Lon: {longitude.toFixed(6)}
                            </Text>
                            <br/>
                            <Button
                                type="link"
                                size="small"
                                onClick={refreshLocation}
                                style={{padding: 0, height: 'auto', fontSize: 12}}
                            >
                                Konumu güncelle
                            </Button>
                        </div>
                    )}
                </Card>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        urgencyLevel: 'MEDIUM'
                    }}
                >
                    {/* Aciliyet seviyesi */}
                    <Form.Item
                        label="Aciliyet Seviyesi"
                        name="urgencyLevel"
                        required
                    >
                        <Select
                            value={formData.urgencyLevel}
                            onChange={(value) => setFormData(prev => ({
                                ...prev,
                                urgencyLevel: value as any
                            }))}
                            size="large"
                        >
                            {urgencyOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    <Tag color={option.color}>{option.label}</Tag>
                                </Option>
                            ))}
                        </Select>
                        <Text type="secondary" style={{fontSize: 12}}>
                            {getCurrentUrgencyDesc()}
                        </Text>
                    </Form.Item>

                    {/* Açıklama */}
                    <Form.Item
                        label="Yangın Açıklaması"
                        name="description"
                    >
                        <TextArea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            placeholder="Yangının boyutu, yeri, rüzgar durumu, tehlike altındaki yerler vb. detayları yazın..."
                            rows={4}
                            maxLength={500}
                            showCount
                            size="large"
                        />
                    </Form.Item>

                    {/* Telefon */}
                    <Form.Item
                        label="İletişim Telefonu"
                        name="reporterPhone"
                    >
                        <Input
                            prefix={<PhoneOutlined/>}
                            value={formData.reporterPhone}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                reporterPhone: e.target.value
                            }))}
                            placeholder="0555 123 45 67"
                            maxLength={15}
                            size="large"
                        />
                        <Text type="secondary" style={{fontSize: 12}}>
                            Yetkililerin sizinle iletişime geçebilmesi için (isteğe bağlı)
                        </Text>
                    </Form.Item>

                    {/* Fotoğraf yükleme */}
                    <Form.Item label="Yangın Fotoğrafı">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handlePhotoChange}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}
                        />
                        <Text type="secondary" style={{fontSize: 12}}>
                            JPG, PNG veya WebP formatında, maksimum 5MB
                        </Text>

                        {photoPreview && (
                            <div style={{marginTop: 12, position: 'relative'}}>
                                <img
                                    src={photoPreview}
                                    alt="Yangın fotoğrafı önizleme"
                                    style={{
                                        width: '100%',
                                        height: 200,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        border: '2px solid #f0f0f0'
                                    }}
                                />
                                <Button
                                    type="primary"
                                    danger
                                    shape="circle"
                                    icon={<DeleteOutlined/>}
                                    size="small"
                                    onClick={removePhoto}
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8
                                    }}
                                    title="Fotoğrafı kaldır"
                                />
                            </div>
                        )}
                    </Form.Item>

                    {/* Submit button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            danger
                            htmlType="submit"
                            size="large"
                            block
                            loading={isSubmitting}
                            disabled={!latitude || !longitude || locationLoading}
                            icon={isSubmitting ? <LoadingOutlined/> : <FireOutlined/>}
                            style={{
                                height: 50,
                                fontSize: 16,
                                fontWeight: 'bold'
                            }}
                        >
                            {isSubmitting ? 'Gönderiliyor...' : '🚨 ACİL İHBAR GÖNDER'}
                        </Button>
                    </Form.Item>

                    {/* Sonuç mesajı */}
                    {submitResult && (
                        <Alert
                            message={submitResult.success ? 'İhbar Başarılı!' : 'İhbar Gönderilemedi!'}
                            description={
                                <div>
                                    <Paragraph style={{marginBottom: 8}}>
                                        {submitResult.message}
                                    </Paragraph>
                                    {submitResult.success && submitResult.reportId && (
                                        <Card size="small" style={{backgroundColor: '#f6ffed'}}>
                                            <Text strong>İhbar Numarası: #{submitResult.reportId}</Text>
                                        </Card>
                                    )}
                                </div>
                            }
                            type={submitResult.success ? 'success' : 'error'}
                            icon={submitResult.success ? <CheckCircleOutlined/> : <CloseCircleOutlined/>}
                            style={{marginBottom: 16}}
                        />
                    )}
                </Form>

                <Divider/>

                {/* Acil durum bilgileri */}
                <Alert
                    message="Önemli Bilgiler"
                    description={
                        <List
                            size="small"
                            dataSource={[
                                'Acil durumlarda 112\'yi arayın',
                                'Bu sistem yetkililer için yardımcı bir araçtır',
                                'Yanlış ihbar cezai sorumluluk doğurur',
                                'Tüm ihbarlar kayıt altında tutulmaktadır'
                            ]}
                            renderItem={item => (
                                <List.Item style={{padding: '4px 0'}}>
                                    <Text style={{fontSize: 13}}>• {item}</Text>
                                </List.Item>
                            )}
                        />
                    }
                    type="warning"
                    icon={<WarningOutlined/>}
                    style={{marginBottom: 16}}
                />

                {/* İstatistik bilgisi */}
                <div style={{textAlign: 'center'}}>
                    <Statistic
                        title="Bugün alınan ihbar sayısı"
                        value={0}
                        prefix="📊"
                        valueStyle={{fontSize: 16}}
                    />
                </div>
            </Card>
        </div>
    );
};