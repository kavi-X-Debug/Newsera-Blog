export default function LiveIndicator({ className = 'h-4' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-end gap-[2px] align-middle ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="live-bar h-full w-[3px] rounded-sm bg-red-500" />
      ))}
    </span>
  );
}
