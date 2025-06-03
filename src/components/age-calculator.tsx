"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, GiftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type Age,
  type HijriDateDetails,
  getHijriDateDetails,
  calculateGregorianAge,
  calculateHijriAge,
  formatGregorianDate,
  datePickerLocale
} from '@/lib/date-utils';
import { useToast } from '@/hooks/use-toast';

interface CalculationResult {
  gregorianAge: Age;
  hijriAge: Age;
  gregorianBirthDateFormatted: string;
  hijriBirthDateDetails: HijriDateDetails;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleCalculate = () => {
    if (!birthDate) {
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء اختيار تاريخ الميلاد أولاً.",
        variant: "destructive",
      });
      return;
    }

    const currentDate = new Date();
    if (birthDate > currentDate) {
      toast({
        title: "خطأ في الإدخال",
        description: "تاريخ الميلاد لا يمكن أن يكون في المستقبل.",
        variant: "destructive",
      });
      return;
    }
    
    setShowResults(false); // Reset for animation

    const gregorianAge = calculateGregorianAge(birthDate, currentDate);
    const hijriBirthDateDetails = getHijriDateDetails(birthDate);
    const currentHijriDetails = getHijriDateDetails(currentDate);
    const hijriAge = calculateHijriAge(hijriBirthDateDetails, currentHijriDetails);
    
    const gregorianBirthDateFormatted = formatGregorianDate(birthDate);

    setResult({
      gregorianAge,
      hijriAge,
      gregorianBirthDateFormatted,
      hijriBirthDateDetails,
    });
    
    // Trigger animation after state update
    setTimeout(() => setShowResults(true), 50);
  };
  
  const displaySelectedDate = () => {
    if (!birthDate) return "اختر تاريخ ميلادك";
    const gregDateStr = formatGregorianDate(birthDate);
    const hijriDateStr = getHijriDateDetails(birthDate).formattedDate;
    return `${gregDateStr} (الموافق ${hijriDateStr})`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">حاسبة العمر الدقيقة</CardTitle>
          <CardDescription className="text-muted-foreground">أدخل تاريخ ميلادك بالتقويم الميلادي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="birthdate-picker" className="block text-sm font-medium text-foreground">تاريخ الميلاد (ميلادي):</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="birthdate-picker"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {displaySelectedDate()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                  locale={datePickerLocale}
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  classNames={{
                    caption_label: "text-lg font-medium text-primary",
                    head_cell: "text-muted-foreground w-9 font-medium text-sm",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground rounded-md",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            onClick={handleCalculate} 
            className="w-full text-lg py-3 bg-primary hover:bg-accent text-primary-foreground transition-transform duration-150 ease-in-out active:scale-95"
          >
            <ClockIcon className="ml-2 h-5 w-5" />
            احسب عمرك
          </Button>
        </CardContent>

        {result && (
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
             <p className="text-xs text-muted-foreground text-center pt-2">
              ملاحظة: حساب العمر بالتقويم الهجري يعتمد على التقويم الهجري الحسابي (المدني) وقد يختلف بيوم واحد عن التقويم المعتمد على رؤية الهلال مثل تقويم أم القرى.
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
