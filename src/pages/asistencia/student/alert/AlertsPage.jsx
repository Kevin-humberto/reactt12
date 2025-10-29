// src/pages/asistencia/student/alert/AlertsPage.jsx

import React, { useEffect, useState } from 'react';
import AlertsComponent from '../../../../components/asistencia/student/alert/AlertsComponents';
import { getStudentAlerts } from '../../../../services/asistencia/student/alert/AlertsService';
import '../../../../styles/asistencia/student/alert/AlertsStyles.css';

const AlertsPage = () => {
    const [alertsData, setAlertsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('📊 Loading alerts from backend...');
            
            const data = await getStudentAlerts();
            
            if (data.error) {
                setError(data.error);
            }
            
            setAlertsData(data);
            
            console.log('✅ Alerts loaded successfully');
            console.log(`🔴 Critical: ${data.criticalAlerts.length}`);
            console.log(`🟡 Warnings: ${data.warningAlerts.length}`);
            
        } catch (err) {
            console.error('❌ Error loading alerts:', err);
            setError('Error al cargar las alertas. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // ========== LOADING STATE ==========
    if (loading) {
        return (
            <div className="alertas-page">
                <div className="loading-container">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mb-6 shadow-lg"></div>
                    <p className="text-2xl text-slate-200 font-extrabold mb-2 tracking-tight">
                        Cargando alertas académicas...
                    </p>
                    <p className="text-base text-slate-400 font-semibold">
                        Obteniendo datos desde la base de datos
                    </p>
                </div>
            </div>
        );
    }

    // ========== ERROR STATE ==========
    if (error) {
        return (
            <div className="alertas-page">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="error-container max-w-md">
                        <div className="flex items-center mb-4">
                            <span className="text-4xl mr-3">❌</span>
                            <h3 className="font-extrabold text-2xl text-red-900 tracking-tight">
                                Error al cargar alertas
                            </h3>
                        </div>
                        <p className="mb-6 text-red-800 font-semibold text-base">{error}</p>
                        <button
                            onClick={loadAlerts}
                            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-extrabold shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-red-700"
                        >
                            🔄 Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========== NO DATA STATE ==========
    if (!alertsData || (alertsData.criticalAlerts.length === 0 && alertsData.warningAlerts.length === 0)) {
        return (
            <div className="alertas-page">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-100 mb-2 tracking-tight">
                        Alertas Académicas
                    </h1>
                    <p className="text-base text-slate-400 font-semibold">
                        Monitorea tu estado académico y recibe notificaciones importantes
                    </p>
                </div>
                
                {/* No Alerts Container */}
                <div className="no-alerts-container">
                    <div className="text-center">
                        <svg className="w-24 h-24 mx-auto mb-6 text-green-600 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
                            ¡Excelente! No tienes alertas
                        </h3>
                        <p className="text-slate-700 font-semibold text-lg mb-6">
                            Tu asistencia está en buen estado. Continúa así para mantener tu rendimiento académico.
                        </p>
                        
                        {/* Student Info */}
                        {alertsData?.studentInfo && (
                            <div className="mt-6 bg-white rounded-xl p-6 inline-block border-2 border-slate-400 shadow-lg">
                                <p className="text-slate-900 font-extrabold text-lg">
                                    {alertsData.studentInfo.name}
                                </p>
                                <p className="text-slate-600 text-base font-bold mt-2">
                                    {alertsData.studentInfo.currentSemester}° Semestre • {alertsData.studentInfo.career}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ========== SUCCESS STATE - Render Normal ==========
    return (
        <div className="alertas-page">
            
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-100 mb-2 tracking-tight">
                        Alertas Académicas
                    </h1>
                    <p className="text-base text-slate-400 font-semibold mb-3">
                        Monitorea tu estado académico y recibe notificaciones importantes
                    </p>
                    
                    {/* Student Info */}
                    {alertsData.studentInfo && (
                        <p className="text-sm text-slate-500 font-bold">
                            {alertsData.studentInfo.name} • {alertsData.studentInfo.currentSemester}° Semestre • {alertsData.studentInfo.career}
                        </p>
                    )}
                </div>
                
                {/* Refresh Button */}
                <button
                    onClick={loadAlerts}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2 font-extrabold shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-slate-600"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Actualizar</span>
                </button>
            </div>

            {/* Alerts Component */}
            <AlertsComponent data={alertsData} />
        </div>
    );
};

export default AlertsPage;