import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TabNavigationProps {
  /**
   * Total number of tabs in the tab group
   */
  totalTabs: number;

  /**
   * Current active tab index (0-based)
   */
  currentTabIndex: number;

  /**
   * Function to call when navigating to the previous tab
   */
  onPrevious: () => void;

  /**
   * Function to call when navigating to the next tab
   */
  onNext: () => void;

  /**
   * Optional className to apply to the container
   */
  className?: string;
}

/**
 * TabNavigation component that shows previous/next buttons based on current position
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  totalTabs,
  currentTabIndex,
  onPrevious,
  onNext,
  className = "",
}) => {
  // Determine if we should show prev/next buttons
  const showPrevious = currentTabIndex > 0;
  const showNext = currentTabIndex < totalTabs - 1;

  // Don't render anything if we're at both ends (no navigation possible)
  if (!showPrevious && !showNext) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between mt-6 ${className}`}>
      {/* Previous button - only shown if not on first tab */}
      {showPrevious ? (
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 text-gray-700 hover:text-[#AD0000] transition-colors"
          aria-label="Previous tab"
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>
      ) : (
        <div></div> // Empty div to maintain layout when button is hidden
      )}

      {/* Next button - only shown if not on last tab */}
      {showNext ? (
        <button
          onClick={onNext}
          className="flex items-center gap-2 text-gray-700 hover:text-[#AD0000] transition-colors ml-auto"
          aria-label="Next tab"
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      ) : (
        <div></div> // Empty div to maintain layout when button is hidden
      )}
    </div>
  );
};

export default TabNavigation;
