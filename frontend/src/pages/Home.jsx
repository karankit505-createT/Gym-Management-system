import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { contactAPI } from '../services/api';
import { 
  ArrowRight, 
  Dumbbell, 
  Award, 
  Sparkles, 
  Star, 
  Send,
  Trophy,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Quote
} from 'lucide-react';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setContactError('');
    setContactSubmitted(false);

    try {
      const res = await contactAPI.submitInquiry(formData);
      if (res.data.success) {
        setContactSubmitted(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
        setTimeout(() => setContactSubmitted(false), 6000);
      }
    } catch (err) {
      setContactError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-16 bg-slate-50 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-red-50 border border-red-200 px-3 py-1 rounded-md text-red-700 text-xs font-bold uppercase tracking-wider">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Premier Fitness Club</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-slate-900 tracking-tight leading-none uppercase">
                TRAIN HARD. <br />
                <span className="text-red-600">STAY DISCIPLINED.</span>
              </h1>

              <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                IronPulse Gym provides modern heavy strength machines, free weights area, group cardio classes, and certified fitness coaches for beginner to advanced lifters.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-md transition-colors text-center inline-flex items-center justify-center space-x-2"
                >
                  <span>Start Membership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/membership"
                  className="px-6 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm rounded-md transition-colors text-center"
                >
                  View Pricing Plans
                </Link>
              </div>

              {/* Real Gym Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-slate-700">
                <div>
                  <h4 className="text-2xl font-heading font-black text-slate-900">5:00 AM</h4>
                  <p className="text-xs text-slate-500 font-medium">Opens Daily</p>
                </div>
                <div>
                  <h4 className="text-2xl font-heading font-black text-slate-900">Certified</h4>
                  <p className="text-xs text-slate-500 font-medium">Personal Trainers</p>
                </div>
                <div>
                  <h4 className="text-2xl font-heading font-black text-slate-900">24/7 VIP</h4>
                  <p className="text-xs text-slate-500 font-medium">Annual Access</p>
                </div>
              </div>

            </div>

            {/* Right Gym Photo Container */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-sm relative">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                  alt="Gym Floor Area"
                  className="w-full h-[380px] object-cover rounded-md"
                />
                <div className="mt-2 p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-800 font-semibold">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Sector 15 Main Arena</span>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                    Photo Placeholder
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. EXPLORE SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-slate-200 pb-4">
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider block">IronPulse Overview</span>
          <h2 className="text-2xl lg:text-3xl font-heading font-black text-slate-900 uppercase">OUR GYM SERVICES & FACILITIES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: About */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-red-400 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">About IronPulse</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read about our gym history, workout philosophy, equipment setup, and trainer qualifications.
              </p>
            </div>
            <Link
              to="/about"
              className="mt-4 inline-flex items-center text-xs font-bold text-red-600 hover:text-red-700 space-x-1"
            >
              <span>Explore About Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Facilities */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-red-400 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Facilities & Equipment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Check out squat racks, bench presses, cardio treadmills, steam room, and personal lockers.
              </p>
            </div>
            <Link
              to="/facilities"
              className="mt-4 inline-flex items-center text-xs font-bold text-red-600 hover:text-red-700 space-x-1"
            >
              <span>View Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Membership */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-red-400 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Membership Plans</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Monthly, quarterly, half-yearly and annual membership packages with instant online activation.
              </p>
            </div>
            <Link
              to="/membership"
              className="mt-4 inline-flex items-center text-xs font-bold text-red-600 hover:text-red-700 space-x-1"
            >
              <span>View Pricing Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Reviews */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-red-400 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Member Feedback</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Read feedback and reviews from our active gym members about training and environment.
              </p>
            </div>
            <Link
              to="/testimonials"
              className="mt-4 inline-flex items-center text-xs font-bold text-red-600 hover:text-red-700 space-x-1"
            >
              <span>Read Feedback</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* RUNNING TESTIMONIALS MARQUEE SECTION */}
      <section className="space-y-4 overflow-hidden py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <span className="text-orange-600 text-xs font-bold uppercase tracking-wider block">Real Member Feedback</span>
            <h2 className="text-2xl font-heading font-black text-slate-900 uppercase">RUNNING TESTIMONIALS & REVIEWS</h2>
          </div>
          <Link
            to="/testimonials"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <span>View All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative w-full overflow-hidden bg-white py-4 border-y border-slate-200">
          <div className="animate-marquee-left space-x-6">
            {[
              { initials: "VS", name: "Vikram Sethi", meta: "Quarterly Pro", quote: "IronPulse gym is very well equipped. Trainers guide properly on form!" },
              { initials: "SR", name: "Sneha Roy", meta: "Yearly VIP", quote: "Clean gym area, good lockers, 5:00 AM opening time fits my routine!" },
              { initials: "AS", name: "Amit Sharma", meta: "PT Client", quote: "Trained for 3 months. Lost 8kg and improved overall energy levels!" },
              { initials: "RM", name: "Rohan Malhotra", meta: "Half-Yearly Gold", quote: "Great dumbbell range up to 50kg, sturdy power racks and clean showers!" },
              { initials: "PV", name: "Pooja Verma", meta: "Monthly Pass", quote: "Super welcoming atmosphere for women. Trainers are extremely supportive!" },
              { initials: "RK", name: "Rajesh Kumar", meta: "Yearly VIP", quote: "Top-notch bio-mechanical machines. Spacious setup and zero rush!" },
              { initials: "VS", name: "Vikram Sethi", meta: "Quarterly Pro", quote: "IronPulse gym is very well equipped. Trainers guide properly on form!" },
              { initials: "SR", name: "Sneha Roy", meta: "Yearly VIP", quote: "Clean gym area, good lockers, 5:00 AM opening time fits my routine!" },
              { initials: "AS", name: "Amit Sharma", meta: "PT Client", quote: "Trained for 3 months. Lost 8kg and improved overall energy levels!" },
              { initials: "RM", name: "Rohan Malhotra", meta: "Half-Yearly Gold", quote: "Great dumbbell range up to 50kg, sturdy power racks and clean showers!" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="w-[320px] bg-slate-50 border border-slate-200 rounded-xl p-4 shrink-0 hover:border-orange-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-500 space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-orange-300" />
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2 mb-3">
                  "{item.quote}"
                </p>
                <div className="flex items-center space-x-2.5 pt-2 border-t border-slate-200">
                  <div className="w-7 h-7 rounded-md bg-orange-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {item.initials}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{item.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-red-600 text-xs font-bold uppercase tracking-wider block">Get In Touch</span>
              <h2 className="text-2xl font-heading font-black text-slate-900 uppercase">CONTACT GYM DESK</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have questions regarding trial sessions, batch timings, or personal training? Send us a message and our staff will respond promptly.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Free 1-Day Trial Pass available</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Personal Trainer orientation</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Direct phone & WhatsApp support</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {contactSubmitted && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded-md flex items-center space-x-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Thank you! Your message has been received. We will contact you soon.</span>
                  </div>
                )}

                {contactError && (
                  <div className="bg-red-50 border border-red-300 text-red-800 text-xs p-3 rounded-md font-medium">
                    {contactError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Ask about trial pass, batch timing, or fees..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600 focus:bg-white"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-md transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
