import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";

export default function Loading() {
    return (
        <div className="min-h-screen p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div>
                        <SkeletonBlock className="h-8 w-40 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <SkeletonBlock key={index} className="h-44 rounded-2xl" />
                            ))}
                        </div>
                    </div>

                    <div>
                        <SkeletonBlock className="h-8 w-52 mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <SkeletonBlock key={index} className="h-[220px] rounded-3xl" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <SkeletonBlock className="h-[280px] rounded-3xl" />
                    <div className="space-y-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonBlock key={index} className="h-[88px] rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 flex items-center justify-center bg-mainBG/50 pointer-events-none">
                <div className="h-14 w-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        </div>
    );
}
