
"use client";

import React from 'react'; // Added this line
import Link from 'next/link';
import { Menu, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const navLinks = [
  { href: "/", label: "الرئيسية", icon: HomeIcon },
  { href: "/about", label: "من نحن" },
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function Header() {
  const isMobile = useIsMobile();

  const renderNavLinksForSheet = () => (
    navLinks.map((link) => (
      <SheetClose key={link.label} asChild>
        <Link
          href={link.href}
          className="flex items-center justify-end px-4 py-3 text-base text-foreground hover:bg-accent hover:text-accent-foreground rounded-md text-right"
        >
          {link.label}
          {link.icon && <link.icon className="mr-2 h-5 w-5" />}
        </Link>
      </SheetClose>
    ))
  );

  const renderNavLinksForDropdown = () => (
     navLinks.map((link, index) => (
      <React.Fragment key={link.label}>
        <DropdownMenuItem asChild className="justify-end cursor-pointer">
          <Link href={link.href} className="w-full text-right flex items-center justify-end">
            {link.label}
            {link.icon && <link.icon className="mr-2 h-5 w-5" />}
          </Link>
        </DropdownMenuItem>
        {index === 0 && navLinks.length > 1 && <DropdownMenuSeparator />}
      </React.Fragment>
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
              <DropdownMenuContent align="end" className="w-56 bg-background border-border shadow-lg">
                {renderNavLinksForDropdown()}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
