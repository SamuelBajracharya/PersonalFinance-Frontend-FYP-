// components/Logo.tsx
import Image from "next/image";

interface LogoProps {
  width?: number; // optional width prop
}

const Logo = ({ width = 120 }: LogoProps) => {
  return (
    <Image
      src="/logo.png"
      alt="SaveMarga Logo"
      width={width}
      height={width * 0.3}
      priority
    />
  );
};

export default Logo;
