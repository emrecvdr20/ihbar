import React, {useEffect, useState} from 'react';
import {Avatar, Badge, Button, Card, Col, Divider, Empty, Image, Row, Space, Spin, Tag, Typography} from 'antd';
import {
    AlertOutlined,
    CalendarOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EnvironmentOutlined,
    ExclamationCircleOutlined,
    FireOutlined,
    GlobalOutlined,
    PhoneOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import {FireReportService} from "../services/FireReportService.ts";
import type {FireReportData} from "../types/FireReport.ts";

const {Title, Text, Paragraph} = Typography;

const fireReportService = new FireReportService();

export const AdminPanel: React.FC = () => {
    const [reports, setReports] = useState<FireReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const response: FireReportData[] = await fireReportService.getAllReports();
            // Response doğrudan array
            const reportsData = response.sort(
                (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
            );
            setReports(reportsData);
        } catch (error) {
            console.error('Raporlar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (reportId: number, newStatus: string) => {
        try {
            await fireReportService.updateReportStatus(reportId, newStatus);
            await loadReports();
        } catch (error) {
            console.error('Status güncellenemedi:', error);
        }
    };

    const filteredReports = reports.filter(report => {
        if (filter === 'ALL') return true;
        return report.status === filter;
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {color: 'warning', icon: <ClockCircleOutlined/>, label: 'Bekleyen'};
            case 'VERIFIED':
                return {color: 'processing', icon: <CheckCircleOutlined/>, label: 'Doğrulandı'};
            case 'IN_PROGRESS':
                return {color: 'orange', icon: <ExclamationCircleOutlined/>, label: 'İşlemde'};
            case 'RESOLVED':
                return {color: 'success', icon: <CheckCircleOutlined/>, label: 'Çözüldü'};
            case 'FALSE_ALARM':
                return {color: 'default', icon: <CloseCircleOutlined/>, label: 'Yanlış Alarm'};
            default:
                return {color: 'default', icon: <ClockCircleOutlined/>, label: status};
        }
    };

    const getUrgencyConfig = (urgency: string) => {
        switch (urgency) {
            case 'LOW':
                return {color: 'success', label: 'Düşük'};
            case 'MEDIUM':
                return {color: 'warning', label: 'Orta'};
            case 'HIGH':
                return {color: 'error', label: 'Yüksek'};
            case 'CRITICAL':
                return {color: 'error', label: 'Kritik'};
            default:
                return {color: 'default', label: urgency};
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('tr-TR');
    };

    const openMapsLocation = (lat: number, lon: number) => {
        window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
    };

    const filterButtons = [
        {key: 'ALL', label: 'Tümü', icon: <FireOutlined/>},
        {key: 'PENDING', label: 'Bekleyen', icon: <ClockCircleOutlined/>},
        {key: 'VERIFIED', label: 'Doğrulandı', icon: <CheckCircleOutlined/>},
        {key: 'IN_PROGRESS', label: 'İşlemde', icon: <ExclamationCircleOutlined/>},
        {key: 'RESOLVED', label: 'Çözüldü', icon: <CheckCircleOutlined/>},
        {key: 'FALSE_ALARM', label: 'Yanlış Alarm', icon: <CloseCircleOutlined/>}
    ];

    const statusUpdateButtons = [
        {key: 'VERIFIED', label: 'Doğrula', icon: '✅'},
        {key: 'IN_PROGRESS', label: 'İşleme Al', icon: '🔄'},
        {key: 'RESOLVED', label: 'Çöz', icon: '✅'},
        {key: 'FALSE_ALARM', label: 'Yanlış Alarm', icon: '❌'}
    ];

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300}}>
                <Spin size="large"/>
            </div>
        );
    }

    return (
        <div style={{maxWidth: 1400, margin: '0 auto', padding: 24}}>
            <Card>
                {/* Header */}
                <div style={{marginBottom: 24}}>
                    <Row justify="space-between" align="middle" style={{marginBottom: 16}}>
                        <Col>
                            <Title level={2} style={{margin: 0, color: '#ff4d4f'}}>
                                <FireOutlined/> Yangın İhbar Yönetimi
                            </Title>
                            <Text type="secondary">Toplam {reports.length} ihbar</Text>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<ReloadOutlined/>}
                                onClick={loadReports}
                                loading={loading}
                            >
                                Yenile
                            </Button>
                        </Col>
                    </Row>

                    {/* Filter buttons */}
                    <Space wrap>
                        {filterButtons.map(filterBtn => (
                            <Badge
                                key={filterBtn.key}
                                count={reports.filter(r => filterBtn.key === 'ALL' || r.status === filterBtn.key).length}
                                size="small"
                            >
                                <Button
                                    type={filter === filterBtn.key ? 'primary' : 'default'}
                                    danger={filter === filterBtn.key}
                                    icon={filterBtn.icon}
                                    onClick={() => setFilter(filterBtn.key)}
                                    size="small"
                                >
                                    {filterBtn.label}
                                </Button>
                            </Badge>
                        ))}
                    </Space>
                </div>

                {/* Reports List */}
                {filteredReports.length === 0 ? (
                    <Empty
                        description="Henüz ihbar bulunmuyor"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <Space direction="vertical" size="middle" style={{width: '100%'}}>
                        {filteredReports.map(report => {
                            const statusConfig = getStatusConfig(report.status);
                            const urgencyConfig = getUrgencyConfig(report.urgencyLevel);

                            return (
                                <Card
                                    key={report.id}
                                    size="small"
                                    hoverable
                                    style={{border: '1px solid #f0f0f0'}}
                                >
                                    {/* Card Header */}
                                    <Row justify="space-between" align="middle" style={{marginBottom: 16}}>
                                        <Col>
                                            <Space>
                                                <Avatar
                                                    size="small"
                                                    style={{
                                                        backgroundColor: urgencyConfig.color === 'success' ? '#52c41a' :
                                                            urgencyConfig.color === 'warning' ? '#faad14' :
                                                                urgencyConfig.color === 'error' ? '#ff4d4f' : '#d9d9d9'
                                                    }}
                                                />
                                                <Title level={4} style={{margin: 0}}>
                                                    İhbar #{report.id}
                                                </Title>
                                                <Tag
                                                    color={statusConfig.color}
                                                    icon={statusConfig.icon}
                                                >
                                                    {statusConfig.label}
                                                </Tag>
                                            </Space>
                                        </Col>
                                        <Col>
                                            <Text type="secondary">
                                                <CalendarOutlined/> {formatDate(report.reportedAt)}
                                            </Text>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12}>
                                            <Space direction="vertical" size="small" style={{width: '100%'}}>
                                                <div>
                                                    <Text strong>
                                                        <EnvironmentOutlined/> Konum:
                                                    </Text>
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        icon={<GlobalOutlined/>}
                                                        onClick={() => openMapsLocation(report.latitude, report.longitude)}
                                                        style={{padding: 0, height: 'auto', marginLeft: 8}}
                                                    >
                                                        {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                                                    </Button>
                                                </div>

                                                {report.address && (
                                                    <div>
                                                        <Text strong>📍 Adres:</Text>
                                                        <Text style={{marginLeft: 8}}>{report.address}</Text>
                                                    </div>
                                                )}

                                                {report.description && (
                                                    <div>
                                                        <Text strong>📝 Açıklama:</Text>
                                                        <Paragraph
                                                            style={{marginLeft: 8, marginBottom: 0}}
                                                            ellipsis={{rows: 2, expandable: true, symbol: 'daha fazla'}}
                                                        >
                                                            {report.description}
                                                        </Paragraph>
                                                    </div>
                                                )}

                                                {report.reporterPhone && (
                                                    <div>
                                                        <Text strong>
                                                            <PhoneOutlined/> Telefon:
                                                        </Text>
                                                        <Text style={{marginLeft: 8}}>{report.reporterPhone}</Text>
                                                    </div>
                                                )}

                                                <div>
                                                    <Text strong>
                                                        <AlertOutlined/> Aciliyet:
                                                    </Text>
                                                    <Tag
                                                        color={urgencyConfig.color}
                                                        style={{marginLeft: 8}}
                                                    >
                                                        {urgencyConfig.label}
                                                    </Tag>
                                                </div>
                                            </Space>
                                        </Col>

                                        <Col xs={24} md={12}>
                                            {report.photoUrl && (
                                                <div>
                                                    <Text strong>
                                                        <CameraOutlined/> Fotoğraf:
                                                    </Text>
                                                    <div style={{marginTop: 8}}>
                                                        <Image
                                                            width="100%"
                                                            height={150}
                                                            src={`http://localhost:8080${report.photoUrl}`}
                                                            alt="Yangın fotoğrafı"
                                                            style={{objectFit: 'cover', borderRadius: 8}}
                                                            preview={{
                                                                src: `http://localhost:8080${report.photoUrl}`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>

                                    <Divider style={{margin: '16px 0'}}/>

                                    {/* Status update buttons */}
                                    <div>
                                        <Text strong style={{marginRight: 16}}>Durum Güncelle:</Text>
                                        <Space wrap>
                                            {statusUpdateButtons.map(statusBtn => (
                                                <Button
                                                    key={statusBtn.key}
                                                    size="small"
                                                    type={report.status === statusBtn.key ? 'default' : 'primary'}
                                                    disabled={report.status === statusBtn.key}
                                                    onClick={() => updateStatus(report.id, statusBtn.key)}
                                                    style={{
                                                        opacity: report.status === statusBtn.key ? 0.5 : 1
                                                    }}
                                                >
                                                    {statusBtn.icon} {statusBtn.label}
                                                </Button>
                                            ))}
                                        </Space>
                                    </div>
                                </Card>
                            );
                        })}
                    </Space>
                )}
            </Card>
        </div>
    );
};