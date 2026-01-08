
import { useRef, useEffect, useCallback } from 'react';
import { ActivityType } from '@/types/activity';

export function useRealTimeMonitoring(
  isMonitoring: boolean,
  useDataset: boolean,
  addEventCallback: (type: ActivityType, details?: string) => void
) {
  // Refs to track throttling of frequent events
  const lastMouseMoveTime = useRef<number>(0);
  const lastKeyTime = useRef<number>(0);
  const mouseMovementCounter = useRef<number>(0);
  const keyCounter = useRef<number>(0);
  
  // Clipboard monitoring refs
  const lastClipboardContent = useRef<string>('');
  const clipboardCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const lastClipboardCheck = useRef<number>(0);
  const pasteDetected = useRef<boolean>(false);
  const lastPasteCheck = useRef<number>(0);
  
  // Function to check clipboard changes
  const checkClipboardChanges = useCallback(async () => {
    try {
      // Only check if browser has focus or recently regained focus
      if (!document.hasFocus()) return;
      
      const clipboardText = await navigator.clipboard.readText();
      const now = Date.now();
      
      // Check if clipboard content changed and it's not empty
      if (clipboardText !== lastClipboardContent.current && clipboardText.trim()) {
        // If it's been more than 2 seconds since last check, likely external copy
        if (now - lastClipboardCheck.current > 2000) {
          addEventCallback('Copy Attempt', `External clipboard content detected (${clipboardText.length} characters)`);
        }
        lastClipboardContent.current = clipboardText;
      }
      lastClipboardCheck.current = now;
    } catch (error) {
      // Clipboard access might be denied, fail silently
      console.log('Clipboard access denied or unavailable');
    }
  }, [addEventCallback]);
  
  // Function to detect paste operations from external sources
  const detectExternalPaste = useCallback(async () => {
    try {
      if (!document.hasFocus()) return;
      
      const clipboardText = await navigator.clipboard.readText();
      const now = Date.now();
      
      // Check if user has pasted external content
      // This works by monitoring if the clipboard content was changed externally
      // and then detecting when it might be used (paste operation)
      if (clipboardText !== lastClipboardContent.current && clipboardText.trim()) {
        // If this is new content and user is active, likely a paste from external source
        if (now - lastPasteCheck.current > 1000) { // Avoid duplicate detection
          addEventCallback('Paste Attempt', `External paste detected (${clipboardText.length} characters from other application)`);
          lastPasteCheck.current = now;
        }
        lastClipboardContent.current = clipboardText;
      }
    } catch (error) {
      console.log('Paste detection failed:', error);
    }
  }, [addEventCallback]);
  
  // Setup browser event listeners for real-time activity monitoring
  useEffect(() => {
    if (!isMonitoring || useDataset) {
      // Clear clipboard monitoring when not monitoring
      if (clipboardCheckInterval.current) {
        clearInterval(clipboardCheckInterval.current);
        clipboardCheckInterval.current = null;
      }
      return;
    }

    // Handler for mouse movements
    const handleMouseMove = () => {
      const now = Date.now();
      mouseMovementCounter.current += 1;
      
      // Throttle mouse movement events to avoid flooding
      if (now - lastMouseMoveTime.current > 5000) { // Report every 5 seconds if there's movement
        if (mouseMovementCounter.current > 10) { // Only if there's significant movement
          // Calculate movements per second
          const movementsPerSecond = mouseMovementCounter.current / 5; // Over 5 second period
          
          // Only add risk if movements exceed 300 per second (very high activity)
          if (movementsPerSecond > 300) {
            addEventCallback('Mouse Movement', `High frequency movement detected: ${movementsPerSecond.toFixed(0)} movements/sec`);
          } else {
            // Log activity but with 0 risk score for normal movement
            addEventCallback('Mouse Movement', `Normal movement detected: ${mouseMovementCounter.current} movements`);
          }
        }
        lastMouseMoveTime.current = now;
        mouseMovementCounter.current = 0;
      }
    };

    // Handler for keyboard activity
    const handleKeyDown = (event: KeyboardEvent) => {
      const now = Date.now();
      keyCounter.current += 1;
      
      // Detect Ctrl+V (paste) and Ctrl+C (copy) key combinations
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'v') {
          addEventCallback('Paste Attempt', 'Keyboard paste shortcut detected');
          // Check for external paste content after a short delay
          setTimeout(detectExternalPaste, 200);
        } else if (event.key === 'c') {
          addEventCallback('Copy Attempt', 'Keyboard copy shortcut detected');
        }
      }
      
      // Throttle keyboard events
      if (now - lastKeyTime.current > 5000) { // Report every 5 seconds of typing
        if (keyCounter.current > 5) { // Only if there's significant typing
          // Calculate keystrokes per second
          const keystrokesPerSecond = keyCounter.current / 5; // Over 5 second period
          
          // Only add risk if keystrokes exceed 40 per 5-second period (8 per second)
          if (keyCounter.current > 40) {
            addEventCallback('Keyboard Activity', `High frequency typing detected: ${keyCounter.current} keystrokes in 5 seconds`);
          } else {
            // Log activity but with 0 risk score for normal typing
            addEventCallback('Keyboard Activity', `Normal typing detected: ${keyCounter.current} keystrokes`);
          }
        }
        lastKeyTime.current = now;
        keyCounter.current = 0;
      }
    };

    // Handler for tab/window visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        addEventCallback('Focus Change', 'Lost focus from application');
      } else {
        addEventCallback('Focus Change', 'Returned focus to application');
        // Check clipboard when returning to the application
        setTimeout(checkClipboardChanges, 500);
      }
    };

    // Enhanced focus event handler
    const handleFocus = () => {
      addEventCallback('Focus Change', 'Application gained focus');
      // Check clipboard when gaining focus
      setTimeout(checkClipboardChanges, 500);
    };

    const handleBlur = () => {
      addEventCallback('Focus Change', 'Application lost focus');
    };

    // Handler for copy attempts
    const handleCopy = () => {
      addEventCallback('Copy Attempt', 'User attempted to copy content within browser');
      // Update last clipboard content reference
      setTimeout(async () => {
        try {
          lastClipboardContent.current = await navigator.clipboard.readText();
        } catch (error) {
          // Ignore clipboard access errors
        }
      }, 100);
    };

    // Handler for paste attempts
    const handlePaste = () => {
      addEventCallback('Paste Attempt', 'User attempted to paste content within browser');
      // Check for external paste content
      setTimeout(detectExternalPaste, 100);
    };

    // Set up periodic clipboard monitoring (every 2 seconds when focused)
    clipboardCheckInterval.current = setInterval(() => {
      if (document.hasFocus()) {
        checkClipboardChanges();
        // Also check for potential paste operations
        detectExternalPaste();
      }
    }, 2000);

    // Add all event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    // Remove all listeners on cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
      if (clipboardCheckInterval.current) {
        clearInterval(clipboardCheckInterval.current);
        clipboardCheckInterval.current = null;
      }
    };
  }, [isMonitoring, useDataset, addEventCallback, checkClipboardChanges, detectExternalPaste]);
}
