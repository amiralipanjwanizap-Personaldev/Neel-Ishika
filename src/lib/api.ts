import { supabase } from './supabase';

/**
 * Fetches the global wedding settings.
 * Since it's a singleton, we take the first row.
 */
export async function getSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching settings:', error);
    }
    return data || null;
  } catch (err) {
    console.error('Unexpected error fetching settings:', err);
    return null;
  }
}

/**
 * Fetches all wedding events sorted by date and time.
 */
export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
    return [];
  }
}

/**
 * Fetches the story milestones sorted by order_index.
 */
export async function getStory() {
  try {
    const { data, error } = await supabase
      .from('story')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching story:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching story:', err);
    return [];
  }
}

/**
 * Fetches the travel and stay information.
 * Singleton table.
 */
export async function getTravelInfo() {
  try {
    const { data, error } = await supabase
      .from('travel_info')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching travel info:', error);
    }
    return data || null;
  } catch (err) {
    console.error('Unexpected error fetching travel info:', err);
    return null;
  }
}

/**
 * Fetches all gallery items sorted by creation date.
 */
export async function getGallery() {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching gallery:', err);
    return [];
  }
}
