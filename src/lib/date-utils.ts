import { arSA } from 'date-fns/locale';

export interface Age {
  years: number;
  months: number;
  days: number;
}

export interface HijriDateDetails {
  year: number;
  month: number;
  day: number;
  monthName: string;
  weekdayName: string;
  formattedDate: string;
}

// Helper to get Hijri date parts from a Gregorian date
export function getHijriDateDetails(gregorianDate: Date): HijriDateDetails {
  const baseLocale = 'ar-SA'; // Using ar-SA for Umm al-Qura, common in Saudi Arabia

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
    month: parseInt(getPartValue(numParts, 'month')), // 1-indexed
    day: parseInt(getPartValue(numParts, 'day')),
    monthName: getPartValue(nameParts, 'month'),
    weekdayName: getPartValue(nameParts, 'weekday'),
    formattedDate: fullDateFormatter.format(gregorianDate),
  };
}

// Calculate age based on Gregorian calendar
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


// Calculate age based on Hijri calendar parts
// This uses an arithmetic approximation for days in Hijri month for simplicity with Intl.
// Note: 'islamic-umalqura' (often default for ar-SA) can have variations not captured by simple arithmetic.
function getDaysInHijriMonthArithmetic(year: number, month: number): number {
  // Standard arithmetic (civil) Hijri calendar:
  // Months: 1,3,5,7,9,11 have 30 days. 2,4,6,8,10 have 29 days.
  // Month 12 (Dhu al-Hijjah) has 29 days, or 30 in a leap year.
  // A common leap year rule: (11 * year + 14) % 30 < 11
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
    // Days in the month *before* currentHijri.month of currentHijri.year
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

// Date formatting for display
export function formatGregorianDate(date: Date): string {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export const datePickerLocale = arSA;
