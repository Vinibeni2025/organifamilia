
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const PolichinelosSection = () => {
  const { currentData, updateData } = useUser();

  const addPolichinelos = (count: number) => {
    updateData('polichinelos', count);
  };

  const getProgressMessage = () => {
    if (currentData.polichinelos === 0) return 'Comece seu aquecimento! 👟';
    if (currentData.polichinelos < 100) return 'Aquecendo... 🔥';
    if (currentData.polichinelos < 300) return 'Bom ritmo! 💪';
    if (currentData.polichinelos < 500) return 'Excelente! ⭐';
    return 'Impressionante! 🚀';
  };

  const getProgressColor = () => {
    if (currentData.polichinelos < 100) return 'text-gray-500';
    if (currentData.polichinelos < 300) return 'text-blue-500';
    if (currentData.polichinelos < 500) return 'text-green-500';
    return 'text-purple-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          👟 Polichinelos de Aquecimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${getProgressColor()}`}>
            {currentData.polichinelos}
          </div>
          <div className="text-sm text-gray-500">Polichinelos hoje (24h)</div>
          <div className={`text-sm mt-1 ${getProgressColor()}`}>
            {getProgressMessage()}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => addPolichinelos(25)}
            className="flex-1 bg-green-500 hover:bg-green-600"
            size="lg"
          >
            +25
          </Button>
          <Button 
            onClick={() => addPolichinelos(50)}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            size="lg"
          >
            +50
          </Button>
          <Button 
            onClick={() => addPolichinelos(100)}
            className="flex-1 bg-purple-500 hover:bg-purple-600"
            size="lg"
          >
            +100
          </Button>
        </div>

        {/* Barra de progresso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso</span>
            <span>{Math.min(Math.round((currentData.polichinelos / 500) * 100), 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((currentData.polichinelos / 500) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Meta sugerida: 500 polichinelos</div>
        </div>

        {/* Dica */}
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          💡 Polichinelos ajudam a aquecer o corpo e ativar a circulação
        </div>
      </CardContent>
    </Card>
  );
};

export default PolichinelosSection;
