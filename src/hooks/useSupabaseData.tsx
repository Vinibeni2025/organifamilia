
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
<<<<<<< HEAD
import { useAuth } from './useCustomAuth';
=======
import { useAuth } from './useAuth';
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e

interface DailyData {
  id: string;
  date: string;
  agua: number;
  cigarros: number;
  refeicoes_medias: number;
  refeicoes_grandes: number;
  polichinelos: number;
  notas: string | null;
}

interface UserSections {
  agua: boolean;
  cigarros: boolean;
  refeicoes: boolean;
  polichinelos: boolean;
}

interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  date_added: string;
}

interface ShoppingList {
  id: string;
  month: string;
  items: ShoppingItem[];
}

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [sectionsEnabled, setSectionsEnabled] = useState<UserSections>({
    agua: true,
    cigarros: true,
    refeicoes: true,
    polichinelos: true
  });
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Load today's data and user sections
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      
      // Load today's daily data
      const { data: todayData } = await supabase
        .from('daily_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (todayData) {
        setDailyData(todayData);
      } else {
        // Create today's record if it doesn't exist
        const newData = {
          user_id: user.id,
          date: today,
          agua: 0,
          cigarros: 0,
          refeicoes_medias: 0,
          refeicoes_grandes: 0,
          polichinelos: 0,
          notas: null
        };
        
        const { data: created } = await supabase
          .from('daily_data')
          .insert(newData)
          .select()
          .single();
        
        if (created) setDailyData(created);
      }

      // Load user sections
      const { data: sections } = await supabase
        .from('user_sections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (sections) {
        setSectionsEnabled({
          agua: sections.agua,
          cigarros: sections.cigarros,
          refeicoes: sections.refeicoes,
          polichinelos: sections.polichinelos
        });
      }

      setLoading(false);
    };

    loadData();
  }, [user, today]);

  const updateDailyData = async (field: string, value: any) => {
    if (!user || !dailyData) return;

    let updateData: any = {};
    
    switch (field) {
      case 'agua':
      case 'cigarros':
      case 'polichinelos':
        updateData[field] = dailyData[field as keyof DailyData] + value;
        break;
      case 'refeicoes':
        updateData = {
          refeicoes_medias: value.medias !== undefined ? value.medias : dailyData.refeicoes_medias,
          refeicoes_grandes: value.grandes !== undefined ? value.grandes : dailyData.refeicoes_grandes
        };
        break;
      case 'notas':
        updateData.notas = value;
        break;
    }

    const { data: updated } = await supabase
      .from('daily_data')
      .update(updateData)
      .eq('id', dailyData.id)
      .select()
      .single();

    if (updated) {
      setDailyData(updated);
    }
  };

  const toggleSection = async (section: string) => {
    if (!user) return;

    const newValue = !sectionsEnabled[section as keyof UserSections];
    
    await supabase
      .from('user_sections')
      .update({ [section]: newValue })
      .eq('user_id', user.id);

    setSectionsEnabled(prev => ({
      ...prev,
      [section]: newValue
    }));
  };

  const getHistorico = async (days: number) => {
    if (!user) return [];

    const { data } = await supabase
      .from('daily_data')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(days);

    return data || [];
  };

  const getCurrentMonthShoppingList = async (): Promise<ShoppingList> => {
    if (!user) return { id: '', month: currentMonth, items: [] };

    // Get or create shopping list for current month
    let { data: list } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .single();

    if (!list) {
      const { data: newList } = await supabase
        .from('shopping_lists')
        .insert({ user_id: user.id, month: currentMonth })
        .select()
        .single();
      list = newList;
    }

    if (!list) return { id: '', month: currentMonth, items: [] };

    // Get items for this list
    const { data: items } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('shopping_list_id', list.id)
      .order('date_added', { ascending: false });

    return {
      id: list.id,
      month: list.month,
      items: items || []
    };
  };

  const addShoppingItem = async (text: string) => {
    const list = await getCurrentMonthShoppingList();
    if (!list.id) return;

    await supabase
      .from('shopping_items')
      .insert({
        shopping_list_id: list.id,
        text: text.trim(),
        completed: false
      });
  };

  const toggleShoppingItem = async (itemId: string) => {
    const { data: item } = await supabase
      .from('shopping_items')
      .select('completed')
      .eq('id', itemId)
      .single();

    if (item) {
      await supabase
        .from('shopping_items')
        .update({ completed: !item.completed })
        .eq('id', itemId);
    }
  };

  const removeShoppingItem = async (itemId: string) => {
    await supabase
      .from('shopping_items')
      .delete()
      .eq('id', itemId);
  };

  return {
    dailyData,
    sectionsEnabled,
    loading,
    updateDailyData,
    toggleSection,
    getHistorico,
    getCurrentMonthShoppingList,
    addShoppingItem,
    toggleShoppingItem,
    removeShoppingItem
  };
};
