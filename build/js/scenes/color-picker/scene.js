(()=>{"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){for(var o=0;o<t.length;o++){var r=t[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,n(r.key),r)}}function n(t){var n=function(t){if("object"!=e(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,"string");if("object"!=e(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(n)?n:n+""}var o=new(function(){return e=function e(t){var n=t.title,o=t.ui,r=t.code;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.displayName="Scene",this.title=n,this.uiTree=o,this.ui=null,this.code=r,this.timestamp=null},(n=[{key:"execute",value:function(e){var t=e.root,n=this.code;t.children[0].textContent=this.title,n(t,this.ui.display,this.ui.states)}}])&&t(e.prototype,n),Object.defineProperty(e,"prototype",{writable:!1}),e;var e,n}())({title:"Color picker demo scene",ui:{description:{type:"display-infobox",label:"Description",text:"Color picker based on multicolor radial gradient and mouse events. Move range slider to adjust color. Click on the desired location on the circle to get color data."},currentColor:{type:"display-item",label:"Picker"},"use-hex":{type:"checkbox",label:"Use HEX colors"},"adjustment-slider":{type:"range-slider",startLabel:"Darker",endLabel:"Lighter",minValue:0,maxValue:100,defaultValue:50}},code:function(e,t,n){window.runningAnimations.clearQueue();var o=Date.now(),a=resetElement(e.querySelector("canvas"),"canvas-".concat(o));a.width=600,a.height=400;var i=a.getContext("2d",{willReadFrequently:!0}),s=!1,c=!1,l=!1,u=!1,d=function(e){e/=100,i.clearRect(0,0,600,400),function(e){for(var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.radius,o=void 0===n?120:n,r=t.brightness,a=void 0===r?1:r,i=e.canvas.width,s=e.canvas.height,c=i/2,l=s/2,u=e.createImageData(i,s),d=[0,0,0],f=0;f<s;f++)for(var p=0;p<i;p++){var h=4*(f*i+p),y=getDistanseBetweenTwoPoint(c,l,p,f),b=rotatePoint(c,l,p,f,90),m=getNormalizedAngle(c,l,b.x,b.y);if(y<=o-2){m<1/6?(d[0]=255,d[1]=Math.round(6*m*255),d[2]=0):m<2/6?(d[0]=Math.round(255-6*(m-1/6)*255),d[1]=255,d[2]=0):m<.5?(d[0]=0,d[1]=255,d[2]=Math.round(6*(m-2/6)*255)):m<4/6?(d[0]=0,d[1]=Math.round(255-6*(m-.5)*255),d[2]=255):m<5/6?(d[0]=Math.round(6*(m-4/6)*255),d[1]=0,d[2]=255):(d[0]=255,d[1]=0,d[2]=Math.round(255-6*(m-5/6)*255));var g=getBezierCurveValue(a),v=g>=.5?255:0,x=g>=.5?2*(g-.5):1-2*g,w=(v-d[0])*x,k=(v-d[1])*x,E=(v-d[2])*x;d[0]+=w,d[1]+=k,d[2]+=E}else d[0]=255,d[1]=255,d[2]=255;u.data[h]=d[0],u.data[h+1]=d[1],u.data[h+2]=d[2],u.data[h+3]=255}e.putImageData(u,0,0)}(i,{radius:150,brightness:e}),function(e,t){var n=t.radius,o=t.colorOrder,r=t.brightness,a=e.canvas.width/2,i=e.canvas.height/2,s=Array.isArray(o)>0?o.length:6;e.font="bold 12px Arial",e.textAlign="center",e.textBaseline="middle";for(var c=0,l=0,u=360/s,d=0,f=-1;d<180;d++){var p={x:a,y:i-n-10},h=rotatePoint(a,i,p.x,p.y,c),y=rotatePoint(a,i,p.x,p.y-10,c);if(drawLine(e,{x1:h.x,y1:h.y,x2:y.x,y2:y.y,thickness:c==l?1:.5,color:c==l?"black":"rgba(0, 0, 0, 0.3)"}),c==l){f++;var b=o.length>0?o[f].offset:10,m=rotatePoint(a,i,p.x,p.y-b,c),g=o[f].name;r<.05&&(g="BLACK"),r>.99&&(g="WHITE"),l+=u,e.fillText(g,m.x,m.y)}c+=2}}(i,{radius:150,colorOrder:[{name:"RED",offset:20},{name:"YELLOW",offset:30},{name:"GREEN",offset:35},{name:"CYAN",offset:25},{name:"BLUE",offset:30},{name:"MAGENTA",offset:30}],brightness:e})};n.setState("adjustment-slider",50),d(50),n.subscribe((function(e,t,n){"adjustment-slider"==e&&(d(t),f()),"use-hex"==e&&f()}));var f=function(){if(l){var e=i.getImageData(l.x,l.y,1,1).data,o=e[0],r=e[1],a=e[2],s="rgba(".concat(o,", ").concat(r,", ").concat(a,", 1)"),c=!0===n.getState("use-hex")?rgba2hex(o,r,a,1):"rgba(".concat(o,", ").concat(r,", ").concat(a,", 1)"),u=function(e,t){return t<49?e:t>=80?"rgba(0, 0, 0, 1)":getColorDominantComponent(e)}(s,n.getState("adjustment-slider")),d=changeColorOpacity(s,.35);t.updateValue("currentColor",'<span style="\n                                background: '.concat(s,'; \n                                width: 9px;\n                                height: 9px;\n                                position: relative;\n                                display: inline-block;\n                                border-radius: 100%;\n                                border: 2px solid rgba(0, 0, 0, 0.25);\n                                padding: 1px;\n                                left: 3px;\n                                top: 3px;\n                            "></span>\n                            <span class="gray-word-bubble" style="\n                                font-size: 13px;\n                                background: ').concat(d,";\n                                color: ").concat(u,'\n                            ">\n                                ').concat(c,"\n                            </span>"))}};a.addEventListener("mousemove",(function(e){c=getMousePos(a,e);var t=getDistanseBetweenTwoPoint(c.x,c.y,a.width/2,a.height/2);s=t-150<0,a.style.cursor=s?"crosshair":"inherit",!0===s&&!0===u&&(r(i,{radius:7,x:(l=c).x,y:l.y,forElement:a.id}),f())})),a.parentNode.addEventListener("mousedown",(function(e){u=!0,c=getMousePos(a,e),l=c})),a.parentNode.addEventListener("mouseup",(function(e){u=!1,c=getMousePos(a,e),l=c,!0===s&&r(i,{radius:7,x:l.x,y:l.y})}))}});function r(e,t){var n=t.radius,o=void 0===n?10:n,r=t.x,a=t.y,i=t.forElement,s=document.querySelector("#color-picker"),c=e.canvas.parentNode;s?(s.style.left=r+23+"px",s.style.top=a+51+"px"):((s=document.createElement("span")).id="color-picker",s.style="\n                width: ".concat(o,"px;\n                height: ").concat(o,"px;\n                left: ").concat(r,"px;\n                top: ").concat(a,"px;\n                position: absolute;\n                background: #ffffff;\n                border-radius: 100%;\n                border: 1px solid black;\n                cursor: crosshair;\n            "),i&&i.length>0&&s.setAttribute("data-element-for",i),c.appendChild(s))}window.exportedObjects.push(o)})();