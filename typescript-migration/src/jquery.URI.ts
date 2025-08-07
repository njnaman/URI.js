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

export interface JQueryStatic {
  (selector: any): JQuery;
  each(obj: any, callback: (index: any, value: any) => void): void;
  attrHooks: { [key: string]: any };
  expr: any;
  fn: any;
}

export interface JQuery {
  first(): JQuery;
  get(index: number): Element;
  data(key: string): any;
  data(key: string, value: any): JQuery;
  attr(name: string): string;
  uri(): any;
  uri(uri: string | any): any;
}

export interface CompareFunction {
  (value: string, target: string, property?: string): boolean;
}

export interface URICompareFunctions {
  [key: string]: CompareFunction | ((uri: any, target: string) => boolean);
}

import URI from './URI';

// FIXME: v2.0.0 renamce non-camelCase properties to uppercase
/*jshint camelcase: false */

// Note: jQuery should be imported externally when using this module
export function initializeJQueryURI($: JQueryStatic): JQueryStatic {

  const comparable: { [key: string]: boolean } = {};
  const compare: URICompareFunctions = {
    // equals
    '=': function(value: string, target: string): boolean {
      return value === target;
    },
    // ~= translates to value.match((?:^|\s)target(?:\s|$)) which is useless for URIs
    // |= translates to value.match((?:\b)target(?:-|\s|$)) which is useless for URIs
    // begins with
    '^=': function(value: string, target: string): boolean {
      return !!(value + '').match(new RegExp('^' + escapeRegEx(target), 'i'));
    },
    // ends with
    '$=': function(value: string, target: string): boolean {
      return !!(value + '').match(new RegExp(escapeRegEx(target) + '$', 'i'));
    },
    // contains
    '*=': function(value: string, target: string, property?: string): boolean {
      if (property === 'directory') {
        // add trailing slash so /dir/ will match the deep-end as well
        value += '/';
      }

      return !!(value + '').match(new RegExp(escapeRegEx(target), 'i'));
    },
    'equals:': function(uri: any, target: string): boolean {
      return uri.equals(target);
    },
    'is:': function(uri: any, target: string): boolean {
      return uri.is(target);
    }
  };

  function escapeRegEx(string: string): string {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
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

  function generateAccessor(property: string): any {
    return {
      get: function(elem: Element): any {
        return ($ as any)(elem).uri()[property]();
      },
      set: function(elem: Element, value: any): any {
        ($ as any)(elem).uri()[property](value);
        return value;
      }
    };
  }

  // populate lookup table and register $.attr('uri:accessor') handlers
  $.each('origin authority directory domain filename fragment hash host hostname href password path pathname port protocol query resource scheme search subdomain suffix tld username'.split(' '), function(k: number, v: string) {
    comparable[v] = true;
    $.attrHooks['uri:' + v] = generateAccessor(v);
  });

  // pipe $.attr('src') and $.attr('href') through URI.js
  const _attrHooks = {
    get: function(elem: Element): any {
      return ($ as any)(elem).uri();
    },
    set: function(elem: Element, value: any): string {
      return ($ as any)(elem).uri().href(value).toString();
    }
  };
  $.each(['src', 'href', 'action', 'uri', 'cite'], function(k: number, v: string) {
    $.attrHooks[v] = {
      set: _attrHooks.set
    };
  });
  $.attrHooks.uri.get = _attrHooks.get;

  // general URI accessor
  ($ as any).fn.uri = function(uri?: any): any {
    const $this = this.first();
    const elem = $this.get(0);
    const property = getUriProperty(elem);

    if (!property) {
      throw new Error('Element "' + elem.nodeName + '" does not have either property: href, src, action, cite');
    }

    if (uri !== undefined) {
      const old = $this.data('uri');
      if (old) {
        return old.href(uri);
      }

      if (!(uri instanceof URI)) {
        uri = URI(uri || '');
      }
    } else {
      uri = $this.data('uri');
      if (uri) {
        return uri;
      } else {
        uri = URI($this.attr(property) || '');
      }
    }

    (uri as any)._dom_element = elem;
    (uri as any)._dom_attribute = property;
    uri.normalize();
    $this.data('uri', uri);
    return uri;
  };

  // overwrite URI.build() to update associated DOM element if necessary
  URI.prototype.build = function(deferBuild?: boolean): any {
    if ((this as any)._dom_element) {
      // cannot defer building when hooked into a DOM element
      (this as any)._string = URI.build((this as any)._parts);
      (this as any)._deferred_build = false;
      (this as any)._dom_element.setAttribute((this as any)._dom_attribute, (this as any)._string);
      (this as any)._dom_element[(this as any)._dom_attribute] = (this as any)._string;
    } else if (deferBuild === true) {
      (this as any)._deferred_build = true;
    } else if (deferBuild === undefined || (this as any)._deferred_build) {
      (this as any)._string = URI.build((this as any)._parts);
      (this as any)._deferred_build = false;
    }

    return this;
  };

  // add :uri() pseudo class selector to sizzle
  let uriSizzle: any;
  const pseudoArgs = /^([a-zA-Z]+)\s*([\^\$*]?=|:)\s*(['"]?)(.+)\3|^\s*([a-zA-Z0-9]+)\s*$/;
  
  function uriPseudo(elem: Element, text: string): boolean {
    let match: RegExpMatchArray | null, property: string, uri: any;

    // skip anything without src|href|action and bad :uri() syntax
    if (!getUriProperty(elem) || !text) {
      return false;
    }

    match = text.match(pseudoArgs);

    if (!match || (!match[5] && match[2] !== ':' && !compare[match[2]])) {
      // abort because the given selector cannot be executed
      // filers seem to fail silently
      return false;
    }

    uri = ($ as any)(elem).uri();

    if (match[5]) {
      return uri.is(match[5]);
    } else if (match[2] === ':') {
      property = match[1].toLowerCase() + ':';
      if (!compare[property]) {
        // filers seem to fail silently
        return false;
      }

      return (compare[property] as any)(uri, match[4]);
    } else {
      property = match[1].toLowerCase();
      if (!comparable[property]) {
        // filers seem to fail silently
        return false;
      }

      return (compare[match[2]] as CompareFunction)(uri[property](), match[4], property);
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
    uriSizzle = function (elem: Element, i: number, match: RegExpMatchArray) {
      return uriPseudo(elem, match[3]);
    };
  }

  $.expr[':'].uri = uriSizzle;

  // extending existing object rather than defining something new,
  // return jQuery anyway
  return $;
}