APP_ONLINE = true;
APP_OFFLINE_WARN_TO = false;
APP_INIT_INTERVAL = false;
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.0.2
 */
if (typeof Promise == 'undefined') {
    (function() {
        "use strict";
        function lib$es6$promise$utils$$objectOrFunction(x) {
            return typeof x === 'function' || (typeof x === 'object' && x !== null);
        }

        function lib$es6$promise$utils$$isFunction(x) {
            return typeof x === 'function';
        }

        function lib$es6$promise$utils$$isMaybeThenable(x) {
            return typeof x === 'object' && x !== null;
        }

        var lib$es6$promise$utils$$_isArray;
        if (!Array.isArray) {
            lib$es6$promise$utils$$_isArray = function(x) {
                return Object.prototype.toString.call(x) === '[object Array]';
            };
        } else {
            lib$es6$promise$utils$$_isArray = Array.isArray;
        }

        var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
        var lib$es6$promise$asap$$len = 0;
        var lib$es6$promise$asap$$toString = {}.toString;
        var lib$es6$promise$asap$$vertxNext;
        var lib$es6$promise$asap$$customSchedulerFn;
        var lib$es6$promise$asap$$asap = function asap(callback, arg) {
            lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
            lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
            lib$es6$promise$asap$$len += 2;
            if (lib$es6$promise$asap$$len === 2) {
                // If len is 2, that means that we need to schedule an async flush.
                // If additional callbacks are queued before the queue is flushed, they
                // will be processed by this flush that we are scheduling.
                if (lib$es6$promise$asap$$customSchedulerFn) {
                    lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
                } else {
                    lib$es6$promise$asap$$scheduleFlush();
                }
            }
        }

        function lib$es6$promise$asap$$setScheduler(scheduleFn) {
            lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
        }

        function lib$es6$promise$asap$$setAsap(asapFn) {
            lib$es6$promise$asap$$asap = asapFn;
        }

        var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
        var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
        var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
        var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

        // test for web worker but not in IE10
        var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
                typeof importScripts !== 'undefined' &&
                typeof MessageChannel !== 'undefined';

        // node
        function lib$es6$promise$asap$$useNextTick() {
            // node version 0.10.x displays a deprecation warning when nextTick is used recursively
            // see https://github.com/cujojs/when/issues/410 for details
            return function() {
                process.nextTick(lib$es6$promise$asap$$flush);
            };
        }

        // vertx
        function lib$es6$promise$asap$$useVertxTimer() {
            return function() {
                lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
            };
        }

        function lib$es6$promise$asap$$useMutationObserver() {
            var iterations = 0;
            var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
            var node = document.createTextNode('');
            observer.observe(node, {characterData: true});

            return function() {
                node.data = (iterations = ++iterations % 2);
            };
        }

        // web worker
        function lib$es6$promise$asap$$useMessageChannel() {
            var channel = new MessageChannel();
            channel.port1.onmessage = lib$es6$promise$asap$$flush;
            return function() {
                channel.port2.postMessage(0);
            };
        }

        function lib$es6$promise$asap$$useSetTimeout() {
            return function() {
                setTimeout(lib$es6$promise$asap$$flush, 1);
            };
        }

        var lib$es6$promise$asap$$queue = new Array(1000);
        function lib$es6$promise$asap$$flush() {
            for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) {
                var callback = lib$es6$promise$asap$$queue[i];
                var arg = lib$es6$promise$asap$$queue[i + 1];

                callback(arg);

                lib$es6$promise$asap$$queue[i] = undefined;
                lib$es6$promise$asap$$queue[i + 1] = undefined;
            }
            lib$es6$promise$asap$$len = 0;
        }

        function lib$es6$promise$asap$$attemptVertx() {
            try {
                var r = require;
                var vertx = r('vertx');
                lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
                return lib$es6$promise$asap$$useVertxTimer();
            } catch (e) {
                return lib$es6$promise$asap$$useSetTimeout();
            }
        }

        var lib$es6$promise$asap$$scheduleFlush;
        // Decide what async method to use to triggering processing of queued callbacks:
        if (lib$es6$promise$asap$$isNode) {
            lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
        } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
            lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
        } else if (lib$es6$promise$asap$$isWorker) {
            lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
        } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
            lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
        } else {
            lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
        }

        function lib$es6$promise$$internal$$noop() {
        }

        var lib$es6$promise$$internal$$PENDING = void 0;
        var lib$es6$promise$$internal$$FULFILLED = 1;
        var lib$es6$promise$$internal$$REJECTED = 2;

        var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

        function lib$es6$promise$$internal$$selfFulfillment() {
            return new TypeError("You cannot resolve a promise with itself");
        }

        function lib$es6$promise$$internal$$cannotReturnOwn() {
            return new TypeError('A promises callback cannot return that same promise.');
        }

        function lib$es6$promise$$internal$$getThen(promise) {
            try {
                return promise.then;
            } catch (error) {
                lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
                return lib$es6$promise$$internal$$GET_THEN_ERROR;
            }
        }

        function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
            try {
                then.call(value, fulfillmentHandler, rejectionHandler);
            } catch (e) {
                return e;
            }
        }

        function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
            lib$es6$promise$asap$$asap(function(promise) {
                var sealed = false;
                var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
                    if (sealed) {
                        return;
                    }
                    sealed = true;
                    if (thenable !== value) {
                        lib$es6$promise$$internal$$resolve(promise, value);
                    } else {
                        lib$es6$promise$$internal$$fulfill(promise, value);
                    }
                }, function(reason) {
                    if (sealed) {
                        return;
                    }
                    sealed = true;

                    lib$es6$promise$$internal$$reject(promise, reason);
                }, 'Settle: ' + (promise._label || ' unknown promise'));
                if (!sealed && error) {
                    sealed = true;
                    lib$es6$promise$$internal$$reject(promise, error);
                }
            }, promise);
        }

        function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
            if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
                lib$es6$promise$$internal$$fulfill(promise, thenable._result);
            } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
                lib$es6$promise$$internal$$reject(promise, thenable._result);
            } else {
                lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
                    lib$es6$promise$$internal$$resolve(promise, value);
                }, function(reason) {
                    lib$es6$promise$$internal$$reject(promise, reason);
                });
            }
        }

        function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
            if (maybeThenable.constructor === promise.constructor) {
                lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
            } else {
                var then = lib$es6$promise$$internal$$getThen(maybeThenable);

                if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
                    lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
                } else if (then === undefined) {
                    lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
                } else if (lib$es6$promise$utils$$isFunction(then)) {
                    lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
                } else {
                    lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
                }
            }
        }

        function lib$es6$promise$$internal$$resolve(promise, value) {
            if (promise === value) {
                lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
            } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
                lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
            } else {
                lib$es6$promise$$internal$$fulfill(promise, value);
            }
        }

        function lib$es6$promise$$internal$$publishRejection(promise) {
            if (promise._onerror) {
                promise._onerror(promise._result);
            }

            lib$es6$promise$$internal$$publish(promise);
        }

        function lib$es6$promise$$internal$$fulfill(promise, value) {
            if (promise._state !== lib$es6$promise$$internal$$PENDING) {
                return;
            }

            promise._result = value;
            promise._state = lib$es6$promise$$internal$$FULFILLED;

            if (promise._subscribers.length !== 0) {
                lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
            }
        }

        function lib$es6$promise$$internal$$reject(promise, reason) {
            if (promise._state !== lib$es6$promise$$internal$$PENDING) {
                return;
            }
            promise._state = lib$es6$promise$$internal$$REJECTED;
            promise._result = reason;

            lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
        }

        function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
            var subscribers = parent._subscribers;
            var length = subscribers.length;

            parent._onerror = null;

            subscribers[length] = child;
            subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
            subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection;

            if (length === 0 && parent._state) {
                lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
            }
        }

        function lib$es6$promise$$internal$$publish(promise) {
            var subscribers = promise._subscribers;
            var settled = promise._state;
            if (subscribers.length === 0) {
                return;
            }

            var child, callback, detail = promise._result;

            for (var i = 0; i < subscribers.length; i += 3) {
                child = subscribers[i];
                callback = subscribers[i + settled];

                if (child) {
                    lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
                } else {
                    callback(detail);
                }
            }

            promise._subscribers.length = 0;
        }

        function lib$es6$promise$$internal$$ErrorObject() {
            this.error = null;
        }

        var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

        function lib$es6$promise$$internal$$tryCatch(callback, detail) {
            try {
                return callback(detail);
            } catch (e) {
                lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
                return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
            }
        }

        function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
            var hasCallback = lib$es6$promise$utils$$isFunction(callback),
                    value, error, succeeded, failed;

            if (hasCallback) {
                value = lib$es6$promise$$internal$$tryCatch(callback, detail);

                if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
                    failed = true;
                    error = value.error;
                    value = null;
                } else {
                    succeeded = true;
                }
                if (promise === value) {
                    lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
                    return;
                }
            } else {
                value = detail;
                succeeded = true;
            }

            if (promise._state !== lib$es6$promise$$internal$$PENDING) {             // noop
            } else if (hasCallback && succeeded) {
                lib$es6$promise$$internal$$resolve(promise, value);
            } else if (failed) {
                lib$es6$promise$$internal$$reject(promise, error);
            } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
                lib$es6$promise$$internal$$fulfill(promise, value);
            } else if (settled === lib$es6$promise$$internal$$REJECTED) {
                lib$es6$promise$$internal$$reject(promise, value);
            }
        }

        function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
            try {
                resolver(function resolvePromise(value) {
                    lib$es6$promise$$internal$$resolve(promise, value);
                }, function rejectPromise(reason) {
                    lib$es6$promise$$internal$$reject(promise, reason);
                });
            } catch (e) {
                lib$es6$promise$$internal$$reject(promise, e);
            }
        }

        function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
            var enumerator = this;

            enumerator._instanceConstructor = Constructor;
            enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

            if (enumerator._validateInput(input)) {
                enumerator._input = input;
                enumerator.length = input.length;
                enumerator._remaining = input.length;

                enumerator._init();
                if (enumerator.length === 0) {
                    lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
                } else {
                    enumerator.length = enumerator.length || 0;
                    enumerator._enumerate();
                    if (enumerator._remaining === 0) {
                        lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
                    }
                }
            } else {
                lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
            }
        }

        lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
            return lib$es6$promise$utils$$isArray(input);
        };

        lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
            return new Error('Array Methods must be provided an Array');
        };

        lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
            this._result = new Array(this.length);
        };

        var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

        lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
            var enumerator = this;

            var length = enumerator.length;
            var promise = enumerator.promise;
            var input = enumerator._input;

            for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
                enumerator._eachEntry(input[i], i);
            }
        };

        lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
            var enumerator = this;
            var c = enumerator._instanceConstructor;

            if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
                if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
                    entry._onerror = null;
                    enumerator._settledAt(entry._state, i, entry._result);
                } else {
                    enumerator._willSettleAt(c.resolve(entry), i);
                }
            } else {
                enumerator._remaining--;
                enumerator._result[i] = entry;
            }
        };

        lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
            var enumerator = this;
            var promise = enumerator.promise;

            if (promise._state === lib$es6$promise$$internal$$PENDING) {
                enumerator._remaining--;

                if (state === lib$es6$promise$$internal$$REJECTED) {
                    lib$es6$promise$$internal$$reject(promise, value);
                } else {
                    enumerator._result[i] = value;
                }
            }
            if (enumerator._remaining === 0) {
                lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
            }
        };

        lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
            var enumerator = this;

            lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
                enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
            }, function(reason) {
                enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
            });
        };
        function lib$es6$promise$promise$all$$all(entries) {
            return new lib$es6$promise$enumerator$$default(this, entries).promise;
        }
        var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
        function lib$es6$promise$promise$race$$race(entries) {
            /*jshint validthis:true */
            var Constructor = this;

            var promise = new Constructor(lib$es6$promise$$internal$$noop);

            if (!lib$es6$promise$utils$$isArray(entries)) {
                lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
                return promise;
            }

            var length = entries.length;

            function onFulfillment(value) {
                lib$es6$promise$$internal$$resolve(promise, value);
            }

            function onRejection(reason) {
                lib$es6$promise$$internal$$reject(promise, reason);
            }

            for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
                lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
            }

            return promise;
        }
        var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
        function lib$es6$promise$promise$resolve$$resolve(object) {
            /*jshint validthis:true */
            var Constructor = this;

            if (object && typeof object === 'object' && object.constructor === Constructor) {
                return object;
            }

            var promise = new Constructor(lib$es6$promise$$internal$$noop);
            lib$es6$promise$$internal$$resolve(promise, object);
            return promise;
        }
        var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
        function lib$es6$promise$promise$reject$$reject(reason) {
            /*jshint validthis:true */
            var Constructor = this;
            var promise = new Constructor(lib$es6$promise$$internal$$noop);
            lib$es6$promise$$internal$$reject(promise, reason);
            return promise;
        }
        var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

        var lib$es6$promise$promise$$counter = 0;

        function lib$es6$promise$promise$$needsResolver() {
            throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
        }

        function lib$es6$promise$promise$$needsNew() {
            throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        }

        var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
        /**
         Promise objects represent the eventual result of an asynchronous operation. The
         primary way of interacting with a promise is through its `then` method, which
         registers callbacks to receive either a promise's eventual value or the reason
         why the promise cannot be fulfilled.
         
         Terminology
         -----------
         
         - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
         - `thenable` is an object or function that defines a `then` method.
         - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
         - `exception` is a value that is thrown using the throw statement.
         - `reason` is a value that indicates why a promise was rejected.
         - `settled` the final resting state of a promise, fulfilled or rejected.
         
         A promise can be in one of three states: pending, fulfilled, or rejected.
         
         Promises that are fulfilled have a fulfillment value and are in the fulfilled
         state.  Promises that are rejected have a rejection reason and are in the
         rejected state.  A fulfillment value is never a thenable.
         
         Promises can also be said to *resolve* a value.  If this value is also a
         promise, then the original promise's settled state will match the value's
         settled state.  So a promise that *resolves* a promise that rejects will
         itself reject, and a promise that *resolves* a promise that fulfills will
         itself fulfill.
         
         
         Basic Usage:
         ------------
         
         ```js
         var promise = new Promise(function(resolve, reject) {
         // on success
         resolve(value);
         
         // on failure
         reject(reason);
         });
         
         promise.then(function(value) {
         // on fulfillment
         }, function(reason) {
         // on rejection
         });
         ```
         
         Advanced Usage:
         ---------------
         
         Promises shine when abstracting away asynchronous interactions such as
         `XMLHttpRequest`s.
         
         ```js
         function getJSON(url) {
         return new Promise(function(resolve, reject){
         var xhr = new XMLHttpRequest();
         
         xhr.open('GET', url);
         xhr.onreadystatechange = handler;
         xhr.responseType = 'json';
         xhr.setRequestHeader('Accept', 'application/json');
         xhr.send();
         
         function handler() {
         if (this.readyState === this.DONE) {
         if (this.status === 200) {
         resolve(this.response);
         } else {
         reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
         }
         }
         };
         });
         }
         
         getJSON('/posts.json').then(function(json) {
         // on fulfillment
         }, function(reason) {
         // on rejection
         });
         ```
         
         Unlike callbacks, promises are great composable primitives.
         
         ```js
         Promise.all([
         getJSON('/posts'),
         getJSON('/comments')
         ]).then(function(values){
         values[0] // => postsJSON
         values[1] // => commentsJSON
         
         return values;
         });
         ```
         
         @class Promise
         @param {function} resolver
         Useful for tooling.
         @constructor
         */
        function lib$es6$promise$promise$$Promise(resolver) {
            this._id = lib$es6$promise$promise$$counter++;
            this._state = undefined;
            this._result = undefined;
            this._subscribers = [];

            if (lib$es6$promise$$internal$$noop !== resolver) {
                if (!lib$es6$promise$utils$$isFunction(resolver)) {
                    lib$es6$promise$promise$$needsResolver();
                }

                if (!(this instanceof lib$es6$promise$promise$$Promise)) {
                    lib$es6$promise$promise$$needsNew();
                }

                lib$es6$promise$$internal$$initializePromise(this, resolver);
            }
        }

        lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
        lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
        lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
        lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
        lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
        lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
        lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

        lib$es6$promise$promise$$Promise.prototype = {
            constructor: lib$es6$promise$promise$$Promise,
            /**
             The primary way of interacting with a promise is through its `then` method,
             which registers callbacks to receive either a promise's eventual value or the
             reason why the promise cannot be fulfilled.
             
             ```js
             findUser().then(function(user){
             // user is available
             }, function(reason){
             // user is unavailable, and you are given the reason why
             });
             ```
             
             Chaining
             --------
             
             The return value of `then` is itself a promise.  This second, 'downstream'
             promise is resolved with the return value of the first promise's fulfillment
             or rejection handler, or rejected if the handler throws an exception.
             
             ```js
             findUser().then(function (user) {
             return user.name;
             }, function (reason) {
             return 'default name';
             }).then(function (userName) {
             // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
             // will be `'default name'`
             });
             
             findUser().then(function (user) {
             throw new Error('Found user, but still unhappy');
             }, function (reason) {
             throw new Error('`findUser` rejected and we're unhappy');
             }).then(function (value) {
             // never reached
             }, function (reason) {
             // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
             // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
             });
             ```
             If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
             
             ```js
             findUser().then(function (user) {
             throw new PedagogicalException('Upstream error');
             }).then(function (value) {
             // never reached
             }).then(function (value) {
             // never reached
             }, function (reason) {
             // The `PedgagocialException` is propagated all the way down to here
             });
             ```
             
             Assimilation
             ------------
             
             Sometimes the value you want to propagate to a downstream promise can only be
             retrieved asynchronously. This can be achieved by returning a promise in the
             fulfillment or rejection handler. The downstream promise will then be pending
             until the returned promise is settled. This is called *assimilation*.
             
             ```js
             findUser().then(function (user) {
             return findCommentsByAuthor(user);
             }).then(function (comments) {
             // The user's comments are now available
             });
             ```
             
             If the assimliated promise rejects, then the downstream promise will also reject.
             
             ```js
             findUser().then(function (user) {
             return findCommentsByAuthor(user);
             }).then(function (comments) {
             // If `findCommentsByAuthor` fulfills, we'll have the value here
             }, function (reason) {
             // If `findCommentsByAuthor` rejects, we'll have the reason here
             });
             ```
             
             Simple Example
             --------------
             
             Synchronous Example
             
             ```javascript
             var result;
             
             try {
             result = findResult();
             // success
             } catch(reason) {
             // failure
             }
             ```
             
             Errback Example
             
             ```js
             findResult(function(result, err){
             if (err) {
             // failure
             } else {
             // success
             }
             });
             ```
             
             Promise Example;
             
             ```javascript
             findResult().then(function(result){
             // success
             }, function(reason){
             // failure
             });
             ```
             
             Advanced Example
             --------------
             
             Synchronous Example
             
             ```javascript
             var author, books;
             
             try {
             author = findAuthor();
             books  = findBooksByAuthor(author);
             // success
             } catch(reason) {
             // failure
             }
             ```
             
             Errback Example
             
             ```js
             
             function foundBooks(books) {
             
             }
             
             function failure(reason) {
             
             }
             
             findAuthor(function(author, err){
             if (err) {
             failure(err);
             // failure
             } else {
             try {
             findBoooksByAuthor(author, function(books, err) {
             if (err) {
             failure(err);
             } else {
             try {
             foundBooks(books);
             } catch(reason) {
             failure(reason);
             }
             }
             });
             } catch(error) {
             failure(err);
             }
             // success
             }
             });
             ```
             
             Promise Example;
             
             ```javascript
             findAuthor().
             then(findBooksByAuthor).
             then(function(books){
             // found books
             }).catch(function(reason){
             // something went wrong
             });
             ```
             
             @method then
             @param {Function} onFulfilled
             @param {Function} onRejected
             Useful for tooling.
             @return {Promise}
             */
            then: function(onFulfillment, onRejection) {
                var parent = this;
                var state = parent._state;

                if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
                    return this;
                }

                var child = new this.constructor(lib$es6$promise$$internal$$noop);
                var result = parent._result;

                if (state) {
                    var callback = arguments[state - 1];
                    lib$es6$promise$asap$$asap(function() {
                        lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
                    });
                } else {
                    lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
                }

                return child;
            },
            /**
             `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
             as the catch block of a try/catch statement.
             
             ```js
             function findAuthor(){
             throw new Error('couldn't find that author');
             }
             
             // synchronous
             try {
             findAuthor();
             } catch(reason) {
             // something went wrong
             }
             
             // async with promises
             findAuthor().catch(function(reason){
             // something went wrong
             });
             ```
             
             @method catch
             @param {Function} onRejection
             Useful for tooling.
             @return {Promise}
             */
            'catch': function(onRejection) {
                return this.then(null, onRejection);
            }
        };
        function lib$es6$promise$polyfill$$polyfill() {
            var local;

            if (typeof global !== 'undefined') {
                local = global;
            } else if (typeof self !== 'undefined') {
                local = self;
            } else {
                try {
                    local = Function('return this')();
                } catch (e) {
                    throw new Error('polyfill failed because global object is unavailable in this environment');
                }
            }

            var P = local.Promise;

            if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
                return;
            }

            local.Promise = lib$es6$promise$promise$$default;
        }
        var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

        var lib$es6$promise$umd$$ES6Promise = {
            'Promise': lib$es6$promise$promise$$default,
            'polyfill': lib$es6$promise$polyfill$$default
        };

        /* global define:true module:true window: true */
        if (typeof define === 'function' && define['amd']) {
            define(function() {
                return lib$es6$promise$umd$$ES6Promise;
            });
        } else if (typeof module !== 'undefined' && module['exports']) {
            module['exports'] = lib$es6$promise$umd$$ES6Promise;
        } else if (typeof this !== 'undefined') {
            this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
        }

        lib$es6$promise$polyfill$$default();
    }).call(this);
}


