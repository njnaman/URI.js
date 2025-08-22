/*!
 * URI.js - Mutating URLs
 * URI Template Support - http://tools.ietf.org/html/rfc6570
 *
 * Version: 1.19.11
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */
declare const URI: URIInterface;

interface URITemplateOperator {
    prefix: string;
    separator: string;
    named: boolean;
    empty_name_separator: boolean;
    encode: string;
}

interface URITemplateVariable {
    name: string;
    explode: boolean;
    maxlength?: number;
}

interface URITemplateExpression {
    expression: string;
    operator: string;
    variables: URITemplateVariable[];
}

interface URITemplateData {
    [key: string]: any;
}

interface URITemplateExpandOptions {
    strict?: boolean;
}

interface URITemplateDataValue {
    type: number;
    val: Array<[string | undefined, string]>;
    encode: Array<[string | undefined, string]>;
    encodeReserved: Array<[string | undefined, string]>;

    [key: string]: any;
}

interface DataInterface {
    data: URITemplateData;
    cache: { [key: string]: URITemplateDataValue };

    get(key: string): URITemplateDataValue;
}

// FIXME: v2.0.0 renamce non-camelCase properties to uppercase
/*jshint camelcase: false */

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


    _cache: Record<string, URITemplateInstanceInterface>;
    EXPRESSION_PATTERN: RegExp;
    VARIABLE_PATTERN: RegExp;
    VARIABLE_NAME_PATTERN: RegExp;
    LITERAL_PATTERN: RegExp;
}


const URITemplate = function (this: URITemplateInstanceInterface, expression: string): URITemplateInstanceInterface {
    // serve from cache where possible
    if (URITemplate._cache[expression]) {
        return URITemplate._cache[expression];
    }

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URITemplate)) {
        return new (URITemplate as any)(expression);
    }

    this.expression = expression;
    URITemplate._cache[expression] = this;
    return this;
} as URITemplateStaticInterface;


function Data(this: any, data: URITemplateData): void {
    this.data = data;
    this.cache = {};
}

const p = URITemplate.prototype;
// list of operators and their defined options
const operators: { [key: string]: URITemplateOperator } = {
    // Simple string expansion
    '': {
        prefix: '',
        separator: ',',
        named: false,
        empty_name_separator: false,
        encode: 'encode'
    },
    // Reserved character strings
    '+': {
        prefix: '',
        separator: ',',
        named: false,
        empty_name_separator: false,
        encode: 'encodeReserved'
    },
    // Fragment identifiers prefixed by '#'
    '#': {
        prefix: '#',
        separator: ',',
        named: false,
        empty_name_separator: false,
        encode: 'encodeReserved'
    },
    // Name labels or extensions prefixed by '.'
    '.': {
        prefix: '.',
        separator: '.',
        named: false,
        empty_name_separator: false,
        encode: 'encode'
    },
    // Path segments prefixed by '/'
    '/': {
        prefix: '/',
        separator: '/',
        named: false,
        empty_name_separator: false,
        encode: 'encode'
    },
    // Path parameter name or name=value pairs prefixed by ';'
    ';': {
        prefix: ';',
        separator: ';',
        named: true,
        empty_name_separator: false,
        encode: 'encode'
    },
    // Query component beginning with '?' and consisting
    // of name=value pairs separated by '&'; an
    '?': {
        prefix: '?',
        separator: '&',
        named: true,
        empty_name_separator: true,
        encode: 'encode'
    },
    // Continuation of query-style &name=value pairs
    // within a literal query component.
    '&': {
        prefix: '&',
        separator: '&',
        named: true,
        empty_name_separator: true,
        encode: 'encode'
    }

    // The operator characters equals ("="), comma (","), exclamation ("!"),
    // at sign ("@"), and pipe ("|") are reserved for future extensions.
};

