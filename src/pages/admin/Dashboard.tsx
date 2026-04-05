import { useEffect, useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { Users, CheckCircle, XCircle, UserPlus, Calendar, Image as ImageIcon, BookOpen, Plane, Settings, Plus, Edit2, Trash2, MapPin, Clock, Shirt, Info, Save, X } from 'lucide-react';

interface RSVP {
  id: string;
  name: string;
  attending: boolean;
  plus_one: boolean;
  dietary_requirements: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  map_link: string;
  description: string;
  dress_code: string;
}

interface GalleryItem {
  id: string;
  file_url: string;
  type: 'image' | 'video';
  created_at: string;
}

interface StoryEntry {
  id: string;
  title: string;
  content: string;
  image_url: string;
  order_index: number;
}

interface TravelInfo {
  id: string;
  visa_link: string;
  insurance_link: string;
  airport_info: string;
  ferry_info: string;
}

interface Settings {
  id: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  music_url: string;
  music_enabled: boolean;
  wedding_date: string;
  tagline: string;
}

type Tab = 'dashboard' | 'events' | 'gallery' | 'story' | 'travel' | 'settings';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [storyEntries, setStoryEntries] = useState<StoryEntry[]>([]);
  const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Event Form State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    map_link: '',
    description: '',
    dress_code: ''
  });

  // Story Form State
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryEntry | null>(null);
  const [storyForm, setStoryForm] = useState({
    title: '',
    content: '',
    image_url: '',
    order_index: 0
  });

  // Travel Form State
  const [travelForm, setTravelForm] = useState({
    visa_link: '',
    insurance_link: '',
    arrival_steps: '',
    required_documents: '',
    travel_tips: '',
    ferry_info: ''
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    logo_url: '',
    primary_color: '',
    secondary_color: '',
    text_color: '',
    music_url: '',
    music_enabled: true,
    wedding_date: '',
    tagline: ''
  });

  useEffect(() => {
    fetchRSVPs();
    fetchEvents();
    fetchGallery();
    fetchStory();
    fetchTravelInfo();
    fetchSettings();

    // Subscribe to real-time updates
    const rsvpChannel = supabase
      .channel('rsvp-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rsvps' },
        () => fetchRSVPs()
      )
      .subscribe();

    const eventChannel = supabase
      .channel('event-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => fetchEvents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(rsvpChannel);
      supabase.removeChannel(eventChannel);
    };
  }, []);

  async function fetchRSVPs() {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRsvps(data || []);
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  async function fetchGallery() {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  }

  async function fetchStory() {
    try {
      const { data, error } = await supabase
        .from('story')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setStoryEntries(data || []);
    } catch (error) {
      console.error('Error fetching story:', error);
    }
  }

  async function fetchTravelInfo() {
    try {
      const { data, error } = await supabase
        .from('travel_info')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setTravelInfo(data);
        
        // Parse airport_info if it follows the structured format
        const airportInfo = data.airport_info || '';
        let arrivalSteps = '';
        let documents = '';
        let tips = '';

        if (airportInfo.includes('ARRIVAL_STEPS:')) {
          const sections = airportInfo.split(/\n\n(?=[A-Z_]+:)/);
          sections.forEach((section: string) => {
            if (section.startsWith('ARRIVAL_STEPS:')) {
              arrivalSteps = section.replace('ARRIVAL_STEPS:', '').trim();
            } else if (section.startsWith('DOCUMENTS:')) {
              documents = section.replace('DOCUMENTS:', '').trim();
            } else if (section.startsWith('TIPS:')) {
              tips = section.replace('TIPS:', '').trim();
            }
          });
        } else {
          // Legacy format: put everything in arrival steps
          arrivalSteps = airportInfo;
        }

        setTravelForm({
          visa_link: data.visa_link || '',
          insurance_link: data.insurance_link || '',
          arrival_steps: arrivalSteps,
          required_documents: documents,
          travel_tips: tips,
          ferry_info: data.ferry_info || ''
        });
      }
    } catch (error) {
      console.error('Error fetching travel info:', error);
    }
  }

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      if (data) {
        setSettings(data);
        setSettingsForm({
          logo_url: data.logo_url || '',
          primary_color: data.primary_color || '',
          secondary_color: data.secondary_color || '',
          text_color: data.text_color || '',
          music_url: data.music_url || '',
          music_enabled: data.music_enabled ?? true,
          wedding_date: data.wedding_date || '',
          tagline: data.tagline || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    try {
      if (settings) {
        const { error } = await supabase
          .from('settings')
          .update(settingsForm)
          .eq('id', settings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert([settingsForm]);
        if (error) throw error;
      }
      alert('Settings updated successfully!');
      fetchSettings();
    } catch (error) {
      alert('Error saving settings');
    }
  }

  async function handleSaveTravel(e: FormEvent) {
    e.preventDefault();
    try {
      const formattedAirportInfo = `ARRIVAL_STEPS:\n${travelForm.arrival_steps}\n\nDOCUMENTS:\n${travelForm.required_documents}\n\nTIPS:\n${travelForm.travel_tips}`;
      
      const payload = {
        visa_link: travelForm.visa_link,
        insurance_link: travelForm.insurance_link,
        airport_info: formattedAirportInfo,
        ferry_info: travelForm.ferry_info
      };

      if (travelInfo) {
        const { error } = await supabase
          .from('travel_info')
          .update(payload)
          .eq('id', travelInfo.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('travel_info')
          .insert([payload]);
        if (error) throw error;
      }
      alert('Travel information updated successfully!');
      fetchTravelInfo();
    } catch (error) {
      alert('Error saving travel info');
    }
  }

  async function handleSaveStory(e: FormEvent) {
    e.preventDefault();
    try {
      if (editingStory) {
        const { error } = await supabase
          .from('story')
          .update(storyForm)
          .eq('id', editingStory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('story')
          .insert([storyForm]);
        if (error) throw error;
      }
      setIsStoryModalOpen(false);
      setEditingStory(null);
      setStoryForm({ title: '', content: '', image_url: '', order_index: 0 });
      fetchStory();
    } catch (error) {
      alert('Error saving story');
    }
  }

  async function handleDeleteStory(id: string) {
    if (!confirm('Are you sure you want to delete this story entry?')) return;
    try {
      const { error } = await supabase.from('story').delete().eq('id', id);
      if (error) throw error;
      fetchStory();
    } catch (error) {
      alert('Error deleting story');
    }
  }

  async function handleSaveEvent(e: FormEvent) {
    e.preventDefault();
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventForm)
          .eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventForm]);
        if (error) throw error;
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventForm({ title: '', date: '', time: '', venue: '', map_link: '', description: '', dress_code: '' });
      fetchEvents();
    } catch (error) {
      alert('Error saving event');
      console.error(error);
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      alert('Error deleting event');
    }
  }

  const openEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time,
      venue: event.venue,
      map_link: event.map_link || '',
      description: event.description || '',
      dress_code: event.dress_code || ''
    });
    setIsEventModalOpen(true);
  };

  const totalResponses = rsvps.length;
  const attendingCount = rsvps.filter(r => r.attending).length;
  const notAttendingCount = rsvps.filter(r => !r.attending).length;
  const plusOnesCount = rsvps.filter(r => r.attending && r.plus_one).length;
  const totalGuestsCount = attendingCount + plusOnesCount;

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div></div>;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'story', label: 'Story', icon: BookOpen },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Responses</p>
                <p className="text-2xl font-semibold">{totalResponses}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Attending</p>
                <p className="text-2xl font-semibold">{attendingCount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Not Attending</p>
                <p className="text-2xl font-semibold">{notAttendingCount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <UserPlus size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Plus Ones</p>
                <p className="text-2xl font-semibold">{plusOnesCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Recent RSVPs</h2>
              <span className="text-sm text-gray-500">Total Expected Guests: {totalGuestsCount}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Plus One</th>
                    <th className="px-6 py-3 font-medium">Dietary Req.</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{rsvp.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rsvp.attending ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {rsvp.attending ? 'Attending' : 'Declined'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {rsvp.attending ? (rsvp.plus_one ? 'Yes' : 'No') : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {rsvp.dietary_requirements || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(rsvp.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {rsvps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No RSVPs received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-brand-navy">Event Management</h2>
            <button
              onClick={() => {
                setEditingEvent(null);
                setEventForm({ title: '', date: '', time: '', venue: '', map_link: '', description: '', dress_code: '' });
                setIsEventModalOpen(true);
              }}
              className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg hover:bg-brand-gold transition-colors"
            >
              <Plus size={18} />
              Add Event
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-medium">Event</th>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium">Venue</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{event.description}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex flex-col">
                        <span>{event.date}</span>
                        <span className="text-xs">{event.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{event.venue}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditEvent(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No events created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Event Modal */}
          {isEventModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h3 className="text-xl font-serif text-brand-navy">
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </h3>
                  <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</label>
                      <input
                        required
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="e.g. Mehndi Ceremony"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</label>
                      <input
                        required
                        type="text"
                        value={eventForm.venue}
                        onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="e.g. Beach Garden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
                      <input
                        required
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Time</label>
                      <input
                        required
                        type="text"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="e.g. 4:00 PM"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Map Link</label>
                    <input
                      type="url"
                      value={eventForm.map_link}
                      onChange={(e) => setEventForm({ ...eventForm, map_link: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                      placeholder="Google Maps URL"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dress Code</label>
                    <input
                      type="text"
                      value={eventForm.dress_code}
                      onChange={(e) => setEventForm({ ...eventForm, dress_code: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                      placeholder="e.g. Traditional Wear"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none min-h-[100px]"
                      placeholder="Tell guests more about this event..."
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-brand-navy text-white py-3 rounded-lg font-medium hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEventModalOpen(false)}
                      className="px-6 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-brand-navy">Gallery Management</h2>
            <div className="flex gap-2">
              <label className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg hover:bg-brand-gold transition-colors cursor-pointer">
                <Plus size={18} />
                Upload Media
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    try {
                      setLoading(true);
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Math.random()}.${fileExt}`;
                      const filePath = `${fileName}`;

                      // 1. Upload to Storage
                      const { error: uploadError } = await supabase.storage
                        .from('gallery')
                        .upload(filePath, file);

                      if (uploadError) throw uploadError;

                      // 2. Get Public URL
                      const { data: { publicUrl } } = supabase.storage
                        .from('gallery')
                        .getPublicUrl(filePath);

                      // 3. Save to Database
                      const { error: dbError } = await supabase
                        .from('gallery')
                        .insert([{
                          file_url: publicUrl,
                          type: file.type.startsWith('video') ? 'video' : 'image'
                        }]);

                      if (dbError) throw dbError;
                      
                      fetchGallery();
                      alert('Media uploaded successfully!');
                    } catch (error) {
                      console.error('Error uploading:', error);
                      alert('Error uploading media. Make sure the "gallery" bucket exists and is public.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                {item.type === 'video' ? (
                  <video src={item.file_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.file_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this media?')) return;
                      try {
                        // Extract filename from URL
                        const fileName = item.file_url.split('/').pop();
                        if (fileName) {
                          await supabase.storage.from('gallery').remove([fileName]);
                        }
                        const { error } = await supabase.from('gallery').delete().eq('id', item.id);
                        if (error) throw error;
                        fetchGallery();
                      } catch (error) {
                        alert('Error deleting media');
                      }
                    }}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {galleryItems.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                <ImageIcon className="mx-auto mb-4 text-gray-300" size={48} />
                <p>No media uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'story' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-brand-navy">Story Management</h2>
            <button
              onClick={() => {
                setEditingStory(null);
                setStoryForm({ title: '', content: '', image_url: '', order_index: storyEntries.length });
                setIsStoryModalOpen(true);
              }}
              className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg hover:bg-brand-gold transition-colors"
            >
              <Plus size={18} />
              Add Milestone
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {storyEntries.map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-6 items-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img src={entry.image_url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-mono">#{entry.order_index}</span>
                    <h3 className="font-serif text-lg text-brand-navy truncate">{entry.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{entry.content}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingStory(entry);
                      setStoryForm({
                        title: entry.title,
                        content: entry.content,
                        image_url: entry.image_url,
                        order_index: entry.order_index
                      });
                      setIsStoryModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteStory(entry.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {storyEntries.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                <p>No story milestones added yet.</p>
              </div>
            )}
          </div>

          {/* Story Modal */}
          {isStoryModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h3 className="text-xl font-serif text-brand-navy">
                    {editingStory ? 'Edit Milestone' : 'Add New Milestone'}
                  </h3>
                  <button onClick={() => setIsStoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSaveStory} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</label>
                      <input
                        required
                        type="text"
                        value={storyForm.title}
                        onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="e.g. How We Met"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order Index</label>
                      <input
                        required
                        type="number"
                        value={storyForm.order_index}
                        onChange={(e) => setStoryForm({ ...storyForm, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Image URL</label>
                    <input
                      required
                      type="url"
                      value={storyForm.image_url}
                      onChange={(e) => setStoryForm({ ...storyForm, image_url: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Content</label>
                    <textarea
                      required
                      value={storyForm.content}
                      onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none min-h-[150px]"
                      placeholder="Tell the story..."
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-brand-navy text-white py-3 rounded-lg font-medium hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {editingStory ? 'Update Milestone' : 'Create Milestone'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsStoryModalOpen(false)}
                      className="px-6 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'travel' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-brand-navy">Travel Info Management</h2>
          </div>

          <form onSubmit={handleSaveTravel} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Visa Requirements Link</label>
                <input
                  type="url"
                  value={travelForm.visa_link}
                  onChange={(e) => setTravelForm({ ...travelForm, visa_link: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Travel Insurance Link</label>
                <input
                  type="url"
                  value={travelForm.insurance_link}
                  onChange={(e) => setTravelForm({ ...travelForm, insurance_link: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-serif text-brand-navy border-b pb-2">Airport & Arrival</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Arrival Steps</label>
                  <textarea
                    value={travelForm.arrival_steps}
                    onChange={(e) => setTravelForm({ ...travelForm, arrival_steps: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none min-h-[100px]"
                    placeholder="Step-by-step instructions after landing..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Required Documents</label>
                  <textarea
                    value={travelForm.required_documents}
                    onChange={(e) => setTravelForm({ ...travelForm, required_documents: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none min-h-[100px]"
                    placeholder="List of documents needed for entry..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Travel Tips</label>
                  <textarea
                    value={travelForm.travel_tips}
                    onChange={(e) => setTravelForm({ ...travelForm, travel_tips: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none min-h-[100px]"
                    placeholder="Local tips, currency, connectivity, etc."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-serif text-brand-navy border-b pb-2 block">Ferry & Port Information</label>
              <textarea
                value={travelForm.ferry_info}
                onChange={(e) => setTravelForm({ ...travelForm, ferry_info: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none min-h-[100px]"
                placeholder="Details about ferry schedules, ports, etc."
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-brand-navy text-white py-3 rounded-lg font-medium hover:bg-brand-gold transition-colors flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Travel Information
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-brand-navy">Global Settings</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
            {/* Branding Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-brand-navy border-b pb-2">Branding & Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Logo URL</label>
                  <input
                    type="url"
                    value={settingsForm.logo_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, logo_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Wedding Date Text</label>
                  <input
                    type="text"
                    value={settingsForm.wedding_date}
                    onChange={(e) => setSettingsForm({ ...settingsForm, wedding_date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    placeholder="e.g. August 24, 2024"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                  placeholder="e.g. A Celebration of Love"
                />
              </div>
            </div>

            {/* Colors Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-brand-navy border-b pb-2">Theme Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settingsForm.primary_color}
                      onChange={(e) => setSettingsForm({ ...settingsForm, primary_color: e.target.value })}
                      className="h-10 w-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settingsForm.primary_color}
                      onChange={(e) => setSettingsForm({ ...settingsForm, primary_color: e.target.value })}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settingsForm.secondary_color}
                      onChange={(e) => setSettingsForm({ ...settingsForm, secondary_color: e.target.value })}
                      className="h-10 w-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settingsForm.secondary_color}
                      onChange={(e) => setSettingsForm({ ...settingsForm, secondary_color: e.target.value })}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settingsForm.text_color}
                      onChange={(e) => setSettingsForm({ ...settingsForm, text_color: e.target.value })}
                      className="h-10 w-10 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settingsForm.text_color}
                      onChange={(e) => setSettingsForm({ ...settingsForm, text_color: e.target.value })}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Music Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-brand-navy border-b pb-2">Background Music</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="music_enabled"
                    checked={settingsForm.music_enabled}
                    onChange={(e) => setSettingsForm({ ...settingsForm, music_enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <label htmlFor="music_enabled" className="text-sm font-medium text-gray-700">Enable Background Music</label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Music File URL (MP3)</label>
                  <input
                    type="url"
                    value={settingsForm.music_url}
                    onChange={(e) => setSettingsForm({ ...settingsForm, music_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-brand-navy text-white py-4 rounded-lg font-medium hover:bg-brand-gold transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <Save size={24} />
                Save All Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
