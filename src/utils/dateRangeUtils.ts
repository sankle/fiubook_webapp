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
  minSlots,
  maxSlots,
  setFromDate,
  setToDate,
}: {
  newFromDate: string | null;
  newToDate: string | null;
  prevFromDate: string;
  prevToDate: string;
  granularity: number;
  minSlots: number;
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
    minSlots,
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
