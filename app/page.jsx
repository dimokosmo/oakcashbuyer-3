"use client";
import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, Fragment } from "react";
import { investorFitScoreRange, trackEvent } from "../lib/analytics";
import { locations as CITY_LOCATIONS } from "../lib/locations";

// ═══════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — DARK LUXURY EDITORIAL V3
// ═══════════════════════════════════════════════════════════════════
const C = {
  bg:"#0C0C0C",card:"#151515",elevated:"#1E1E1E",subtle:"#111111",
  surface:"#262626",surfaceHover:"#303030",
  amber:"#E8A84C",amberL:"#F2C97E",amberD:"#C4872E",amberGlow:"rgba(232,168,76,0.12)",
  cream:"#F5F0E8",creamM:"#D4CCBC",creamD:"#B8B0A0",
  white:"#fff",text:"#E8E4DC",muted:"#9A948A",dim:"#6B665E",
  border:"rgba(255,255,255,0.06)",borderH:"rgba(255,255,255,0.12)",
  green:"#6BBF7B",greenBg:"rgba(74,139,92,0.12)",
  err:"#E8685A",
};

// ═══════════════════════════════════════════════════════════════════
// PERSONALIZATION CONTEXT
// ═══════════════════════════════════════════════════════════════════
const INTENTS = { DEFAULT:"default", INHERITED:"inherited", DISTRESSED:"distressed", FAST:"fastClose" };
const CONTENT = {
  [INTENTS.DEFAULT]:{ hero:"Have a Property That Might Be a Good Fit for a Local Investor?",sub:"I buy and review homes across Oakland County for rentals, renovations, and investment opportunities. If your property needs work, has tenants, is inherited, or you simply want a direct sale without preparing it for the market, start with a quick property review.",cta:"Submit My Property",badge:null,formTitle:"Submit Your Property for Review",formSub:"Share the basics so I can review whether the property may fit a direct purchase, rental, renovation, or off-market opportunity." },
  [INTENTS.INHERITED]:{ hero:"Inherited a\nProperty?",sub:"If you inherited a home and want to understand whether a direct investor sale could make sense, submit the property for a local review. Estate timing, repairs, occupancy, and location can all be discussed without pressure.",cta:"Submit Inherited Property",badge:"Estate-Aware Review",formTitle:"Submit the Inherited Property",formSub:"Share the property details, probate status, and timeline so the situation can be reviewed clearly." },
  [INTENTS.DISTRESSED]:{ hero:"Property Needs\nWork?",sub:"Homes with repairs, deferred maintenance, code issues, fire damage, water damage, or cleanup needs may still be worth reviewing for a renovation or investment purchase.",cta:"Submit for Investor Review",badge:"Repair-Friendly Review",formTitle:"Tell Me About the Property Condition",formSub:"Be direct about the condition. The goal is to understand whether an investor review makes sense." },
  [INTENTS.FAST]:{ hero:"Need a Direct\nSale Conversation?",sub:"If timing, tenants, vacancy, repairs, or personal circumstances make a traditional sale difficult, submit the property and timeline for review. Not every property will receive an offer.",cta:"Start Property Review",badge:"Direct Review Path",formTitle:"Share Your Timeline",formSub:"Tell me what is driving the timeline so I can review the property in context." },
};
const DISCLOSURE="Dimitrios Kosmidis is a licensed Michigan real estate professional and real estate investor. This site is intended for homeowners interested in a possible direct sale, investor purchase, or off-market property review. Not every property will receive an offer. Submitting a property does not create an agency relationship or obligation to sell. If a traditional listing appears to be a better fit, that option may be discussed separately.";
const COND_FIELDS = {
  [INTENTS.INHERITED]:[{name:"probateStatus",label:"Probate Status",opts:["Not Started","In Progress","Completed","Not Sure"]},{name:"outOfState",label:"Live out of state?",opts:["Yes","No"]}],
  [INTENTS.DISTRESSED]:[{name:"damageType",label:"Type of Issues",opts:["Fire Damage","Water Damage","Foundation","Roof","Code Violations","Mold","Other"]},{name:"repairEstimate",label:"Est. Repair Cost",opts:["Under $10K","$10K-$30K","$30K-$75K","$75K+","No Idea"]}],
  [INTENTS.FAST]:[{name:"urgencyReason",label:"What's driving urgency?",opts:["Foreclosure","Relocation","Divorce","Financial","Estate","Other"]},{name:"moveOutDate",label:"When do you need out?",opts:["Immediately","Within 2 Weeks","Within 30 Days","Flexible"]}],
};
const IntentCtx = createContext(null);
function IntentProvider({children}){
  const[intent,setIntent]=useState(INTENTS.DEFAULT);
  const content=useMemo(()=>CONTENT[intent]||CONTENT[INTENTS.DEFAULT],[intent]);
  const condFields=useMemo(()=>COND_FIELDS[intent]||[],[intent]);
  return <IntentCtx.Provider value={{intent,setIntent,content,condFields,INTENTS}}>{children}</IntentCtx.Provider>;
}
function useIntent(){return useContext(IntentCtx);}

// ═══════════════════════════════════════════════════════════════════
// SCROLL REVEAL HOOK
// ═══════════════════════════════════════════════════════════════════
function useReveal(){
  useEffect(()=>{
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("vis");e.target.style.transitionDelay=e.target.dataset.delay||"0s";}}),{threshold:0.08,rootMargin:"0px 0px -50px 0px"});
    document.querySelectorAll(".sr").forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  });
}

