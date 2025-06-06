
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

const RefeicoesSection = () => {
  const { currentData, updateData } = useUser();

  const addRefeicao = (tipo: 'medias' | 'grandes') => {
    const newValue = { [tipo]: currentData.refeicoes[tipo] + 1 };
    updateData('refeicoes', newValue);
  };

  const getTotalRefeicoes = () => {
    return currentData.refeicoes.medias + currentData.refeicoes.grandes;
  };

  const getProporcoesMessage = () => {
    const total = getTotalRefeicoes();
    if (total === 0) return 'Nenhuma refeição registrada hoje';
    
    const percentGrandes = Math.round((currentData.refeicoes.grandes / total) * 100);
    
    if (percentGrandes > 60) return 'Muitas refeições grandes! ⚠️';
    if (percentGrandes > 30) return 'Equilíbrio moderado 📊';
    return 'Ótimo controle! 💚';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          🍽️ Refeições
          <span className="text-sm font-normal text-gray-500">
            (Foco: ganho de peso)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {currentData.refeicoes.medias}
            </div>
            <div className="text-xs text-gray-500">Médias</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {currentData.refeicoes.grandes}
            </div>
            <div className="text-xs text-gray-500">Grandes</div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">
            Total: {getTotalRefeicoes()} refeições
          </div>
          <div className="text-xs text-gray-500">
            {getProporcoesMessage()}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={() => addRefeicao('medias')}
            className="w-full bg-green-500 hover:bg-green-600"
            size="lg"
          >
            + Refeição Média
          </Button>
          <Button 
            onClick={() => addRefeicao('grandes')}
            className="w-full bg-orange-500 hover:bg-orange-600"
            size="lg"
          >
            + Refeição Grande
          </Button>
        </div>

        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <div><strong>Média:</strong> refeição normal, pouca bebida</div>
          <div><strong>Grande:</strong> refeição + sobremesa + refrigerante</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RefeicoesSection;
