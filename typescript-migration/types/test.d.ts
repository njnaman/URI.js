declare global {
  interface QUnitInterface {
    test: (name: string, callback: () => void) => void;
    module: (name: string, testEnvironment?: unknown) => void;
    ok: (state: unknown, message?: string) => void;
    equal: (actual: unknown, expected: unknown, message?: string) => void;
    strictEqual: (actual: unknown, expected: unknown, message?: string) => void;
    deepEqual: (actual: unknown, expected: unknown, message?: string) => void;
    raises: (callback: () => void, expected?: unknown, message?: string) => void;
  }

  // Global variables available in test environment
  const URI: URIStaticInterface;
  const URITemplate: URITemplateStaticInterface;
  const IPv6: IPv6Interface;
  const SecondLevelDomains: SecondLevelDomainsInterface;
  const punycode: PunycodeInterface;
  const QUnit: QUnitInterface;
  const test = QUnit.test;
  const module = QUnit.module;

  // QUnit assertion functions
  const ok = QUnit.ok;
  const equal = QUnit.equal;
  const strictEqual = QUnit.strictEqual;
  const deepEqual = QUnit.deepEqual;
  const raises = QUnit.raises;
}
export {};
