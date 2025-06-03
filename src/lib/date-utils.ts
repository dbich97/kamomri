
import { arSA } from 'date-fns/locale';

export interface Age {
  years: number;
  months: number;
  days: number;
}

export interface LiveAgeDetails extends Age {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownDetails {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthdayToday?: boolean;
}

export interface HijriDateDetails {
  year: number;
  month: number; // 1-indexed
  day: number;
  monthName: string;
  weekdayName: string;
  formattedDate: string;
}

export const arabicHijriMonthNames: string[] = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

export function getHijriDateDetails(gregorianDate: Date): HijriDateDetails {
  const baseLocale = 'ar-SA'; 

  const numFormatter = new Intl.DateTimeFormat(baseLocale + '-u-ca-islamic-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const nameFormatter = new Intl.DateTimeFormat(baseLocale + '-u-ca-islamic-nu-arab', {
    month: 'long',
    weekday: 'long',
  });
   const fullDateFormatter = new Intl.DateTimeFormat(baseLocale + '-u-ca-islamic-nu-arab', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const numParts = numFormatter.formatToParts(gregorianDate);
  const nameParts = nameFormatter.formatToParts(gregorianDate);
  
  const getPartValue = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
    parts.find(p => p.type === type)?.value || '';

  return {
    year: parseInt(getPartValue(numParts, 'year')),
    month: parseInt(getPartValue(numParts, 'month')), 
    day: parseInt(getPartValue(numParts, 'day')),
    monthName: getPartValue(nameParts, 'month'),
    weekdayName: getPartValue(nameParts, 'weekday'),
    formattedDate: fullDateFormatter.format(gregorianDate),
  };
}

export function calculateGregorianAge(birthDate: Date, currentDate: Date): Age {
  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += prevMonthDate.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

export function getDaysInHijriMonthArithmetic(year: number, month: number): number {
  if (month < 1 || month > 12) throw new Error('Invalid Hijri month');
  // For Dhu al-Hijjah (month 12), determine if it's a leap year in the arithmetic calendar
  if (month === 12) {
    // Common algorithm for arithmetic Islamic calendar (e.g., civil or tabular)
    // Leap years occur in a 30-year cycle at years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29
    const isLeap = (11 * year + 14) % 30 < 11; // This is one common formula for type II
    return isLeap ? 30 : 29;
  }
  // Odd months have 30 days, even months have 29 days (except Dhu al-Hijjah)
  return month % 2 === 1 ? 30 : 29;
}

export function calculateHijriAge(
  birthHijri: HijriDateDetails,
  currentHijri: HijriDateDetails
): Age {
  let years = currentHijri.year - birthHijri.year;
  let months = currentHijri.month - birthHijri.month;
  let days = currentHijri.day - birthHijri.day;

  if (days < 0) {
    months--;
    const prevMonth = currentHijri.month - 1 > 0 ? currentHijri.month - 1 : 12;
    const prevMonthYear = currentHijri.month - 1 > 0 ? currentHijri.year : currentHijri.year - 1;
    days += getDaysInHijriMonthArithmetic(prevMonthYear, prevMonth);
  }

  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export function formatGregorianDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export const datePickerLocale = arSA;


export function calculateLiveAgeDetails(birthDate: Date): LiveAgeDetails {
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  let hours = now.getHours() - birthDate.getHours();
  let minutes = now.getMinutes() - birthDate.getMinutes();
  let seconds = now.getSeconds() - birthDate.getSeconds();

  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    days--;
    hours += 24;
  }
  if (days < 0) {
    months--;
    // Get days in the previous Gregorian month
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += lastDayOfPrevMonth;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { 
    years: Math.max(0, years), 
    months: Math.max(0, months), 
    days: Math.max(0, days), 
    hours: Math.max(0, hours), 
    minutes: Math.max(0, minutes), 
    seconds: Math.max(0, seconds) 
  };
}

export function calculateNextBirthdayDetails(birthDate: Date): CountdownDetails {
  const now = new Date();
  const birthMonth = birthDate.getMonth(); 
  const birthDay = birthDate.getDate(); 
  const birthHour = birthDate.getHours();
  const birthMinute = birthDate.getMinutes();
  const birthSecond = birthDate.getSeconds();

  const currentYear = now.getFullYear();
  let nextBirthdayDateTime = new Date(currentYear, birthMonth, birthDay, birthHour, birthMinute, birthSecond);

  if (now.getTime() >= nextBirthdayDateTime.getTime()) {
    nextBirthdayDateTime.setFullYear(currentYear + 1);
  }
  
  const isTodayBirthday = now.getMonth() === birthMonth && now.getDate() === birthDay;
  let diff = nextBirthdayDateTime.getTime() - now.getTime();

  if (diff < 0) {
    nextBirthdayDateTime.setFullYear(nextBirthdayDateTime.getFullYear() + 1);
    diff = nextBirthdayDateTime.getTime() - now.getTime();
  }

  const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDiff = Math.floor((diff % (1000 * 60)) / 1000);

  return { 
    days: Math.max(0, daysDiff), 
    hours: Math.max(0, hoursDiff), 
    minutes: Math.max(0, minutesDiff), 
    seconds: Math.max(0, secondsDiff),
    isBirthdayToday: isTodayBirthday 
  };
}

// Function to convert Hijri date to Gregorian
// Note: This is an iterative approach and might be slow for large date ranges or very old dates.
// It assumes the Intl.DateTimeFormat for 'ar-SA-u-ca-islamic' is consistent.
export function convertHijriToGregorian(hYear: number, hMonth: number, hDay: number): Date | null {
  // Estimate Gregorian year: Hijri year is approx 0.97 of Gregorian year. Epoch around 622 AD.
  const estimatedGregorianYear = Math.floor(hYear * 0.970224 /* 354.367056 / 365.2425 days in H/G year */) + 621;

  // Start iterating from a bit before the estimated year to be safe
  let gregorianDate = new Date(Date.UTC(estimatedGregorianYear - 1, 0, 1)); // Jan 1 of (est. year - 1)

  // Iterate for a maximum of ~3 Gregorian years (366 days * 3)
  for (let i = 0; i < 366 * 3; i++) {
    const hijriDetails = getHijriDateDetails(gregorianDate);
    if (hijriDetails.year === hYear && hijriDetails.month === hMonth && hijriDetails.day === hDay) {
      // Create a new Date object in local timezone from UTC components
      return new Date(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate());
    }
    gregorianDate.setUTCDate(gregorianDate.getUTCDate() + 1);
  }
  return null; // Return null if no matching Gregorian date is found within the search range
}


export function calculateNextHijriBirthdayDetails(
  hijriBirthDay: number, 
  hijriBirthMonth: number, 
  currentGregorianDateForReference: Date
): CountdownDetails | null {
  const currentHijriDetails = getHijriDateDetails(currentGregorianDateForReference);
  
  let targetHijriYear = currentHijriDetails.year;

  // Check if birthday for this Hijri year has passed
  if (currentHijriDetails.month > hijriBirthMonth || 
      (currentHijriDetails.month === hijriBirthMonth && currentHijriDetails.day > hijriBirthDay)) {
    targetHijriYear++;
  }

  // Validate day for target month/year
  const daysInTargetMonth = getDaysInHijriMonthArithmetic(targetHijriYear, hijriBirthMonth);
  if (hijriBirthDay > daysInTargetMonth) {
    // This case implies an invalid original birth date (e.g., 30th of a 29-day month)
    // Or, the target year's specific month has fewer days.
    // For simplicity, we'll assume original birth date was valid and look for next possible occurrence.
    // This edge case handling can be more sophisticated.
    // For now, if invalid, we can't calculate.
    console.warn(`Target Hijri birthday ${hijriBirthDay}/${hijriBirthMonth}/${targetHijriYear} is invalid. Days in month: ${daysInTargetMonth}`);
    // return null; // Or try to find the next valid date. For now, let's try to convert.
  }


  const gregorianNextHijriBirthday = convertHijriToGregorian(targetHijriYear, hijriBirthMonth, Math.min(hijriBirthDay, daysInTargetMonth));

  if (!gregorianNextHijriBirthday) {
    return null; // Conversion failed
  }
  
  // Set time to start of day for comparison, or use specific birth time if available
  gregorianNextHijriBirthday.setHours(0, 0, 0, 0); 
  const now = new Date(currentGregorianDateForReference);
  now.setHours(0,0,0,0); // Compare day-wise

  let diff = gregorianNextHijriBirthday.getTime() - now.getTime();

  // If diff is negative, it means the calculated next birthday is in the past (e.g. due to time of day, or conversion nuances)
  // or today. We should ensure it's truly in the future or handle today.
  if (diff < 0 && !(now.getFullYear() === gregorianNextHijriBirthday.getFullYear() && now.getMonth() === gregorianNextHijriBirthday.getMonth() && now.getDate() === gregorianNextHijriBirthday.getDate())) {
      // Birthday already passed this year, try next Hijri year for the target date.
      const nextYearGregorianBirthday = convertHijriToGregorian(targetHijriYear + 1, hijriBirthMonth, Math.min(hijriBirthDay, getDaysInHijriMonthArithmetic(targetHijriYear+1, hijriBirthMonth)));
      if (nextYearGregorianBirthday) {
        nextYearGregorianBirthday.setHours(0,0,0,0);
        diff = nextYearGregorianBirthday.getTime() - now.getTime();
      } else {
        return null;
      }
  }
  
  // Ensure diff is not negative before calculating days, hours, etc.
  diff = Math.max(0, diff);


  const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsDiff = Math.floor((diff % (1000 * 60)) / 1000);
  
  const isTodayHijriBirthday = currentHijriDetails.month === hijriBirthMonth && currentHijriDetails.day === hijriBirthDay;

  // For countdown, we want hours/minutes/seconds relative to current time, not just start of day.
  // Re-calculate diff with current time if not birthday today.
  let preciseDiff = gregorianNextHijriBirthday.getTime() - currentGregorianDateForReference.getTime();
   if (preciseDiff < 0 && !isTodayHijriBirthday) { // If it's past, use next year's date for precise countdown
     const nextActualGregorianBirthday = convertHijriToGregorian(targetHijriYear + 1, hijriBirthMonth, Math.min(hijriBirthDay, getDaysInHijriMonthArithmetic(targetHijriYear+1, hijriBirthMonth)));
     if (nextActualGregorianBirthday) {
        // Keep original birth time if available, otherwise start of day
        const originalBirthDate = convertHijriToGregorian(1400, hijriBirthMonth, hijriBirthDay); // Dummy year
        if(originalBirthDate){
            nextActualGregorianBirthday.setHours(originalBirthDate.getHours(), originalBirthDate.getMinutes(), originalBirthDate.getSeconds());
        }
        preciseDiff = nextActualGregorianBirthday.getTime() - currentGregorianDateForReference.getTime();
     }
   }
   preciseDiff = Math.max(0, preciseDiff);


  return { 
    days: Math.floor(preciseDiff / (1000 * 60 * 60 * 24)), 
    hours: Math.floor((preciseDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 
    minutes: Math.floor((preciseDiff % (1000 * 60 * 60)) / (1000 * 60)), 
    seconds: Math.floor((preciseDiff % (1000 * 60)) / 1000),
    isBirthdayToday: isTodayHijriBirthday
  };
}
