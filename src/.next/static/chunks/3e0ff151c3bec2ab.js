(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,1637,e=>{"use strict";let t,s;var a,r=e.i(84160);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let s="",a="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":a+="f"==i[1]?d(o,i):i+"{"+d(o,"k"==i[1]?"":t)+"}":"object"==typeof o?a+=d(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=d.p?d.p(i,o):i+":"+o+";")}return s+(t&&r?t+"{"+r+"}":r)+a},c={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e};function m(e){let t,s,a=this||{},r=e.call?e(a.p):e;return((e,t,s,a,r)=>{var i;let m=u(e),p=c[m]||(c[m]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(m));if(!c[p]){let t=m!==e?e:(e=>{let t,s,a=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(s=t[3].replace(n," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(n," ").trim();return a[0]})(e);c[p]=d(r?{["@keyframes "+p]:t}:t,s?"":"."+p)}let h=s&&c.g?c.g:null;return s&&(c.g=c[p]),i=c[p],h?t.data=t.data.replace(h,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),p})(r.unshift?r.raw?(t=[].slice.call(arguments,1),s=a.p,r.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(a.target),a.g,a.o,a.k)}m.bind({g:1});let p,h,x,f=m.bind({k:1});function g(e,t){let s=this||{};return function(){let a=arguments;function r(i,o){let l=Object.assign({},i),n=l.className||r.className;s.p=Object.assign({theme:h&&h()},l),s.o=/ *go\d+/.test(n),l.className=m.apply(s,a)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),x&&d[0]&&x(l),p(d,l)}return t?t(r):r}}var y=(e,t)=>"function"==typeof e?e(t):e,v=(t=0,()=>(++t).toString()),b=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},j="default",w=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},N=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},C={},S=(e,t=j)=>{C[t]=w(C[t]||k,e),N.forEach(([e,s])=>{e===t&&s(C[t])})},$=e=>Object.keys(C).forEach(t=>S(e,t)),E=(e=j)=>t=>{S(t,e)},A={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},P=e=>(t,s)=>{let a,r=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||v()}))(t,e,s);return E(r.toasterId||(a=r.id,Object.keys(C).find(e=>C[e].toasts.some(e=>e.id===a))))({type:2,toast:r}),r.id},M=(e,t)=>P("blank")(e,t);M.error=P("error"),M.success=P("success"),M.loading=P("loading"),M.custom=P("custom"),M.dismiss=(e,t)=>{let s={type:3,toastId:e};t?E(t)(s):$(s)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let s={type:4,toastId:e};t?E(t)(s):$(s)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,s)=>{let a=M.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?y(t.success,e):void 0;return r?M.success(r,{id:a,...s,...null==s?void 0:s.success}):M.dismiss(a),e}).catch(e=>{let r=t.error?y(t.error,e):void 0;r?M.error(r,{id:a,...s,...null==s?void 0:s.error}):M.dismiss(a)}),e};var L=1e3,V=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,I=f`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,O=f`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${I} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${O} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,T=f`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,F=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${T} 1s linear infinite;
`,z=f`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,D=f`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,H=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${D} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Q=g("div")`
  position: absolute;
`,B=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,U=f`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${U} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,_=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?r.createElement(q,null,t):t:"blank"===s?null:r.createElement(B,null,r.createElement(F,{...a}),"loading"!==s&&r.createElement(Q,null,"error"===s?r.createElement(R,{...a}):r.createElement(H,{...a})))},G=g("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,K=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,X=r.memo(({toast:e,position:t,style:s,children:a})=>{let i=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,r]=b()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${f(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${f(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=r.createElement(_,{toast:e}),l=r.createElement(K,{...e.ariaProps},y(e.message,e));return r.createElement(G,{className:e.className,style:{...i,...s,...e.style}},"function"==typeof a?a({icon:o,message:l}):r.createElement(r.Fragment,null,o,l))});a=r.createElement,d.p=void 0,p=a,h=void 0,x=void 0;var Y=({id:e,className:t,style:s,onHeightUpdate:a,children:i})=>{let o=r.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return r.createElement("div",{ref:o,className:t,style:s},i)},W=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Z=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:i,toasterId:o,containerStyle:l,containerClassName:n})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:s,pausedAt:a}=((e={},t=j)=>{let[s,a]=(0,r.useState)(C[t]||k),i=(0,r.useRef)(C[t]);(0,r.useEffect)(()=>(i.current!==C[t]&&a(C[t]),N.push([t,a]),()=>{let e=N.findIndex(([e])=>e===t);e>-1&&N.splice(e,1)}),[t]);let o=s.toasts.map(t=>{var s,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||A[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...s,toasts:o}})(e,t),i=(0,r.useRef)(new Map).current,o=(0,r.useCallback)((e,t=L)=>{if(i.has(e))return;let s=setTimeout(()=>{i.delete(e),l({type:4,toastId:e})},t);i.set(e,s)},[]);(0,r.useEffect)(()=>{if(a)return;let e=Date.now(),r=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&M.dismiss(s.id);return}return setTimeout(()=>M.dismiss(s.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let l=(0,r.useCallback)(E(t),[t]),n=(0,r.useCallback)(()=>{l({type:5,time:Date.now()})},[l]),d=(0,r.useCallback)((e,t)=>{l({type:1,toast:{id:e,height:t}})},[l]),c=(0,r.useCallback)(()=>{a&&l({type:6,time:Date.now()})},[a,l]),u=(0,r.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},o=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),l=o.findIndex(t=>t.id===e.id),n=o.filter((e,t)=>t<l&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[n+1]:[0,n]).reduce((e,t)=>e+(t.height||0)+r,0)},[s]);return(0,r.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[s,o]),{toasts:s,handlers:{updateHeight:d,startPause:n,endPause:c,calculateOffset:u}}})(s,o);return r.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...l},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(s=>{let o,l,n=s.position||t,d=c.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(o=n.includes("top"),l=n.includes("center")?{justifyContent:"center"}:n.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:b()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...l});return r.createElement(Y,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?W:"",style:u},"custom"===s.type?y(s.message,s):i?i(s):r.createElement(X,{toast:s,position:n}))}))};e.s(["Toaster",()=>Z,"default",()=>M,"toast",()=>M],1637)},65664,e=>{"use strict";e.s(["UNITS",0,["Pcs","Kg","Gram","Liter","Ml","Meter","Feet","Box","Packet","Dozen","Bag","Ton","Custom"],"scores_rate",0,["Poor 🚨 High risk — difficult approvals & high interest.","Fair ⚠️ Below average — approvals with strict terms.","Good 🙂 Acceptable — loans possible, not best rates.","Very Good ✅ Safe — better rates & approvals.","Excellent 🌟 Elite — best interest & limits."]])},89216,e=>{"use strict";let t=(0,e.i(17615).default)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);e.s(["Package",()=>t],89216)},48926,e=>{"use strict";let t=(0,e.i(17615).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",()=>t],48926)},42337,e=>{"use strict";let t=(0,e.i(17615).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",()=>t],42337)},27022,e=>{"use strict";e.i(39864);var t=e.i(43102),s=e.i(84160),a=e.i(49930),r=e.i(91115),i=e.i(5508),o=e.i(96201),l=e.i(20242),n=s,d=e.i(71134);function c(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class u extends n.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,s=(0,l.isHTMLElement)(e)&&e.offsetWidth||0,a=(0,l.isHTMLElement)(e)&&e.offsetHeight||0,r=this.props.sizeRef.current;r.height=t.offsetHeight||0,r.width=t.offsetWidth||0,r.top=t.offsetTop,r.left=t.offsetLeft,r.right=s-r.width-r.left,r.bottom=a-r.height-r.top}return null}componentDidUpdate(){}render(){return this.props.children}}function m({children:e,isPresent:a,anchorX:r,anchorY:i,root:o,pop:l}){let m=(0,n.useId)(),p=(0,n.useRef)(null),h=(0,n.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:x}=(0,n.useContext)(d.MotionConfigContext),f=function(...e){return s.useCallback(function(...e){return t=>{let s=!1,a=e.map(e=>{let a=c(e,t);return s||"function"!=typeof a||(s=!0),a});if(s)return()=>{for(let t=0;t<a.length;t++){let s=a[t];"function"==typeof s?s():c(e[t],null)}}}}(...e),e)}(p,e.props?.ref??e?.ref);return(0,n.useInsertionEffect)(()=>{let{width:e,height:t,top:s,left:n,right:d,bottom:c}=h.current;if(a||!1===l||!p.current||!e||!t)return;let u="left"===r?`left: ${n}`:`right: ${d}`,f="bottom"===i?`bottom: ${c}`:`top: ${s}`;p.current.dataset.motionPopId=m;let g=document.createElement("style");x&&(g.nonce=x);let y=o??document.head;return y.appendChild(g),g.sheet&&g.sheet.insertRule(`
          [data-motion-pop-id="${m}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${u}px !important;
            ${f}px !important;
          }
        `),()=>{y.contains(g)&&y.removeChild(g)}},[a]),(0,t.jsx)(u,{isPresent:a,childRef:p,sizeRef:h,pop:l,children:!1===l?e:n.cloneElement(e,{ref:f})})}let p=({children:e,initial:a,isPresent:i,onExitComplete:l,custom:n,presenceAffectsLayout:d,mode:c,anchorX:u,anchorY:p,root:x})=>{let f=(0,r.useConstant)(h),g=(0,s.useId)(),y=!0,v=(0,s.useMemo)(()=>(y=!1,{id:g,initial:a,isPresent:i,custom:n,onExitComplete:e=>{for(let t of(f.set(e,!0),f.values()))if(!t)return;l&&l()},register:e=>(f.set(e,!1),()=>f.delete(e))}),[i,f,l]);return d&&y&&(v={...v}),(0,s.useMemo)(()=>{f.forEach((e,t)=>f.set(t,!1))},[i]),s.useEffect(()=>{i||f.size||!l||l()},[i]),e=(0,t.jsx)(m,{pop:"popLayout"===c,isPresent:i,anchorX:u,anchorY:p,root:x,children:e}),(0,t.jsx)(o.PresenceContext.Provider,{value:v,children:e})};function h(){return new Map}var x=e.i(3887);let f=e=>e.key||"";function g(e){let t=[];return s.Children.forEach(e,e=>{(0,s.isValidElement)(e)&&t.push(e)}),t}let y=({children:e,custom:o,initial:l=!0,onExitComplete:n,presenceAffectsLayout:d=!0,mode:c="sync",propagate:u=!1,anchorX:m="left",anchorY:h="top",root:y})=>{let[v,b]=(0,x.usePresence)(u),j=(0,s.useMemo)(()=>g(e),[e]),w=u&&!v?[]:j.map(f),N=(0,s.useRef)(!0),k=(0,s.useRef)(j),C=(0,r.useConstant)(()=>new Map),S=(0,s.useRef)(new Set),[$,E]=(0,s.useState)(j),[A,P]=(0,s.useState)(j);(0,i.useIsomorphicLayoutEffect)(()=>{N.current=!1,k.current=j;for(let e=0;e<A.length;e++){let t=f(A[e]);w.includes(t)?(C.delete(t),S.current.delete(t)):!0!==C.get(t)&&C.set(t,!1)}},[A,w.length,w.join("-")]);let M=[];if(j!==$){let e=[...j];for(let t=0;t<A.length;t++){let s=A[t],a=f(s);w.includes(a)||(e.splice(t,0,s),M.push(s))}return"wait"===c&&M.length&&(e=M),P(g(e)),E(j),null}let{forceRender:L}=(0,s.useContext)(a.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:A.map(e=>{let s=f(e),a=(!u||!!v)&&(j===A||w.includes(s));return(0,t.jsx)(p,{isPresent:a,initial:(!N.current||!!l)&&void 0,custom:o,presenceAffectsLayout:d,mode:c,root:y,onExitComplete:a?void 0:()=>{if(S.current.has(s)||(S.current.add(s),!C.has(s)))return;C.set(s,!0);let e=!0;C.forEach(t=>{t||(e=!1)}),e&&(L?.(),P(k.current),u&&b?.(),n&&n())},anchorX:m,anchorY:h,children:e},s)})})};e.s(["AnimatePresence",()=>y],27022)},15612,e=>{"use strict";let t=(0,e.i(17615).default)("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);e.s(["ArrowRight",()=>t],15612)},62939,16034,36320,e=>{"use strict";var t=e.i(43102),s=e.i(84160),a=e.i(16748),r=e.i(56311),i=e.i(12480);function o(){let{user:e}=(0,r.useUser)(),o=e?.primaryEmailAddress?.emailAddress,n=new Date().toISOString().split("T")[0],[d,c]=(0,s.useState)(n),[u,m]=(0,s.useState)(n),[p,h]=(0,s.useState)([]),[x,f]=(0,s.useState)(!1),g=async e=>(await a.default.get("/api/stock-valuation",{params:{email:o,date:e}})).data.items,y=async()=>{if(!o||!d||!u)return;f(!0);let[e,t]=await Promise.all([g(d),g(u)]),s=new Map;for(let t of e){let e=`${t.product}|${t.unit}`;s.set(e,{product:t.product,unit:t.unit,openQty:t.quantity,closeQty:0,openValue:t.value,closeValue:0,deltaValue:0})}for(let e of t){let t=`${e.product}|${e.unit}`,a=s.get(t);a?(a.closeQty=e.quantity,a.closeValue=e.value,a.deltaValue=e.value-a.openValue):s.set(t,{product:e.product,unit:e.unit,openQty:0,closeQty:e.quantity,openValue:0,closeValue:e.value,deltaValue:e.value})}h(Array.from(s.values())),f(!1)};(0,s.useEffect)(()=>{y()},[o,d,u]);let v=p.reduce((e,t)=>e+t.openValue,0),b=p.reduce((e,t)=>e+t.closeValue,0);return(0,t.jsxs)(i.motion.section,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"p-6",children:[(0,t.jsxs)("div",{className:"mb-4",children:[(0,t.jsx)("h2",{className:"text-xl font-semibold text-foreground",children:"Stock Valuation Change"}),(0,t.jsx)("p",{className:"text-sm text-muted",children:"FIFO-based inventory comparison"})]}),(0,t.jsxs)("div",{className:"flex gap-4 mb-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs text-muted mb-1",children:"Opening date"}),(0,t.jsx)("input",{type:"date",value:d,onChange:e=>c(e.target.value),className:"rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs text-muted mb-1",children:"Closing date"}),(0,t.jsx)("input",{type:"date",value:u,onChange:e=>m(e.target.value),className:"rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-3 gap-4 mb-6 text-sm",children:[(0,t.jsx)(l,{label:"Opening value",value:v}),(0,t.jsx)(l,{label:"Closing value",value:b}),(0,t.jsx)(l,{label:"Net change",value:b-v,highlight:!0})]}),x?(0,t.jsx)("p",{className:"text-sm text-muted",children:"Calculating valuation change…"}):(0,t.jsxs)("div",{className:"rounded-xl border border-white/10 bg-white/5 overflow-hidden",children:[(0,t.jsxs)("div",{className:"grid grid-cols-12 px-5 py-3 text-xs font-medium text-muted bg-white/5",children:[(0,t.jsx)("div",{className:"col-span-4",children:"Product"}),(0,t.jsx)("div",{className:"col-span-2 text-right",children:"Open Qty"}),(0,t.jsx)("div",{className:"col-span-2 text-right",children:"Close Qty"}),(0,t.jsx)("div",{className:"col-span-2 text-right",children:"Open ₹"}),(0,t.jsx)("div",{className:"col-span-2 text-right",children:"Δ ₹"})]}),p.map(e=>(0,t.jsxs)("div",{className:"grid grid-cols-12 px-5 py-3 border-t border-white/5 text-sm hover:bg-white/5 transition-colors",children:[(0,t.jsxs)("div",{className:"col-span-4 font-medium text-foreground",children:[e.product,(0,t.jsx)("div",{className:"text-xs text-muted",children:e.unit})]}),(0,t.jsx)("div",{className:"col-span-2 text-right text-foreground",children:e.openQty}),(0,t.jsx)("div",{className:"col-span-2 text-right text-foreground",children:e.closeQty}),(0,t.jsxs)("div",{className:"col-span-2 text-right text-foreground",children:["₹",e.openValue.toLocaleString()]}),(0,t.jsxs)("div",{className:`col-span-2 text-right font-semibold ${e.deltaValue>=0?"text-emerald-400":"text-rose-400"}`,children:[e.deltaValue>=0?"+":"-","₹",Math.abs(e.deltaValue).toLocaleString()]})]},`${e.product}-${e.unit}`))]})]})}function l({label:e,value:s,highlight:a}){return(0,t.jsxs)("div",{className:"rounded-xl border border-white/10 bg-white/5 p-4",children:[(0,t.jsx)("p",{className:"text-xs text-muted",children:e}),(0,t.jsxs)("p",{className:`text-lg font-semibold ${a?s>=0?"text-emerald-400":"text-rose-400":"text-foreground"}`,children:["₹",s.toLocaleString()]})]})}e.s(["default",()=>o],62939);var n=e.i(15612),d=e.i(52544),c=e.i(42337),u=e.i(52034);function m({data:e}){if(!e)return null;let s=e.sales>=e.purchases,a=e.sales-e.purchases;return(0,t.jsxs)(u.GlassPanel,{className:`p-6 border transition-colors
        ${s?"bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30":"bg-amber-500/5 border-amber-500/20 hover:border-amber-500/30"}
      `,children:[(0,t.jsxs)("div",{className:"flex items-start gap-4",children:[(0,t.jsx)("div",{className:`h-10 w-10 rounded-xl flex items-center justify-center
            ${s?"bg-emerald-500/10":"bg-amber-500/10"}`,children:s?(0,t.jsx)(d.CheckCircle,{className:"w-5 h-5 text-emerald-600"}):(0,t.jsx)(c.AlertTriangle,{className:"w-5 h-5 text-amber-600"})}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("h3",{className:"text-base font-semibold text-foreground",children:"Cash Flow"}),(0,t.jsx)("p",{className:"text-sm text-muted mt-0.5",children:s?`Net positive cash flow ${e.period.toLowerCase()}`:`Cash outflow exceeded inflow ${e.period.toLowerCase()}`})]}),(0,t.jsxs)("a",{href:"/transactions",className:"text-sm text-primary hover:text-emerald-400 hover:underline flex items-center gap-1 transition-colors",children:["View",(0,t.jsx)(n.ArrowRight,{className:"w-4 h-4"})]})]}),(0,t.jsxs)("div",{className:"mt-4 grid grid-cols-3 gap-4 text-sm",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs text-muted",children:"Purchases"}),(0,t.jsxs)("p",{className:"font-semibold text-rose-400",children:["₹",e.purchases.toLocaleString()]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs text-muted",children:"Sales"}),(0,t.jsxs)("p",{className:"font-semibold text-emerald-400",children:["₹",e.sales.toLocaleString()]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs text-muted",children:"Net"}),(0,t.jsxs)("p",{className:`font-semibold ${a>=0?"text-emerald-700":"text-amber-700"}`,children:[a>=0?"+":"-","₹",Math.abs(a).toLocaleString()]})]})]}),s&&(0,t.jsxs)("div",{className:"mt-4 flex items-center gap-2 text-sm text-emerald-400",children:[(0,t.jsx)(d.CheckCircle,{className:"w-4 h-4"}),"Spending is under control and cash inflow is steady."]})]})}function p({slowMovingCount:e,slowStockValue:s,slowMoving:a,open:r,onToggle:i}){let o=0===e;return(0,t.jsxs)("section",{className:"rounded-2xl border border-slate-200 bg-white p-6",children:[(0,t.jsxs)("div",{className:"flex items-start gap-4",children:[(0,t.jsx)("div",{className:`h-10 w-10 rounded-lg flex items-center justify-center
          ${o?"bg-emerald-100":"bg-amber-100"}`,children:o?(0,t.jsx)(d.CheckCircle,{className:"text-emerald-600"}):(0,t.jsx)(c.AlertTriangle,{className:"text-amber-600"})}),(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("h3",{className:"text-base font-semibold text-slate-900",children:"Inventory Movement"}),(0,t.jsx)("p",{className:"text-sm text-slate-600 mt-1",children:o?"All products have moved within the last 30 days.":(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("span",{className:"font-medium",children:[e," item",e>1?"s":""]})," ","haven’t sold recently ·"," ",(0,t.jsxs)("span",{className:"font-medium",children:["₹",s.toLocaleString()]})," ","at risk"]})}),!o&&(0,t.jsx)("button",{onClick:i,className:"mt-3 text-sm text-emerald-600 hover:underline",children:"Review slow-moving products →"})]})]}),o&&(0,t.jsxs)("div",{className:"mt-4 space-y-3",children:[(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm text-emerald-600",children:[(0,t.jsx)(d.CheckCircle,{className:"w-4 h-4"}),"Inventory turnover looks healthy."]}),(0,t.jsx)("div",{className:"mt-4 border-t border-slate-200"}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600",children:[(0,t.jsxs)("span",{children:[(0,t.jsx)("strong",{className:"text-slate-900",children:a.length+e||"All"})," ","products actively moving"]}),(0,t.jsxs)("span",{children:[(0,t.jsx)("strong",{className:"text-slate-900",children:"₹0"})," capital blocked"]}),(0,t.jsx)("span",{children:"All sales activity within 30 days"})]})]}),!o&&r&&(0,t.jsx)("div",{className:"mt-6 border-t border-slate-200 pt-4 space-y-3",children:a.map(e=>(0,t.jsxs)("div",{className:"flex justify-between items-center rounded-lg border border-slate-200 px-4 py-3",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium text-slate-900",children:e.product}),(0,t.jsxs)("p",{className:"text-xs text-slate-500",children:[e.unit," · Qty ",e.quantity]})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("p",{className:"text-sm font-medium text-slate-900",children:["₹",e.value.toLocaleString()]}),(0,t.jsx)("p",{className:`text-xs ${"dead"===e.category?"text-rose-600":"text-amber-600"}`,children:null===e.daysSinceLastSale?"Never sold":`${e.daysSinceLastSale} days since last sale`})]})]},`${e.product}-${e.unit}`))})]})}function h({data:e}){let[a,r]=(0,s.useState)(!1);return e?(0,t.jsx)(p,{slowMoving:e.slowMoving,slowMovingCount:e.slowMovingCount,slowStockValue:e.slowStockValue,open:a,onToggle:()=>r(e=>!e)}):null}e.s(["default",()=>m],16034),e.s(["default",()=>h],36320)},66446,e=>{"use strict";var t=e.i(43102),s=e.i(12480),a=e.i(27022),r=e.i(84160),i=e.i(1637),o=e.i(56311),l=e.i(16748);async function n(e){let[t,s,a,r]=await Promise.all([l.default.get("/api/low-stock",{params:{email:e}}),l.default.get("/api/cash-flow",{params:{email:e}}),l.default.get("/api/health/stock-movement",{params:{email:e}}),l.default.get("/api/totalStock",{params:{email:e}})]);return{lowStock:t.data,cashFlow:s.data,slowMoving:a.data,stockReport:r.data}}var d=e.i(59468),c=e.i(63074),u=e.i(19328),m=e.i(48209),p=e.i(62939),h=e.i(16034),x=e.i(36320);let f=({children:e})=>(0,t.jsx)(s.motion.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:16},transition:{duration:.35,ease:"easeOut"},children:e});function g(){let{user:e}=(0,o.useUser)(),l=e?.primaryEmailAddress?.emailAddress,[g,b]=(0,r.useState)(!1),[j,w]=(0,r.useState)(!1),[N,k]=(0,r.useState)(!1),[C,S]=(0,r.useState)(""),[$,E]=(0,r.useState)(0),[A,P]=(0,r.useState)(null),[M,L]=(0,r.useState)(!0);return(0,r.useEffect)(()=>{l&&(async()=>{L(!0);try{let e=await n(l);P(e)}catch(e){console.error("Business insights failed",e)}finally{L(!1)}})()},[l,$]),(0,t.jsxs)("section",{className:"bg-[#F7FAF9] my-4 min-h-screen py-20",children:[(0,t.jsx)(i.Toaster,{}),(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-6 space-y-12",children:[(0,t.jsxs)(s.motion.div,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},children:[(0,t.jsx)("h1",{className:"text-3xl md:text-4xl font-bold text-stone-900",children:"Business Insights"}),(0,t.jsx)("p",{className:"mt-2 text-stone-600 max-w-2xl",children:"Real-time view of risks, stock health, and cash exposure."})]}),!M&&A&&(0,t.jsxs)("div",{className:"grid gap-6 lg:grid-cols-2",children:[(0,t.jsx)(y,{title:"Stock Alerts",children:(0,t.jsx)(m.default,{data:A.lowStock})}),(0,t.jsx)(y,{title:"Stock Valuation",children:(0,t.jsx)(p.default,{})}),(0,t.jsx)(y,{title:"Cash Flow",children:(0,t.jsx)(h.default,{data:A.cashFlow})}),(0,t.jsx)(y,{title:"Slow Moving Stock",children:(0,t.jsx)(x.default,{data:A.slowMoving})})]}),(0,t.jsxs)("div",{className:"bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-wrap gap-4",children:[(0,t.jsx)(v,{onClick:()=>{b(!0),w(!1),k(!1)},children:"Add Purchase"}),(0,t.jsx)(v,{onClick:()=>{w(!0),b(!1),k(!1)},children:"Record Sale"}),(0,t.jsx)(v,{variant:"secondary",onClick:()=>{k(!0),b(!1),w(!1)},children:"View Inventory"})]}),(0,t.jsxs)(a.AnimatePresence,{mode:"wait",children:[g&&(0,t.jsx)(f,{children:(0,t.jsx)(d.default,{visible:!0,preSelectedProduct:C,reloadSetter:()=>E(e=>e+1),reload:$})},"purchase"),j&&(0,t.jsx)(f,{children:(0,t.jsx)(c.default,{visible:!0,preSelectedProduct:C,reloadSetter:()=>E(e=>e+1),reload:$})},"sale"),N&&(0,t.jsx)(f,{children:(0,t.jsx)(u.default,{visible:!0,data:A?.stockReport,productSetter:S,purchaseSetter:b,saleSetter:w,reloadKey:$})},"stock")]})]})]})}function y({title:e,children:a}){return(0,t.jsxs)(s.motion.div,{initial:{opacity:0,y:12},whileInView:{opacity:1,y:0},viewport:{once:!0},className:"   bg-white border border-stone-200 rounded-2xl   p-6 shadow-sm hover:shadow-md transition   ",children:[(0,t.jsx)("h3",{className:"font-semibold text-stone-900 mb-4",children:e}),a]})}function v({children:e,onClick:s,variant:a="primary"}){return(0,t.jsx)("button",{onClick:s,className:`
        px-5 py-2.5 rounded-xl text-sm font-semibold transition
        ${"primary"===a?"bg-emerald-600 text-white hover:bg-emerald-700":"bg-stone-100 text-stone-700 hover:bg-stone-200"}
      `,children:e})}e.s(["default",()=>g],66446)}]);