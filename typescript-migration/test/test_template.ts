// TypeScript version of test_template.js
import { URITemplate } from '../src/URITemplate';

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

const levels: Levels = {
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
      'String expansion with multiple variables': {
        'map?{x,y}': 'map?1024,768',
        '{x,hello,y}': '1024,Hello%20World%21,768'
      },
      'Reserved expansion with multiple variables': {
        '{+x,hello,y}': '1024,Hello%20World!,768',
        '{+path,x}/here': '/foo/bar,1024/here'
      },
      'Fragment expansion with multiple variables': {
        'X{#x,hello,y}': 'X#1024,Hello%20World!,768',
        '{#path,x}/here': '#/foo/bar,1024/here'
      },
      'Label expansion, dot-prefixed': {
        'X{.var}': 'X.value',
        'X{.x,y}': 'X.1024.768'
      },
      'Path segments, slash-prefixed': {
        '{/var}': '/value',
        '{/var,x}/here': '/value/1024/here'
      },
      'Path-style parameters, semicolon-prefixed': {
        '{;x,y}': ';x=1024;y=768',
        '{;x,y,empty}': ';x=1024;y=768;empty'
      },
      'Query component, ampersand-separated': {
        '{?x,y}': '?x=1024&y=768',
        '{?x,y,empty}': '?x=1024&y=768&empty='
      },
      'Query continuation, ampersand-separated': {
        '?fixed=yes{&x}': '?fixed=yes&x=1024',
        '{&x,y,empty}': '&x=1024&y=768&empty='
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
    expressions: {
      'String expansion with value modifiers': {
        '{var:3}': 'val',
        '{var:30}': 'value',
        '{list}': 'red,green,blue',
        '{list*}': 'red,green,blue',
        '{keys}': 'semi,%3B,dot,.,comma,%2C',
        '{keys*}': 'semi=%3B,dot=.,comma=%2C'
      },
      'Reserved expansion with value modifiers': {
        '{+path:6}/here': '/foo/b/here',
        '{+list}': 'red,green,blue',
        '{+list*}': 'red,green,blue',
        '{+keys}': 'semi,;,dot,.,comma,,',
        '{+keys*}': 'semi=;,dot=.,comma=,'
      },
      'Fragment expansion with value modifiers': {
        '{#path:6}/here': '#/foo/b/here',
        '{#list}': '#red,green,blue',
        '{#list*}': '#red,green,blue',
        '{#keys}': '#semi,;,dot,.,comma,,',
        '{#keys*}': '#semi=;,dot=.,comma=,'
      },
      'Label expansion, dot-prefixed': {
        'X{.var:3}': 'X.val',
        'X{.list}': 'X.red,green,blue',
        'X{.list*}': 'X.red.green.blue',
        'X{.keys}': 'X.semi,%3B,dot,.,comma,%2C',
        'X{.keys*}': 'X.semi=%3B.dot=..comma=%2C'
      },
      'Path segments, slash-prefixed': {
        '{/var:1,var}': '/v/value',
        '{/list}': '/red,green,blue',
        '{/list*}': '/red/green/blue',
        '{/keys}': '/semi,%3B,dot,.,comma,%2C',
        '{/keys*}': '/semi=%3B/dot=./comma=%2C'
      },
      'Path-style parameters, semicolon-prefixed': {
        '{;hello:5}': ';hello=Hello',
        '{;list}': ';list=red,green,blue',
        '{;list*}': ';list=red;list=green;list=blue',
        '{;keys}': ';keys=semi,%3B,dot,.,comma,%2C',
        '{;keys*}': ';semi=%3B;dot=.;comma=%2C'
      },
      'Query component, ampersand-separated': {
        '{?var:3}': '?var=val',
        '{?list}': '?list=red,green,blue',
        '{?list*}': '?list=red&list=green&list=blue',
        '{?keys}': '?keys=semi,%3B,dot,.,comma,%2C',
        '{?keys*}': '?semi=%3B&dot=.&comma=%2C'
      },
      'Query continuation, ampersand-separated': {
        '{&var:3}': '&var=val',
        '{&list}': '&list=red,green,blue',
        '{&list*}': '&list=red&list=green&list=blue',
        '{&keys}': '&keys=semi,%3B,dot,.,comma,%2C',
        '{&keys*}': '&semi=%3B&dot=.&comma=%2C'
      }
    },
    values: {
      'var': 'value',
      'hello': 'Hello World!',
      'path': '/foo/bar',
      'list': ['red', 'green', 'blue'],
      'keys': {
        'semi': ';',
        'dot': '.',
        'comma': ','
      }
    }
  },
  'Examples from spec': {
    expressions: {
      'Example Template': {
        'http://www.example.com/foo{?query,number}': 'http://www.example.com/foo?query=mycelium&number=100'
      }
    },
    values: {
      'query': 'mycelium',
      'number': 100
    }
  },
  'Extended tests': {
    expressions: {
      'Additional tests': {
        'http://www.example.com/foo{?query,number}': 'http://www.example.com/foo?query=mycelium&number=100'
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

describe('URITemplate', () => {
  // Test each level
  Object.keys(levels).forEach((levelName) => {
    const data = levels[levelName];
    
    test(levelName, () => {
      let combinedExpression = '';
      let combinedExpansion = '';
      let template: URITemplate;
      let expansion: string;

      Object.keys(data.expressions).forEach((type) => {
        Object.keys(data.expressions[type]).forEach((expression) => {
          combinedExpression += '/' + expression;
          combinedExpansion += '/' + data.expressions[type][expression];

          template = new URITemplate(expression);
          expansion = template.expand(data.values);
          expect(expansion).toBe(data.expressions[type][expression]);
        });
      });

      template = new URITemplate(combinedExpression);
      expansion = template.expand(data.values);
      expect(expansion).toBe(combinedExpansion);
    });
  });

  test('Data Callbacks', () => {
    const template = new URITemplate('{var}');
    const global = (key: string) => {
      const data: { [key: string]: string } = {'var': 'hello world.html'};
      return data[key];
    };
    const expansion = template.expand(global);
    expect(expansion).toBe('hello%20world.html');
  });

  test('Strict callbacks', () => {
    const template = new URITemplate('{var}{undef}');
    const getValues = (key: string) => {
      const data: { [key: string]: string | null } = {'var': 'hello'};
      return data[key] || null;
    };
    const expansion = template.expand(getValues);
    expect(expansion).toBe('hello');
  });

  test('Periods in varnames', () => {
    const literal = 'a-b_c.d~e%20f';
    const template = new URITemplate('{hello.world.var}');
    const data = {'hello.world.var': literal};
    const expansion = template.expand(data);
    expect(expansion).toBe(literal);
  });

  test('Invalid literals', () => {
    expect(() => {
      new URITemplate('invalid.char}acter').parse();
    }).toThrow();
  });

  test('Strict mode', () => {
    expect(() => {
      new URITemplate("/{foo}/bar").expand({ foobar: 123 }, { strict: true });
    }).toThrow();
  });
}); 