// storage for already parsed templates
URITemplate._cache = {};
// pattern to identify expressions [operator, variable-list] in template
URITemplate.EXPRESSION_PATTERN = /\{([^a-zA-Z0-9%_]?)([^\}]+)(\}|$)/g;
// pattern to identify variables [name, explode, maxlength] in variable-list
URITemplate.VARIABLE_PATTERN = /^([^*:.](?:\.?[^*:.])*)((\*)|:(\d+))?$/;
// pattern to verify variable name integrity
URITemplate.VARIABLE_NAME_PATTERN = /[^a-zA-Z0-9%_.]/;
// pattern to verify literal integrity
URITemplate.LITERAL_PATTERN = /[<>{}"`^| \\]/;

// expand parsed expression (expression, not template!)
URITemplate.expand = function (expression: URITemplateExpression, data: DataInterface, opts?: URITemplateExpandOptions): string {
    // container for defined options for the given operator
    const options = operators[expression.operator];
    // expansion type (include keys or not)
    const type = options.named ? 'Named' : 'Unnamed';
    // list of variables within the expression
    const variables = expression.variables;
    // result buffer for evaluating the expression
    const buffer: string[] = [];
    let d: URITemplateDataValue, variable: URITemplateVariable, i: number;

    for (i = 0; (variable = variables[i]); i++) {
        // fetch simplified data source
        d = data.get(variable.name);
        if (d.type === 0 && opts && opts.strict) {
            throw new Error('Missing expansion value for variable "' + variable.name + '"');
        }
        if (!d.val.length) {
            if (d.type) {
                // empty variables (empty string)
                // still lead to a separator being appended!
                buffer.push('');
            }
            // no data, no action
            continue;
        }

        if (d.type > 1 && variable.maxlength) {
            // composite variable cannot specify maxlength
            throw new Error('Invalid expression: Prefix modifier not applicable to variable "' + variable.name + '"');
        }

        // expand the given variable
        buffer.push((URITemplate as any)['expand' + type](
            d,
            options,
            variable.explode,
            variable.explode && options.separator || ',',
            variable.maxlength,
            variable.name
        ));
    }

    if (buffer.length) {
        return options.prefix + buffer.join(options.separator);
    } else {
        // prefix is not prepended for empty expressions
        return '';
    }
};

// expand a named variable
URITemplate.expandNamed = function (d: URITemplateDataValue, options: URITemplateOperator, explode: boolean, separator: string, length?: number, name?: string): string {
    // variable result buffer
    let result = '';
    // peformance crap
    const encode = options.encode;
    const empty_name_separator = options.empty_name_separator;
    // flag noting if values are already encoded
    const _encode = !d[encode].length;
    // key for named expansion
    let _name = d.type === 2 ? '' : (URI as any)[encode](name);
    let _value: string, i: number, l: number;

    // for each found value
    for (i = 0, l = d.val.length; i < l; i++) {
        if (length) {
            // maxlength must be determined before encoding can happen
            _value = (URI as any)[encode](d.val[i][1].substring(0, length));
            if (d.type === 2) {
                // apply maxlength to keys of objects as well
                _name = (URI as any)[encode](d.val[i][0]!.substring(0, length));
            }
        } else if (_encode) {
            // encode value
            _value = (URI as any)[encode](d.val[i][1]);
            if (d.type === 2) {
                // encode name and cache encoded value
                _name = (URI as any)[encode](d.val[i][0]!);
                (d as any)[encode].push([_name, _value]);
            } else {
                // cache encoded value
                (d as any)[encode].push([undefined, _value]);
            }
        } else {
            // values are already encoded and can be pulled from cache
            _value = (d as any)[encode][i][1];
            if (d.type === 2) {
                _name = (d as any)[encode][i][0]!;
            }
        }

        if (result) {
            // unless we're the first value, prepend the separator
            result += separator;
        }

        if (!explode) {
            if (!i) {
                // first element, so prepend variable name
                result += (URI as any)[encode](name!) + (empty_name_separator || _value ? '=' : '');
            }

            if (d.type === 2) {
                // without explode-modifier, keys of objects are returned comma-separated
                result += _name + ',';
            }

            result += _value;
        } else {
            // only add the = if it is either default (?&) or there actually is a value (;)
            result += _name + (empty_name_separator || _value ? '=' : '') + _value;
        }
    }

    return result;
};

// expand an unnamed variable
URITemplate.expandUnnamed = function (d: URITemplateDataValue, options: URITemplateOperator, explode: boolean, separator: string, length?: number): string {
    // variable result buffer
    let result = '';
    // performance crap
    const encode = options.encode;
    const empty_name_separator = options.empty_name_separator;
    // flag noting if values are already encoded
    const _encode = !d[encode].length;
    let _name: string, _value: string, i: number, l: number;

    // for each found value
    for (i = 0, l = d.val.length; i < l; i++) {
        if (length) {
            // maxlength must be determined before encoding can happen
            _value = (URI as any)[encode](d.val[i][1].substring(0, length));
        } else if (_encode) {
            // encode and cache value
            _value = (URI as any)[encode](d.val[i][1]);
            (d as any)[encode].push([
                d.type === 2 ? (URI as any)[encode](d.val[i][0]!) : undefined,
                _value
            ]);
        } else {
            // value already encoded, pull from cache
            _value = (d as any)[encode][i][1];
        }

        if (result) {
            // unless we're the first value, prepend the separator
            result += separator;
        }

        if (d.type === 2) {
            if (length) {
                // maxlength also applies to keys of objects
                _name = (URI as any)[encode](d.val[i][0]!.substring(0, length));
            } else {
                // at this point the name must already be encoded
                _name = (d as any)[encode][i][0]!;
            }

            result += _name;
            if (explode) {
                // explode-modifier separates name and value by "="
                result += (empty_name_separator || _value ? '=' : '');
            } else {
                // no explode-modifier separates name and value by ","
                result += ',';
            }
        }

        result += _value;
    }

    return result;
};

// expand template through given data map
p.expand = function (data: URITemplateData | DataInterface, opts?: URITemplateExpandOptions): string {
    let result = '';

    if (!this.parts || !this.parts.length) {
        // lazilyy parse the template
        this.parse();
    }

    if (!(data instanceof Data)) {
        // make given data available through the
        // optimized data handling thingie
        data = new (Data as any)(data as URITemplateData);
    }

    for (let i = 0, l = this.parts.length; i < l; i++) {
        /*jshint laxbreak: true */
        result += typeof this.parts[i] === 'string'
            // literal string
            ? this.parts[i]
            // expression
            : URITemplate.expand(this.parts[i] as URITemplateExpression, data as DataInterface, opts);
        /*jshint laxbreak: false */
    }

    return result;
};

// parse template into action tokens
p.parse = function (): URITemplateInstanceInterface {
    // performance crap
    const expression = this.expression;
    const ePattern = URITemplate.EXPRESSION_PATTERN;
    const vPattern = URITemplate.VARIABLE_PATTERN;
    const nPattern = URITemplate.VARIABLE_NAME_PATTERN;
    const lPattern = URITemplate.LITERAL_PATTERN;
    // token result buffer
    const parts: Array<string | URITemplateExpression> = [];
    // position within source template
    let pos = 0;
    let variables: URITemplateVariable[], eMatch: RegExpExecArray | null, vMatch: RegExpExecArray | null;

    const checkLiteral = function (literal: string): string {
        if (literal.match(lPattern)) {
            throw new Error('Invalid Literal "' + literal + '"');
        }
        return literal;
    };

    // RegExp is shared accross all templates,
    // which requires a manual reset
    ePattern.lastIndex = 0;
    // I don't like while(foo = bar()) loops,
    // to make things simpler I go while(true) and break when required
    while (true) {
        eMatch = ePattern.exec(expression);
        if (eMatch === null) {
            // push trailing literal
            parts.push(checkLiteral(expression.substring(pos)));
            break;
        } else {
            // push leading literal
            parts.push(checkLiteral(expression.substring(pos, eMatch.index)));
            pos = eMatch.index + eMatch[0].length;
        }

        if (!operators[eMatch[1]]) {
            throw new Error('Unknown Operator "' + eMatch[1] + '" in "' + eMatch[0] + '"');
        } else if (!eMatch[3]) {
            throw new Error('Unclosed Expression "' + eMatch[0] + '"');
        }

        // parse variable-list
        const variableStrings = eMatch[2].split(',');
        variables = [];
        for (let i = 0, l = variableStrings.length; i < l; i++) {
            vMatch = variableStrings[i].match(vPattern) as RegExpExecArray | null;
            if (vMatch === null) {
                throw new Error('Invalid Variable "' + variableStrings[i] + '" in "' + eMatch[0] + '"');
            } else if (vMatch[1].match(nPattern)) {
                throw new Error('Invalid Variable Name "' + vMatch[1] + '" in "' + eMatch[0] + '"');
            }

            variables[i] = {
                name: vMatch[1],
                explode: !!vMatch[3],
                maxlength: vMatch[4] ? parseInt(vMatch[4], 10) : undefined
            };
        }

        if (!variables.length) {
            throw new Error('Expression Missing Variable(s) "' + eMatch[0] + '"');
        }

        parts.push({
            expression: eMatch[0],
            operator: eMatch[1],
            variables: variables
        });
    }

    if (!parts.length) {
        // template doesn't contain any expressions
        // so it is a simple literal string
        // this probably should fire a warning or something?
        parts.push(checkLiteral(expression));
    }

    this.parts = parts;
    return this;
};

// simplify data structures
Data.prototype.get = function (key: string): URITemplateDataValue {
    // performance crap
    const data = this.data;
    // cache for processed data-point
    const d: URITemplateDataValue = {
        // type of data 0: undefined/null, 1: string, 2: object, 3: array
        type: 0,
        // original values (except undefined/null)
        val: [],
        // cache for encoded values (only for non-maxlength expansion)
        encode: [],
        encodeReserved: []
    };
    let i: number, l: number, value: any;

    if (this.cache[key] !== undefined) {
        // we've already processed this key
        return this.cache[key];
    }

    this.cache[key] = d;

    if (String(Object.prototype.toString.call(data)) === '[object Function]') {
        // data itself is a callback (global callback)
        value = data(key);
    } else if (String(Object.prototype.toString.call(data[key])) === '[object Function]') {
        // data is a map of callbacks (local callback)
        value = data[key](key);
    } else {
        // data is a map of data
        value = data[key];
    }

    // generalize input into [ [name1, value1], [name2, value2], … ]
    // so expansion has to deal with a single data structure only
    if (value === undefined || value === null) {
        // undefined and null values are to be ignored completely
        return d;
    } else if (String(Object.prototype.toString.call(value)) === '[object Array]') {
        for (i = 0, l = value.length; i < l; i++) {
            if (value[i] !== undefined && value[i] !== null) {
                // arrays don't have names
                d.val.push([undefined, String(value[i])]);
            }
        }

        if (d.val.length) {
            // only treat non-empty arrays as arrays
            d.type = 3; // array
        }
    } else if (String(Object.prototype.toString.call(value)) === '[object Object]') {
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key) && value[key] !== undefined && value[key] !== null) {
                // objects have keys, remember them for named expansion
                d.val.push([key, String(value[key])]);
            }
        }

        if (d.val.length) {
            // only treat non-empty objects as objects
            d.type = 2; // object
        }
    } else {
        d.type = 1; // primitive string (could've been string, number, boolean and objects with a toString())
        // arrays don't have names
        d.val.push([undefined, String(value)]);
    }

    return d;
};

// hook into URI for fluid access
(URI as any).expand = function (expression: string, data: URITemplateData): any {
    const template = new (URITemplate as any)(expression);
    const expansion = template.expand(data);

    return new (URI as any)(expansion);
};

export default URITemplate;
