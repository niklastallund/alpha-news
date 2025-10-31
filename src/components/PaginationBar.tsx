import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getPaginationItems } from "@/lib/pagination";

type PaginationBarProps = {
  totalPages: number;
  currentPage: number;
  siblingCount?: number; // number of sibling pages to show on each side (default 2)
  className?: string; // optional styling class

  // function to create href for a given page number
  // should return a URL string for the given page (used for links)
  createHref: (page: number) => string;
};

export default function PaginationBar({
  totalPages,
  currentPage,
  createHref,
  siblingCount = 2,
  className,
}: PaginationBarProps) {
  if (!totalPages || totalPages <= 1) return null;

  const paginationItems = getPaginationItems(
    totalPages,
    currentPage,
    siblingCount
  );

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        {paginationItems.map((item, idx) =>
          item === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={createHref(item)}
                isActive={currentPage === item}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={createHref(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
