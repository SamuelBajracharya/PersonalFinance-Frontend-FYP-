import SkeletonBlock from "@/components/gloabalComponents/SkeletonBlock";

export default function Loading() {
    return (
        <div className="min-h-screen p-6 grid grid-cols-12 gap-6 relative">
            <section className="col-span-9 space-y-6">
                <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-8 w-56" />
                    <SkeletonBlock className="h-10 w-52 rounded-lg" />
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonBlock key={index} className="h-[250px] rounded-2xl" />
                    ))}
                </div>

                <SkeletonBlock className="h-[600px] rounded-2xl" />
            </section>

            <aside className="col-span-3 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonBlock key={index} className="h-[156px] rounded-3xl" />
                ))}
            </aside>

            <div className="fixed inset-0 flex items-center justify-center bg-mainBG/50 pointer-events-none">
                <div className="h-14 w-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
        </div>
    );
}
