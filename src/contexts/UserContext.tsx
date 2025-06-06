
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DailyData {
  date: string;
  agua: number; // em ml
  cigarros: number;
  refeicoes: { medias: number; grandes: number };
  podes: number;
  notas?: string;
}

interface UserContextType {
  currentData: DailyData;
  updateData: (category: string, value: any) => void;
  getHistorico: (days: number) => DailyData[];
  sectionsEnabled: {
    agua: boolean;
    cigarros: boolean;
    refeicoes: boolean;
    podes: boolean;
  };
  toggleSection: (section: string) => void;
  getWeeklyStats: () => {
    agua: number;
    cigarros: number;
    refeicoes: number;
    podes: number;
  };
  getDailyProgress: () => {
    agua: number;
    cigarros: number;
    refeicoes: number;
    podes: number;
  };
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
  
  const [currentData, setCurrentData] = useState<DailyData>({
    date: today,
    agua: 0,
    cigarros: 0,
    refeicoes: { medias: 0, grandes: 0 },
    podes: 0,
    notas: ''
  });

  const [sectionsEnabled, setSectionsEnabled] = useState({
    agua: true,
    cigarros: true,
    refeicoes: true,
    podes: true
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
      case 'podes':
        newData.podes += value;
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
          podes: 0
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
        podes: acc.podes + day.podes
      }),
      { agua: 0, cigarros: 0, refeicoes: 0, podes: 0 }
    );
  };

  const getDailyProgress = () => {
    const metas = {
      agua: 2000, // 2L
      cigarros: 0, // ideal seria 0
      refeicoes: 3, // 3 refeições por dia
      podes: 500 // meta de 500 podes
    };

    return {
      agua: Math.min((currentData.agua / metas.agua) * 100, 100),
      cigarros: currentData.cigarros === 0 ? 100 : Math.max(100 - (currentData.cigarros * 20), 0),
      refeicoes: Math.min(((currentData.refeicoes.medias + currentData.refeicoes.grandes) / metas.refeicoes) * 100, 100),
      podes: Math.min((currentData.podes / metas.podes) * 100, 100)
    };
  };

  return (
    <UserContext.Provider value={{
      currentData,
      updateData,
      getHistorico,
      sectionsEnabled,
      toggleSection,
      getWeeklyStats,
      getDailyProgress
    }}>
      {children}
    </UserContext.Provider>
  );
};
