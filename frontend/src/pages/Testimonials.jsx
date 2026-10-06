import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const reviewsData = [
  {
    id: 1,
    initials: "VS",
    name: "Vikram Sethi",
    meta: "Member • Quarterly Pro Plan",
    plan: "Quarterly Pro",
    rating: 5,
    quote: "IronPulse gym is very well equipped and maintained. The trainers guide you properly on squat and bench form. Best gym in the area!"
  },
  {
    id: 2,
    initials: "SR",
    name: "Sneha Roy",
    meta: "Member • Yearly VIP Plan",
    plan: "Yearly VIP",
    rating: 5,
    quote: "Clean gym area, good locker facilities, and early morning 5:00 AM opening time fits my routine perfectly."
  },
  {
    id: 3,
    initials: "AS",
    name: "Amit Sharma",
    meta: "Member • Personal Training Client",
    plan: "Personal Training",
    rating: 5,
    quote: "Trained under Coach Alex for 3 months. Lost 8kg and improved overall energy levels significantly. Highly recommended!"
  },
  {
    id: 4,
    initials: "RM",
    name: "Rohan Malhotra",
    meta: "Member • Half-Yearly Plan",
    plan: "Half-Yearly Gold",
    rating: 5,
    quote: "Very good dumbbell range up to 50kg, sturdy power racks, and clean shower rooms. Professional environment."
  },
  {
    id: 5,
    initials: "PV",
    name: "Pooja Verma",
    meta: "Member • Monthly Basic Plan",
    plan: "Monthly Pass",
    rating: 5,
    quote: "Super welcoming atmosphere for women. Trainers are extremely supportive and maintain a safe, clean space."
  },
  {
    id: 6,
    initials: "RK",
    name: "Rajesh Kumar",
    meta: "Member • Yearly VIP Plan",
    plan: "Yearly VIP",
    rating: 5,
    quote: "Top-notch bio-mechanical machines. No waiting time during evening peak hours because equipment setup is spacious."
  },
  {
    id: 7,
    initials: "PN",
    name: "Priya Nambiar",
    meta: "Member • Quarterly Pro Plan",
    plan: "Quarterly Pro",
    rating: 5,
    quote: "The diet advice along with workouts helped me improve my stamina and body posture in just 6 weeks."
  },
  {
    id: 8,
    initials: "AC",
    name: "Ankit Choudhary",
    meta: "Member • Half-Yearly Plan",
    plan: "Half-Yearly Gold",
    rating: 5,
    quote: "IronPulse admin portal makes renewing membership and tracking attendance super easy. Best value for money gym!"
  }
];

const Testimonials = () => {
  return (
    <div className="space-y-10 pb-20 pt-6 font-sans bg-slate-50 min-h-[70vh]">
      
      {/* HEADER SECTION */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Member Feedback</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 uppercase tracking-tight">
            MEMBER <span className="text-orange-600">REVIEWS</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Real feedback from active members training at IronPulse Gym.
          </p>
        </div>
      </section>

      {/* SINGLE CONTINUOUS RUNNING MARQUEE TRACK */}
      <section className="space-y-6 overflow-hidden py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">Live Stream</span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 uppercase">
              REVIEWS (HOVER TO PAUSE)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-bold font-mono bg-white px-3 py-1 rounded-md border border-slate-200">
            ⚡ Running Marquee
          </span>
        </div>

        {/* Single Running Track */}
        <div className="relative w-full overflow-hidden bg-white py-6 border-y border-slate-200 shadow-xs">
          <div className="animate-marquee-left space-x-6">
            {[...reviewsData, ...reviewsData].map((item, idx) => (
              <div
                key={idx}
                className="w-[340px] sm:w-[400px] bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs shrink-0 hover:border-orange-500 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500 space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-orange-300" />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed font-medium mb-4 min-h-[60px]">
                  "{item.quote}"
                </p>

                <div className="flex items-center space-x-3 pt-3 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 text-white font-black flex items-center justify-center text-sm font-heading shrink-0">
                    {item.initials}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{item.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER TRANSFORMATION STORIES WITH PHOTOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="mb-6 border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <span className="text-orange-600 text-xs font-bold uppercase tracking-wider block">Transformation Results</span>
            <h2 className="text-2xl font-heading font-black text-slate-900 uppercase">MEMBER TRANSFORMATION STORIES</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono bg-white px-3 py-1 rounded border border-slate-200 font-semibold">
            Real Results
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 space-y-3 shadow-xs hover:border-orange-500 transition-colors group">
            <div className="h-56 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
              <img 
                src="/images/client_transform_rahul.jpg" 
                alt="Siddharth Menon Transformation" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Siddharth Menon</h3>
              <p className="text-xs font-bold text-orange-600 uppercase">12-Week Fat Loss & Strength Shred</p>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Dropped 16kg of body fat while adding 40kg to my deadlift through progressive overload."
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-200 text-center text-xs">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Weight</span>
                <strong className="text-slate-900 text-xs font-sans">96&rarr;80kg</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Body Fat</span>
                <strong className="text-slate-900 text-xs font-sans">28%&rarr;14%</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Time</span>
                <strong className="text-orange-600 text-xs font-sans">12 Wks</strong>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 space-y-3 shadow-xs hover:border-orange-500 transition-colors group">
            <div className="h-56 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
              <img 
                src="/images/client_transform_ananya.jpg" 
                alt="Pooja Deshmukh Transformation" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Pooja Deshmukh</h3>
              <p className="text-xs font-bold text-orange-600 uppercase">16-Week Athletic Body Recomp</p>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Sculpted peak core strength, eliminated back pain, and built lean muscle definition."
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-200 text-center text-xs">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Weight</span>
                <strong className="text-slate-900 text-xs font-sans">68&rarr;59kg</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Squat PR</span>
                <strong className="text-slate-900 text-xs font-sans">20&rarr;75kg</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Time</span>
                <strong className="text-orange-600 text-xs font-sans">16 Wks</strong>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 space-y-3 shadow-xs hover:border-orange-500 transition-colors group">
            <div className="h-56 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative">
              <img 
                src="/images/client_transform_karan.jpg" 
                alt="Manish Kapoor Transformation" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-heading font-bold text-slate-900 uppercase">Manish Kapoor</h3>
              <p className="text-xs font-bold text-orange-600 uppercase">20-Week Lean Muscle Bulk</p>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Went from a skinny frame to adding 8kg of solid muscle mass with targeted coaching."
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-200 text-center text-xs">
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Weight</span>
                <strong className="text-slate-900 text-xs font-sans">58&rarr;67kg</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Bench PR</span>
                <strong className="text-slate-900 text-xs font-sans">40&rarr;95kg</strong>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Time</span>
                <strong className="text-orange-600 text-xs font-sans">20 Wks</strong>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Testimonials;
