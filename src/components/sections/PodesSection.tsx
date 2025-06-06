
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const PodesSection = () => {
  const { currentData, updateData } = useUser();

  const addPodes = (count: number) => {
    updateData('podes', count);
  };

  const getProgressMessage = () => {
    if (currentData.podes === 0) return 'Comece sua contagem! 👟';
    if (currentData.podes < 100) return 'Aquecendo... 🔥';
    if (currentData.podes < 300) return 'Bom ritmo! 💪';
    if (currentData.podes < 500) return 'Excelente! ⭐';
    return 'Impressionante! 🚀';
  };

  const getProgressColor = () => {
    if (currentData.podes < 100) return 'text-gray-500';
    if (currentData.podes < 300) return 'text-blue-500';
    if (currentData.podes < 500) return 'text-green-500';
    return 'text-purple-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          👟 Podes de Chinelo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${getProgressColor()}`}>
            {currentData.podes}
          </div>
          <div className="text-sm text-gray-500">Podes hoje (24h)</div>
          <div className={`text-sm mt-1 ${getProgressColor()}`}>
            {getProgressMessage()}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => addPodes(50)}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            size="lg"
          >
            +50
          </Button>
          <Button 
            onClick={() => addPodes(100)}
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
            <span>{Math.min(Math.round((currentData.podes / 500) * 100), 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((currentData.podes / 500) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Meta sugerida: 500 podes</div>
        </div>

        {/* Dica */}
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          💡 Clique múltiplas vezes para contabilizar grandes sessões
        </div>
      </CardContent>
    </Card>
  );
};

export default PodesSection;
