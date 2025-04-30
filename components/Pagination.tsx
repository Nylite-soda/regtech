import React, { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type ButtonVariant = "page" | "control" | "ellipsis";

interface PaginationButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: ButtonVariant;
  "aria-label"?: string;
  children: React.ReactNode;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled = false,
  active = false,
  variant = "page",
  "aria-label": ariaLabel,
  children,
}) => {
  const baseClasses =
    "relative flex items-center justify-center text-sm font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50";

  const getVariantClasses = () => {
    switch (variant) {
      case "control":
        return `rounded-md min-w-9 h-9 px-2 
          ${
            disabled
              ? "cursor-not-allowed opacity-50 dark:text-gray-500 text-gray-400"
              : "hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-400 text-gray-700 dark:text-gray-300"
          }`;
      case "ellipsis":
        return "min-w-9 h-9 px-1 text-gray-500 dark:text-gray-400 cursor-default";
      case "page":
      default:
        return `rounded-md min-w-9 h-9
          ${
            active
              ? "bg-red-700 dark:bg-red-900 text-white transform scale-105 shadow-md z-10"
              : disabled
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-400"
          }`;
    }
  };

  const animationClasses =
    !disabled && variant !== "ellipsis"
      ? "hover:scale-110 active:scale-95"
      : "";

  const buttonClasses = `${baseClasses} ${getVariantClasses()} ${animationClasses}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      type="button"
    >
      {children}
    </button>
  );
};

const PrevButton: React.FC<
  Omit<PaginationButtonProps, "children" | "variant">
> = (props) => (
  <PaginationButton variant="control" aria-label="Previous page" {...props}>
    <ChevronLeft className="w-5 h-5" />
  </PaginationButton>
);

const NextButton: React.FC<
  Omit<PaginationButtonProps, "children" | "variant">
> = (props) => (
  <PaginationButton variant="control" aria-label="Next page" {...props}>
    <ChevronRight className="w-5 h-5" />
  </PaginationButton>
);

const FirstButton: React.FC<
  Omit<PaginationButtonProps, "children" | "variant">
> = (props) => (
  <PaginationButton variant="control" aria-label="First page" {...props}>
    <ChevronsLeft className="w-5 h-5" />
  </PaginationButton>
);

const LastButton: React.FC<
  Omit<PaginationButtonProps, "children" | "variant">
> = (props) => (
  <PaginationButton variant="control" aria-label="Last page" {...props}>
    <ChevronsRight className="w-5 h-5" />
  </PaginationButton>
);

const Ellipsis: React.FC = () => (
  <PaginationButton variant="ellipsis" disabled aria-hidden="true">
    <span className="w-5">...</span>
  </PaginationButton>
);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface PageItemsWithEllipsis {
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
  pages: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showFirstLast = true,
  className = "",
  size = "md",
}: PaginationProps) {
  const pageItems = useMemo<number[] | PageItemsWithEllipsis>(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage: number;
    let endPage: number;
    const sidePages = Math.floor(maxVisiblePages / 2);

    if (currentPage <= sidePages + 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - sidePages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - sidePages;
      endPage = currentPage + sidePages;
    }

    return {
      showStartEllipsis: startPage > 1,
      showEndEllipsis: endPage < totalPages,
      pages: Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ),
    };
  }, [currentPage, totalPages, maxVisiblePages]);

  const sizeClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  const animatePageTransition = (targetPage: number) => {
    const distance = Math.abs(targetPage - currentPage);
    if (distance <= maxVisiblePages) {
      onPageChange(targetPage);
      return;
    }
    onPageChange(targetPage);
  };

  return (
    <nav aria-label="Pagination" className={className}>
      <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
        {showFirstLast && totalPages > maxVisiblePages && (
          <FirstButton
            onClick={() => animatePageTransition(1)}
            disabled={currentPage === 1}
          />
        )}

        <PrevButton
          onClick={() => animatePageTransition(currentPage - 1)}
          disabled={currentPage <= 1}
        />

        <div className={`flex items-center ${sizeClasses[size]}`}>
          {Array.isArray(pageItems) ? (
            pageItems.map((page) => (
              <PaginationButton
                key={page}
                onClick={() => animatePageTransition(page)}
                active={page === currentPage}
              >
                {page}
              </PaginationButton>
            ))
          ) : (
            <>
              {pageItems.showStartEllipsis && (
                <>
                  <PaginationButton
                    onClick={() => animatePageTransition(1)}
                    active={currentPage === 1}
                  >
                    1
                  </PaginationButton>
                  <Ellipsis />
                </>
              )}

              {pageItems.pages.map((page) => (
                <PaginationButton
                  key={page}
                  onClick={() => animatePageTransition(page)}
                  active={page === currentPage}
                >
                  {page}
                </PaginationButton>
              ))}

              {pageItems.showEndEllipsis && (
                <>
                  <Ellipsis />
                  <PaginationButton
                    onClick={() => animatePageTransition(totalPages)}
                    active={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationButton>
                </>
              )}
            </>
          )}
        </div>

        <NextButton
          onClick={() => animatePageTransition(currentPage + 1)}
          disabled={currentPage >= totalPages}
        />

        {showFirstLast && totalPages > maxVisiblePages && (
          <LastButton
            onClick={() => animatePageTransition(totalPages)}
            disabled={currentPage === totalPages}
          />
        )}
      </div>

      <div className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
        <span className="hidden sm:inline">
          Page {(currentPage < totalPages && currentPage) || totalPages} of{" "}
          {totalPages}
        </span>
      </div>
    </nav>
  );
}
