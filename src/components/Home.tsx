import React from 'react';
import InfraHero from './InfraHero';
import InfraStackHero from './InfraStackHero';
import Marquee from './Marquee';
import WhatWeDo from './WhatWeDo';
import FourPillars from './FourPillars';
import Services from './Services';
import NeoCloudzSection from './NeoCloudzSection';
import Colocation from './Colocation';
import Capabilities from './Capabilities';
import HowWeWork from './HowWeWork';
import LatestNews from './LatestNews';
import { CTASection } from './Footer';
import LayeredInfrastructure from './LayeredInfrastructure';
import StackedLayersVisual from './StackedLayersVisual';

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
      <HowWeWork />
      <LatestNews />
      <CTASection />
    </>
  );
};

export default Home;







