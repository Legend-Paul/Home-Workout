type RouterHandler = (params?: Record<string, string>) => void;
const routes = new Map<string, RouterHandler>();

let notFoundHandler: RouterHandler | null = null;

export function register(path: string, handler: RouterHandler) {
  routes.set(path, handler);
}

export function notFound(handler: RouterHandler) {
  notFoundHandler = handler;
}

export function handleRoute() {
  const path = window.location.pathname;

  for (const [routePath, handler] of routes.entries()) {
    const paramNames: string[] = [];

    // Convert route to regex & collect param names
    const regexPath = routePath.replace(/:([^/]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });

    const routeRegex = new RegExp("^" + regexPath + "$");
    const match = path.match(routeRegex);

    if (match) {
      const params: Record<string, string> = {};

      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });

      handler(params);
      return;
    }
  }

  if (notFoundHandler) {
    notFoundHandler();
  }
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
