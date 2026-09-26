import React from 'react';

const SUBJECTS=['Biology','Physics','Chemistry','Psychology'];

export default function StudyAnalytics({analytics}){
  if(!analytics)return <section className="card analytics"><div className="analytics-head"><div><small>WEEKLY ANALYTICS</small><h2>Study breakdown</h2></div></div><p className="empty">Loading analytics...</p></section>;
  return <section className="card analytics">
    <div className="analytics-head">
      <div><small>WEEKLY ANALYTICS</small><h2>Study breakdown</h2></div>
      <div className={"week-change "+(analytics.change>=0?"up":"down")}>
        <strong>{analytics.change>=0?"+":""}{Number(analytics.change).toFixed(0)}%</strong>
        <span>vs last week</span>
      </div>
    </div>
    <div className="analytics-summary">
      <div><span>This week</span><strong>{Number(analytics.thisWeek).toFixed(1)}h</strong></div>
      <div><span>Last week</span><strong>{Number(analytics.lastWeek).toFixed(1)}h</strong></div>
      <div><span>Most productive day</span><strong>{analytics.productiveDay}</strong></div>
    </div>
    <div className="subject-breakdown">
      {SUBJECTS.map(subject=>{
        const h=Number(analytics.subjectHours?.[subject]||0);
        const pct=analytics.thisWeek?Math.min(100,h/Number(analytics.thisWeek)*100):0;
        return <div className="subject-row" key={subject}>
          <div><b>{subject}</b><span>{h.toFixed(1)}h</span></div>
          <div className="analytics-bar"><i style={{width:pct+"%"}}/></div>
        </div>
      })}
    </div>
  </section>;
}
