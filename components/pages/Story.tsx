import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { getStory } from '../../lib/api';

interface Milestone {
  id: string;
  title: string;
  content: string;
  image_url: string;
  order_index: number;
}

export default function Story() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getStory();
      setMilestones(data);
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

      {milestones.length === 0 ? (
        <div className="text-center text-brand-navy/50 py-20">
          <p>Our story is being written...</p>
        </div>
      ) : (
        <div className="space-y-24">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
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
                    src={milestone.image_url || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop"}
                    alt={milestone.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className={`w-full md:w-1/2 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                <h3 className="text-3xl font-serif text-brand-navy mb-4">{milestone.title}</h3>
                <p className="text-brand-navy/70 leading-relaxed">
                  {milestone.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
