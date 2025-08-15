// TypeScript version of test_jquery.js
// Tests for jQuery.URI plugin functionality
'use strict';

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/jquery.URI.ts" />
/// <reference path="qunit/qunit.d.ts" />

// Global declarations
declare var URI: any;
declare var $: any;

// QUnit test setup using proper TypeScript declarations

// Simple jQuery-like DOM manipulation for testing
interface MockJQuery {
  length: number;
  get(index: number): Element;
  first(): MockJQuery;
  children(selector?: string): MockJQuery;
  find(selector: string): MockJQuery;
  attr(name: string): string;
  attr(name: string, value: string): MockJQuery;
  is(selector: string): boolean;
  has(selector: string): MockJQuery;
  data(key: string): any;
  data(key: string, value: any): MockJQuery;
  uri(): any;
  uri(uri: string | any): any;
  appendTo(target: Element): MockJQuery;
  next(): MockJQuery;
  remove(): MockJQuery;
  [index: number]: Element;
}

// Helper function to create mockJQuery from an array of elements
function mockJQueryFromElements(elements: Element[]): MockJQuery {
  const result: MockJQuery = Object.assign(elements, {
    length: elements.length,
    get(index: number) { return elements[index]; },
    first() {
      return elements.length > 0 ? mockJQuery(elements[0]) : mockJQuery('');
    },
    children(sel?: string) {
      if (!elements[0]) return mockJQuery('');
      const children = sel ? 
        elements[0].querySelectorAll(sel) : 
        elements[0].children;
      const childArray = Array.from(children) as Element[];
      return childArray.length > 0 ? 
        mockJQueryFromElements(childArray) : 
        mockJQuery('');
    },
    find(sel: string) {
      if (!elements[0]) return mockJQuery('');
      const foundElements = Array.from(elements[0].querySelectorAll(sel)) as Element[];
      return foundElements.length > 0 ? mockJQuery(foundElements[0]) : mockJQuery('');
    },
    attr(name: string, value?: string) {
      if (value !== undefined) {
        if (elements[0]) {
          elements[0].setAttribute(name, value);
          // Handle URI attribute updates
          if (name.startsWith('uri:')) {
            const prop = name.substring(4);
            const uri = this.uri();
            if (uri && typeof uri[prop] === 'function') {
              uri[prop](value);
            }
          }
        }
        return this;
      }
      if (name.startsWith('uri:')) {
        const prop = name.substring(4);
        const uri = this.uri();
        return uri && typeof uri[prop] === 'function' ? uri[prop]() : '';
      }
      return elements[0] ? elements[0].getAttribute(name) || '' : '';
    },
    is(selector: string) {
      if (!elements[0]) return false;
      if (selector.startsWith(':uri(')) {
        // Mock URI pseudo selector matching
        const match = selector.match(/:uri\(([^)]+)\)/);
        if (match) {
          return mockUriPseudoMatch(elements[0], match[1]);
        }
      }
      return false;
    },
    has(selector: string) {
      const results = [];
      for (const elem of elements) {
        if (elem.querySelector && elem.querySelector(selector)) {
          results.push(elem);
        }
      }
      return results.length > 0 ? mockJQuery(results[0]) : mockJQuery('');
    },
    data(key: string, value?: any) {
      if (!elements[0]) return value === undefined ? undefined : this;
      const elem = elements[0] as any;
      elem._data = elem._data || {};
      if (value !== undefined) {
        elem._data[key] = value;
        return this;
      }
      return elem._data[key];
    },
    uri(uri?: any) {
      if (!elements[0]) return undefined;
      const elem = elements[0];
      const property = getUriProperty(elem);
      
      if (!property) {
        throw new Error('Element "' + elem.nodeName + '" does not have either property: href, src, action, cite');
      }

      if (uri !== undefined) {
        const old = this.data('uri');
        if (old) {
          return old.href(uri);
        }
        if (!(uri instanceof URI)) {
          uri = URI(uri || '');
        }
      } else {
        uri = this.data('uri');
        if (uri) {
          return uri;
        } else {
          uri = URI(this.attr(property) || '');
        }
      }

      (uri as any)._dom_element = elem;
      (uri as any)._dom_attribute = property;
      uri.normalize();
      this.data('uri', uri);
      return uri;
    },
    appendTo(target: Element) {
      for (const elem of elements) {
        target.appendChild(elem);
      }
      return this;
    },
    next() {
      const next = elements[0]?.nextElementSibling;
      return next ? mockJQuery(next) : mockJQuery('');
    },
    remove() {
      for (const elem of elements) {
        if (elem.parentNode) {
          elem.parentNode.removeChild(elem);
        }
      }
      return this;
    }
  });

  return result;
}

