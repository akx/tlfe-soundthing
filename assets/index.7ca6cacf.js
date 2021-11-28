import{R as a,u as h,a as v}from"./vendor.2c090166.js";const N=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerpolicy&&(s.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?s.credentials="include":t.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=n(t);fetch(t.href,s)}};N();function E(e,o=440){return Math.pow(2,(e-69)/12)*o}const w=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];function C(e){if(isNaN(e)||e===-1/0||e===1/0)return"";e=Math.round(e);const o=w[e%12],n=Math.floor(e/12)-1;return o+n}function q(e,o,n){const r=[];for(let t=e;t<o;t++)r.push(n(t));return r}function p(e){let o=e[0];for(let n=1;n<e.length;n++)o=Math.max(Math.abs(e[n]),o);return o}function b(e,o){const{width:n,height:r}=e.canvas,t=new Uint8Array(256);o.getByteFrequencyData(t),e.beginPath(),e.moveTo(0,r);const s=p(t);for(let c=0;c<t.length;c++){const i=c/t.length*n,u=t[c]/s*r;e.lineTo(i,r-u)}e.lineTo(n,r),e.lineTo(0,r),e.closePath(),e.fill()}function A(e,o){const n=new Float32Array(512),{width:r,height:t}=e.canvas,s=t/2;o.getFloatTimeDomainData(n);const c=p(n);e.beginPath(),e.strokeStyle="1px solid black";for(let i=0;i<n.length;i++){const u=i/n.length*r,f=s+n[i]/c*s;i===0?e.moveTo(u,f):e.lineTo(u,f)}e.stroke()}function x({vizNode:e}){const o=a.useRef(null),n=a.useCallback(()=>{const r=o.current;if(!r)return;const t=r.getContext("2d");!t||(r.width=+r.width,t.fillStyle=`hsl(${+new Date/100%360}, 100%, 60%)`,b(t,e),A(t,e))},[e]);return h(n,30),a.createElement("canvas",{width:800,height:300,style:{width:"40%",border:"1px solid orange"},ref:o})}function M(){const e=new AudioContext,o=e.createOscillator();o.type="square";const n=e.createBiquadFilter();n.frequency.value=800,n.type="lowpass";const r=e.createAnalyser();return r.fftSize=512,r.smoothingTimeConstant=.3,o.connect(n),n.connect(e.destination),n.connect(r),{audioContext:e,oscNode:o,filterNode:n,vizNode:r}}const g=432;function S(){const[e]=a.useState(()=>M()),[o,n]=a.useState("44 66 89 30"),[r,t]=a.useState(120),[s,c]=a.useState(800),[i,u]=a.useState(0);h(()=>{u(l=>l+1)},6e4/(r*4));const f=a.useMemo(()=>o.split(/\s+/).map(l=>+l).filter(Boolean),[o]),m=a.useMemo(()=>{const l=i%f.length,d=f[l];return E(d,g)||g},[i,f]);a.useEffect(()=>{e.oscNode.frequency.value=m,e.filterNode.frequency.value=s},[e.filterNode.frequency,e.oscNode.frequency,m,s]);const y=a.useCallback(l=>{n(d=>(d+" "+l).trim())},[]);return a.createElement("div",{className:"App"},a.createElement("button",{onClick:()=>{e.audioContext.resume(),e.oscNode.start(),console.log(e.audioContext.state)}},"Go"),a.createElement("hr",null),a.createElement("input",{type:"text",value:o,onChange:l=>n(l.target.value)}),a.createElement("input",{type:"range",min:20,max:300,value:r,onChange:l=>t(l.target.valueAsNumber)}),r,a.createElement("hr",null),a.createElement("input",{type:"range",min:400,max:22e3,value:s,onChange:l=>c(l.target.valueAsNumber)}),a.createElement("hr",null),a.createElement("div",{style:{display:"flex",flexWrap:"wrap"}},q(20,150,l=>a.createElement("button",{key:l,onClick:()=>y(String(l))},C(l)))),a.createElement("hr",null),a.createElement(x,{vizNode:e.vizNode}))}v.render(a.createElement(a.StrictMode,null,a.createElement(S,null)),document.getElementById("root"));
