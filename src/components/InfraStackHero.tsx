import { Link } from "react-router-dom";
import "./InfraStackHero.css";

export default function InfraStackHero() {
  return (
    <section id="infra-stack-hero">
      {/* Premium Animated Layered Background */}
      <div className="ish-bg-container" aria-hidden="true">
        {/* Base Layer: Server Room Image */}
        <div className="ish-bg-layer base-image" />

        {/* Glow Layer: Pulsing Golden Highlights */}
        <div className="ish-bg-layer glow-image" />

        {/* Subtle Black Smoke/Fog Effect on the Left */}
        <div className="ish-smoke-container">
          <div className="ish-smoke-particle smoke-1" />
          <div className="ish-smoke-particle smoke-2" />
          <div className="ish-smoke-particle smoke-3" />
        </div>

        {/* Dark Vignette Overlay to blend edges */}
        <div className="ish-bg-overlay" />
      </div>

      <div className="ish-inner">
        <div className="ish-left">
          <span className="ish-eyebrow">
            <span className="ish-dot" />
            Vertically Integrated AI Infrastructure
          </span>
          <h1 className="ish-headline">
            THE INFRA LAYER
            <br />
            <span className="ish-acc">AI RUNS ON.</span>
          </h1>
          <p className="ish-sub">
            DigiPowerX owns and operates the full stack — from power generation
            and substations to Tier III data centers and bare-metal GPU compute.
            One company, every layer.
          </p>

          <div className="ish-cta">
            <Link to="/about" className="ish-btn primary">
              Explore Our Stack ↓
            </Link>
            <Link to="/contact" className="ish-btn secondary">
              Talk to Our Team
            </Link>
          </div>

          <div className="ish-stats">
            <div className="ish-stat">
              <div className="ish-stat-value">
                400+<span className="ish-stat-unit">MW</span>
              </div>
              <div className="ish-stat-label">Power Capacity</div>
            </div>
            <div className="ish-stat">
              <div className="ish-stat-value">4</div>
              <div className="ish-stat-label">DC Campuses</div>
            </div>
            <div className="ish-stat">
              <div className="ish-stat-value">&lt;1.3</div>
              <div className="ish-stat-label">Avg PUE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
