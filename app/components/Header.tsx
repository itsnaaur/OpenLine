import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function Header({ showBackButton = false, backHref = "/", backLabel = "Back to Home" }: HeaderProps) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/OpenLine (Icon and Word Logo).png"
              alt="OpenLine Logo"
              width={180}
              height={50}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </Link>
          {showBackButton && backHref && (
            <Link
              href={backHref}
              className="text-sm md:text-base text-gray-600 hover:text-[#116aae] transition-colors font-medium"
            >
              {backLabel}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

