
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/contexts/UserContext';
import AguaSection from './sections/AguaSection';
import CigarrosSection from './sections/CigarrosSection';
import RefeicoesSection from './sections/RefeicoesSection';
import PolichinelosSection from './sections/PolichinelosSection';
import NotasSection from './NotasSection';
import ProgressSection from './ProgressSection';
import HistoricoModal from './HistoricoModal';
import MetricsPage from './MetricsPage';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { sectionsEnabled, toggleSection } = useUser();
  const [showHistorico, setShowHistorico] = useState(false);
  const [currentPage, setCurrentPage] = useState('inicio'); // 'inicio' ou 'metricas'

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Sao_Paulo'
    });
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  };

  const renderContent = () => {
    if (currentPage === 'metricas') {
      return <MetricsPage />;
    }

    return (
      <>
        {/* Data e Hora */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{formatDate()}</h2>
              <p className="text-lg opacity-90">{formatTime()} - Horário de Brasília</p>
            </div>
          </CardContent>
        </Card>

        {/* Controles de Seções */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>⚙️ Controle de Seções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(sectionsEnabled).map(([section, enabled]) => (
                <div key={section} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium capitalize">
                    {section === 'agua' && '💧 Água'}
                    {section === 'cigarros' && '🚬 Cigarros'}
                    {section === 'refeicoes' && '🍽️ Refeições'}
                    {section === 'polichinelos' && '👟 Polichinelos'}
                  </span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => toggleSection(section)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progresso Diário */}
        <div className="mb-6">
          <ProgressSection />
        </div>

        {/* Seções Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {sectionsEnabled.agua && <AguaSection />}
          {sectionsEnabled.cigarros && <CigarrosSection />}
          {sectionsEnabled.refeicoes && <RefeicoesSection />}
          {sectionsEnabled.polichinelos && <PolichinelosSection />}
        </div>

        {/* Notas */}
        <div className="mb-6">
          <NotasSection />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🛡️ Login Master</h1>
              <p className="text-sm text-gray-500">Dashboard Pessoal - Vinícius</p>
            </div>
            
            {/* Menu de Navegação */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={currentPage === 'inicio' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage('inicio')}
                  className="px-4"
                >
                  🏠 Início
                </Button>
                <Button
                  variant={currentPage === 'metricas' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage('metricas')}
                  className="px-4"
                >
                  📊 Métricas
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setShowHistorico(true)}
                className="hidden sm:inline-flex"
              >
                📈 Histórico
              </Button>
              
              <Button variant="outline" onClick={onLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <div className="sm:hidden bg-white border-b">
        <div className="flex justify-center gap-1 p-2">
          <Button
            variant={currentPage === 'inicio' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentPage('inicio')}
            className="flex-1"
          >
            🏠 Início
          </Button>
          <Button
            variant={currentPage === 'metricas' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentPage('metricas')}
            className="flex-1"
          >
            📊 Métricas
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}

        {/* Botão móvel para histórico */}
        <div className="fixed bottom-6 right-6 sm:hidden">
          <Button
            onClick={() => setShowHistorico(true)}
            className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            📈
          </Button>
        </div>
      </div>

      {showHistorico && (
        <HistoricoModal onClose={() => setShowHistorico(false)} />
      )}
    </div>
  );
};

export default Dashboard;
