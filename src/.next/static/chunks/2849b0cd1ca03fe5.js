(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,59375,e=>{"use strict";function t(){for(var e,t,s=0,r="",a=arguments.length;s<a;s++)(e=arguments[s])&&(t=function e(t){var s,r,a="";if("string"==typeof t||"number"==typeof t)a+=t;else if("object"==typeof t)if(Array.isArray(t)){var i=t.length;for(s=0;s<i;s++)t[s]&&(r=e(t[s]))&&(a&&(a+=" "),a+=r)}else for(r in t)t[r]&&(a&&(a+=" "),a+=r);return a}(e))&&(r&&(r+=" "),r+=t);return r}e.s(["clsx",()=>t,"default",0,t])},1637,e=>{"use strict";let t,s;var r,a=e.i(84160);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let s="",r="",a="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?s=i+" "+o+";":r+="f"==i[1]?d(o,i):i+"{"+d(o,"k"==i[1]?"":t)+"}":"object"==typeof o?r+=d(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=d.p?d.p(i,o):i+":"+o+";")}return s+(t&&a?t+"{"+a+"}":a)+r},c={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e};function p(e){let t,s,r=this||{},a=e.call?e(r.p):e;return((e,t,s,r,a)=>{var i;let p=u(e),m=c[p]||(c[p]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(p));if(!c[m]){let t=p!==e?e:(e=>{let t,s,r=[{}];for(;t=o.exec(e.replace(n,""));)t[4]?r.shift():t[3]?(s=t[3].replace(l," ").trim(),r.unshift(r[0][s]=r[0][s]||{})):r[0][t[1]]=t[2].replace(l," ").trim();return r[0]})(e);c[m]=d(a?{["@keyframes "+m]:t}:t,s?"":"."+m)}let f=s&&c.g?c.g:null;return s&&(c.g=c[m]),i=c[m],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=r?i+t.data:t.data+i),m})(a.unshift?a.raw?(t=[].slice.call(arguments,1),s=r.p,a.reduce((e,r,a)=>{let i=t[a];if(i&&i.call){let e=i(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+r+(null==i?"":i)},"")):a.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):a,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(r.target),r.g,r.o,r.k)}p.bind({g:1});let m,f,h,x=p.bind({k:1});function g(e,t){let s=this||{};return function(){let r=arguments;function a(i,o){let n=Object.assign({},i),l=n.className||a.className;s.p=Object.assign({theme:f&&f()},n),s.o=/ *go\d+/.test(l),n.className=p.apply(s,r)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),h&&d[0]&&h(n),m(d,n)}return t?t(a):a}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),v=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},j="default",w=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return w(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},N=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},E={},C=(e,t=j)=>{E[t]=w(E[t]||k,e),N.forEach(([e,s])=>{e===t&&s(E[t])})},P=e=>Object.keys(E).forEach(t=>C(e,t)),S=(e=j)=>t=>{C(t,e)},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=e=>(t,s)=>{let r,a=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||b()}))(t,e,s);return S(a.toasterId||(r=a.id,Object.keys(E).find(e=>E[e].toasts.some(e=>e.id===r))))({type:2,toast:a}),a.id},M=(e,t)=>A("blank")(e,t);M.error=A("error"),M.success=A("success"),M.loading=A("loading"),M.custom=A("custom"),M.dismiss=(e,t)=>{let s={type:3,toastId:e};t?S(t)(s):P(s)},M.dismissAll=e=>M.dismiss(void 0,e),M.remove=(e,t)=>{let s={type:4,toastId:e};t?S(t)(s):P(s)},M.removeAll=e=>M.remove(void 0,e),M.promise=(e,t,s)=>{let r=M.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?y(t.success,e):void 0;return a?M.success(a,{id:r,...s,...null==s?void 0:s.success}):M.dismiss(r),e}).catch(e=>{let a=t.error?y(t.error,e):void 0;a?M.error(a,{id:r,...s,...null==s?void 0:s.error}):M.dismiss(r)}),e};var I=1e3,D=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,T=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,O=x`
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

  animation: ${D} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${T} 0.15s ease-out forwards;
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
`,z=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,L=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${z} 1s linear infinite;
`,H=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,_=x`
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
}`,F=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${H} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${_} 0.2s ease-out forwards;
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
`,U=g("div")`
  position: absolute;
`,B=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,V=x`
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
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,G=({toast:e})=>{let{icon:t,type:s,iconTheme:r}=e;return void 0!==t?"string"==typeof t?a.createElement(q,null,t):t:"blank"===s?null:a.createElement(B,null,a.createElement(L,{...r}),"loading"!==s&&a.createElement(U,null,"error"===s?a.createElement(R,{...r}):a.createElement(F,{...r})))},K=g("div")`
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
`,X=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Y=a.memo(({toast:e,position:t,style:s,children:r})=>{let i=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[r,a]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${x(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=a.createElement(G,{toast:e}),n=a.createElement(X,{...e.ariaProps},y(e.message,e));return a.createElement(K,{className:e.className,style:{...i,...s,...e.style}},"function"==typeof r?r({icon:o,message:n}):a.createElement(a.Fragment,null,o,n))});r=a.createElement,d.p=void 0,m=r,f=void 0,h=void 0;var Q=({id:e,className:t,style:s,onHeightUpdate:r,children:i})=>{let o=a.useCallback(t=>{if(t){let s=()=>{r(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return a.createElement("div",{ref:o,className:t,style:s},i)},W=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,Z=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:r,children:i,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:s,pausedAt:r}=((e={},t=j)=>{let[s,r]=(0,a.useState)(E[t]||k),i=(0,a.useRef)(E[t]);(0,a.useEffect)(()=>(i.current!==E[t]&&r(E[t]),N.push([t,r]),()=>{let e=N.findIndex(([e])=>e===t);e>-1&&N.splice(e,1)}),[t]);let o=s.toasts.map(t=>{var s,r,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||$[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...s,toasts:o}})(e,t),i=(0,a.useRef)(new Map).current,o=(0,a.useCallback)((e,t=I)=>{if(i.has(e))return;let s=setTimeout(()=>{i.delete(e),n({type:4,toastId:e})},t);i.set(e,s)},[]);(0,a.useEffect)(()=>{if(r)return;let e=Date.now(),a=s.map(s=>{if(s.duration===1/0)return;let r=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(r<0){s.visible&&M.dismiss(s.id);return}return setTimeout(()=>M.dismiss(s.id,t),r)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[s,r,t]);let n=(0,a.useCallback)(S(t),[t]),l=(0,a.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,a.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,a.useCallback)(()=>{r&&n({type:6,time:Date.now()})},[r,n]),u=(0,a.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:a=8,defaultPosition:i}=t||{},o=s.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[s]);return(0,a.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[s,o]),{toasts:s,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(s,o);return a.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(s=>{let o,n,l=s.position||t,d=c.calculateOffset(s,{reverseOrder:e,gutter:r,defaultPosition:t}),u=(o=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...n});return a.createElement(Q,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?W:"",style:u},"custom"===s.type?y(s.message,s):i?i(s):a.createElement(Y,{toast:s,position:l}))}))};e.s(["Toaster",()=>Z,"default",()=>M,"toast",()=>M],1637)},65664,e=>{"use strict";e.s(["UNITS",0,["Pcs","Kg","Gram","Liter","Ml","Meter","Feet","Box","Packet","Dozen","Bag","Ton","Custom"],"scores_rate",0,["Poor 🚨 High risk — difficult approvals & high interest.","Fair ⚠️ Below average — approvals with strict terms.","Good 🙂 Acceptable — loans possible, not best rates.","Very Good ✅ Safe — better rates & approvals.","Excellent 🌟 Elite — best interest & limits."]])},89216,e=>{"use strict";let t=(0,e.i(17615).default)("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);e.s(["Package",()=>t],89216)},48926,e=>{"use strict";let t=(0,e.i(17615).default)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",()=>t],48926)},42337,e=>{"use strict";let t=(0,e.i(17615).default)("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["AlertTriangle",()=>t],42337)},27022,e=>{"use strict";e.i(39864);var t=e.i(43102),s=e.i(84160),r=e.i(49930),a=e.i(91115),i=e.i(5508),o=e.i(96201),n=e.i(20242),l=s,d=e.i(71134);function c(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class u extends l.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent&&!1!==this.props.pop){let e=t.offsetParent,s=(0,n.isHTMLElement)(e)&&e.offsetWidth||0,r=(0,n.isHTMLElement)(e)&&e.offsetHeight||0,a=this.props.sizeRef.current;a.height=t.offsetHeight||0,a.width=t.offsetWidth||0,a.top=t.offsetTop,a.left=t.offsetLeft,a.right=s-a.width-a.left,a.bottom=r-a.height-a.top}return null}componentDidUpdate(){}render(){return this.props.children}}function p({children:e,isPresent:r,anchorX:a,anchorY:i,root:o,pop:n}){let p=(0,l.useId)(),m=(0,l.useRef)(null),f=(0,l.useRef)({width:0,height:0,top:0,left:0,right:0,bottom:0}),{nonce:h}=(0,l.useContext)(d.MotionConfigContext),x=function(...e){return s.useCallback(function(...e){return t=>{let s=!1,r=e.map(e=>{let r=c(e,t);return s||"function"!=typeof r||(s=!0),r});if(s)return()=>{for(let t=0;t<r.length;t++){let s=r[t];"function"==typeof s?s():c(e[t],null)}}}}(...e),e)}(m,e.props?.ref??e?.ref);return(0,l.useInsertionEffect)(()=>{let{width:e,height:t,top:s,left:l,right:d,bottom:c}=f.current;if(r||!1===n||!m.current||!e||!t)return;let u="left"===a?`left: ${l}`:`right: ${d}`,x="bottom"===i?`bottom: ${c}`:`top: ${s}`;m.current.dataset.motionPopId=p;let g=document.createElement("style");h&&(g.nonce=h);let y=o??document.head;return y.appendChild(g),g.sheet&&g.sheet.insertRule(`
          [data-motion-pop-id="${p}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            ${u}px !important;
            ${x}px !important;
          }
        `),()=>{y.contains(g)&&y.removeChild(g)}},[r]),(0,t.jsx)(u,{isPresent:r,childRef:m,sizeRef:f,pop:n,children:!1===n?e:l.cloneElement(e,{ref:x})})}let m=({children:e,initial:r,isPresent:i,onExitComplete:n,custom:l,presenceAffectsLayout:d,mode:c,anchorX:u,anchorY:m,root:h})=>{let x=(0,a.useConstant)(f),g=(0,s.useId)(),y=!0,b=(0,s.useMemo)(()=>(y=!1,{id:g,initial:r,isPresent:i,custom:l,onExitComplete:e=>{for(let t of(x.set(e,!0),x.values()))if(!t)return;n&&n()},register:e=>(x.set(e,!1),()=>x.delete(e))}),[i,x,n]);return d&&y&&(b={...b}),(0,s.useMemo)(()=>{x.forEach((e,t)=>x.set(t,!1))},[i]),s.useEffect(()=>{i||x.size||!n||n()},[i]),e=(0,t.jsx)(p,{pop:"popLayout"===c,isPresent:i,anchorX:u,anchorY:m,root:h,children:e}),(0,t.jsx)(o.PresenceContext.Provider,{value:b,children:e})};function f(){return new Map}var h=e.i(3887);let x=e=>e.key||"";function g(e){let t=[];return s.Children.forEach(e,e=>{(0,s.isValidElement)(e)&&t.push(e)}),t}let y=({children:e,custom:o,initial:n=!0,onExitComplete:l,presenceAffectsLayout:d=!0,mode:c="sync",propagate:u=!1,anchorX:p="left",anchorY:f="top",root:y})=>{let[b,v]=(0,h.usePresence)(u),j=(0,s.useMemo)(()=>g(e),[e]),w=u&&!b?[]:j.map(x),N=(0,s.useRef)(!0),k=(0,s.useRef)(j),E=(0,a.useConstant)(()=>new Map),C=(0,s.useRef)(new Set),[P,S]=(0,s.useState)(j),[$,A]=(0,s.useState)(j);(0,i.useIsomorphicLayoutEffect)(()=>{N.current=!1,k.current=j;for(let e=0;e<$.length;e++){let t=x($[e]);w.includes(t)?(E.delete(t),C.current.delete(t)):!0!==E.get(t)&&E.set(t,!1)}},[$,w.length,w.join("-")]);let M=[];if(j!==P){let e=[...j];for(let t=0;t<$.length;t++){let s=$[t],r=x(s);w.includes(r)||(e.splice(t,0,s),M.push(s))}return"wait"===c&&M.length&&(e=M),A(g(e)),S(j),null}let{forceRender:I}=(0,s.useContext)(r.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:$.map(e=>{let s=x(e),r=(!u||!!b)&&(j===$||w.includes(s));return(0,t.jsx)(m,{isPresent:r,initial:(!N.current||!!n)&&void 0,custom:o,presenceAffectsLayout:d,mode:c,root:y,onExitComplete:r?void 0:()=>{if(C.current.has(s)||(C.current.add(s),!E.has(s)))return;E.set(s,!0);let e=!0;E.forEach(t=>{t||(e=!1)}),e&&(I?.(),A(k.current),u&&v?.(),l&&l())},anchorX:p,anchorY:f,children:e},s)})})};e.s(["AnimatePresence",()=>y],27022)},42189,e=>{"use strict";var t=e.i(43102);function s({title:e,subtitle:s,rows:r,type:a}){let i="Purchase"===a,o=i?"text-emerald-400":"text-rose-400";return(0,t.jsxs)("div",{className:`rounded-xl border border-white/10 transition-colors ${i?"bg-emerald-500/5 hover:bg-emerald-500/10":"bg-rose-500/5 hover:bg-rose-500/10"}`,children:[(0,t.jsxs)("div",{className:"px-6 py-4 border-b border-white/10 bg-white/5 rounded-t-xl",children:[(0,t.jsx)("h3",{className:`font-semibold ${i?"text-emerald-400":"text-rose-400"}`,children:e}),(0,t.jsx)("p",{className:"text-xs text-muted",children:s})]}),0===r.length?(0,t.jsxs)("p",{className:"px-6 py-8 text-sm text-muted",children:["No ",a.toLowerCase()," records found."]}):(0,t.jsxs)("div",{className:"divide-y divide-white/5",children:[(0,t.jsxs)("div",{className:"grid grid-cols-12 px-6 py-3 text-xs font-medium text-muted bg-white/5",children:[(0,t.jsx)("div",{className:"col-span-3",children:"Product"}),(0,t.jsx)("div",{className:"col-span-2 text-right",children:"Qty"}),(0,t.jsx)("div",{className:"col-span-2 text-right",children:"Rate"}),(0,t.jsx)("div",{className:"col-span-2 text-right",children:"Value"}),(0,t.jsx)("div",{className:"col-span-3 text-center",children:"Entry / Date"})]}),r.map(e=>(0,t.jsxs)("div",{className:"grid grid-cols-12 gap-3 px-6 py-4 text-sm bg-transparent hover:bg-white/5 transition",children:[(0,t.jsxs)("div",{className:"col-span-3",children:[(0,t.jsx)("div",{className:"font-medium text-foreground",children:e.name}),(0,t.jsx)("div",{className:"text-xs text-muted",children:e.unit})]}),(0,t.jsx)("div",{className:"col-span-2 text-right font-medium text-foreground",children:e.quantity}),(0,t.jsxs)("div",{className:"col-span-2 text-right text-muted",children:["₹",e.price]}),(0,t.jsxs)("div",{className:`col-span-2 text-right font-semibold ${o}`,children:["₹",e.quantity*e.price]}),(0,t.jsxs)("div",{className:"col-span-3 text-xs text-center text-muted",children:[(0,t.jsx)("div",{className:"font-medium",children:e.entryNo}),(0,t.jsx)("div",{children:new Date(e.date).toLocaleDateString()})]})]},e._id))]})]})}function r({data:e}){if(!e)return(0,t.jsx)("section",{className:"rounded-2xl border border-slate-200 bg-white p-8",children:(0,t.jsx)("div",{className:"flex justify-center py-16",children:(0,t.jsx)("div",{className:"h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"})})});let r=e.filter(e=>"Purchase"===e.voucher),a=e.filter(e=>"Sale"===e.voucher);return(0,t.jsxs)("section",{className:"rounded-2xl border border-slate-200 bg-white p-8",children:[(0,t.jsxs)("div",{className:"mb-6",children:[(0,t.jsx)("h2",{className:"text-2xl font-semibold text-slate-900",children:"Stock History"}),(0,t.jsx)("p",{className:"text-slate-500",children:"Purchases and sales recorded in your inventory"})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,t.jsx)(s,{title:"Purchases",subtitle:"Stock added to inventory",rows:r,type:"Purchase"}),(0,t.jsx)(s,{title:"Sales",subtitle:"Stock sold to customers",rows:a,type:"Sale"})]})]})}e.s(["default",()=>r],42189)},69297,e=>{"use strict";var t=e.i(43102),s=e.i(84160),r=e.i(16748);async function a(e){let[t,s,a]=await Promise.all([r.default.get("/api/inventory",{params:{email:e}}),r.default.get("/api/low-stock",{params:{email:e}}),r.default.get("/api/stock",{params:{email:e}})]);return{inventory:t.data,lowStock:s.data,stockHistory:a.data}}var i=e.i(27022),o=e.i(12480),n=e.i(1637),l=e.i(56311),d=e.i(59468),c=e.i(63074),u=e.i(19328),p=e.i(48209),m=e.i(42189),f=e.i(16078);let h=({children:e})=>(0,t.jsx)(o.motion.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},exit:{opacity:0,y:12},transition:{duration:.35,ease:"easeOut"},children:e});function x(){let[e,r]=(0,s.useState)(!1),[o,x]=(0,s.useState)(!1),[g,y]=(0,s.useState)(!1),[b,v]=(0,s.useState)(""),[j,w]=(0,s.useState)(null),[N,k]=(0,s.useState)(!0),{user:E}=(0,l.useUser)(),C=E?.primaryEmailAddress?.emailAddress;return(0,s.useEffect)(()=>{C&&(async()=>{k(!0);try{let e=await a(C);w(e)}catch(e){console.error("Inventory snapshot failed",e)}finally{k(!1)}})()},[C,g]),(0,t.jsxs)("section",{className:"bg-stone-50 py-24",children:[(0,t.jsx)(n.Toaster,{}),(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-6 space-y-20",children:[(0,t.jsxs)("header",{className:"max-w-3xl",children:[(0,t.jsx)("h1",{className:"text-4xl md:text-5xl font-extrabold text-stone-900",children:"Inventory & Operations"}),(0,t.jsx)("p",{className:"mt-4 text-lg text-stone-600",children:"Track stock, record purchases and sales, and understand how your inventory impacts profit."})]}),(0,t.jsxs)("section",{className:"bg-white border border-stone-200 rounded-2xl p-6 shadow-sm",children:[(0,t.jsx)("h2",{className:"text-xl font-semibold text-stone-900 mb-4",children:"Quick actions"}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-4",children:[(0,t.jsx)("button",{onClick:()=>{r(!0),x(!1)},className:`px-6 py-3 rounded-xl font-semibold transition
                ${e?"bg-emerald-600 text-white":"bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`,children:"Add Purchase"}),(0,t.jsx)("button",{onClick:()=>{x(!0),r(!1)},className:`px-6 py-3 rounded-xl font-semibold transition
                ${o?"bg-rose-600 text-white":"bg-rose-50 text-rose-700 hover:bg-rose-100"}`,children:"Record Sale"}),(0,t.jsx)("button",{onClick:()=>{r(!1),x(!1)},className:"px-6 py-3 rounded-xl font-semibold   bg-stone-100 text-stone-700 hover:bg-stone-200 transition",children:"View Inventory"})]})]}),(0,t.jsxs)(i.AnimatePresence,{mode:"wait",children:[e&&(0,t.jsx)(h,{children:(0,t.jsx)(d.default,{visible:!0,preSelectedProduct:b,reloadSetter:y,reload:g})},"purchase"),o&&(0,t.jsx)(h,{children:(0,t.jsx)(c.default,{visible:!0,preSelectedProduct:b,reloadSetter:y,reload:g})},"sale")]}),(0,t.jsx)(h,{children:(0,t.jsx)(u.default,{visible:!0,data:j?.inventory,productSetter:v,purchaseSetter:r,saleSetter:x})}),(0,t.jsxs)("section",{className:"space-y-16",children:[(0,t.jsx)(p.default,{data:j?.lowStock}),(0,t.jsx)(m.default,{data:j?.stockHistory}),(0,t.jsx)(f.default,{})]})]})]})}e.s(["default",()=>x],69297)}]);