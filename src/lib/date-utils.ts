
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

const getLocaleForIntl = (locale: string) => {
    switch (locale) {
        case 'ar': return 'ar-SA';
        case 'en': return 'en-US';
        case 'es': return 'es-ES';
        case 'fr': return 'fr-FR';
        case 'de': return 'de-DE';
        default: return 'en-US';
    }
}

export function getHijriDateDetails(gregorianDate: Date, locale: string): HijriDateDetails {
  const intlLocale = getLocaleForIntl(locale);
  const baseLocaleWithCalendar = `${intlLocale}-u-ca-islamic`;

  const numFormatter = new Intl.DateTimeFormat(baseLocaleWithCalendar + '-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC'
  });
  const nameFormatter = new Intl.DateTimeFormat(baseLocaleWithCalendar, {
    month: 'long',
    weekday: 'long',
    timeZone: 'UTC'
  });
   const fullDateFormatter = new Intl.DateTimeFormat(baseLocaleWithCalendar, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
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

export function formatGregorianDate(date: Date, locale: string): string {
  const intlLocale = getLocaleForIntl(locale);
  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'UTC'
  }).format(date);
}

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

export function convertHijriToGregorian(hYear: number, hMonth: number, hDay: number, locale: string): Date | null {
  const estimatedGregorianYear = Math.floor(hYear * 0.970224) + 621;
  let gregorianDate = new Date(Date.UTC(estimatedGregorianYear - 1, 0, 1));

  for (let i = 0; i < 366 * 3; i++) {
    const hijriDetails = getHijriDateDetails(gregorianDate, locale);
    if (hijriDetails.year === hYear && hijriDetails.month === hMonth && hijriDetails.day === hDay) {
      return new Date(gregorianDate.getUTCFullYear(), gregorianDate.getUTCMonth(), gregorianDate.getUTCDate());
    }
    gregorianDate.setUTCDate(gregorianDate.getUTCDate() + 1);
  }
  return null;
}

export function calculateNextHijriBirthdayDetails(
  hijriBirthDay: number, 
  hijriBirthMonth: number, 
  currentGregorianDateForReference: Date,
  locale: string
): CountdownDetails | null {
  const currentHijriDetails = getHijriDateDetails(currentGregorianDateForReference, locale);
  let targetHijriYear = currentHijriDetails.year;

  if (currentHijriDetails.month > hijriBirthMonth || 
      (currentHijriDetails.month === hijriBirthMonth && currentHijriDetails.day > hijriBirthDay)) {
    targetHijriYear++;
  }

  const daysInTargetMonth = getDaysInHijriMonthArithmetic(targetHijriYear, hijriBirthMonth);
  if (hijriBirthDay > daysInTargetMonth) {
    console.warn(`Target Hijri birthday ${hijriBirthDay}/${hijriBirthMonth}/${targetHijriYear} is invalid. Days in month: ${daysInTargetMonth}`);
  }

  const gregorianNextHijriBirthday = convertHijriToGregorian(targetHijriYear, hijriBirthMonth, Math.min(hijriBirthDay, daysInTargetMonth), locale);

  if (!gregorianNextHijriBirthday) {
    return null;
  }
  
  gregorianNextHijriBirthday.setHours(0, 0, 0, 0); 
  const now = new Date(currentGregorianDateForReference);
  now.setHours(0,0,0,0);

  let diff = gregorianNextHijriBirthday.getTime() - now.getTime();

  if (diff < 0 && !(now.getFullYear() === gregorianNextHijriBirthday.getFullYear() && now.getMonth() === gregorianNextHijriBirthday.getMonth() && now.getDate() === gregorianNextHijriBirthday.getDate())) {
      const nextYearGregorianBirthday = convertHijriToGregorian(targetHijriYear + 1, hijriBirthMonth, Math.min(hijriBirthDay, getDaysInHijriMonthArithmetic(targetHijriYear+1, hijriBirthMonth)), locale);
      if (nextYearGregorianBirthday) {
        nextYearGregorianBirthday.setHours(0,0,0,0);
        diff = nextYearGregorianBirthday.getTime() - now.getTime();
      } else {
        return null;
      }
  }
  
  diff = Math.max(0, diff);

  const isTodayHijriBirthday = currentHijriDetails.month === hijriBirthMonth && currentHijriDetails.day === hijriBirthDay;

  let preciseDiff = gregorianNextHijriBirthday.getTime() - currentGregorianDateForReference.getTime();
   if (preciseDiff < 0 && !isTodayHijriBirthday) {
     const nextActualGregorianBirthday = convertHijriToGregorian(targetHijriYear + 1, hijriBirthMonth, Math.min(hijriBirthDay, getDaysInHijriMonthArithmetic(targetHijriYear+1, hijriBirthMonth)), locale);
     if (nextActualGregorianBirthday) {
        const originalBirthDate = convertHijriToGregorian(1400, hijriBirthMonth, hijriBirthDay, locale);
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

    