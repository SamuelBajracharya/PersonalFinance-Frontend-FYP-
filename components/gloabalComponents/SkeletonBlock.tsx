interface SkeletonBlockProps {
    className?: string;
}

export default function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
    return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}
