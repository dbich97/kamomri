
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockIcon, GiftIcon, CalendarIcon, TimerIcon, PartyPopperIcon, AlertTriangleIcon, Facebook, Twitter, MessageSquare, Link as LinkIcon, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Age,
  type HijriDateDetails,
  type LiveAgeDetails,
  type CountdownDetails,
  getHijriDateDetails,
  calculateGregorianAge,
  calculateHijriAge,
  formatGregorianDate,
  calculateLiveAgeDetails,
  calculateNextBirthdayDetails,
  convertHijriToGregorian,
  getDaysInHijriMonthArithmetic,
  calculateNextHijriBirthdayDetails,
} from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

interface GregorianCalculationResult {
  gregorianAge: Age;
  hijriAge: Age;
  gregorianBirthDateFormatted: string;
  hijriBirthDateDetails: HijriDateDetails; // Hijri equivalent of Gregorian input
}

interface HijriCalculationResult {
  gregorianAge: Age; // Gregorian age from converted Hijri input
  hijriAge: Age; // Hijri age from Hijri input
  gregorianBirthDateFormatted: string; // Gregorian equivalent of Hijri input
  hijriInputDateDetails: HijriDateDetails; // The Hijri date that was input
}

export default function AgeCalculator() {
  const t = useTranslations('AgeCalculator');
  const locale = useLocale();
  const tDate = useTranslations('AgeCalculator.Date');
  const { toast } = useToast();

  // Gregorian Inputs
  const [selectedDayG, setSelectedDayG] = useState<number | undefined>(undefined);
  const [selectedMonthG, setSelectedMonthG] = useState<number | undefined>(undefined);
  const [selectedYearG, setSelectedYearG] = useState<number | undefined>(undefined);

  // Hijri Inputs
  const [selectedDayH, setSelectedDayH] = useState<number | undefined>(undefined);
  const [selectedMonthH, setSelectedMonthH] = useState<number | undefined>(undefined);
  const [selectedYearH, setSelectedYearH] = useState<number | undefined>(undefined);
  const [hijriBirthDayForCountdown, setHijriBirthDayForCountdown] = useState<number | undefined>();
  const [hijriBirthMonthForCountdown, setHijriBirthMonthForCountdown] = useState<number | undefined>();


  const [gregorianBirthDateForCalculations, setGregorianBirthDateForCalculations] = useState<Date | undefined>(undefined);
  
  const [gregorianResult, setGregorianResult] = useState<GregorianCalculationResult | null>(null);
  const [hijriResult, setHijriResult] = useState<HijriCalculationResult | null>(null);
  
  const [showGregorianResults, setShowGregorianResults] = useState(false);
  const [showHijriResults, setShowHijriResults] = useState(false);
  
  const [liveAge, setLiveAge] = useState<LiveAgeDetails | null>(null);
  const [nextGregorianBirthdayCountdown, setNextGregorianBirthdayCountdown] = useState<CountdownDetails | null>(null);
  const [nextHijriBirthdayCountdown, setNextHijriBirthdayCountdown] = useState<CountdownDetails | null>(null);
  
  const [shareResultText, setShareResultText] = useState("");

  const currentGregorianYear = useMemo(() => new Date().getFullYear(), []);
  const gregorianYears = useMemo(() => Array.from({ length: currentGregorianYear - 1900 + 1 }, (_, i) => currentGregorianYear - i), [currentGregorianYear]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const hijriMonthNames = useMemo(() => t.raw('Date.hijriMonths') as string[], [t]);

  const currentHijriYear = useMemo(() => getHijriDateDetails(new Date(), locale).year, [locale]);
  const hijriYears = useMemo(() => Array.from({ length: currentHijriYear - 1300 + 5 }, (_, i) => currentHijriYear + 5 - i), [currentHijriYear]);

  const daysInSelectedGregorianMonth = useMemo(() => {
    const year = selectedYearG || currentGregorianYear;
    const month = selectedMonthG || (new Date().getMonth() + 1);
    const numDays = new Date(year, month, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }, [selectedYearG, selectedMonthG, currentGregorianYear]);

  const daysInSelectedHijriMonth = useMemo(() => {
    const year = selectedYearH || currentHijriYear;
    const month = selectedMonthH || (getHijriDateDetails(new Date(), locale).month);
    const numDays = getDaysInHijriMonthArithmetic(year, month);
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }, [selectedYearH, selectedMonthH, currentHijriYear, locale]);


  const handleYearChangeG = (value: string) => {
    const yearVal = parseInt(value);
    setSelectedYearG(yearVal);
    if (selectedMonthG && selectedDayG) {
      const maxDays = new Date(yearVal, selectedMonthG, 0).getDate();
      if (selectedDayG > maxDays) setSelectedDayG(undefined);
    }
  };
  const handleMonthChangeG = (value: string) => {
    const monthVal = parseInt(value);
    setSelectedMonthG(monthVal);
    if (selectedYearG && selectedDayG) {
      const maxDays = new Date(selectedYearG, monthVal, 0).getDate();
      if (selectedDayG > maxDays) setSelectedDayG(undefined);
    }
  };
   const handleDayChangeG = (value: string) => {
    const dayVal = parseInt(value);
    if (selectedYearG && selectedMonthG) {
        const maxDays = new Date(selectedYearG, selectedMonthG, 0).getDate();
        if (dayVal > maxDays) {
            setSelectedDayG(undefined);
            toast({ title: t('toastErrorTitle'), description: t('toastErrorInvalidDay', { count: maxDays }), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
            return;
        }
    }
    setSelectedDayG(dayVal);
  };


  const handleYearChangeH = (value: string) => {
    const yearVal = parseInt(value);
    setSelectedYearH(yearVal);
     if (selectedMonthH && selectedDayH) {
      const maxDays = getDaysInHijriMonthArithmetic(yearVal, selectedMonthH);
      if (selectedDayH > maxDays) setSelectedDayH(undefined);
    }
  };
  const handleMonthChangeH = (value: string) => {
    const monthVal = parseInt(value);
    setSelectedMonthH(monthVal);
    if (selectedYearH && selectedDayH) {
      const maxDays = getDaysInHijriMonthArithmetic(selectedYearH, monthVal);
      if (selectedDayH > maxDays) setSelectedDayH(undefined);
    }
  };
  const handleDayChangeH = (value: string) => {
    const dayVal = parseInt(value);
    if (selectedYearH && selectedMonthH) {
        const maxDays = getDaysInHijriMonthArithmetic(selectedYearH, selectedMonthH);
        if (dayVal > maxDays) {
            setSelectedDayH(undefined);
            toast({ title: t('toastErrorTitle'), description: t('toastErrorInvalidDay', { count: maxDays }), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
            return;
        }
    }
    setSelectedDayH(dayVal);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const generateShareMessage = (result: GregorianCalculationResult | HijriCalculationResult | null, inputType: 'gregorian' | 'hijri'): string => {
    if (!result) return "";
    let message = t('resultShareMessage') + "\\n";
    const formatAge = (age: Age) => t('yourAgeIs', {
        years: t('years', { count: age.years }),
        months: t('months', { count: age.months }),
        days: t('days', { count: age.days })
    });
    if (inputType === 'gregorian' && result && 'gregorianAge' in result && 'hijriAge' in result) {
      const gResult = result as GregorianCalculationResult;
      message += t('myGregorianAge', { age: formatAge(gResult.gregorianAge) }) + "\\n";
      message += t('myHijriAge', { age: formatAge(gResult.hijriAge) });
    } else if (inputType === 'hijri' && result && 'hijriAge' in result && 'gregorianAge' in result) {
      const hResult = result as HijriCalculationResult;
      message += t('myHijriAge', { age: formatAge(hResult.hijriAge) }) + "\\n";
      message += t('myGregorianAge', { age: formatAge(hResult.gregorianAge) });
    }
    return message.trim();
  };
  
  const generateCopyableResultText = (result: GregorianCalculationResult | HijriCalculationResult | null, inputType: 'gregorian' | 'hijri'): string => {
    if (!result) return "";
    let text = "";
    const formatAge = (age: Age) => t('yourAgeIs', {
        years: t('years', { count: age.years }),
        months: t('months', { count: age.months }),
        days: t('days', { count: age.days })
    });
     if (inputType === 'gregorian' && result && 'gregorianAge' in result && 'hijriAge' in result) {
      const gResult = result as GregorianCalculationResult;
      text += t('myGregorianAge', { age: formatAge(gResult.gregorianAge) }) + "\\n";
      text += t('myGregorianFullDob', { date: gResult.gregorianBirthDateFormatted }) + "\\n";
      text += t('myHijriAge', { age: formatAge(gResult.hijriAge) }) + "\\n";
      text += t('myHijriFullDob', { date: gResult.hijriBirthDateDetails.formattedDate });
    } else if (inputType === 'hijri' && result && 'hijriAge' in result && 'gregorianAge' in result) {
      const hResult = result as HijriCalculationResult;
      text += t('myHijriAge', { age: formatAge(hResult.hijriAge) }) + "\\n";
      text += t('myHijriInputDob', { date: hResult.hijriInputDateDetails.formattedDate }) + "\\n";
      text += t('myGregorianAge', { age: formatAge(hResult.gregorianAge) }) + "\\n";
      text += t('myGregorianInputDob', { date: hResult.gregorianBirthDateFormatted });
    }
    if (liveAge) {
      const liveAgeDetails = t('countdownIs', {
          years: t('years', { count: liveAge.years }),
          months: t('months', { count: liveAge.months }),
          days: t('days', { count: liveAge.days }),
          hours: t('hours', { count: liveAge.hours }),
          minutes: t('minutes', { count: liveAge.minutes }),
          seconds: t('seconds', { count: liveAge.seconds })
      });
      text += "\\n\\n" + t('currentPreciseAge', { details: liveAgeDetails });
    }
    const formatCountdown = (countdown: CountdownDetails) => t('countdownIs', {
        days: t('days', { count: countdown.days }),
        hours: t('hours', { count: countdown.hours }),
        minutes: t('minutes', { count: countdown.minutes }),
        seconds: t('seconds', { count: countdown.seconds })
    });
    if (inputType === 'gregorian' && nextGregorianBirthdayCountdown) {
      if (nextGregorianBirthdayCountdown.isBirthdayToday) {
         text += "\\n\\n" + t('itsMyGregorianBirthday');
      } else {
        text += "\\n\\n" + t('nextGregorianBirthdayCountdown', { countdown: formatCountdown(nextGregorianBirthdayCountdown) });
      }
    } else if (inputType === 'hijri' && nextHijriBirthdayCountdown) {
       if (nextHijriBirthdayCountdown.isBirthdayToday) {
         text += "\\n\\n" + t('itsMyHijriBirthday');
      } else {
        text += "\\n\\n" + t('nextHijriBirthdayCountdown', { countdown: formatCountdown(nextHijriBirthdayCountdown) });
      }
    }
    return text;
  };


  const handleCalculateGregorian = () => {
    if (!selectedDayG || !selectedMonthG || !selectedYearG) {
      toast({ title: t('toastErrorTitle'), description: t('toastErrorDate'), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }
    const constructedBirthDate = new Date(selectedYearG, selectedMonthG - 1, selectedDayG);
    const currentDate = new Date();
    if (isNaN(constructedBirthDate.getTime()) || constructedBirthDate > currentDate) {
      toast({ title: t('toastErrorTitle'), description: t('toastErrorInvalidDate'), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }
    
    setShowGregorianResults(false);
    setHijriResult(null); 
    setShowHijriResults(false);
    setGregorianBirthDateForCalculations(constructedBirthDate);
    setHijriBirthDayForCountdown(undefined); 
    setHijriBirthMonthForCountdown(undefined);


    const gregorianAge = calculateGregorianAge(constructedBirthDate, currentDate);
    const hijriBirthDateDetails = getHijriDateDetails(constructedBirthDate, locale);
    const currentHijriDetails = getHijriDateDetails(currentDate, locale);
    const hijriAge = calculateHijriAge(hijriBirthDateDetails, currentHijriDetails);
    const gregorianBirthDateFormatted = formatGregorianDate(constructedBirthDate, locale);

    const newGregorianResult = { gregorianAge, hijriAge, gregorianBirthDateFormatted, hijriBirthDateDetails };
    setGregorianResult(newGregorianResult);
    setShareResultText(generateShareMessage(newGregorianResult, 'gregorian'));
    setTimeout(() => setShowGregorianResults(true), 50);
  };

  const handleCalculateHijri = () => {
    if (!selectedDayH || !selectedMonthH || !selectedYearH) {
      toast({ title: t('toastErrorTitle'), description: t('toastErrorDate'), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }

    const convertedGregorianBirthDate = convertHijriToGregorian(selectedYearH, selectedMonthH, selectedDayH, locale);
    if (!convertedGregorianBirthDate) {
      toast({ title: t('toastErrorTitle'), description: t('toastErrorConversion'), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }
    const currentDate = new Date();
    if (convertedGregorianBirthDate > currentDate) {
      toast({ title: t('toastErrorTitle'), description: t('toastErrorInvalidDate'), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }

    setShowHijriResults(false);
    setGregorianResult(null); 
    setShowGregorianResults(false);
    setGregorianBirthDateForCalculations(convertedGregorianBirthDate);
    setHijriBirthDayForCountdown(selectedDayH);
    setHijriBirthMonthForCountdown(selectedMonthH);

    const gregorianAge = calculateGregorianAge(convertedGregorianBirthDate, currentDate);
    const currentHijriDetails = getHijriDateDetails(currentDate, locale);
    const inputHijriDetailsDirect = getHijriDateDetails(convertedGregorianBirthDate, locale); 

    const hijriAge = calculateHijriAge(inputHijriDetailsDirect, currentHijriDetails);
    const gregorianBirthDateFormatted = formatGregorianDate(convertedGregorianBirthDate, locale);
    
    const hijriMonthName = hijriMonthNames[selectedMonthH-1];

    const newHijriResult = { 
        gregorianAge, 
        hijriAge, 
        gregorianBirthDateFormatted, 
        hijriInputDateDetails: {
            year: selectedYearH,
            month: selectedMonthH,
            day: selectedDayH,
            monthName: hijriMonthName,
            weekdayName: inputHijriDetailsDirect.weekdayName, 
            formattedDate: locale === 'ar' ? `${selectedDayH} ${hijriMonthName} ${selectedYearH}هـ` : `${hijriMonthName} ${selectedDayH}, ${selectedYearH} AH`
        }
    };
    setHijriResult(newHijriResult);
    setShareResultText(generateShareMessage(newHijriResult, 'hijri'));
    setTimeout(() => setShowHijriResults(true), 50);
  };

  useEffect(() => {
    if (!gregorianBirthDateForCalculations) {
      setLiveAge(null);
      return;
    }
    const update = () => setLiveAge(calculateLiveAgeDetails(gregorianBirthDateForCalculations));
    update(); 
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [gregorianBirthDateForCalculations]);

  useEffect(() => {
    if (!gregorianBirthDateForCalculations) {
      setNextGregorianBirthdayCountdown(null);
      return;
    }
    if (hijriBirthDayForCountdown === undefined && hijriBirthMonthForCountdown === undefined) {
        const update = () => setNextGregorianBirthdayCountdown(calculateNextBirthdayDetails(gregorianBirthDateForCalculations));
        update();
        const intervalId = setInterval(update, 1000);
        return () => clearInterval(intervalId);
    } else {
        setNextGregorianBirthdayCountdown(null); 
    }
  }, [gregorianBirthDateForCalculations, hijriBirthDayForCountdown, hijriBirthMonthForCountdown]);
  
  useEffect(() => {
    if (hijriBirthDayForCountdown && hijriBirthMonthForCountdown && gregorianBirthDateForCalculations) {
        const update = () => {
            const countdown = calculateNextHijriBirthdayDetails(hijriBirthDayForCountdown, hijriBirthMonthForCountdown, new Date(), locale);
            setNextHijriBirthdayCountdown(countdown);
        };
        update();
        const intervalId = setInterval(update, 1000);
        return () => clearInterval(intervalId);
    } else {
        setNextHijriBirthdayCountdown(null); 
    }
  }, [hijriBirthDayForCountdown, hijriBirthMonthForCountdown, gregorianBirthDateForCalculations, locale]);


  function nowIsPastBirthTime(birthDate: Date | undefined): boolean {
    if (!birthDate) return false;
    const now = new Date();
    if (now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate()) {
        const birthTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
        return now.getTime() >= birthTimeToday.getTime();
    }
    return false;
  }
  
  function isTodayHijriBirthday(birthDay: number | undefined, birthMonth: number | undefined): boolean {
    if (!birthDay || !birthMonth) return false;
    const currentHijri = getHijriDateDetails(new Date(), locale);
    return currentHijri.month === birthMonth && currentHijri.day === birthDay;
  }


  const renderBirthdayMessage = (countdown: CountdownDetails | null, birthDateObj: Date | undefined, isHijri: boolean = false) => {
    if (!countdown) return null;

    let isTodayActualBirthday = false;
    if (isHijri) {
        isTodayActualBirthday = isTodayHijriBirthday(hijriBirthDayForCountdown, hijriBirthMonthForCountdown);
    } else if (birthDateObj) {
        isTodayActualBirthday = countdown.isBirthdayToday || false;
    }
    
    const messageType = isHijri ? "Hijri" : "Gregorian";

    if (isTodayActualBirthday) {
        if (isHijri || (birthDateObj && nowIsPastBirthTime(birthDateObj)) || (countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 && birthDateObj && birthDateObj.getFullYear() !== new Date().getFullYear()) ) {
            return <p className="text-lg text-center font-semibold text-green-600">{t('happyBirthday', { calendar: messageType })}</p>;
        } else {
            return <p className="text-lg text-center font-semibold text-green-600">{t('yourBirthdayIsToday', { calendar: messageType })}</p>;
        }
    }
    return (
      <p className="text-lg text-foreground tabular-nums">
        {t('countdownIs', {
            days: t('days', { count: countdown.days }),
            hours: t('hours', { count: countdown.hours }),
            minutes: t('minutes', { count: countdown.minutes }),
            seconds: t('seconds', { count: countdown.seconds })
        })}
      </p>
    );
  };

  const siteShareTitle = t('siteShareMessage');

  const handleShareSiteFacebook = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(siteShareTitle)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareSiteTwitter = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(siteShareTitle)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareSiteWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(siteShareTitle + " " + shareUrl)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopySiteLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({ title: t('toastCopyLinkSuccess'), icon: <LinkIcon className="h-5 w-5" /> });
        })
        .catch(err => {
          toast({ title: t('toastCopyLinkError'), variant: "destructive" });
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleShareResultFacebook = () => {
    if (typeof window !== 'undefined' && shareResultText) {
      const fullQuote = `${shareResultText}\\n\\n${t('tryItYourself')}`;
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullQuote)}`, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleShareResultTwitter = () => {
    if (typeof window !== 'undefined' && shareResultText) {
      const fullText = `${shareResultText}\\n\\n${t('tryItYourself')}: ${shareUrl}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleShareResultWhatsApp = () => {
    if (typeof window !== 'undefined' && shareResultText) {
      const fullText = `${shareResultText}\\n\\n${t('tryItYourself')}: ${shareUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleCopyResult = () => {
    const resultToCopy = generateCopyableResultText(gregorianResult || hijriResult, gregorianResult ? 'gregorian' : 'hijri');
    if (typeof navigator !== 'undefined' && navigator.clipboard && resultToCopy) {
      navigator.clipboard.writeText(resultToCopy)
        .then(() => {
          toast({ title: t('toastCopyResultSuccess'), icon: <Copy className="h-5 w-5" /> });
        })
        .catch(err => {
          toast({ title: t('toastCopyResultError'), variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5"/> });
          console.error('Failed to copy result: ', err);
        });
    }
  };


  return (
    <div className="flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="gregorian" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="gregorian" onClick={() => { setShowHijriResults(false); setHijriResult(null); setShareResultText(""); }} className="text-lg py-3">{t('gregorianTab')}</TabsTrigger>
              <TabsTrigger value="hijri" onClick={() => { setShowGregorianResults(false); setGregorianResult(null); setShareResultText("");}} className="text-lg py-3">{t('hijriTab')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gregorian" className="mt-6 data-[state=open]:animate-fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
              <div className="space-y-3 mb-6">
                <Label className="block text-xl font-medium text-foreground mb-2 text-right">{t('dateOfBirthLabel')}</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Select onValueChange={handleYearChangeG} value={selectedYearG?.toString()}>
                      <SelectTrigger id="year-select-g" className="h-14 text-lg"><SelectValue placeholder={t('yearPlaceholder')} /></SelectTrigger>
                      <SelectContent>{gregorianYears.map(year => <SelectItem key={year} value={year.toString()} className="text-lg">{year}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Select onValueChange={handleMonthChangeG} value={selectedMonthG?.toString()}>
                      <SelectTrigger id="month-select-g" className="h-14 text-lg"><SelectValue placeholder={t('monthPlaceholder')} /></SelectTrigger>
                      <SelectContent>{months.map(month => <SelectItem key={month} value={month.toString()} className="text-lg">{tDate(`months.${month-1}`)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Select onValueChange={handleDayChangeG} value={selectedDayG?.toString()}>
                      <SelectTrigger id="day-select-g" className="h-14 text-lg"><SelectValue placeholder={t('dayPlaceholder')} /></SelectTrigger>
                      <SelectContent>{daysInSelectedGregorianMonth.map(day => <SelectItem key={day} value={day.toString()} className="text-lg">{day}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleCalculateGregorian} className="w-full text-2xl py-6 bg-primary hover:bg-accent text-primary-foreground transition-transform duration-150 ease-in-out active:scale-95">
                <CalendarIcon className="ml-2 h-7 w-7" /> {t('calculateGregorianButton')}
              </Button>
            </TabsContent>

            <TabsContent value="hijri" className="mt-6 data-[state=open]:animate-fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
              <div className="space-y-3 mb-6">
                <Label className="block text-xl font-medium text-foreground mb-2 text-right">{t('dateOfBirthLabel')}</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Select onValueChange={handleYearChangeH} value={selectedYearH?.toString()}>
                      <SelectTrigger id="year-select-h" className="h-14 text-lg"><SelectValue placeholder={t('yearPlaceholder')} /></SelectTrigger>
                      <SelectContent>{hijriYears.map(year => <SelectItem key={year} value={year.toString()} className="text-lg">{year}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Select onValueChange={handleMonthChangeH} value={selectedMonthH?.toString()}>
                      <SelectTrigger id="month-select-h" className="h-14 text-lg"><SelectValue placeholder={t('monthPlaceholder')} /></SelectTrigger>
                      <SelectContent>{months.map(monthNum => <SelectItem key={monthNum} value={monthNum.toString()} className="text-lg">{tDate(`hijriMonths.${monthNum - 1}`)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Select onValueChange={handleDayChangeH} value={selectedDayH?.toString()}>
                      <SelectTrigger id="day-select-h" className="h-14 text-lg"><SelectValue placeholder={t('dayPlaceholder')} /></SelectTrigger>
                      <SelectContent>{daysInSelectedHijriMonth.map(day => <SelectItem key={day} value={day.toString()} className="text-lg">{day}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleCalculateHijri} className="w-full text-2xl py-6 bg-primary hover:bg-accent text-primary-foreground transition-transform duration-150 ease-in-out active:scale-95">
                <CalendarIcon className="ml-2 h-7 w-7" /> {t('calculateHijriButton')}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-border/50">
            <h3 className="text-lg font-medium text-center mb-4 text-foreground">{t('shareSiteTitle')}</h3>
            <div className="flex justify-center items-center space-x-3 space-x-reverse rtl:space-x-reverse">
              <Button variant="ghost" size="icon" onClick={handleShareSiteFacebook} aria-label={t('shareOnFacebook')} className="rounded-full p-3 text-primary hover:bg-primary/10">
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShareSiteTwitter} aria-label={t('shareOnTwitter')} className="rounded-full p-3 text-primary hover:bg-primary/10">
                <Twitter className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShareSiteWhatsApp} aria-label={t('shareOnWhatsApp')} className="rounded-full p-3 text-green-600 hover:bg-green-600/10">
                <MessageSquare className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopySiteLink} aria-label={t('copyLink')} className="rounded-full p-3 text-primary hover:bg-primary/10">
                <LinkIcon className="h-6 w-6" />
              </Button>
            </div>
          </div>

        </CardContent>

        {((gregorianResult && showGregorianResults) || (hijriResult && showHijriResults)) && (
          <CardFooter className={cn("flex flex-col space-y-4 pt-6 border-t", (showGregorianResults || showHijriResults) ? 'animate-fade-in' : 'opacity-0')}>
            {gregorianResult && showGregorianResults && (
              <>
                <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />{t('ageInGregorian')}</h3>
                  <p className="text-lg text-foreground">{t('yourAgeIs', { years: t('years', {count: gregorianResult.gregorianAge.years}), months: t('months', {count: gregorianResult.gregorianAge.months}), days: t('days', {count: gregorianResult.gregorianAge.days}) })}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('gregorianDob')} {gregorianResult.gregorianBirthDateFormatted}</p>
                </div>
                <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />{t('ageInHijri')}</h3>
                  <p className="text-lg text-foreground">{t('yourAgeIs', { years: t('years', {count: gregorianResult.hijriAge.years}), months: t('months', {count: gregorianResult.hijriAge.months}), days: t('days', {count: gregorianResult.hijriAge.days}) })}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('equivalentTo')} {gregorianResult.hijriBirthDateDetails.formattedDate} <span className='text-xs'>({gregorianResult.hijriBirthDateDetails.weekdayName})</span></p>
                </div>
                 {nextGregorianBirthdayCountdown && (
                    <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><PartyPopperIcon className="ml-2 h-6 w-6 text-primary" />{t('nextGregorianBirthday')}</h3>
                        {renderBirthdayMessage(nextGregorianBirthdayCountdown, gregorianBirthDateForCalculations, false)}
                    </div>
                )}
              </>
            )}

            {hijriResult && showHijriResults && (
              <>
                <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />{t('ageInHijri')}</h3>
                  <p className="text-lg text-foreground">{t('yourAgeIs', { years: t('years', {count: hijriResult.hijriAge.years}), months: t('months', {count: hijriResult.hijriAge.months}), days: t('days', {count: hijriResult.hijriAge.days}) })}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('hijriDob')} {hijriResult.hijriInputDateDetails.formattedDate} <span className='text-xs'>({hijriResult.hijriInputDateDetails.weekdayName})</span></p>
                </div>
                <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />{t('ageInGregorian')}</h3>
                  <p className="text-lg text-foreground">{t('yourAgeIs', { years: t('years', {count: hijriResult.gregorianAge.years}), months: t('months', {count: hijriResult.gregorianAge.months}), days: t('days', {count: hijriResult.gregorianAge.days}) })}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t('equivalentTo')} {hijriResult.gregorianBirthDateFormatted}</p>
                </div>
                 {nextHijriBirthdayCountdown && (
                    <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><PartyPopperIcon className="ml-2 h-6 w-6 text-primary" />{t('nextHijriBirthday')}</h3>
                         {renderBirthdayMessage(nextHijriBirthdayCountdown, undefined, true)}
                    </div>
                )}
              </>
            )}
            
            {liveAge && (gregorianBirthDateForCalculations) && (showGregorianResults || showHijriResults) && (
                 <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><TimerIcon className="ml-2 h-6 w-6 text-primary" />{t('liveAgeTitle')}</h3>
                    <p className="text-lg text-foreground tabular-nums">
                        {t('countdownIs', {
                            days: t('days', { count: liveAge.days }),
                            hours: t('hours', { count: liveAge.hours }),
                            minutes: t('minutes', { count: liveAge.minutes }),
                            seconds: t('seconds', { count: liveAge.seconds })
                        })}
                    </p>
                </div>
            )}

            {((gregorianResult && showGregorianResults) || (hijriResult && showHijriResults)) && shareResultText && (
              <div className="w-full mt-6 pt-4 border-t border-border/50 text-center">
                <h3 className="text-lg font-medium mb-3 text-foreground">{t('shareResultTitle')}</h3>
                <div className="flex justify-center items-center space-x-2 space-x-reverse rtl:space-x-reverse">
                  <Button variant="outline" size="icon" onClick={handleShareResultFacebook} aria-label={t('shareOnFacebook')} className="rounded-full p-2 text-primary hover:bg-primary/10">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShareResultTwitter} aria-label={t('shareOnTwitter')} className="rounded-full p-2 text-primary hover:bg-primary/10">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShareResultWhatsApp} aria-label={t('shareOnWhatsApp')} className="rounded-full p-2 text-green-500 hover:bg-green-500/10">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleCopyResult} aria-label={t('copyResult')} className="rounded-full p-2 text-primary hover:bg-primary/10">
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center pt-2">
              {t('hijriNote')}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

    