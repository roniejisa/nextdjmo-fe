"use client";
import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import FeaturesSection from "./components/FeaturesSection";
import PropertiesSection from "./components/PropertySection";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogSection from "./components/BlogSection";
import NewsletterSection from "./components/NewsletterSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";

const Homepage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 text-gray-900";

  const glassClasses = isDarkMode
    ? "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-purple-500/20"
    : "bg-white/40 backdrop-blur-xl border border-white/30 shadow-2xl shadow-indigo-500/20";

  const textPrimaryClasses = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryClasses = isDarkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div
      className={`min-h-screen ${themeClasses} relative overflow-x-hidden transition-all duration-500`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 ${
            isDarkMode ? "bg-purple-500/10" : "bg-indigo-400/20"
          } rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute top-40 right-20 w-96 h-96 ${
            isDarkMode ? "bg-blue-500/10" : "bg-purple-400/20"
          } rounded-full blur-3xl animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute bottom-20 left-1/4 w-80 h-80 ${
            isDarkMode ? "bg-indigo-500/10" : "bg-blue-400/20"
          } rounded-full blur-3xl animate-pulse delay-2000`}
        ></div>
      </div>

      {/* Header */}
      <Header
        glassClasses={glassClasses}
        isDarkMode={isDarkMode}
        isScrolled={isScrolled}
        textPrimaryClasses={textPrimaryClasses}
        toggleTheme={toggleTheme}
      />

      {/* Hero Section */}
      <HeroSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />

      {/* Stats Section */}
      <StatsSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />
      {/* Features Section */}
      <FeaturesSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />

      {/* Properties Section */}
      <PropertiesSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textPrimaryClasses}
      />

      {/* Blog Section */}
      <BlogSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />

      {/* Newsletter Section */}
      <NewsletterSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />

      {/* Contact Section */}
      <ContactSection
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />

      {/* Footer */}
      <Footer
        glassClasses={glassClasses}
        textPrimaryClasses={textPrimaryClasses}
        textSecondaryClasses={textSecondaryClasses}
      />

      {/* Back to Top Button */}
      <BackToTop isVisible={isScrolled} />
    </div>
  );
};

export default Homepage;