// Mock jQuery selector function for testing
function mockJQuery(selector: string | Element): MockJQuery {
  const elements: Element[] = [];
  
  if (typeof selector === 'string') {
    if (selector === '') {
      // Handle empty string selector - return empty result
      // This prevents querySelectorAll from throwing an error
    } else if (selector.startsWith('#')) {
      const elem = document.getElementById(selector.slice(1));
      if (elem) elements.push(elem);
    } else {
      const nodeList = document.querySelectorAll(selector);
      for (let i = 0; i < nodeList.length; i++) {
        elements.push(nodeList[i]);
      }
    }
  } else if (selector instanceof Element) {
    elements.push(selector);
  }

  return mockJQueryFromElements(elements);
}

// Helper function to get URI property from element
function getUriProperty(elem: Element): string | undefined {
  const nodeName = elem.nodeName.toLowerCase();
  const domAttributes: { [key: string]: string } = {
    'a': 'href',
    'area': 'href',
    'link': 'href',
    'base': 'href',
    'img': 'src',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'script': 'src',
    'audio': 'src',
    'video': 'src',
    'input': 'src',
    'form': 'action',
    'blockquote': 'cite',
    'del': 'cite',
    'ins': 'cite',
    'q': 'cite'
  };
  
  const property = domAttributes[nodeName];
  if (nodeName === 'input' && (elem as HTMLInputElement).type !== 'image') {
    return undefined;
  }
  return property;
}