MSG_SEM_NET = "Este aplicativo precisa de internet. Por favor verifique sua conexão e tente de novo.";

if (window.location.href.indexOf('dev=on') !== -1) {
    localStorage.setItem('dev_version', 1);
} else if (window.location.href.indexOf('dev=off') !== -1) {
    localStorage.removeItem('dev_version');
}

APP_FW = '';
function app_url() {
    var fw = APP_FW ? APP_FW + '/' : '';
    if (localStorage.getItem('dev_version') != 1) {
        return 'http://m.multidadosti.com.br/m_apps/queropizzaw/' + fw;
    } else {
        return 'http://' + window.location.host + '/m_apps/queropizzaw/' + fw;
    }
}
function api_url() {
    if (localStorage.getItem('dev_version') != 1) {
        return 'http://m.multidadosti.com.br/m_apps/queropizzaw/api_entrypoint.php';
    } else {
        return 'http://' + window.location.host + '/m_apps/queropizzaw/api_entrypoint.php';
    }
}

function splash_show() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.show();
    }
}

function splash_hide() {
    if (typeof navigator.splashscreen == 'object') {
        navigator.splashscreen.hide();
    }
}
function gen_uid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

function clog() {
    for (var arg = 0; arg < arguments.length; ++arg) {
        if (typeof arguments[arg] == 'object') {
            console.dir(arguments[arg]);
        } else {
            console.log(arguments[arg]);
        }
    }
}

