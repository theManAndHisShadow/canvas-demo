"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[349],{349:(e,t,n)=>{n.d(t,{A:()=>N});var r=n(540);function a(e){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a(e)}function i(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,o(r.key),r)}}function o(e){var t=function(e){if("object"!=a(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=a(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==a(t)?t:t+""}function s(e,t,n){(function(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")})(e,t),t.set(e,n)}function l(e,t){return e.get(function(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object")}(e,t))}var c=new WeakMap,u=new WeakMap,d=function(){return e=function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),s(this,c,{}),s(this,u,[])},(t=[{key:"subscribe",value:function(e){l(u,this).push(e)}},{key:"setState",value:function(e,t){var n=l(c,this)[e];l(c,this)[e]=t,l(u,this).forEach((function(r){return r(e,t,n)}))}},{key:"getState",value:function(e){return l(c,this)[e]}}])&&i(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,t}();function p(e,t,n){m(e,t),t.set(e,n)}function m(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}function f(e,t){return e.get(v(e,t))}function h(e,t,n){return e.set(v(e,t),n),n}function v(e,t,n){if("function"==typeof e?e===t:e.has(t))return arguments.length<3?t:n;throw new TypeError("Private element is not present on this object")}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function y(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(y=function(){return!!e})()}function E(e){return E=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},E(e)}function k(e,t){return k=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},k(e,t)}function T(e){return T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},T(e)}function S(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,L(r.key),r)}}function w(e,t,n){return t&&_(e.prototype,t),n&&_(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function L(e){var t=function(e){if("object"!=T(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=T(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==T(t)?t:t+""}var g=function(e){function t(e){var n,r,a,i,o=e.display,s=e.controls,l=e.timestamp;return S(this,t),(r=this,a=t,a=E(a),n=function(e,t){if(t&&("object"==T(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(r,y()?Reflect.construct(a,i||[],E(r).constructor):a.apply(r,i))).currentSceneTimestamp=l,n.states=new d,n.display=new V(o),n.controls=new j(s,n),n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&k(e,t)}(t,e),w(t,[{key:"render",value:function(e){if(e){this.display.clearRoot(),this.controls.clearRoot();for(var t=function(e){if(Array.isArray(e))return b(e)}(a=Object.keys(e))||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(a)||function(e,t){if(e){if("string"==typeof e)return b(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?b(e,t):void 0}}(a)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}();t.length>0;){var n=t.shift(),r=e[n];"display-item"==r.type&&this.display.renderDisplayItem(n,r),"display-float-tile"==r.type&&this.display.renderDisplayFloatTile(n,r),"display-spacer"==r.type&&this.display.renderSpacer(),"display-infobox"==r.type&&this.display.renderInfoBox(n,r),"range-slider"==r.type&&this.controls.renderRangeSlider(n,r),"main-action-button"==r.type&&this.controls.renderMainActionButton(n,r),"button"==r.type&&this.controls.renderButton(n,r),"checkbox"==r.type&&this.controls.renderCheckbox(n,r),"input"==r.type&&this.controls.renderInput(n,r),"option-selector"==r.type&&this.controls.renderOptionSelector(n,r),"option-dropdown-list"==r.type&&this.controls.renderOptionDropdownList(n,r),"preset-dropdown-list"==r.type&&this.controls.renderPresetDropdownList(n,r),0==t.length&&this.dispatchEvent("renderEnd")}}var a}}])}(function(){return w((function e(){S(this,e),this.events={}}),[{key:"addEventListener",value:function(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)}},{key:"dispatchEvent",value:function(e,t){this.events[e]&&this.events[e].forEach((function(e){return e(t)}))}}])}()),x=new WeakMap,A=new WeakMap,C=new WeakMap,M=new WeakSet,j=function(){return w((function e(t,n){var r;S(this,e),m(this,r=M),r.add(this),p(this,x,void 0),p(this,A,"data-rendered-control-element"),p(this,C,"data-main-action-button"),this.parent=n,h(x,this,{root:t}),this.currentSceneTimestamp=this.parent.currentSceneTimestamp,this.blockedSceneTimestamp=!1}),[{key:"clearRoot",value:function(){f(x,this).root.innerHTML=""}},{key:"appendToHTML",value:function(e,t){var n=t.element;t.label,t.value,f(x,this)[e]=t,f(x,this).root.appendChild(n)}},{key:"renderCheckbox",value:function(e,t){var n=this,r=document.createElement("div");r.id=e;var a=document.createElement("span");a.innerText=t.label+": ",a.classList.add("controls__checkbox-label","controls__option-label");var i=document.createElement("input");i.type="checkbox",i.classList.add("controls__checkbox-checkbox"),i.checked=t.state,i.setAttribute(f(A,this),this.currentSceneTimestamp),this.parent.states.setState(e,t.state),i.addEventListener("click",(function(t){n.blockedSceneTimestamp!==n.currentSceneTimestamp&&n.parent.states.setState(e,i.checked)})),r.appendChild(a),r.appendChild(i),this.appendToHTML(e,{element:r,label:a,value:i})}},{key:"renderInput",value:function(e,t){var n=this;t.minValue="number"==typeof t.minValue?t.minValue:t.defaultValue;var r=document.createElement("div");r.id=e;var a=document.createElement("span");a.classList.add("controls__input-label","controls__option-label"),a.innerText=t.label+": ";var i=document.createElement("input");i.classList.add("controls__input-input"),i.type="number",i.min=t.minValue,i.max=t.maxValue,i.placeholder="max "+t.maxValue,i.setAttribute(f(A,this),this.currentSceneTimestamp),i.value=t.defaultValue,this.parent.states.setState(e,t.defaultValue),i.addEventListener("change",(function(r){Number(i.value)>t.maxValue&&(i.value=t.maxValue),Number(i.value)<t.minValue&&(i.value=t.minValue),n.blockedSceneTimestamp!==n.currentSceneTimestamp&&n.parent.states.setState(e,Number(i.value))})),r.appendChild(a),r.appendChild(i),this.appendToHTML(e,{element:r,label:a,value:i})}},{key:"renderRangeSlider",value:function(e,t){var n=this,r=document.createElement("div");r.id=e;var a=document.createElement("span");a.innerText=t.startLabel,a.classList.add("controls__range-slider-start-label","controls__option-label");var i=document.createElement("input");i.type="range",i.min=t.minValue,i.max=t.maxValue,i.value=t.defaultValue,i.classList.add("controls__range-slider"),i.setAttribute(f(A,this),this.currentSceneTimestamp),i.checked=t.state;var o=document.createElement("span");o.innerText=t.endLabel,o.classList.add("controls__range-slider-end-label","controls__option-label"),this.parent.states.setState(e,t.defaultValue),i.addEventListener("mousemove",(function(t){n.blockedSceneTimestamp!==n.currentSceneTimestamp&&(i.title=i.value,n.parent.states.setState(e,i.value))})),r.appendChild(a),r.appendChild(i),r.appendChild(o),this.appendToHTML(e,{element:r,label:[a,o],value:i})}},{key:"renderButton",value:function(e,t){var n=this,r=document.createElement("div");r.id=e;var a=document.createElement("span");a.innerHTML=t.label+": ";var i=document.createElement("button");i.classList.add("controls__button"),i.setAttribute(f(A,this),this.currentSceneTimestamp),i.textContent=t.text,i.addEventListener("click",(function(){if(n.blockedSceneTimestamp!==n.currentSceneTimestamp){var t=Date.now();n.parent.states.setState(e,t)}})),r.appendChild(a),r.appendChild(i),this.appendToHTML(e,{element:r,label:a,value:i})}},{key:"renderMainActionButton",value:function(e,t){var n=this,r=document.createElement("div");r.id=e;var a=document.createElement("div");a.classList.add("hr-line-separator");var i=document.createElement("button");if(i.classList.add("controls__main-action-button"),i.setAttribute(f(C,this),""),i.setAttribute(f(A,this),this.currentSceneTimestamp),i.textContent=t.text,i.addEventListener("click",(function(){if(n.blockedSceneTimestamp!==n.currentSceneTimestamp){var t=Date.now();n.parent.states.setState(e,t)}})),r.appendChild(a),r.appendChild(i),!0===t.blockControlDuringExecution){var o=e+"__status";this.parent.states.setState(o,"not-started");var s=v(M,this,O).call(this,this.currentSceneTimestamp);this.parent.states.subscribe((function(e,t,n){e==o&&("in-progress"==t?s.block():s.unblock())}))}this.appendToHTML(e,{element:r,label:null,value:i})}},{key:"renderOptionSelector",value:function(e,t){var n=this,r=document.createElement("div");r.id=e;var a=document.createElement("span");a.classList.add("controls__option-selector-label","controls__option-label"),a.innerText=t.label+": ";var i=document.createElement("div");i.classList.add("controls__buttons-container"),t.optionNames.forEach((function(t,a){var o=document.createElement("button");o.classList.add("controls__option-selector-button"),o.setAttribute(f(A,n),n.currentSceneTimestamp),o.textContent=t,o.setAttribute("data-preset-num",a),0==a&&o.setAttribute("data-selected-option",!0),o.addEventListener("click",(function(){if(n.blockedSceneTimestamp!==n.currentSceneTimestamp){var t=Array.from(r.querySelectorAll('[data-selected-option="true"]'));t.length>0&&t.forEach((function(e){return e.removeAttribute("data-selected-option")})),o.setAttribute("data-selected-option",!0),n.parent.states.setState(e,Number(a))}})),i.appendChild(o)})),this.parent.states.setState(e,t.defaultValue),r.appendChild(a),r.appendChild(i),this.appendToHTML(e,{element:r,label:a,value:i})}},{key:"renderOptionDropdownList",value:function(e,t){var n=this,r=document.createElement("div");r.id=e;var a=document.createElement("span");a.classList.add("controls__option-dropdown-list-label","controls__option-dropdown-list-label"),a.innerText=t.label+": ";var i=document.createElement("select");return i.classList.add("controls__option-dropdown-list-container"),t.options.forEach((function(r,a){var o=document.createElement("option");o.classList.add("controls__option-dropdown-list-button"),o.setAttribute(f(A,n),n.currentSceneTimestamp),o.textContent=r.name,o.setAttribute("data-preset-num",a),t.selectedByDefault===a&&(o.setAttribute("selected",""),n.parent.states.setState(e,Number(a))),i.appendChild(o)})),i.addEventListener("change",(function(t){var r=Number(i.selectedOptions[0].getAttribute("data-preset-num"));n.parent.states.setState(e,Number(r))})),r.appendChild(a),r.appendChild(i),this.appendToHTML(e,{element:r,label:a,value:i}),r}},{key:"renderPresetDropdownList",value:function(e,t){var n=this,r=this.renderOptionDropdownList(e,t).querySelector("select"),a=function(){var a,i=Object.keys(f(x,n)),o=Number(r.selectedOptions[0].getAttribute("data-preset-num")),s=t.options[o].allowedElements;if(!Array.isArray(s))throw new Error("option.allowedElements type must be an array!");a=0===s.length?i.filter((function(t){return t!==e&&"root"!==t})):s.includes("*")?[]:i.filter((function(t){return t!==e&&"root"!==t&&!s.includes(t)})),i.forEach((function(e){if("root"!==e){var t=f(x,n)[e].element;a.includes(e)?t.classList.add("hidden"):t.classList.remove("hidden")}}))};r.addEventListener("change",a),this.parent.addEventListener("renderEnd",a)}}])}();function O(e){var t=e,n=this;return{block:function(){n.blockedSceneTimestamp=t,Array.from(f(x,n).root.querySelectorAll("[".concat(f(A,n),"]"))).forEach((function(e){e.getAttribute(f(A,n))==t&&("INPUT"==e.tagName?e.setAttribute("disabled",""):e.classList.add("disabled"))}))},unblock:function(){n.blockedSceneTimestamp=0,Array.from(f(x,n).root.querySelectorAll("[".concat(f(A,n),"]"))).forEach((function(e){e.getAttribute(f(A,n))==t&&("INPUT"==e.tagName?e.removeAttribute("disabled"):e.classList.remove("disabled"))}))}}}var H=new WeakMap,D=new WeakMap,P=new WeakMap,V=function(){return w((function e(t){S(this,e),p(this,H,void 0),p(this,D,"scene-info__"),p(this,P,"data-dynamiclly-rendered"),h(H,this,{root:t})}),[{key:"updateValue",value:function(e,t){f(H,this)[e].value.innerHTML=t}},{key:"clearRoot",value:function(){f(H,this).root.innerHTML=""}},{key:"appendToHTML",value:function(e,t){var n=t.element;t.label,t.value,f(H,this)[e]=t,f(H,this).root.appendChild(n)}},{key:"renderInfoBox",value:function(e,t){var n=document.createElement("div");n.id=f(D,this)+e,n.classList.add("display-infobox");var r=document.createElement("span");r.classList.add(f(D,this)+"display-infobox-label",f(D,this)+"item-label"),r.innerHTML="⇢ "+t.label;var a=document.createElement("div");a.innerText=t.text,n.appendChild(r),n.appendChild(a),this.appendToHTML(e,{element:n,label:r,value:a})}},{key:"renderFormula",value:function(e){var t=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=1,a=1,i="";if(/\//g.test(e)){var o=e.split("/"),s=function(e){return/(\{|\})/.test(e)?Math.abs(Number(e.replace(/(\{|\})/gm,""))):e};i=1==/\-/gm.test(o[0])?"-":"",r=s(o[0]),a=s(o[1])}else{var l=decimalToFraction(e);i=l.denominator<0?"-":"",r=l.numerator,a=Math.abs(l.denominator)}return"\n                ".concat(i?"<span>"+i+"</span>":"",'\n                <div class="math-fraction ').concat(1==t?"math-fraction--degree-format":"",'">\n                    <div class="math-fraction__numerator">').concat(r,'</div>\n                    <div class="math-fraction__denominator">').concat(a,'</div>\n                </div>\n                <span class="math-fraction__x-symbol">').concat(1==n?"x":"","</span>\n            ")},n=e.split(/(?<![\{])([+-])/gm).map((function(e){if(!/(?<![\{])([+-])/gm.test(e)){if(/x/gm.test(e)){if(/\^/gm.test(e)){var n=e.split(/(\^)/);return n.map((function(e,r){if("^"==e){var a=n[r-1].replace("x",""),i="-"==a||""==a?1:a,o=n[r+1];return/\//g.test(i)&&(a=t(i)),/\//g.test(o)&&(o=t(o.replace("x",""),!0,!0)),"<span>".concat(a).concat("e"==a?"":"x","<sup>").concat(o,"</sup></span>")}})).join("")}if(/\/\d{0,}x/g.test(e))return t(e);var r=e.replace("x","");return/\//g.test(r)&&(r=t(r)),1==r?"x":r+"x"}return/\//g.test(e)?t(e):""==e?"":Number(e)}return e}));e=n.join("");var r=document.createElement("span");return r.innerHTML=e,r.classList.add("math-formula"),r.outerHTML}},{key:"renderSpacer",value:function(){var e=document.createElement("div");return e.classList.add("display-spacer"),this.appendToHTML("spacer",{element:e,label:e,value:null}),e}},{key:"isExist",value:function(e){return void 0!==f(H,this)[e]}},{key:"renderDisplayItem",value:function(e,t){var n=document.createElement("div");n.id=f(D,this)+e,n.classList.add("display-item");var r=document.createElement("span");r.classList.add(f(D,this)+"display-label",f(D,this)+"item-label"),r.innerHTML=!0===t.hideColon?t.label:t.label+": ";var a=document.createElement("span");return a.classList.add(f(D,this)+"display-value",f(D,this)+"item-value"),a.innerHTML=t.text?t.text:'<i class="pale">no info</i>',n.appendChild(r),n.appendChild(a),f(H,this)[e]=a,this.appendToHTML(e,{element:n,label:r,value:a}),n}},{key:"renderDisplayFloatTile",value:function(e,t){var n=this.renderDisplayItem(e,t);return n.classList.remove("display-item"),n.classList.add("display-float-tile"),n}},{key:"dynamicRender",value:function(e,t){var n;"display-item"==t.type&&(n=this.renderDisplayItem(e,t)),"display-float-tile"==t.type&&(n=this.renderDisplayFloatTile(e,t)),"display-spacer"==t.type&&(n=this.renderSpacer()),n&&n.setAttribute(f(P,this),!0)}},{key:"removeDynamicllyRendered",value:function(){Array.from(document.querySelectorAll("[".concat(f(P,this),"]"))).forEach((function(e){e.remove()}))}}])}();const N=function(e){var t=e.title,n=e.desciption,a=e.uiTree,i=e.code;return(0,r.useEffect)((function(){var e=new g({timestamp:Date.now(),display:document.querySelector("#scene-info"),controls:document.querySelector("#controls")});e.render(a),i(e.display,e.states)}),[i]),r.createElement("div",null,r.createElement("div",{class:"section-block center-section-block"},r.createElement("div",{class:"section-block__inner"},r.createElement("div",{class:"wide-block rounded-block block"},r.createElement("h2",null,t),r.createElement("canvas",{width:600,height:400})))),r.createElement("div",{class:"section-block right-section-block"},r.createElement("div",{class:"section-block__inner"},r.createElement("div",{class:"medium-block rounded-block block"},r.createElement("h3",null,"Scene info"),r.createElement("div",{id:"scene-info"},r.createElement("div",{class:"display-infobox"},r.createElement("span",{class:"scene-info__display-infobox-label scene-info__item-label"},"⇢ Description"),r.createElement("div",null,n)))),r.createElement("div",{class:"medium-block rounded-block block"},r.createElement("h3",null,"Controls"),r.createElement("div",{id:"controls"})))))}}}]);