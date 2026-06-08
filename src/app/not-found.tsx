import Link from 'next/link';

export default function NotFound() {
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
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#ffc629] px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-[#ffd84d]"
        >
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
