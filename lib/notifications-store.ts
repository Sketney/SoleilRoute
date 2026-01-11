const listeners = new Set<() => void>();
let unreadCount = 0;
let subscriberCount = 0;
let poller: ReturnType<typeof setInterval> | null = null;
let focusListener: (() => void) | null = null;
let visibilityListener: (() => void) | null = null;

const POLL_INTERVAL_MS = 30000;
const enablePolling =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_ENABLE_DEV_POLLING === "1";

function emit() {
  listeners.forEach((listener) => listener());
}

function startPolling() {
  refreshUnreadCount();
  if (enablePolling) {
    poller = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[SoleilRoute] notifications polling disabled");
  }
  if (typeof window !== "undefined") {
    if (!focusListener) {
      focusListener = () => {
        void refreshUnreadCount();
      };
      window.addEventListener("focus", focusListener);
      window.addEventListener("online", focusListener);
    }
    if (!visibilityListener && typeof document !== "undefined") {
      visibilityListener = () => {
        if (document.visibilityState === "visible") {
          void refreshUnreadCount();
        }
      };
      document.addEventListener("visibilitychange", visibilityListener);
    }
  }
}

function stopPolling() {
  if (poller) {
    clearInterval(poller);
    poller = null;
  }
  if (focusListener && typeof window !== "undefined") {
    window.removeEventListener("focus", focusListener);
    window.removeEventListener("online", focusListener);
    focusListener = null;
  }
  if (visibilityListener && typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", visibilityListener);
    visibilityListener = null;
  }
}

export function subscribeToUnreadCount(listener: () => void) {
  listeners.add(listener);
  subscriberCount += 1;
  if (subscriberCount === 1) {
    startPolling();
  }

  return () => {
    listeners.delete(listener);
    subscriberCount = Math.max(subscriberCount - 1, 0);
    if (subscriberCount === 0) {
      stopPolling();
    }
  };
}

export function getUnreadCountSnapshot() {
  return unreadCount;
}

export function getUnreadCountServerSnapshot() {
  return 0;
}

export function setUnreadCount(count: number) {
  const next = Math.max(count, 0);
  if (next === unreadCount) {
    return;
  }
  unreadCount = next;
  emit();
}

export function bumpUnreadCount(delta = 1) {
  setUnreadCount(unreadCount + delta);
}

export async function refreshUnreadCount() {
  if (process.env.NODE_ENV !== "production") {
    console.info("[SoleilRoute] notifications poll tick");
  }
  try {
    const response = await fetch("/api/notifications");
    if (!response.ok) {
      return;
    }
    const payload = (await response.json()) as { unreadCount?: number };
    if (typeof payload.unreadCount === "number") {
      setUnreadCount(payload.unreadCount);
      if (process.env.NODE_ENV !== "production") {
        console.info("[SoleilRoute] notifications unread:", payload.unreadCount);
      }
    }
  } catch {
    // noop
  }
}
