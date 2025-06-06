
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DailyData {
  date: string;
  agua: number; // em ml
  cigarros: number;
  refeicoes: { medias: number; grandes: number };
  polichinelos: number;
  notas?: string;
}

interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  dateAdded: string;
}

interface MonthlyShoppingList {
  month: string; // formato: "2024-01"
  items: ShoppingItem[];
}

interface UserContextType {
  currentData: DailyData;
  updateData: (category: string, value: any) => void;
  getHistorico: (days: number) => DailyData[];
  sectionsEnabled: {
    agua: boolean;
    cigarros: boolean;
    refeicoes: boolean;
    polichinelos: boolean;
  };
  toggleSection: (section: string) => void;
  getWeeklyStats: () => {
    agua: number;
    cigarros: number;
    refeicoes: number;
    polichinelos: number;
  };
  getDailyProgress: () => {
    agua: number;
    cigarros: number;
    refeicoes: number;
    polichinelos: number;
  };
  getSuggestions: () => {
    agua: { message: string; color: string };
    cigarros: { message: string; color: string };
    polichinelos: { message: string; color: string };
  };
  // Shopping list functions
  getCurrentMonthShoppingList: () => MonthlyShoppingList;
  addShoppingItem: (text: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  removeShoppingItem: (itemId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7); // "2024-01"
  
  const [currentData, setCurrentData] = useState<DailyData>({
    date: today,
    agua: 0,
    cigarros: 0,
    refeicoes: { medias: 0, grandes: 0 },
    polichinelos: 0,
    notas: ''
  });

  const [sectionsEnabled, setSectionsEnabled] = useState({
    agua: true,
    cigarros: true,
    refeicoes: true,
    polichinelos: true
  });

  useEffect(() => {
    // Carrega dados do dia atual do localStorage
    const savedData = localStorage.getItem(`loginMaster_${today}`);
    const savedSections = localStorage.getItem('loginMaster_sections');
    
    if (savedData) {
      setCurrentData(JSON.parse(savedData));
    }
    
    if (savedSections) {
      setSectionsEnabled(JSON.parse(savedSections));
    }
  }, [today]);

  const updateData = (category: string, value: any) => {
    const newData = { ...currentData };
    
    switch (category) {
      case 'agua':
        newData.agua += value;
        break;
      case 'cigarros':
        newData.cigarros += value;
        break;
      case 'refeicoes':
        newData.refeicoes = { ...newData.refeicoes, ...value };
        break;
      case 'polichinelos':
        newData.polichinelos += value;
        break;
      case 'notas':
        newData.notas = value;
        break;
    }
    
    setCurrentData(newData);
    localStorage.setItem(`loginMaster_${today}`, JSON.stringify(newData));
  };

  const toggleSection = (section: string) => {
    const newSections = { ...sectionsEnabled, [section]: !sectionsEnabled[section as keyof typeof sectionsEnabled] };
    setSectionsEnabled(newSections);
    localStorage.setItem('loginMaster_sections', JSON.stringify(newSections));
  };

  const getHistorico = (days: number): DailyData[] => {
    const historico: DailyData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const savedData = localStorage.getItem(`loginMaster_${dateStr}`);
      if (savedData) {
        historico.push(JSON.parse(savedData));
      } else {
        historico.push({
          date: dateStr,
          agua: 0,
          cigarros: 0,
          refeicoes: { medias: 0, grandes: 0 },
          polichinelos: 0
        });
      }
    }
    
    return historico;
  };

  const getWeeklyStats = () => {
    const weekData = getHistorico(7);
    return weekData.reduce(
      (acc, day) => ({
        agua: acc.agua + day.agua,
        cigarros: acc.cigarros + day.cigarros,
        refeicoes: acc.refeicoes + day.refeicoes.medias + day.refeicoes.grandes,
        polichinelos: acc.polichinelos + day.polichinelos
      }),
      { agua: 0, cigarros: 0, refeicoes: 0, polichinelos: 0 }
    );
  };

  const getDailyProgress = () => {
    const metas = {
      agua: 2000, // 2L
      cigarros: 0, // ideal seria 0
      refeicoes: 3, // 3 refeições por dia
      polichinelos: 500 // meta de 500 polichinelos
    };

    return {
      agua: Math.min((currentData.agua / metas.agua) * 100, 100),
      cigarros: currentData.cigarros === 0 ? 100 : Math.max(100 - (currentData.cigarros * 20), 0),
      refeicoes: Math.min(((currentData.refeicoes.medias + currentData.refeicoes.grandes) / metas.refeicoes) * 100, 100),
      polichinelos: Math.min((currentData.polichinelos / metas.polichinelos) * 100, 100)
    };
  };

