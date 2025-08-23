declare global {
  interface JQueryStatic {
    (selector: any): JQuery;

    each(obj: any, callback: (index: any, value: any) => void): void;

    attrHooks: { [key: string]: any };
    expr: any;
    fn: any;
  }
}
export {};
