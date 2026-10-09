"use client";

type Listener = (href: string) => void;

const waiters: Listener[] = [];

/** Stash so /projects can land on a case even if the router drops the hash. */
export const FOCUS_PROJECT_KEY = "jr-focus-project";

export function requestCurtain(href: string) {
  if (!waiters.length && typeof window !== "undefined") {
    window.location.assign(href);
    return;
  }
  waiters.forEach((fn) => fn(href));
}

export function requestProjectPage(projectId?: string) {
  if (typeof window !== "undefined" && projectId) {
    try {
      sessionStorage.setItem(FOCUS_PROJECT_KEY, projectId);
    } catch {
      /* private mode */
    }
    // Query survives App Router; hash often does not.
    requestCurtain(`/projects?p=${encodeURIComponent(projectId)}`);
    return;
  }
  requestCurtain("/projects");
}

export function subscribeCurtain(fn: Listener) {
  waiters.push(fn);
  return () => {
    const i = waiters.indexOf(fn);
    if (i >= 0) waiters.splice(i, 1);
  };
}
