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

function getDaysInHijriMonthArithmetic(year: number, month: number): number {
  if (month < 1 || month > 12) throw new Error('Invalid Hijri month');
  if (month === 12) {
    const isLeap = (11 * year + 14) % 30 < 11;
    return isLeap ? 30 : 29;
  }
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
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonthDate.getDate();
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

  // If diff becomes negative after adjustment (e.g., birthday just passed midnight), recalculate for next year.
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
