type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "h-4 w-full rounded-md" }: Readonly<SkeletonProps>) {
  return <div aria-hidden="true" className={`animate-pulse bg-white/12 ${className}`} />;
}
