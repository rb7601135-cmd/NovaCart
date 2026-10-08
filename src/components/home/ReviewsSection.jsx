import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Quote, Star } from 'lucide-react';
import { reviews } from '../../data/reviews';
import { RatingStars } from '../common/RatingStars';

export const ReviewsSection = () => {
  return (
    <section className="py-20 bg-neutral-100/50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-2">
            Client Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
            Customer Reviews
          </h2>
          <p className="text-sm text-neutral-600">
            Over 50,000 verified buyers trust NovaCart for authentic luxury, unparalleled craftsmanship, and seamless white-glove delivery.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, index) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-neutral-200 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <RatingStars rating={rev.rating} size="sm" showScore={false} />
                  <Quote className="w-6 h-6 text-indigo-100 fill-indigo-100" />
                </div>

                <h4 className="text-sm font-bold text-neutral-900 mb-2 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h4>

                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  {rev.comment}
                </p>
              </div>

              {/* Reviewer Meta */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-neutral-900 truncate">
                      {rev.name}
                    </p>
                    {rev.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Buyer" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    Purchased {rev.productName.split(' ')[0]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
