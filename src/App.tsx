/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Layout } from './components/Layout';
import { ModuleSkeleton } from './components/ModuleSkeleton';
import { useThemeStore } from './store/useThemeStore';
import { registerServiceWorker } from './registerSW';
import { WifiOff, Download, Sparkles } from 'lucide-react';
import { useToast } from './context/ToastContext';

// Dynamic lazy imports for code splitting and initial bundle optimization
const HomeDashboard = lazy(() => import('./views/HomeDashboard').then(m => ({ default: m.HomeDashboard })));
const ReyIDDashboard = lazy(() => import('./views/ReyIDDashboard').then(m => ({ default: m.ReyIDDashboard })));
const UnionLiveDashboard = lazy(() => import('./views/UnionLiveDashboard').then(m => ({ default: m.UnionLiveDashboard })));
const ReyplaceProDashboard = lazy(() => import('./views/ReyplaceProDashboard').then(m => ({ default: m.ReyplaceProDashboard })));
const MarketplaceDashboard = lazy(() => import('./views/MarketplaceDashboard').then(m => ({ default: m.MarketplaceDashboard })));
const BusinessDashboard = lazy(() => import('./views/BusinessDashboard').then(m => ({ default: m.BusinessDashboard })));
const LogisticsDashboard = lazy(() => import('./views/LogisticsDashboard').then(m => ({ default: m.LogisticsDashboard })));
const ProfessionalProfile = lazy(() => import('./views/ProfessionalProfile').then(m => ({ default: m.ProfessionalProfile })));
const ReycoinDashboard = lazy(() => import('./views/ReycoinDashboard').then(m => ({ default: m.ReycoinDashboard })));
const NewsDashboard = lazy(() => import('./views/NewsDashboard').then(m => ({ default: m.NewsDashboard })));
const SmartCityDashboard = lazy(() => import('./views/SmartCityDashboard').then(m => ({ default: m.SmartCityDashboard })));
const CommunityDashboard = lazy(() => import('./views/CommunityDashboard').then(m => ({ default: m.CommunityDashboard })));
const AcademyDashboard = lazy(() => import('./views/AcademyDashboard').then(m => ({ default: m.AcademyDashboard })));
const ERPDashboard = lazy(() => import('./views/ERPDashboard').then(m => ({ default: m.ERPDashboard })));
const GovernmentDashboard = lazy(() => import('./views/GovernmentDashboard').then(m => ({ default: m.GovernmentDashboard })));
const ReybotDashboard = lazy(() => import('./views/ReybotDashboard').then(m => ({ default: m.ReybotDashboard })));
const CupulaDashboard = lazy(() => import('./views/CupulaDashboard').then(m => ({ default: m.CupulaDashboard })));
const BlockchainDashboard = lazy(() => import('./views/BlockchainDashboard').then(m => ({ default: m.BlockchainDashboard })));
const InfrastructureDashboard = lazy(() => import('./views/InfrastructureDashboard').then(m => ({ default: m.InfrastructureDashboard })));
const ArchitectureDashboard = lazy(() => import('./views/ArchitectureDashboard').then(m => ({ default: m.ArchitectureDashboard })));

export default function App() {
  const [activeModule, setActiveModule] = useState('Inicio');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { toast } = useToast();
  const initThemeListener = useThemeStore((state) => state.initThemeListener);

  useEffect(() => {
    // Initialize persistent Theme store system listener
    const cleanupTheme = initThemeListener();

    // Register PWA Service Worker
    registerServiceWorker((offline) => {
      setIsOffline(offline);
      if (offline) {
        toast.info('Modo Offline Activado', 'Reyplace está operando con caché local en Cúpula.');
      } else {
        toast.success('Conexión Restablecida', 'Ecosistema sincronizado en tiempo real.');
      }
    });

    // Capture PWA installation event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      cleanupTheme();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, [toast, initThemeListener]);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('PWA Instalada', 'Reyplace se ha añadido a tu pantalla de inicio.');
      }
      setDeferredPrompt(null);
    } else {
      toast.info('Instalación PWA', 'Usa la opción "Añadir a pantalla de inicio" de tu navegador.');
    }
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'Inicio':
        return <HomeDashboard onNavigate={setActiveModule} />;
      case 'ReyID & Usuarios':
        return <ReyIDDashboard />;
      case 'Arquitectura & PM':
        return <ArchitectureDashboard />;
      case 'Unión.live':
        return <UnionLiveDashboard />;
      case 'Servicios Pro':
        return <ReyplaceProDashboard />;
      case 'Perfil Pro (Público)':
        return <ProfessionalProfile />;
      case 'Marketplace':
        return <MarketplaceDashboard />;
      case 'Negocios':
        return <BusinessDashboard />;
      case 'Logística':
        return <LogisticsDashboard />;
      case 'ERP Reyplace':
        return <ERPDashboard />;
      case 'Gobierno Digital':
        return <GovernmentDashboard />;
      case 'Pagos & Reycoin':
        return <ReycoinDashboard />;
      case 'Pro News':
        return <NewsDashboard />;
      case 'Smart City':
        return <SmartCityDashboard />;
      case 'Comunidad':
        return <CommunityDashboard />;
      case 'Academia':
        return <AcademyDashboard />;
      case 'Reybot AI':
        return <ReybotDashboard />;
      case 'Cúpula Digital':
        return <CupulaDashboard />;
      case 'Blockchain Layer':
        return <BlockchainDashboard />;
      case 'Infraestructura':
        return <InfrastructureDashboard />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500 p-8">
            <p>Módulo "{activeModule}" en desarrollo...</p>
          </div>
        );
    }
  };

  return (
    <Layout activeModule={activeModule} onModuleChange={setActiveModule}>
      {/* Offline Status Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-amber-400 text-xs font-mono flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
              <span>Modo Offline Activo: Operando con caché local Cúpula PWA. Los cambios se sincronizarán al reconectar.</span>
            </div>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">Sin Red</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Banner trigger option if available */}
      {deferredPrompt && (
        <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-4 py-2 text-cyan-400 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Instala Reyplace como Aplicación nativa PWA en tu dispositivo</span>
          </div>
          <button
            onClick={handleInstallPwa}
            className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-black px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Instalador PWA
          </button>
        </div>
      )}

      <Suspense fallback={<ModuleSkeleton />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            {renderActiveModule()}
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}



