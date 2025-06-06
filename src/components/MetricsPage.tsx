
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MetricsPage = () => {
  const { getHistorico, getWeeklyStats, getSuggestions } = useUser();
  const weekData = getHistorico(7);
  const weekStats = getWeeklyStats();
  const suggestions = getSuggestions();

  // Preparar dados para gráficos
  const chartData = weekData.reverse().map(day => ({
    date: new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    agua: day.agua,
    cigarros: day.cigarros,
    refeicoes: day.refeicoes.medias + day.refeicoes.grandes,
    polichinelos: day.polichinelos
  }));

  return (
    <div className="space-y-6">
      {/* Sugestões Motivacionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💧</span>
              <span className="font-medium">Hidratação</span>
            </div>
            <p className={`text-sm ${suggestions.agua.color}`}>{suggestions.agua.message}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚬</span>
              <span className="font-medium">Cigarros</span>
            </div>
            <p className={`text-sm ${suggestions.cigarros.color}`}>{suggestions.cigarros.message}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👟</span>
              <span className="font-medium">Aquecimento</span>
            </div>
            <p className={`text-sm ${suggestions.polichinelos.color}`}>{suggestions.polichinelos.message}</p>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas da Semana */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Resumo da Semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{weekStats.agua}ml</div>
              <div className="text-sm text-gray-600">💧 Água Total</div>
              <div className="text-xs text-gray-500">Média: {Math.round(weekStats.agua / 7)}ml/dia</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{weekStats.cigarros}</div>
              <div className="text-sm text-gray-600">🚬 Cigarros</div>
              <div className="text-xs text-gray-500">Média: {(weekStats.cigarros / 7).toFixed(1)}/dia</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{weekStats.refeicoes}</div>
              <div className="text-sm text-gray-600">🍽️ Refeições</div>
              <div className="text-xs text-gray-500">Média: {(weekStats.refeicoes / 7).toFixed(1)}/dia</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{weekStats.polichinelos}</div>
              <div className="text-sm text-gray-600">👟 Polichinelos</div>
              <div className="text-xs text-gray-500">Média: {Math.round(weekStats.polichinelos / 7)}/dia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Água */}
      <Card>
        <CardHeader>
          <CardTitle>💧 Consumo de Água (7 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value}ml`, 'Água']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="agua" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>👟 Polichinelos por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, 'Polichinelos']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Bar dataKey="polichinelos" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🚬 Cigarros por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [value, 'Cigarros']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Bar dataKey="cigarros" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Meta de Progresso */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Plano de Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">💧 Meta de Hidratação</h4>
              <p className="text-sm text-green-700">
                Mantenha 2 litros por dia. Beber água regularmente melhora o metabolismo e energia.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">🚬 Redução Gradual</h4>
              <p className="text-sm text-red-700">
                Reduza 1 cigarro a cada 5 dias. Progresso sustentável é mais eficaz que paradas bruscas.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">👟 Aquecimento Diário</h4>
              <p className="text-sm text-purple-700">
                500 polichinelos por dia ativam a circulação e preparam o corpo para atividades.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsPage;