function nalert(message, title, buttonName, alertCallback) {
    if (!title)
        title = '';

    if (!buttonName)
        buttonName = 'OK';

    if (typeof navigator == 'undefined' ||
            typeof navigator.notification == 'undefined' ||
            typeof navigator.notification.alert != 'function') {
        alert(message);
    } else {
        navigator.notification.alert(message, alertCallback, title, buttonName)
    }
}

function hide_div_sem_net() {
    if (document.getElementById('divsemnet')) {
        document.body.removeChild(document.getElementById('divsemnet'));
    }
}

function show_div_sem_net() {
    hide_div_sem_net();

    var div = document.createElement('div');
    div.id = 'divsemnet';
    div.style.fontFamily = 'Arial';
    div.innerHTML = MSG_SEM_NET
            + '<br><center>'
            + '<img src="app_res/images/icons/sem_net.png">'
            + '</center>';

    document.body.appendChild(div);
}

// loads an individual script
function loadScript(src) {
    // generate promise
    return new Promise(function(fulfill, reject) {
        // create object var spl = src.split('?')[0];
        var spl = src.split('?')[0];
        var ext = spl.substring(spl.length - 4) == '.css' ? 'css' : 'js';

        //src += (src.indexOf('?') === -1 ? '?' : '&') + 'v=' + gen_uuid(); 
        if (ext == 'js') { //if filename is a external JavaScript file
            var resource = document.createElement('script')
            resource.setAttribute('type', 'text/javascript')
            resource.setAttribute('src', src)
        } else if (ext == 'css') { //if filename is an external CSS file
            var resource = document.createElement('link')
            resource.setAttribute('rel', 'stylesheet')
            resource.setAttribute('type', 'text/css')
            resource.setAttribute('href', src)
        }

        // when it loads or the ready state changes
        resource.onload = resource.onreadystatechange = function() {
            // make sure it's finished, then fullfill the promise
            if (!this.readyState || this.readyState == 'complete')
                fulfill(this);
        };

        // begin loading it
        resource.src = src;
        // add to head
        document.getElementsByTagName('head')[0].appendChild(resource);
    });
}
function runFn(fn) {
    // generate promise
    return new Promise(function(fulfill, reject) {
        fn();
        fulfill(this);
    });
}

