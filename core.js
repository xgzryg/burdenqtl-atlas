(function(root){
  'use strict';
  const numeric = new Set(['chromosome','position','beta_caf','se_caf','p_value','rank_lead','ci_lower_caf','ci_upper_caf','REF_AF_20country_pooled','ALT_AF_20country_pooled','n_rows','n_countries']);
  const number = x => x === null || x === undefined || x === '' || !Number.isFinite(Number(x)) ? null : Number(x);
  const truth = x => x === true || String(x).toLowerCase() === 'true' || x === 1;
  const escape = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function unpack(packet, analysis){return packet.rows.map(row=>{const r=Array.isArray(row)?Object.fromEntries(packet.columns.map((key,i)=>[key,row[i]])):{...row};r.analysis_id=analysis.id;r.sex=analysis.sex;r.measure=analysis.measure;return r;});}
  function parseFilters(f){
    const p = number(f.p), start = number(f.start), end = number(f.end);
    if (p === null || p <= 0 || p > 1) throw new Error('Enter a P-value threshold greater than 0 and at most 1, for example 8e-9.');
    if(f.start && (start===null || start<1 || !Number.isInteger(start)))throw new Error('The start coordinate must be a positive integer.');
    if(f.end && (end===null || end<1 || !Number.isInteger(end)))throw new Error('The end coordinate must be a positive integer.');
    if(start!==null && end!==null && start>end) throw new Error('The start coordinate must not exceed the end coordinate.');
    if((start!==null || end!==null) && !f.chr)throw new Error('Select a chromosome when filtering by coordinates.');
    const betaMin=number(f.betaMin),betaMax=number(f.betaMax);
    if(f.betaMin && betaMin===null || f.betaMax && betaMax===null)throw new Error('Effect-size bounds must be numeric.');
    if(betaMin!==null && betaMax!==null && betaMin>betaMax)throw new Error('The minimum effect must not exceed the maximum effect.');
    return {...f,p,start,end,betaMin,betaMax,q:(f.q||'').trim().toLowerCase()};
  }
  function filterRows(rows,f){
    const region=/^(?:chr)?(\d+|x|y):(\d+)(?:-(\d+))?$/i.exec(f.q);
    return rows.filter(r=>{
      const pv=number(r.p_value), pos=number(r.position);
      if(pv===null || pv<0 || pv>=f.p)return false;
      if(f.chr && String(r.chromosome).replace(/^chr/i,'')!==f.chr)return false;
      if((f.start!==null||f.end!==null||region)&&pos===null)return false;
      if(f.start!==null && pos<f.start || f.end!==null && pos>f.end)return false;
      const beta=number(r.beta_caf);
      if(f.betaMin!==null && (beta===null||beta<f.betaMin) || f.betaMax!==null && (beta===null||beta>f.betaMax))return false;
      if(f.snpSet==='lead' && !truth(r.is_lead))return false;
      if(f.snpSet==='nonlead' && (r.is_lead===null || r.is_lead===undefined || truth(r.is_lead)))return false;
      if(f.classification==='credible' && !truth(r.credible_status) && r.credible_status!=='credible')return false;
      if(region){return String(r.chromosome).replace(/^chr/i,'').toLowerCase()===region[1].toLowerCase() && pos>=+region[2] && pos<=+(region[3]||region[2]);}
      return !f.q || f.q.split(/[;；,，\s]+/).filter(Boolean).some(term=>['rsID','variant_key','gene'].some(k=>{const value=String(r[k]||'').toLowerCase();if(/^(?:chr)?[^:]+:\d+:[^:]+:[^:]+$/.test(term))return value.replace(/^chr/,'')===term.replace(/^chr/,'');return /^rs\d+$/.test(term)?value===term:value.includes(term);}));
    });
  }
  function sortRows(rows,key,dir){return rows.slice().sort((a,b)=>{let x=a[key],y=b[key];if(numeric.has(key)){x=number(x);y=number(y);}if(x===null||x===undefined||x==='')return y===null||y===undefined||y===''?0:1;if(y===null||y===undefined||y==='')return -1;return (typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'en',{numeric:true}))*dir;});}
  function delimited(rows,columns,sep='\t'){
    const cell=v=>{let s=v===null||v===undefined?'':String(v);if(/^[=+@]/.test(s)||/^-\D/.test(s))s="'"+s;return /["\r\n\t,]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
    return columns.map(cell).join(sep)+'\r\n'+rows.map(r=>columns.map(k=>cell(r[k])).join(sep)).join('\r\n')+'\r\n';
  }
  function scientific(v,digits=3){const n=number(v);return n===null?'—':n===0?'0':Math.abs(n)<.001||Math.abs(n)>=10000?n.toExponential(digits-1):n.toPrecision(digits);}
  function pearson(points){if(points.length<3)return null;const mx=points.reduce((s,p)=>s+p.x,0)/points.length,my=points.reduce((s,p)=>s+p.y,0)/points.length;let xx=0,yy=0,xy=0;points.forEach(p=>{xx+=(p.x-mx)**2;yy+=(p.y-my)**2;xy+=(p.x-mx)*(p.y-my);});return xx&&yy?xy/Math.sqrt(xx*yy):null;}
  const api={number,truth,escape,unpack,parseFilters,filterRows,sortRows,delimited,scientific,pearson};
  root.PortalCore=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
