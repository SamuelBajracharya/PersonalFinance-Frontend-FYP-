import MobileBottomBar from '@/components/mobileComponents/MobileBottomBar'
import MobileNavbar from '@/components/mobileComponents/MobileNavbar'
import { LayoutPropsType } from '@/types/viewport'
import React from 'react'

const MobileLayout = ({ children }: LayoutPropsType) => {
  return (
    <>
      {/* Navbar Section */}
      <div className='fixed top-0 left-0 w-full z-50'>
        <MobileNavbar />
      </div>
      {/* main Section */}
      <main className='pt-[64px] pb-[60px] bg-mainBG'>
        {children}
        </main>
      {/* Bottombar Section */}
      <div className='fixed bottom-3 left-0 w-full px-3 z-50'>
        <MobileBottomBar />
      </div>
    </>
  )
}

export default MobileLayout