function loadScripts(scripts) {
    return scripts.reduce(function(queue, src) {
        // once the current item on the queue has loaded, load the next one
        return queue.then(function() {
            // individual scriptc
            return typeof src == 'function' ? runFn(src) : loadScript(src);
        });
    }, Promise.resolve() /* this bit is so queue is always a promise */);
}

function loadIniScript() {
    loadScript(app_url() + 'app_loader.js' + '?v=' + gen_uid());
}

function app_connected() {
    if (typeof navigator == 'undefined' || typeof navigator.connection == 'undefined')
        return true;

    //nova API (direto em navigator.connection)
    if (typeof navigator.connection != 'undefined'
            && typeof navigator.connection.type != 'undefined'
            && navigator.connection.type == Connection.NONE)
        return false;

    return true;
}

function onOnline() {
    if (APP_OFFLINE_WARN_TO !== false) {
        window.clearTimeout(APP_OFFLINE_WARN_TO);
    }
    if (!APP_ONLINE) {
        //$.mobile.loading('hide');
    }
    APP_ONLINE = true;
}

function onOffline() {
    if (typeof APP_OFFLINE_WARN_TO !== false) {
        window.clearTimeout(APP_OFFLINE_WARN_TO);
    }

    APP_OFFLINE_WARN_TO = window.setTimeout(function() {
        APP_ONLINE = false;

        //verificar se ja esta sendo mostrada a msg de "sem net"
        if (!document.getElementById('divsemnet')) {
            nalert(MSG_SEM_NET, 'Sem conexão');
        }
    }, 5000)
}
function startApp() {
    var wait_one_int = true;
    if (app_connected()) {
        loadIniScript();
    } else {
        APP_INIT_INTERVAL = window.setInterval(function() {
            if (app_connected()) {
                window.clearInterval(APP_INIT_INTERVAL);
                loadIniScript();
            } else {
                if (wait_one_int) {
                    wait_one_int = false;
                } else {
                    splash_hide();
                    show_div_sem_net();
                }
            }
        }, 1000);
    }
}

function onDeviceready() {
    //wp8 nao tem window.alert nativo
    if (typeof window.alert == 'undefined' &&
            typeof navigator != 'undefined' &&
            typeof navigator.notification != 'undefined' &&
            typeof navigator.notification.alert == 'function')
        window.alert = navigator.notification.alert;

    //https://github.com/apache/cordova-plugin-network-information/blob/df7aac845dc7deddbdb76e89216776a802ee8b67/doc/index.md
    //Applications typically should use document.addEventListener to attach an event listener once the deviceready event fires.
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    startApp();
}

//o event onDeviceready soh existe em mobile/cordova
//!!window.cordova resolve true se for cordova
if (!!window.cordova) {
    document.addEventListener("deviceready", onDeviceready, false);
} else {
    onDeviceready();
}

