interface SkeletonBlockProps {
    className?: string;
}

export default function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
    // Always use a visible neutral background for skeletons, SSR-safe
    return (
        <div className={`animate-pulse rounded bg-neutral-200 dark:bg-neutral-700 ${className}`} />
    );
}
