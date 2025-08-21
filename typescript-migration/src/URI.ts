/*!
 * URI.js - Mutating URLs
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

/*global location, escape, unescape, punycode, IPv6, SecondLevelDomains */
// FIXME: v2.0.0 renamce non-camelCase properties to uppercase
/*jshint camelcase: false */

// Declare global dependencies (will be provided by UMD modules)
import {PunycodeInterface} from "./punycode";
import {IPv6Interface} from "./IPv6";
import {SecondLevelDomainsInterface} from "./SecondLevelDomains";

declare const punycode: PunycodeInterface;
declare const IPv6: IPv6Interface;
declare const SecondLevelDomains: SecondLevelDomainsInterface;

// Use SecondLevelDomains as SLD for compatibility

interface URIInstance {
  _parts?: any;
  _string?: string;
  _deferred_build?: boolean;

  href(url: string): URIInstance;

  absoluteTo(base: string): URIInstance;
}

interface URIConstructor {
  (url?: string, base?: string): URIInstance;

  new(url?: string, base?: string): URIInstance;

  _parts(): any;
}

function URI(this: any, url?: string, base?: string): URIInstance {
  console.log("Punycode", punycode)
  console.log("IPv6", IPv6)
  console.log("SLD", SecondLevelDomains)
  const _urlSupplied = arguments.length >= 1;
  const _baseSupplied = arguments.length >= 2;

  // Allow instantiation without the 'new' keyword
  if (!(this instanceof URI)) {
    if (_urlSupplied) {
      if (_baseSupplied) {
        return new (URI as any)(url, base);
      }

      return new (URI as any)(url);
    }

    return new (URI as any)();
  }

  // Initialize the instance with _parts (cast as any for migration compatibility)
  const self = this as URIInstance;
  if (!self._parts) {
    self._parts = (URI as any)._parts();
    self._string = '';
    self._deferred_build = false;
  }

  if (url === undefined) {
    if (_urlSupplied) {
      throw new TypeError('undefined is not a valid argument for URI');
    }

    if (typeof location !== 'undefined') {
      url = location.href + '';
    } else {
      url = '';
    }
  }

  if (url === null) {
    if (_urlSupplied) {
      throw new TypeError('null is not a valid argument for URI');
    }
  }

  self.href(url);

  // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
  if (base !== undefined) {
    return self.absoluteTo(base);
  }

  return self;
}

// Add stub methods to make the function work
(URI as any)._parts = function () {
  return {};
};

(URI as any).prototype.href = function (url: string) {
  // Stub implementation
  return this;
};

(URI as any).prototype.absoluteTo = function (base: string) {
  // Stub implementation
  return this;
};

export default URI;
