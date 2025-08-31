import { useEffect } from "react";

type SwipeDirection = "left" | "right" | "up" | "down";

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // minimum distance before triggering
}

export function useSwipe(
  ref: React.RefObject<HTMLElement>,
  {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  }: UseSwipeOptions,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const onTouchStart = (e: TouchEvent | MouseEvent) => {
      isDragging = true;
      if ("touches" in e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      } else {
        startX = e.clientX;
        startY = e.clientY;
      }
    };

    const onTouchMove = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
    };

    const onTouchEnd = (e: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      let endX = 0;
      let endY = 0;

      if ("changedTouches" in e) {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
      } else {
        endX = e.clientX;
        endY = e.clientY;
      }

      const dx = endX - startX;
      const dy = endY - startY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // horizontal
        if (dx > threshold && onSwipeRight) onSwipeRight();
        else if (dx < -threshold && onSwipeLeft) onSwipeLeft();
      } else {
        // vertical
        if (dy > threshold && onSwipeDown) onSwipeDown();
        else if (dy < -threshold && onSwipeUp) onSwipeUp();
      }

      isDragging = false;
    };

    // mouse
    element.addEventListener("mousedown", onTouchStart);
    element.addEventListener("mousemove", onTouchMove);
    element.addEventListener("mouseup", onTouchEnd);

    // touch
    element.addEventListener("touchstart", onTouchStart);
    element.addEventListener("touchmove", onTouchMove);
    element.addEventListener("touchend", onTouchEnd);

    return () => {
      element.removeEventListener("mousedown", onTouchStart);
      element.removeEventListener("mousemove", onTouchMove);
      element.removeEventListener("mouseup", onTouchEnd);

      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }, [ref, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]);
}
