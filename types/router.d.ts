import Vue, { ComponentOptions, PluginFunction, AsyncComponent } from "vue";

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent;
type Dictionary<T> = { [key: string]: T };

export type RouterMode = "hash" | "history" | "abstract";
export type RawLocation = string | Location;
export type RedirectOption = RawLocation | ((to: Route) => RawLocation);
export type NavigationGuard = (
  to: Route,
  from: Route,
  next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void
) => any

export declare class VueRouter {
  constructor (options?: RouterOptions);

  app: Vue;
  mode: RouterMode;
  currentRoute: Route;

  beforeEach (guard: NavigationGuard): Function;
  beforeResolve (guard: NavigationGuard): Function;
  afterEach (hook: (to: Route, from: Route) => any): Function;
  push (location: RawLocation, onComplete?: Function, onAbort?: Function): void;
  replace (location: RawLocation, onComplete?: Function, onAbort?: Function): void;
  go (n: number): void;
  back (): void;
  forward (): void;
  getMatchedComponents (to?: RawLocation | Route): Component[];
  onReady (cb: Function, errorCb?: Function): void;
  onError (cb: Function): void;
  addRoutes (routes: RouteConfig[]): void;
  resolve (to: RawLocation, current?: Route, append?: boolean): {
    location: Location;
    route: Route;
    href: string;
    // backwards compat
    normalizedTo: Location;
    resolved: Route;
  };

  static install: PluginFunction<never>;
}

type Position = { x: number, y: number };
type PositionResult = Position | { selector: string, offset?: Position } | void;

//构造函数的参数
export interface RouterOptions {
  routes?: RouteConfig[];
  mode?: RouterMode;
  fallback?: boolean;
  base?: string; // base url
  linkActiveClass?: string;
  linkExactActiveClass?: string;
  parseQuery?: (query: string) => Object;
  stringifyQuery?: (query: Object) => string;
  scrollBehavior?: (
    to: Route,
    from: Route,
    savedPosition: Position | void
  ) => PositionResult | Promise<PositionResult>;
}

type RoutePropsFunction = (route: Route) => Object;

export interface PathToRegexpOptions {
  sensitive?: boolean;
  strict?: boolean;
  end?: boolean;
}

// 定义一个路由对象
export interface RouteConfig {
  path: string;
  name?: string;
  component?: Component;
  components?: Dictionary<Component>; // for named views
  redirect?: RedirectOption;
  alias?: string | string[];
  children?: RouteConfig[];
  meta?: any;
  beforeEnter?: NavigationGuard;
  props?: boolean | Object | RoutePropsFunction;
  caseSensitive?: boolean;
  pathToRegexpOptions?: PathToRegexpOptions;
}

// Route records are the copies of the objects in the routes configuration Array
export interface RouteRecord {
  path: string; // 这个是完整的绝对路径
  regex: RegExp;
  components: Dictionary<Component>;
  instances: Dictionary<Vue>;
  name?: string;
  parent?: RouteRecord; // 不包括 children, 但是通过 parent 保持关系
  redirect?: RedirectOption;
  matchAs?: string;
  meta: any;
  beforeEnter?: (
    route: Route,
    redirect: (location: RawLocation) => void,
    next: () => void
  ) => any;
  props: boolean | Object | RoutePropsFunction | Dictionary<boolean | Object | RoutePropsFunction>;
}

export interface Location {
  name?: string;
  path?: string;
  hash?: string;
  query?: Dictionary<string>;
  params?: Dictionary<string>;
  append?: boolean;
  replace?: boolean;
}

export interface Route {
  path: string;
  name?: string;
  hash: string;
  query: Dictionary<string>;
  params: Dictionary<string>;
  fullPath: string;
  matched: RouteRecord[];
  redirectedFrom?: string;
  meta?: any;
}
