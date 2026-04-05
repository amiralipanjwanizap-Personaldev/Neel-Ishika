import { motion } from 'motion/react';

export default function Story() {
  const milestones = [
    {
      year: "2018",
      title: "How We Met",
      description: "We first crossed paths at a mutual friend's Diwali party. A conversation about our shared love for travel sparked a connection that would change our lives.",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop"
    },
    {
      year: "2020",
      title: "Our First Trip",
      description: "Our first international trip together to Bali. It was here we realized we made the perfect travel companions and partners in life.",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop"
    },
    {
      year: "2024",
      title: "The Proposal",
      description: "A sunset walk on the beach turned into the most magical moment when Neel got down on one knee. It was an easy 'Yes!'.",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-brand-navy mb-4">Our Story</h1>
        <p className="text-brand-navy/70 max-w-2xl mx-auto">
          From a chance meeting to a lifetime commitment.
        </p>
      </motion.div>

      <div className="space-y-24">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col md:flex-row gap-8 items-center ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-brand-gold/20 shadow-lg">
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className={`w-full md:w-1/2 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
              <span className="text-brand-gold font-serif text-xl italic mb-2 block">{milestone.year}</span>
              <h3 className="text-3xl font-serif text-brand-navy mb-4">{milestone.title}</h3>
              <p className="text-brand-navy/70 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
