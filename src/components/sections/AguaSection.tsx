
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const AguaSection = () => {
  const { currentData, updateData } = useUser();

  const addWater = (ml: number) => {
    updateData('agua', ml);
  };

  const getCopos = () => {
    return Math.floor(currentData.agua / 250); // Estimativa baseada em copo de 250ml
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          💧 Água
          <span className="text-sm font-normal text-gray-500">
            ({getCopos()} copos)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {currentData.agua}ml
          </div>
          <div className="text-sm text-gray-500">Total de hoje</div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => addWater(250)}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            size="lg"
          >
            +250ml
          </Button>
          <Button 
            onClick={() => addWater(300)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            +300ml
          </Button>
        </div>

        {/* Barra de progresso visual */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Meta diária</span>
            <span>{Math.min(Math.round((currentData.agua / 2000) * 100), 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((currentData.agua / 2000) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Meta: 2000ml (8 copos)</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AguaSection;
