import React from 'react';
import dynamic from 'next/dynamic';
import InfraStackHero from './InfraStackHero';
import Marquee from './Marquee';
import WhatWeDo from './WhatWeDo';

const SectionFallback = () => (
  <div className="w-full min-h-[60vh] bg-dark-base" aria-hidden="true" />
);

const LayeredInfrastructure = dynamic(() => import('./LayeredInfrastructure'), { loading: SectionFallback });
const Colocation = dynamic(() => import('./Colocation'), { loading: SectionFallback });
const Capabilities = dynamic(() => import('./Capabilities'), { loading: SectionFallback });
const NeoCloudzSection = dynamic(() => import('./NeoCloudzSection'), { loading: SectionFallback });
const NvidiaRubinDeal = dynamic(() => import('./NvidiaRubinDeal'), { loading: SectionFallback });
const HowWeWork = dynamic(() => import('./HowWeWork'), { loading: SectionFallback });
const LatestNews = dynamic(() => import('./LatestNews'), { loading: SectionFallback });
const EarlyAccess = dynamic(() => import('./EarlyAccess'), { loading: SectionFallback });
const CTASection = dynamic(() => import('./Footer').then(m => m.CTASection), { loading: SectionFallback });

const Home = () => {
  return (
    <>
      <InfraStackHero />
      <Marquee />
      <WhatWeDo />
      <LayeredInfrastructure/>
      <Colocation />
      <Capabilities />
      <NeoCloudzSection />
      <NvidiaRubinDeal />
      <HowWeWork />
      <LatestNews />
      <EarlyAccess />
      <CTASection />
    </>
  );
};

export default Home;







