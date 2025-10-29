// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // La configuración de escaneo de archivos debe ser correcta
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // DEFINICIÓN DE COLORES PERSONALIZADOS
      colors: {
        'app-red': '#B91C1C',     // Para 'Crítico' y alertas
        'app-green': '#10B981',   // Para 'Verde' y asistencia
        'app-yellow': '#F59E0B',  // Para 'Alerta' y tardanza
        'app-blue': '#2563EB',    // Para botones de acciones rápidas
      },
    },
  },
  plugins: [],
}