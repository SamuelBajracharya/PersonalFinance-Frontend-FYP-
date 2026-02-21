import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingOverlayProps {
    show: boolean;
}

export default function LoadingOverlay({ show }: LoadingOverlayProps) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-mainBG/40 backdrop-blur-[1px] pointer-events-none">
            <div className="rounded-full bg-secondaryBG p-4 border border-accentBG">
                <AiOutlineLoading3Quarters className="size-8 text-primary animate-spin" />
            </div>
        </div>
    );
}
