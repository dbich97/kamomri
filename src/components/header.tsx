
"use client";

import React from 'react';
import { Link, usePathname } from '@/app/navigation';
import { useTranslations } from 'next-intl';
import { Menu, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import LanguageSwitcher from './language-switcher';

export default function Header() {
  const t = useTranslations('Header');
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t('home') },
    { href: "/about", label: t('about') },
    { href: "/privacy", label: t('privacy') },
    { href: "/contact", label: t('contact') },
  ];

  const renderNavLinksForSheet = () => (
    navLinks.map((link) => (
      <SheetClose key={link.label} asChild>
        <Link
          href={link.href}
          className={`flex items-center justify-end px-4 py-3 text-base rounded-md text-right ${
            pathname === link.href ? 'font-bold text-primary bg-accent' : 'text-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {link.label}
          {link.href === "/" && <HomeIcon className="mr-2 h-5 w-5" />}
        </Link>
      </SheetClose>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Left side */}
        <div className="flex items-center gap-x-2">
            <LanguageSwitcher />
             {isMobile && (
                 <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={t('menu')}>
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm bg-background p-0">
                    <SheetHeader className="p-6 pb-4 border-b">
                      <SheetTitle className="text-xl font-headline text-primary text-right">{t('menu')}</SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col space-y-1 p-4">
                      {renderNavLinksForSheet()}
                    </nav>
                  </SheetContent>
                </Sheet>
             )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-x-6">
           <nav className="hidden md:flex md:gap-x-6">
             {navLinks.map(link => (
                 <Link
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                    }`}
                 >
                    {link.label}
                 </Link>
             ))}
          </nav>

          <Link href="/" className="text-2xl font-bold text-primary font-headline">
            {t('siteName')}
          </Link>
        </div>

      </div>
    </header>
  );
}
