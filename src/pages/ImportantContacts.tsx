import { motion } from 'motion/react';
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const contacts = [
  {
    name: "Neel",
    role: "Wedding Contact",
    phoneDisplay: "+265 995 134 351",
    phoneUrl: "tel:+265995134351",
    whatsappUrl: "https://wa.me/265995134351",
    emailUrl: "mailto:neelsavjani@gmail.com"
  },
  {
    name: "Sea Cliff Resort & Spa",
    role: "Wedding Resort",
    phoneDisplay: "+255 767 702 241",
    phoneUrl: "tel:+255767702241",
    whatsappUrl: "https://wa.me/255767702241"
  },
  {
    name: "Events By Kajal",
    role: "Wedding Event Planner",
    phoneDisplay: "+255 758 332 332",
    phoneUrl: "tel:+255758332332",
    whatsappUrl: "https://wa.me/255758332332"
  },
  {
    name: "Sona Thakrar",
    role: "Tour Operator",
    phoneDisplay: "+255 713 282 822",
    phoneUrl: "tel:+255713282822",
    whatsappUrl: "https://wa.me/255713282822"
  },
  {
    name: "Abbas Takim",
    role: "Tour Operator",
    phoneDisplay: "+255 689 099 600",
    phoneUrl: "tel:+255689099600",
    whatsappUrl: "https://wa.me/255689099600"
  }
];

export default function ImportantContacts() {
  const { settings } = useOutletContext<any>();
  const accentColor = settings?.accent_color || "var(--brand-secondary, #C9A46C)";

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--brand-bg, #F5E9DA)" }}>
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-serif" style={{ color: "var(--brand-primary, #1F3A5F)" }}>Important Contacts</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Should you require any assistance during the wedding celebrations, please feel free to contact the following.
          </p>
        </motion.div>

        {/* Highlighted Reminder Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white border text-center p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-xl relative overflow-hidden"
          style={{ borderColor: accentColor }}
        >
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: accentColor }} />
          <h2 className="text-2xl md:text-3xl font-serif mb-6" style={{ color: "var(--brand-primary, #1F3A5F)" }}>Guest Accommodation</h2>
          <p className="text-gray-600 mb-6 text-lg">Provided for guests 21st–24th Aug.</p>
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-16 text-sm tracking-widest uppercase items-center text-gray-800">
            <div className="bg-[#FAF8F5] px-8 py-4 rounded-lg">
              <span className="block text-gray-500 mb-1 text-xs">Check-in</span>
              <span className="font-semibold text-base">2:00 PM</span>
            </div>
            <div className="bg-[#FAF8F5] px-8 py-4 rounded-lg">
              <span className="block text-gray-500 mb-1 text-xs">Check-out</span>
              <span className="font-semibold text-base">11:00 AM</span>
            </div>
          </div>
        </motion.div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + (index * 0.1) }}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-serif mb-2" style={{ color: "var(--brand-primary, #1F3A5F)" }}>{contact.name}</h3>
                <p className="text-sm tracking-widest uppercase" style={{ color: accentColor }}>{contact.role}</p>
                <p className="text-gray-600 mt-4 text-lg">{contact.phoneDisplay}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={contact.phoneUrl}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border transition-colors hover:bg-gray-50 font-medium text-sm"
                  style={{ borderColor: '#E5E7EB', color: "var(--brand-primary, #1F3A5F)" }}
                >
                  <Phone size={16} />
                  <span>Call</span>
                </a>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-white transition-opacity hover:opacity-90 font-medium text-sm"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
                {contact.emailUrl && (
                  <a
                    href={contact.emailUrl}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-white transition-opacity hover:opacity-90 font-medium text-sm"
                    style={{ backgroundColor: "var(--brand-primary, #1F3A5F)" }}
                  >
                    <Mail size={16} />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
