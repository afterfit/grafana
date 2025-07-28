import { TimeRange, toUtc, AbsoluteTimeRange, RawTimeRange } from '@grafana/data';

type CopiedTimeRangeResult = { range: RawTimeRange; isError: false } | { range: string; isError: true };

export const getShiftedTimeRange = (direction: number, origRange: TimeRange): AbsoluteTimeRange => {
  const range = {
    from: toUtc(origRange.from),
    to: toUtc(origRange.to),
  };

  const toValue = range.to.valueOf();
  const fromValue = range.from.valueOf();
  const timespan = toValue - fromValue;
  let to: number, from: number;

  if (direction === -1) {
    to = toValue - timespan;
    from = fromValue - timespan;
  } else if (direction === 1) {
    to = toValue + timespan;
    from = fromValue + timespan;
    if (to > Date.now() && toValue < Date.now()) {
      to = Date.now();
      from = fromValue;
    }
  } else {
    to = toValue;
    from = fromValue;
  }

  return { from, to };
};

export const getZoomedTimeRange = (range: TimeRange, factor: number): AbsoluteTimeRange => {
  const timespan = range.to.valueOf() - range.from.valueOf();
  const center = range.to.valueOf() - timespan / 2;
  // If the timepsan is 0, zooming out would do nothing, so we force a zoom out to 30s
  const newTimespan = timespan === 0 ? 30000 : timespan * factor;

  const to = center + newTimespan / 2;
  const from = center - newTimespan / 2;

  return { from, to };
};

export async function getCopiedTimeRange(): Promise<CopiedTimeRangeResult> {
  const raw = await navigator.clipboard.readText();
  let range;

  try {
    range = JSON.parse(raw);

    if (!range.from || !range.to) {
      return { range: raw, isError: true };
    }

    return { range, isError: false };
  } catch (e) {
    return { range: raw, isError: true };
  }
}
