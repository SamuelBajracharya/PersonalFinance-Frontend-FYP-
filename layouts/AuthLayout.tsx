import { LayoutPropsType } from "@/types/viewport";
import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: LayoutPropsType) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden">
      {/* Left side - image */}
      <div className="relative w-1/2 h-full flex items-center justify-center p-2 box-border">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 m-6 rounded-3xl overflow-hidden">
            <Image
              src="/auth_image.png"
              alt="auth-image"
              fill
              className="object-cover scale-[1.15]"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right side - auth content */}
      <main className="w-1/2 h-full flex items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