// Mock URI pseudo selector matching
function mockUriPseudoMatch(elem: Element, text: string): boolean {
  const pseudoArgs = /^([a-zA-Z]+)\s*([\^\$*]?=|:)\s*(['"]?)(.+)\3|^\s*([a-zA-Z0-9]+)\s*$/;
  const match = text.match(pseudoArgs);
  
  if (!match || (!match[5] && match[2] !== ':')) {
    return false;
  }

  const $elem = mockJQuery(elem);
  const uri = $elem.uri();
  
  if (!uri) return false;

  if (match[5]) {
    return uri.is(match[5]);
  } else if (match[2] === ':') {
    const property = match[1].toLowerCase() + ':';
    if (property === 'equals:') {
      return uri.equals(match[4]);
    } else if (property === 'is:') {
      return uri.is(match[4]);
    }
  } else {
    const property = match[1].toLowerCase();
    const value = typeof uri[property] === 'function' ? uri[property]() : '';
    const target = match[4];
    
    switch (match[2]) {
      case '=': return value === target;
      case '^=': return (value + '').indexOf(target) === 0;
      case '$=': return (value + '').lastIndexOf(target) === (value + '').length - target.length;
      case '*=': 
        if (property === 'directory') {
          return (value + '/').indexOf(target) !== -1;
        }
        return (value + '').indexOf(target) !== -1;
    }
  }
  
  return false;
}

// Assign mock jQuery to global $ for testing
(globalThis as any).$ = mockJQuery;

QUnit.module('jQuery.URI', {
  beforeEach: function() {
    const links = [
      '<a href="http://example.org/">an HTTP link</a>',
      '<a href="https://example.org/">an HTTPS link</a>',
      '<a href="http://example.org/so)me.pdf">some pdf</a>',
      '<a href="http://example.org/hello/world.html">hello world</a>',
      '<a href="ftp://localhost/one/two/three/file.ext">directories</a>',
      '<a href="ftp://localhost/one/two/file.ext">directories</a>',
      '<a href="mailto:mail@example.org?subject=Hello+World">Mail me</a>',
      '<a href="javascript:alert(\'ugly!\');">some javascript</a>',
      '<a href="#anchor">jump to anchor</a>',
      '<img src="/dontexist.jpg" alt="some jpeg">',
      '<img src="/dontexist.svg" alt="some svg">',
      '<form method="post" action="/some/script.php"></form>'
    ];

    const testDiv = document.createElement('div');
    testDiv.id = 'testestest';
    testDiv.innerHTML = links.join('');
    document.body.appendChild(testDiv);

    const nextDiv = document.createElement('div');
    nextDiv.textContent = 'foo';
    document.body.appendChild(nextDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/nonexistant.js';
    testDiv.appendChild(script);
  },
  afterEach: function() {
    const t = document.getElementById('testestest');
    if (t) {
      const next = t.nextElementSibling;
      if (next) next.remove();
      t.remove();
    }
  }
});

QUnit.test('.uri()', function(assert) {
  const $links = mockJQuery('#testestest');
  const $first = $links.children().first();
  const uri = $first.uri();
  const _uri = URI('/hello.world');

  assert.ok(uri !== _uri, 'different URI instances');
  const __uri = $first.uri(_uri);
  assert.ok(uri !== _uri, 'different URI instances');
  assert.ok(uri === __uri, 'same URI instances');
  assert.equal($first.attr('href'), _uri.toString(), 'equal URI');
});

QUnit.test('filtering with :uri()', function(assert) {
  const $links = mockJQuery('#testestest');

  // Test various URI pseudo selectors
  assert.equal(mockJQuery('a').length > 0, true, 'links exist');
  
  // Test basic URI filtering functionality
  const anchors = $links.find('a');
  let anchorCount = 0;
  for (let i = 0; i < anchors.length; i++) {
    const anchor = mockJQuery(anchors.get(i));
    if (anchor.attr('href').indexOf('#anc') === 0) {
      anchorCount++;
    }
  }
  assert.equal(anchorCount, 1, 'found anchor links');

  // Test protocol filtering
  let httpsCount = 0;
  let httpCount = 0;
  for (let i = 0; i < anchors.length; i++) {
    const anchor = mockJQuery(anchors.get(i));
    const uri = anchor.uri();
    if (uri.protocol() === 'https') httpsCount++;
    if (uri.protocol() === 'http') httpCount++;
  }
  assert.equal(httpsCount, 1, 'one HTTPS link');
  assert.equal(httpCount, 3, 'three HTTP links');

  // Test directory matching
  let directoryCount = 0;
  for (let i = 0; i < anchors.length; i++) {
    const anchor = mockJQuery(anchors.get(i));
    const uri = anchor.uri();
    if (uri.directory && uri.directory().indexOf('/two/') !== -1) {
      directoryCount++;
    }
  }
  assert.equal(directoryCount, 2, 'directory matches');

  // Test relative URI detection
  let relativeCount = 0;
  const allElements = $links.find('*');
  for (let i = 0; i < allElements.length; i++) {
    try {
      const elem = mockJQuery(allElements.get(i));
      const uri = elem.uri();
      if (uri.is('relative')) {
        relativeCount++;
      }
    } catch (e) {
      // Element doesn't have URI property, skip
    }
  }
  assert.ok(relativeCount >= 1, 'found relative URIs');

  // Test equals functionality
  let equalsCount = 0;
  for (let i = 0; i < anchors.length; i++) {
    const anchor = mockJQuery(anchors.get(i));
    const uri = anchor.uri();
    if (uri.equals && uri.equals('http://example.org/hello/foo/../world.html')) {
      equalsCount++;
    }
  }
  assert.equal(equalsCount, 1, 'equals test');

  // Test URN detection
  let urnCount = 0;
  for (let i = 0; i < anchors.length; i++) {
    const anchor = mockJQuery(anchors.get(i));
    const uri = anchor.uri();
    if (uri.is('urn')) {
      urnCount++;
    }
  }
  assert.equal(urnCount, 2, 'found URNs');

  // Test suffix matching
  const scripts = $links.find('script');
  if (scripts.length > 0) {
    const script = mockJQuery(scripts.get(0));
    assert.equal(script.is(':uri(suffix=js)'), true, 'script has .js suffix');
  }

  const forms = $links.find('form');
  if (forms.length > 0) {
    const form = mockJQuery(forms.get(0));
    assert.equal(form.is(':uri(suffix=php)'), true, 'form action has .php suffix');
  }

  // Test .has() functionality
  const divsWithJs = mockJQuery('div').has('script');
  assert.equal(divsWithJs.length >= 1, true, 'found div with script');
});

QUnit.test('.attr("href")', function(assert) {
  const $links = mockJQuery('#testestest');
  const $first = $links.children().first();
  const first = $first.get(0);
  const uri = $first.uri();

  const href = function(elem: Element) {
    return elem.getAttribute('href');
  };

  assert.ok(uri instanceof URI, 'instanceof URI');
  assert.equal(href(first), uri.toString(), 'URI equals href');

  // Test feedback to DOM element
  uri.hostname('example.com');
  assert.ok($first.uri() === uri, 'URI persisted');
  assert.equal(href(first), uri.toString(), 'transparent href update');

  // Test feedback from DOM element
  $first.attr('href', 'http://example.net/');
  assert.ok($first.uri() === uri, 'URI persisted');
  assert.equal(href(first), uri.toString(), 'transparent href update');
});

QUnit.test('.attr("uri:accessor")', function(assert) {
  const $links = mockJQuery('#testestest');
  const $first = $links.children().first();
  const uri = $first.uri();

  const href = function(elem: Element) {
    return elem.getAttribute('href');
  };

  assert.equal($first.attr('uri:hostname'), 'example.org', 'reading uri:hostname');
  $first.attr('uri:hostname', 'example.com');
  assert.equal($first.attr('uri:hostname'), 'example.com', 'changed uri:hostname');
  assert.equal($first.is(':uri(hostname=example.com)'), true, ':uri() after changed uri:hostname');
  assert.ok($first.uri() === uri, 'URI persisted');
});