  const getSuggestions = () => {
    const weekData = getHistorico(7);
    const avgCigarros = weekData.reduce((acc, day) => acc + day.cigarros, 0) / 7;
    const avgAgua = weekData.reduce((acc, day) => acc + day.agua, 0) / 7;
    
    const suggestions = {
      agua: { message: '', color: '' },
      cigarros: { message: '', color: '' },
      polichinelos: { message: '', color: '' }
    };

    // Sugestões para água
    if (currentData.agua >= 2000) {
      suggestions.agua = { 
        message: "🎉 Excelente! Você atingiu sua meta de hidratação hoje!", 
        color: "text-green-600" 
      };
    } else if (currentData.agua >= 1500) {
      suggestions.agua = { 
        message: "💪 Quase lá! Faltam apenas " + (2000 - currentData.agua) + "ml para sua meta!", 
        color: "text-blue-600" 
      };
    } else {
      suggestions.agua = { 
        message: "💧 Hidrate-se! Beba mais água para atingir os 2L diários.", 
        color: "text-orange-600" 
      };
    }

    // Sugestões para cigarros
    const targetCigarros = Math.max(0, Math.floor(avgCigarros - 0.2)); // Reduzir 1 a cada 5 dias
    if (currentData.cigarros === 0) {
      suggestions.cigarros = { 
        message: "🌟 Perfeito! Dia livre de cigarros. Continue assim!", 
        color: "text-green-600" 
      };
    } else if (currentData.cigarros <= targetCigarros) {
      suggestions.cigarros = { 
        message: "👍 Você está progredindo! Reduzindo gradualmente é o caminho.", 
        color: "text-blue-600" 
      };
    } else {
      suggestions.cigarros = { 
        message: "⚠️ Tente reduzir gradualmente. Meta: máximo " + targetCigarros + " por dia.", 
        color: "text-red-600" 
      };
    }

    // Sugestões para polichinelos
    if (currentData.polichinelos >= 500) {
      suggestions.polichinelos = { 
        message: "🚀 Incrível! Você superou a meta de aquecimento hoje!", 
        color: "text-purple-600" 
      };
    } else if (currentData.polichinelos >= 250) {
      suggestions.polichinelos = { 
        message: "🔥 Bom ritmo! Continue se aquecendo para atingir os 500.", 
        color: "text-orange-600" 
      };
    } else {
      suggestions.polichinelos = { 
        message: "👟 Comece a se aquecer! Faça alguns polichinelos para ativar o corpo.", 
        color: "text-gray-600" 
      };
    }

    return suggestions;
  };

  // Shopping list functions
  const getCurrentMonthShoppingList = (): MonthlyShoppingList => {
    const saved = localStorage.getItem(`loginMaster_shopping_${currentMonth}`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      month: currentMonth,
      items: []
    };
  };

  const addShoppingItem = (text: string) => {
    const currentList = getCurrentMonthShoppingList();
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      dateAdded: new Date().toISOString()
    };
    
    const updatedList = {
      ...currentList,
      items: [...currentList.items, newItem]
    };
    
    localStorage.setItem(`loginMaster_shopping_${currentMonth}`, JSON.stringify(updatedList));
  };

  const toggleShoppingItem = (itemId: string) => {
    const currentList = getCurrentMonthShoppingList();
    const updatedItems = currentList.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    
    const updatedList = {
      ...currentList,
      items: updatedItems
    };
    
    localStorage.setItem(`loginMaster_shopping_${currentMonth}`, JSON.stringify(updatedList));
  };

  const removeShoppingItem = (itemId: string) => {
    const currentList = getCurrentMonthShoppingList();
    const updatedItems = currentList.items.filter(item => item.id !== itemId);
    
    const updatedList = {
      ...currentList,
      items: updatedItems
    };
    
    localStorage.setItem(`loginMaster_shopping_${currentMonth}`, JSON.stringify(updatedList));
  };

  return (
    <UserContext.Provider value={{
      currentData,
      updateData,
      getHistorico,
      sectionsEnabled,
      toggleSection,
      getWeeklyStats,
      getDailyProgress,
      getSuggestions,
      getCurrentMonthShoppingList,
      addShoppingItem,
      toggleShoppingItem,
      removeShoppingItem
    }}>
      {children}
    </UserContext.Provider>
  );
};
