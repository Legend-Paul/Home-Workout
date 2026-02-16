type RouterHandler = () => void;
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
  const handler = routes.get(path);
  if (handler) {
    handler();
  } else if (notFoundHandler) {
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
