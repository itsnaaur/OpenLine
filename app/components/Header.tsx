import Link from "next/link";
import Image from "next/image";
import { Home, FileText, Search } from "lucide-react";
import Button from "./Button";

interface HeaderProps {
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
  showNav?: boolean;
}

export default function Header({ 
  showBackButton = false, 
  backHref = "/", 
  backLabel = "Back to Home",
  showNav = false 
}: HeaderProps) {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
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
          
          {showNav ? (
            <nav className="flex items-center gap-4 md:gap-6">
              <Link href="/submit">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Submit Report</span>
                </Button>
              </Link>
              <Link href="/track">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Track Report</span>
                </Button>
              </Link>
            </nav>
          ) : showBackButton && backHref ? (
            <Link
              href={backHref}
              className="text-sm md:text-base text-gray-600 hover:text-[#116aae] transition-colors font-medium flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              {backLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
