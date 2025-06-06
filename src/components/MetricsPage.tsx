
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MetricsPage = () => {
  const { getHistorico, getWeeklyStats, getSuggestions, currentData } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>('');
  
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

  // Relatório do dia selecionado
  const selectedDayData = selectedDate ? 
    getHistorico(30).find(day => day.date === selectedDate) : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      weekday: 'long'
    });
  };

  const generateDateOptions = () => {
    const options = [];
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      options.push({
        value: dateStr,
        label: formatDate(dateStr)
      });
    }
    return options;
  };

  return (
    <div className="space-y-6">
      {/* Relatório do Dia Atual */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕒 Relatório de Hoje - {formatDate(new Date().toISOString().split('T')[0])}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentData.agua}ml</div>
              <div className="text-sm text-gray-600">💧 Água consumida</div>
              <div className="text-xs text-gray-500">
                {currentData.agua >= 2000 ? '✅ Meta atingida!' : `Faltam ${2000 - currentData.agua}ml`}
              </div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{currentData.cigarros}</div>
              <div className="text-sm text-gray-600">🚬 Cigarros</div>
              <div className="text-xs text-gray-500">
                {currentData.cigarros === 0 ? '🌟 Parabéns!' : 'Reduza gradualmente'}
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {currentData.refeicoes.medias + currentData.refeicoes.grandes}
              </div>
              <div className="text-sm text-gray-600">🍽️ Refeições</div>
              <div className="text-xs text-gray-500">
                {currentData.refeicoes.medias}M / {currentData.refeicoes.grandes}G
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentData.polichinelos}</div>
              <div className="text-sm text-gray-600">👟 Polichinelos</div>
              <div className="text-xs text-gray-500">
                {currentData.polichinelos >= 500 ? '🚀 Meta superada!' : `${500 - currentData.polichinelos} restantes`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatório de Dia Anterior para Análise */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Análise de Dia Anterior
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Selecionar data para análise:</label>
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Escolha uma data...</option>
              {generateDateOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectedDayData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedDayData.agua}ml</div>
                <div className="text-sm text-gray-600">💧 Água</div>
                <div className="text-xs text-gray-500">
                  {selectedDayData.agua >= 2000 ? 'Meta atingida ✅' : `Déficit: ${2000 - selectedDayData.agua}ml`}
                </div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{selectedDayData.cigarros}</div>
                <div className="text-sm text-gray-600">🚬 Cigarros</div>
                <div className="text-xs text-gray-500">
                  {selectedDayData.cigarros === 0 ? 'Dia livre! 🌟' : 'Trabalhe na redução'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedDayData.refeicoes.medias + selectedDayData.refeicoes.grandes}
                </div>
                <div className="text-sm text-gray-600">🍽️ Refeições</div>
                <div className="text-xs text-gray-500">
                  {selectedDayData.refeicoes.medias}M / {selectedDayData.refeicoes.grandes}G
                </div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedDayData.polichinelos}</div>
                <div className="text-sm text-gray-600">👟 Polichinelos</div>
                <div className="text-xs text-gray-500">
                  {selectedDayData.polichinelos >= 500 ? 'Excelente! 🚀' : 'Aquecimento leve'}
                </div>
              </div>
            </div>
          )}

          {selectedDayData?.notas && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-1">📝 Notas do dia:</h4>
              <p className="text-sm text-gray-600">{selectedDayData.notas}</p>
            </div>
          )}
        </CardContent>
      </Card>

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
