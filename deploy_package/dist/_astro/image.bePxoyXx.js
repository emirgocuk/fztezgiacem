import{r as c}from"./index.JXKNaeUN.js";var l={exports:{}},u={};/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d;function v(){if(d)return u;d=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function s(a,o,t){var i=null;if(t!==void 0&&(i=""+t),o.key!==void 0&&(i=""+o.key),"key"in o){t={};for(var n in o)n!=="key"&&(t[n]=o[n])}else t=o;return o=t.ref,{$$typeof:r,type:a,key:i,ref:o!==void 0?o:null,props:t}}return u.Fragment=e,u.jsx=s,u.jsxs=s,u}var p;function C(){return p||(p=1,l.exports=v()),l.exports}var L=C();/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=r=>r.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,s,a)=>a?a.toUpperCase():s.toLowerCase()),m=r=>{const e=w(r);return e.charAt(0).toUpperCase()+e.slice(1)},x=(...r)=>r.filter((e,s,a)=>!!e&&e.trim()!==""&&a.indexOf(e)===s).join(" ").trim(),E=r=>{for(const e in r)if(e.startsWith("aria-")||e==="role"||e==="title")return!0};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var A={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=c.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:s=2,absoluteStrokeWidth:a,className:o="",children:t,iconNode:i,...n},f)=>c.createElement("svg",{ref:f,...A,width:e,height:e,stroke:r,strokeWidth:a?Number(s)*24/Number(e):s,className:x("lucide",o),...!t&&!E(n)&&{"aria-hidden":"true"},...n},[...i.map(([h,R])=>c.createElement(h,R)),...Array.isArray(t)?t:[t]]));/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=(r,e)=>{const s=c.forwardRef(({className:a,...o},t)=>c.createElement(_,{ref:t,iconNode:e,className:x(`lucide-${k(m(r))}`,`lucide-${r}`,a),...o}));return s.displayName=m(r),s};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],T=j("image",y);export{T as I,j as c,L as j};
