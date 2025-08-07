// TypeScript declarations for QUnit
// Avoiding conflicts with Jest and Node.js types

declare namespace QUnit {
  interface Assert {
    ok(state: any, message?: string): void;
    equal(actual: any, expected: any, message?: string): void;
    strictEqual(actual: any, expected: any, message?: string): void;
    deepEqual(actual: any, expected: any, message?: string): void;
    notEqual(actual: any, expected: any, message?: string): void;
    notStrictEqual(actual: any, expected: any, message?: string): void;
    notDeepEqual(actual: any, expected: any, message?: string): void;
    raises(block: () => void, expected?: any, message?: string): void;
    throws(block: () => void, expected?: any, message?: string): void;
    expect(amount: number): void;
    async(): () => void;
    step(message: string): void;
    timeout(duration: number): void;
  }

  interface Config {
    altertitle: boolean;
    autostart: boolean;
    current: any;
    debug: boolean;
    filter: string;
    fixture: string;
    hidepassed: boolean;
    noglobals: boolean;
    notrycatch: boolean;
    scroll: boolean;
    semaphore: number;
    testTimeout: number;
    urlConfig: Array<{
      id: string;
      label: string;
      tooltip?: string;
      value?: string | string[] | { [key: string]: string };
    }>;
  }

  interface TestStatic {
    config: Config;
    assert: Assert;
    
    // Test lifecycle
    module(name: string, lifecycle?: {
      before?: () => void;
      beforeEach?: () => void;
      afterEach?: () => void;
      after?: () => void;
    }): void;
    
    test(name: string, callback: (assert?: Assert) => void): void;
    asyncTest(name: string, callback: (assert?: Assert) => void): void;
    skip(name: string, callback?: (assert?: Assert) => void): void;
    only(name: string, callback: (assert?: Assert) => void): void;
    
    // Lifecycle hooks
    begin(callback: () => void): void;
    done(callback: (details: any) => void): void;
    log(callback: (details: any) => void): void;
    moduleStart(callback: (details: any) => void): void;
    moduleDone(callback: (details: any) => void): void;
    testStart(callback: (details: any) => void): void;
    testDone(callback: (details: any) => void): void;
    
    // Control
    start(): void;
    stop(): void;
    expect(amount: number): void;
    
    // Test suites (for qunit-composite)
    testSuites(suites: string[]): void;
    
    // Utilities
    extend(target: any, ...sources: any[]): any;
    equiv(a: any, b: any): boolean;
    dump: {
      parse(obj: any): string;
      typeOf(obj: any): string;
      separator(): string;
    };
  }
}

// Global QUnit object for browser environments
declare const QUnit: QUnit.TestStatic;

// For environments where QUnit functions are in global scope (only when QUnit is loaded)
declare global {
  // Only declare these if they're not already declared by Jest
  namespace QUnitGlobals {
    function qunitModule(name: string, lifecycle?: any): void;
    function qunitTest(name: string, callback: (assert?: QUnit.Assert) => void): void;
    function asyncTest(name: string, callback: (assert?: QUnit.Assert) => void): void;
    function ok(state: any, message?: string): void;
    function equal(actual: any, expected: any, message?: string): void;
    function strictEqual(actual: any, expected: any, message?: string): void;
    function deepEqual(actual: any, expected: any, message?: string): void;
    function notEqual(actual: any, expected: any, message?: string): void;
    function notStrictEqual(actual: any, expected: any, message?: string): void;
    function notDeepEqual(actual: any, expected: any, message?: string): void;
    function raises(block: () => void, expected?: any, message?: string): void;
    function throws(block: () => void, expected?: any, message?: string): void;
    function qunitExpect(amount: number): void;
    function start(): void;
    function stop(): void;
  }
}

// Node.js module exports
declare module "qunit" {
  export = QUnit;
}

export {}; 