import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquareText, ArrowRight, Youtube, Twitter, Instagram, Linkedin, ShoppingBag, MessageCircle, Save, Smile, Brain, Copy, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import WaitlistModal from '../components/WaitlistModal';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showWaitlist, setShowWaitlist] = useState(false);

  const handleTryForFree = () => {
    if (user) {
      navigate('/reply/youtube');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Hero Section */}
<section className="py-16 md:py-24">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
      
      {/* Left Column: Heading + Benefits + Button */}
      <div>
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Reply to YouTube Comments{' '}
          <motion.span 
            className="text-[#FF0000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            10x Faster
          </motion.span>
        </motion.h1>

        {/* Key Benefits */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 shrink-0 mt-[2px]" />
            <p className="text-sm text-gray-700">
              Engage your audience better with AI-generated replies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 shrink-0 mt-[2px]" />
            <p className="text-sm text-gray-700">
              GPT uses your <strong>Video Title + Description + Comment</strong> to generate smart replies
            </p>
          </div>
        </div>

        {/* Insight */}
        <div className="bg-gray-100 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-sm text-gray-600 italic">
            "70% of viewers are more likely to watch future videos if their comment gets a response."
          </p>
          <p className="text-sm text-gray-500 mt-1">
            - YouTube Insights Report
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleTryForFree}
          className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          Try For Free
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Right Column: Video Embed */}
      <div className="w-full max-w-xs mx-auto rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/bzl5goNMikw"
          title="CommentQuick Demo"
          className="w-full h-[560px]"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

    </div>
  </div>
</section>


      {/* Platforms Coming Soon Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Other Platforms coming soon!</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: <Twitter size={24} />, name: "X", color: "text-[#1DA1F2]" },
                { icon: <Instagram size={24} />, name: "Instagram", color: "text-[#E4405F]" },
                { icon: <Linkedin size={24} />, name: "LinkedIn", color: "text-[#0A66C2]" },
                { icon: <ShoppingBag size={24} />, name: "Shopify", color: "text-[#7AB55C]" }
              ].map((platform, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-4 rounded-lg bg-gray-50 border border-gray-100 ${platform.color}`}
                >
                  {platform.icon}
                  <span className="font-medium">{platform.name}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowWaitlist(true)}
                className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "It's hard to keep up with comments as a solo creator. This tool made me look like a pro. My community thinks I'm super responsive!",
                author: "Vlogger with 420K subscribers"
              },
              {
                quote: "I can now reply to a ton of comments over breakfast. It's insanely fast and the replies sound just like me.",
                author: "Business channel with 260K subscribers"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <MessageCircle className="w-8 h-8 text-red-500 mb-4" />
                <p className="text-gray-700 mb-4">{testimonial.quote}</p>
                <p className="text-sm text-gray-500">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Youtube className="w-8 h-8 text-red-500" />,
                title: "Paste your YouTube video link",
                description: "Paste your video URL — we'll fetch comments instantly."
              },
              {
                icon: <Brain className="w-8 h-8 text-red-500" />,
                title: "Generate 3 AI-smart replies",
                description: "Personalized, natural, and context-aware replies."
              },
              {
                icon: <Copy className="w-8 h-8 text-red-500" />,
                title: "Copy, save, or post your reply",
                description: "Quick tools to act on the best response."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-block p-3 bg-red-50 rounded-full mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Feature Highlights</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <MessageCircle className="w-6 h-6 text-red-500" />,
                title: "Multiple Tones",
                description: "Choose from Casual, Professional, Humorous, or Engaging."
              },
              {
                icon: <Brain className="w-6 h-6 text-red-500" />,
                title: "Human-like Replies",
                description: "AI that sounds just like you."
              },
              {
                icon: <Smile className="w-6 h-6 text-red-500" />,
                title: "Smart Emoji Support",
                description: "Emojis that match the mood and comment."
              },
              {
                icon: <Save className="w-6 h-6 text-red-500" />,
                title: "Save Your Favorites",
                description: "Build a quick-access library."
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="p-2 bg-red-50 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose the Plan That Fits You</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-base font-medium">
                  <span className="text-red-600">❌</span>
                  <span>100 AI replies</span>
                </li>
                <li className="flex items-center gap-2 text-sm">✅ Save Replies</li>
                <li className="flex items-center gap-2 text-sm">✅ Multiple Tones</li>
                <li className="flex items-center gap-2 text-sm">❌ Priority Support</li>
              </ul>
              <button
                onClick={handleTryForFree}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Try Free →
              </button>
            </motion.div>

            {/* Pro Monthly Plan */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-500 relative scale-105 z-10"
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro Monthly</h3>
              <div className="mb-4">
                <span className="text-gray-400 line-through text-lg">$15</span>{" "}
                <span className="text-4xl font-bold">$10</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-base font-medium">
                  <span className="text-green-600">✅</span>
                  <span className="font-bold">Unlimited AI Replies</span>
                </li>
                <li className="flex items-center gap-2 text-sm">✅ Save Replies</li>
                <li className="flex items-center gap-2 text-sm">✅ Multiple Tones</li>
                <li className="flex items-center gap-2 text-sm">✅ Priority Support</li>
              </ul>
              <button
                onClick={handleTryForFree}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Go Pro →
              </button>
            </motion.div>

            {/* Pro Yearly Plan */}
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-2">Pro Yearly</h3>
              <div className="mb-4">
                <span className="text-gray-400 line-through text-lg">$150</span>{" "}
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-500">/year</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-base font-medium">
                  <span className="text-green-600">✅</span>
                  <span className="font-bold">Unlimited AI Replies</span>
                </li>
                <li className="flex items-center gap-2 text-sm">✅ Save Replies</li>
                <li className="flex items-center gap-2 text-sm">✅ Multiple Tones</li>
                <li className="flex items-center gap-2 text-sm">✅ Priority Support</li>
              </ul>
              <button
                onClick={handleTryForFree}
                className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Go Pro →
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600">© 2025 CommentQuick</p>
            <p className="text-gray-600">Built with 💡 for creators</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <span className="text-gray-300">|</span>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </div>
  );
};

export default LandingPage;