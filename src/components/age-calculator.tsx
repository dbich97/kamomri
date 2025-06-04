
"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
import { ClockIcon, GiftIcon, CalendarIcon, TimerIcon, PartyPopperIcon, AlertTriangleIcon, Facebook, Twitter, Share2, Link as LinkIcon } from "lucide-react";
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
  arabicHijriMonthNames,
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
  
  const currentGregorianYear = useMemo(() => new Date().getFullYear(), []);
  const gregorianYears = useMemo(() => Array.from({ length: currentGregorianYear - 1900 + 1 }, (_, i) => currentGregorianYear - i), [currentGregorianYear]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const currentHijriYear = useMemo(() => getHijriDateDetails(new Date()).year, []);
  const hijriYears = useMemo(() => Array.from({ length: currentHijriYear - 1300 + 5 }, (_, i) => currentHijriYear + 5 - i), [currentHijriYear]);

  const daysInSelectedGregorianMonth = useMemo(() => {
    const year = selectedYearG || currentGregorianYear;
    const month = selectedMonthG || (new Date().getMonth() + 1);
    const numDays = new Date(year, month, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }, [selectedYearG, selectedMonthG, currentGregorianYear]);

  const daysInSelectedHijriMonth = useMemo(() => {
    const year = selectedYearH || currentHijriYear;
    const month = selectedMonthH || (getHijriDateDetails(new Date()).month);
    const numDays = getDaysInHijriMonthArithmetic(year, month);
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }, [selectedYearH, selectedMonthH, currentHijriYear]);


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
            toast({ title: "يوم غير صالح", description: `الشهر المحدد به ${maxDays} يوم فقط.`, variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
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
            toast({ title: "يوم غير صالح", description: `الشهر الهجري المحدد به ${maxDays} يوم فقط.`, variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
            return;
        }
    }
    setSelectedDayH(dayVal);
  };


  const handleCalculateGregorian = () => {
    if (!selectedDayG || !selectedMonthG || !selectedYearG) {
      toast({ title: "خطأ في الإدخال", description: "الرجاء اختيار اليوم والشهر والسنة للميلاد الميلادي.", variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }
    const constructedBirthDate = new Date(selectedYearG, selectedMonthG - 1, selectedDayG);
    const currentDate = new Date();
    if (isNaN(constructedBirthDate.getTime()) || constructedBirthDate > currentDate) {
      toast({ title: "خطأ في الإدخال", description: "تاريخ الميلاد الميلادي غير صالح أو في المستقبل.", variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }
    
    setShowGregorianResults(false);
    setHijriResult(null); // Clear Hijri results when calculating Gregorian
    setShowHijriResults(false);
    setGregorianBirthDateForCalculations(constructedBirthDate);
    setHijriBirthDayForCountdown(undefined); 
    setHijriBirthMonthForCountdown(undefined);


    const gregorianAge = calculateGregorianAge(constructedBirthDate, currentDate);
    const hijriBirthDateDetails = getHijriDateDetails(constructedBirthDate);
    const currentHijriDetails = getHijriDateDetails(currentDate);
    const hijriAge = calculateHijriAge(hijriBirthDateDetails, currentHijriDetails);
    const gregorianBirthDateFormatted = formatGregorianDate(constructedBirthDate);

    setGregorianResult({ gregorianAge, hijriAge, gregorianBirthDateFormatted, hijriBirthDateDetails });
    setTimeout(() => setShowGregorianResults(true), 50);
  };

  const handleCalculateHijri = () => {
    if (!selectedDayH || !selectedMonthH || !selectedYearH) {
      toast({ title: "خطأ في الإدخال", description: "الرجاء اختيار اليوم والشهر والسنة للميلاد الهجري.", variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }

    const convertedGregorianBirthDate = convertHijriToGregorian(selectedYearH, selectedMonthH, selectedDayH);
    if (!convertedGregorianBirthDate) {
      toast({ title: "خطأ في التحويل", description: "لم يتم العثور على تاريخ ميلادي مطابق للتاريخ الهجري المدخل. قد يكون التاريخ الهجري غير صالح.", variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }
    const currentDate = new Date();
    if (convertedGregorianBirthDate > currentDate) {
      toast({ title: "خطأ في الإدخال", description: "تاريخ الميلاد لا يمكن أن يكون في المستقبل.", variant: "destructive", icon: <AlertTriangleIcon className="h-5 w-5" /> });
      return;
    }

    setShowHijriResults(false);
    setGregorianResult(null); // Clear Gregorian results when calculating Hijri
    setShowGregorianResults(false);
    setGregorianBirthDateForCalculations(convertedGregorianBirthDate);
    setHijriBirthDayForCountdown(selectedDayH);
    setHijriBirthMonthForCountdown(selectedMonthH);

    const gregorianAge = calculateGregorianAge(convertedGregorianBirthDate, currentDate);
    const currentHijriDetails = getHijriDateDetails(currentDate);
    const inputHijriDetailsDirect = getHijriDateDetails(convertedGregorianBirthDate); 

    const hijriAge = calculateHijriAge(inputHijriDetailsDirect, currentHijriDetails);
    const gregorianBirthDateFormatted = formatGregorianDate(convertedGregorianBirthDate);

    setHijriResult({ 
        gregorianAge, 
        hijriAge, 
        gregorianBirthDateFormatted, 
        hijriInputDateDetails: {
            year: selectedYearH,
            month: selectedMonthH,
            day: selectedDayH,
            monthName: arabicHijriMonthNames[selectedMonthH -1],
            weekdayName: inputHijriDetailsDirect.weekdayName, 
            formattedDate: `${selectedDayH} ${arabicHijriMonthNames[selectedMonthH-1]} ${selectedYearH}هـ`
        }
    });
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
            const countdown = calculateNextHijriBirthdayDetails(hijriBirthDayForCountdown, hijriBirthMonthForCountdown, new Date());
            setNextHijriBirthdayCountdown(countdown);
        };
        update();
        const intervalId = setInterval(update, 1000);
        return () => clearInterval(intervalId);
    } else {
        setNextHijriBirthdayCountdown(null); 
    }
  }, [hijriBirthDayForCountdown, hijriBirthMonthForCountdown, gregorianBirthDateForCalculations]);


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
    const currentHijri = getHijriDateDetails(new Date());
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
    
    const messageType = isHijri ? "الهجري" : "الميلادي";

    if (isTodayActualBirthday) {
        if (isHijri || (birthDateObj && nowIsPastBirthTime(birthDateObj)) || (countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0 && birthDateObj && birthDateObj.getFullYear() !== new Date().getFullYear()) ) {
            return <p className="text-lg text-center font-semibold text-green-600">🎉 عيد ميلاد سعيد ({messageType})! لقد أتممت عاماً جديداً اليوم! 🎉</p>;
        } else {
            return <p className="text-lg text-center font-semibold text-green-600">🎉 عيد ميلادك {messageType} هو اليوم! 🎉</p>;
        }
    }
    return (
      <p className="text-lg text-foreground tabular-nums">
        {countdown.days} يوم، {countdown.hours} ساعة،
        <br/> 
        {countdown.minutes} دقيقة، و {countdown.seconds} ثانية
      </p>
    );
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = "اكتشف عمرك بدقة مع حاسبة العمر هذه!";

  const handleShareFacebook = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({ title: "تم النسخ!", description: "تم نسخ رابط الموقع إلى الحافظة.", icon: <LinkIcon className="h-5 w-5" /> });
        })
        .catch(err => {
          toast({ title: "خطأ", description: "لم نتمكن من نسخ الرابط. الرجاء المحاولة يدويًا.", variant: "destructive" });
          console.error('Failed to copy: ', err);
        });
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">حساب كم عمري</CardTitle>
          
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="gregorian" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="gregorian" onClick={() => { setShowHijriResults(false); setHijriResult(null); }} className="text-lg py-3">حساب بالميلادي</TabsTrigger>
              <TabsTrigger value="hijri" onClick={() => { setShowGregorianResults(false); setGregorianResult(null);}} className="text-lg py-3">حساب بالهجري</TabsTrigger>
            </TabsList>
            
            {/* Gregorian Input Tab */}
            <TabsContent value="gregorian" className="mt-6">
              <div className="space-y-3 mb-6">
                <Label className="block text-xl font-medium text-foreground mb-2 text-right">اختر تاريخ ميلادك</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    
                    <Select onValueChange={handleYearChangeG} value={selectedYearG?.toString()}>
                      <SelectTrigger id="year-select-g" className="h-14 text-lg"><SelectValue placeholder="السنة" /></SelectTrigger>
                      <SelectContent>{gregorianYears.map(year => <SelectItem key={year} value={year.toString()} className="text-lg">{year}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    
                    <Select onValueChange={handleMonthChangeG} value={selectedMonthG?.toString()}>
                      <SelectTrigger id="month-select-g" className="h-14 text-lg"><SelectValue placeholder="الشهر" /></SelectTrigger>
                      <SelectContent>{months.map(month => <SelectItem key={month} value={month.toString()} className="text-lg">{month}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    
                    <Select onValueChange={handleDayChangeG} value={selectedDayG?.toString()}>
                      <SelectTrigger id="day-select-g" className="h-14 text-lg"><SelectValue placeholder="اليوم" /></SelectTrigger>
                      <SelectContent>{daysInSelectedGregorianMonth.map(day => <SelectItem key={day} value={day.toString()} className="text-lg">{day}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleCalculateGregorian} className="w-full text-2xl py-6 bg-primary hover:bg-accent text-primary-foreground transition-transform duration-150 ease-in-out active:scale-95">
                <CalendarIcon className="ml-2 h-7 w-7" /> احسب عمرك (ميلادي)
              </Button>
            </TabsContent>

            {/* Hijri Input Tab */}
            <TabsContent value="hijri" className="mt-6">
              <div className="space-y-3 mb-6">
                <Label className="block text-xl font-medium text-foreground mb-2 text-right">اختر تاريخ ميلادك</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    
                    <Select onValueChange={handleYearChangeH} value={selectedYearH?.toString()}>
                      <SelectTrigger id="year-select-h" className="h-14 text-lg"><SelectValue placeholder="السنة" /></SelectTrigger>
                      <SelectContent>{hijriYears.map(year => <SelectItem key={year} value={year.toString()} className="text-lg">{year}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    
                    <Select onValueChange={handleMonthChangeH} value={selectedMonthH?.toString()}>
                      <SelectTrigger id="month-select-h" className="h-14 text-lg"><SelectValue placeholder="الشهر" /></SelectTrigger>
                      <SelectContent>{months.map(monthNum => <SelectItem key={monthNum} value={monthNum.toString()} className="text-lg">{arabicHijriMonthNames[monthNum - 1]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    
                    <Select onValueChange={handleDayChangeH} value={selectedDayH?.toString()}>
                      <SelectTrigger id="day-select-h" className="h-14 text-lg"><SelectValue placeholder="اليوم" /></SelectTrigger>
                      <SelectContent>{daysInSelectedHijriMonth.map(day => <SelectItem key={day} value={day.toString()} className="text-lg">{day}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleCalculateHijri} className="w-full text-2xl py-6 bg-primary hover:bg-accent text-primary-foreground transition-transform duration-150 ease-in-out active:scale-95">
                <CalendarIcon className="ml-2 h-7 w-7" /> احسب عمرك (هجري)
              </Button>
            </TabsContent>
          </Tabs>

          {/* Social Share Section */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <h3 className="text-lg font-medium text-center mb-4 text-foreground">شارك الموقع مع أصدقائك:</h3>
            <div className="flex justify-center items-center space-x-3 space-x-reverse rtl:space-x-reverse">
              <Button variant="ghost" size="icon" onClick={handleShareFacebook} aria-label="شارك على فيسبوك" className="rounded-full p-3 text-primary hover:bg-primary/10">
                <Facebook className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShareTwitter} aria-label="شارك على تويتر" className="rounded-full p-3 text-primary hover:bg-primary/10">
                <Twitter className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleShareWhatsApp} aria-label="شارك على واتساب" className="rounded-full p-3 text-green-600 hover:bg-green-600/10">
                <Share2 className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopyLink} aria-label="انسخ الرابط" className="rounded-full p-3 text-primary hover:bg-primary/10">
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
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />عمرك حسب التقويم الميلادي:</h3>
                  <p className="text-lg text-foreground">{gregorianResult.gregorianAge.years} سنة، {gregorianResult.gregorianAge.months} شهر، و {gregorianResult.gregorianAge.days} يوم</p>
                  <p className="text-sm text-muted-foreground mt-1">تاريخ ميلادك الميلادي: {gregorianResult.gregorianBirthDateFormatted}</p>
                </div>
                <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />عمرك حسب التقويم الهجري:</h3>
                  <p className="text-lg text-foreground">{gregorianResult.hijriAge.years} سنة، {gregorianResult.hijriAge.months} شهر، و {gregorianResult.hijriAge.days} يوم</p>
                  <p className="text-sm text-muted-foreground mt-1">الموافق لـ: {gregorianResult.hijriBirthDateDetails.formattedDate} <span className='text-xs'>({gregorianResult.hijriBirthDateDetails.weekdayName})</span></p>
                </div>
                 {nextGregorianBirthdayCountdown && (
                    <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><PartyPopperIcon className="ml-2 h-6 w-6 text-primary" />عيد ميلادك الميلادي القادم بعد:</h3>
                        {renderBirthdayMessage(nextGregorianBirthdayCountdown, gregorianBirthDateForCalculations, false)}
                    </div>
                )}
              </>
            )}

            {hijriResult && showHijriResults && (
              <>
                <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />عمرك حسب التقويم الهجري:</h3>
                  <p className="text-lg text-foreground">{hijriResult.hijriAge.years} سنة، {hijriResult.hijriAge.months} شهر، و {hijriResult.hijriAge.days} يوم</p>
                  <p className="text-sm text-muted-foreground mt-1">تاريخ ميلادك الهجري: {hijriResult.hijriInputDateDetails.formattedDate} <span className='text-xs'>({hijriResult.hijriInputDateDetails.weekdayName})</span></p>
                </div>
                <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><GiftIcon className="ml-2 h-6 w-6 text-primary" />عمرك حسب التقويم الميلادي:</h3>
                  <p className="text-lg text-foreground">{hijriResult.gregorianAge.years} سنة، {hijriResult.gregorianAge.months} شهر، و {hijriResult.gregorianAge.days} يوم</p>
                  <p className="text-sm text-muted-foreground mt-1">الموافق لـ: {hijriResult.gregorianBirthDateFormatted}</p>
                </div>
                 {nextHijriBirthdayCountdown && (
                    <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                        <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><PartyPopperIcon className="ml-2 h-6 w-6 text-primary" />عيد ميلادك الهجري القادم بعد:</h3>
                         {renderBirthdayMessage(nextHijriBirthdayCountdown, undefined, true)}
                    </div>
                )}
              </>
            )}
            
            {liveAge && (gregorianBirthDateForCalculations) && (showGregorianResults || showHijriResults) && (
                 <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-primary mb-2 flex items-center"><TimerIcon className="ml-2 h-6 w-6 text-primary" />عمرك الحالي بدقة:</h3>
                    <p className="text-lg text-foreground tabular-nums">
                        {liveAge.years} سنة، {liveAge.months} شهر، {liveAge.days} يوم،
                        <br/>
                        {liveAge.hours} ساعة، {liveAge.minutes} دقيقة، و {liveAge.seconds} ثانية
                    </p>
                </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center pt-2">
              ملاحظة: حساب العمر بالتقويم الهجري يعتمد على التقويم الهجري الحسابي (المدني) وقد يختلف بيوم واحد عن التقويم المعتمد على رؤية الهلال مثل تقويم أم القرى.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

    

    


