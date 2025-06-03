
"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const navLinks = [
  { href: "/about", label: "من نحن" },
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const isMobile = useIsMobile();

  const renderNavLinksForSheet = () => (
    navLinks.map((link) => (
      <SheetTrigger key={link.label} asChild>
        <Link
          href={link.href}
          className="block px-4 py-3 text-base text-foreground hover:bg-accent hover:text-accent-foreground rounded-md text-right"
        >
          {link.label}
        </Link>
      </SheetTrigger>
    ))
  );

  const renderNavLinksForDropdown = () => (
     navLinks.map((link) => (
      <DropdownMenuItem key={link.label} asChild className="justify-end cursor-pointer">
        <Link href={link.href} className="w-full text-right">
          {link.label}
        </Link>
      </DropdownMenuItem>
    ))
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Right side for RTL (Logo) */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            كم عمري
          </Link>
        </div>

        {/* Center Text */}
        <div className="flex-1 text-center px-2 hidden md:block">
          <p className="text-sm text-muted-foreground">
            حاسبة العمر بالتقويمين الهجري والميلادي
          </p>
        </div>

        {/* Left side for RTL (Menu icon) */}
        <div className="flex items-center">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="فتح القائمة">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm bg-background p-0">
                <SheetHeader className="p-6 pb-4 border-b">
                  <SheetTitle className="text-xl font-headline text-primary text-right">القائمة</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-1 p-4">
                  {renderNavLinksForSheet()}
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="فتح القائمة">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-border shadow-lg"> {/* Changed align to "end" for RTL */}
                {renderNavLinksForDropdown()}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
