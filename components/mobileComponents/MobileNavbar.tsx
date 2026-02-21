import React from 'react'
import { IoChevronBackOutline } from "react-icons/io5";
import { PiChatCircleTextDuotone } from "react-icons/pi";
import { Avatar } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const MobileNavbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    // convert /analytics/something → Analytics Something
    const pageTitle = pathname
        .split("/")
        .filter(Boolean)
        .map(part =>
            (part === "mystocks" ? "my stocks" : part)
                .replace(/-/g, " ")
                .replace(/\b\w/g, c => c.toUpperCase())
        )
        .join(" / ");
    return (
        // main background
        <div className='h-[64px] bg-secondaryBG/70 w-full p-4 flex items-center justify-between backdrop-blur-sm rounded-b-xl'>
            {/* left handside */}
            <div className='flex items-center gap-4'>
                {/* back button */}
                <div
                    className='bg-accentBG flex items-center p-1 rounded-full cursor-pointer text-accent'
                    onClick={() => router.back()}
                >
                    <IoChevronBackOutline className=' text-2xl pr-0.5' />
                </div>
                {/* title */}
                <h2 className='font-medium text-20'>{pageTitle || 'Dashboard'}</h2>
            </div>
            {/* right handside */}
            <div className='flex items-center gap-4'>
                {/* ChatBot */}
                <PiChatCircleTextDuotone className='text-3xl text-accent cursor-pointer' />
                {/* profile avatar */}
                <Avatar size={32} src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
            </div>
        </div>
    )
}

export default MobileNavbar
