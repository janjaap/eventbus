!function(e){if("includes"in Array.prototype)e();else{var r=document.createElement("script");r.src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Array.prototype.includes",r.onload=e,r.onerror=function(){console.error("Could not load polyfills script!"),e()},document.head.appendChild(r)}}(function(){!function(e){function __webpack_require__(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,__webpack_require__),t.l=!0,t.exports}var r={};__webpack_require__.m=e,__webpack_require__.c=r,__webpack_require__.d=function(e,r,n){__webpack_require__.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},__webpack_require__.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(r,"a",r),r},__webpack_require__.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s="./src/middleware/manager.js")}({"./src/middleware/manager.js":function(e,r,n){"use strict";function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var t=function(){function defineProperties(e,r){for(var n=0;n<r.length;n++){var t=r[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(e,r,n){return r&&defineProperties(e.prototype,r),n&&defineProperties(e,n),e}}(),a=function(){function Manager(){_classCallCheck(this,Manager),this.middlewareFunctions={}}return t(Manager,[{key:"createClassEntry",value:function(e){!1==={}.propertyIsEnumerable.call(this.middlewareFunctions,e)&&(this.middlewareFunctions[e]=[])}},{key:"createMethodEntry",value:function(e,r){this.middlewareFunctions[e][r]||(this.middlewareFunctions[e][r]=[])}},{key:"use",value:function(e){var r=this,n=e.constructor.name;this.createClassEntry(n);for(var t=arguments.length,a=Array(t>1?t-1:0),o=1;o<t;o++)a[o-1]=arguments[o];return a.forEach(function(t){Manager.getClassMethodNames(t).forEach(function(a){var o=t[a].bind(t);r.createMethodEntry(n,a),r.middlewareFunctions[n][a].unshift(o(e))})}),Object.keys(this.middlewareFunctions[n]).forEach(function(t){var a=e[t];if(!a)throw new Error("[Manager] Target method '"+t+"' does not exist");var o=a.bind(e),i=r.middlewareFunctions[n][t],c=Manager.compose(i)(o);e[t]=c}),this}}],[{key:"getClassMethodNames",value:function(e){var r=Object.getPrototypeOf(e);return Object.getOwnPropertyNames(r).filter(function(e){return"constructor"!==e})}},{key:"compose",value:function(e){var r=e.length;if(0===r)return function(e){return e};if(1===r)return e[0];var n=e.pop();return function(){return e.reduceRight(function(e,r){return r(e)},n.apply(void 0,arguments))}}}]),Manager}();r.default=a}})});