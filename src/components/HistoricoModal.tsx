
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

interface HistoricoModalProps {
  onClose: () => void;
}

const HistoricoModal: React.FC<HistoricoModalProps> = ({ onClose }) => {
  const { getHistorico } = useUser();
  const [periodo, setPeriodo] = useState<7 | 15 | 30>(7);

  const historico = getHistorico(periodo);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const calcularTotais = () => {
    return historico.reduce(
      (acc, day) => ({
        agua: acc.agua + day.agua,
        cigarros: acc.cigarros + day.cigarros,
        refeicoes: acc.refeicoes + day.refeicoes.medias + day.refeicoes.grandes,
        podes: acc.podes + day.podes
      }),
      { agua: 0, cigarros: 0, refeicoes: 0, podes: 0 }
    );
  };

  const totais = calcularTotais();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">📊 Histórico</h2>
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

          {/* Resumo dos totais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totais.agua}ml</div>
                <div className="text-sm text-gray-500">Água total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{totais.cigarros}</div>
                <div className="text-sm text-gray-500">Cigarros</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{totais.refeicoes}</div>
                <div className="text-sm text-gray-500">Refeições</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{totais.podes}</div>
                <div className="text-sm text-gray-500">Podes</div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico detalhado */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico Detalhado - {periodo} dias</CardTitle>
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
                      <th className="text-center p-2">👟 Podes</th>
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
                        <td className="text-center p-2">{day.podes}</td>
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
