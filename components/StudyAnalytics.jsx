import React,{useMemo,useState}from'react';

const SUBJECTS=[
  {name:'Biology',c1:'#f7a8c4',c2:'#e4779f'},
  {name:'Physics',c1:'#9bc7f5',c2:'#669bd3'},
  {name:'Chemistry',c1:'#a8dfb1',c2:'#6fbb7d'},
  {name:'Psychology',c1:'#d6b0ee',c2:'#a879ca'}
];
const CX=160,CY=160,R=112,INNER=54;
function point(r,deg){let a=(deg-90)*Math.PI/180;return[CX+r*Math.cos(a),CY+r*Math.sin(a)]}
function slicePath(a0,a1){const[x0,y0]=point(R,a0),[x1,y1]=point(R,a1),[x2,y2]=point(INNER,a1),[x3,y3]=point(INNER,a0),big=a1-a0>180?1:0;return`M ${x0} ${y0} A ${R} ${R} 0 ${big} 1 ${x1} ${y1} L ${x2} ${y2} A ${INNER} ${INNER} 0 ${big} 0 ${x3} ${y3} Z`}
function seeded(n){const x=Math.sin(n*999.91)*43758.5453;return x-Math.floor(x)}

export default function StudyAnalytics({analytics}){
  const[hovered,setHovered]=useState(null);
  const total=Number(analytics?.thisWeek||0);
  const data=useMemo(()=>SUBJECTS.map((s,i)=>({...s,hours:Number(analytics?.subjectHours?.[s.name]||0),i})),[analytics]);
  let angle=0;
  const slices=data.filter(x=>x.hours>0).map(x=>{const start=angle,end=angle+(total?x.hours/total*360:0);angle=end;return{...x,start,end}});
  const active=hovered?data.find(x=>x.name===hovered):null;
  if(!analytics)return <section className="card analytics donut-card"><p className="empty">Loading weekly analytics...</p></section>;
  return <section className="card analytics donut-card">
    <div className="donut-title"><small>WEEKLY ANALYTICS</small><h2>Study donut</h2><p className="muted">Hover a frosting slice to see your subject hours.</p></div>
    <div className="donut-layout">
      <div className="donut-wrap"><svg className="study-donut" viewBox="0 0 320 320">
        <defs>
          <filter id="donutShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="9" stdDeviation="8" floodOpacity=".18"/></filter>
          {SUBJECTS.map((s,i)=><linearGradient key={s.name} id={'frost'+i} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={s.c1}/><stop offset="100%" stopColor={s.c2}/></linearGradient>)}
          <radialGradient id="dough"><stop offset="0%" stopColor="#efc17f"/><stop offset="70%" stopColor="#d89b55"/><stop offset="100%" stopColor="#b97739"/></radialGradient>
        </defs>
        <circle cx={CX} cy={CY+5} r="116" fill="url(#dough)" filter="url(#donutShadow)"/>
        <circle cx={CX} cy={CY} r="112" fill="#dca05b"/>
        {total===0?<circle cx={CX} cy={CY} r="108" fill="#f3b9cc"/>:slices.map((s,idx)=>{
          const mid=(s.start+s.end)/2,off=hovered===s.name?7:0,[px,py]=point(off,mid),tx=px-CX,ty=py-CY;
          return <g key={s.name} onMouseEnter={()=>setHovered(s.name)} onMouseLeave={()=>setHovered(null)} className="donut-slice" style={{transform:`translate(${tx}px,${ty}px)`}}>
            <path d={slicePath(s.start+.8,s.end-.8)} fill={`url(#frost${s.i})`} stroke="#fff4" strokeWidth="2"/>
            {Array.from({length:Math.max(2,Math.round(s.hours*2))}).map((_,j)=>{const a=s.start+(s.end-s.start)*(0.15+seeded((idx+1)*20+j)*.7),rr=INNER+18+seeded((idx+1)*40+j)*(R-INNER-30),[x,y]=point(rr,a),colors=['#fff7b2','#ff6f91','#79c8ff','#ffffff','#8bd49b'];return <rect key={j} x={x-2.5} y={y-1} width="7" height="2.6" rx="1.3" fill={colors[j%colors.length]} transform={`rotate(${a+j*23} ${x} ${y})`} opacity=".9"/>})}
          </g>})}
        <circle cx={CX} cy={CY} r={INNER-2} fill="var(--card)"/>
        <text x={CX} y={CY-3} textAnchor="middle" className="donut-value">{(active?active.hours:total).toFixed(1)}h</text>
        <text x={CX} y={CY+18} textAnchor="middle" className="donut-label">{active?active.name:'This week'}</text>
      </svg></div>
      <div className="donut-side">
        <div className="donut-legend">{data.map(s=><div key={s.name} className="legend-row" onMouseEnter={()=>setHovered(s.name)} onMouseLeave={()=>setHovered(null)}><i style={{background:s.c1}}/><span>{s.name}</span><strong>{s.hours.toFixed(1)}h</strong></div>)}</div>
        <div className="mini-stats"><div><span>Last week</span><strong>{Number(analytics.lastWeek).toFixed(1)}h</strong></div><div><span>Change</span><strong>{analytics.change>=0?'+':''}{Number(analytics.change).toFixed(0)}%</strong></div><div><span>Best day</span><strong>{analytics.productiveDay}</strong></div></div>
      </div>
    </div>
  </section>
}
