'use client'

import { LayoutPropsType } from '@/types/viewport'
import React from 'react'
import { Layout } from 'antd'
import DesktopSidebar from '@/components/desktopComponents/DesktopSidebar'
import DesktopNavbar from '@/components/desktopComponents/DesktopNavbar'

const { Content } = Layout

// Layout constants
const SIDEBAR_WIDTH = 300 // px
const NAVBAR_HEIGHT = 80 // px

const DesktopLayout = ({ children }: LayoutPropsType) => {
  return (
    <Layout className='!min-h-screen !bg-mainBG'>
      {/* Sidebar section */}
      <div
        className='!bg-mainBG fixed top-0 left-0 h-full '
        style={{ width: SIDEBAR_WIDTH }}
      >
        <DesktopSidebar/>
      </div>

      {/* Navbar section */}
      <div
        className='!bg-mainBG/70 backdrop-blur-sm fixed top-0 left-[300px] right-0 border-b border-b-textsecondary'
        style={{ height: NAVBAR_HEIGHT, lineHeight: `${NAVBAR_HEIGHT}px` }}
      >
        <DesktopNavbar/>
      </div>

      {/* Main content section */}
      <Content
        className='!bg-mainBG p-6 !text-textmain'
        style={{
          marginLeft: SIDEBAR_WIDTH,
          marginTop: NAVBAR_HEIGHT,
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          overflowY: 'auto',
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}

export default DesktopLayout
