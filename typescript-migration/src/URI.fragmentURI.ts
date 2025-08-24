/*
 * Extending URI.js for fragment abuse
 */

// --------------------------------------------------------------------------------
// EXAMPLE: storing a relative URL in the fragment ("FragmentURI")
// possibly helpful when working with backbone.js or sammy.js
// inspired by https://github.com/medialize/URI.js/pull/2
// --------------------------------------------------------------------------------

// Note: make sure this is the last file loaded!

// USAGE:
// var uri = URI("http://example.org/#!/foo/bar/baz.html");
// var furi = uri.fragment(true);
// furi.pathname() === '/foo/bar/baz.html';
// furi.pathname('/hello.html');
// uri.toString() === "http://example.org/#!/hello.html"


// Interface for FragmentURI specific methods and properties

interface FragmentURISpecific {

  fragmentPrefix(prefix?: string): FragmentURIInterface;

  // Override fragment method to handle FragmentURI specific behavior
  fragment(v?: string | QueryData | boolean, build?: boolean): FragmentURIInterface;

  // Override build method to handle parent URI updates
  build(deferBuild?: boolean): FragmentURIInterface;

  // Add fragment-specific properties
  _parentURI?: FragmentURIInterface;
  _fragmentURI?: FragmentURIInterface;
}

// Union type combining URIInstanceInterface with FragmentURI specific overrides
type FragmentURIInterface = Omit<URIInstanceInterface, keyof FragmentURISpecific> & FragmentURISpecific;

const p: FragmentURIInterface = URI.prototype;
// old handlers we need to wrap
const f = p.fragment;
const b = p.build;

// make fragmentPrefix configurable
URI.fragmentPrefix = '!';
const _parts = URI._parts;
URI._parts = function (): URIParts {
  const parts = _parts();
  parts.fragmentPrefix = URI.fragmentPrefix;
  return parts;
};

p.fragmentPrefix = function (v: string): FragmentURIInterface {
  this._parts.fragmentPrefix = v;
  return this;
};

// add fragment(true) and fragment(URI) signatures
p.fragment = function (v?: string | FragmentURIInterface | boolean, build?: boolean): FragmentURIInterface {
  const prefix = this._parts?.fragmentPrefix || '';
  const fragment = this._parts.fragment || '';
  let furi: FragmentURIInterface;

  if (v === true) {
    if (fragment.substring(0, prefix.length) !== prefix) {
      furi = URI('') as unknown as FragmentURIInterface;
    } else {
      furi = new URI(fragment.substring(prefix.length)) as unknown as FragmentURIInterface;
    }
    this._fragmentURI = furi;
    furi._parentURI = this;
    return furi;
  } else if (v !== undefined && typeof v !== 'string') {
    v = v as FragmentURIInterface
    this._fragmentURI = v;
    v._parentURI = v;
    this._parts.fragment = prefix + v.toString();
    this.build(!build);
    return this;
  } else if (typeof v === 'string') {
    this._fragmentURI = undefined;
  }

  return f.call(this, v, build);
};

// make .build() of the actual URI aware of the FragmentURI
p.build = function (deferBuild?: boolean): FragmentURIInterface {
  const t = b.call(this, deferBuild);

  if (deferBuild !== false && this._parentURI) {
    // update the parent
    this._parentURI.fragment(this);
  }

  return t;
};

// extending existing object rather than defining something new
export default URI;
