// TypeScript version of test_jquery.js
// Tests for jQuery.URI plugin functionality
'use strict';

// Reference the source files to compile them
/// <reference path="../src/URI.ts" />
/// <reference path="../src/jquery.URI.ts" />
/// <reference path="qunit/qunit.d.ts" />

// Global declarations for libraries loaded via script tags
declare var URI: any;
declare var $: any;

QUnit.module('jQuery.URI', {
  setup: function() {
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

    $('<div id="testestest">' + links.join('') + '</div>')
      .appendTo(document.body);
    $('<div>foo</div>')
      .appendTo(document.body);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/nonexistant.js';
    document.getElementById('testestest').appendChild(script);
  },
  teardown: function() {
    const t = $('#testestest');
    t.next().remove();
    t.remove();
  }
});

QUnit.test('.uri()', function(assert) {
  const $links = $('#testestest');
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
  const $links = $('#testestest');

  // find using accessor and "begins with" comparison
  assert.equal($('a:uri(href^=#anc)').length, 1, '$(selector) Anchor Link');
  assert.equal($links.find(':uri(href^=#anc)').length, 1, '.find(selector) Anchor Link');

  // find using accessor and "ends with" comparison
  assert.equal($(':uri(href$=.css)').length, 1, ':uri(href$=.css)');

  // find using accessor and "contains" comparison
  assert.equal($(':uri(href *= /hello/)').length, 1, ':uri(href *= /hello/)');

  // find using accessor and "equals" comparison
  assert.equal($links.find(':uri(protocol=https)').length, 1, ':uri(protocol=https)');
  assert.equal($links.find(':uri(protocol=http)').length, 3, ':uri(protocol=http)');

  // directory match with trailing slash
  assert.equal($links.find(':uri(directory *= /two/)').length, 2, ':uri(directory *= /two/)');

  // find using URI.is()
  assert.equal($links.find(':uri(relative)').length, 5, ':uri(relative)');
  assert.equal($links.find(':uri(is:relative)').length, 5, ':uri(is:relative)');
  assert.equal($links.find(':uri(is: relative)').length, 5, ':uri(is:relative)');

  // find using URI.equal()
  // This syntax breaks Sizzle, probably because it's looking for a nested pseudo ":http"
  //equal($links.find(':uri(equals:http://example.org/hello/foo/../world.html)').length, 1, ':uri(equals:$url$)');
  assert.equal($links.find(':uri(equals:"http://example.org/hello/foo/../world.html")').length, 1, ':uri(equals:$url$)');
  assert.equal($links.find(':uri(equals: "http://example.org/hello/foo/../world.html")').length, 1, ':uri(equals:$url$)');

  // find URNs
  assert.equal($links.find(':uri(urn)').length, 2, ':uri(urn)');

  // .is()
  assert.equal($links.children('script').is(':uri(suffix=js)'), true, '.is(\':uri(suffix=js)\')');
  assert.equal($links.children('form').is(':uri(suffix=php)'), true, '.is(\':uri(suffix=php)\')');

  // .has()
  assert.equal($('div').has(':uri(suffix=js)').length, 1, '.has(\':uri(suffix=js)\')');
});

QUnit.test('.attr("href")', function(assert) {
  const $links = $('#testestest');
  const $first = $links.children().first();
  const first = $first.get(0);
  const uri = $first.uri();
  const href = function(elem: Element) {
    return elem.getAttribute('href');
  };

  // Note: Skipping $.support.hrefNormalized check since it's jQuery-specific
  // and not relevant for TypeScript version

  assert.ok(uri instanceof URI, 'instanceof URI');
  assert.equal(href(first), uri.toString(), 'URI equals href');

  // test feedback to DOM element
  uri.hostname('example.com');
  assert.ok($first.uri() === uri, 'URI persisted');
  assert.equal(href(first), uri.toString(), 'transparent href update');

  // test feedback from DOM element
  $first.attr('href', 'http://example.net/');
  assert.ok($first.uri() === uri, 'URI persisted');
  assert.equal(href(first), uri.toString(), 'transparent href update');
});

QUnit.test('.attr("uri:accessor")', function(assert) {
  const $links = $('#testestest');
  const $first = $links.children().first();
  const uri = $first.uri();
  const href = function(elem: Element) {
    return elem.getAttribute('href');
  };

  // Note: Skipping $.support.hrefNormalized check since it's jQuery-specific
  // and not relevant for TypeScript version

  assert.equal($first.attr('uri:hostname'), 'example.org', 'reading uri:hostname');
  $first.attr('uri:hostname', 'example.com');
  assert.equal($first.attr('uri:hostname'), 'example.com', 'changed uri:hostname');
  assert.equal($first.is(':uri(hostname=example.com)'), true, ':uri() after changed uri:hostname');
  assert.ok($first.uri() === uri, 'URI persisted');
});
