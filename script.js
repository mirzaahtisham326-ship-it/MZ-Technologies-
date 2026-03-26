/* =========================================================
   MZ TECHNOLOGIES — Lead Generation Page Script
   ========================================================= */

// ── Navbar scroll effect ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));

// ── Scroll reveal (fade-in) ──
const obs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade').forEach(el => obs.observe(el));

// ── Accordion (Approach section) ──
function toggleAcc(t) {
  const item = t.parentElement;
  const open = item.classList.contains('open');
  document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

// ── FAQ ──
function toggleFaq(b) {
  const item = b.parentElement;
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

// ── Contact Form (PHP Mailer) ──
const cForm = document.getElementById('contactFormEl');
if (cForm) {
  cForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const st  = document.getElementById('formStatus');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      const r = await fetch('contact.php', { method: 'POST', body: new FormData(cForm) });
      const d = await r.json();
      st.style.display = 'block';
      if (d.status === 'success') {
        st.style.cssText = 'display:block;background:rgba(56,182,255,0.08);border:1px solid rgba(56,182,255,0.25);color:#1E9DDB;padding:11px 14px;border-radius:8px;font-size:0.82rem;margin-bottom:4px;';
        st.textContent  = '✓ Message sent. We will reply within 24 hours.';
        cForm.reset();
      } else {
        st.style.cssText = 'display:block;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#DC2626;padding:11px 14px;border-radius:8px;font-size:0.82rem;margin-bottom:4px;';
        st.textContent  = '✗ ' + (d.message || 'Something went wrong.');
      }
    } catch {
      st.style.cssText = 'display:block;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);color:#DC2626;padding:11px 14px;border-radius:8px;font-size:0.82rem;margin-bottom:4px;';
      st.textContent  = '✗ An error occurred. Please try again.';
    }
    btn.disabled = false;
    btn.innerHTML = 'Send Message <span class="arr">→</span>';
    setTimeout(() => { st.style.display = 'none'; }, 5000);
  });
}

// ── Newsletter Form (PHP Mailer) ──
const nForm = document.getElementById('nlForm');
if (nForm) {
  nForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = nForm.querySelector('button');
    const st  = document.getElementById('nlStatus');
    const ogHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '...';
    try {
      const r = await fetch('newsletter.php', { method: 'POST', body: new FormData(nForm) });
      const d = await r.json();
      st.style.display = 'block';
      if (d.status === 'success') {
        st.style.color = '#10B981';
        st.textContent = '✓ Subscribed successfully!';
        nForm.reset();
      } else {
        st.style.color = '#EF4444';
        st.textContent = '✗ ' + (d.message || 'Error subscribing.');
      }
    } catch {
      st.style.display = 'block';
      st.style.color = '#EF4444';
      st.textContent = '✗ Connection error. Try again.';
    }
    btn.disabled = false;
    btn.innerHTML = ogHtml;
    setTimeout(() => { st.style.display = 'none'; }, 5000);
  });
}

// ── Live Lead Injection ──
const liveLeads = [
  { init:'AT', name:'Alex Thompson',  role:'CEO',           company:'GrowthLabs',  channel:'LinkedIn',  status:'booked',  label:'Booked'    },
  { init:'NP', name:'Nina Patel',     role:'Sales Director',company:'VaultPro',    channel:'Email',     status:'contact', label:'In Contact' },
  { init:'DM', name:'Daniel Moore',   role:'Founder',       company:'NexaFin',     channel:'Instagram', status:'warm',    label:'Warm Lead'  },
  { init:'SC', name:'Sofia Chen',     role:'Head of Ops',   company:'PropLeap',    channel:'LinkedIn',  status:'booked',  label:'Booked'    },
  { init:'JR', name:'James Rivera',   role:'CRO',           company:'HealthBridge',channel:'Email',     status:'contact', label:'In Contact' },
  { init:'MW', name:'Mia Watson',     role:'Co-Founder',    company:'SkyReal',     channel:'Instagram', status:'booked',  label:'Booked'    },
];
let leadIndex = 0;
const lr = document.getElementById('leadRows');

function injectLead() {
  const l = liveLeads[leadIndex % liveLeads.length];
  leadIndex++;
  const existing = lr.querySelectorAll('.lead-row');
  // Immediately remove the oldest lead synchronously to maintain exact container height
  if (existing.length >= 4) {
    const last = existing[existing.length - 1];
    if (last.parentNode) last.remove();
  }
  const sc = l.status === 'booked' ? 'status-booked' : l.status === 'contact' ? 'status-contact' : 'status-warm';
  const row = document.createElement('div');
  row.className = 'lead-row new-lead';
  row.innerHTML = `
    <div class="lead-info">
      <div class="lead-avatar av-blue">${l.init}</div>
      <div>
        <div class="lead-name">${l.name}</div>
        <div class="lead-role">${l.role}</div>
      </div>
    </div>
    <div class="lead-company">${l.company}</div>
    <div class="lead-channel">${l.channel}</div>
    <span class="lead-status ${sc}">${l.label}</span>
  `;
  lr.insertBefore(row, lr.firstChild);
}
setTimeout(() => { injectLead(); setInterval(injectLead, 3800); }, 3000);

// ── Count-up animation (Pipeline Visual) ──
function animCount(el, target, dur = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  }
  requestAnimationFrame(step);
}

const pObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animCount(document.getElementById('liCount'), 247);
      animCount(document.getElementById('emCount'), 1842);
      animCount(document.getElementById('igCount'), 389);
      animCount(document.getElementById('mtCount'), 67);
      pObs.disconnect();
    }
  });
}, { threshold: 0.3 });

const pv = document.querySelector('.pipeline-visual');
if (pv) pObs.observe(pv);
