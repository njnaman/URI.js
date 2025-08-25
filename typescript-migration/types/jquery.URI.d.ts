declare global {
  interface JQueryStatic {
    (selector: string | Element): JQuery;

    each(obj: string[], callback: (index: number, value: string) => void): void;

    attrHooks: {
      [key: string]: {
        get?: (elem: Element) => URIInstanceInterface;
        set?: (elem: Element, value: string | URIInstanceInterface) => string | URIInstanceInterface
      }
    };
    expr: {
      createPseudo?: (fn: (text: string) => (elem: Element) => boolean) => (elem: Element, i?: number, match?: RegExpMatchArray) => boolean;
      [':']: Record<string, (elem: Element, i?: number, match?: RegExpMatchArray) => boolean>;
    };
    fn: Record<string, (uri?: string | URIInstanceInterface) => URIInstanceInterface>;
  }
}
export {};
