function padNumber(value: number): string {
  return String(value).padStart(2, '0');
}

export function parseDateString(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  let [year, month, day] = value.split('-').map(Number);
  let date = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function formatDateString(date: Date): string {
  return [
    String(date.getUTCFullYear()).padStart(4, '0'),
    padNumber(date.getUTCMonth() + 1),
    padNumber(date.getUTCDate())
  ].join('-');
}

export function addDays(value: string, amount: number): string | null {
  let date = parseDateString(value);
  if (!date) {
    return null;
  }

  date.setUTCDate(date.getUTCDate() + amount);
  return formatDateString(date);
}

interface ParsedTime {
  hasSeconds: boolean,
  hours: number,
  minutes: number,
  seconds: number
}

function parseTimeString(value: string): ParsedTime | null {
  let match = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  let minutes = Number(match[2]);
  let seconds = match[3] == null ? 0 : Number(match[3]);

  if (hours > 23 || minutes > 59 || seconds > 59) {
    return null;
  }

  return {
    hasSeconds: match[3] != null,
    hours,
    minutes,
    seconds
  };
}

function formatTimeString(time: ParsedTime): string {
  let base = `${padNumber(time.hours)}:${padNumber(time.minutes)}`;
  if (!time.hasSeconds) {
    return base;
  }

  return `${base}:${padNumber(time.seconds)}`;
}

export function addMinutes(value: string, amount: number): string | null {
  let parsed = parseTimeString(value);
  if (!parsed) {
    return null;
  }

  let totalSeconds = parsed.hours * 3600 + parsed.minutes * 60 + parsed.seconds + amount * 60;
  totalSeconds = ((totalSeconds % 86400) + 86400) % 86400;

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return formatTimeString({
    hasSeconds: parsed.hasSeconds,
    hours,
    minutes,
    seconds
  });
}
