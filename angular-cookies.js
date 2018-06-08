/**
 * @license AngularJS v1.7.2-build.5557+sha.ad0ba99
 * (c) 2010-2018 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/**
 * @ngdoc module
 * @name ngCookies
 * @description
 *
 * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
 *
 * See {@link ngCookies.$cookies `$cookies`} for usage.
 */


angular.module('ngCookies', ['ng']).
  info({ angularVersion: '1.7.2-build.5557+sha.ad0ba99' }).
  /**
   * @ngdoc provider
   * @name $cookiesProvider
   * @description
   * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
   * */
   provider('$cookies', [/** @this */function $CookiesProvider() {
    /**
     * @ngdoc property
     * @name $cookiesProvider#defaults
     * @description
     *
     * Object containing default options to pass when setting cookies.
     *
     * The object may have following properties:
     *
     * - **path** - `{string}` - The cookie will be available only for this path and its
     *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
     * - **domain** - `{string}` - The cookie will be available only for this domain and
     *   its sub-domains. For security reasons the user agent will not accept the cookie
     *   if the current domain is not a sub-domain of this domain or equal to it.
     * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
     *   or a Date object indicating the exact date/time this cookie will expire.
     * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
     *   secured connection.
     * - **samesite** - `{string}` - prevents the browser from sending the cookie along with cross-site requests.
     *   Accepts the values `lax` and `strict`. See the [OWASP Wiki](https://www.owasp.org/index.php/SameSite)
     *   for more info. Note that as of May 2018, not all browsers support `SameSite`,
     *   so it cannot be used as a single measure against Cross-Site-Request-Forgery (CSRF) attacks.
     *
     * Note: By default, the address that appears in your `<base>` tag will be used as the path.
     * This is important so that cookies will be visible for all routes when html5mode is enabled.
     *
     * @example
     *
     * ```js
     * angular.module('cookiesProviderExample', ['ngCookies'])
     *   .config(['$cookiesProvider', function($cookiesProvider) {
     *     // Setting default options
     *     $cookiesProvider.defaults.domain = 'foo.com';
     *     $cookiesProvider.defaults.secure = true;
     *   }]);
     * ```
     **/
    var defaults = this.defaults = {};

    function calcOptions(options) {
      return options ? angular.extend({}, defaults, options) : defaults;
    }

    /**
     * @ngdoc service
     * @name $cookies
     *
     * @description
     * Provides read/write access to browser's cookies.
     *
     * <div class="alert alert-info">
     * Up until AngularJS 1.3, `$cookies` exposed properties that represented the
     * current browser cookie values. In version 1.4, this behavior has changed, and
     * `$cookies` now provides a standard api of getters, setters etc.
     * </div>
     *
     * Requires the {@link ngCookies `ngCookies`} module to be installed.
     *
     * @example
     *
     * ```js
     * angular.module('cookiesExample', ['ngCookies'])
     *   .controller('ExampleController', ['$cookies', function($cookies) {
     *     // Retrieving a cookie
     *     var favoriteCookie = $cookies.get('myFavorite');
     *     // Setting a cookie
     *     $cookies.put('myFavorite', 'oatmeal');
     *   }]);
     * ```
     */
    this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
      return {
        /**
         * @ngdoc method
         * @name $cookies#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {string} Raw cookie value.
         */
        get: function(key) {
          return $$cookieReader()[key];
        },

        /**
         * @ngdoc method
         * @name $cookies#getObject
         *
         * @description
         * Returns the deserialized value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        getObject: function(key) {
          var value = this.get(key);
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookies#getAll
         *
         * @description
         * Returns a key value object with all the cookies
         *
         * @returns {Object} All cookies
         */
        getAll: function() {
          return $$cookieReader();
        },

        /**
         * @ngdoc method
         * @name $cookies#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {string} value Raw value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        put: function(key, value, options) {
          $$cookieWriter(key, value, calcOptions(options));
        },

        /**
         * @ngdoc method
         * @name $cookies#putObject
         *
         * @description
         * Serializes and sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        putObject: function(key, value, options) {
          this.put(key, angular.toJson(value), options);
        },

        /**
         * @ngdoc method
         * @name $cookies#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        remove: function(key, options) {
          $$cookieWriter(key, undefined, calcOptions(options));
        }
      };
    }];
  }]);

/**
 * @name $$cookieWriter
 * @requires $document
 *
 * @description
 * This is a private service for writing cookies
 *
 * @param {string} name Cookie name
 * @param {string=} value Cookie value (if undefined, cookie will be deleted)
 * @param {Object=} options Object with options that need to be stored for the cookie.
 */
function $$CookieWriter($document, $log, $browser) {
  var cookiePath = $browser.baseHref();
  var rawDocument = $document[0];

  function buildCookieString(name, value, options) {
    var path, expires;
    options = options || {};
    expires = options.expires;
    path = angular.isDefined(options.path) ? options.path : cookiePath;
    if (angular.isUndefined(value)) {
      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      value = '';
    }
    if (angular.isString(expires)) {
      expires = new Date(expires);
    }

    var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    str += path ? ';path=' + path : '';
    str += options.domain ? ';domain=' + options.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += options.secure ? ';secure' : '';
    str += options.samesite ? ';samesite=' + options.samesite : '';

    // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
    // - 300 cookies
    // - 20 cookies per unique domain
    // - 4096 bytes per cookie
    var cookieLength = str.length + 1;
    if (cookieLength > 4096) {
      $log.warn('Cookie \'' + name +
        '\' possibly not set or overflowed because it was too large (' +
        cookieLength + ' > 4096 bytes)!');
    }

    return str;
  }

  return function(name, value, options) {
    rawDocument.cookie = buildCookieString(name, value, options);
  };
}

$$CookieWriter.$inject = ['$document', '$log', '$browser'];

angular.module('ngCookies').provider('$$cookieWriter', /** @this */ function $$CookieWriterProvider() {
  this.$get = $$CookieWriter;
});


})(window, window.angular);
