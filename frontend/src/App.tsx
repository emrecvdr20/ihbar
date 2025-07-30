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
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
            {/* Navigation */}
            <nav className="bg-white shadow-lg border-b-4 border-red-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">🔥</div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Yangın İhbar Sistemi
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setCurrentView('report')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    currentView === 'report'
                                        ? 'bg-red-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                📱 İhbar Et
                            </button>

                            {isAdminAuthenticated ? (
                                <>
                                    <button
                                        onClick={() => setCurrentView('admin')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            currentView === 'admin'
                                                ? 'bg-red-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        ⚙️ Admin Panel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        🚪 Çıkış
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleAdminLogin}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    🔐 Admin Girişi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-8">
                {currentView === 'report' && <FireReportForm/>}
                {currentView === 'admin' && isAdminAuthenticated && <AdminPanel/>}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold mb-2">🚨 Acil Durum</h3>
                            <p className="text-sm text-gray-300">
                                Acil yangın durumlarında<br/>
                                <strong className="text-xl">112</strong>'yi arayın
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">📞 İletişim</h3>
                            <p className="text-sm text-gray-300">
                                Orman Genel Müdürlüğü<br/>
                                Telefon: 0312 XXX XX XX
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">ℹ️ Sistem Hakkında</h3>
                            <p className="text-sm text-gray-300">
                                Bu sistem yangın ihbarlarını<br/>
                                yetkililere iletmek için tasarlanmıştır.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            © 2025 Yangın İhbar Sistemi. Tüm hakları saklıdır.
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            ⚠️ Yanlış ihbar cezai sorumluluk doğurur. Sistem kullanımı kayıt altında tutulmaktadır.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;