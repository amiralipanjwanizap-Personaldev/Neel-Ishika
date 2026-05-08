import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Star, Utensils, Coffee, Palmtree, Navigation, ChevronRight } from 'lucide-react';

type Tab = 'dar' | 'zanzibar';

export default function Explore() {
  const [activeTab, setActiveTab] = useState<Tab>('zanzibar');

  const content = {
    zanzibar: {
      hotels: [
        { name: 'Sea Cliff Resort & Spa', area: 'Featured Stay', desc: 'USD 235 B&B + Tax. Code: Ishika&Neel-21Aug2026. Contact: rm@seacliffzanzibar.com', recommended: true },
        { name: 'Guest Accommodation', area: 'Official Info', desc: 'Provided for guests 21st-24th Aug. Check-in: 2pm. Check-out: 11am.', recommended: true },
        { name: 'Nungwi & Kendwa', area: 'Recommended Area', desc: 'Lively atmosphere, beautiful beaches, and restaurants.', recommended: false },
        { name: 'Paje & Jambiani', area: 'Recommended Area', desc: 'Relaxed bohemian vibe, kitesurfing, beach cafés.', recommended: false },
        { name: 'Stone Town', area: 'Recommended Area', desc: 'Historic, cultural, charming immersive stay experience.', recommended: false },
        { name: 'Samawa Living', area: 'Paje', desc: 'Modern living in Paje.', recommended: false },
        { name: 'Lux Marijani', area: 'Pwani', desc: 'Luxury stay on the East Coast.', recommended: false },
        { name: 'Le Mersenne', area: 'Michamvi Pingwe', desc: 'Exclusive resort in Pingwe.', recommended: false },
        { name: 'The Mora Zanzibar', area: 'Matemwe', desc: 'Elegant and peaceful.', recommended: false },
        { name: 'Ycona Eco-Luxury Resort', area: 'Dikoni', desc: 'Eco-luxury resort experience.', recommended: false },
        { name: 'Meliá Zanzibar', area: 'Kiwengwa', desc: 'Luxurious all-inclusive resort.', recommended: false },
        { name: 'Madinat Al Bahr', area: 'Mbweni', desc: 'Unique palace-style resort.', recommended: false },
        { name: 'Amani Boutique Hotel', area: 'Paje', desc: 'Intimate boutique hotel.', recommended: false },
        { name: 'Lujo Zanzibar Resort', area: 'Zanzibar', desc: 'Premium resort experience.', recommended: false },
        { name: 'Kivuli Beach Resort', area: 'Paje', desc: 'Premium beachfront stay.', recommended: false },
      ],
      restaurants: [
        { name: 'Cape Town Fish Market', area: 'Stone Town', desc: 'Fresh seafood in the heart of the city.', type: 'Seafood' },
        { name: 'Da Luigi Ristorante', area: 'Zanzibar', desc: 'Authentic Italian Pizzeria.', type: 'Italian' },
        { name: 'Shanga', area: 'Paje', desc: 'Popular Beach Club restaurant.', type: 'Beach Club' },
        { name: 'Bento', area: 'Paje', desc: 'Casual dining at the Food Court.', type: 'Food Court' },
        { name: 'Mama Mia', area: 'Zanzibar', desc: 'Genuine Italian Gelato.', type: 'Gelato' },
        { name: 'Badolina Secret Garden', area: 'Nungwi', desc: 'Secret garden dining experience.', type: 'International' },
        { name: 'La Capannia', area: 'Zanzibar', desc: 'Authentic Italian flavors.', type: 'Italian' },
        { name: 'The Beach House', area: 'Stone Town', desc: 'Seaside dining with a view.', type: 'International' },
        { name: 'ZanziBarista', area: 'Stone Town', desc: 'Great coffee and light bites.', type: 'Café' },
        { name: 'Fisherman’s Seafood & Grill', area: 'Zanzibar', desc: 'Fresh local seafood.', type: 'Seafood' },
        { name: 'Sexy Fish', area: 'Zanzibar', desc: 'Premium seafood and dining.', type: 'Seafood' },
        { name: 'Harbour Indian Kitchen', area: 'Zanzibar', desc: 'By Chilli & Lime.', type: 'Indian' },
        { name: 'The Silk Route', area: 'Stone Town', desc: 'Authentic Indian cuisine.', type: 'Indian' },
      ],
      activities: [
        { name: 'Mnemba Island', desc: 'Vibrant marine life and snorkeling.', icon: <span className="text-blue-500">🐠</span> },
        { name: 'Salaam Cave', desc: 'Unique natural swimming cave.', icon: <span className="text-emerald-600">⛰️</span> },
        { name: 'Nakupenda Sandbank', desc: 'Isolated pristine sandbank.', icon: <Palmtree className="text-green-500" size={18} /> },
        { name: 'Quad Biking', desc: 'Adventure through the island landscapes.', icon: <span className="text-orange-500">🏎️</span> },
        { name: 'Prison Island', desc: 'Giant tortoises and historical tours.', icon: <span className="text-gray-500">🐢</span> },
        { name: 'Kuza Cave', desc: 'Ancient limestone junket and swimming.', icon: <span className="text-cyan-600">🌊</span> },
        { name: 'Maalum Cave', desc: 'Natural pool in a serene environment.', icon: <span className="text-teal-500">🌿</span> },
        { name: 'Stone Town Tour', desc: 'Immersive walking tour through history.', icon: <Navigation className="text-brand-gold" size={18} /> },
      ]
    },
    dar: {
      hotels: [
        { name: 'Four Points (New Africa)', area: 'Recommended', desc: '11–12 km · 20–35 min. Google Maps linked.', recommended: true },
        { name: 'Protea Hotel (Courtyard)', area: 'Recommended', desc: '11–12 km · 20–35 min. Comfortable stay.', recommended: true },
        { name: 'Hyatt Regency (The Kilimanjaro)', area: 'Premium', desc: '~11 km · 20–35 min. Luxury stay.', recommended: true },
        { name: 'Serena Hotel', area: 'Premium', desc: '~13 km · 25–40 min. Deluxe city experience.', recommended: true },
        { name: 'Blue Sapphire', area: 'Airport', desc: '~3 km · 5–10 min. Best for airport convenience.', recommended: false },
        { name: 'Golden Tulip City Center', area: 'Budget / Seaport', desc: 'Close to the ferry seaport.', recommended: false },
      ],
      restaurants: [
        { name: 'Levant', area: 'Dar es Salaam', desc: 'Authentic Lebanese flavors.', type: 'Lebanese' },
        { name: 'Thai Kani', area: 'Dar es Salaam', desc: 'Exquisite Thai cuisine.', type: 'Thai' },
        { name: 'Wavuvi Kempu', area: 'Dar es Salaam', desc: 'Mediterranean seafood and meats.', type: 'Seafood/Meats' },
        { name: 'Samaki Samaki', area: 'Dar es Salaam', desc: 'Vibrant seafood and local vibe.', type: 'Seafood' },
        { name: 'Dar Fish Market', area: 'Dar es Salaam', desc: 'Fresh fish and seafood.', type: 'Seafood' },
        { name: 'Zuane', area: 'Dar es Salaam', desc: 'Traditional Italian dishes.', type: 'Italian' },
        { name: 'Flames', area: 'Dar es Salaam', desc: 'Rich Indian culinary experience.', type: 'Indian' },
        { name: 'Chowpatty', area: 'Dar es Salaam', desc: 'Delicious Indian street food and dishes.', type: 'Indian' },
        { name: 'Chapan Bhog', area: 'Dar es Salaam', desc: 'Authentic Indian vegetarian cuisine.', type: 'Indian' },
      ],
      activities: [
        { name: 'Bongoyo Island', desc: 'A quick boat trip for a peaceful beach day.', icon: <Palmtree className="text-green-500" size={18} /> },
        { name: 'Slipway Center', desc: 'Souvenirs, shopping, and sunset views.', icon: <span className="text-orange-500">🛍️</span> },
        { name: 'National Museum', desc: 'History and heritage of Tanzania.', icon: <span className="text-amber-700">🏛️</span> },
      ]
    }
  };

  const tourOperators = [
    { name: "Sona Thakrar", phone: "+255713282822" },
    { name: "Abbas Takim", phone: "+255689099600" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="inline-block px-4 py-1.5 bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-6">
          Pre & Post Wedding
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-navy mb-6">Explore Tanzania</h1>
        <p className="text-brand-navy/60 max-w-2xl mx-auto text-lg leading-relaxed">
          {activeTab === 'dar' 
            ? "Traffic in Dar es Salaam can get busy during peak times. We recommend planning your travel accordingly."
            : "Whichever you choose, we’re sure you’ll have an unforgettable experience on this beautiful island."}
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-white rounded-full p-1 border border-brand-navy/10 shadow-sm">
          <button
            onClick={() => setActiveTab('zanzibar')}
            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'zanzibar' ? 'bg-brand-navy text-white shadow-md' : 'text-brand-navy/60 hover:text-brand-navy'
            }`}
          >
            Zanzibar
          </button>
          <button
            onClick={() => setActiveTab('dar')}
            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'dar' ? 'bg-brand-navy text-white shadow-md' : 'text-brand-navy/60 hover:text-brand-navy'
            }`}
          >
            Dar es Salaam
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="space-y-16"
        >
          {/* Hotels */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h2 className="text-3xl font-serif text-brand-navy">Where to Stay</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content[activeTab].hotels.map((hotel, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-brand-navy/5 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-gold transition-colors">{hotel.name}</h3>
                    {hotel.recommended && <Star size={16} className="text-brand-gold fill-brand-gold" />}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/40 mb-3">{hotel.area}</p>
                  <p className="text-sm text-brand-navy/70 leading-relaxed">{hotel.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Restaurants */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Utensils size={20} />
              </div>
              <h2 className="text-3xl font-serif text-brand-navy">Where to Eat</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content[activeTab].restaurants.map((rest, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-brand-navy/5 shadow-sm hover:shadow-md transition-shadow group">
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-gold transition-colors mb-1">{rest.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/40">{rest.area}</p>
                    <span className="w-1 h-1 rounded-full bg-brand-navy/20"></span>
                    <p className="text-xs text-brand-gold">{rest.type}</p>
                  </div>
                  <p className="text-sm text-brand-navy/70 leading-relaxed">{rest.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Activities */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <Navigation size={20} />
              </div>
              <h2 className="text-3xl font-serif text-brand-navy">Things to Do</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content[activeTab].activities.map((act, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-brand-navy/5 shadow-sm hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-4 text-xl">
                    {act.icon}
                  </div>
                  <h3 className="font-bold text-brand-navy mb-2">{act.name}</h3>
                  <p className="text-sm text-brand-navy/60 leading-relaxed">{act.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      <section className="mt-20 p-8 md:p-12 bg-brand-navy text-white rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-serif mb-4">Tour Operators</h2>
            <p className="text-white/70 leading-relaxed text-sm">
              For those wishing to explore safaris or bespoke tours across Tanzania, we are happy to recommend trusted operators who can assist via WhatsApp.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tourOperators.map((operator, i) => (
              <div key={i} className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col h-full">
                <h3 className="text-lg font-bold text-brand-gold mb-1">{operator.name}</h3>
                <div className="flex items-center gap-2 text-white/70 mb-6">
                  <Phone size={14} /> <span>{operator.phone}</span>
                </div>
                <a 
                  href={`https://wa.me/${operator.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-auto w-full bg-brand-gold text-white px-4 py-3 rounded-xl font-medium hover:bg-brand-gold/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/20"
                >
                  <span>Chat on WhatsApp</span>
                  <ChevronRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
