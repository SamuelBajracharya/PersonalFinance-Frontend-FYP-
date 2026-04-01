import { LayoutPropsType } from "@/types/viewport";
import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: LayoutPropsType) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-mainBG text-textmain theme-transition">
      {/* Left side - image */}
      <div className="relative w-1/2 h-full items-center justify-center p-2 box-border hidden md:flex">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 m-6 rounded-3xl overflow-hidden shadow-2xl theme-transition">
            <Image
              src="/auth_image.png"
              alt="auth-image"
              fill
              className="object-cover scale-[1.15]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/30 theme-transition" />
          </div>
        </div>
      </div>

      {/* Right side - auth content */}
      <main className="w-full md:w-1/2 h-full flex items-center justify-center bg-mainBG px-4 theme-transition">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
