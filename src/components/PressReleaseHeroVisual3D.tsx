import React from 'react';

/**
 * PressReleaseHeroVisual3D — DGXX Mega-Cube
 * Embeds the standalone DGXX_MEGACUBE Three.js scene from /public/megacube.html
 * via an iframe so the exact original visuals, lighting, post-processing, and
 * interactions (hover-spin, click-to-explode) are preserved as-is.
 */
const PressReleaseHeroVisual3D: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0 z-0 overflow-hidden rounded-3xl">
      <iframe
        src="/megacube.html"
        title="DGXX Infrastructure Mega-Cube"
        loading="lazy"
        allowTransparency
        className="w-full h-full block border-0 bg-transparent"
      />
    </div>
  );
};

export default PressReleaseHeroVisual3D;
