import { useRef, useCallback, useEffect, RefObject, useState } from "react";

interface UseDoubleClickOptions {
  onDoubleClick?: () => void;
  onSingleClick?: () => void;
  delay?: number;
  activeDuration?: number;
  elementRef?: RefObject<HTMLElement>;
  preventDefault?: boolean;
}

const useDoubleClick = ({
  onDoubleClick,
  onSingleClick,
  delay = 300,
  activeDuration = 1000,
  elementRef,
  preventDefault = false,
}: UseDoubleClickOptions = {}) => {
  const clickTimeoutRef = useRef<number | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback(
    (event?: React.MouseEvent) => {
      if (preventDefault && event) {
        event.preventDefault();
      }

      const now = Date.now();
      const timeSinceLastClick = now - lastClickTimeRef.current;

      if (timeSinceLastClick < delay) {
        // Double click detected
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
        }

        // Set pressed state
        setIsPressed(true);

        // Call the double click handler
        onDoubleClick?.();

        // Reset pressed state after duration
        setTimeout(() => {
          setIsPressed(false);
        }, activeDuration);
      } else {
        // Single click - wait for potential double click
        clickTimeoutRef.current = window.setTimeout(() => {
          // Single click confirmed
          onSingleClick?.();
          clickTimeoutRef.current = null;
        }, delay);
      }

      lastClickTimeRef.current = now;
    },
    [onDoubleClick, onSingleClick, delay, preventDefault, activeDuration],
  );

  // Attach event listener to element ref if provided
  useEffect(() => {
    if (!elementRef?.current) return;

    const element = elementRef.current;
    const handleElementClick = (event: Event) => {
      if (preventDefault) {
        event.preventDefault();
      }
      handleClick();
    };

    element.addEventListener("click", handleElementClick);

    return () => {
      element.removeEventListener("click", handleElementClick);
    };
  }, [elementRef, handleClick, preventDefault]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return {
    handleClick,
    isPressed,
    resetPressed: () => setIsPressed(false),
  };
};

export default useDoubleClick;
