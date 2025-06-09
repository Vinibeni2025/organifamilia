
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';

const ProgressSection = () => {
  const { getDailyProgress, sectionsEnabled } = useUser();
  const progress = getDailyProgress();

  const progressItems = [
    { 
      name: 'Água', 
      value: progress.agua, 
      icon: '💧', 
      enabled: sectionsEnabled.agua,
      color: 'bg-blue-500' 
    },
    { 
      name: 'Cigarros', 
      value: progress.cigarros, 
      icon: '🚬', 
      enabled: sectionsEnabled.cigarros,
      color: 'bg-green-500' 
    },
    { 
      name: 'Refeições', 
      value: progress.refeicoes, 
      icon: '🍽️', 
      enabled: sectionsEnabled.refeicoes,
      color: 'bg-orange-500' 
    },
    { 
      name: 'Polichinelos', 
      value: progress.polichinelos, 
      icon: '👟', 
      enabled: sectionsEnabled.polichinelos,
      color: 'bg-purple-500' 
    }
  ].filter(item => item.enabled);

  if (progressItems.length === 0) {
    return null;
  }

  const mediaProgress = progressItems.reduce((acc, item) => acc + item.value, 0) / progressItems.length;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          📊 Progresso do Dia
          <span className="text-sm font-normal text-gray-500">
            ({Math.round(mediaProgress)}% geral)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {progressItems.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center gap-1">
                {item.icon} {item.name}
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(item.value)}%
              </span>
            </div>
            <Progress value={item.value} className="h-2" />
          </div>
        ))}

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-2">Metas diárias:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {sectionsEnabled.agua && <div>💧 Água: 2000ml</div>}
            {sectionsEnabled.cigarros && <div>🚬 Cigarros: 0</div>}
            {sectionsEnabled.refeicoes && <div>🍽️ Refeições: 3</div>}
            {sectionsEnabled.polichinelos && <div>👟 Polichinelos: 500</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressSection;
