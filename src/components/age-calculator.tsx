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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon, GiftIcon, CalendarIcon, TimerIcon, PartyPopperIcon, AlertTriangleIcon } from "lucide-react";
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
  calculateNextBirthdayDetails
} from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

interface CalculationResult {
  gregorianAge: Age;
  hijriAge: Age;
  gregorianBirthDateFormatted: string;
  hijriBirthDateDetails: HijriDateDetails;
}

export default function AgeCalculator() {
  const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [birthDateObject, setBirthDateObject] = useState<Date | undefined>(undefined);
  
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const [liveAge, setLiveAge] = useState<LiveAgeDetails | null>(null);
  const [nextBirthdayCountdown, setNextBirthdayCountdown] = useState<CountdownDetails | null>(null);
  
  const { toast } = useToast();

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const years = useMemo(() => Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i), [currentYear]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const daysInSelectedMonth = useMemo(() => {
    if (!selectedYear || !selectedMonth) return Array.from({ length: 31 }, (_, i) => i + 1);
    const numDays = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }, [selectedYear, selectedMonth]);

  const handleYearChange = (value: string) => {
    const yearVal = parseInt(value);
    setSelectedYear(yearVal);
    if (selectedMonth && selectedDay) {
      const maxDays = new Date(yearVal, selectedMonth, 0).getDate();
      if (selectedDay > maxDays) {
        setSelectedDay(undefined);
      }
    }
  };

  const handleMonthChange = (value: string) => {
    const monthVal = parseInt(value);
    setSelectedMonth(monthVal);
    if (selectedYear && selectedDay) {
      const maxDays = new Date(selectedYear, monthVal, 0).getDate();
      if (selectedDay > maxDays) {
        setSelectedDay(undefined);
      }
    }
  };

  const handleCalculate = () => {
    if (!selectedDay || !selectedMonth || !selectedYear) {
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء اختيار اليوم والشهر والسنة للميلاد.",
        variant: "destructive",
        icon: <AlertTriangleIcon className="h-5 w-5 text-destructive-foreground" />,
      });
      return;
    }

    const constructedBirthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const currentDate = new Date();

    if (isNaN(constructedBirthDate.getTime())) {
        toast({
            title: "خطأ في الإدخال",
            description: "التاريخ المحدد غير صالح.",
            variant: "destructive",
            icon: <AlertTriangleIcon className="h-5 w-5 text-destructive-foreground" />,
        });
        return;
    }
    
    if (constructedBirthDate > currentDate) {
      toast({
        title: "خطأ في الإدخال",
        description: "تاريخ الميلاد لا يمكن أن يكون في المستقبل.",
        variant: "destructive",
        icon: <AlertTriangleIcon className="h-5 w-5 text-destructive-foreground" />,
      });
      return;
    }
    
    setShowResults(false); 
    setBirthDateObject(constructedBirthDate);

    const gregorianAge = calculateGregorianAge(constructedBirthDate, currentDate);
    const hijriBirthDateDetails = getHijriDateDetails(constructedBirthDate);
    const currentHijriDetails = getHijriDateDetails(currentDate);
    const hijriAge = calculateHijriAge(hijriBirthDateDetails, currentHijriDetails);
    const gregorianBirthDateFormatted = formatGregorianDate(constructedBirthDate);

    setResult({
      gregorianAge,
      hijriAge,
      gregorianBirthDateFormatted,
      hijriBirthDateDetails,
    });
    
    setTimeout(() => setShowResults(true), 50);
  };

  useEffect(() => {
    if (!birthDateObject) {
      setLiveAge(null);
      return;
    }
    const update = () => setLiveAge(calculateLiveAgeDetails(birthDateObject));
    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [birthDateObject]);

  useEffect(() => {
    if (!birthDateObject) {
      setNextBirthdayCountdown(null);
      return;
    }
    const update = () => setNextBirthdayCountdown(calculateNextBirthdayDetails(birthDateObject));
    update();
    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, [birthDateObject]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">حاسبة العمر الدقيقة</CardTitle>
          <CardDescription className="text-muted-foreground">أدخل تاريخ ميلادك بالتقويم الميلادي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="block text-sm font-medium text-foreground mb-1">تاريخ الميلاد (ميلادي):</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="year-select" className="text-xs">السنة</Label>
                <Select onValueChange={handleYearChange} value={selectedYear?.toString()}>
                  <SelectTrigger id="year-select" className="w-full">
                    <SelectValue placeholder="السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="month-select" className="text-xs">الشهر</Label>
                <Select onValueChange={handleMonthChange} value={selectedMonth?.toString()} disabled={!selectedYear}>
                  <SelectTrigger id="month-select" className="w-full">
                    <SelectValue placeholder="الشهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month.toString()}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="day-select" className="text-xs">اليوم</Label>
                <Select onValueChange={(value) => setSelectedDay(parseInt(value))} value={selectedDay?.toString()} disabled={!selectedYear || !selectedMonth}>
                  <SelectTrigger id="day-select" className="w-full">
                    <SelectValue placeholder="اليوم" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysInSelectedMonth.map(day => (
                      <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleCalculate} 
            className="w-full text-lg py-3 bg-primary hover:bg-accent text-primary-foreground transition-transform duration-150 ease-in-out active:scale-95"
          >
            <CalendarIcon className="ml-2 h-5 w-5" />
            احسب عمرك
          </Button>
        </CardContent>

        {result && birthDateObject && (
          <CardFooter className={cn("flex flex-col space-y-4 pt-6 border-t", showResults ? 'animate-fade-in' : 'opacity-0')}>
            <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">
                <GiftIcon className="ml-2 h-6 w-6 text-primary" />
                عمرك حسب التقويم الميلادي:
              </h3>
              <p className="text-lg text-foreground">
                {result.gregorianAge.years} سنة، {result.gregorianAge.months} شهر، و {result.gregorianAge.days} يوم
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                تاريخ ميلادك الميلادي: {result.gregorianBirthDateFormatted}
              </p>
            </div>

            <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">
                <GiftIcon className="ml-2 h-6 w-6 text-primary" />
                عمرك حسب التقويم الهجري:
              </h3>
              <p className="text-lg text-foreground">
                {result.hijriAge.years} سنة، {result.hijriAge.months} شهر، و {result.hijriAge.days} يوم
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                تاريخ ميلادك الهجري: {result.hijriBirthDateDetails.formattedDate}
                <br/>
                <span className='text-xs'>(يوم {result.hijriBirthDateDetails.weekdayName}، شهر {result.hijriBirthDateDetails.monthName})</span>
              </p>
            </div>
            
            {liveAge && (
                 <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">
                        <TimerIcon className="ml-2 h-6 w-6 text-primary" />
                        عمرك الحالي بدقة:
                    </h3>
                    <p className="text-lg text-foreground tabular-nums">
                        {liveAge.years} سنة، {liveAge.months} شهر، {liveAge.days} يوم،
                        <br/>
                        {liveAge.hours} ساعة، {liveAge.minutes} دقيقة، و {liveAge.seconds} ثانية
                    </p>
                </div>
            )}

            {nextBirthdayCountdown && (
                 <div className="w-full p-4 bg-secondary/50 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">
                        <PartyPopperIcon className="ml-2 h-6 w-6 text-primary" />
                        عيد ميلادك القادم بعد:
                    </h3>
                    {nextBirthdayCountdown.isBirthdayToday && (nowIsPastBirthTime(birthDateObject) || (nextBirthdayCountdown.days === 0 && nextBirthdayCountdown.hours === 0 && nextBirthdayCountdown.minutes === 0 && nextBirthdayCountdown.seconds === 0 && birthDateObject.getFullYear() === new Date().getFullYear()))  ? (
                       <p className="text-lg text-center font-semibold text-green-600">🎉 عيد ميلاد سعيد! لقد أتممت عاماً جديداً اليوم! 🎉</p>
                    ) : nextBirthdayCountdown.isBirthdayToday && !nowIsPastBirthTime(birthDateObject) ? (
                       <p className="text-lg text-center font-semibold text-green-600">🎉 عيد ميلادك هو اليوم! 🎉</p>
                    ) : null}
                    <p className="text-lg text-foreground tabular-nums">
                        {nextBirthdayCountdown.days} يوم، {nextBirthdayCountdown.hours} ساعة،
                        <br/> 
                        {nextBirthdayCountdown.minutes} دقيقة، و {nextBirthdayCountdown.seconds} ثانية
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

// Helper function to check if current time is past birth time on birthday
function nowIsPastBirthTime(birthDate: Date | undefined): boolean {
    if (!birthDate) return false;
    const now = new Date();
    if (now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate()) {
        const birthTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
        return now.getTime() >= birthTimeToday.getTime();
    }
    return false;
}
