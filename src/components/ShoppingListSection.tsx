
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Check, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const ShoppingListSection: React.FC = () => {
  const { getCurrentMonthShoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem } = useUser();
  const [newItemText, setNewItemText] = useState('');
  const [shoppingList, setShoppingList] = useState(getCurrentMonthShoppingList());

  const handleAddItem = () => {
    if (newItemText.trim()) {
      addShoppingItem(newItemText);
      setNewItemText('');
      setShoppingList(getCurrentMonthShoppingList());
    }
  };

  const handleToggleItem = (itemId: string) => {
    toggleShoppingItem(itemId);
    setShoppingList(getCurrentMonthShoppingList());
  };

  const handleRemoveItem = (itemId: string) => {
    removeShoppingItem(itemId);
    setShoppingList(getCurrentMonthShoppingList());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const getMonthName = (monthString: string) => {
    const date = new Date(monthString + '-01');
    return date.toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const completedCount = shoppingList.items.filter(item => item.completed).length;
  const totalCount = shoppingList.items.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🛒 Lista de Compras - {getMonthName(shoppingList.month)}
        </CardTitle>
        {totalCount > 0 && (
          <div className="text-sm text-gray-600">
            {completedCount} de {totalCount} itens concluídos
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Adicionar novo item */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Digite o item que deseja comprar..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Lista de itens */}
        {shoppingList.items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>Nenhum item na lista ainda.</p>
            <p className="text-sm">Adicione itens que deseja comprar este mês!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shoppingList.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                  item.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleItem(item.id)}
                  className={`h-8 w-8 rounded-full ${
                    item.completed 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'border-2 border-gray-300 hover:border-green-500'
                  }`}
                >
                  {item.completed && <Check className="h-4 w-4" />}
                </Button>
                
                <span 
                  className={`flex-1 ${
                    item.completed 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-900'
                  }`}
                >
                  {item.text}
                </span>
                
                <div className="text-xs text-gray-400">
                  {new Date(item.dateAdded).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        {totalCount > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Progresso:</span>
              <span className="font-medium">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingListSection;
