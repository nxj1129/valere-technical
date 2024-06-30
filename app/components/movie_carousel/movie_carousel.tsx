import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const MovieCarousel = <T,>({ items, renderItem }: CarouselProps<T>) => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth - 1 < scrollWidth); // -1 to account for potential rounding errors
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition();
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <div className="relative">
      {showLeftButton && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black p-2 rounded-full z-10">
          <ChevronLeft size={24} />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar scrollbar-hide">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-none w-48">
            {renderItem(item)}
          </div>
        ))}
      </div>
      {showRightButton && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black p-2 rounded-full z-10">
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default MovieCarousel;