// ═══════════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════════════════════════════
function Counter({end,suffix="",prefix=""}){
  const ref=useRef(null);const[val,setVal]=useState(0);const[go,setGo]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setGo(true);},{threshold:0.5});
    if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();
  },[]);
  useEffect(()=>{
    if(!go)return;let c=0;const step=Math.max(1,Math.ceil(end/50));
    const iv=setInterval(()=>{c+=step;if(c>=end){setVal(end);clearInterval(iv);}else setVal(c);},30);
    return()=>clearInterval(iv);
  },[go,end]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ═══════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════
const Ico={
  Check:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Arrow:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Chev:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Star:({s=15})=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Menu:()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  X:()=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Book:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Back:({s=18})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
const FAQS=[
  {q:"Do I need to make repairs before submitting?",a:"No. The review is meant for properties as they are today, including homes with deferred maintenance, tenants, vacancy, cleanup needs, or inherited-property questions.",cat:"general"},
  {q:"Will every property receive an offer?",a:"No. Some properties may be a fit for a direct investor purchase, some may need more information, and some may be better suited for a traditional listing or another path.",cat:"process"},
  {q:"What if I inherited a property and live out of state?",a:"Inherited properties can be reviewed even when the owner is out of state. Probate status, title questions, occupancy, and timing can all be considered during the review.",cat:"inherited"},
  {q:"Is this a Realtor listing funnel?",a:"No. The main purpose is local investor review for possible direct purchase, renovation, rental, or off-market opportunities. If listing appears to be a better fit, that can be discussed separately.",cat:"financial"},
  {q:"What types of properties are worth submitting?",a:"Single-family homes, duplexes, condos, townhomes, tenant-occupied homes, vacant homes, inherited homes, and properties needing repairs may all be worth a review.",cat:"general"},
  {q:"How is a potential offer evaluated?",a:"Location, condition, occupancy, repair scope, comparable sales, rental potential, resale potential, title issues, and timing all matter. The goal is a clear, ethical review.",cat:"process"},
  {q:"What if my property has liens, back taxes, or title issues?",a:"Those details should be disclosed during review. Some issues can be worked through before closing, but every situation is evaluated case by case.",cat:"financial"},
];

const POSTS=[
  {id:1,cat:"Investor Review",title:"What Makes a Property Fit for a Local Investor Review?",ex:"Repair scope, rental potential, resale value, occupancy, location, and seller goals all shape whether a direct investor conversation makes sense.",date:"Feb 18, 2026",read:"6 min",feat:true,grad:`linear-gradient(135deg,${C.amberGlow},rgba(12,12,12,0.95))`,kw:["local investor review","oakland county investment property"]},
  {id:2,cat:"Inherited Property",title:"Inherited Property Review in Oakland County",ex:"How probate status, title, repairs, family timing, and out-of-state ownership affect a possible direct sale.",date:"Feb 12, 2026",read:"8 min",grad:`linear-gradient(135deg,${C.greenBg},rgba(12,12,12,0.95))`,kw:["inherited property review","oakland county probate"]},
  {id:3,cat:"Market Insights",title:"Oakland County Investment Property Signals",ex:"A practical look at rental demand, renovation opportunities, days on market, and neighborhood-level investor fit.",date:"Feb 8, 2026",read:"5 min",grad:`linear-gradient(135deg,rgba(38,38,38,0.6),rgba(12,12,12,0.95))`,kw:["oakland county real estate","investment property"]},
  {id:4,cat:"Distressed Property",title:"Submitting a Property That Needs Repairs",ex:"Fire damage, foundation issues, deferred maintenance, and code concerns can all affect whether a renovation purchase is viable.",date:"Feb 2, 2026",read:"7 min",grad:`linear-gradient(135deg,rgba(232,168,76,0.08),rgba(12,12,12,0.95))`,kw:["property needs repairs","distressed property review"]},
  {id:5,cat:"Direct Sale",title:"Direct Investor Sale vs. Traditional Listing",ex:"A clear comparison of preparation, timing, certainty, market exposure, and tradeoffs for homeowners considering both paths.",date:"Jan 28, 2026",read:"6 min",grad:`linear-gradient(135deg,rgba(245,240,232,0.04),rgba(12,12,12,0.95))`,kw:["direct investor sale","traditional listing alternative"]},
  {id:6,cat:"Urgent Timeline",title:"When Timing Makes a Direct Review Worth Considering",ex:"Tenant issues, vacancy, repairs, relocation, foreclosure pressure, and inherited-property deadlines can all change the best next step.",date:"Jan 22, 2026",read:"9 min",grad:`linear-gradient(135deg,rgba(232,104,90,0.08),rgba(12,12,12,0.95))`,kw:["urgent property review","direct sale michigan"]},
];

const LOCATIONS=CITY_LOCATIONS;

const CATS=["All","Investor Review","Inherited Property","Distressed Property","Direct Sale","Urgent Timeline","Market Insights"];

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════
const css=`
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');
:root{--e:cubic-bezier(0.16,1,0.3,1);--sp:cubic-bezier(0.34,1.56,0.64,1);}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:'Outfit',sans-serif;background:${C.bg};color:${C.text};-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::selection{background:${C.amber};color:${C.bg};}
a{color:inherit;text-decoration:none;}

.noise{position:fixed;inset:0;pointer-events:none;z-index:9999;opacity:0.02;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

.sr{opacity:0;transform:translateY(40px);transition:opacity 0.85s var(--e),transform 0.85s var(--e);}
.sr.vis{opacity:1;transform:translateY(0);}

@keyframes orbF{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(30px,-40px) scale(1.05);}66%{transform:translate(-20px,30px) scale(0.95);}}
@keyframes fade{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes scaleI{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:scale(1);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@keyframes borderDraw{from{clip-path:inset(0 100% 0 0);}to{clip-path:inset(0 0 0 0);}}
@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(232,168,76,0.15);}50%{box-shadow:0 0 40px rgba(232,168,76,0.3);}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 24px;transition:all 0.5s var(--e);}
.nav.sc{background:rgba(12,12,12,0.92);backdrop-filter:blur(24px) saturate(1.4);border-bottom:1px solid ${C.border};}
.nav-i{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:72px;}
.logo{font-family:'DM Serif Display',serif;font-size:23px;color:${C.cream};cursor:pointer;transition:opacity 0.2s;} .logo:hover{opacity:0.8;} .logo span{color:${C.amber};}
.nav-l{display:flex;align-items:center;gap:4px;list-style:none;}
.nl{font-size:14px;font-weight:500;color:${C.muted};padding:8px 14px;border-radius:8px;cursor:pointer;transition:all 0.25s var(--e);} .nl:hover{color:${C.cream};background:${C.surface};} .nl.act{color:${C.amber};}
.ncta{background:${C.amber};color:${C.bg};font-weight:600;padding:9px 20px;border-radius:8px;font-size:13px;cursor:pointer;transition:all 0.3s var(--e);border:none;font-family:'Outfit',sans-serif;margin-left:4px;} .ncta:hover{background:${C.amberL};transform:translateY(-1px);box-shadow:0 6px 20px rgba(232,168,76,0.25);}
.nmob{display:none;background:none;border:none;color:${C.cream};cursor:pointer;padding:8px;}
.mm{display:none;position:fixed;inset:0;background:${C.bg};z-index:99;padding:84px 24px 24px;flex-direction:column;gap:4px;} .mm.op{display:flex;}
.mm>div{font-size:18px;font-weight:500;color:${C.muted};padding:16px 0;border-bottom:1px solid ${C.border};cursor:pointer;transition:color 0.2s;} .mm>div:hover{color:${C.cream};}
@media(max-width:900px){.nav-l{display:none;}.nmob{display:block;}}

/* BTNS */
.btn{display:inline-flex;align-items:center;gap:10px;background:${C.amber};color:${C.bg};font-family:'Outfit',sans-serif;font-size:16px;font-weight:600;padding:16px 32px;border-radius:12px;border:none;cursor:pointer;transition:all 0.35s var(--e);position:relative;overflow:hidden;letter-spacing:0.01em;}
.btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent 60%);opacity:0;transition:opacity 0.3s;} .btn:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(232,168,76,0.3);} .btn:hover::before{opacity:1;} .btn:active{transform:translateY(-1px) scale(0.98);}
.btn-g{background:transparent;color:${C.cream};border:1.5px solid ${C.border};} .btn-g:hover{border-color:${C.amber};color:${C.amber};box-shadow:0 8px 32px rgba(232,168,76,0.1);}
.btn-s{background:${C.amber};color:${C.bg};font-size:15px;padding:13px 28px;border-radius:10px;border:none;font-family:'Outfit',sans-serif;font-weight:600;cursor:pointer;transition:all 0.3s var(--e);display:inline-flex;align-items:center;gap:8px;} .btn-s:hover{background:${C.amberL};transform:translateY(-1px);}

/* SECTION */
.sec{padding:110px 24px;position:relative;} .sec-i{max-width:1280px;margin:0 auto;}
.sh{margin-bottom:64px;} .sh.c{text-align:center;}
.sl{font-size:11px;font-weight:700;color:${C.amber};text-transform:uppercase;letter-spacing:0.14em;margin-bottom:14px;display:flex;align-items:center;gap:10px;} .sl::before{content:'';width:20px;height:1.5px;background:${C.amber};} .sh.c .sl{justify-content:center;} .sh.c .sl::before{display:none;}
.st{font-family:'DM Serif Display',serif;font-size:clamp(34px,5vw,54px);color:${C.cream};line-height:1.1;letter-spacing:-0.02em;margin-bottom:14px;} .st em{font-style:italic;color:${C.amber};}
.ss{font-size:17px;color:${C.muted};line-height:1.7;max-width:540px;} .sh.c .ss{margin:0 auto;}

/* HERO */
.hero{padding:170px 24px 110px;position:relative;overflow:hidden;min-height:100vh;display:flex;align-items:center;}
.hero .orb{position:absolute;border-radius:50%;filter:blur(90px);animation:orbF 20s ease-in-out infinite;}
.hero .o1{width:550px;height:550px;background:radial-gradient(circle,rgba(232,168,76,0.1),transparent 70%);top:-8%;right:-3%;animation-delay:0s;}
.hero .o2{width:450px;height:450px;background:radial-gradient(circle,rgba(232,168,76,0.05),transparent 70%);bottom:12%;left:-8%;animation-delay:-7s;}
.hero .o3{width:350px;height:350px;background:radial-gradient(circle,rgba(245,240,232,0.03),transparent 70%);top:45%;right:35%;animation-delay:-14s;}
.hero-i{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:1.1fr 1fr;gap:72px;align-items:center;position:relative;z-index:1;width:100%;}
.hero-c{animation:fade 1s var(--e) both;}
.hbadge{display:inline-flex;align-items:center;gap:10px;font-size:11px;font-weight:600;color:${C.amber};padding:9px 16px;border-radius:100px;border:1px solid rgba(232,168,76,0.2);background:rgba(232,168,76,0.05);margin-bottom:24px;text-transform:uppercase;letter-spacing:0.08em;}
.hdot{width:7px;height:7px;background:${C.amber};border-radius:50%;animation:pulse 2s infinite;}
.hero h1{font-family:'DM Serif Display',serif;font-size:clamp(42px,6vw,68px);color:${C.cream};line-height:1.06;letter-spacing:-0.03em;margin-bottom:22px;white-space:pre-line;}
.hero h1 em{font-style:italic;color:${C.amber};}
.hero-s{font-size:18px;line-height:1.75;color:${C.muted};margin-bottom:36px;max-width:480px;transition:all 0.5s var(--e);}
.hero-a{display:flex;gap:14px;flex-wrap:wrap;}
.hero-p{display:flex;align-items:center;gap:28px;margin-top:44px;padding-top:32px;border-top:1px solid ${C.border};}
.hero-pi{display:flex;align-items:center;gap:7px;font-size:13px;color:${C.muted};font-weight:500;} .hero-pi svg{color:${C.amber};}
.hero-v{animation:scaleI 1.1s var(--e) 0.3s both;position:relative;}

/* OFFER CARD */
.oc{background:${C.card};border:1px solid ${C.border};border-radius:22px;padding:36px;position:relative;overflow:hidden;}
.oc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${C.amber},transparent);animation:borderDraw 1.5s var(--e) 0.6s both;}
.oc-b{position:absolute;top:18px;right:18px;background:${C.greenBg};color:${C.green};font-size:11px;font-weight:600;padding:5px 12px;border-radius:100px;animation:scaleI 0.5s var(--sp) 1s both;}
.oc-l{font-size:10px;font-weight:700;color:${C.dim};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;}
.oc-v{font-family:'DM Serif Display',serif;font-size:44px;color:${C.cream};margin-bottom:3px;}
.oc-loc{font-size:13px;color:${C.muted};margin-bottom:28px;display:flex;align-items:center;gap:6px;}
.oc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border-radius:12px;overflow:hidden;}
.oc-stat{background:${C.subtle};padding:18px 14px;text-align:center;}
.oc-sn{font-family:'DM Serif Display',serif;font-size:26px;color:${C.cream};}
.oc-sl{font-size:10px;color:${C.dim};margin-top:3px;text-transform:uppercase;letter-spacing:0.06em;}
.oc-tl{margin-top:20px;background:${C.subtle};border-radius:10px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;}
.oc-tl-bar{flex:1;height:3px;background:${C.surface};border-radius:2px;margin:0 14px;overflow:hidden;}
.oc-tl-fill{height:100%;background:linear-gradient(90deg,${C.amber},${C.amberL});border-radius:2px;width:85%;animation:shimmer 2.5s linear infinite;background-size:200% 100%;}
@media(max-width:900px){.hero{padding:140px 24px 70px;min-height:auto;}.hero-i{grid-template-columns:1fr;gap:44px;}.hero-v{max-width:420px;}.hero-p{flex-wrap:wrap;gap:14px;}}

/* MARQUEE */
.mq{overflow:hidden;border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:18px 0;background:${C.subtle};}
.mq-t{display:flex;gap:44px;animation:marquee 35s linear infinite;width:max-content;}
.mq-i{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:${C.muted};white-space:nowrap;} .mq-i svg{color:${C.amber};width:15px;height:15px;}

/* BENTO */
.bento{display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:auto;gap:18px;}
.bc{background:${C.card};border:1px solid ${C.border};border-radius:18px;padding:34px 28px;position:relative;overflow:hidden;transition:all 0.5s var(--e);cursor:default;}
.bc::after{content:'';position:absolute;inset:0;border-radius:18px;background:linear-gradient(135deg,rgba(232,168,76,0.05),transparent 60%);opacity:0;transition:opacity 0.5s;}
.bc:hover{border-color:${C.borderH};transform:translateY(-4px);box-shadow:0 20px 56px rgba(0,0,0,0.3);} .bc:hover::after{opacity:1;}
.bc.w{grid-column:span 2;}
.bico{width:52px;height:52px;border-radius:13px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;background:${C.amberGlow};color:${C.amber};font-size:24px;}
.bt{font-family:'DM Serif Display',serif;font-size:20px;color:${C.cream};margin-bottom:8px;}
.bd{font-size:14px;color:${C.muted};line-height:1.7;}
.bstat{font-family:'DM Serif Display',serif;font-size:50px;color:${C.amber};margin-bottom:6px;}
@media(max-width:768px){.bento{grid-template-columns:1fr;}.bc.w{grid-column:span 1;}}

/* PROCESS */
.ptk{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;position:relative;}
.ptk::before{content:'';position:absolute;top:42px;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,${C.border},${C.border},transparent);}
.ps{text-align:center;position:relative;z-index:1;cursor:pointer;}
.pn{width:84px;height:84px;border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;font-size:28px;transition:all 0.4s var(--e);position:relative;}
.pn .ring{position:absolute;inset:-4px;border-radius:50%;border:1.5px dashed ${C.border};animation:spin 20s linear infinite;}
.pn.a{background:${C.amber};color:${C.bg};} .pn.a .ring{border-color:rgba(232,168,76,0.3);}
.pn.i{background:${C.card};color:${C.dim};border:1px solid ${C.border};}
.ps:hover .pn{transform:scale(1.06);}
.ps:hover .pn.a{box-shadow:0 0 28px rgba(232,168,76,0.25);}
.ps-t{font-family:'DM Serif Display',serif;font-size:17px;color:${C.cream};margin-bottom:8px;transition:color 0.2s;} .ps:hover .ps-t{color:${C.amber};}
.ps-d{font-size:13px;color:${C.muted};line-height:1.65;max-width:200px;margin:0 auto;}
.ps-tm{margin-top:12px;font-size:10px;font-weight:700;color:${C.amber};text-transform:uppercase;letter-spacing:0.08em;padding:5px 12px;background:${C.amberGlow};border-radius:100px;display:inline-block;}
.ps-exp{overflow:hidden;max-height:0;transition:max-height 0.5s var(--e),margin 0.5s;margin-top:0;} .ps-exp.open{max-height:200px;margin-top:14px;}
.ps-exp-in{background:rgba(232,168,76,0.06);border-radius:10px;padding:14px 16px;border:1px solid rgba(232,168,76,0.1);font-size:12px;color:${C.creamD};line-height:1.65;}
@media(max-width:768px){.ptk{grid-template-columns:1fr 1fr;gap:36px;}.ptk::before{display:none;}}
@media(max-width:480px){.ptk{grid-template-columns:1fr;}}

/* COUNTER BAR */
.cbar{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:${C.border};border-radius:14px;overflow:hidden;margin-top:72px;}
.ci{background:${C.card};padding:36px 20px;text-align:center;}
.cn{font-family:'DM Serif Display',serif;font-size:40px;color:${C.amber};}
.cl{font-size:12px;color:${C.muted};margin-top:5px;}
@media(max-width:600px){.cbar{grid-template-columns:1fr 1fr;}}

/* SITUATIONS */
.paths{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.pa{background:${C.card};border:1px solid ${C.border};border-radius:18px;padding:36px 28px;transition:all 0.5s var(--e);cursor:pointer;position:relative;overflow:hidden;}
.pa::before{content:'';position:absolute;bottom:0;left:0;right:0;height:3px;background:${C.amber};transform:scaleX(0);transition:transform 0.5s var(--e);transform-origin:left;}
.pa:hover{border-color:${C.borderH};transform:translateY(-6px);box-shadow:0 18px 52px rgba(0,0,0,0.25);} .pa:hover::before{transform:scaleX(1);}
.pa-e{font-size:38px;margin-bottom:18px;display:block;transition:transform 0.5s var(--sp);} .pa:hover .pa-e{transform:scale(1.12) rotate(-4deg);}
.pa-t{font-family:'DM Serif Display',serif;font-size:20px;color:${C.cream};margin-bottom:8px;}
.pa-d{font-size:13px;color:${C.muted};line-height:1.7;margin-bottom:18px;}
.pa-l{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:${C.amber};transition:gap 0.3s var(--e);} .pa:hover .pa-l{gap:12px;}
@media(max-width:768px){.paths{grid-template-columns:1fr;}}

/* TESTIMONIALS */
.tg{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.tc{background:${C.card};border:1px solid ${C.border};border-radius:18px;padding:32px 24px;transition:all 0.4s var(--e);position:relative;}
.tc:hover{border-color:${C.borderH};box-shadow:0 10px 36px rgba(0,0,0,0.2);}
.tc::before{content:'"';position:absolute;top:14px;right:20px;font-family:'DM Serif Display',serif;font-size:64px;color:${C.surface};line-height:1;}
.tc-s{display:flex;gap:2px;color:${C.amber};margin-bottom:14px;}
.tc-t{font-size:14px;line-height:1.75;color:${C.creamM};margin-bottom:20px;position:relative;z-index:1;}
.tc-a{display:flex;align-items:center;gap:12px;}
.tc-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Serif Display',serif;font-size:14px;color:${C.bg};}
.tc-n{font-size:14px;font-weight:600;color:${C.cream};} .tc-lo{font-size:11px;color:${C.dim};margin-top:2px;}
@media(max-width:768px){.tg{grid-template-columns:1fr;}}

/* FAQ */
.faq-l{max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:7px;}
.fq{background:${C.card};border:1px solid ${C.border};border-radius:12px;overflow:hidden;transition:all 0.4s var(--e);}
.fq.op{border-color:rgba(232,168,76,0.15);box-shadow:0 6px 24px rgba(232,168,76,0.05);}
.fq-q{width:100%;display:flex;align-items:center;justify-content:space-between;padding:20px 22px;background:none;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;color:${C.cream};text-align:left;transition:color 0.2s;gap:14px;} .fq-q:hover{color:${C.amber};}
.fq-q svg{transition:transform 0.4s var(--e);color:${C.dim};flex-shrink:0;} .fq.op .fq-q svg{transform:rotate(180deg);color:${C.amber};}
.fq-aw{max-height:0;overflow:hidden;transition:max-height 0.5s var(--e);} .fq.op .fq-aw{max-height:300px;}
.fq-a{padding:0 22px 22px;font-size:14px;color:${C.muted};line-height:1.75;}

/* FORM */
.fw{max-width:620px;margin:0 auto;background:${C.card};border:1px solid ${C.border};border-radius:22px;padding:44px 36px;position:relative;overflow:hidden;}
.fw::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${C.amber},transparent 80%);}
.fp{display:flex;align-items:center;gap:0;margin-bottom:36px;}
.fps{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:600;color:${C.dim};white-space:nowrap;transition:color 0.3s;} .fps.a{color:${C.cream};} .fps.d{color:${C.amber};}
.fpd{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;transition:all 0.3s var(--sp);flex-shrink:0;}
.fpd.off{background:${C.surface};color:${C.dim};} .fpd.on{background:${C.amber};color:${C.bg};transform:scale(1.08);} .fpd.ok{background:#4A8B5C;color:${C.white};}
.fpl{flex:1;height:2px;background:${C.surface};margin:0 7px;border-radius:1px;overflow:hidden;} .fplf{height:100%;background:${C.amber};transition:width 0.5s var(--e);border-radius:1px;}
.fstep{animation:fade 0.4s var(--e) both;}
.ftit{font-family:'DM Serif Display',serif;font-size:22px;color:${C.cream};margin-bottom:6px;}
.fsub{font-size:14px;color:${C.muted};margin-bottom:24px;}
.fg{margin-bottom:18px;}
.fl{display:block;font-size:12px;font-weight:600;color:${C.creamM};margin-bottom:7px;text-transform:uppercase;letter-spacing:0.04em;}
.fi{width:100%;padding:13px 15px;border:1.5px solid ${C.border};border-radius:9px;font-family:'Outfit',sans-serif;font-size:14px;color:${C.cream};background:${C.subtle};transition:all 0.25s;outline:none;} .fi:focus{border-color:${C.amber};background:${C.card};box-shadow:0 0 0 3px ${C.amberGlow};} .fi.err{border-color:${C.err};box-shadow:0 0 0 3px rgba(232,104,90,0.1);} .fi::placeholder{color:${C.dim};}
select.fi{appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B665E' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;} select.fi option{background:${C.card};color:${C.cream};}
	.ferr{font-size:11px;color:${C.err};margin-top:5px;}
		.falert{font-size:13px;color:${C.err};line-height:1.55;background:rgba(232,104,90,0.08);border:1px solid rgba(232,104,90,0.22);border-radius:9px;padding:11px 13px;margin-top:16px;}
		.disc{font-size:11px;color:${C.dim};line-height:1.65;margin-top:22px;padding-top:18px;border-top:1px solid ${C.border};}
		.fitp{background:${C.subtle};border:1px solid rgba(232,168,76,0.16);border-radius:14px;padding:18px 18px;margin:4px 0 20px;}
		.fitp-l{font-size:10px;font-weight:700;color:${C.amber};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:7px;}
		.fitp-r{font-family:'DM Serif Display',serif;font-size:22px;color:${C.cream};margin-bottom:8px;}
		.fitp-m{font-size:13px;color:${C.muted};line-height:1.65;margin-bottom:10px;}
		.fitp-d{font-size:11px;color:${C.dim};line-height:1.6;border-top:1px solid ${C.border};padding-top:10px;}
		.fo{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.fop{padding:14px;border:1.5px solid ${C.border};border-radius:10px;cursor:pointer;transition:all 0.3s var(--e);background:${C.subtle};text-align:center;}
.fop:hover{border-color:${C.borderH};background:${C.surface};} .fop.sel{border-color:${C.amber};background:${C.amberGlow};}
.fop-l{font-size:14px;font-weight:600;color:${C.cream};} .fop-d{font-size:11px;color:${C.dim};margin-top:2px;}
.fnav{display:flex;justify-content:space-between;align-items:center;margin-top:28px;gap:14px;}
.fbk{background:none;border:none;color:${C.muted};font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;cursor:pointer;padding:10px 14px;transition:color 0.2s;} .fbk:hover{color:${C.cream};}
.freass{font-size:12px;color:${C.dim};text-align:center;margin-bottom:24px;font-style:italic;}
@media(max-width:480px){.fw{padding:28px 18px;}.fo{grid-template-columns:1fr;}.fps span:not(.fpd){display:none;}}

/* INSIGHTS */
.ins-f{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin-bottom:44px;}
.insf{font-size:12px;font-weight:600;color:${C.muted};padding:7px 16px;border-radius:100px;border:1px solid ${C.border};cursor:pointer;transition:all 0.25s var(--e);background:transparent;font-family:'Outfit',sans-serif;} .insf:hover{border-color:${C.borderH};color:${C.cream};} .insf.act{background:${C.amber};color:${C.bg};border-color:${C.amber};}
.ig{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;}
.ic{background:${C.card};border:1px solid ${C.border};border-radius:18px;overflow:hidden;transition:all 0.5s var(--e);cursor:pointer;position:relative;}
.ic:hover{border-color:${C.borderH};transform:translateY(-5px);box-shadow:0 18px 52px rgba(0,0,0,0.3);}
.ic-img{height:180px;position:relative;overflow:hidden;} .ic-img-in{width:100%;height:100%;transition:transform 0.6s var(--e);} .ic:hover .ic-img-in{transform:scale(1.04);}
.ic-tag{position:absolute;top:14px;left:14px;font-size:10px;font-weight:700;color:${C.bg};background:${C.amber};padding:4px 10px;border-radius:5px;text-transform:uppercase;letter-spacing:0.06em;z-index:1;}
.ic-b{padding:24px 20px;}
.ic-m{display:flex;align-items:center;gap:10px;font-size:11px;color:${C.dim};margin-bottom:10px;}
.ic-t{font-family:'DM Serif Display',serif;font-size:18px;color:${C.cream};line-height:1.3;margin-bottom:8px;transition:color 0.2s;} .ic:hover .ic-t{color:${C.amber};}
.ic-ex{font-size:13px;color:${C.muted};line-height:1.65;margin-bottom:14px;}
.ic-r{font-size:12px;font-weight:600;color:${C.amber};display:inline-flex;align-items:center;gap:5px;transition:gap 0.3s var(--e);} .ic:hover .ic-r{gap:10px;}
.ic.feat{grid-column:span 2;display:grid;grid-template-columns:1.2fr 1fr;} .ic.feat .ic-img{height:100%;} .ic.feat .ic-b{display:flex;flex-direction:column;justify-content:center;padding:36px 32px;} .ic.feat .ic-t{font-size:24px;}
@media(max-width:900px){.ig{grid-template-columns:1fr;}.ic.feat{grid-column:span 1;grid-template-columns:1fr;}.ic.feat .ic-img{height:200px;}}

/* LOCATION PAGE */
.loc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:${C.border};border-radius:14px;overflow:hidden;margin-top:56px;max-width:540px;}
.loc-stat{background:${C.card};padding:24px 20px;text-align:center;}
.loc-sn{font-family:'DM Serif Display',serif;font-size:30px;} .loc-sl{font-size:11px;color:${C.dim};margin-top:3px;text-transform:uppercase;letter-spacing:0.06em;}

/* FOOTER */
.foot{background:${C.subtle};border-top:1px solid ${C.border};padding:64px 24px 32px;}
.foot-i{max-width:1280px;margin:0 auto;}
.foot-g{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:44px;margin-bottom:44px;}
.foot-b{font-family:'DM Serif Display',serif;font-size:22px;color:${C.cream};margin-bottom:12px;} .foot-b span{color:${C.amber};}
.foot-d{font-size:13px;color:${C.dim};line-height:1.7;max-width:260px;}
.foot-h{font-size:11px;font-weight:700;color:${C.dim};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;}
.foot-ul{list-style:none;display:flex;flex-direction:column;gap:9px;} .foot-ul a{font-size:13px;color:${C.muted};transition:color 0.2s;} .foot-ul a:hover{color:${C.cream};}
	.foot-dis{font-size:11px;color:${C.dim};line-height:1.7;max-width:920px;margin:-16px 0 28px;padding-top:22px;border-top:1px solid ${C.border};}
	.foot-bot{padding-top:22px;border-top:1px solid ${C.border};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;}
.foot-c{font-size:12px;color:${C.dim};}
.foot-bgs{display:flex;gap:10px;} .foot-bg{font-size:10px;font-weight:600;color:${C.dim};padding:5px 10px;border:1px solid ${C.border};border-radius:5px;}
@media(max-width:768px){.foot-g{grid-template-columns:1fr 1fr;gap:28px;}}
@media(max-width:480px){.foot-g{grid-template-columns:1fr;}}

/* PAGE FADE */
.pgf{animation:fade 0.45s var(--e) both;}

/* INTENT BADGE */
.ibadge{display:inline-flex;align-items:center;gap:7px;padding:7px 16px;border-radius:100px;background:${C.amberGlow};border:1px solid rgba(232,168,76,0.15);color:${C.amber};font-size:12px;font-weight:600;letter-spacing:0.03em;animation:scaleI 0.4s var(--sp) both;}
`;

// ═══════════════════════════════════════════════════════════════════
// STATUS LINE (submission state visual)
// ═══════════════════════════════════════════════════════════════════
function StatusLine({icon,text,done,active}){
  return(<div style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:done?C.green:active?C.amber:C.dim,transition:"all 0.3s"}}>
    <span style={{width:18,textAlign:"center",fontSize:active?14:13}}>{done?"✓":icon}</span>
    <span style={{fontWeight:active?600:400}}>{text}</span>
    {active&&<span style={{width:6,height:6,borderRadius:"50%",background:C.amber,animation:"pulse 1s infinite"}}/>}
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
// MULTI-STEP LEAD FORM
// ═══════════════════════════════════════════════════════════════════
const STEPS=[{id:"property",label:"Property"},{id:"details",label:"Details"},{id:"contact",label:"Contact"}];
const REASS={0:"This takes less than 2 minutes. No commitment required.",1:"Describe the property as it is today so the review is realistic.",2:"Your information is private and never shared."};
const FIT_COPY={
  strong:{result:"Strong Potential Fit",message:"Based on what you shared, this property may be a strong fit for investor review. I'll review the details directly and follow up with the next practical step."},
  possible:{result:"Possible Fit",message:"Based on what you shared, this property may be a possible fit for investor review. I'll review the details and determine whether a direct investor conversation makes sense."},
  manual:{result:"Needs Manual Review",message:"Based on what you shared, this property needs a closer review before determining whether it fits my current rental, renovation, or investor purchase criteria."},
};
function calcInvestorFit(fd){
  const txt=[fd.condition,fd.occupancy,fd.propertyType,fd.timeline,fd.mainGoal,fd.ownership,fd.knownIssues,fd.repairsNeeded,fd.damageType,fd.repairEstimate,fd.urgencyReason,fd.moveOutDate].join(" ").toLowerCase();
  let score=0;
  if(/(fair|poor|needs repairs|major repairs|damaged|not financeable|renovation)/.test(txt))score+=2;
  if(/(vacant|tenant)/.test(fd.occupancy.toLowerCase()))score+=2;
  if(/(single-family|duplex|multifamily|townhome)/.test(fd.propertyType.toLowerCase()))score+=1;
  if(/(immediately|within 2 weeks|within 30 days|14days|30days)/.test(txt))score+=2;
  if(/(fast sale|no repairs|no showings|tenant issue|avoid public listing|cash|direct sale|direct-review)/.test(txt))score+=2;
  if(/(inherited|trust|estate|landlord)/.test(fd.ownership.toLowerCase()))score+=1;
  if(/(roof|foundation|plumbing|electrical|hvac|water damage|fire damage|code violations|tenant issue|cleanout needed)/.test(txt))score+=1;
  const key=score>=7?"strong":score>=4?"possible":"manual";
  return {score,result:FIT_COPY[key].result,message:FIT_COPY[key].message};
}

function LeadForm(){
  const{content,condFields,intent}=useIntent();
  const[step,setStep]=useState(0);const[errs,setErrs]=useState({});
  const[submitting,setSubmitting]=useState(false);
  const[submitError,setSubmitError]=useState("");
  const[fd,setFd]=useState({address:"",city:"",state:"MI",zip:"",propertyType:"",condition:"",knownIssues:"",repairsNeeded:"",timeline:"",mainGoal:"",ownership:"",occupancy:"",firstName:"",lastName:"",email:"",phone:"",website:""});
  const formStarted=useRef(false);
  const fitTracked=useRef("");
  const fit=useMemo(()=>calcInvestorFit(fd),[fd]);
  const showFit=Boolean(fd.address.trim()&&fd.city.trim()&&fd.zip.trim()&&fd.condition&&fd.timeline);
  useEffect(()=>{
    if(!showFit)return;
    const scoreRange=investorFitScoreRange(fit.score);
    const fitKey=`${fit.result}-${scoreRange}`;
    if(fitTracked.current===fitKey)return;
    fitTracked.current=fitKey;
    trackEvent("investor_fit_calculated", {
      investor_fit: fit.result,
      investor_fit_score_range: scoreRange,
      lead_type: intent,
    });
  },[showFit,fit.result,fit.score,intent]);
  const up=(k,v)=>{
    if(k!=="website"&&!formStarted.current){
      formStarted.current=true;
      trackEvent("investor_form_started", {lead_type:intent});
    }
    setFd(p=>({...p,[k]:v}));setErrs(p=>({...p,[k]:undefined,contact:undefined}));setSubmitError("");
  };
  const val=()=>{const e={};
    if(step===0){if(!fd.address.trim())e.address="Required";if(!fd.city.trim())e.city="Required";if(!fd.zip.trim())e.zip="Required";}
    else if(step===1){if(!fd.condition)e.condition="Select condition";if(!fd.timeline)e.timeline="Select timeline";}
    else{if(!fd.firstName.trim())e.firstName="Required";if(fd.email.trim()&&!/\S+@\S+\.\S+/.test(fd.email))e.email="Invalid email";if(!fd.email.trim()&&!fd.phone.trim())e.contact="Add a phone number or email.";}
    setErrs(e);return!Object.keys(e).length;};
  const submit=async()=>{if(!val())return;
    setSubmitting(true);setSubmitError("");
    const scoreRange=investorFitScoreRange(fit.score);
    trackEvent("investor_form_submitted", {
      investor_fit: fit.result,
      investor_fit_score_range: scoreRange,
      form_step: STEPS[step].id,
      lead_type: intent,
    });
    try{
      const res=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...fd,mainGoal:fd.mainGoal||fd.timeline,investorFit:fit.result,investorFitScore:fit.score,intent,source:"website",sourcePage:window.location?.pathname||"/",submittedAt:new Date().toISOString()})});
      let body={};
      try{body=await res.json();}catch{}
      if(!res.ok||!body?.success)throw new Error(body?.error||"Submission failed");
      trackEvent("investor_lead_success", {
        investor_fit: fit.result,
        investor_fit_score_range: scoreRange,
        lead_type: intent,
      });
      window.location.assign("/thank-you");
    }catch{
      trackEvent("investor_lead_error", {
        error_type: "submission_failed",
        lead_type: intent,
      });
      setSubmitError("We could not submit your property review request. Please check your details and try again, or contact Dimitrios directly.");
    }finally{
      setSubmitting(false);
    }
  };
  const next=()=>{if(step<2){if(val()){trackEvent("investor_form_step_completed",{form_step:STEPS[step].id,lead_type:intent});setStep(step+1);}}else submit();};

  if(submitting)return(<div style={{textAlign:"center",padding:"48px 0"}}>
    <div style={{width:64,height:64,margin:"0 auto 20px",position:"relative"}}>
      <div style={{position:"absolute",inset:0,border:`3px solid ${C.surface}`,borderRadius:"50%"}}/>
      <div style={{position:"absolute",inset:0,border:`3px solid transparent`,borderTop:`3px solid ${C.amber}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
	    </div>
	    <p style={{fontSize:15,color:C.cream,fontWeight:600,marginBottom:6}}>Preparing your review...</p>
	    <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"center",marginTop:16}}>
	      <StatusLine icon="✓" text="Property details captured" done/>
	      <StatusLine icon="⟳" text="Submitting secure review request..." active/>
	    </div>
	  </div>);

  return(<div>
    <div className="fp">{STEPS.map((s,i)=><Fragment key={s.id}>
      <div className={`fps ${i===step?"a":i<step?"d":""}`}><div className={`fpd ${i===step?"on":i<step?"ok":"off"}`}>{i<step?"✓":i+1}</div><span>{s.label}</span></div>
      {i<STEPS.length-1&&<div className="fpl"><div className="fplf" style={{width:i<step?"100%":"0%"}}/></div>}
    </Fragment>)}</div>
    <div className="freass">{REASS[step]}</div>
    <div className="fstep" key={step}>
      {step===0&&<div>
        <div className="ftit">{content.formTitle}</div><div className="fsub">{content.formSub}</div>
	        <div className="fg"><label className="fl">Street Address</label><input className={`fi ${errs.address?"err":""}`} value={fd.address} onChange={e=>up("address",e.target.value)} placeholder="123 Main Street"/>{errs.address&&<div className="ferr">{errs.address}</div>}</div>
	        <input tabIndex={-1} autoComplete="off" value={fd.website} onChange={e=>up("website",e.target.value)} style={{position:"absolute",left:"-9999px",height:0,width:0,opacity:0}} aria-hidden="true"/>
	        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:10}}>
          <div className="fg"><label className="fl">City</label><input className={`fi ${errs.city?"err":""}`} value={fd.city} onChange={e=>up("city",e.target.value)} placeholder="Rochester Hills"/>{errs.city&&<div className="ferr">{errs.city}</div>}</div>
          <div className="fg"><label className="fl">State</label><select className="fi" value={fd.state} onChange={e=>up("state",e.target.value)}><option>MI</option><option>OH</option><option>IN</option><option>IL</option></select></div>
          <div className="fg"><label className="fl">ZIP</label><input className={`fi ${errs.zip?"err":""}`} value={fd.zip} onChange={e=>up("zip",e.target.value)} placeholder="48309" maxLength={5}/>{errs.zip&&<div className="ferr">{errs.zip}</div>}</div>
        </div>
      </div>}
	      {step===1&&<div>
	        <div className="ftit">Property Details</div><div className="fsub">Help us understand your situation.</div>
	        <div className="fg"><label className="fl">Property Type</label><select className="fi" value={fd.propertyType} onChange={e=>up("propertyType",e.target.value)}><option value="">Select...</option><option>Single-family</option><option>Duplex</option><option>Multifamily</option><option>Townhome</option><option>Condo</option><option>Vacant Land</option><option>Other</option></select></div>
	        <div className="fg"><label className="fl">Condition</label><div className="fo">{[{v:"excellent",l:"Move-In Ready",d:"Needs nothing"},{v:"good",l:"Minor Repairs",d:"Cosmetic"},{v:"fair",l:"Needs Work",d:"Moderate"},{v:"poor",l:"Major Repairs",d:"Significant"}].map(o=><div key={o.v} className={`fop ${fd.condition===o.v?"sel":""}`} onClick={()=>up("condition",o.v)}><div className="fop-l">{o.l}</div><div className="fop-d">{o.d}</div></div>)}</div>{errs.condition&&<div className="ferr">{errs.condition}</div>}</div>
		        <div className="fg"><label className="fl">Main Goal or Timeline</label><div className="fo">{[{v:"direct-review",l:"Direct Review",d:"Explore a sale"},{v:"renovation-fit",l:"Renovation Fit",d:"Needs work"},{v:"rental-hold",l:"Rental Potential",d:"May be a hold"},{v:"exploring",l:"Exploring",d:"Just looking"}].map(o=><div key={o.v} className={`fop ${fd.timeline===o.v?"sel":""}`} onClick={()=>{up("timeline",o.v);up("mainGoal",o.l);}}><div className="fop-l">{o.l}</div><div className="fop-d">{o.d}</div></div>)}</div>{errs.timeline&&<div className="ferr">{errs.timeline}</div>}</div>
	        <div className="fg"><label className="fl">Known Issues</label><select className="fi" value={fd.knownIssues} onChange={e=>up("knownIssues",e.target.value)}><option value="">Select if applicable...</option><option>Roof</option><option>Foundation</option><option>Plumbing</option><option>Electrical</option><option>HVAC</option><option>Water damage</option><option>Fire damage</option><option>Code violations</option><option>Tenant issue</option><option>Cleanout needed</option><option>Other</option><option>Not sure</option></select></div>
	        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div className="fg"><label className="fl">Ownership</label><select className="fi" value={fd.ownership} onChange={e=>up("ownership",e.target.value)}><option value="">Select...</option><option>Sole Owner</option><option>Joint</option><option>Inherited</option><option>Trust/Estate</option></select></div>
          <div className="fg"><label className="fl">Occupancy</label><select className="fi" value={fd.occupancy} onChange={e=>up("occupancy",e.target.value)}><option value="">Select...</option><option>Owner-Occupied</option><option>Tenant</option><option>Vacant</option></select></div>
        </div>
        {condFields.length>0&&<div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
          <p style={{fontSize:11,color:C.amber,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>✦ Questions for your situation</p>
          {condFields.map(f=><div className="fg" key={f.name}><label className="fl">{f.label}</label><select className="fi" value={fd[f.name]||""} onChange={e=>up(f.name,e.target.value)}><option value="">Select...</option>{f.opts.map(o=><option key={o}>{o}</option>)}</select></div>)}
        </div>}
	      </div>}
	      {step===2&&<div>
		        <div className="ftit">Submit for Local Review</div><div className="fsub">This does not create an agency relationship or obligation to sell.</div>
	        {showFit&&<div className="fitp"><div className="fitp-l">Preliminary fit screen</div><div className="fitp-r">{fit.result}</div><div className="fitp-m">{fit.message}</div><div className="fitp-d">This is not an appraisal, offer, or guarantee. It is only a preliminary fit screen based on the information submitted.</div></div>}
	        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div className="fg"><label className="fl">First Name</label><input className={`fi ${errs.firstName?"err":""}`} value={fd.firstName} onChange={e=>up("firstName",e.target.value)} placeholder="John"/>{errs.firstName&&<div className="ferr">{errs.firstName}</div>}</div><div className="fg"><label className="fl">Last Name</label><input className="fi" value={fd.lastName} onChange={e=>up("lastName",e.target.value)} placeholder="Doe"/></div></div>
	        <div className="fg"><label className="fl">Email</label><input className={`fi ${errs.email?"err":""}`} type="email" value={fd.email} onChange={e=>up("email",e.target.value)} placeholder="john@email.com"/>{errs.email&&<div className="ferr">{errs.email}</div>}</div>
	        <div className="fg"><label className="fl">Phone</label><input className={`fi ${errs.phone?"err":""}`} type="tel" value={fd.phone} onChange={e=>up("phone",e.target.value)} placeholder="(248) 555-0100"/>{errs.phone&&<div className="ferr">{errs.phone}</div>}</div>
	        {errs.contact&&<div className="ferr" style={{marginTop:-10,marginBottom:14}}>{errs.contact}</div>}
	      </div>}
	    </div>
	    {submitError&&<div className="falert">{submitError}</div>}
	    <div className="fnav">{step>0?<button className="fbk" onClick={()=>setStep(step-1)}>← Back</button>:<div/>}<button className="btn-s" onClick={next} disabled={submitting} style={submitting?{opacity:0.65,cursor:"not-allowed"}:{}}>{step<2?"Continue":"See If My Property Is a Fit"} <Ico.Arrow/></button></div>
	    <p className="disc">{DISCLOSURE}</p>
	  </div>);
}

// ═══════════════════════════════════════════════════════════════════
// INTERACTIVE TIMELINE
// ═══════════════════════════════════════════════════════════════════
const PROC=[
  {n:1,t:"Share the Property",d:"Send the address, condition, occupancy, and your preferred timing.",tm:"Quick Intake",ico:"📋",cond:{inherited:"Share the property address, estate status, and who is involved in decisions.",distressed:"Describe the repair scope directly so the review starts with the real condition.",fastClose:"Tell me the timeline and what is driving it so the review has context."}},
  {n:2,t:"Local Investor Review",d:"The property is reviewed for rental, renovation, resale, assignment, or direct purchase fit.",tm:"Case by Case",ico:"🔎",cond:{inherited:"Estate timing, title, occupancy, and repairs are considered together.",distressed:"Repair scope, resale potential, and renovation risk shape the review.",fastClose:"Timing is considered alongside title, occupancy, repairs, and market fit."}},
  {n:3,t:"Discuss the Path",d:"If there is a fit, you can discuss a possible direct offer or another practical next step.",tm:"No Obligation",ico:"🤝",cond:{inherited:"A direct sale may be discussed if it fits the estate and ownership situation.",distressed:"A renovation purchase may be discussed if the numbers and condition make sense.",fastClose:"A direct-sale path may be discussed if timing and property fit line up."}},
  {n:4,t:"Choose What Fits",d:"You decide whether to continue, pause, request more information, or discuss a traditional listing separately.",tm:"Your Decision",ico:"🏦",cond:{inherited:"The goal is a clean decision path for the estate, not pressure.",distressed:"The goal is a realistic option based on the property as it sits.",fastClose:"The goal is clarity quickly, without creating an obligation to sell."}},
];

function Timeline(){
  const{intent,content,INTENTS:I}=useIntent();
  const[active,setActive]=useState(null);
  return(<div>
    <div className="ptk sr">{PROC.map((s,i)=>{
      const desc=intent!==I.DEFAULT&&s.cond[intent]?s.cond[intent]:s.d;
      return(<div className="ps" key={s.n} onClick={()=>setActive(active===i?null:i)}>
        <div className={`pn ${active===i||i===0?"a":"i"}`} style={active===i?{boxShadow:"0 0 28px rgba(232,168,76,0.25)"}:{}}><span>{s.ico}</span><div className="ring"/></div>
        <div className="ps-t">{s.t}</div><div className="ps-d">{desc}</div>
        <span className="ps-tm">{s.tm}</span>
        <div className={`ps-exp ${active===i?"open":""}`}><div className="ps-exp-in">{intent!==I.DEFAULT&&s.cond[intent]?<><strong style={{color:C.amber,display:"block",marginBottom:3}}>Personalized for your situation:</strong>{s.cond[intent]}</>:desc}</div></div>
      </div>);
    })}</div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
// INSIGHTS PAGE
// ═══════════════════════════════════════════════════════════════════
function InsightsPage({goHome,goOffer}){
  const[cat,setCat]=useState("All");
  const[viewing,setViewing]=useState(null);
  useReveal();
  const filtered=cat==="All"?POSTS:POSTS.filter(p=>p.cat===cat);

  // Detail view for a single insight
  if(viewing){const p=viewing;return(<div className="pgf">
    <section style={{padding:"150px 24px 40px",maxWidth:740,margin:"0 auto"}}>
      <button onClick={()=>setViewing(null)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:14,display:"flex",alignItems:"center",gap:6,marginBottom:28}}><Ico.Back/> Back to Insights</button>
	      {/* Content indicator */}
	      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
	        <span style={{fontSize:10,fontWeight:700,color:C.bg,background:C.amber,padding:"3px 8px",borderRadius:4}}>Investor Review</span>
	        <span style={{fontSize:10,fontWeight:700,color:C.green,background:C.greenBg,padding:"3px 8px",borderRadius:4}}>Local Context</span>
	        <span style={{fontSize:10,fontWeight:700,color:C.muted,background:C.surface,padding:"3px 8px",borderRadius:4}}>Homeowner Guide</span>
      </div>
      <div style={{fontSize:11,color:C.dim,marginBottom:8}}>{p.cat} · {p.date} · {p.read} read</div>
      <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(28px,4vw,42px)",color:C.cream,lineHeight:1.15,marginBottom:16}}>{p.title}</h1>
      <p style={{fontSize:17,color:C.muted,lineHeight:1.75,marginBottom:32}}>{p.ex}</p>
      <div style={{height:240,borderRadius:16,background:p.grad,marginBottom:32}}/>
      {/* Simulated article body */}
      <div style={{fontSize:15,color:C.creamM,lineHeight:1.85}}>
	        <p style={{marginBottom:20}}>This guide is meant to help homeowners understand when a property may be worth submitting for local investor review.</p>
	        <p style={{marginBottom:20}}>Repairs, occupancy, rental potential, resale value, title status, seller timing, and neighborhood context all affect whether a direct purchase conversation makes sense.</p>
	        <p>If a traditional listing appears to be a stronger path, that can be discussed separately instead of forcing an investor purchase.</p>
      </div>
      {/* SEO Keywords */}
      <div style={{marginTop:32,paddingTop:24,borderTop:`1px solid ${C.border}`}}>
        <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Target Keywords</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{p.kw.map(k=><span key={k} style={{fontSize:12,color:C.amber,padding:"4px 10px",background:C.amberGlow,borderRadius:6,border:`1px solid rgba(232,168,76,0.15)`}}>{k}</span>)}</div>
      </div>
      {/* CTA */}
      <div style={{marginTop:48,padding:"36px 28px",background:C.card,borderRadius:16,border:`1px solid ${C.border}`,textAlign:"center"}}>
	        <div className="st" style={{fontSize:22,marginBottom:8}}>Have a Property to <em>Review</em>?</div>
	        <p style={{fontSize:14,color:C.muted,marginBottom:20}}>Submit the basics for a local investor review.</p>
	        <button className="btn-s" onClick={()=>{setViewing(null);goOffer();}}>Submit My Property <Ico.Arrow/></button>
      </div>
    </section>
  </div>);}

  return(<div className="pgf">
    <section style={{padding:"150px 24px 50px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:700,height:350,background:`radial-gradient(ellipse,${C.amberGlow},transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1}}>
        <button onClick={goHome} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:14,display:"inline-flex",alignItems:"center",gap:6,marginBottom:28}}><Ico.Back/> Back to Home</button>
        <div className="sl" style={{justifyContent:"center"}}><Ico.Book/> Insights & Guides</div>
        <h1 className="st" style={{textAlign:"center",marginBottom:14}}>Knowledge That <em>Empowers</em></h1>
	        <p className="ss" style={{textAlign:"center",margin:"0 auto 20px",maxWidth:500}}>Guidance on investor review, inherited properties, repairs, tenants, direct sale tradeoffs, and Oakland County market context.</p>
	        {/* Content indicators */}
	        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:28,flexWrap:"wrap"}}>
	          <span style={{fontSize:10,fontWeight:700,color:C.bg,background:C.amber,padding:"3px 8px",borderRadius:4}}>Investor Review</span>
	          <span style={{fontSize:10,fontWeight:700,color:C.green,background:C.greenBg,padding:"3px 8px",borderRadius:4}}>Off-Market Deals</span>
	          <span style={{fontSize:10,fontWeight:700,color:C.muted,background:C.surface,padding:"3px 8px",borderRadius:4}}>{filtered.length} Guides</span>
        </div>
        <div className="ins-f">{CATS.map(c=><button key={c} className={`insf ${cat===c?"act":""}`} onClick={()=>setCat(c)}>{c}</button>)}</div>
      </div>
    </section>
    <section className="sec" style={{paddingTop:0}}>
      <div className="sec-i">
        <div className="ig">{filtered.map((p,i)=><div key={p.id} className={`ic sr ${p.feat&&cat==="All"?"feat":""}`} data-delay={`${i*0.08}s`} onClick={()=>setViewing(p)}>
          <div className="ic-img"><div className="ic-img-in" style={{background:p.grad}}/><span className="ic-tag">{p.cat}</span></div>
          <div className="ic-b"><div className="ic-m"><span>{p.date}</span><span>·</span><span>{p.read} read</span></div><div className="ic-t">{p.title}</div><p className="ic-ex">{p.ex}</p><span className="ic-r">Read article <Ico.Arrow s={14}/></span></div>
        </div>)}</div>
        <div style={{marginTop:72,padding:"44px 36px",background:C.card,borderRadius:18,border:`1px solid ${C.border}`,textAlign:"center"}} className="sr">
	          <div className="st" style={{fontSize:26,marginBottom:10}}>Have a Property Worth <em>Reviewing</em>?</div>
	          <p className="ss" style={{margin:"0 auto 24px",maxWidth:460}}>Inherited, vacant, tenant-occupied, repair-heavy, or off-market properties may be worth a direct investor conversation.</p>
	          <button className="btn" onClick={goOffer}>Submit My Property <Ico.Arrow/></button>
        </div>
      </div>
    </section>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App(){
  const[sc,setSc]=useState(false);const[mob,setMob]=useState(false);
  const[page,setPage]=useState("home");
  const[faqO,setFaqO]=useState(null);const[procA,setProcA]=useState(null);

  useReveal();
  useEffect(()=>{const fn=()=>setSc(window.scrollY>30);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);

  const go=id=>{setMob(false);setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"}),60);};
  const goPage=p=>{setMob(false);setPage(p);window.scrollTo({top:0,behavior:"smooth"});};

  return(<IntentProvider><AppInner sc={sc} mob={mob} setMob={setMob} page={page} faqO={faqO} setFaqO={setFaqO} go={go} goPage={goPage}/></IntentProvider>);
}

function AppInner({sc,mob,setMob,page,faqO,setFaqO,go,goPage}){
  const{intent,setIntent,content,INTENTS:I}=useIntent();
  const[ddOpen,setDdOpen]=useState(false);
  useReveal();
  const homepageCta=(ctaLabel,target,leadType=intent)=>{
    trackEvent("homepage_cta_clicked", {cta_label:ctaLabel,lead_type:leadType});
    go(target);
  };

  return(<div>
    <style>{css}</style>
    <div className="noise"/>

    {/* NAV */}
    <nav className={`nav ${sc?"sc":""}`}><div className="nav-i">
      <div className="logo" onClick={()=>goPage("home")}>Oakland<span>Cash</span></div>
      <ul className="nav-l">
        <li className={`nl ${page==="home"?"act":""}`} onClick={()=>{goPage("home");setTimeout(()=>go("hero"),100);}}>Home</li>
        <li className="nl" onClick={()=>{if(page!=="home")goPage("home");setTimeout(()=>go("how"),200);}}>Process</li>
	        <li className="nl" onClick={()=>{if(page!=="home")goPage("home");setTimeout(()=>go("sit"),200);}}>Property Types</li>
        <li className={`nl ${page==="insights"?"act":""}`} onClick={()=>goPage("insights")}>Insights</li>
        <li className="nl" style={{position:"relative"}} onClick={e=>{e.stopPropagation();setDdOpen(!ddOpen);}}>
          Areas ▾
          {ddOpen&&<div style={{position:"absolute",top:"100%",left:0,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:8,minWidth:220,zIndex:10,boxShadow:"0 12px 40px rgba(0,0,0,0.5)",animation:"fade 0.2s var(--e) both"}}>
            {LOCATIONS.map(l=><a key={l.slug} href={`/sell/${l.slug}`} onClick={e=>{e.stopPropagation();setDdOpen(false);}} style={{padding:"9px 14px",borderRadius:8,fontSize:13,color:C.creamM,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"space-between"}} onMouseEnter={e=>{e.currentTarget.style.background=C.surface;e.currentTarget.style.color=C.cream;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.creamM;}}><span>{l.city}</span><span style={{fontSize:11,color:C.dim}}>{l.county.replace(" County","")}</span></a>)}
          </div>}
        </li>
        <li className="nl" onClick={()=>{if(page!=="home")goPage("home");setTimeout(()=>go("faq"),200);}}>FAQ</li>
	        <button className="ncta" onClick={()=>{trackEvent("homepage_cta_clicked",{cta_label:"Submit Property",lead_type:intent});if(page!=="home")goPage("home");setTimeout(()=>go("offer"),200);}}>Submit Property</button>
      </ul>
      <button className="nmob" onClick={()=>setMob(!mob)}>{mob?<Ico.X/>:<Ico.Menu/>}</button>
    </div></nav>
    <div className={`mm ${mob?"op":""}`}>
      <div onClick={()=>{goPage("home");setTimeout(()=>go("hero"),100);}}>Home</div>
      <div onClick={()=>{goPage("home");setTimeout(()=>go("how"),200);}}>Process</div>
	      <div onClick={()=>{goPage("home");setTimeout(()=>go("sit"),200);}}>Property Types</div>
      <div onClick={()=>goPage("insights")}>Insights</div>
      <div onClick={()=>{if(page!=="home")goPage("home");setTimeout(()=>go("faq"),200);}}>FAQ</div>
	      <div onClick={()=>{trackEvent("homepage_cta_clicked",{cta_label:"Mobile Submit Property",lead_type:intent});if(page!=="home")goPage("home");setTimeout(()=>go("offer"),200);}} style={{color:C.amber,fontWeight:600}}>Submit Property →</div>
    </div>

    {/* DROPDOWN CLOSER */}
    {ddOpen&&<div onClick={()=>setDdOpen(false)} style={{position:"fixed",inset:0,zIndex:99}}/>}

    {page==="insights"?<InsightsPage goHome={()=>goPage("home")} goOffer={()=>{goPage("home");setTimeout(()=>go("offer"),200);}}/>
    :(<div className="pgf">

    {/* HERO */}
    <section className="hero" id="hero">
      <div className="orb o1"/><div className="orb o2"/><div className="orb o3"/>
      <div className="hero-i">
        <div className="hero-c">
	          <div className="hbadge"><span className="hdot"/>Local Michigan Realtor & Real Estate Investor</div>
          {content.badge&&<div className="ibadge" style={{marginBottom:16}}>✦ {content.badge}</div>}
          <h1 style={{whiteSpace:"pre-line"}}>{content.hero.includes("Cash")? <>{content.hero.split("Cash")[0]}<em>Cash</em>{content.hero.split("Cash")[1]}</>: content.hero.includes("?")? <>{content.hero}</>: <>{content.hero}</>}</h1>
          <p className="hero-s">{content.sub}</p>
	          <div className="hero-a"><button className="btn" onClick={()=>homepageCta(content.cta,"offer")}>{content.cta} <Ico.Arrow/></button><button className="btn btn-g" onClick={()=>homepageCta("See What We Look For","features")}>See What We Look For</button></div>
	          <div className="hero-p"><div className="hero-pi"><Ico.Check/> Local Review</div><div className="hero-pi"><Ico.Check/> Repairs & Tenants OK</div><div className="hero-pi"><Ico.Check/> No Obligation</div></div>
	        </div>
	        <div className="hero-v"><div className="oc"><div className="oc-b">✓ Review Ready</div><div className="oc-l">Investor Review Snapshot</div><div className="oc-v">Local Fit</div><div className="oc-loc"><span style={{color:C.amber}}>●</span> Oakland County, MI</div><div className="oc-stats"><div className="oc-stat"><div className="oc-sn">Rent</div><div className="oc-sl">Hold</div></div><div className="oc-stat"><div className="oc-sn">Fix</div><div className="oc-sl">Renovate</div></div><div className="oc-stat"><div className="oc-sn">Deal</div><div className="oc-sl">Direct</div></div></div><div className="oc-tl"><span style={{fontSize:12,color:C.muted}}>Review Focus</span><div className="oc-tl-bar"><div className="oc-tl-fill"/></div><span style={{fontSize:12,fontWeight:600,color:C.amber}}>fit first</span></div></div></div>
      </div>
    </section>

    {/* MARQUEE */}
    <div className="mq"><div className="mq-t">{[...Array(2)].map((_,r)=><Fragment key={r}>
	      {["Local Investor Review","Rentals & Renovations","Inherited Properties","Tenant-Occupied Homes","Vacant Homes","Repair-Heavy Properties","Off-Market Opportunities"].map(t=><span className="mq-i" key={t+r}><Ico.Check s={15}/> {t}</span>)}
    </Fragment>)}</div></div>

    {/* BENTO FEATURES */}
    <section className="sec" id="features"><div className="sec-i">
	      <div className="sh c sr"><div className="sl">What We Look For</div><h2 className="st">Local Investor <em>Review</em></h2><p className="ss">A direct way to see whether your property may fit a rental, renovation, flip, assignment, or off-market purchase.</p></div>
	      <div className="bento">
	        <div className="bc w sr"><div className="bico">🏠</div><div className="bt">Properties That Need Work</div><div className="bd">Deferred maintenance, roof issues, dated interiors, water damage, code concerns, or cleanup needs can all be reviewed honestly.</div></div>
	        <div className="bc sr" data-delay="0.1s"><div className="bico">🔑</div><div className="bt">Inherited or Vacant Homes</div><div className="bd">Estate timing, vacancy, repairs, title status, and family decision-making can all shape the best path.</div></div>
	        <div className="bc sr" data-delay="0.1s"><div className="bico">🏘️</div><div className="bt">Rental Potential</div><div className="bd">Some properties make sense as long-term rentals when location, condition, rent, and repair scope line up.</div></div>
	        <div className="bc sr" data-delay="0.15s"><div className="bico">🛡️</div><div className="bt">Clear, Ethical Review</div><div className="bd">Not every property will receive an offer. If a listing may be better, that option can be discussed separately.</div></div>
	        <div className="bc sr" data-delay="0.2s"><div className="bico">📋</div><div className="bt">Simple Property Intake</div><div className="bd">Share the property basics, occupancy, repairs, and timeline so the review starts with useful facts.</div></div>
      </div>
    </div></section>

    {/* PROCESS */}
    <section className="sec" id="how" style={{background:C.subtle}}><div className="sec-i">
	      <div className="sh c sr"><div className="sl">How It Works</div><h2 className="st">From Submission to <em>Review</em></h2><p className="ss">A transparent process for deciding whether a direct investor path makes sense.</p></div>
	      <Timeline/>
	      <div className="cbar sr" data-delay="0.15s">
	        <div className="ci"><div className="cn">Rent</div><div className="cl">Hold Strategy</div></div>
	        <div className="ci"><div className="cn">Flip</div><div className="cl">Renovation Fit</div></div>
	        <div className="ci"><div className="cn">Deal</div><div className="cl">Off-Market Review</div></div>
	        <div className="ci"><div className="cn">List?</div><div className="cl">Secondary Option</div></div>
	      </div>
    </div></section>

    {/* SITUATIONS */}
    <section className="sec" id="sit"><div className="sec-i">
	      <div className="sh c sr"><div className="sl">Property Types</div><h2 className="st">Properties Worth <em>Reviewing</em></h2><p className="ss">The best investor fits often start with a property that is difficult, dated, occupied, vacant, inherited, or not market-ready.</p></div>
	      <div className="paths">
	        <div className="pa sr" onClick={()=>{setIntent(I.DISTRESSED);homepageCta("Needs Repairs", "offer", I.DISTRESSED);}}><span className="pa-e">🏚️</span><div className="pa-t">Needs Repairs</div><div className="pa-d">Fire damage, water issues, foundation concerns, code items, or years of deferred maintenance can be reviewed for renovation fit.</div><span className="pa-l">Submit for review <Ico.Arrow s={14}/></span></div>
	        <div className="pa sr" data-delay="0.1s" onClick={()=>{setIntent(I.INHERITED);homepageCta("Inherited or Vacant", "offer", I.INHERITED);}}><span className="pa-e">🔑</span><div className="pa-t">Inherited or Vacant</div><div className="pa-d">Estate properties, out-of-state ownership, vacancy, and family timing can be reviewed without preparing the home for market first.</div><span className="pa-l">Submit for review <Ico.Arrow s={14}/></span></div>
	        <div className="pa sr" data-delay="0.2s" onClick={()=>{setIntent(I.FAST);homepageCta("Tenant or Timing Issues", "offer", I.FAST);}}><span className="pa-e">⏱️</span><div className="pa-t">Tenant or Timing Issues</div><div className="pa-d">Tenant-occupied homes, relocation, financial pressure, or a tight timeline may make a direct investor conversation worth exploring.</div><span className="pa-l">Submit for review <Ico.Arrow s={14}/></span></div>
	      </div>
	    </div></section>
	
	    {/* REVIEW FOCUS */}
	    <section className="sec" style={{background:C.subtle}}><div className="sec-i">
	      <div className="sh c sr"><div className="sl">Review Focus</div><h2 className="st">A Practical Local <em>Lens</em></h2></div>
	      <div className="tg">
	        {[{t:"Rental potential",d:"Could the property work as a long-term hold after repairs?"},{t:"Renovation spread",d:"Is there enough room between repair cost and resale value?"},{t:"Seller goals",d:"Does a direct review solve a real timing, repair, or occupancy problem?"}].map((x,i)=><div className="tc sr" key={x.t} data-delay={`${i*0.1}s`}><div className="tc-s" style={{color:C.amber,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em"}}>Investor Criteria</div><div className="tc-t">{x.d}</div><div className="tc-a"><div className="tc-av" style={{background:i===0?C.amber:i===1?C.green:C.amberD}}>{i+1}</div><div><div className="tc-n">{x.t}</div><div className="tc-lo">Reviewed case by case</div></div></div></div>)}
	      </div>
	    </div></section>

    {/* FAQ */}
    <section className="sec" id="faq"><div className="sec-i">
      <div className="sh c sr"><div className="sl">Common Questions</div><h2 className="st">Everything You <em>Need to Know</em></h2></div>
      <div className="faq-l">{FAQS.map((f,i)=><div key={i} className={`fq ${faqO===i?"op":""} sr`} data-delay={`${i*0.05}s`}><button className="fq-q" onClick={()=>setFaqO(faqO===i?null:i)}>{f.q}<Ico.Chev/></button><div className="fq-aw"><div className="fq-a">{f.a}</div></div></div>)}</div>
    </div></section>

    {/* LEAD FORM */}
    <section className="sec" id="offer" style={{background:`linear-gradient(180deg,${C.bg},${C.subtle})`}}><div className="sec-i">
	      <div className="sh c sr"><div className="sl">No Obligation</div><h2 className="st">Submit Your Property for <em>Review</em></h2><p className="ss">Tell me about the property, repairs, occupancy, and timing. Not every property will receive an offer.</p></div>
      <div className="fw sr"><LeadForm/></div>
    </div></section>

    </div>)}

    {/* FOOTER */}
    <footer className="foot"><div className="foot-i">
      <div className="foot-g">
	        <div><div className="foot-b">Oakland<span>Cash</span></div><p className="foot-d">Local Oakland County property review for possible direct investor purchases, rentals, renovations, and off-market opportunities.</p></div>
	        <div><div className="foot-h">Company</div><ul className="foot-ul"><li><a href="#" onClick={e=>{e.preventDefault();goPage("home");}}>Home</a></li><li><a href="#" onClick={e=>{e.preventDefault();goPage("home");setTimeout(()=>go("how"),200);}}>How It Works</a></li><li><a href="#" onClick={e=>{e.preventDefault();goPage("home");setTimeout(()=>go("sit"),200);}}>Property Types</a></li><li><a href="#" onClick={e=>{e.preventDefault();goPage("insights");}}>Insights</a></li></ul></div>
        <div><div className="foot-h">Areas</div><ul className="foot-ul">{LOCATIONS.map(l=><li key={l.slug}><a href={`/sell/${l.slug}`}>{l.city}</a></li>)}</ul></div>
        <div><div className="foot-h">Contact</div><ul className="foot-ul"><li><a href="tel:+12485550100">(248) 555-0100</a></li><li><a href="mailto:info@oaklandcash.com">info@oaklandcash.com</a></li><li><a>Oakland County, MI</a></li></ul></div>
      </div>
	      <p className="foot-dis">{DISCLOSURE}</p>
	      <div className="foot-bot"><div className="foot-c">© 2026 OaklandCash. All rights reserved.</div><div className="foot-bgs"><span className="foot-bg">Licensed Michigan real estate professional</span><span className="foot-bg">Investor review, not an obligation</span></div></div>
    </div></footer>
  </div>);
}
