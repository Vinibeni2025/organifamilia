
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const CigarrosSection = () => {
  const { currentData, updateData } = useUser();

  const addCigarros = (count: number) => {
    updateData('cigarros', count);
  };

  const getStatusColor = () => {
    if (currentData.cigarros === 0) return 'text-green-600';
    if (currentData.cigarros <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusMessage = () => {
    if (currentData.cigarros === 0) return 'Parabéns! Dia livre 🎉';
    if (currentData.cigarros <= 5) return 'Quantidade moderada ⚠️';
    return 'Muitos cigarros hoje ❗';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          🚬 Cigarros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold mb-2 ${getStatusColor()}`}>
            {currentData.cigarros}
          </div>
          <div className="text-sm text-gray-500">Cigarros hoje</div>
          <div className={`text-sm mt-1 ${getStatusColor()}`}>
            {getStatusMessage()}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => addCigarros(1)}
            className="flex-1"
            variant="outline"
            size="lg"
          >
            +1 cigarro
          </Button>
          <Button 
            onClick={() => addCigarros(2)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            +2 cigarros
          </Button>
        </div>

        {/* Histórico da semana */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-2">Esta semana</div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div key={day} className="flex-1 h-2 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CigarrosSection;
