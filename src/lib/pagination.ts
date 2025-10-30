// Helper function to build a compact set of page items with ellipses
export function getPaginationItems(
  totalPages: number,
  currentPage: number,
  siblings = 1
) {
  const items: (number | "ellipsis")[] = [];
  const totalNumbers = siblings * 2 + 5; // first + last + current + 2*siblings + (2 ellipses possible)
  if (totalPages <= totalNumbers) {
    for (let i = 1; i <= totalPages; i++) items.push(i);
    return items;
  }

  // Calculate left and right page numbers to show around the current page
  const left = Math.max(2, currentPage - siblings);
  const right = Math.min(totalPages - 1, currentPage + siblings);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < totalPages - 1;

  // Push the first page, the last page, and the pages around the current page
  items.push(1);
  if (showLeftEllipsis) items.push("ellipsis");
  for (let i = left; i <= right; i++) items.push(i);
  if (showRightEllipsis) items.push("ellipsis");
  items.push(totalPages);

  return items;
}
