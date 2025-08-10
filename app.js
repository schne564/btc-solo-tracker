// Replace WORKER_URL with your Cloudflare Worker URL after deployment, e.g.
// const WORKER_URL = 'https://your-worker.example.workers.dev';
const WORKER_URL = 'https://broad-cell-151e.schne564.workers.dev/';
const defaultAddr = "1LuckyR1fFHEsXYyx5QK4UFzv3PEAepPMK";
let addr = defaultAddr;
const refreshInterval = 60000; // 60s

document.getElementById("addr-input").value = "";
document.getElementById("tracking-addr").textContent = addr;

document.getElementById("track-btn").addEventListener("click", ()=>{
  const val = document.getElementById("addr-input").value.trim();
  if(val) addr = val;
  document.getElementById("tracking-addr").textContent = addr;
  fetchAndRender();
});

async function fetchAndRender(){
  const url = `${WORKER_URL}/user/${encodeURIComponent(addr)}`;
  try {
    const res = await fetch(url);
    if(!res.ok){
      showAlert('Upstream error: ' + res.status, 'diff');
      return;
    }
    const data = await res.json();
    renderData(data);
  } catch (e){
    console.error(e);
    showAlert('Error fetching data: '+e.message, 'diff');
  }
}

function renderData(data){
  const stats = data.stats || data;
  const best = stats.bestshare || stats.best || stats.best_share || stats.bestShare || null;
  const diff = stats.shares || stats.currentDifficulty || stats.diff || stats.difficulty || stats.d || null;
  const luck = stats.luck || stats.estimated || stats.chance || stats.l || null;
  const lastblock = stats.last_block || stats.lastshare || stats.last_share || stats.lastFound || stats.last_block_found || stats.lastBlock || null;
  const workers = stats.workers || stats.worker || stats.miners || stats.pools || [];

  document.getElementById("bestshare").textContent = best ?? '—';
  document.getElementById("diff").textContent = diff ?? '—';
  document.getElementById("chance").textContent = (luck!==null) ? ( (Number(luck)*100).toFixed(6)+'%' ) : '—';
  document.getElementById("lastblock").textContent = lastblock ?? '—';

  const wEl = document.getElementById("workers");
  wEl.innerHTML = '';
  if(Array.isArray(workers)){
    workers.forEach(w => {
      const div = document.createElement('div');
      div.className = 'worker';
      div.innerHTML = `<div>${w.id || w.name || w.worker || 'worker'}</div><div>${w.hashrate || w.h || w.hr || ''}</div>`;
      wEl.appendChild(div);
    });
  } else if(typeof workers === 'object'){
    Object.keys(workers).forEach(k=>{
      const w = workers[k];
      const div = document.createElement('div');
      div.className = 'worker';
      div.innerHTML = `<div>${k}</div><div>${w.h || w.hashrate || ''}</div>`;
      wEl.appendChild(div);
    });
  } else {
    wEl.textContent = '—';
  }

  const alerts = document.getElementById("alerts");
  alerts.innerHTML = '';
  if(lastblock){
    const a = document.createElement('div');
    a.className = 'alert block';
    a.textContent = '🚀 Block Found! ' + lastblock;
    alerts.appendChild(a);
  }
  if(best && diff && Number(best) > Number(diff)){
    const a2 = document.createElement('div');
    a2.className = 'alert diff';
    a2.textContent = '🔥 New High Difficulty! Best Share: ' + best;
    alerts.appendChild(a2);
  }
}

function showAlert(msg, cls='diff'){
  const a = document.createElement('div');
  a.className = 'alert '+cls;
  a.textContent = msg;
  const alerts = document.getElementById('alerts');
  alerts.appendChild(a);
}

fetchAndRender();
setInterval(fetchAndRender, refreshInterval);
