// TypeScript version of test_template.js

// Reference the source files to compile them
/// <reference path="../src/URITemplate.ts" />

declare var URITemplate: any;

// FIXME: v2.0.0 renamce non-camelCase properties to uppercase

// Define types for test data structure
interface ExpressionData {
  [expression: string]: string;
}

interface ExpressionsData {
  [type: string]: ExpressionData;
}

interface TestValues {
  [key: string]: any;
}

interface LevelData {
  expressions: ExpressionsData;
  values: TestValues;
}

interface Levels {
  [levelName: string]: LevelData;
}

(function () {
  'use strict';

  var levels: Levels = {
    // http://tools.ietf.org/html/rfc6570#section-1.2
    'Level 1': {
      expressions: {
        'Simple string expansion': {
          '{var}': 'value',
          '{hello}': 'Hello%20World%21'
        }
      },
      values: {
        'var': 'value',
        'hello': 'Hello World!'
      }
    },
    'Level 2': {
      expressions: {
        'Reserved string expansion': {
          '{+var}': 'value',
          '{+hello}': 'Hello%20World!',
          '{+path}/here': '/foo/bar/here',
          'here?ref={+path}': 'here?ref=/foo/bar'
        },
        'Fragment expansion, crosshatch-prefixed': {
          'X{#var}': 'X#value',
          'X{#hello}': 'X#Hello%20World!'
        }
      },
      values: {
        'var': 'value',
        'hello': 'Hello World!',
        'path': '/foo/bar'
      }
    },
    'Level 3': {
      expressions: {
        'String expansion with multiple variables' : {
          'map?{x,y}' : 'map?1024,768',
          '{x,hello,y}' : '1024,Hello%20World%21,768'
        },
        'Reserved expansion with multiple variables' : {
          '{+x,hello,y}' : '1024,Hello%20World!,768',
          '{+path,x}/here' : '/foo/bar,1024/here'
        },
        'Fragment expansion with multiple variables' : {
          '{#x,hello,y}' : '#1024,Hello%20World!,768',
          '{#path,x}/here' : '#/foo/bar,1024/here'
        },
        'Label expansion, dot-prefixed' : {
          'X{.var}' : 'X.value',
          'X{.x,y}' : 'X.1024.768'
        },
        'Path segments, slash-prefixed' : {
          '{/var}' : '/value',
          '{/var,x}/here' : '/value/1024/here'
        },
        'Path-style parameters, semicolon-prefixed' : {
          '{;x,y}' : ';x=1024;y=768',
          '{;x,y,empty}' : ';x=1024;y=768;empty'
        },
        'Form-style query, ampersand-separated' : {
          '{?x,y}' : '?x=1024&y=768',
          '{?x,y,empty}' : '?x=1024&y=768&empty='
        },
        'Form-style query continuation' : {
          '?fixed=yes{&x}' : '?fixed=yes&x=1024',
          '{&x,y,empty}' : '&x=1024&y=768&empty='
        }
      },
      values: {
        'var': 'value',
        'hello': 'Hello World!',
        'path': '/foo/bar',
        'x': '1024',
        'y': '768',
        'empty': ''
      }
    },
    'Level 4': {
      expressions : {
        'String expansion with value modifiers' : {
          '{var:3}' : 'val',
          '{var:30}' : 'value',
          '{list}' : 'red,green,blue',
          '{list*}' : 'red,green,blue',
          '{keys}' : 'semi,%3B,dot,.,comma,%2C',
          '{keys*}' : 'semi=%3B,dot=.,comma=%2C'
        },
        'Reserved expansion with value modifiers' : {
          '{+path:6}/here' : '/foo/b/here',
          '{+list}' : 'red,green,blue',
          '{+list*}' : 'red,green,blue',
          '{+keys}' : 'semi,;,dot,.,comma,,',
          '{+keys*}' : 'semi=;,dot=.,comma=,'
        },
        'Fragment expansion with value modifiers' : {
          '{#path:6}/here' : '#/foo/b/here',
          '{#list}' : '#red,green,blue',
          '{#list*}' : '#red,green,blue',
          '{#keys}' : '#semi,;,dot,.,comma,,',
          '{#keys*}' : '#semi=;,dot=.,comma=,'
        },
        'Label expansion, dot-prefixed' : {
          'X{.var:3}' : 'X.val',
          'X{.list}' : 'X.red,green,blue',
          'X{.list*}' : 'X.red.green.blue',
          'X{.keys}' : 'X.semi,%3B,dot,.,comma,%2C',
          'X{.keys*}' : 'X.semi=%3B.dot=..comma=%2C'
        },
        'Path segments, slash-prefixed' : {
          '{/var:1,var}' : '/v/value',
          '{/list}' : '/red,green,blue',
          '{/list*}' : '/red/green/blue',
          '{/list*,path:4}' : '/red/green/blue/%2Ffoo',
          '{/keys}' : '/semi,%3B,dot,.,comma,%2C',
          '{/keys*}' : '/semi=%3B/dot=./comma=%2C'
        },
        'Path-style parameters, semicolon-prefixed' : {
          '{;hello:5}' : ';hello=Hello',
          '{;list}' : ';list=red,green,blue',
          '{;list*}' : ';list=red;list=green;list=blue',
          '{;keys}' : ';keys=semi,%3B,dot,.,comma,%2C',
          '{;keys*}' : ';semi=%3B;dot=.;comma=%2C'
        },

        'Form-style query, ampersand-separated' : {
          '{?var:3}' : '?var=val',
          '{?list}' : '?list=red,green,blue',
          '{?list*}' : '?list=red&list=green&list=blue',
          '{?keys}' : '?keys=semi,%3B,dot,.,comma,%2C',
          '{?keys*}' : '?semi=%3B&dot=.&comma=%2C'
        },
        'Form-style query continuation' : {
          '{&var:3}' : '&var=val',
          '{&list}' : '&list=red,green,blue',
          '{&list*}' : '&list=red&list=green&list=blue',
          '{&keys}' : '&keys=semi,%3B,dot,.,comma,%2C',
          '{&keys*}' : '&semi=%3B&dot=.&comma=%2C'
        }
      },
      values : {
        'var' : 'value',
        'hello' : 'Hello World!',
        'path' : '/foo/bar',
        'list' : ['red', 'green', 'blue'],
        'keys' : {
          'semi' : ';',
          'dot' : '.',
          'comma' : ','
        }
      }
    },
    'Expression Expansion': {
      expressions: {
        'Variable Expansion': {
          '{count}': 'one,two,three',
          '{count*}': 'one,two,three',
          '{/count}': '/one,two,three',
          '{/count*}': '/one/two/three',
          '{;count}': ';count=one,two,three',
          '{;count*}': ';count=one;count=two;count=three',
          '{?count}': '?count=one,two,three',
          '{?count*}': '?count=one&count=two&count=three',
          '{&count*}': '&count=one&count=two&count=three'
        },
        'Simple String Expansion': {
          '{var}': 'value',
          '{hello}': 'Hello%20World%21',
          '{half}': '50%25',
          'O{empty}X': 'OX',
          'O{undef}X': 'OX',
          '{x,y}': '1024,768',
          '{x,hello,y}': '1024,Hello%20World%21,768',
          '?{x,empty}': '?1024,',
          '?{x,undef}': '?1024',
          '?{undef,y}': '?768',
          '{var:3}': 'val',
          '{var:30}': 'value',
          '{list}': 'red,green,blue',
          '{list*}': 'red,green,blue',
          '{keys}': 'semi,%3B,dot,.,comma,%2C',
          '{keys*}': 'semi=%3B,dot=.,comma=%2C'
        },
        'Reserved Expansion': {
          '{+var}': 'value',
          '{+hello}': 'Hello%20World!',
          '{+half}': '50%25',
          '{base}index': 'http%3A%2F%2Fexample.com%2Fhome%2Findex',
          '{+base}index': 'http://example.com/home/index',
          'O{+empty}X': 'OX',
          'O{+undef}X': 'OX',
          '{+path}/here': '/foo/bar/here',
          'here?ref={+path}': 'here?ref=/foo/bar',
          'up{+path}{var}/here': 'up/foo/barvalue/here',
          '{+x,hello,y}': '1024,Hello%20World!,768',
          '{+path,x}/here': '/foo/bar,1024/here',
          '{+path:6}/here': '/foo/b/here',
          '{+list}': 'red,green,blue',
          '{+list*}': 'red,green,blue',
          '{+keys}': 'semi,;,dot,.,comma,,',
          '{+keys*}': 'semi=;,dot=.,comma=,'
        },
        'Fragment Expansion': {
          '{#var}': '#value',
          '{#hello}': '#Hello%20World!',
          '{#half}': '#50%25',
          'foo{#empty}': 'foo#',
          'foo{#undef}': 'foo',
          '{#x,hello,y}': '#1024,Hello%20World!,768',
          '{#path,x}/here': '#/foo/bar,1024/here',
          '{#path:6}/here': '#/foo/b/here',
          '{#list}': '#red,green,blue',
          '{#list*}': '#red,green,blue',
          '{#keys}': '#semi,;,dot,.,comma,,',
          '{#keys*}': '#semi=;,dot=.,comma=,'
        },
        'Label Expansion with Dot-Prefix': {
          '{.who}': '.fred',
          '{.who,who}': '.fred.fred',
          '{.half,who}': '.50%25.fred',
          'www{.dom*}': 'www.example.com',
          'X{.var}': 'X.value',
          'X{.empty}': 'X.',
          'X{.undef}': 'X',
          'X{.var:3}': 'X.val',
          'X{.list}': 'X.red,green,blue',
          'X{.list*}': 'X.red.green.blue',
          'X{.keys}': 'X.semi,%3B,dot,.,comma,%2C',
          'X{.keys*}': 'X.semi=%3B.dot=..comma=%2C',
          'X{.empty_keys}': 'X',
          'X{.empty_keys*}': 'X'
        },
        'Path Segment Expansion': {
          '{/who}': '/fred',
          '{/who,who}': '/fred/fred',
          '{/half,who}': '/50%25/fred',
          '{/who,dub}': '/fred/me%2Ftoo',
          '{/var}': '/value',
          '{/var,empty}': '/value/',
          '{/var,undef}': '/value',
          '{/var,x}/here': '/value/1024/here',
          '{/var:1,var}': '/v/value',
          '{/list}': '/red,green,blue',
          '{/list*}': '/red/green/blue',
          '{/list*,path:4}': '/red/green/blue/%2Ffoo',
          '{/keys}': '/semi,%3B,dot,.,comma,%2C',
          '{/keys*}': '/semi=%3B/dot=./comma=%2C'
        },
        'Path-Style Parameter Expansion': {
          '{;who}': ';who=fred',
          '{;half}': ';half=50%25',
          '{;empty}': ';empty',
          '{;v,empty,who}': ';v=6;empty;who=fred',
          '{;v,bar,who}': ';v=6;who=fred',
          '{;x,y}': ';x=1024;y=768',
          '{;x,y,empty}': ';x=1024;y=768;empty',
          '{;x,y,undef}': ';x=1024;y=768',
          '{;hello:5}': ';hello=Hello',
          '{;list}': ';list=red,green,blue',
          '{;list*}': ';list=red;list=green;list=blue',
          '{;keys}': ';keys=semi,%3B,dot,.,comma,%2C',
          '{;keys*}': ';semi=%3B;dot=.;comma=%2C'
        },
        'Form-Style Query Expansion': {
          '{?who}': '?who=fred',
          '{?half}': '?half=50%25',
          '{?x,y}': '?x=1024&y=768',
          '{?x,y,empty}': '?x=1024&y=768&empty=',
          '{?x,y,undef}': '?x=1024&y=768',
          '{?var:3}': '?var=val',
          '{?list}': '?list=red,green,blue',
          '{?list*}': '?list=red&list=green&list=blue',
          '{?keys}': '?keys=semi,%3B,dot,.,comma,%2C',
          '{?keys*}': '?semi=%3B&dot=.&comma=%2C'
        },
        'Form-Style Query Continuation': {
          '{&who}': '&who=fred',
          '{&half}': '&half=50%25',
          '?fixed=yes{&x}': '?fixed=yes&x=1024',
          '{&x,y,empty}': '&x=1024&y=768&empty=',
          '{&x,y,undef}': '&x=1024&y=768',
          '{&var:3}': '&var=val',
          '{&list}': '&list=red,green,blue',
          '{&list*}': '&list=red&list=green&list=blue',
          '{&keys}': '&keys=semi,%3B,dot,.,comma,%2C',
          '{&keys*}': '&semi=%3B&dot=.&comma=%2C'
        }
      },
      values: {
        'count': ['one', 'two', 'three'],
        'dom': ['example', 'com'],
        'dub': 'me/too',
        'hello': 'Hello World!',
        'half': '50%',
        'var': 'value',
        'who': 'fred',
        'base': 'http://example.com/home/',
        'path': '/foo/bar',
        'list': ['red', 'green', 'blue'],
        'keys': {
          'semi': ';',
          'dot': '.',
          'comma': ','
        },
        'v': '6',
        'x': '1024',
        'y': '768',
        'empty': '',
        'empty_keys': [],
        'undef': null
      }
    }
  };

  QUnit.module('URITemplate');

// Test each level
  Object.keys(levels).forEach(function (levelName) {
    var data = levels[levelName];

    QUnit.test(levelName, function (assert) {
      var combinedExpression = '';
      var combinedExpansion = '';
      var template: any;
      var expansion: string;

      for (var type in data.expressions) {
        Object.keys(data.expressions[type]).forEach(function (expression) {
          combinedExpression += '/' + expression;
          combinedExpansion += '/' + data.expressions[type][expression];

          template = new URITemplate(expression);
          expansion = template.expand(data.values);
          assert.equal(expansion, data.expressions[type][expression], type + ': ' + expression);
        });
      }

      template = new URITemplate(combinedExpression);
      expansion = template.expand(data.values);
      assert.equal(expansion, combinedExpansion, type + ': combined');
    });
  });

  QUnit.test('Data Callbacks', function (assert) {
    var template = new URITemplate('{var}');
    var global = function (key: string) {
      var data: { [key: string]: string } = {'var': 'hello world.html'};
      return data[key];
    };
    var local = function () {
      return 'hello world.html';
    };

    assert.equal(template.expand(global), 'hello%20world.html', 'global callback');
    assert.equal(template.expand({'var': local}), 'hello%20world.html', 'local callback');
  });


  QUnit.test('Parse errors', function (assert) {
    assert.throws(function () {
      new URITemplate('AB{var$}IJ').parse();
    }, 'Failing invalid variable name');

    assert.throws(function () {
      new URITemplate('AB{$var}IJ').parse();
    }, 'Failing invalid operator');

    assert.throws(function () {
      new URITemplate('AB{var:3IJ').parse();
    }, 'Failing missing closing }');

    assert.throws(function () {
      new URITemplate('AB{var:3*}IJ').parse();
    }, 'Failing invalid modifier');
  });

  QUnit.test('Expansion errors', function (assert) {
    assert.throws(function () {
      var data = {'composite_var': ['multiple', 'values']};
      new URITemplate('{composite_var:3}').expand(data);
    }, 'Failing prefix modifier after composite variable');
  });

  QUnit.test('noConflict mode', function (assert) {
    var actual_lib = URITemplate; // actual library; after loading, before noConflict()
    var unconflicted = URITemplate.noConflict();

    assert.strictEqual(unconflicted, actual_lib, 'noConflict() returns the URITemplate object');
    assert.strictEqual(URITemplate, (window as any).URITemplate_pre_lib, 'noConflict() restores the `URITemplate` variable');

    // restore for other tests
    (window as any).URITemplate = actual_lib;
  });


  QUnit.test('Periods in varnames', function (assert) {
    var literal = 'replacement';
    var template = new URITemplate('{hello.world.var}');
    var data = {'hello.world.var': literal};
    var expansion = template.expand(data);
    assert.equal(expansion, literal, 'period in varname');
  });


  QUnit.test('Invalid literals', function (assert) {
    assert.throws(function () {
      new URITemplate('invalid.char}acter').parse();
    }, 'Failing invalid literal');
  });


  QUnit.test('Strict mode', function (assert) {
    assert.throws(function () {
      new URITemplate("/{foo}/bar").expand({foobar: 123}, {strict: true});
    }, 'Missing expansion value for variable in strict mode.');
  });

})();
