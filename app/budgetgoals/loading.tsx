import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";

export default function Loading() {
    return (
        <div className="min-h-screen p-6 space-y-6">
            <div className="flex justify-end">
                <SkeletonBlock className="h-12 w-56 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4 space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonBlock key={index} className="h-[220px] rounded-2xl" />
                    ))}
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <SkeletonBlock className="h-12 w-64 rounded-xl" />
                    <SkeletonBlock className="h-[180px] rounded-2xl" />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <SkeletonBlock className="h-[220px] rounded-2xl" />
                        <SkeletonBlock className="h-[220px] rounded-2xl" />
                    </div>
                    <SkeletonBlock className="h-[260px] rounded-2xl" />
                </div>
            </div>

            <div className="fixed inset-0 flex items-center justify-center bg-mainBG/50 pointer-events-none">
                <div className="h-14 w-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        </div>
    );
}
