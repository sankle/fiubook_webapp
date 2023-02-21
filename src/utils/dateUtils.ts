const timezoneOffsetMs = new Date().getTimezoneOffset() * 60000;

export const convertToLocaleString = (date: Date) =>
  new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, -8);

export const isDateSelected = (date: string) => date !== '';

export const normalizeBookingSlot = (
  fromDate: string,
  toDate: string,
  granularity: number,
  minSlots: number,
  maxSlots: number | null,
  changedToDateInput: boolean
) => {
  const granularityMs = granularity * 1000;

  const start = isDateSelected(fromDate) ? new Date(fromDate) : null;
  const end = isDateSelected(toDate) ? new Date(toDate) : start;

  if (!start || !end) {
    return { start, end };
  }

  const adjustEndTime = !changedToDateInput;

  let startTime = start.getTime();
  let endTime = end.getTime();

  if (startTime + granularityMs * minSlots > endTime) {
    if (adjustEndTime) {
      endTime = startTime + granularityMs * minSlots;
    } else {
      startTime = endTime - granularityMs * minSlots;
    }
  }

  const granularityModule = (endTime - startTime) % granularityMs;

  if (adjustEndTime) {
    endTime -= granularityModule;
  } else {
    startTime += granularityModule;
  }

  if (maxSlots) {
    const bookingLengthInSlots = (endTime - startTime) / granularityMs;

    if (bookingLengthInSlots > maxSlots) {
      if (adjustEndTime) {
        endTime -= granularityMs * (bookingLengthInSlots - maxSlots);
      } else {
        startTime += granularityMs * (bookingLengthInSlots - maxSlots);
      }
    }
  }

  return { start: new Date(startTime), end: new Date(endTime) };
};

export const changeBookingSlot = ({
  newFromDate,
  newToDate,
  prevFromDate,
  prevToDate,
  granularity,
  maxSlots,
  setFromDate,
  setToDate,
}: {
  newFromDate: string | null;
  newToDate: string | null;
  prevFromDate: string;
  prevToDate: string;
  granularity: number;
  maxSlots: number | null;
  setFromDate: any;
  setToDate: any;
}) => {
  const fromDate = newFromDate || prevFromDate;
  const toDate = newToDate || prevToDate;

  const changedToDateInput = !!newToDate && !newFromDate;

  const { start, end } = normalizeBookingSlot(
    fromDate,
    toDate,
    granularity,
    1,
    maxSlots,
    changedToDateInput
  );

  if (start) {
    setFromDate(convertToLocaleString(start));
  }

  if (end) {
    setToDate(convertToLocaleString(end));
  }
};

export const getGranularityInDHM = (granularity: number) => ({
  granularity_days: Math.floor(granularity / (3600 * 24)),
  granularity_hours: Math.floor((granularity % (3600 * 24)) / 3600),
  granularity_minutes: Math.floor((granularity % 3600) / 60),
});

export const getGranularityString = (granularity: number) => {
  const { granularity_days, granularity_hours, granularity_minutes } =
    getGranularityInDHM(granularity);

  return `${granularity_days > 0 ? `${granularity_days}d ` : ''}${
    granularity_hours > 0 ? `${granularity_hours}h ` : ''
  }${granularity_minutes > 0 ? `${granularity_minutes}m ` : ''}`;
};
