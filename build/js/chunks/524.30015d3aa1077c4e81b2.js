"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[524],{524:(e,r,t)=>{t.r(r),t.d(r,{default:()=>I});var n=t(540),i=t(349),o=t(31);function a(e){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(e)}function c(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,l(n.key),n)}}function l(e){var r=function(e){if("object"!=a(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var t=r.call(e,"string");if("object"!=a(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==a(r)?r:r+""}var s=function(){return e=function e(r){var t=r.id,n=void 0===t?null:t,i=r.type,o=r.parent,a=r.renderer,c=r.cx,l=r.cy,s=r.radius,u=r.borderColor,d=r.borderThickness,f=r.fillColor,h=r.drawCenterPoint,y=void 0!==h&&h,p=r.drawRadiusLine,b=void 0!==p&&p;!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,e),this.id=n,this.parent=o,this.cx=c,this.cy=l,this.radius=s,this.fillColor=f,this.borderColor=u,this.borderThickness=d,this.type=i,this.renderer=a,this.drawCenterPoint=y,this.drawRadiusLine=b},(r=[{key:"render",value:function(){(0,o.hp)(this.renderer,{cx:this.cx,cy:this.cy,r:this.radius,borderThickness:this.borderThickness,borderColor:this.borderColor,fillColor:this.fillColor}),!0===this.drawCenterPoint&&(0,o.hp)(this.renderer,{cx:this.cx,cy:this.cy,r:1,borderThickness:this.borderThickness,borderColor:this.borderColor,fillColor:this.borderColor})}}])&&c(e.prototype,r),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,r}();function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function d(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(d=function(){return!!e})()}function f(e){return f=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},f(e)}function h(e,r){return h=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e},h(e,r)}var y=function(e){function r(e){return e.id,e.type,e.parent,e.renderer,e.cx,e.cy,e.radius,e.borderColor,e.borderThickness,e.fillColor,e.drawCenterPoint,e.drawRadiusLine,function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,r),function(e,r,t){return r=f(r),function(e,r){if(r&&("object"==u(r)||"function"==typeof r))return r;if(void 0!==r)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,d()?Reflect.construct(r,t||[],f(e).constructor):r.apply(e,t))}(this,r,[arguments[0]])}return function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),r&&h(e,r)}(r,e),t=r,Object.defineProperty(t,"prototype",{writable:!1}),t;var t}(s);function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}function b(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,v(n.key),n)}}function v(e){var r=function(e){if("object"!=p(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var t=r.call(e,"string");if("object"!=p(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==p(r)?r:r+""}function w(e,r){return e.get(x(e,r))}function x(e,r,t){if("function"==typeof e?e===r:e.has(r))return arguments.length<3?r:t;throw new TypeError("Private element is not present on this object")}var m=new WeakMap,C=function(){return e=function e(r){var t=r.color,n=r.length,i=void 0===n?100:n,o=r.thickness,a=void 0===o?1:o,c=r.parent;!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,e),function(e,r,t){(function(e,r){if(r.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")})(e,r),r.set(e,t)}(this,m,[]),this.length=i,this.color=t,this.thickness=a,this.parent=c},(r=[{key:"push",value:function(e){"number"==typeof e.x&&"number"==typeof e.y&&(w(m,this).length>this.length&&w(m,this).shift(),w(m,this).push(e))}},{key:"getLastPoint",value:function(){return w(m,this).length>0&&(0,o.Ev)(w(m,this))}},{key:"getLength",value:function(){return w(m,this).length}},{key:"clear",value:function(){var e,r;r=[],(e=m).set(x(e,this),r)}},{key:"render",value:function(){var e=this;this.parent.renderer.beginPath(),this.parent.renderer.strokeStyle=this.color,this.parent.renderer.lineWidth=1;var r=!0;w(m,this).forEach((function(t){r?(e.parent.renderer.moveTo(t.x,t.y),r=!1):e.parent.renderer.lineTo(t.x,t.y)})),this.parent.renderer.stroke()}}])&&b(e.prototype,r),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,r}();function R(e){return R="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},R(e)}function T(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,g(n.key),n)}}function g(e){var r=function(e){if("object"!=R(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var t=r.call(e,"string");if("object"!=R(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==R(r)?r:r+""}function P(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(P=function(){return!!e})()}function O(e){return O=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},O(e)}function k(e,r){return k=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,r){return e.__proto__=r,e},k(e,r)}var S=function(e){function r(e){var t,n=e.id,i=void 0===n?null:n,a=e.type,c=e.parent,l=e.renderer,s=e.cx,u=e.cy,d=e.radius,f=e.borderColor,h=e.borderThickness,y=e.fillColor,p=e.drawCenterPoint,b=void 0!==p&&p,v=e.drawRadiusLine,w=void 0!==v&&v,x=e.origin,m=e.offset,T=e.angle,g=void 0===T?0:T,k=e.traceLength,S=void 0===k?1e3:k,U=e.traceColor,j=void 0===U?(0,o.oU)("red"):U,E=e.traceThickness,D=e.radiusOfTracePoint,B=e.invertRotationDirection,A=void 0!==B&&B;return function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,r),(t=function(e,r,t){return r=O(r),function(e,r){if(r&&("object"==R(r)||"function"==typeof r))return r;if(void 0!==r)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(e,P()?Reflect.construct(r,t||[],O(e).constructor):r.apply(e,t))}(this,r,[{id:i,type:a,parent:c,renderer:l,cx:s,cy:u,radius:d,borderColor:f,borderThickness:h,fillColor:y,drawCenterPoint:b,drawRadiusLine:w}])).origin=x||{x:t.parent.cx,y:t.parent.cy},t.offset=m,t.angle=g,t.globalAngle=0,t.staticCX=s,t.staticCY=u-m,t.trace=new C({color:j,length:S,thickness:E,parent:t}),t.radiusOfTracePoint=D,t.invertRotationDirection=A,t}return function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(r&&r.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),r&&k(e,r)}(r,e),t=r,n=[{key:"rotate",value:function(e){this.angle+=e,this.angle>=360&&(this.angle=0)}},{key:"moveAroundOrigin",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.globalAngle=(this.globalAngle+e)%360;var r=(0,o.sR)(this.origin.x,this.origin.y,this.staticCX,this.staticCY,this.globalAngle);r&&"number"==typeof r.x&&"number"==typeof r.y&&(this.cy=r.y-this.offset,this.cx=r.x)}},{key:"render",value:function(){var e=this,r=this.cx+0,t=this.cy+this.offset;(0,o.hp)(this.renderer,{cx:r,cy:t,r:this.radius,borderThickness:this.borderThickness,borderColor:this.borderColor,fillColor:this.fillColor}),!0===this.drawCenterPoint&&(0,o.hp)(this.renderer,{cx:r,cy:t,r:1,borderThickness:this.borderThickness,borderColor:this.borderColor,fillColor:this.borderColor});var n=(0,o.sR)(r,t,r,t+this.radiusOfTracePoint,this.angle);(0==this.trace.getLength()||function(r){if(e.trace.length>0){var t=e.trace.getLastPoint();return(0,o.Q$)(t.x,t.y,r.x,r.y)>=3}return!1}(n))&&this.trace.push(n),!0===this.drawRadiusLine&&((0,o.V6)(this.renderer,{x1:r,y1:t,x2:n.x,y2:n.y,thickness:this.borderThickness,color:this.borderColor}),(0,o.hp)(this.renderer,{cx:n.x,cy:n.y,r:1,borderThickness:1,borderColor:(0,o.oU)("white"),fillColor:(0,o.oU)("white")}))}}],n&&T(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,n}(s);function U(e){return U="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},U(e)}function j(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,E(n.key),n)}}function E(e){var r=function(e){if("object"!=U(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var t=r.call(e,"string");if("object"!=U(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==U(r)?r:r+""}var D=function(){return e=function e(r){var t=r.cx,n=r.cy,i=r.label,a=void 0===i?"":i,c=r.animationSpeed,l=r.externalRadius,s=r.internalRadius,u=r.drawCenterPoint,d=r.externalBorderColor,f=void 0===d?(0,o.oU)("white",.45):d,h=r.internalBorderColor,p=void 0===h?(0,o.oU)("white",.45):h,b=r.traceColor,v=void 0===b?(0,o.oU)("white"):b,w=r.traceThickness,x=void 0===w?1:w,m=r.traceLength,C=r.drawRadiusLine,R=r.renderer,T=r.invertRotationDirection,g=r.radiusOfTracePoint,P=r.internalRotationGain,O=void 0===P?1:P,k=r.internalInitialAngle,U=void 0===k?0:k;!function(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}(this,e),this.renderer=R,this.cx=t,this.cy=n,this.label=a,this.animationSpeed=c,this.internalRotationGain=O,this.drawCenterPoint=u,this.traceColor=v,this.proportion={externalRadius:l,internalRadius:s,radiusOfTracePoint:g};var j=l-s;this.skeleton=[new y({id:0,type:"external",cx:this.cx,cy:this.cy,parent:this,radius:l,fillColor:"transparent",borderColor:f,borderThickness:1,renderer:this.renderer,drawCenterPoint:u,drawRadiusLine:C}),new S({id:1,type:"internal",cx:this.cx,cy:this.cy,angle:U,offset:-j,radius:s,fillColor:"transparent",borderColor:p,traceLength:m,traceThickness:x,traceColor:v,borderThickness:1,drawCenterPoint:u,drawRadiusLine:C,parent:this,renderer:this.renderer,invertRotationDirection:T,radiusOfTracePoint:g})]},r=[{key:"update",value:function(e,r){var t=this;this.skeleton.forEach((function(n){if("drawCenterPoint"===e&&(n.drawCenterPoint=r),"invertRotationDirection"===e||"radiusOfTracePoint"===e||"drawRadiusLine"==e){var i=t.skeleton.filter((function(e){return"internal"===e.type}));i.forEach((function(t){t[e]=r})),"radiusOfTracePoint"===e&&(t.proportion.radiusOfTracePoint=r)}if("traceLength"==e){var o=t.skeleton.filter((function(e){return"internal"===e.type}));o.forEach((function(e){e.trace.length=r}))}if("external"===n.type&&"externalRadius"===e){var a=n,c=t.skeleton.filter((function(e){return"internal"===e.type}));a.radius=r,t.proportion.externalRadius=r,c.forEach((function(e){var t=e.offset>=0?1:-1;e.offset=t*(r-e.radius),e.staticCX=a.cx,e.staticCY=a.cy+t*(a.radius-e.radius),e.trace.clear()}))}if("internal"===n.type&&"internalRadius"===e){var l=t.skeleton.find((function(e){return"external"===e.type})),s=n;s.radius=r,t.proportion.internalRadius=r;var u=s.offset>=0?1:-1;s.offset=u*(l.radius-s.radius),s.staticCX=l.cx,s.staticCY=l.cy+u*(l.radius-s.radius),s.trace.clear()}}))}},{key:"animate",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;e/=5;var r=this.skeleton.find((function(e){return"external"==e.type}));this.skeleton.filter((function(e){return"internal"==e.type})).forEach((function(t){var n=(r.radius-t.radius)/t.radius,i=(!0===t.invertRotationDirection?-1:1)*e,o=t.parent.internalRotationGain;t.rotate(i*n*o),t.moveAroundOrigin(e)}))}},{key:"render",value:function(){this.skeleton.forEach((function(e){e.trace&&e.trace.length>0&&e.trace.render(),e.render()}))}}],r&&j(e.prototype,r),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,r}();function B(e){return B="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},B(e)}function A(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function L(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?A(Object(t),!0).forEach((function(r){_(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):A(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function _(e,r,t){return(r=function(e){var r=function(e){if("object"!=B(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var t=r.call(e,"string");if("object"!=B(t))return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==B(r)?r:r+""}(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function V(e,r){(null==r||r>e.length)&&(r=e.length);for(var t=0,n=Array(r);t<r;t++)n[t]=e[t];return n}function F(e,r){var t=document.querySelector("#root").querySelector("canvas"),n=t.getContext("2d",{willReadFrequently:!0}),i=300,a=200;t.width=600,t.height=400;var c=["externalRadius","internalRadius","drawCenterPoint","drawRadiusLine","speed","traceLength","invertRotationDirection","radiusOfTracePoint"],l=function(){return c.reduce((function(e,t){return e[t]=r.getState(t),e}),{})},s=r.getState("speed"),u=(r.getState("traceLength"),{0:function(e,r,t,n){return[new D(L(L({label:"Custom curve",renderer:e,cx:300,cy:200},n),{},{traceColor:(0,o.oU)("red")}))]}(n,0,0,l()),1:function(e,r,t,n){return[new D(L(L({label:"Deltoid",renderer:e,cx:90,cy:80},n),{},{externalRadius:50,internalRadius:16.66666666,radiusOfTracePoint:10,traceColor:(0,o.oU)("brightRed"),traceThickness:.1})),new D(L(L({label:"Deltoid",renderer:e,cx:90,cy:t},n),{},{externalRadius:50,internalRadius:16.66666666,radiusOfTracePoint:16.66666666,traceColor:(0,o.oU)("deepOrange"),traceThickness:.1})),new D(L(L({label:"Deltoid",renderer:e,cx:90,cy:320},n),{},{externalRadius:50,internalRadius:16.66666666,radiusOfTracePoint:31,traceColor:(0,o.oU)("amber"),traceThickness:.1})),new D(L(L({label:"Astroid",renderer:e,cx:230,cy:80},n),{},{externalRadius:50,internalRadius:12.5,radiusOfTracePoint:5,traceColor:(0,o.oU)("green"),traceThickness:.1})),new D(L(L({label:"Astroid",renderer:e,cx:230,cy:t},n),{},{externalRadius:50,internalRadius:12.5,radiusOfTracePoint:12.5,traceColor:(0,o.oU)("teal"),traceThickness:.1})),new D(L(L({label:"Astroid",renderer:e,cx:230,cy:320},n),{},{externalRadius:50,internalRadius:12.5,radiusOfTracePoint:25,traceColor:(0,o.oU)("blue"),traceThickness:.1})),new D(L(L({label:"Pentoid",renderer:e,cx:370,cy:80},n),{},{externalRadius:50,internalRadius:10,radiusOfTracePoint:3,traceColor:(0,o.oU)("indigo"),traceThickness:.1})),new D(L(L({label:"Pentoid",renderer:e,cx:370,cy:t},n),{},{externalRadius:50,internalRadius:10,radiusOfTracePoint:10,traceColor:(0,o.oU)("deepPurple"),traceThickness:.1})),new D(L(L({label:"Pentoid",renderer:e,cx:370,cy:320},n),{},{externalRadius:50,internalRadius:10,radiusOfTracePoint:20,traceColor:(0,o.oU)("fuchsia"),traceThickness:.1})),new D(L(L({label:"Exoid",renderer:e,cx:510,cy:80},n),{},{externalRadius:50,internalRadius:8.33333,radiusOfTracePoint:3,traceColor:(0,o.oU)("mediumVioletRed"),traceThickness:.1})),new D(L(L({label:"Exoid",renderer:e,cx:510,cy:t},n),{},{externalRadius:50,internalRadius:8.33333,radiusOfTracePoint:8.33333,traceColor:(0,o.oU)("crimson"),traceThickness:.1})),new D(L(L({label:"Exoid",renderer:e,cx:510,cy:320},n),{},{externalRadius:50,internalRadius:8.33333,radiusOfTracePoint:18,traceColor:(0,o.oU)("brightRed"),traceThickness:.1}))]}(n,0,a,l()),2:function(e,r,t,n){return[new D(L(L({label:"Circle",renderer:e,cx:90,cy:80},n),{},{externalRadius:50,internalRadius:25,radiusOfTracePoint:25,traceColor:(0,o.oU)("brightRed"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Cardioid",renderer:e,cx:90,cy:t},n),{},{externalRadius:50,internalRadius:16.6666666666,radiusOfTracePoint:16.6666666666,traceColor:(0,o.oU)("deepOrange"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Two leaf rose",renderer:e,cx:90,cy:320},n),{},{externalRadius:50,internalRadius:12.5,radiusOfTracePoint:12.5,traceColor:(0,o.oU)("amber"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Three leaf rose",renderer:e,cx:230,cy:80},n),{},{externalRadius:50,internalRadius:10,radiusOfTracePoint:6,traceColor:(0,o.oU)("green"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Three leaf rose",renderer:e,cx:230,cy:t},n),{},{externalRadius:50,internalRadius:10,radiusOfTracePoint:9.99,traceColor:(0,o.oU)("teal"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Three leaf rose",renderer:e,cx:230,cy:320},n),{},{externalRadius:50,internalRadius:10,radiusOfTracePoint:20,traceColor:(0,o.oU)("blue"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Four leaf rose",renderer:e,cx:370,cy:80},n),{},{externalRadius:50,internalRadius:8.33333,radiusOfTracePoint:3,traceColor:(0,o.oU)("indigo"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Four leaf rose",renderer:e,cx:370,cy:t},n),{},{externalRadius:50,internalRadius:8.33333,radiusOfTracePoint:8.33333,traceColor:(0,o.oU)("deepPurple"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Four leaf rose",renderer:e,cx:370,cy:320},n),{},{externalRadius:50,internalRadius:8.33333,radiusOfTracePoint:18,traceColor:(0,o.oU)("fuchsia"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Five leaf rose",renderer:e,cx:510,cy:80},n),{},{externalRadius:50,internalRadius:7.142857142857143,radiusOfTracePoint:3,traceColor:(0,o.oU)("mediumVioletRed"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Five leaf rose",renderer:e,cx:510,cy:t},n),{},{externalRadius:50,internalRadius:7.142857142857143,radiusOfTracePoint:7.142857142857143,traceColor:(0,o.oU)("crimson"),traceThickness:.1,invertRotationDirection:!1})),new D(L(L({label:"Five leaf rose",renderer:e,cx:510,cy:320},n),{},{externalRadius:50,internalRadius:7.142857142857143,radiusOfTracePoint:18,traceColor:(0,o.oU)("brightRed"),traceThickness:.1,invertRotationDirection:!1}))]}(n,0,a,l()),3:function(e,r,t,n){return[new D(L(L({label:"Spiral curve",renderer:e,cx:300,cy:200},n),{},{traceColor:(0,o.oU)("indigo"),externalRadius:190,internalRadius:95,internalInitialAngle:-180,internalRotationGain:1.015,radiusOfTracePoint:95,traceLength:1e4,traceThickness:.1,invertRotationDirection:!1}))]}(n,0,0,l()),4:function(e,r,t,n){return[new D(L(L({label:"Circle",renderer:e,cx:150,cy:123.33333333333331},n),{},{externalRadius:65,internalRadius:16.25,radiusOfTracePoint:16.25,traceColor:(0,o.oU)("yellow"),traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:123.33333333333331},n),{},{externalRadius:65,internalRadius:26,radiusOfTracePoint:26,traceColor:(0,o.oU)("amber"),traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:450,cy:123.33333333333331},n),{},{externalRadius:65,internalRadius:27.8571,radiusOfTracePoint:27.8571,traceColor:(0,o.oU)("deepOrange"),traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:150,cy:276.6666666666667},n),{},{externalRadius:65,internalRadius:14.44444444,radiusOfTracePoint:14.44444444,traceColor:(0,o.oU)("indigo"),traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:276.6666666666667},n),{},{externalRadius:65,internalRadius:20.3125,radiusOfTracePoint:20.3125,traceColor:(0,o.oU)("purple"),traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:450,cy:276.6666666666667},n),{},{externalRadius:65,internalRadius:28.88888888,radiusOfTracePoint:28.88888888,traceColor:(0,o.oU)("brightRed"),traceThickness:.1}))]}(n,i,0,l()),5:function(e,r,t,n){var i=["rgba(220, 20, 60, 1.0)","rgba(202, 18, 79, 1.0)","rgba(185, 16, 99, 1.0)","rgba(168, 14, 118, 1.0)","rgba(150, 12, 138, 1.0)","rgba(133, 10, 157, 1.0)","rgba(116, 8, 177, 1.0)","rgba(98, 6, 196, 1.0)","rgba(81, 4, 216, 1.0)","rgba(64, 2, 235, 1.0)","rgba(47, 0, 255, 1.0)"];return[new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:190,internalRadius:47.5,radiusOfTracePoint:47.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[0],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:170,internalRadius:42.5,radiusOfTracePoint:42.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[1],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:150,internalRadius:37.5,radiusOfTracePoint:37.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[2],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:130,internalRadius:32.5,radiusOfTracePoint:32.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[3],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:110,internalRadius:27.5,radiusOfTracePoint:27.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[4],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:90,internalRadius:22.5,radiusOfTracePoint:22.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[5],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:70,internalRadius:17.5,radiusOfTracePoint:17.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[6],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:50,internalRadius:12.5,radiusOfTracePoint:12.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[7],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:30,internalRadius:7.5,radiusOfTracePoint:7.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[8],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:20,internalRadius:5,radiusOfTracePoint:5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[9],traceThickness:.1})),new D(L(L({label:"Circle",renderer:e,cx:r,cy:t},n),{},{externalRadius:10,internalRadius:2.5,radiusOfTracePoint:2.5,externalBorderColor:(0,o.oU)("white",.1),internalBorderColor:(0,o.oU)("white",.1),traceColor:i[10],traceThickness:.1}))]}(n,i,a,l())}),d=1,f=u[d]||[],h="";r.subscribe((function(t,n,i){f.forEach((function(e,r){if(0==d)for(var i=l(),o=0,a=Object.entries(i);o<a.length;o++){var c=(h=a[o],y=2,function(e){if(Array.isArray(e))return e}(h)||function(e,r){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,i,o,a,c=[],l=!0,s=!1;try{if(o=(t=t.call(e)).next,0===r){if(Object(t)!==t)return;l=!1}else for(;!(l=(n=o.call(t)).done)&&(c.push(n.value),c.length!==r);l=!0);}catch(e){s=!0,i=e}finally{try{if(!l&&null!=t.return&&(a=t.return(),Object(a)!==a))return}finally{if(s)throw i}}return c}}(h,y)||function(e,r){if(e){if("string"==typeof e)return V(e,r);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?V(e,r):void 0}}(h,y)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),u=c[0],f=c[1];e.update(u,f)}var h,y;"speed"==t&&(s=n)})),"preset"!=t&&"internalRadius"!=t&&"externalRadius"!=t&&"radiusOfTracePoint"!=t||(d=r.getState("preset"),h="",(f=u[d]).forEach((function(e,r){var t=(0,o.pU)(e.proportion.externalRadius/e.proportion.internalRadius,3);h+='\n                <br>\n                <span class="small-font display-item__list-item">\n                    <span \n                        class="small-font gray-word-bubble" \n                        style="color: '.concat(e.traceColor,"; background: ").concat((0,o.Hv)(e.traceColor,.25),';"\n                    >').concat(e.label," #").concat(r+1,"</span><span> - R/r = ").concat(t,"/1, d ").concat(e.proportion.internalRadius==e.proportion.radiusOfTracePoint?"=":e.proportion.radiusOfTracePoint>e.proportion.internalRadius?">":"<"," r</span>\n                </span>\n            ")})),e.updateValue("cycloids_info","".concat(h)))}));var y=function(){n.clearRect(0,0,600,400),(0,o.tk)(n,{x:0,y:0,width:600,height:400,fillColor:(0,o.oU)("black",.98)}),f.forEach((function(e){e.animate(s),e.render()})),requestAnimationFrame(y)};requestAnimationFrame(y),r.setState("preset",r.getState("preset"))}const I=function(){return n.createElement(i.A,{title:"Cycloid motion",desciption:"",uiTree:{description:{type:"display-infobox",label:"Description",text:"A cycloid is the curve traced by a point on the circumference of a circle as it rolls along a straight line. The key condition in this motion is that the circle rolls without slipping. A specific example of a cycloid is the epicycloid, where a circle rolls inside a larger circle. An example of an hypocycloid is demonstrated in this interactive scene."},cycloids_info:{type:"display-item",label:"Rendered curves"},preset:{type:"preset-dropdown-list",label:"Preset",selectedByDefault:1,options:[{name:"Playground",allowedElements:["*"]},{name:"Hypocycloid overview",allowedElements:["speed"]},{name:"Flat roses curves overview",allowedElements:["speed"]},{name:"Spiral",allowedElements:["speed"]},{name:"Stars",allowedElements:["speed"]},{name:"Astroids",allowedElements:["speed"]}]},externalRadius:{type:"input",label:"Radius of external circle",defaultValue:120,minValue:60,maxValue:195},internalRadius:{type:"input",label:"Radius of inner circle",defaultValue:30,minValue:10,maxValue:100},radiusOfTracePoint:{type:"input",label:"Radius of trace point",minValue:3,defaultValue:30,maxValue:100},traceLength:{type:"input",label:"Trace length",minValue:200,defaultValue:600,maxValue:1e4},speed:{type:"input",label:"Speed",minValue:0,defaultValue:3,maxValue:20},invertRotationDirection:{type:"checkbox",label:"Invert circles rotation dirtection",state:!0},drawCenterPoint:{type:"checkbox",label:"Draw center point",state:!0},drawRadiusLine:{type:"checkbox",label:"Draw radius line",state:!0}},code:F})}}}]);