import {useState} from 'react';
import {FireReportForm} from './components/FireReportForm';
import {AdminPanel} from './components/AdminPanel';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState<'report' | 'admin'>('report');
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    const handleAdminLogin = () => {
        // Basit authentication - production'da JWT token kullanın
        const password = prompt('Admin şifresi:');
        if (password === 'admin123') {
            setIsAdminAuthenticated(true);
            setCurrentView('admin');
        } else {
            alert('Yanlış şifre!');
        }
    };

    const handleLogout = () => {
        setIsAdminAuthenticated(false);
        setCurrentView('report');
    };

    return (
        <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #fff5f5, #fff7ed)'}}>
            {/* Navigation */}
            <nav style={{
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                borderBottom: '4px solid #dc2626'
            }}>
                <div style={{maxWidth: 1280, margin: '0 auto', padding: '0 24px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                            <div style={{fontSize: 24}}>🔥</div>
                            <h1 style={{fontSize: 20, fontWeight: 700, color: '#111827', margin: 0}}>
                                Yangın İhbar Sistemi
                            </h1>
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                            <button
                                onClick={() => setCurrentView('report')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    backgroundColor: currentView === 'report' ? '#dc2626' : 'transparent',
                                    color: currentView === 'report' ? '#fff' : '#4b5563'
                                }}
                            >
                                📱 İhbar Et
                            </button>

                            {isAdminAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => setCurrentView('admin')}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: 8,
                                            fontWeight: 500,
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                            backgroundColor: currentView === 'admin' ? '#dc2626' : 'transparent',
                                            color: currentView === 'admin' ? '#fff' : '#4b5563'
                                        }}
                                    >
                                        ⚙️ Admin Panel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: 8,
                                            fontWeight: 500,
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#4b5563',
                                            backgroundColor: 'transparent'
                                        }}
                                    >
                                        🚪 Çıkış
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleAdminLogin}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 8,
                                        fontWeight: 500,
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#4b5563',
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    🔐 Admin Girişi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{padding: '32px 0'}}>
                {currentView === 'report' && <FireReportForm/>}
                {currentView === 'admin' && isAdminAuthenticated && <AdminPanel/>}
            </main>

            {/* Footer */}
            <footer style={{backgroundColor: '#1f2937', color: '#fff', padding: '32px 0', marginTop: 64}}>
                <div style={{maxWidth: 1280, margin: '0 auto', padding: '0 16px', textAlign: 'center'}}>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32}}>
                        <div>
                            <h3 style={{fontWeight: 700, marginBottom: 8}}>🚨 Acil Durum</h3>
                            <p style={{fontSize: 14, color: '#d1d5db'}}>
                                Acil yangın durumlarında<br/>
                                <strong style={{fontSize: 20}}>112</strong>'yi arayın
                            </p>
                        </div>
                        <div>
                            <h3 style={{fontWeight: 700, marginBottom: 8}}>📞 İletişim</h3>
                            <p style={{fontSize: 14, color: '#d1d5db'}}>
                                Orman Genel Müdürlüğü<br/>
                                Telefon: 0312 XXX XX XX
                            </p>
                        </div>
                        <div>
                            <h3 style={{fontWeight: 700, marginBottom: 8}}>ℹ️ Sistem Hakkında</h3>
                            <p style={{fontSize: 14, color: '#d1d5db'}}>
                                Bu sistem yangın ihbarlarını<br/>
                                yetkililere iletmek için tasarlanmıştır.
                            </p>
                        </div>
                    </div>

                    <div style={{marginTop: 32, paddingTop: 32, borderTop: '1px solid #374151'}}>
                        <p style={{fontSize: 14, color: '#9ca3af'}}>
                            © 2026 Yangın İhbar Sistemi. Tüm hakları saklıdır.
                        </p>
                        <p style={{fontSize: 12, color: '#6b7280', marginTop: 8}}>
                            ⚠️ Yanlış ihbar cezai sorumluluk doğurur. Sistem kullanımı kayıt altında tutulmaktadır.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;