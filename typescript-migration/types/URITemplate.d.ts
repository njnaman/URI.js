// Global type declarations for IntelliJ/IDE recognition
// This file ensures global interfaces are recognized by the IDE

declare global {
  interface URITemplateInstanceInterface {
    expression: string;

    expand(data: URITemplateData | DataInterface, opts?: URITemplateExpandOptions): string;


    parse(): URITemplateInstanceInterface;
  }

  interface URITemplateStaticInterface {
    (this: URITemplateInstanceInterface, expression: string): URITemplateInstanceInterface;

    new(expression: string): URITemplateInstanceInterface;

    expand(expression: URITemplateExpression, data: DataInterface, opts?: URITemplateExpandOptions): string;

    expandNamed(d: URITemplateDataValue, options: URITemplateOperator, explode: boolean, separator: string, length?: number, name?: string): string;

    expandUnnamed(d: URITemplateDataValue, options: URITemplateOperator, explode: boolean, separator: string, length?: number): string;

    noConflict(): URITemplateStaticInterface;

    _cache: Record<string, URITemplateInstanceInterface>;
    EXPRESSION_PATTERN: RegExp;
    VARIABLE_PATTERN: RegExp;
    VARIABLE_NAME_PATTERN: RegExp;
    LITERAL_PATTERN: RegExp;

    // Index signature to allow dynamic access to expand methods
    [key: string]: unknown;
  }
}

// This export is needed to make this file a module
export {};
