(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,1637,e=>{"use strict";let t,s;var a,i=e.i(84160);let r={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,d=(e,t)=>{let s="",a="",i="";for(let r in e){let o=e[r];"@"==r[0]?"i"==r[1]?s=r+" "+o+";":a+="f"==r[1]?d(o,r):r+"{"+d(o,"k"==r[1]?"":t)+"}":"object"==typeof o?a+=d(o,t?t.replace(/([^,])+/g,e=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):r):null!=o&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=d.p?d.p(r,o):r+":"+o+";")}return s+(t&&i?t+"{"+i+"}":i)+a},c={},u=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+u(e[s]);return t}return e};function p(e){let t,s,a=this||{},i=e.call?e(a.p):e;return((e,t,s,a,i)=>{var r;let p=u(e),m=c[p]||(c[p]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(p));if(!c[m]){let t=p!==e?e:(e=>{let t,s,a=[{}];for(;t=o.exec(e.replace(n,""));)t[4]?a.shift():t[3]?(s=t[3].replace(l," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(l," ").trim();return a[0]})(e);c[m]=d(i?{["@keyframes "+m]:t}:t,s?"":"."+m)}let f=s&&c.g?c.g:null;return s&&(c.g=c[m]),r=c[m],f?t.data=t.data.replace(f,r):-1===t.data.indexOf(r)&&(t.data=a?r+t.data:t.data+r),m})(i.unshift?i.raw?(t=[].slice.call(arguments,1),s=a.p,i.reduce((e,a,i)=>{let r=t[i];if(r&&r.call){let e=r(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;r=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==r?"":r)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(a.p):t),{}):i,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||r})(a.target),a.g,a.o,a.k)}p.bind({g:1});let m,f,x,h=p.bind({k:1});function b(e,t){let s=this||{};return function(){let a=arguments;function i(r,o){let n=Object.assign({},r),l=n.className||i.className;s.p=Object.assign({theme:f&&f()},n),s.o=/ *go\d+/.test(l),n.className=p.apply(s,a)+(l?" "+l:""),t&&(n.ref=o);let d=e;return e[0]&&(d=n.as||e,delete n.as),x&&d[0]&&x(n),m(d,n)}return t?t(i):i}}var g=(e,t)=>"function"==typeof e?e(t):e,y=(t=0,()=>(++t).toString()),v=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},w="default",j=(e,t)=>{let{toastLimit:s}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,s)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return j(e,{type:+!!e.toasts.find(e=>e.id===a.id),toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let r=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+r}))}}},N=[],k={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},E={},C=(e,t=w)=>{E[t]=j(E[t]||k,e),N.forEach(([e,s])=>{e===t&&s(E[t])})},D=e=>Object.keys(E).forEach(t=>C(e,t)),A=(e=w)=>t=>{C(t,e)},O={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},$=e=>(t,s)=>{let a,i=((e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||y()}))(t,e,s);return A(i.toasterId||(a=i.id,Object.keys(E).find(e=>E[e].toasts.some(e=>e.id===a))))({type:2,toast:i}),i.id},I=(e,t)=>$("blank")(e,t);I.error=$("error"),I.success=$("success"),I.loading=$("loading"),I.custom=$("custom"),I.dismiss=(e,t)=>{let s={type:3,toastId:e};t?A(t)(s):D(s)},I.dismissAll=e=>I.dismiss(void 0,e),I.remove=(e,t)=>{let s={type:4,toastId:e};t?A(t)(s):D(s)},I.removeAll=e=>I.remove(void 0,e),I.promise=(e,t,s)=>{let a=I.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?g(t.success,e):void 0;return i?I.success(i,{id:a,...s,...null==s?void 0:s.success}):I.dismiss(a),e}).catch(e=>{let i=t.error?g(t.error,e):void 0;i?I.error(i,{id:a,...s,...null==s?void 0:s.error}):I.dismiss(a)}),e};var L=1e3,S=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,T=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${S} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,P=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,z=b("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${P} 1s linear infinite;
`,_=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,B=h`
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
}`,F=b("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${_} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${B} 0.2s ease-out forwards;
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
`,U=b("div")`
  position: absolute;
`,q=b("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,H=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=b("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${H} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Y=({toast:e})=>{let{icon:t,type:s,iconTheme:a}=e;return void 0!==t?"string"==typeof t?i.createElement(K,null,t):t:"blank"===s?null:i.createElement(q,null,i.createElement(z,{...a}),"loading"!==s&&i.createElement(U,null,"error"===s?i.createElement(R,{...a}):i.createElement(F,{...a})))},G=b("div")`
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
`,V=b("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,X=i.memo(({toast:e,position:t,style:s,children:a})=>{let r=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[a,i]=v()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${h(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},o=i.createElement(Y,{toast:e}),n=i.createElement(V,{...e.ariaProps},g(e.message,e));return i.createElement(G,{className:e.className,style:{...r,...s,...e.style}},"function"==typeof a?a({icon:o,message:n}):i.createElement(i.Fragment,null,o,n))});a=i.createElement,d.p=void 0,m=a,f=void 0,x=void 0;var W=({id:e,className:t,style:s,onHeightUpdate:a,children:r})=>{let o=i.useCallback(t=>{if(t){let s=()=>{a(e,t.getBoundingClientRect().height)};s(),new MutationObserver(s).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return i.createElement("div",{ref:o,className:t,style:s},r)},Z=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,J=({reverseOrder:e,position:t="top-center",toastOptions:s,gutter:a,children:r,toasterId:o,containerStyle:n,containerClassName:l})=>{let{toasts:d,handlers:c}=((e,t="default")=>{let{toasts:s,pausedAt:a}=((e={},t=w)=>{let[s,a]=(0,i.useState)(E[t]||k),r=(0,i.useRef)(E[t]);(0,i.useEffect)(()=>(r.current!==E[t]&&a(E[t]),N.push([t,a]),()=>{let e=N.findIndex(([e])=>e===t);e>-1&&N.splice(e,1)}),[t]);let o=s.toasts.map(t=>{var s,a,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(s=e[t.type])?void 0:s.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||O[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...s,toasts:o}})(e,t),r=(0,i.useRef)(new Map).current,o=(0,i.useCallback)((e,t=L)=>{if(r.has(e))return;let s=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,s)},[]);(0,i.useEffect)(()=>{if(a)return;let e=Date.now(),i=s.map(s=>{if(s.duration===1/0)return;let a=(s.duration||0)+s.pauseDuration-(e-s.createdAt);if(a<0){s.visible&&I.dismiss(s.id);return}return setTimeout(()=>I.dismiss(s.id,t),a)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[s,a,t]);let n=(0,i.useCallback)(A(t),[t]),l=(0,i.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),d=(0,i.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),c=(0,i.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,i.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:i=8,defaultPosition:r}=t||{},o=s.filter(t=>(t.position||r)===(e.position||r)&&t.height),n=o.findIndex(t=>t.id===e.id),l=o.filter((e,t)=>t<n&&e.visible).length;return o.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[s]);return(0,i.useEffect)(()=>{s.forEach(e=>{if(e.dismissed)o(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[s,o]),{toasts:s,handlers:{updateHeight:d,startPause:l,endPause:c,calculateOffset:u}}})(s,o);return i.createElement("div",{"data-rht-toaster":o||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:c.startPause,onMouseLeave:c.endPause},d.map(s=>{let o,n,l=s.position||t,d=c.calculateOffset(s,{reverseOrder:e,gutter:a,defaultPosition:t}),u=(o=l.includes("top"),n=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:v()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${d*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...n});return i.createElement(W,{id:s.id,key:s.id,onHeightUpdate:c.updateHeight,className:s.visible?Z:"",style:u},"custom"===s.type?g(s.message,s):r?r(s):i.createElement(X,{toast:s,position:l}))}))};e.s(["Toaster",()=>J,"default",()=>I,"toast",()=>I],1637)},10982,e=>{"use strict";var t=e.i(43102);function s({daysLeft:e}){return e<=0?(0,t.jsx)("span",{className:"px-3 py-1 text-xs rounded-full bg-rose-500/15 text-rose-400",children:"EXPIRED"}):e<=30?(0,t.jsx)("span",{className:"px-3 py-1 text-xs rounded-full bg-amber-500/15 text-amber-400",children:"EXPIRING SOON"}):(0,t.jsx)("span",{className:"px-3 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-400",children:"ACTIVE"})}function a({license:e,onDelete:a}){let i=new Date(e.expiryDate),r=new Date,o=Math.ceil((i.getTime()-r.getTime())/864e5);return(0,t.jsxs)("div",{className:"   rounded-2xl bg-white border border-stone-200   p-5 shadow-sm hover:shadow-md   transition-all duration-200   ",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-semibold text-stone-900",children:e.licenseName}),(0,t.jsx)("p",{className:"text-sm text-stone-500",children:e.issuingAuthority})]}),(0,t.jsx)(s,{daysLeft:o})]}),(0,t.jsxs)("div",{className:"mt-4 text-sm text-stone-600",children:["Expires on"," ",(0,t.jsx)("span",{className:"font-medium text-stone-900",children:i.toISOString().split("T")[0]})]}),o<=30&&(0,t.jsx)("div",{className:`mt-3 rounded-lg px-3 py-2 text-xs font-medium
            ${o<=0?"bg-rose-50 text-rose-600 border border-rose-200":"bg-amber-50 text-amber-700 border border-amber-200"}`,children:o<=0?"License expired":`${o} days remaining`}),(0,t.jsx)("div",{className:"mt-4 border-t border-stone-100 pt-4 flex justify-end",children:(0,t.jsx)("button",{onClick:()=>a(e._id),className:"   text-xs font-medium text-rose-600   hover:text-rose-700 hover:underline   ",children:"Remove license"})})]})}e.s(["LicenseCard",()=>a],10982)},67028,e=>{"use strict";e.i(39864);var t=e.i(43102),s=e.i(56311),a=e.i(84160);e.i(10982);var i=e.i(16748),r=e.i(1637);function o({email:e}){let[s,o]=(0,a.useState)({licenseName:"",licenseCategory:"Business",issuingAuthority:"",issueDate:"",expiryDate:"",renewalRequired:!0}),n=async()=>{try{await i.default.post("/api/licenses",{email:e,...s}),r.default.success("License added"),o({licenseName:"",licenseCategory:"Business",issuingAuthority:"",issueDate:"",expiryDate:"",renewalRequired:!0})}catch{r.default.error("Failed to add license")}};return(0,t.jsxs)("div",{className:"bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold mb-6",children:"Add License"}),(0,t.jsxs)("div",{className:"grid md:grid-cols-2 gap-4",children:[(0,t.jsx)("input",{placeholder:"License name",value:s.licenseName,onChange:e=>o({...s,licenseName:e.target.value}),className:"loan-input"}),(0,t.jsx)("input",{placeholder:"Issuing authority",value:s.issuingAuthority,onChange:e=>o({...s,issuingAuthority:e.target.value}),className:"loan-input"}),(0,t.jsx)("input",{type:"date",value:s.issueDate,onChange:e=>o({...s,issueDate:e.target.value}),className:"loan-input"}),(0,t.jsx)("input",{type:"date",value:s.expiryDate,onChange:e=>o({...s,expiryDate:e.target.value}),className:"loan-input"})]}),(0,t.jsx)("button",{onClick:n,className:"mt-6 w-full py-3 rounded-full font-bold text-black   bg-gradient-to-r from-indigo-400 to-pink-400",children:"Add License →"})]})}function n(){let[e,i]=(0,a.useState)(""),[r,n]=(0,a.useState)(""),[l,d]=(0,a.useState)(""),[c,u]=(0,a.useState)(""),{user:p}=(0,s.useUser)();return(0,a.useEffect)(()=>{if(!c)return void u(p?.primaryEmailAddress.emailAddress)},[c]),(0,t.jsxs)("section",{className:"relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28",children:[(0,t.jsx)("div",{className:"absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full"}),(0,t.jsx)("div",{className:"absolute top-1/2 -right-32 w-96 h-96 bg-emerald-600/30 blur-3xl rounded-full"}),(0,t.jsxs)("div",{className:"relative max-w-7xl mx-auto px-6 space-y-24",children:[(0,t.jsxs)("div",{className:"max-w-3xl",children:[(0,t.jsx)("h1",{className:"text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent",children:"Licenses & Compliance"}),(0,t.jsx)("p",{className:"mt-6 text-lg text-slate-300",children:"Keep track of all your business licenses, certifications, and compliance requirements in one place."})]}),(0,t.jsxs)("div",{className:"backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl",children:[(0,t.jsx)("h2",{className:"text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent",children:"Manage Your Licenses"}),(0,t.jsx)("p",{className:"text-slate-300 mb-8",children:"Add and manage your existing business licenses to stay compliant and organized."}),(0,t.jsx)(o,{email:c})]}),(0,t.jsxs)("div",{className:"space-y-10",children:[(0,t.jsx)("h2",{className:"text-4xl font-extrabold",children:"Licenses You May Need"}),(0,t.jsx)("p",{className:"text-slate-300 max-w-3xl",children:"Based on your business type and location, these are some commonly required licenses and certifications for MSMEs in India."}),(0,t.jsx)("div",{className:"grid md:grid-cols-2 gap-8",children:[{title:"Udyam Registration",desc:"Official MSME registration that makes your business eligible for government schemes, subsidies, and bank benefits.",link:"https://udyamregistration.gov.in/"},{title:"GST Registration",desc:"Mandatory for businesses above ₹40 lakh turnover or for inter-state trade and tax compliance.",link:"https://www.gst.gov.in/"},{title:"Trade License",desc:"Issued by the municipal corporation to legally carry out business activities at a specific location.",link:null},{title:"Shop & Establishment Act License",desc:"Regulates working conditions, hours, and wages for commercial establishments.",link:null}].map((e,s)=>(0,t.jsxs)("div",{className:"backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl",children:[(0,t.jsx)("h3",{className:"text-xl font-bold mb-3",children:e.title}),(0,t.jsx)("p",{className:"text-slate-300 mb-4",children:e.desc}),e.link?(0,t.jsx)("a",{href:e.link,target:"_blank",rel:"noreferrer",className:"text-indigo-400 hover:underline",children:"Official Website →"}):(0,t.jsx)("span",{className:"text-slate-400",children:"Varies by location"})]},s))})]})]})]})}e.s(["default",()=>n],67028)}]);