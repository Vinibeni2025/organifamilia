
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';

const NotasSection = () => {
  const { currentData, updateData } = useUser();
  const [nota, setNota] = useState(currentData.notas || '');

  const salvarNota = () => {
    updateData('notas', nota);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          📝 Notas do Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Ex: Comi muito hoje porque fui numa festa..."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            maxLength={100}
            className="text-sm"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {nota.length}/100 caracteres
            </span>
            <Button 
              onClick={salvarNota}
              size="sm"
              disabled={nota === currentData.notas}
            >
              Salvar
            </Button>
          </div>
        </div>

        {currentData.notas && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Nota salva:</div>
            <div className="text-sm text-blue-800">{currentData.notas}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotasSection;
