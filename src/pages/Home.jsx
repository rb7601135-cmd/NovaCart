import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { PromoBanner } from '../components/home/PromoBanner';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { BestSellersSection } from '../components/home/BestSellersSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Products */}
      <FeaturedSection />

      {/* 3. Categories */}
      <CategoriesSection />

      {/* 4. Promotional Banner */}
      <PromoBanner />

      {/* 5. New Arrivals */}
      <NewArrivalsSection />

      {/* 6. Best Sellers */}
      <BestSellersSection />

      {/* 7. Customer Reviews */}
      <ReviewsSection />

      {/* 8. Newsletter */}
      <NewsletterSection />
    </div>
  );
};
