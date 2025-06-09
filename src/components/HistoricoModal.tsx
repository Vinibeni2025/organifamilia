
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

interface HistoricoModalProps {
  onClose: () => void;
}

const HistoricoModal: React.FC<HistoricoModalProps> = ({ onClose }) => {
  const { getHistorico, getWeeklyStats } = useUser();
  const [periodo, setPeriodo] = useState<7 | 15 | 30>(7);

  const historico = getHistorico(periodo);
  const weeklyStats = getWeeklyStats();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      weekday: 'short'
    });
  };

  const calcularTotais = () => {
    return historico.reduce(
      (acc, day) => ({
        agua: acc.agua + day.agua,
        cigarros: acc.cigarros + day.cigarros,
        refeicoes: acc.refeicoes + day.refeicoes.medias + day.refeicoes.grandes,
        polichinelos: acc.polichinelos + day.polichinelos
      }),
      { agua: 0, cigarros: 0, refeicoes: 0, polichinelos: 0 }
    );
  };

  const calcularMedias = () => {
    const totais = calcularTotais();
    return {
      agua: Math.round(totais.agua / periodo),
      cigarros: Math.round((totais.cigarros / periodo) * 10) / 10,
      refeicoes: Math.round((totais.refeicoes / periodo) * 10) / 10,
      polichinelos: Math.round(totais.polichinelos / periodo)
    };
  };

  const totais = calcularTotais();
  const medias = calcularMedias();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">📊 Histórico e Estatísticas</h2>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="p-6">
          {/* Seletor de período */}
          <div className="mb-6">
            <div className="flex gap-2">
              {[7, 15, 30].map((days) => (
                <Button
                  key={days}
                  variant={periodo === days ? "default" : "outline"}
                  onClick={() => setPeriodo(days as 7 | 15 | 30)}
                >
                  {days} dias
                </Button>
              ))}
            </div>
          </div>

          {/* Estatísticas da semana atual */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>📈 Resumo da Semana (últimos 7 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{weeklyStats.agua}ml</div>
                  <div className="text-sm text-gray-500">Água total</div>
                  <div className="text-xs text-gray-400">Média: {Math.round(weeklyStats.agua/7)}ml/dia</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{weeklyStats.cigarros}</div>
                  <div className="text-sm text-gray-500">Cigarros</div>
                  <div className="text-xs text-gray-400">Média: {Math.round((weeklyStats.cigarros/7)*10)/10}/dia</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{weeklyStats.refeicoes}</div>
                  <div className="text-sm text-gray-500">Refeições</div>
                  <div className="text-xs text-gray-400">Média: {Math.round((weeklyStats.refeicoes/7)*10)/10}/dia</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{weeklyStats.polichinelos}</div>
                  <div className="text-sm text-gray-500">Polichinelos</div>
                  <div className="text-xs text-gray-400">Média: {Math.round(weeklyStats.polichinelos/7)}/dia</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo do período selecionado */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totais.agua}ml</div>
                <div className="text-sm text-gray-500">Água total</div>
                <div className="text-xs text-blue-500">Média: {medias.agua}ml/dia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{totais.cigarros}</div>
                <div className="text-sm text-gray-500">Cigarros</div>
                <div className="text-xs text-orange-500">Média: {medias.cigarros}/dia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{totais.refeicoes}</div>
                <div className="text-sm text-gray-500">Refeições</div>
                <div className="text-xs text-green-500">Média: {medias.refeicoes}/dia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{totais.polichinelos}</div>
                <div className="text-sm text-gray-500">Polichinelos</div>
                <div className="text-xs text-purple-500">Média: {medias.polichinelos}/dia</div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico detalhado */}
          <Card>
            <CardHeader>
              <CardTitle>🗓️ Histórico Detalhado - {periodo} dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Data</th>
                      <th className="text-center p-2">💧 Água</th>
                      <th className="text-center p-2">🚬 Cigarros</th>
                      <th className="text-center p-2">🍽️ Refeições</th>
                      <th className="text-center p-2">👟 Polichinelos</th>
                      <th className="text-left p-2">📝 Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((day) => (
                      <tr key={day.date} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{formatDate(day.date)}</td>
                        <td className="text-center p-2">{day.agua}ml</td>
                        <td className="text-center p-2">{day.cigarros}</td>
                        <td className="text-center p-2">
                          {day.refeicoes.medias + day.refeicoes.grandes}
                          <span className="text-xs text-gray-500 ml-1">
                            ({day.refeicoes.medias}M/{day.refeicoes.grandes}G)
                          </span>
                        </td>
                        <td className="text-center p-2">{day.polichinelos}</td>
                        <td className="p-2 text-xs max-w-40">
                          {day.notas ? (
                            <span className="text-gray-600 truncate block" title={day.notas}>
                              {day.notas}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistoricoModal;
