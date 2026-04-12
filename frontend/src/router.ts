type RouterHandler = (params?: Record<string, string>) => void;
const routes = new Map<string, RouterHandler>();
let notFoundHandler: RouterHandler | null = null;

export function register(path: string, handler: RouterHandler) {
  routes.set(path, handler);
}

export function notFound(handler: RouterHandler) {
  notFoundHandler = handler;
}

/** Score a route by specificity: more static segments = higher priority */
function routeScore(path: string): number {
  return path.split("/").filter((seg) => !seg.startsWith(":")).length;
}

export function handleRoute() {
  const path = window.location.pathname;

  // Sort routes: static segments first, param segments last
  const sorted = [...routes.entries()].sort(
    ([a], [b]) => routeScore(b) - routeScore(a),
  );

  for (const [routePath, handler] of sorted) {
    const paramNames: string[] = [];

    const regexPath = routePath.replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });

    const match = path.match(new RegExp("^" + regexPath + "$"));

    if (match) {
      const params: Record<string, string> = {};
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      handler(params);
      return;
    }
  }

  notFoundHandler?.();
}

export function navigate(path: string) {
  window.history.pushState({}, "", path);
  handleRoute();
}

export function startRouter() {
  window.addEventListener("popstate", () => handleRoute());
  handleRoute();
}

export function back() {
  window.history.back();
}
