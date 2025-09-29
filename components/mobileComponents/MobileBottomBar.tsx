'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { GoHomeFill } from 'react-icons/go'
import { AiFillPieChart } from 'react-icons/ai'
import { IoTrophy } from 'react-icons/io5'
import { FaPiggyBank } from 'react-icons/fa6'

const MobileBottomBar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [active, setActive] = useState(pathname)

  useEffect(() => {
    setActive(pathname)
  }, [pathname])

  const navItems = [
    { href: '/', icon: <GoHomeFill size={24} /> },
    { href: '/analytics', icon: <AiFillPieChart size={24} /> },
    {
      href: '/transactions',
      icon: <img src="/transactionHistory.svg" alt="Transaction History" className="size-7" />,
    },
    { href: '/budgetgoals', icon: <FaPiggyBank size={22} /> },
    { href: '/rewards', icon: <IoTrophy size={22} /> },
  ]

  return (
    <div className="h-[60px] bg-secondaryBG/70 w-full px-4 flex items-center justify-between backdrop-blur-sm rounded-full">
      {navItems.map((item, idx) => {
        const isActive = active === item.href
        return (
          <button
            key={idx}
            onClick={() => {
              setActive(item.href)
              router.push(item.href) // client-side navigation
            }}
            className="w-[50px] h-[50px] flex flex-col items-center justify-center relative"
          >
            {idx === 2 ? (
              <div className={`size-11 flex items-center justify-center rounded-full ${isActive ? 'bg-primary' : 'bg-accent'}`}>
                {item.icon}
              </div>
            ) : (
              <div className={`${isActive ? 'text-primary' : 'text-primaryText/70'}`}>
                {item.icon}
              </div>
            )}

            {isActive && <span className="absolute bottom-[3px] w-[6px] h-[6px] bg-primary rounded-full" />}
          </button>
        )
      })}
    </div>
  )
}

export default MobileBottomBar
