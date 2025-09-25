'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';


// YouTube Video Player Component with PiP on Scroll
function YouTubeVideo({ videoId }: { videoId: string }) {
  const [isInView, setIsInView] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Auto-enable video on page load
  useEffect(() => {
    // Automatically enable user interaction after a short delay
    const timer = setTimeout(() => {
      setUserInteracted(true);
    }, 500);

    // Also handle manual user interaction
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isCurrentlyInView = entry.isIntersecting;
          setIsInView(isCurrentlyInView);
          
          // Start video immediately when in view
          if (isCurrentlyInView && !videoStarted) {
            setVideoStarted(true);
          }
        });
      },
      { 
        threshold: 0.1, // Lower threshold for earlier detection
        rootMargin: '100px 0px 100px 0px' // Larger margin for earlier detection
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [videoStarted]);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoStarted || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
      
      // More precise PiP logic
      if (!isVisible && isInView && !isPiPActive) {
        setIsPiPActive(true);
      } else if (isVisible && isPiPActive) {
        setIsPiPActive(false);
      }
    };

    const throttledScroll = (() => {
      let ticking = false;
      return () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };
    })();

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [videoStarted, isPiPActive, isInView]);

  // Debug logging
  useEffect(() => {
    console.log('Video States:', { isInView, isPiPActive, videoStarted, userInteracted });
  }, [isInView, isPiPActive, videoStarted, userInteracted]);

  // Enhanced embed URL with aggressive autoplay
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&start=0&playsinline=1`;

  return (
    <>
      <div 
        ref={containerRef}
        className="relative w-full h-full rounded-2xl overflow-hidden neon-glow group"
      >
        <iframe
          ref={videoRef}
          src={embedUrl}
          className="w-full h-full object-cover transition-all duration-500"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          title="SavvyIndians AI Showcase"
          loading="lazy"
        />
        
        {/* Loading Indicator */}
        {!videoStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div 
              className="flex items-center space-x-3 text-cyan-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-lg font-medium">Loading Video...</span>
            </motion.div>
          </div>
        )}
        
        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {videoStarted && (
            <motion.div 
              className="bg-green-500/80 px-2 py-1 rounded text-white text-xs backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ▶ Auto Playing
            </motion.div>
          )}
          {isPiPActive && (
            <motion.div 
              className="bg-blue-500/80 px-2 py-1 rounded text-white text-xs backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              📺 PiP Mode
            </motion.div>
          )}
        </div>
        
        {/* Auto-play Status */}
        {videoStarted && (
          <motion.div 
            className="absolute bottom-4 left-4 bg-cyan-500/20 backdrop-blur-sm px-3 py-2 rounded-lg text-cyan-400 text-xs border border-cyan-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            🎬 Auto-Playing | {isPiPActive ? '📺 PiP Active' : '👁️ In View'}
          </motion.div>
        )}
      </div>

      {/* Picture-in-Picture Floating Video */}
      {isPiPActive && videoStarted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 100, y: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed bottom-6 right-6 w-80 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-cyan-500/50 neon-glow bg-black backdrop-blur-sm"
          style={{ zIndex: 9999 }}
        >
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title="SavvyIndians AI Showcase - PiP"
          />
          <motion.button
            onClick={() => setIsPiPActive(false)}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-sm transition-colors duration-200 z-10 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
          <div className="absolute top-2 left-2 bg-cyan-500/80 px-2 py-1 rounded text-white text-xs z-10 backdrop-blur-sm">
            📺 PiP Mode
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-cyan-400 text-xs z-10">
            Scroll to return to main view
          </div>
        </motion.div>
      )}
    </>
  );
}

// Animated Particles Background
function ParticlesBackground() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-cyan-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Glitch Text Component
function GlitchText({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`${className} ${isGlitching ? 'glitch-text' : ''}`}>
      {children}
    </span>
  );
}

// Modal Form Component
function FormModal({ isOpen, onClose, title, description }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  description: string; 
}) {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Import config dynamically
      const { submitToGoogleSheets } = await import('../config/googleSheets');
      
      // Submit to Google Sheets
      await submitToGoogleSheets({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        formType: title,
      });

      setIsSubmitting(false);
      alert('Form submitted successfully! We will contact you soon.');
      setFormData({ name: '', phone: '', email: '' });
      onClose();
      
    } catch (error) {
      console.error('Form submission error:', error);
      setIsSubmitting(false);
      
      // Fallback - show error but still close form
      alert('Form submitted! If there are any issues, please contact us directly at swapnilkumar2028@gmail.com');
      setFormData({ name: '', phone: '', email: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-black border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full glassmorphism"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {title}
          </h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-4 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-4 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-500 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 neon-glow disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [formData, setFormData] = useState({ firstName: '', phone: '', email: '', message: '' });
  const [modalForm, setModalForm] = useState({ isOpen: false, title: '', description: '' });
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Import config dynamically
      const { submitToGoogleSheets } = await import('../config/googleSheets');
      
      // Submit to Google Sheets
      await submitToGoogleSheets({
        name: formData.firstName,
        phone: formData.phone,
        email: formData.email,
        formType: 'Contact Form Inquiry',
        message: formData.message, // Include full message
      });

      setIsLoading(false);
      alert('Form submitted successfully! We will contact you soon.');
      setFormData({ firstName: '', phone: '', email: '', message: '' });
      
    } catch (error) {
      console.error('Form submission error:', error);
      setIsLoading(false);
      
      // Fallback - show error but still reset form
      alert('Form submitted! If there are any issues, please contact us directly at swapnilkumar2028@gmail.com');
      setFormData({ firstName: '', phone: '', email: '', message: '' });
    }
  };

  const services = [
    {
      title: "AI Clone Personalized Avatar",
      description: "Create stunning AI-powered avatars that capture your unique personality and brand identity with cutting-edge technology.",
      icon: "🤖",
      features: ["Realistic AI Generation", "Custom Styling", "Multiple Formats", "Commercial License"]
    },
    {
      title: "Video Editing",
      description: "Professional video editing services that transform raw footage into compelling stories that engage and convert.",
      icon: "🎬",
      features: ["Motion Graphics", "Color Grading", "Sound Design", "4K Quality"]
    },
    {
      title: "Ads Concept Videos",
      description: "Creative advertising concepts that capture attention and drive results across digital platforms and media channels.",
      icon: "�",
      features: ["Concept Development", "Storyboarding", "Production", "Platform Optimization"]
    },
    {
      title: "Graphics Designing",
      description: "Stunning visual designs that communicate your brand message effectively and leave a lasting impression.",
      icon: "🎨",
      features: ["Brand Identity", "Print Design", "Digital Assets", "UI/UX Design"]
    },
    {
      title: "Customised Business Setup",
      description: "Complete business setup solutions tailored to your unique requirements and industry needs.",
      icon: "🖥️",
      features: ["Legal Documentation", "Digital Infrastructure", "Brand Development", "Launch Support"]
    },
    {
      title: "Digital Transformation",
      description: "Complete digital transformation services to modernize your operations and customer experience.",
      icon: "🏢",
      features: ["Strategy Development", "Technology Integration", "Process Automation", "Training & Support"]
    }
  ];

  const testimonials = [
    {
      name: "Rohit Sharma",
      initial: "R",
      company: "TechFlow Solutions",
      position: "CEO",
      testimonial: "SavvyIndians transformed our entire digital presence with their AI solutions. Our engagement increased by 400% and revenue grew by 250% within just 4 months. Their team is absolutely incredible!",
      service: "AI Digital Transformation",
      rating: 5,
      result: "400% engagement increase"
    },
    {
      name: "Priya Singh",
      initial: "P",
      company: "Creative Studio",
      position: "Founder",
      testimonial: "Exceptional AI avatar creation service. Our brand personality came alive in ways we never imagined! The quality and attention to detail exceeded all expectations.",
      service: "AI Clone Avatar",
      rating: 5,
      result: "300% brand recognition"
    },
    {
      name: "Arjun Patel",
      initial: "A", 
      company: "StartUp Hub",
      position: "Co-Founder",
      testimonial: "Complete digital transformation was seamless. From concept to execution, everything was handled professionally. Our business processes are now 10x more efficient.",
      service: "Business Setup",
      rating: 5,
      result: "10x efficiency boost"
    },
    {
      name: "Maya Sharma",
      initial: "M",
      company: "Design Agency",
      position: "Creative Director",
      testimonial: "The masterclasses revolutionized our entire workflow. Our team learned cutting-edge AI techniques that we now use daily. We're now industry leaders in AI-powered design.",
      service: "AI Masterclasses",
      rating: 5,
      result: "Team efficiency +200%"
    },
    {
      name: "Vikram Gupta",
      initial: "V",
      company: "E-commerce Excellence",
      position: "Marketing Head",
      testimonial: "Outstanding video editing services! They transformed our raw footage into compelling stories that significantly boosted our engagement rates and conversion.",
      service: "Video Editing",
      rating: 5,
      result: "500% engagement boost"
    },
    {
      name: "Sneha Reddy",
      initial: "S",
      company: "Fashion Forward",
      position: "Brand Manager",
      testimonial: "Their graphics design perfectly captured our brand essence. Professional, creative, and delivered on time every single time. Our brand visibility increased dramatically.",
      service: "Graphics Design",
      rating: 5,
      result: "Brand visibility +350%"
    },
    {
      name: "Karan Mehta",
      initial: "K",
      company: "InstaBrand",
      position: "CEO",
      testimonial: "The AI-driven ads concept videos boosted our campaign performance remarkably. The team's creativity and understanding of our brand were spot on!",
      service: "Ads Concept Videos",
      rating: 5,
      result: "Campaign performance +300%"
    },
    {
      name: "Neha Agarwal",
      initial: "N",
      company: "WebWonders",
      position: "Co-Founder",
      testimonial: "Their AI-powered approach helped us save time and deliver better quality. Highly recommend their team!",
      service: "AI Clone Avatar",
      rating: 5,
      result: "200% time savings"
    }
  ];

  // Carousel auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Neon Particles Background */}
      <ParticlesBackground />
      


      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 bg-black/90 backdrop-blur-sm border-b border-cyan-500/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Image src="/savvy logo.jpg" alt="SavvyIndians Logo" width={48} height={48} className="h-12 w-auto mr-3 rounded-lg" />
                <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                SavvyIndians
              </span>
            </motion.div>
            <div className="hidden md:flex space-x-8">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative"
                  whileHover={{ scale: 1.1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Cinematic Hero Section */}
      <section id="home" className="bg-black relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlitchText className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Creative Solutions
            </GlitchText>
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-300 mb-4 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Revolutionizing Your Business with AI, Design & Innovation
          </motion.p>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            From AI clones to full digital setups, we build brands that stand out in the digital landscape.
          </motion.p>
          
          <motion.button
            className="px-12 py-4 rounded-full text-xl font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 neon-glow"
            onClick={() => setModalForm({ 
              isOpen: true, 
              title: 'Join Our Masterclasses', 
              description: 'Get exclusive access to AI-powered creative masterclasses and transform your skills!' 
            })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Explore Our Masterclasses →
          </motion.button>
        </motion.div>
      </section>

      {/* Sci-Fi Dashboard Section */}
      <section id="about" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* YouTube Auto-play Video */}
            <div className="h-96 relative">
              <YouTubeVideo videoId="zSzWV6tbp58" />
            </div>

            {/* Business Metrics */}
            <div className="space-y-8">
              <GlitchText className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Innovation
              </GlitchText>
              
              <motion.p 
                className="text-lg text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Experience the future of creative services with our cutting-edge AI technology 
                and innovative design solutions that transform your business vision into reality.
              </motion.p>

              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 neon-glow"
                onClick={() => setModalForm({ 
                  isOpen: true, 
                  title: 'Get Service Details', 
                  description: 'Let us know your requirements and get a personalized quote for our AI services!' 
                })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Discover Our Services →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Masterclasses & Certifications Section */}
      <section className="bg-black relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlitchText className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Our Services
              </GlitchText>
            </motion.h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-4">
              Explore our comprehensive masterclasses and certifications designed for your success.
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            {/* Masterclasses */}
            <motion.div
              className="glassmorphism p-8 rounded-2xl relative overflow-hidden group cursor-pointer text-center"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl mb-6">🎓</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Masterclasses</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Engage in detailed sessions led by experts, enhancing your skills and knowledge.
              </p>
              
              <div className="space-y-3 mb-8">
                {["Expert-Led Sessions", "Hands-On Learning", "Interactive Workshops", "Skill Enhancement"].map((feature, index) => (
                  <div key={index} className="flex items-center justify-center text-gray-400">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 neon-glow"
                onClick={() => setModalForm({ 
                  isOpen: true, 
                  title: 'Join Our Masterclasses', 
                  description: 'Get exclusive access to AI-powered creative masterclasses and transform your skills!' 
                })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Masterclasses
              </motion.button>
            </motion.div>

            {/* Certifications */}
            <motion.div
              className="glassmorphism p-8 rounded-2xl relative overflow-hidden group cursor-pointer text-center"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Certifications</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Achieve recognized certifications that endorse your professional capabilities and growth.
              </p>
              
              <div className="space-y-3 mb-8">
                {["Professional Recognition", "Industry Standards", "Career Growth", "Skill Validation"].map((feature, index) => (
                  <div key={index} className="flex items-center justify-center text-gray-400">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:from-purple-400 hover:to-pink-400 transition-all duration-300 neon-glow"
                onClick={() => setModalForm({ 
                  isOpen: true, 
                  title: 'Get Certified', 
                  description: 'Start your certification journey and validate your skills with industry-recognized credentials!' 
                })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Certified
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Creative Services Section */}
      <section id="services" className="bg-black relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <GlitchText className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Our Creative Services
              </GlitchText>
            </motion.h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              We combine cutting-edge AI technology with creative expertise to deliver exceptional results that exceed expectations.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="glassmorphism p-8 rounded-2xl relative overflow-hidden group cursor-pointer"
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {hoveredCard === index && (
                  <div className="absolute inset-0 scan-line"></div>
                )}
                
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400">{service.title}</h3>
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">{service.description}</p>
                
                {service.features && (
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-gray-400 text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                )}
                
                <motion.div
                  className="flex items-center text-purple-400 font-semibold text-sm"
                  whileHover={{ x: 10 }}
                >
                  Learn More →
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SavvyIndians Section */}
      <section className="bg-black relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Why Choose <span className="gradient-text">SavvyIndians</span>?
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-300 mb-12 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                We&apos;re a team of passionate creators and tech innovators who believe in the power of AI 
                to transform creative processes. Our mission is to make cutting-edge creative services 
                accessible to businesses of all sizes.
              </motion.p>

              {/* Key Features */}
              <div className="space-y-8">
                {[
                  {
                    icon: "🤖",
                    title: "AI-Powered Creativity",
                    description: "We leverage the latest AI technologies to enhance our creative processes and deliver exceptional results."
                  },
                  {
                    icon: "👨‍💼",
                    title: "Expert Team",
                    description: "Our team consists of experienced designers, video editors, and AI specialists dedicated to your success."
                  },
                  {
                    icon: "🌟",
                    title: "24/7 Support",
                    description: "We're always here to help, providing round-the-clock support for all your creative needs."
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 neon-glow"
                  onClick={() => setModalForm({ 
                    isOpen: true, 
                    title: 'Start Your AI Journey', 
                    description: 'Ready to transform your business with AI? Let\'s connect and discuss your goals!' 
                  })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your Journey
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Stats Grid */}
            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                {
                  icon: "👨‍💻",
                  number: "15+",
                  label: "Professionals",
                  subtitle: "Expert Team"
                },
                {
                  icon: "🎯",
                  number: "99%",
                  label: "Delivery",
                  subtitle: "Success Rate"
                },
                {
                  icon: "💡",
                  number: "AI-Powered",
                  label: "Solutions",
                  subtitle: "Innovation"
                },
                {
                  icon: "🏆",
                  number: "5+",
                  label: "Years",
                  subtitle: "Experience"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="glassmorphism rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 border border-cyan-500/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ 
                    boxShadow: "0 0 30px rgba(0, 245, 255, 0.3)",
                    borderColor: "rgba(0, 245, 255, 0.5)" 
                  }}
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.subtitle}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Carousel Style */}
      <section className="bg-black relative z-10 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlitchText className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Success Stories
              </GlitchText>
            </motion.h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Transforming businesses with AI-powered solutions. See what our clients achieved.
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="relative max-w-6xl mx-auto mb-16">
            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-3xl">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="glassmorphism p-8 md:p-12 mx-4 rounded-3xl relative overflow-hidden group border border-cyan-500/30">
                      {/* Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-60"></div>
                      
                      {/* Quote Icon */}
                      <div className="absolute top-6 left-6 text-6xl text-cyan-400/30">&ldquo;</div>
                      
                      <div className="relative z-10">
                        {/* Rating */}
                        <div className="flex justify-center mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.span 
                              key={i} 
                              className="text-yellow-400 text-2xl mx-1"
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1, duration: 0.3 }}
                            >
                              ★
                            </motion.span>
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <motion.p 
                          className="text-xl md:text-2xl text-gray-200 leading-relaxed text-center mb-8 italic font-light"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        >
                          &ldquo;{testimonial.testimonial}&rdquo;
                        </motion.p>

                        {/* Client Info */}
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-2xl font-bold text-white mr-4">
                              {testimonial.initial}
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-white">{testimonial.name}</h4>
                              <p className="text-cyan-400 text-lg">{testimonial.position}, {testimonial.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-4">
                            <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-cyan-500/30">
                              <span className="text-cyan-300 font-semibold">{testimonial.service}</span>
                            </div>
                            <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-full border border-green-500/30">
                              <span className="text-green-300 font-semibold">{testimonial.result}</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-3xl">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-sm"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 glassmorphism w-12 h-12 rounded-full flex items-center justify-center text-cyan-400 hover:text-white hover:scale-110 transition-all duration-300 neon-glow z-10"
              onClick={prevSlide}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 glassmorphism w-12 h-12 rounded-full flex items-center justify-center text-cyan-400 hover:text-white hover:scale-110 transition-all duration-300 neon-glow z-10"
              onClick={nextSlide}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-cyan-400 scale-125 neon-glow' 
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { number: "50+", label: "Happy Clients" },
              { number: "99%", label: "Success Rate" },
              { number: "150%", label: "Avg Growth" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glassmorphism p-4 rounded-xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 neon-glow"
              onClick={() => setModalForm({ 
                isOpen: true, 
                title: 'Become Our Next Success Story', 
                description: 'Ready to join our growing list of successful clients? Let\'s discuss how we can transform your business with AI-powered solutions!' 
              })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Become Our Next Success Story ✨
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-black relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <GlitchText className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Contact Us
            </GlitchText>
          </motion.h2>

          {/* Contact Form */}
          <motion.form
            className="glassmorphism p-8 rounded-2xl space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full p-4 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-4 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                required
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                required
              />
              <textarea
                placeholder="Message *"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full p-4 bg-black/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                required
              ></textarea>
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold neon-glow disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Your Inquiry'
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black relative z-10 glassmorphism border-t border-cyan-500/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Follow Us On Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-3xl font-bold text-white mb-6">Follow Us On</h3>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Stay connected with our latest updates and masterclasses.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                {[
                  { 
                    name: 'LinkedIn', 
                    url: 'https://www.linkedin.com/company/savvy-indians/',
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )
                  },
                  { 
                    name: 'YouTube', 
                    url: 'https://www.youtube.com/@SAVVYINDIANSAI',
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )
                  },
                  { 
                    name: 'Instagram', 
                    url: 'https://www.instagram.com/savvyindians.ai/',
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )
                  },
                  { 
                    name: 'Facebook', 
                    url: 'https://www.facebook.com/people/SavvyIndiansai/61579325421925/',
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )
                  }
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 glassmorphism rounded-full flex items-center justify-center text-cyan-400 hover:text-white hover:scale-110 transition-all duration-300 neon-glow"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">SUPPORT</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-white font-semibold text-lg mb-2">WhatsApp Support: +91-7976269433</p>
                </div>
                
                <div>
                  <p className="text-white font-semibold mb-1">Email:</p>
                  <p className="text-white">swapnilkumar2028@gmail.com</p>
                </div>
                
                <div>
                  <p className="text-white font-semibold mb-2">Address: 75, Govindpuri, Bhawna Estate Road, Sikandra, Agra, UP - 282007</p>
                </div>
              </div>
            </motion.div>

            {/* Location Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Location Map */}
              <div>
                <div className="flex items-center gap-2 text-gray-300 mb-3">
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="text-sm font-semibold">75, Govindpuri, Bhawna Estate Road, Sikandra, Agra</span>
                </div>
                <div className="w-full h-48 rounded-lg overflow-hidden glassmorphism border border-cyan-500/30">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.2!2d78.0417084!3d27.1766701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747121d702ff6d%3A0xdd2ae4803f767dbe!2s75%2C%20Govindpuri%2C%20Bhawna%20Estate%20Road%2C%20Sikandra%2C%20Agra%2C%20Uttar%20Pradesh%20282007!5e0!3m2!1sen!2sin!4v1735238600000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="opacity-90 hover:opacity-100 transition-opacity"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Copyright & Legal Links */}
          <motion.div 
            className="border-t border-gray-700 mt-12 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-center md:text-left">
                © 2025. All rights reserved to savvyindians.
              </p>
              <div className="flex space-x-6">
                <motion.a
                  href="/privacy"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href="/terms"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Terms & Conditions
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Floating WhatsApp Button - Right Side Middle */}
      <motion.a
        href="https://wa.me/919031988665?text=Hi%20SavvyIndians!%20I'm%20interested%20in%20your%20AI%20services.%20Can%20you%20help%20me?"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group neon-glow"
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, x: 100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* WhatsApp Icon - Exact Brand Icon */}
        <svg 
          className="w-9 h-9 text-white group-hover:scale-110 transition-transform duration-300" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
        
        {/* Pulsing Ring Effects */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60"></div>
        <div className="absolute inset-0 rounded-full bg-green-500 opacity-20"></div>
        <div className="absolute -inset-2 rounded-full bg-green-300 animate-pulse opacity-30"></div>
        
        {/* Tooltip */}
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl border border-green-500/30">
          <div className="flex items-center space-x-2">
            <span className="text-green-400">💬</span>
            <span>Chat with us on WhatsApp</span>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 w-2 h-2 bg-black/90 rotate-45"></div>
        </div>
        
        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </motion.a>

      {/* Form Modal */}
      <FormModal 
        isOpen={modalForm.isOpen} 
        onClose={() => setModalForm({ ...modalForm, isOpen: false })} 
        title={modalForm.title}
        description={modalForm.description}
      />
    </div>
  );
}
