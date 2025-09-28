import { LayoutPropsType } from '@/types/viewport'
import React from 'react'

const AuthLayout = ({ children }: LayoutPropsType) => {
    return <main>{children}</main>; // simple layout, no navbar/sidebar
}

export default AuthLayout
