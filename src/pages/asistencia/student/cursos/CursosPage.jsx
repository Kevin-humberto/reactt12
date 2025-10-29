// src/pages/asistencia/student/cursos/CursosPage.jsx

import React, { useEffect, useState } from 'react';
import CursosComponent from '../../../../components/asistencia/student/cursos/CursosComponents';
import { getStudentCoursesData } from '../../../../services/asistencia/student/cursos/CursosService';
import '../../../../styles/asistencia/student/cursos/CursosStyles.css';

const CursosPage = () => {
    const [coursesData, setCoursesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);

    useEffect(() => {
        loadCoursesData();
    }, []);

    const loadCoursesData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Loading courses data from backend...');
            
            const data = await getStudentCoursesData();
            
            if (data.error) {
                setError(data.error);
            }
            
            setCoursesData(data);
            setStudentInfo(data.studentInfo);
            
            console.log('✅ Courses data loaded successfully');
            
        } catch (err) {
            console.error('❌ Error loading courses:', err);
            setError('Error al cargar los cursos. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // 🔄 Loading state
    if (loading) {
        return (
            <div className="cursos-page">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-20 w-20 mb-6" 
                         style={{ 
                             border: '4px solid #cbd5e1',
                             borderTopColor: '#3b82f6',
                             boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                         }}></div>
                    <p className="text-2xl font-extrabold text-white mb-2" 
                       style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: '-0.01em' }}>
                        Cargando cursos...
                    </p>
                    <p className="text-sm text-gray-400 font-semibold">
                        Obteniendo datos desde la base de datos
                    </p>
                </div>
            </div>
        );
    }

    // ❌ Error state
    if (error) {
        return (
            <div className="cursos-page">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="p-6 rounded-xl max-w-md" 
                         style={{
                             backgroundColor: '#cbd5e1',
                             border: '2px solid #dc2626',
                             boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)'
                         }}>
                        <div className="flex items-center mb-4">
                            <svg className="w-8 h-8 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="font-extrabold text-2xl text-red-900" 
                                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.08)', letterSpacing: '-0.01em' }}>
                                Error al cargar
                            </h3>
                        </div>
                        <p className="mb-6 text-gray-800 font-semibold">{error}</p>
                        <button
                            onClick={loadCoursesData}
                            className="w-full px-6 py-3 rounded-lg font-extrabold transition-all duration-200 hover:transform hover:-translate-y-1"
                            style={{
                                backgroundColor: '#dc2626',
                                color: 'white',
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                boxShadow: '0 4px 8px rgba(220, 38, 38, 0.4)',
                                border: '2px solid #b91c1c',
                                letterSpacing: '0.01em'
                            }}
                        >
                            🔄 Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ⚠️ No data state
    if (!coursesData || coursesData.courses.length === 0) {
        return (
            <div className="cursos-page">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-white mb-2" 
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)', letterSpacing: '-0.02em' }}>
                        Mis Cursos
                    </h1>
                    <p className="text-base text-gray-300 font-semibold">
                        {studentInfo ? `${studentInfo.currentSemester}° Semestre - ${studentInfo.career}` : 'Cargando...'}
                    </p>
                </div>
                
                <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl p-8"
                     style={{
                         backgroundColor: '#cbd5e1',
                         border: '2px solid #94a3b8',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                     }}>
                    <div className="text-center">
                        <svg className="w-24 h-24 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-3" 
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.08)', letterSpacing: '-0.01em' }}>
                            No tienes cursos matriculados
                        </h3>
                        <p className="text-gray-700 font-semibold text-lg">
                            No se encontraron cursos para el período actual.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ✅ Success state
    return (
        <div className="cursos-page">
            
            {/* Título de la Página */}
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-white mb-2" 
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)', letterSpacing: '-0.02em' }}>
                    Mis Cursos
                </h1>
                <p className="text-lg text-gray-300 mb-4 font-semibold">
                    {studentInfo ? (
                        <>
                            {studentInfo.currentSemester}° Semestre - {studentInfo.career}
                        </>
                    ) : (
                        'Cargando información...'
                    )}
                </p>
                
                {/* Botón de refrescar */}
                <button
                    onClick={loadCoursesData}
                    className="px-5 py-3 rounded-lg text-sm font-extrabold transition-all duration-200 hover:transform hover:-translate-y-1 flex items-center space-x-2"
                    style={{
                        backgroundColor: '#475569',
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        boxShadow: '0 4px 8px rgba(71, 85, 105, 0.3)',
                        border: '2px solid #64748b',
                        letterSpacing: '0.01em'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#334155'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#475569'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Actualizar</span>
                </button>
            </div>

            {/* Componente de Cursos */}
            <CursosComponent data={coursesData} />
            
            {/* Información del Estudiante */}
            {studentInfo && (
                <div className="mt-8 rounded-xl p-6 shadow-lg"
                     style={{
                         backgroundColor: '#cbd5e1',
                         border: '2px solid #94a3b8',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                     }}>
                    <div className="flex items-center mb-4">
                        <svg className="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-2xl font-extrabold text-gray-900" 
                            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.08)', letterSpacing: '-0.01em' }}>
                            Información del Estudiante
                        </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                            <p className="text-sm font-bold text-gray-600 mb-2" style={{ letterSpacing: '0.02em' }}>
                                NOMBRE COMPLETO
                            </p>
                            <p className="text-lg font-extrabold text-gray-900" 
                               style={{ textShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
                                {studentInfo.name}
                            </p>
                        </div>
                        
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                            <p className="text-sm font-bold text-gray-600 mb-2" style={{ letterSpacing: '0.02em' }}>
                                CÓDIGO DE ESTUDIANTE
                            </p>
                            <p className="text-lg font-extrabold text-gray-900" 
                               style={{ textShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
                                {studentInfo.studentCode}
                            </p>
                        </div>
                        
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                            <p className="text-sm font-bold text-gray-600 mb-2" style={{ letterSpacing: '0.02em' }}>
                                CARRERA PROFESIONAL
                            </p>
                            <p className="text-lg font-extrabold text-gray-900" 
                               style={{ textShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
                                {studentInfo.career}
                            </p>
                        </div>
                        
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
                            <p className="text-sm font-bold text-gray-600 mb-2" style={{ letterSpacing: '0.02em' }}>
                                SEMESTRE ACTUAL
                            </p>
                            <p className="text-lg font-extrabold text-gray-900" 
                               style={{ textShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
                                {studentInfo.currentSemester}° Semestre
                            </p>
                        </div>
                    </div>
                    
                    {/* Información adicional */}
                    <div className="mt-6 p-4 rounded-lg" 
                         style={{ 
                             backgroundColor: '#e0f2fe',
                             border: '2px solid #3b82f6',
                             boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
                         }}>
                        <div className="flex items-start">
                            <svg className="w-6 h-6 mr-3 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-base font-extrabold text-blue-900 mb-1" 
                                   style={{ textShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
                                    Información Verificada
                                </p>
                                <p className="text-sm font-semibold text-blue-800">
                                    Los datos mostrados corresponden a tu registro académico oficial. 
                                    Si encuentras alguna inconsistencia, contacta con la oficina de registros académicos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CursosPage;