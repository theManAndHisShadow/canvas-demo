(()=>{"use strict";let t=new class{constructor({title:t,ui:e,code:i}){this.displayName="Scene",this.title=t,this.uiTree=e,this.ui=null,this.code=i,this.timestamp=null}execute({root:t}){let e=this.code;t.children[0].textContent=this.title,e(t,this.ui.display,this.ui.states)}}({title:"Scene template",ui:{description:{type:"display-infobox",label:"Description",text:"Empty"}},code:(t,e,i)=>{window.runningAnimations.clearQueue();const s=Date.now();let n=resetElement(t.querySelector("canvas"),`canvas-${s}`);n.width=600,n.height=400,n.getContext("2d")}});window.exportedObjects.push(t)})();