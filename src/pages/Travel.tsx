import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Shield, FileText, Ship, ChevronDown, Info, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { getTravelInfo } from '../lib/api';

interface TravelData {
  visa_link: string;
  insurance_link: string;
  airport_info: string;
  ferry_info: string;
}

const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-brand-navy/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group transition-all"
      >
        <span className="text-xl font-serif text-brand-navy group-hover:text-brand-gold transition-colors">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-brand-gold bg-brand-gold/10 p-2 rounded-full"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-brand-navy/70 leading-relaxed max-w-3xl space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Travel() {
  const [travelData, setTravelData] = useState<TravelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getTravelInfo();
      setTravelData(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  const infoCards = [
    {
      icon: <Plane className="w-6 h-6" />,
      title: "Flights & Airport",
      summary: "Fly into Abeid Amani Karume International Airport (ZNZ). Direct flights available from major hubs.",
      link: "https://www.skyscanner.com",
      linkText: "Search Flights",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Visa Requirements",
      summary: "Most visitors require a visa. Apply for an e-Visa online at least 2 weeks before travel.",
      link: travelData?.visa_link || "https://visa.immigration.go.tz/",
      linkText: "Apply for e-Visa",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Travel Insurance",
      summary: "Mandatory inbound travel insurance is required for all visitors entering Zanzibar.",
      link: travelData?.insurance_link || "https://visitzanzibar.go.tz/",
      linkText: "Get Insurance",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: <Ship className="w-6 h-6" />,
      title: "Ferry / Port Travel",
      summary: "Fast ferries operate daily between Dar es Salaam and Zanzibar. Journey takes approx. 2 hours.",
      link: "https://www.azampay.com/ferry",
      linkText: "View Ferry Details",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="inline-block px-4 py-1.5 bg-brand-gold/10 text-brand-gold text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-6">
          Plan Your Journey
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-brand-navy mb-6">Travel Essentials</h1>
        <p className="text-brand-navy/60 max-w-2xl mx-auto text-lg leading-relaxed">
          We've gathered all the essential information to help you plan your trip to our wedding in Zanzibar.
        </p>
      </motion.div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {infoCards.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white p-8 rounded-[2rem] border border-brand-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
          >
            <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              {info.icon}
            </div>
            <h3 className="text-2xl font-serif text-brand-navy mb-4">{info.title}</h3>
            <p className="text-brand-navy/60 mb-8 leading-relaxed text-base">
              {info.summary}
            </p>
            <a
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-brand-navy text-white rounded-xl font-medium hover:bg-brand-gold transition-all duration-300 shadow-lg shadow-brand-navy/10"
            >
              {info.linkText}
              <ExternalLink size={18} />
            </a>
          </motion.div>
        ))}
      </div>

      {/* Accordion Section */}
      <div className="max-w-4xl mx-auto mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-brand-navy mb-4">Detailed Information</h2>
          <p className="text-brand-navy/50">Click on a section to expand and read more details.</p>
        </div>
        
        <div className="bg-white rounded-[2rem] border border-brand-navy/5 shadow-sm p-4 md:p-8">
          <AccordionItem title="Arrival Steps">
            <ul className="space-y-4 list-disc pl-5">
              <li>Upon arrival at ZNZ, proceed to Immigration with your e-Visa or apply for Visa on Arrival.</li>
              <li>Collect your luggage from the carousel area.</li>
              <li>Pass through Customs (ensure you've declared any restricted items).</li>
              <li>Our pre-arranged shuttles will be waiting outside the arrivals hall with a sign featuring our wedding logo.</li>
              <li>The journey to the resort takes approximately 60-90 minutes depending on traffic.</li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Required Documents">
            <div className="space-y-4">
              <p>Please ensure you have the following documents ready before your flight:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-brand-navy block mb-1">Passport</span>
                  <span className="text-sm">Valid for at least 6 months from date of entry.</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-brand-navy block mb-1">e-Visa</span>
                  <span className="text-sm">Printed copy of your approved e-Visa.</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-brand-navy block mb-1">Insurance</span>
                  <span className="text-sm">Mandatory Zanzibar Inbound Travel Insurance.</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-brand-navy block mb-1">Yellow Fever</span>
                  <span className="text-sm">Certificate if traveling from an endemic country.</span>
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Travel Tips">
            <ul className="space-y-4 list-disc pl-5">
              <li><strong>Currency:</strong> Tanzanian Shilling (TZS) is the local currency, but USD is widely accepted in tourist areas.</li>
              <li><strong>Connectivity:</strong> We recommend getting a local SIM card (Zantel or Airtel) at the airport for the best coverage.</li>
              <li><strong>Weather:</strong> Zanzibar is tropical. Expect temperatures between 25°C and 30°C. Don't forget sunscreen!</li>
              <li><strong>Water:</strong> Drink only bottled or filtered water. Avoid tap water even for brushing teeth.</li>
              <li><strong>Power:</strong> Type G plugs (UK style) are standard. 230V, 50Hz.</li>
            </ul>
          </AccordionItem>
        </div>
      </div>

      {/* Dress Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-navy text-brand-cream p-10 md:p-16 rounded-[3rem] text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-64 h-64 border-2 border-white rounded-full" />
        </div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Info className="w-8 h-8 text-brand-gold" />
          </div>
          <h3 className="text-3xl md:text-4xl font-serif mb-6">Dress Code & Etiquette</h3>
          <p className="max-w-3xl mx-auto text-lg opacity-80 leading-relaxed mb-8">
            Zanzibar is a tropical paradise with a warm climate. For the wedding events, we suggest <strong>Elegant Resort Wear</strong>. 
          </p>
          <div className="inline-block p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-left max-w-2xl mx-auto">
            <p className="text-sm leading-relaxed opacity-90">
              <strong className="text-brand-gold block mb-2">Cultural Respect:</strong>
              As Zanzibar is a predominantly Muslim island, we kindly ask you to dress modestly when exploring Stone Town or local villages. Please ensure shoulders and knees are covered when outside the resort areas.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
