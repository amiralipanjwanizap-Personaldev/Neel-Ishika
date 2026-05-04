import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Star, Utensils, Coffee, Palmtree, Navigation, ChevronRight } from 'lucide-react';

type Tab = 'dar' | 'zanzibar';

export default function Explore() {
  const [activeTab, setActiveTab] = useState<Tab>('zanzibar');

  const content = {
    zanzibar: {
      hotels: [
        { name: 'Nungwi Beach Hotels', area: 'Nungwi (North)', desc: 'Known for white sandy beaches and vibrant nightlife.', recommended: true },
        { name: 'Paje Areas', area: 'Paje (East)', desc: 'Perfect for kitesurfing and laid-back beach days.', recommended: false },
        { name: 'Stone Town Boutique Hotels', area: 'Stone Town', desc: 'Historical heart of Zanzibar, great for first night stays.', recommended: false },
      ],
      restaurants: [
        { name: 'The Rock Restaurant', area: 'Michamvi', desc: 'World famous restaurant built on a coral rock in the ocean.', type: 'Seafood/Global' },
        { name: 'Emerson Spice Tea House', area: 'Stone Town', desc: 'Rooftop dining with 360-degree views of Stone Town.', type: 'Zanzibari' },
        { name: 'Lukmaan', area: 'Stone Town', desc: 'Authentic local Zanzibar street food in a bustling restaurant environment.', type: 'Local Arabic/Indian' },
      ],
      activities: [
        { name: 'Mnemba Island Snorkeling', desc: 'Crystal clear waters and incredible marine life.', icon: <span className="text-blue-500">🐟</span> },
        { name: 'Nakupenda Sandbank', desc: 'A pristine isolated sandbank in the middle of the ocean.', icon: <Palmtree className="text-green-500" size={18} /> },
        { name: 'Prison Island', desc: 'Historic island home to giant Aldabra tortoises.', icon: <span className="text-gray-500">🐢</span> },
        { name: 'Jozani Forest', desc: 'Home to the rare Red Colobus monkeys.', icon: <span className="text-emerald-600">🐒</span> },
      ]
    },
    dar: {
      hotels: [
        { name: 'Johari Rotana', area: 'City Center', desc: 'Premium luxury hotel with excellent harbor views.', recommended: true },
        { name: 'Hyatt Regency (The Kilimanjaro)', area: 'City Center', desc: 'Classic luxury and great dining options.', recommended: true },
        { name: 'Coral Beach Hotel', area: 'Msasani Peninsula', desc: 'Beautiful ocean views and relaxed vibe.', recommended: false },
      ],
      restaurants: [
        { name: 'Samaki Samaki', area: 'Masaki', desc: 'Lively seafood restaurant with great music and local vibes.', type: 'Seafood/Lounge' },
        { name: 'Cape Town Fish Market', area: 'Msasani', desc: 'Excellent seafood right on the water.', type: 'Seafood/Sushi' },
        { name: 'Addis In Dar', area: 'Ursino', desc: 'Traditional Ethiopian dining experience.', type: 'Ethiopian' },
      ],
      activities: [
        { name: 'Bongoyo Island', desc: 'A quick boat trip for a peaceful beach day near the city.', icon: <Palmtree className="text-green-500" size={18} /> },
        { name: 'Slipway Shopping Center', desc: 'Souvenirs, restaurants, and a beautiful sunset view.', icon: <span className="text-orange-500">🛍️</span> },
        { name: 'National Museum', desc: 'Learn about the history and heritage of Tanzania.', icon: <span className="text-amber-700">🏛️</span> },
      ]
    }
  };

  const tourOperators = [
    { name: "Zanzibar Quest", phone: "+255 777 123 456", desc: "For all Zanzibar island tours, safaris and excursions." },
    { name: "Dar Explorers", phone: "+255 754 987 654", desc: "City tours, boat trips, and mainland safaris." }
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
          Our top recommendations for hotels, dining, and activities if you're extending your trip.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Tour Operators Section */}
      <section className="mt-20 p-8 md:p-12 bg-brand-navy text-white rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-serif mb-4">Tour Operators</h2>
            <p className="text-white/70 leading-relaxed text-sm">
              We recommend reaching out to these trusted local operators to help plan your excursions, transfers, and safaris.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tourOperators.map((operator, i) => (
              <div key={i} className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-brand-gold mb-2">{operator.name}</h3>
                <p className="text-sm text-white/70 mb-4">{operator.desc}</p>
                <a href={`https://wa.me/${operator.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-brand-gold transition-colors">
                  <Phone size={14} /> {operator.phone} <ChevronRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
