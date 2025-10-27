// formats a Date or ISO string to a medium date + short time string
export function formatDateTime(d?: Date | string) {
  if (!d) return "";
  return new Date(d).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// consider two timestamps equal if they differ only by a small amount (DB precision)
// can be used to determine if a comment was edited
export function wasEdited(
  created?: Date | string,
  updated?: Date | string,
  epsilonMs = 1000
) {
  if (!updated) return false;
  const c = created ? new Date(created).getTime() : 0;
  const u = new Date(updated).getTime();
  if (Number.isNaN(c) || Number.isNaN(u)) return false;
  return Math.abs(u - c) > epsilonMs;
}
