import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      initials: "VS",
      name: "Vikram Sethi",
      meta: "Member since 2024 • Quarterly Pro",
      quote: "IronPulse has completely redefined my fitness journey. The trainers actually care about your progress and the steam sauna is the perfect post-workout treat!"
    },
    {
      initials: "SR",
      name: "Sneha Roy",
      meta: "Member since 2023 • Yearly VIP",
      quote: "The 24/7 VIP access is a lifesaver for my corporate schedule. Heavy duty Eleiko power racks and zero crowd queues late at night!"
    },
    {
      initials: "AS",
      name: "Amit Sharma",
      meta: "Member since 2025 • PT Client",
      quote: "I hired Alex Rivera for 1-on-1 personal training and lost 15kg in under 4 months. The PDF digital receipts and app check-in make everything super easy."
    },
    {
      initials: "RM",
      name: "Rohan Malhotra",
      meta: "Member since 2024 • Half-Yearly Elite",
      quote: "The cleanest gym I've ever stepped into. Showers are pristine, lockers are digital, and the group HIIT classes are intense and rewarding."
    },
    {
      initials: "KR",
      name: "Kavita Reddy",
      meta: "Member since 2023 • Yearly VIP",
      quote: "Joining IronPulse was the best decision of my 30s. Great community vibe, helpful staff, and top tier machines that don't jerk your joints."
    },
    {
      initials: "DN",
      name: "Deepak Nair",
      meta: "Member since 2025 • Quarterly Pro",
      quote: "Smooth online payments, instant digital PDF invoice downloads, and fantastic cardio StairMasters. 10/10 recommendation!"
    }
  ];

  // Duplicated for 100% smooth infinite marquee scroll
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <div className="space-y-12 pb-16 pt-2 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-8 sm:py-10 bg-gradient-to-b from-gym-orange/10 via-transparent to-transparent text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-3 font-sans">
            MEMBER <span className="gradient-text">TESTIMONIALS</span>
          </h1>
          <p className="text-sm sm:text-base text-gym-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Real stories, real sweat, and real life-changing fitness transformations from the IronPulse Gym community.
          </p>
        </div>
      </section>

      {/* CONTINUOUS MARQUEE SLIDER */}
      <section className="py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 space-y-1">
          <span className="text-gym-orange text-xs font-extrabold uppercase tracking-widest">Community Feedback</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">WHAT OUR MEMBERS SAY</h2>
          <p className="text-xs text-gym-muted">Hover over any review card to pause and read</p>
        </div>

        {/* Marquee Track Container with gradient side fades */}
        <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-12 sm:before:w-28 before:bg-gradient-to-r before:from-gym-dark before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-12 sm:after:w-28 after:bg-gradient-to-l after:from-gym-dark after:to-transparent">
          <div className="animate-marquee flex space-x-6 py-2">
            
            {marqueeReviews.map((item, idx) => (
              <div
                key={idx}
                className="w-[360px] sm:w-[400px] shrink-0 bg-gym-card border border-gym-border/80 hover:border-gym-orange/60 rounded-2xl p-6 space-y-4 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gym-orange/20 group"
              >
                <Quote className="w-8 h-8 text-gym-orange/20 group-hover:text-gym-orange/40 transition-colors absolute top-5 right-5" />
                
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-normal">
                  "{item.quote}"
                </p>

                <div className="flex items-center space-x-3 pt-3 border-t border-gym-border/50">
                  <div className="w-10 h-10 rounded-full bg-gym-orange/20 text-gym-orange font-extrabold flex items-center justify-center text-xs shrink-0 border border-gym-orange/40">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-gym-muted">{item.meta}</p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* TRANSFORMATION STORIES WITH PHOTOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center mb-8 space-y-1">
          <span className="text-gym-orange text-xs font-extrabold uppercase tracking-widest">Before & After</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">TRANSFORMATION STORIES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-gym-card border border-gym-border/80 rounded-2xl overflow-hidden space-y-4 p-5 hover:border-gym-orange/50 transition-all group">
            <img 
              src="/images/client_transform_rahul.jpg" 
              alt="Siddharth Transformation" 
              className="w-full h-48 sm:h-52 object-cover rounded-xl border border-gym-border group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-white">Siddharth Menon</h4>
              <p className="text-xs font-extrabold text-gym-orange uppercase tracking-wider">12-Week Fat Loss Shred</p>
              <p className="text-xs text-gym-muted italic leading-relaxed">"Dropped 16kg of body fat while adding 40kg to my deadlift through progressive overload."</p>
              <div className="grid grid-cols-3 gap-2 bg-gym-dark p-3 rounded-xl border border-gym-border/40 text-center text-xs">
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Weight</span><strong className="text-white text-xs font-sans">96&rarr;80kg</strong></div>
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Body Fat</span><strong className="text-white text-xs font-sans">28%&rarr;14%</strong></div>
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Time</span><strong className="text-gym-orange text-xs font-sans">12 Wks</strong></div>
              </div>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 rounded-2xl overflow-hidden space-y-4 p-5 hover:border-gym-orange/50 transition-all group">
            <img 
              src="/images/client_transform_ananya.jpg" 
              alt="Pooja Transformation" 
              className="w-full h-48 sm:h-52 object-cover rounded-xl border border-gym-border group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-white">Pooja Deshmukh</h4>
              <p className="text-xs font-extrabold text-gym-orange uppercase tracking-wider">16-Week Athletic Recomp</p>
              <p className="text-xs text-gym-muted italic leading-relaxed">"Sculpted peak core strength, eliminated back pain, and built lean muscle definition."</p>
              <div className="grid grid-cols-3 gap-2 bg-gym-dark p-3 rounded-xl border border-gym-border/40 text-center text-xs">
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Weight</span><strong className="text-white text-xs font-sans">68&rarr;59kg</strong></div>
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Squat PR</span><strong className="text-white text-xs font-sans">20&rarr;75kg</strong></div>
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Time</span><strong className="text-gym-orange text-xs font-sans">16 Wks</strong></div>
              </div>
            </div>
          </div>

          <div className="bg-gym-card border border-gym-border/80 rounded-2xl overflow-hidden space-y-4 p-5 hover:border-gym-orange/50 transition-all group">
            <img 
              src="/images/client_transform_karan.jpg" 
              alt="Manish Transformation" 
              className="w-full h-48 sm:h-52 object-cover rounded-2xl border border-gym-border group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-white">Manish Kapoor</h4>
              <p className="text-xs font-extrabold text-gym-orange uppercase tracking-wider">20-Week Mass Bulk</p>
              <p className="text-xs text-gym-muted italic leading-relaxed">"Went from a skinny frame to adding 8kg of solid muscle mass with targeted coaching."</p>
              <div className="grid grid-cols-3 gap-2 bg-gym-dark p-3 rounded-xl border border-gym-border/40 text-center text-xs">
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Weight</span><strong className="text-white text-xs font-sans">58&rarr;67kg</strong></div>
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Bench PR</span><strong className="text-white font-sans text-xs">40&rarr;95kg</strong></div>
                <div><span className="block text-[10px] text-gym-muted uppercase font-semibold">Time</span><strong className="text-gym-orange text-xs font-sans">20 Wks</strong></div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Testimonials;
