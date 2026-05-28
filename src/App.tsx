import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Services = lazy(() => import('./components/Services'));
const Infrastructure = lazy(() => import('./components/Infrastructure'));
const DataCenter = lazy(() => import('./components/DataCenter'));
const NeoCloudz = lazy(() => import('./components/NeoCloudz'));
const Careers = lazy(() => import('./components/Careers'));
const SECFilings = lazy(() => import('./components/SECFilings'));
const Leadership = lazy(() => import('./components/Leadership'));
const PressRelease = lazy(() => import('./components/PressRelease'));
const InvestorRelations = lazy(() => import('./components/InvestorRelations'));
const DocumentsCharters = lazy(() => import('./components/DocumentsCharters'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./components/TermsOfUse'));
const EmailAlerts = lazy(() => import('./components/EmailAlerts'));
const MissionVision = lazy(() => import('./components/MissionVision'));
const GlobalNetwork = lazy(() => import('./components/GlobalNetwork'));
const Partnership = lazy(() => import('./components/Partnership'));

export const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact',
  services: '/services',
  energy: '/energy',
  dataCenters: '/data-centers',
  neocloudz: '/neocloudz',
  careers: '/careers',
  secFilings: '/sec-filings',
  leadership: '/leadership',
  pressRelease: '/press-release',
  investors: '/investors',
  documentsCharters: '/documents-charters',
  privacyPolicy: '/privacy-policy',
  termsOfUse: '/terms-of-use',
  emailAlerts: '/email-alerts',
  missionVision: '/mission-vision',
  globalNetwork: '/global-network',
  partnership: '/partnership',
} as const;

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[60vh] flex items-center justify-center bg-[#060708]"
    >
      <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[#ffc629] animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-[#060708] text-white px-6">
      <div className="max-w-xl text-center">
        <p className="text-[11px] font-bold tracking-[0.32em] uppercase text-[#ffc629]">
          404
        </p>
        <h1 className="mt-4 font-[Archivo,sans-serif] text-4xl md:text-5xl font-extrabold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-white/55 text-sm leading-relaxed">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link
          to={ROUTES.home}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#ffc629] px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-[#ffd84d]"
        >
          ← Back to home
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={ROUTES.about} element={<About />} />
            <Route path={ROUTES.contact} element={<Contact />} />
            <Route path={ROUTES.services} element={<Services />} />
            <Route path={ROUTES.energy} element={<Infrastructure />} />
            <Route path={ROUTES.dataCenters} element={<DataCenter />} />
            <Route path={ROUTES.neocloudz} element={<NeoCloudz />} />
            <Route path={ROUTES.careers} element={<Careers />} />
            <Route path={ROUTES.secFilings} element={<SECFilings />} />
            <Route path={ROUTES.leadership} element={<Leadership />} />
            <Route path={ROUTES.pressRelease} element={<PressRelease />} />
            <Route path={ROUTES.investors} element={<InvestorRelations />} />
            <Route path={ROUTES.documentsCharters} element={<DocumentsCharters />} />
            <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicy />} />
            <Route path={ROUTES.termsOfUse} element={<TermsOfUse />} />
            <Route path={ROUTES.emailAlerts} element={<EmailAlerts />} />
            <Route path={ROUTES.missionVision} element={<MissionVision />} />
            <Route path={ROUTES.globalNetwork} element={<GlobalNetwork />} />
            <Route path={ROUTES.partnership} element={<Partnership />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
