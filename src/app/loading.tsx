export default function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-[60vh] w-full"
      role="status"
      aria-live="polite"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#f5c518] animate-spin" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
