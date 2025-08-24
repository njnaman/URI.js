/*!
 * URI.js - Mutating URLs
 * jQuery Plugin
 *
 * Version: 1.19.11
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/jquery-uri-plugin.html
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */


interface CompareFunction {
  (value: string, target: string, property?: string): boolean;
}

interface URICompareFunctions {
  [key: string]: CompareFunction | ((uri: URIInstanceInterface, target: string) => boolean);
}

declare let $: JQueryStatic;
declare let URI: URIStaticInterface;

const comparable: { [key: string]: boolean } = {};
const compare: URICompareFunctions = {
  // equals
  '=': function (value: string, target: string): boolean {
    return value === target;
  },
  // ~= translates to value.match((?:^|\s)target(?:\s|$)) which is useless for URIs
  // |= translates to value.match((?:\b)target(?:-|\s|$)) which is useless for URIs
  // begins with
  '^=': function (value: string, target: string): boolean {
    return !!(value + '').match(new RegExp('^' + escapeRegEx(target), 'i'));
  },
  // ends with
  '$=': function (value: string, target: string): boolean {
    return !!(value + '').match(new RegExp(escapeRegEx(target) + '$', 'i'));
  },
  // contains
  '*=': function (value: string, target: string, property?: string): boolean {
    if (property === 'directory') {
      // add trailing slash so /dir/ will match the deep-end as well
      value += '/';
    }

    return !!(value + '').match(new RegExp(escapeRegEx(target), 'i'));
  },
  'equals:': function (uri: URIInstanceInterface, target: string): boolean {
    return uri.equals(target);
  },
  'is:': function (uri: URIInstanceInterface, target: string): boolean {
    return uri.is(target) ?? false;
  }
};

function escapeRegEx(string: string): string {
  // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
  return string.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}

function getUriProperty(elem: Element): string | undefined {
  const nodeName = elem.nodeName.toLowerCase();
  const property = URI.domAttributes[nodeName];
  if (nodeName === 'input' && (elem as HTMLInputElement).type !== 'image') {
    // compensate ambiguous <input> that is not an image
    return undefined;
  }

  // NOTE: as we use a static mapping from element to attribute,
  // the HTML5 attribute issue should not come up again
  // https://github.com/medialize/URI.js/issues/69
  return property;
}

function generateAccessor(property: string): {
  get: (elem: Element) => URIInstanceInterface;
  set: (elem: Element, value: string | URIInstanceInterface) => string | URIInstanceInterface
} {
  return {
    get: function (elem: Element): URIInstanceInterface {
      return $(elem).uri()[property]();
    },
    set: function (elem: Element, value: string | URIInstanceInterface): string | URIInstanceInterface {
      $(elem).uri()[property](value);
      return value;
    }
  };
}

// populate lookup table and register $.attr('uri:accessor') handlers
$.each('origin authority directory domain filename fragment hash host hostname href password path pathname port protocol query resource scheme search subdomain suffix tld username'.split(' '), function (k: number, v: string) {
  comparable[v] = true;
  $.attrHooks['uri:' + v] = generateAccessor(v);
});

// pipe $.attr('src') and $.attr('href') through URI.js
const _attrHooks = {
  get: function (elem: Element): URIInstanceInterface {
    return $(elem).uri();
  },
  set: function (elem: Element, value: string | URIInstanceInterface): string {
    return $(elem).uri().href(value).toString();
  }
};
$.each(['src', 'href', 'action', 'uri', 'cite'], function (k: number, v: string) {
  $.attrHooks[v] = {
    set: _attrHooks.set
  };
});
$.attrHooks.uri.get = _attrHooks.get;

// general URI accessor
$.fn.uri = function (uri?: string | URIInstanceInterface): URIInstanceInterface {
  const $this = this.first();
  const elem = $this.get(0);
  const property = getUriProperty(elem);

  if (!property) {
    throw new Error('Element "' + elem.nodeName + '" does not have either property: href, src, action, cite');
  }

  let uriInstance: URIInstanceInterface;

  if (uri !== undefined) {
    const old = $this.data('uri');
    if (old) {
      return old.href(uri);
    }

    if (!(uri instanceof URI)) {
      uriInstance = URI(uri || '');
    } else {
      uriInstance = uri;
    }
  } else {
    uriInstance = $this.data('uri');
    if (uriInstance) {
      return uriInstance;
    } else {
      uriInstance = URI($this.attr(property) || '');
    }
  }

  uriInstance._dom_element = elem;
  uriInstance._dom_attribute = property;
  uriInstance.normalize();
  $this.data('uri', uriInstance);
  return uriInstance;
};

// overwrite URI.build() to update associated DOM element if necessary
URI.prototype.build = function (deferBuild?: boolean): URIInstanceInterface {
  if (this._dom_element) {
    // cannot defer building when hooked into a DOM element
    this._string = URI.build(this._parts);
    this._deferred_build = false;
    this._dom_element.setAttribute(this._dom_attribute, this._string);
    this._dom_element[this._dom_attribute] = this._string;
  } else if (deferBuild === true) {
    this._deferred_build = true;
  } else if (deferBuild === undefined || this._deferred_build) {
    this._string = URI.build(this._parts);
    this._deferred_build = false;
  }

  return this;
};

// add :uri() pseudo class selector to sizzle
let uriSizzle: ((elem: Element, i?: number, match?: RegExpMatchArray) => boolean) | ((text: string) => (elem: Element) => boolean);
const pseudoArgs = /^([a-zA-Z]+)\s*([\^$*]?=|:)\s*(['"]?)(.+)\3|^\s*([a-zA-Z0-9]+)\s*$/;

function uriPseudo(elem: Element, text: string): boolean {
  let property: string;

  // skip anything without src|href|action and bad :uri() syntax
  if (!getUriProperty(elem) || !text) {
    return false;
  }

  const match = text.match(pseudoArgs);

  if (!match || (!match[5] && match[2] !== ':' && !compare[match[2]])) {
    // abort because the given selector cannot be executed
    // filers seem to fail silently
    return false;
  }

  const uri = $(elem).uri();

  if (match[5]) {
    return uri.is(match[5]);
  } else if (match[2] === ':') {
    property = match[1].toLowerCase() + ':';
    if (!compare[property]) {
      // filers seem to fail silently
      return false;
    }

    return compare[property](uri, match[4]);
  } else {
    property = match[1].toLowerCase();
    if (!comparable[property]) {
      // filers seem to fail silently
      return false;
    }

    return (compare[match[2]])(uri[property](), match[4], property);
  }
}

if ($.expr.createPseudo) {
  // jQuery >= 1.8
  uriSizzle = $.expr.createPseudo(function (text: string) {
    return function (elem: Element) {
      return uriPseudo(elem, text);
    };
  });
} else {
  // jQuery < 1.8
  uriSizzle = function (elem: Element, i?: number, match?: RegExpMatchArray) {
    return uriPseudo(elem, match?.[3] || '');
  };
}

$.expr[':'].uri = uriSizzle;

export default URI;
