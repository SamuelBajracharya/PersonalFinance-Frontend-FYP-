import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-textmain overflow-hidden">
      {/* Blue curved background */}
      <div
        className="absolute top-0 left-0 w-full h-[40vh] bg-accent z-0"
        style={{
          clipPath: "ellipse(60% 100% at 50% 0%)",
        }}
      />
      {/* Main 404 Image */}
      <Image
        src="/notfound.png"
        alt="404 Not Found"
        width={650}
        height={650}
        priority
        className="relative z-10 mb-8"
      />

      {/* Text Section */}
      <div className="relative text-center z-10 px-4">
        <h1 className="text-2xl md:text-5xl font-semibold mb-4 tracking-wider">
          Something is Wrong!
        </h1>
        <p className="text-gray-400 mb-16 text-lg">
          The page you are looking for was moved, renamed, removed, or might
          never have existed.
        </p>

        {/* Back Button */}
        <Link
          href="/"
          className="bg-primary hover:bg-primary/80 font-medium h-[50px] text-lg px-6 py-3 rounded-full transition-colors duration-200 inline-block"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
