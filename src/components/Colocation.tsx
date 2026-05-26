import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Colocation = () => {
  return (
    <section className="bg-white pt-10 pb-12 md:pb-16 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10 flex flex-col items-center">

        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-4 bg-[#e5e5e5] rounded-full px-5 py-1.5 shadow-sm border border-black/5">
            <span className="text-[9px] font-semibold tracking-widest text-black/60">02 /</span>
            <div className="h-[1px] w-12 bg-[#f5c518]" />
            <span className="text-[9px] font-semibold tracking-[0.2em] text-black/80 uppercase">COLOCATION</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[clamp(2.5rem,5.5vw,5rem)] font-semibold uppercase mb-6 text-black text-center leading-[0.9] tracking-tighter"
        >
          YOUR HARDWARE <br />
          OUR <span className="text-[#f5c518]">INFRASTRUCTURE</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-gray-500 text-[14px] md:text-[16px] max-w-3xl text-center mb-10 leading-relaxed font-medium"
        >
          Bring your own servers into DigiPowerX-owned Tier III facilities. Get direct access to our owned power, high-density cooling, and InfiniBand interconnects — without the hyperscaler premium.
        </motion.p>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Side: Bullet Points and Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col space-y-10 lg:pr-4 w-full"
          >
            {/* Features List */}
            <ul className="space-y-4">
              {[
                'GPU-density cabinets up to 80kW/rack',
                'Direct substation feed — no shared utility risk',
                '400G InfiniBand & cross-connect fabric',
                'Remote hands, 24/7 NOC, smart hands SLA',
                'Custom cage & suite configurations',
                'Meet-me room with carrier-neutral access'
              ].map(item => (
                <li key={item} className="flex items-start gap-4 text-black text-[14px] md:text-[15px] font-bold tracking-wide">
                  <span className="text-[#f5c518] text-[16px] font-bold mt-[-2px]">→</span> {item}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/contact" className="bg-[#f5c518] text-black px-6 py-3.5 rounded font-semibold text-[12px] uppercase tracking-widest hover:bg-[#ffda47] transition-all w-full sm:w-auto text-center shadow-lg shadow-[#f5c518]/20">
                REQUEST COLOCATION QUOTE
              </Link>
              <Link to="/documents-charters" className="bg-[#cccccc] text-black px-6 py-3.5 rounded font-bold text-[12px] hover:bg-gray-400 transition-all w-full sm:w-auto text-center">
                Download Spec Sheet
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-7 relative w-full h-[380px] md:h-[400px] lg:h-[400px] xl:h-[400px] bg-transparent flex items-center justify-center scale-110 lg:scale-125 xl:scale-130 transition-transform duration-500"
          >
            <img
              src="/gpu.gif"
              alt="GPU colocation visual"
              className="w-full h-full object-contain max-h-full"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Colocation;
