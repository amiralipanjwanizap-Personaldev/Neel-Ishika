import { motion } from 'motion/react';
import { Plane, Hotel, Shield, Map, Info } from 'lucide-react';

export default function Travel() {
  const travelInfo = [
    {
      icon: <Plane className="w-6 h-6 text-brand-gold" />,
      title: "Flights & Airport",
      description: "Fly into Abeid Amani Karume International Airport (ZNZ). We recommend booking flights early as this is a popular destination.",
      link: "https://www.skyscanner.com",
      linkText: "Search Flights"
    },
    {
      icon: <Map className="w-6 h-6 text-brand-gold" />,
      title: "Visa Requirements",
      description: "Most nationalities require a visa to enter Tanzania. You can apply for an e-Visa online before your trip.",
      link: "https://visa.immigration.go.tz/",
      linkText: "Apply for e-Visa"
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-gold" />,
      title: "Travel Insurance",
      description: "Zanzibar now requires all visitors to have mandatory inbound travel insurance from the Zanzibar Insurance Corporation.",
      link: "https://visitzanzibar.go.tz/",
      linkText: "Get Insurance"
    },
    {
      icon: <Hotel className="w-6 h-6 text-brand-gold" />,
      title: "Accommodation",
      description: "We have secured a block of rooms at the main wedding resort. Please use our discount code 'NEELISHIKA26' when booking.",
      link: "#",
      linkText: "Book Hotel"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-brand-navy mb-4">Travel & Stay</h1>
        <p className="text-brand-navy/70 max-w-2xl mx-auto">
          Everything you need to know to plan your trip to Zanzibar.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {travelInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-brand-gold/20 shadow-sm"
          >
            <div className="mb-4">{info.icon}</div>
            <h3 className="text-xl font-serif text-brand-navy mb-3">{info.title}</h3>
            <p className="text-brand-navy/70 mb-6 leading-relaxed">
              {info.description}
            </p>
            <a
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm uppercase tracking-widest text-brand-navy hover:text-brand-gold transition-colors font-medium"
            >
              {info.linkText} â
            </a>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-brand-navy text-brand-cream p-8 md:p-12 rounded-2xl text-center"
      >
        <Info className="w-8 h-8 text-brand-gold mx-auto mb-4" />
        <h3 className="text-2xl font-serif mb-4">Dress Code</h3>
        <p className="max-w-2xl mx-auto opacity-80 leading-relaxed">
          Zanzibar is a tropical island with a warm climate. For the wedding events, we suggest elegant resort wear. As Zanzibar is a predominantly Muslim island, please dress modestly when exploring Stone Town or local villages outside the resort.
        </p>
      </motion.div>
    </div>
  );
}
