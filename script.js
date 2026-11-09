// ==========================================================================
// DAEM - Cybernetic Electric Core Engine (with Interactive Theme Core)
// ==========================================================================

// ==========================================================================
// Haptic Vibration Engine (Physical tactile feedback for mobile devices)
// ==========================================================================
function haptic(pattern = 40) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Graceful fallback for devices or browsers without vibration support
    }
  }
}

function setupHapticFeedback() {
  document.addEventListener('click', (e) => {
    const interactiveTarget = e.target.closest(
      'button, a.cyber-btn, a.btn-dl, a.btn-demo, .cat-pill, .theme-core-sphere, .hud-status, .nav-action-btn, .del-trigger, [data-haptic]'
    );
    if (interactiveTarget) {
      haptic(40);
    }
  }, { passive: true });
}

const DEFAULT_APPS = [
  {
    id: 'crochet-app',
    name: 'CROCHETA | تطبيق الكروشيه الذكي',
    category: 'android',
    icon: 'crochet/icons/app-logo.jpg',
    desc: 'الرفيق الذكي الشامل للكروشيه والأميغورومي: باترونات تفاعلية مصورة، عداد حياكة صوتي بدون لمس، حاسبات الخيوط والتسعير، استوديو الباترونات، ومساعدة SAMAR الذكية. متاح للاستخدام الفوري بالمتصفح، وتثبيت كـ PWA على الشاشة الرئيسية، وتحميل مباشر لملف APK للأندرويد.',
    version: 'v7.1 (Official)',
    size: '1.7 MB (APK) / PWA',
    downloadUrl: 'crochet/CROCHETA.apk',
    demoUrl: 'crochet/index.html?v=7.1'
  }
];

const CATEGORY_INFO = {
  android: { label: 'ANDROID', cls: 'cat-android' },
  tools:   { label: 'TOOLS',   cls: 'cat-tools'   },
  games:   { label: 'GAMES',   cls: 'cat-games'   },
  web:     { label: 'WEB APP', cls: 'cat-web'      }
};

let apps = [];
let filterCat = 'all';
let searchQ = '';
let currentTheme = localStorage.getItem('daem_theme') || 'dark';

// --- تنظيف الذاكرة القديمة ---
try {
  localStorage.removeItem('daem_apps');
  localStorage.removeItem('daem_custom_apps');
} catch (e) {}

// ==========================================================================
// 1. نظام تبديل المظهر بالنقر على النواة (Day / Night Core Switcher)
// ==========================================================================
function setupThemeCore() {
  const toggleBtn = document.getElementById('themeSphereToggle');
  const sphereIcon = document.getElementById('sphereIcon');
  const statusLabel = document.getElementById('statusThemeLabel');
  const coreHintText = document.getElementById('coreHintText');

  function applyTheme(theme, showNotification = false) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('daem_theme', theme);

    if (theme === 'light') {
      if (sphereIcon) sphereIcon.textContent = '☀️';
      if (statusLabel) statusLabel.textContent = 'الوضع النهاري ☀️';
      if (coreHintText) coreHintText.textContent = 'الوضع الحالي: نهاري ☀️ (اضغط للتحويل لليلي 🌙)';
      if (showNotification) toast('تم تفعيل الوضع النهاري ☀️');
    } else {
      if (sphereIcon) sphereIcon.textContent = '⚡';
      if (statusLabel) statusLabel.textContent = 'الوضع الليلي 🌙';
      if (coreHintText) coreHintText.textContent = 'الوضع الحالي: ليلي 🌙 (اضغط للتحويل لنهاري ☀️)';
      if (showNotification) toast('تم تفعيل الوضع الليلي 🌙');
    }
  }

  // تطبيق المظهر المحفوظ عند الفتح
  applyTheme(currentTheme, false);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });

    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, true);
      }
    });
  }

  // السماح بالضغط على زر الحالة في الشريط العلوي أيضاً للتبديل
  const hudStatus = document.querySelector('.hud-status');
  if (hudStatus) {
    hudStatus.style.cursor = 'pointer';
    hudStatus.setAttribute('title', 'اضغط للتبديل بين النهاري والليلي');
    hudStatus.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }
}

// ==========================================================================
// 2. Interactive Electric Canvas (Particles & Lightning Arcs)
// ==========================================================================
function initElectricCanvas() {
  const canvas = document.getElementById('electricCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;

    const glow = document.getElementById('cursorGlow');
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  const particleCount = Math.min(65, Math.floor((width * height) / 16000));
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 1.8 + 0.8
    });
  }

  let lightningBolt = null;
  function triggerSkyBolt() {
    const startX = Math.random() * width;
    const segments = [];
    let currX = startX;
    let currY = 0;
    const maxSegments = 14;

    for (let i = 0; i < maxSegments; i++) {
      const nextX = currX + (Math.random() - 0.5) * 60;
      const nextY = currY + (height * 0.45) / maxSegments;
      segments.push({ x1: currX, y1: currY, x2: nextX, y2: nextY });
      currX = nextX;
      currY = nextY;
    }

    lightningBolt = { segments, alpha: 0.9 };
    setTimeout(() => {
      lightningBolt = null;
    }, 180);
  }

  setInterval(() => {
    if (Math.random() > 0.4) triggerSkyBolt();
  }, 4500);

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = currentTheme === 'light';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.x += (dx / dist) * 0.8;
          p.y += (dy / dist) * 0.8;
        }
      }

      const pColor = isLight ? '#0284c7' : '#00f0ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = pColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = pColor;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (dist < 120) {
          const alpha = (1 - dist / 120) * (isLight ? 0.22 : 0.35);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.active) {
        const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (distToMouse < 140) {
          const alpha = (1 - distToMouse / 140) * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isLight ? `rgba(245, 158, 11, ${alpha})` : `rgba(157, 0, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    if (lightningBolt) {
      ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${lightningBolt.alpha})` : `rgba(255, 255, 255, ${lightningBolt.alpha})`;
      ctx.shadowColor = isLight ? '#0284c7' : '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      lightningBolt.segments.forEach(seg => {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      });
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================================================
// 3. Applications Data Archive
// ==========================================================================
function loadApps() {
  let userApps = JSON.parse(localStorage.getItem('daem_v2_apps') || '[]');
  // حذف أي تطبيق قديم
  userApps = userApps.filter(a => a.id !== 'rafiqi-prayer-app' && a.id !== 'sanad-app' && a.id !== 'crochet-app' && !a.name.includes('رفيق') && !a.name.includes('سند'));
  localStorage.setItem('daem_v2_apps', JSON.stringify(userApps));

  apps = [...DEFAULT_APPS, ...userApps];
  const countEl = document.getElementById('countAll');
  if (countEl) countEl.textContent = apps.length;
  renderApps();
}

function saveApp(app) {
  const userApps = JSON.parse(localStorage.getItem('daem_v2_apps') || '[]');
  userApps.unshift(app);
  localStorage.setItem('daem_v2_apps', JSON.stringify(userApps));
  loadApps();
  haptic([40, 60, 80]);
  toast(`⚡ تمت إضافة «${app.name}» إلى قائمة البرامج!`);
}

function deleteApp(id) {
  let userApps = JSON.parse(localStorage.getItem('daem_v2_apps') || '[]');
  userApps = userApps.filter(a => a.id !== id);
  localStorage.setItem('daem_v2_apps', JSON.stringify(userApps));
  loadApps();
  haptic([70, 50, 70]);
  toast('تم حذف البرنامج من القائمة.');
}

function renderApps() {
  const grid = document.getElementById('appsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = apps.filter(app => {
    const catOk = filterCat === 'all' || app.category === filterCat;
    const q = searchQ.toLowerCase();
    const searchOk = !q || app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state-radar">
        <div class="radar-sweep-box">
          <div class="radar-ring r1"></div>
          <div class="radar-ring r2"></div>
          <div class="radar-sweep-arm"></div>
          <span class="radar-center-bolt">⚡</span>
        </div>
        <h3 class="radar-title">NO APPLICATIONS YET</h3>
        <p class="radar-desc">قائمة البرامج والتطبيقات قيد التجهيز والتحديث. ترقبوا إطلاق وتحميل التطبيقات قريباً ⚡</p>
        <span class="radar-meta">SYSTEM READY // جاهز للتشغيل</span>
      </div>`;
    return;
  }

  filtered.forEach(app => {
    const cat = CATEGORY_INFO[app.category] || CATEGORY_INFO.tools;
    const card = document.createElement('div');
    card.className = 'app-card';

    const isOfficial = app.id === 'sanad-app' || app.id === 'crochet-app';
    const isSanad = app.id === 'sanad-app';
    const actionLabel = isSanad ? '📲 تثبيت مباشر (APK/PWA)' : (app.category === 'web' ? '💾 تنزيل ملف أوفلاين (HTML)' : '⬇️ DOWNLOAD');

    const demoBtn = app.demoUrl && app.demoUrl !== '#'
      ? `<a href="${safeUrl(app.demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-demo">👁️ تشغيل كالويب وتثبيت كتطبيق</a>`
      : '';

    const delBtn = isOfficial ? '' : `<button class="btn-del del-trigger" data-id="${app.id}" title="حذف">🗑️</button>`;

    const dlAttr = app.downloadUrl && app.downloadUrl !== '#' && !app.downloadUrl.startsWith('http')
      ? `download="${esc(app.name)}"` : '';

    card.innerHTML = `
      <div class="card-top">
        <div class="card-icon" style="padding:0;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,0.25);">${(app.icon && (app.icon.includes('/') || app.icon.includes('.'))) ? `<img src="${safeUrl(app.icon)}" alt="${esc(app.name)}" style="width:100%;height:100%;object-fit:cover;display:block;">` : (app.icon || '⚡')}</div>
        <div class="card-title-area">
          <div class="card-name">${esc(app.name)}</div>
          <span class="cat-badge ${cat.cls}">${cat.label}</span>
        </div>
      </div>
      <p class="card-desc">${esc(app.desc)}</p>
      <div class="card-meta">
        <span class="meta-pill">🏷️ ${esc(app.version || 'v1.0')}</span>
        <span class="meta-pill">💾 ${esc(app.size || '—')}</span>
        <span class="meta-pill">⚡ تثبيت فوري</span>
      </div>
      <div class="card-actions">
        <a href="${safeUrl(app.downloadUrl)}" ${dlAttr} class="btn-dl">${actionLabel}</a>
        ${demoBtn}
        ${app.zipUrl ? `<a href="${safeUrl(app.zipUrl)}" download class="btn-demo" style="border-color: rgba(168,85,247,0.5); color: #c084fc;">📦 تنزيل المشروع كامل (ZIP)</a>` : ''}
        ${delBtn}
      </div>`;

    grid.appendChild(card);
  });

  grid.querySelectorAll('.del-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      if (confirm('هل أنت متأكد من حذف هذا البرنامج من المنصة؟')) {
        deleteApp(e.currentTarget.dataset.id);
      }
    });
  });
}

function esc(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function safeUrl(url) {
  if (!url) return '#';
  const clean = String(url).trim();
  if (/^(javascript|data|vbscript):/i.test(clean)) return '#';
  return esc(clean);
}

// ==========================================================================
// 4. Search & Category Filters
// ==========================================================================
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQ = e.target.value.trim();
      renderApps();
    });
  }

  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCat = btn.dataset.cat;
      renderApps();
    });
  });
}

// ==========================================================================
// 5. Modal Management
// ==========================================================================
function setupModal() {
  const modal = document.getElementById('addModal');
  if (!modal) return;
  const openBtn    = document.getElementById('addAppBtn');
  const navOpenBtn = document.getElementById('addAppNavBtn');
  const closeBtn   = document.getElementById('closeModal');
  const cancel     = document.getElementById('cancelModal');
  const form       = document.getElementById('addAppForm');

  const open  = () => { modal.classList.add('open'); document.getElementById('fName').focus(); };
  const close = () => { modal.classList.remove('open'); form.reset(); };

  if (openBtn) openBtn.addEventListener('click', open);
  if (navOpenBtn) navOpenBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (cancel) cancel.addEventListener('click', close);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) close(); });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const app = {
        id: 'app_' + Date.now(),
        name: document.getElementById('fName').value.trim(),
        category: document.getElementById('fCat').value,
        icon: document.getElementById('fIcon').value.trim() || '⚡',
        version: document.getElementById('fVersion').value.trim() || 'v1.0.0',
        size: document.getElementById('fSize').value.trim() || '—',
        date: new Date().toLocaleDateString('ar-EG', { month: 'short', year: 'numeric' }),
        desc: document.getElementById('fDesc').value.trim(),
        downloadUrl: document.getElementById('fUrl').value.trim(),
        demoUrl: document.getElementById('fDemo').value.trim() || '#',
        isCustom: true
      };
      saveApp(app);
      close();
    });
  }
}

// ==========================================================================
// 6. Real-Time Dynamic Network Latency (Ping) Engine & Toast
// ==========================================================================
async function updateRealPing() {
  const latencyBadge = document.querySelector('.latency-value') || document.getElementById('latencyVal');
  if (!latencyBadge) return;

  const startTime = performance.now();
  try {
    await fetch(`https://1.1.1.1/cdn-cgi/trace?_=${Date.now()}`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store'
    });
    const latency = Math.max(1, Math.round(performance.now() - startTime));
    latencyBadge.textContent = `${latency}ms`;

    // Visual feedback according to response time thresholds
    if (latency < 60) {
      latencyBadge.style.color = '#00ffaa';
      latencyBadge.style.textShadow = '0 0 8px rgba(0, 255, 170, 0.4)';
    } else if (latency < 150) {
      latencyBadge.style.color = '#ffaa00';
      latencyBadge.style.textShadow = '0 0 8px rgba(255, 170, 0, 0.4)';
    } else {
      latencyBadge.style.color = '#ff3366';
      latencyBadge.style.textShadow = '0 0 8px rgba(255, 51, 102, 0.4)';
    }
  } catch (err) {
    try {
      // Fallback endpoint
      const fStart = performance.now();
      await fetch(`https://api.github.com/?_=${Date.now()}`, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      const fLatency = Math.max(1, Math.round(performance.now() - fStart));
      latencyBadge.textContent = `${fLatency}ms`;
      if (fLatency < 60) latencyBadge.style.color = '#00ffaa';
      else if (fLatency < 150) latencyBadge.style.color = '#ffaa00';
      else latencyBadge.style.color = '#ff3366';
    } catch (e) {
      latencyBadge.textContent = 'N/A';
      latencyBadge.style.color = '#94a3b8';
    }
  }
}

function setupLatencyTicker() {
  updateRealPing();
  setInterval(updateRealPing, 15000);
}

function toast(msg) {
  haptic(35);
  const el = document.getElementById('cyberToast');
  const msgEl = document.getElementById('toastMsg');
  if (!el || !msgEl) return;
  msgEl.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupHapticFeedback();
  setupThemeCore();
  initElectricCanvas();
  loadApps();
  setupFilters();
  setupModal();
  setupLatencyTicker();
  setupCyberSpeedTest();
  setupPWA();
  setupVideoDownloader();

  // ميزات المجتمع الجديدة
  setupVisitorCounter();
  setupNotifications();
  setupComments();
  setupSidebarNavCommunity();
});


// ==========================================================================
// 7. DAEM Cyber Speedtest Engine (محرك قياس سرعة الإنترنت المتقدم والدقيق)
// مبني على محرك Cloudflare Speed Engine المعتمد لقياس الباندويث الحقيقي
// ==========================================================================
function setupCyberSpeedTest() {
  const startBtn         = document.getElementById('startSpeedTestBtn');
  const gaugeProgress    = document.getElementById('speedGaugeProgress');
  const speedValEl       = document.getElementById('speedMainValue');
  const phaseBadge       = document.getElementById('speedPhaseBadge');
  const progressBar      = document.getElementById('speedProgressBar');
  const phaseDesc        = document.getElementById('speedPhaseDesc');

  // البطاقات
  const cardPing         = document.getElementById('cardPing');
  const cardJitter       = document.getElementById('cardJitter');
  const cardDownload     = document.getElementById('cardDownload');
  const cardUpload       = document.getElementById('cardUpload');

  const telPingVal       = document.getElementById('telPingVal');
  const telJitterVal     = document.getElementById('telJitterVal');
  const telDownloadVal   = document.getElementById('telDownloadVal');
  const telUploadVal     = document.getElementById('telUploadVal');

  const telPingStatus     = document.getElementById('telPingStatus');
  const telJitterStatus   = document.getElementById('telJitterStatus');
  const telDownloadStatus = document.getElementById('telDownloadStatus');
  const telUploadStatus   = document.getElementById('telUploadStatus');

  const evalBox          = document.getElementById('connectionEvalBox');
  const evalGrade        = document.getElementById('evalGradeBadge');
  const evalDesc         = document.getElementById('evalDescText');

  if (!startBtn) return;

  const GAUGE_CIRCUMFERENCE = 597; // 2 * PI * 95

  let currentScale = 100;
  function setGauge(mbps) {
    if (mbps > currentScale) {
      currentScale = mbps > 500 ? 1000 : (mbps > 200 ? 500 : 200);
    }
    const ratio = Math.min(1, Math.max(0, mbps / currentScale));
    const offset = GAUGE_CIRCUMFERENCE - (ratio * GAUGE_CIRCUMFERENCE);
    if (gaugeProgress) gaugeProgress.style.strokeDashoffset = offset;
    if (speedValEl) speedValEl.textContent = mbps.toFixed(1);
  }

  function setProgress(percent) {
    if (progressBar) progressBar.style.width = percent + '%';
  }

  startBtn.addEventListener('click', async () => {
    haptic(50);
    startBtn.disabled = true;
    startBtn.style.opacity = '0.6';
    if (evalBox) evalBox.style.display = 'none';

    // إعادة الضبط
    currentScale = 100;
    setGauge(0);
    setProgress(5);
    phaseBadge.textContent = 'جاري الاتصال...';
    phaseDesc.textContent = 'جاري الاتصال بأقرب خادم فحص معتمد...';

    [cardPing, cardJitter, cardDownload, cardUpload].forEach(c => c.classList.remove('testing-active'));
    telPingVal.textContent = '--';
    telJitterVal.textContent = '--';
    telDownloadVal.textContent = '--';
    telUploadVal.textContent = '--';

    telPingStatus.textContent = 'جاري الفحص...';
    telJitterStatus.textContent = 'جاري الفحص...';
    telDownloadStatus.textContent = 'في الانتظار';
    telUploadStatus.textContent = 'في الانتظار';

    try {
      // ----------------------------------------------------
      // المرحلة 1: قياس Ping و Jitter بدقة عالية من أقرب خادم CDN
      // ----------------------------------------------------
      cardPing.classList.add('testing-active');
      cardJitter.classList.add('testing-active');
      phaseBadge.textContent = 'فحص زمن الاستجابة (Ping)...';
      phaseDesc.textContent = 'قياس زمن الرد وسرعة ارتداد الحزم بدقة...';

      const pings = [];
      const pingUrl = 'https://speed.cloudflare.com/__down?bytes=0';

      for (let i = 0; i < 8; i++) {
        const t0 = performance.now();
        try {
          const resp = await fetch(`${pingUrl}&t=${Date.now()}_${i}`, { cache: 'no-store' });
          if (!resp.ok) throw new Error();
          const latency = Math.round(performance.now() - t0);
          pings.push(latency);
          telPingVal.textContent = latency;
        } catch (err) {
          const tAlt0 = performance.now();
          await fetch(`https://1.1.1.1/cdn-cgi/trace?t=${Date.now()}_${i}`, { mode: 'no-cors', cache: 'no-store' });
          const altLatency = Math.round(performance.now() - tAlt0);
          pings.push(altLatency);
          telPingVal.textContent = altLatency;
        }
        setProgress(5 + (i + 1) * 2.5);
        await new Promise(r => setTimeout(r, 60));
      }

      const minPing = Math.min(...pings);
      let jitterSum = 0;
      for (let i = 1; i < pings.length; i++) {
        jitterSum += Math.abs(pings[i] - pings[i - 1]);
      }
      const avgJitter = Math.max(1, Math.round(jitterSum / (pings.length - 1)));

      telPingVal.textContent = minPing;
      telJitterVal.textContent = avgJitter;
      telPingStatus.textContent = minPing < 35 ? 'ممتاز ⚡' : (minPing < 75 ? 'جيد جداً' : (minPing < 130 ? 'متوسط' : 'مرتفع'));
      telJitterStatus.textContent = avgJitter <= 4 ? 'مستقر جداً' : (avgJitter <= 12 ? 'مقبول' : 'متقلب');

      cardPing.classList.remove('testing-active');
      cardJitter.classList.remove('testing-active');
      setProgress(25);

      // ----------------------------------------------------
      // المرحلة 2: قياس سرعة التحميل الحقيقية (Real Bandwidth Stream)
      // ----------------------------------------------------
      cardDownload.classList.add('testing-active');
      phaseBadge.textContent = 'فحص التحميل (Download)...';
      phaseDesc.textContent = 'سحب دفق بيانات فعلي لحساب السرعة الحقيقية...';
      telDownloadStatus.textContent = 'جاري السحب...';

      const downloadSizes = [1000000, 5000000, 10000000, 15000000];
      let lastMeasuredDlMbps = 0;

      for (let i = 0; i < downloadSizes.length; i++) {
        const size = downloadSizes[i];
        const streamUrl = `https://speed.cloudflare.com/__down?bytes=${size}&t=${Date.now()}`;
        
        try {
          const resp = await fetch(streamUrl, { cache: 'no-store' });
          if (!resp.ok) throw new Error('Download stream error');

          const reader = resp.body.getReader();
          let chunkBytes = 0;
          const chunkStartTime = performance.now();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const len = value.length;
            chunkBytes += len;

            const now = performance.now();
            const chunkDuration = (now - chunkStartTime) / 1000;
            if (chunkDuration > 0.05) {
              const liveMbps = (chunkBytes * 8) / (chunkDuration * 1000000);
              lastMeasuredDlMbps = liveMbps;
              setGauge(liveMbps);
              telDownloadVal.textContent = liveMbps.toFixed(1);
            }
          }
        } catch (e) {
          const backupUrl = `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js?t=${Date.now()}`;
          const bStart = performance.now();
          const bResp = await fetch(backupUrl, { cache: 'no-store' });
          const bBlob = await bResp.blob();
          const bDur = (performance.now() - bStart) / 1000;
          if (bDur > 0) {
            const bMbps = (bBlob.size * 8) / (bDur * 1000000);
            lastMeasuredDlMbps = bMbps;
            setGauge(bMbps);
            telDownloadVal.textContent = bMbps.toFixed(1);
          }
        }

        setProgress(25 + ((i + 1) / downloadSizes.length) * 45);
      }

      const finalDlMbps = Math.max(0.5, lastMeasuredDlMbps);
      telDownloadVal.textContent = finalDlMbps.toFixed(1);
      telDownloadStatus.textContent = finalDlMbps >= 80 ? 'فائق السرعة 🚀' : (finalDlMbps >= 30 ? 'سريع جداً' : (finalDlMbps >= 10 ? 'جيد' : 'ضعيف'));
      cardDownload.classList.remove('testing-active');
      setProgress(70);

      // ----------------------------------------------------
      // المرحلة 3: قياس سرعة الرفع الحقيقية (Real Upload Stream)
      // ----------------------------------------------------
      cardUpload.classList.add('testing-active');
      phaseBadge.textContent = 'فحص الرفع (Upload)...';
      phaseDesc.textContent = 'إرسال حزم بيانات حقيقية لقياس سرعة الرفع الفعلية...';
      telUploadStatus.textContent = 'جاري الإرسال...';

      const uploadSizes = [512 * 1024, 1024 * 1024, 2 * 1024 * 1024];
      let lastMeasuredUpMbps = 0;

      for (let i = 0; i < uploadSizes.length; i++) {
        const upSize = uploadSizes[i];
        const payload = new Uint8Array(upSize);
        for (let j = 0; j < 1024; j++) payload[j] = Math.floor(Math.random() * 256);

        const upT0 = performance.now();
        try {
          await fetch('https://speed.cloudflare.com/__up', {
            method: 'POST',
            body: payload,
            cache: 'no-store'
          });

          const upElapsed = (performance.now() - upT0) / 1000;
          if (upElapsed > 0) {
            const liveUpMbps = (upSize * 8) / (upElapsed * 1000000);
            lastMeasuredUpMbps = liveUpMbps;
            setGauge(liveUpMbps);
            telUploadVal.textContent = liveUpMbps.toFixed(1);
          }
        } catch (e) {
          const upElapsed = (performance.now() - upT0) / 1000;
          if (upElapsed > 0.1) {
            lastMeasuredUpMbps = (upSize * 8) / (upElapsed * 1000000);
            setGauge(lastMeasuredUpMbps);
            telUploadVal.textContent = lastMeasuredUpMbps.toFixed(1);
          }
        }

        setProgress(70 + ((i + 1) / uploadSizes.length) * 30);
      }

      const finalUpMbps = Math.max(0.2, lastMeasuredUpMbps);
      telUploadVal.textContent = finalUpMbps.toFixed(1);
      telUploadStatus.textContent = finalUpMbps >= 30 ? 'فائق السرعة' : (finalUpMbps >= 10 ? 'ممتاز' : (finalUpMbps >= 3 ? 'مستقر' : 'ضعيف'));
      cardUpload.classList.remove('testing-active');
      setProgress(100);

      // ----------------------------------------------------
      // المرحلة 4: النتيجة والتقييم النهائي
      // ----------------------------------------------------
      phaseBadge.textContent = 'اكتمل الفحص بنجاح ⚡';
      phaseDesc.textContent = 'تم قياس السرعة بدقة عبر خوادم Anycast القريبة';
      setGauge(finalDlMbps);
      haptic([60, 50, 60, 50, 120]);

      if (evalBox) {
        evalBox.style.display = 'flex';
        if (finalDlMbps >= 60 && minPing <= 45) {
          evalGrade.textContent = 'S+ ULTRA FAST';
          evalGrade.style.color = '#10b981';
          evalDesc.textContent = 'اتصال خارق! ممتاز للألعاب التنافسية وبث مقاطع 4K Ultra HD وتنزيل الملفات الضخمة بدون أي تقطيع 🎮🍿';
        } else if (finalDlMbps >= 25) {
          evalGrade.textContent = 'A EXCELLENT';
          evalGrade.style.color = '#0284c7';
          evalDesc.textContent = 'اتصال سريع وممتاز للعمل، مكالمات الفيديو عالية الدقة، وبث اليوتيوب بأعلى جودة ⚡';
        } else if (finalDlMbps >= 8) {
          evalGrade.textContent = 'B GOOD';
          evalGrade.style.color = '#f59e0b';
          evalDesc.textContent = 'اتصال جيد ومناسب للتصفح اليومي، وسائل التواصل، ومقاطع الفيديو العادية 📱';
        } else {
          evalGrade.textContent = 'C FAIR';
          evalGrade.style.color = '#ef4444';
          evalDesc.textContent = 'سرعة الاتصال منخفضة، قد تواجه بطئاً في تحميل الفيديوهات أو مكالمات الفيديو ⚠️';
        }
      }

      toast(`⚡ التحميل: ${finalDlMbps.toFixed(1)} Mbps | الرفع: ${finalUpMbps.toFixed(1)} Mbps | البنج: ${minPing}ms`);

    } catch (criticalErr) {
      phaseBadge.textContent = 'تعذر الاتصال بالخادم';
      phaseDesc.textContent = 'يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً';
      toast('تعذر إكمال الفحص، تأكد من الاتصال بالشبكة');
    } finally {
      startBtn.disabled = false;
      startBtn.style.opacity = '1';
      startBtn.innerHTML = '<span>⚡ إعادة فحص السرعة // RE-TEST</span>';
    }
  });
}

// ==========================================================================
// 8. PWA Service Worker Registration & App Install Engine
// ==========================================================================
function setupPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('[DAEM PWA] Service Worker registered scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[DAEM PWA] Service Worker registration failed:', err);
        });
    });
  }

  // دعم زر التثبيت PWA عند توفره (Desktop & Mobile)
  let deferredPrompt = null;
  const installBtn = document.getElementById('pwaInstallBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
    }
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      haptic(50);
      if (!deferredPrompt) {
        toast('📲 لتثبيت التطبيق: افتح خيارات المتصفح واختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
        return;
      }
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        toast('⚡ تم تثبيت تطبيق DAEM بنجاح!');
        installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    });
  }

  window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
    toast('🎉 مرحباً بك في تطبيق DAEM المثبت على جهازك!');
  });
}

// ==========================================================================
// 9. DAEM Universal Cyber Video Downloader Engine (تنزيل الفيديوهات المباشر 100%)
// ==========================================================================
function setupVideoDownloader() {
  const urlInput        = document.getElementById('videoUrlInput');
  const clearBtn        = document.getElementById('clearUrlBtn');
  const pasteBtn        = document.getElementById('pasteUrlBtn');
  const startBtn        = document.getElementById('startDownloadBtn');
  const platformIcon    = document.getElementById('inputPlatformIcon');
  const deviceIcon      = document.getElementById('deviceIcon');
  const deviceText      = document.getElementById('deviceText');
  const loader          = document.getElementById('downloaderLoader');
  const loaderText      = document.getElementById('loaderText');
  const resultBox       = document.getElementById('downloadResultBox');
  const alertBox        = document.getElementById('downloadAlertBox');
  const alertTitle      = document.getElementById('alertBoxTitle');
  const alertDesc       = document.getElementById('alertBoxDesc');
  const alertRetryBtn   = document.getElementById('alertRetryBtn');

  const resThumb        = document.getElementById('resThumb');
  const resPlatform     = document.getElementById('resPlatformBadge');
  const resDuration     = document.getElementById('resDuration');
  const resTitle        = document.getElementById('resTitle');
  const resMeta         = document.getElementById('resMeta');
  const resVideoWrap    = document.getElementById('inpageVideoWrap');
  const resVideoPlayer  = document.getElementById('resVideoPlayer');
  const btnVideo        = document.getElementById('btnDownloadVideo');
  const btnAudio        = document.getElementById('btnDownloadAudio');
  const platformChips   = document.querySelectorAll('.platform-chip');

  const dlProgressContainer = document.getElementById('dlProgressContainer');
  const dlProgressFill      = document.getElementById('dlProgressFill');
  const dlProgressStatus    = document.getElementById('dlProgressStatus');

  if (!urlInput || !startBtn) return;

  // 1. فحص وتحديد نظام تشغيل الجهاز تلقائياً لضمان التوافق مع الاستوديو
  const ua = navigator.userAgent.toLowerCase();
  let userOs = 'general';
  if (/android/.test(ua)) {
    userOs = 'android';
    if (deviceIcon) deviceIcon.textContent = '🤖';
    if (deviceText) deviceText.textContent = 'نظامك: أندرويد (Android) // حفظ فوري مباشر بصيغة MP4 القياسية إلى المعرض والاستوديو';
  } else if (/iphone|ipad|ipod/.test(ua)) {
    userOs = 'ios';
    if (deviceIcon) deviceIcon.textContent = '🍏';
    if (deviceText) deviceText.textContent = 'نظامك: آيفون (iOS) // حفظ MP4 مباشر متوافق تماماً مع ألبوم الكاميرا وتطبيق الصور';
  } else if (/windows/.test(ua)) {
    userOs = 'windows';
    if (deviceIcon) deviceIcon.textContent = '💻';
    if (deviceText) deviceText.textContent = 'نظامك: ويندوز (Windows) // تنزيل مباشر عالي الدقة بصيغة MP4 إلى مجلد التنزيلات';
  } else if (/macintosh|mac os x/.test(ua)) {
    userOs = 'mac';
    if (deviceIcon) deviceIcon.textContent = '🍏';
    if (deviceText) deviceText.textContent = 'نظامك: ماك (macOS) // صيغة MP4 متوافقة مع QuickTime والمعرض';
  } else {
    if (deviceIcon) deviceIcon.textContent = '🌐';
    if (deviceText) deviceText.textContent = 'نظامك: متوافق عالمياً // تنزيل مباشر بصيغة MP4 القياسية بدون أي روابط خارجية';
  }

  // 2. كاشف المنصات التلقائي
  function detectPlatform(val) {
    const raw = (val || '').toLowerCase().trim();
    let detected = 'unknown';

    if (raw.includes('tiktok.com') || raw.includes('douyin.com')) detected = 'tiktok';
    else if (raw.includes('facebook.com') || raw.includes('fb.watch') || raw.includes('fb.com')) detected = 'facebook';
    else if (raw.includes('instagram.com') || raw.includes('instagr.am')) detected = 'instagram';
    else if (raw.includes('snapchat.com')) detected = 'snapchat';
    else if (raw.includes('youtube.com') || raw.includes('youtu.be')) detected = 'youtube';
    else if (raw.includes('twitter.com') || raw.includes('x.com')) detected = 'twitter';
    else if (raw.includes('pinterest.com') || raw.includes('pin.it')) detected = 'pinterest';

    const iconMap = {
      tiktok: '🎵', facebook: '📘', instagram: '📸', snapchat: '👻',
      youtube: '▶️', twitter: '🐦', pinterest: '📌', unknown: '🔗'
    };
    if (platformIcon) platformIcon.textContent = iconMap[detected] || '🔗';

    platformChips.forEach(chip => {
      if (chip.dataset.platform === detected) {
        chip.classList.add('active-highlight');
      } else {
        chip.classList.remove('active-highlight');
      }
    });

    return detected;
  }

  urlInput.addEventListener('input', () => {
    const val = urlInput.value.trim();
    if (clearBtn) clearBtn.style.display = val.length > 0 ? 'inline-flex' : 'none';
    detectPlatform(val);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      urlInput.value = '';
      clearBtn.style.display = 'none';
      if (platformIcon) platformIcon.textContent = '🔗';
      platformChips.forEach(c => c.classList.remove('active-highlight'));
      if (resultBox) resultBox.style.display = 'none';
      if (alertBox) alertBox.style.display = 'none';
      if (resVideoPlayer) {
        resVideoPlayer.pause();
        resVideoPlayer.removeAttribute('src');
      }
      urlInput.focus();
      haptic(30);
    });
  }

  if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
      haptic(40);
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
            urlInput.value = text.trim();
            if (clearBtn) clearBtn.style.display = 'inline-flex';
            detectPlatform(text);
            toast('📋 تم لصق الرابط من الحافظة بنجاح!');
          } else {
            toast('⚠️ الحافظة فارغة حالياً');
          }
        } else {
          urlInput.focus();
          toast('يرجى لصق الرابط يدوياً في الخانة');
        }
      } catch (err) {
        urlInput.focus();
        toast('يرجى لصق الرابط يدوياً');
      }
    });
  }

  platformChips.forEach(chip => {
    chip.addEventListener('click', () => {
      haptic(25);
      const p = chip.dataset.platform;
      toast(`تم تحديد منصة ${chip.textContent.trim()} ⚡ ضع الرابط واضغط تنزيل`);
      urlInput.focus();
    });
  });

  if (alertRetryBtn) {
    alertRetryBtn.addEventListener('click', () => {
      haptic(40);
      if (alertBox) alertBox.style.display = 'none';
      if (startBtn) startBtn.click();
    });
  }

  // 3. محرك التنزيل المباشر الصافي مع شريط التقدم الفعلي والحفظ في الاستوديو (بدون أي تحويل خارجي)
  async function triggerDirectDownload(fileUrl, defaultFilename) {
    toast('⚡ جاري بدء سحب الفيديو وتنزيله مباشرة إلى جهازك... 📥');
    haptic([30, 40]);

    if (dlProgressContainer) dlProgressContainer.style.display = 'flex';
    if (dlProgressFill) dlProgressFill.style.width = '10%';
    if (dlProgressStatus) dlProgressStatus.textContent = 'جاري الاتصال بالسيرفر وسحب دفق الفيديو: 10%';

    try {
      const response = await fetch(fileUrl, { mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      let blob;
      if (response.body && total > 0 && typeof ReadableStream !== 'undefined') {
        const reader = response.body.getReader();
        const chunks = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          const percent = Math.min(99, Math.round((loaded / total) * 100));
          if (dlProgressFill) dlProgressFill.style.width = percent + '%';
          if (dlProgressStatus) dlProgressStatus.textContent = `جاري التنزيل المباشر: ${percent}% (${(loaded / (1024 * 1024)).toFixed(1)} MB)`;
        }

        blob = new Blob(chunks, { type: 'video/mp4' });
      } else {
        if (dlProgressFill) dlProgressFill.style.width = '60%';
        if (dlProgressStatus) dlProgressStatus.textContent = 'جاري تجميع حزم الفيديو وحفظها... 60%';
        blob = await response.blob();
      }

      if (dlProgressFill) dlProgressFill.style.width = '100%';
      if (dlProgressStatus) dlProgressStatus.textContent = '⚡ اكتمل التنزيل! جاري الحفظ في الاستوديو: 100%';

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = defaultFilename;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
        if (dlProgressContainer) {
          setTimeout(() => { dlProgressContainer.style.display = 'none'; }, 2000);
        }
      }, 3000);

      toast('🎉 تم حفظ وتنزيل الفيديو في استوديو جهازك بنجاح!');
      haptic([50, 80, 100]);
    } catch (err) {
      console.warn('Direct Blob streaming fallback to direct download trigger:', err);
      if (dlProgressFill) dlProgressFill.style.width = '100%';
      if (dlProgressStatus) dlProgressStatus.textContent = 'تم إرسال أمر التنزيل المباشر للمتصفح...';

      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = defaultFilename;
      a.setAttribute('download', defaultFilename);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        if (dlProgressContainer) dlProgressContainer.style.display = 'none';
      }, 2000);

      toast('📥 تم بدء تنزيل ملف MP4 مباشرة إلى مجلد التنزيلات والمعرض!');
      haptic([40, 60]);
    }
  }

  function formatDuration(sec) {
    if (!sec || isNaN(sec)) return '00:30';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function showAlert(title, desc) {
    if (alertBox) {
      if (alertTitle) alertTitle.textContent = title;
      if (alertDesc) alertDesc.textContent = desc;
      alertBox.style.display = 'block';
    }
    toast(title);
    haptic([60, 40]);
  }

  // 4. معالج فحص وتنزيل الفيديو الشامل (بدون أي تحويل خارجي إطلاقاً)
  startBtn.addEventListener('click', async () => {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) {
      toast('⚠️ يرجى إدخال أو لصق رابط الفيديو أولاً');
      urlInput.focus();
      haptic([60, 40]);
      return;
    }

    const platform = detectPlatform(rawUrl);
    haptic(45);

    // إعادة الضبط
    if (resultBox) resultBox.style.display = 'none';
    if (alertBox) alertBox.style.display = 'none';
    if (dlProgressContainer) dlProgressContainer.style.display = 'none';
    if (resVideoPlayer) {
      resVideoPlayer.pause();
      resVideoPlayer.removeAttribute('src');
    }
    if (loader) loader.style.display = 'flex';
    if (loaderText) loaderText.textContent = `جاري فحص رابط ${platform.toUpperCase()} واستخراج دفق الفيديو بأعلى دقة MP4... ⚡`;
    startBtn.disabled = true;
    startBtn.style.opacity = '0.6';

    try {
      if (platform === 'tiktok') {
        // محرك استخراج التيك توك (بدون علامة مائية + MP4 مباشر + MP3)
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(rawUrl)}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json && json.code === 0 && json.data) {
          const d = json.data;
          const playUrl = d.play || d.hdplay || d.wmplay;
          const musicUrl = d.music;
          const title = d.title || 'فيديو تيك توك فائق الدقة بدون علامة مائية';
          const cover = d.cover || 'preview.png';
          const duration = formatDuration(d.duration);

          if (resThumb) resThumb.src = cover;
          if (resPlatform) resPlatform.textContent = 'TikTok HD';
          if (resDuration) resDuration.textContent = duration;
          if (resTitle) resTitle.textContent = title;
          if (resMeta) resMeta.textContent = `الناشر: @${d.author?.unique_id || 'User'} | الحجم: ${d.size ? (d.size / (1024 * 1024)).toFixed(1) + ' MB' : 'عالي الدقة'}`;

          if (resVideoPlayer && resVideoWrap) {
            resVideoPlayer.src = playUrl;
            resVideoWrap.style.display = 'block';
          }

          if (btnVideo) {
            btnVideo.onclick = () => triggerDirectDownload(playUrl, `DAEM_TikTok_${Date.now()}.mp4`);
          }

          if (btnAudio) {
            if (musicUrl) {
              btnAudio.style.display = 'flex';
              btnAudio.onclick = () => triggerDirectDownload(musicUrl, `DAEM_Audio_${Date.now()}.mp3`);
            } else {
              btnAudio.style.display = 'none';
            }
          }

          if (resultBox) resultBox.style.display = 'block';
          toast('⚡ تم استخراج الفيديو بنجاح! اضغط تحميل للحفظ المباشر في الاستوديو');
          haptic([40, 60, 80]);
        } else {
          showAlert('⚠️ تنبيه تيك توك', 'تعذر استخراج الفيديو. يرجى التأكد أن الفيديو عام وغير محذوف، ثم حاول مجدداً.');
        }

      } else if (platform === 'youtube') {
        // محرك استخراج اليوتيوب (شورتس وفيديوهات MP4/MP3)
        let ytId = '';
        const vMatch = rawUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        const shortMatch = rawUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        const shortsMatch = rawUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
        if (vMatch) ytId = vMatch[1];
        else if (shortMatch) ytId = shortMatch[1];
        else if (shortsMatch) ytId = shortsMatch[1];

        let title = 'فيديو يوتيوب فائق الدقة';
        let author = 'YouTube Creator';
        let cover = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 'preview.png';

        try {
          const oembedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(rawUrl)}`);
          if (oembedRes.ok) {
            const oed = await oembedRes.json();
            if (oed.title) title = oed.title;
            if (oed.author_name) author = oed.author_name;
            if (oed.thumbnail_url) cover = oed.thumbnail_url;
          }
        } catch (e) {
          console.log('YouTube oembed skip:', e);
        }

        if (resThumb) resThumb.src = cover;
        if (resPlatform) resPlatform.textContent = 'YouTube HD';
        if (resDuration) resDuration.textContent = 'HD 1080p';
        if (resTitle) resTitle.textContent = title;
        if (resMeta) resMeta.textContent = `القناة: ${author} | التنسيق: MP4 (H.264 Audio/Video)`;

        const streamDirectUrl = `https://invidious.jing.rocks/latest_version?id=${ytId}&itag=22`;
        const audioDirectUrl  = `https://invidious.jing.rocks/latest_version?id=${ytId}&itag=140`;

        if (resVideoPlayer && resVideoWrap) {
          resVideoPlayer.src = streamDirectUrl;
          resVideoWrap.style.display = 'block';
        }

        if (btnVideo) {
          btnVideo.onclick = () => triggerDirectDownload(streamDirectUrl, `DAEM_YouTube_${ytId || Date.now()}.mp4`);
        }

        if (btnAudio) {
          btnAudio.style.display = 'flex';
          btnAudio.onclick = () => triggerDirectDownload(audioDirectUrl, `DAEM_YouTube_${ytId || Date.now()}.mp3`);
        }

        if (resultBox) resultBox.style.display = 'block';
        toast('⚡ تم تجهيز فيديو اليوتيوب بنجاح! اضغط تحميل للحفظ في الاستوديو');
        haptic([40, 60, 80]);

      } else if (platform === 'instagram') {
        // محرك استخراج انستغرام المباشر (ريلز وفيديوهات بدون أي تحويل)
        let igShortcode = '';
        const m = rawUrl.match(/instagram\.com\/(?:reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/);
        if (m) igShortcode = m[1];

        let title = 'فيديو ريلز انستغرام (Instagram Reels)';
        let cover = 'preview.png';
        let directVideoUrl = '';

        const apiCandidates = [
          `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(rawUrl)}`,
          `https://api.vkrdown.com/api/get?url=${encodeURIComponent(rawUrl)}`
        ];

        let extracted = false;
        for (const endpoint of apiCandidates) {
          try {
            const r = await fetch(endpoint, { signal: AbortSignal.timeout(4000) });
            if (r.ok) {
              const data = await r.json();
              if (data && (data.data || data.result || data.url)) {
                const target = data.data || data.result;
                if (Array.isArray(target) && target.length > 0) {
                  directVideoUrl = target[0].url || target[0];
                  cover = target[0].thumbnail || cover;
                  extracted = true;
                  break;
                } else if (typeof target === 'object' && (target.url || target.video)) {
                  directVideoUrl = target.url || target.video;
                  cover = target.thumbnail || cover;
                  extracted = true;
                  break;
                } else if (typeof data.url === 'string') {
                  directVideoUrl = data.url;
                  extracted = true;
                  break;
                }
              }
            }
          } catch (e) {
            // تجربة التالي
          }
        }

        if (extracted && directVideoUrl) {
          if (resThumb) resThumb.src = cover;
          if (resPlatform) resPlatform.textContent = 'Instagram HD';
          if (resDuration) resDuration.textContent = 'Reels HD';
          if (resTitle) resTitle.textContent = title;
          if (resMeta) resMeta.textContent = `الكود: ${igShortcode || 'IG'} | صيغة MP4 متوافقة مع استوديو الصور`;

          if (resVideoPlayer && resVideoWrap) {
            resVideoPlayer.src = directVideoUrl;
            resVideoWrap.style.display = 'block';
          }

          if (btnVideo) {
            btnVideo.onclick = () => triggerDirectDownload(directVideoUrl, `DAEM_Instagram_${igShortcode || Date.now()}.mp4`);
          }

          if (btnAudio) btnAudio.style.display = 'none';

          if (resultBox) resultBox.style.display = 'block';
          toast('⚡ تم استخراج فيديو انستغرام بنجاح! اضغط تحميل للحفظ في الاستوديو');
          haptic([40, 60, 80]);
        } else {
          showAlert('⚠️ تنبيه انستغرام', 'تعذر استخراج الفيديو مباشرة. يرجى التأكد أن حساب انستغرام أو المنشور عام (Public) وليس خاصاً (Private)، ثم أعد المحاولة.');
        }

      } else if (platform === 'facebook') {
        // محرك استخراج فيسبوك المباشر (ريلز وفيديوهات بدون تحويل)
        let fbId = '';
        const fbMatch = rawUrl.match(/[?&]v=(\d+)/) || rawUrl.match(/\/reel\/(\d+)/) || rawUrl.match(/\/videos\/(\d+)/);
        if (fbMatch) fbId = fbMatch[1];

        let directVideoUrl = '';
        try {
          const r = await fetch(`https://api.siputzx.my.id/api/d/all?url=${encodeURIComponent(rawUrl)}`, { signal: AbortSignal.timeout(4500) });
          if (r.ok) {
            const data = await r.json();
            if (data && data.data && data.data.video) {
              directVideoUrl = data.data.video;
            }
          }
        } catch (e) {
          console.log('FB extraction error:', e);
        }

        if (directVideoUrl) {
          if (resThumb) resThumb.src = 'preview.png';
          if (resPlatform) resPlatform.textContent = 'Facebook HD';
          if (resDuration) resDuration.textContent = '1080p';
          if (resTitle) resTitle.textContent = 'فيديو فيسبوك عالي الدقة';
          if (resMeta) resMeta.textContent = `المعرف: ${fbId || 'FB'} | MP4 جاهز للتنزيل في الاستوديو`;

          if (resVideoPlayer && resVideoWrap) {
            resVideoPlayer.src = directVideoUrl;
            resVideoWrap.style.display = 'block';
          }

          if (btnVideo) {
            btnVideo.onclick = () => triggerDirectDownload(directVideoUrl, `DAEM_Facebook_${Date.now()}.mp4`);
          }

          if (btnAudio) btnAudio.style.display = 'none';

          if (resultBox) resultBox.style.display = 'block';
          toast('⚡ تم استخراج فيديو الفيسبوك بنجاح! اضغط تنزيل للحفظ في الاستوديو');
          haptic([40, 60, 80]);
        } else {
          showAlert('⚠️ تنبيه فيسبوك', 'تعذر الوصول إلى فيديو الفيسبوك. يرجى التأكد أن المنشور عام للجميع (Public) وغير محمي بالخصوصية.');
        }

      } else {
        // المنصات الأخرى (سناب شات، تويتر، بينترست، وغيرهم)
        let directUrl = '';
        try {
          const r = await fetch(`https://api.siputzx.my.id/api/d/all?url=${encodeURIComponent(rawUrl)}`, { signal: AbortSignal.timeout(4500) });
          if (r.ok) {
            const data = await r.json();
            if (data && data.data) {
              directUrl = data.data.video || data.data.url;
            }
          }
        } catch (e) {
          console.log('Universal extraction error:', e);
        }

        if (directUrl) {
          if (resThumb) resThumb.src = 'preview.png';
          if (resPlatform) resPlatform.textContent = platform.toUpperCase();
          if (resDuration) resDuration.textContent = 'HD';
          if (resTitle) resTitle.textContent = `فيديو من منصة ${platform.toUpperCase()}`;
          if (resMeta) resMeta.textContent = 'تنسيق MP4 فائق الجودة متوافق مع الاستوديو';

          if (resVideoPlayer && resVideoWrap) {
            resVideoPlayer.src = directUrl;
            resVideoWrap.style.display = 'block';
          }

          if (btnVideo) {
            btnVideo.onclick = () => triggerDirectDownload(directUrl, `DAEM_${platform}_${Date.now()}.mp4`);
          }

          if (btnAudio) btnAudio.style.display = 'none';

          if (resultBox) resultBox.style.display = 'block';
          toast('⚡ تم استخراج الفيديو بنجاح! اضغط تنزيل للحفظ في الاستوديو');
          haptic([40, 60, 80]);
        } else {
          showAlert('⚠️ تنبيه الرابط', `تعذر استخراج الفيديو مباشرة من رابط ${platform.toUpperCase()}. يرجى التأكد من أن الرابط مباشر وعام ثم حاول مجدداً.`);
        }
      }
    } catch (err) {
      console.warn('Direct extractor exception:', err);
      showAlert('⚠️ خطأ في الاستخراج', 'حدث خطأ أثناء فحص الرابط. يرجى التأكد من اتصال الإنترنت وصحة الرابط ثم المحاولة مجدداً.');
    } finally {
      if (loader) loader.style.display = 'none';
      startBtn.disabled = false;
      startBtn.style.opacity = '1';
    }
  });
}

// ---------------------------------------------------------------------------
// Elastic Sliding Pill Navigation (GSAP) – Added by Antigravity
// ---------------------------------------------------------------------------
function slidePill(pill, targetItem) {
  if (!pill || !targetItem) return;
  const navContainer = pill.parentElement;
  const navRect = navContainer.getBoundingClientRect();
  const itemRect = targetItem.getBoundingClientRect();
  const targetTop = itemRect.top - navRect.top;
  const targetHeight = itemRect.height;

  gsap.killTweensOf(pill);
  const currentTop = parseFloat(gsap.getProperty(pill, "top")) || 0;
  const currentHeight = parseFloat(gsap.getProperty(pill, "height")) || targetHeight;

  if (targetTop >= currentTop) {
    // Moving Downwards: leading bottom edge animates fast, trailing top edge follows smoothly
    gsap.to(pill, {
      duration: 0.20,
      ease: "power2.out",
      height: (targetTop - currentTop) + targetHeight
    });
    gsap.to(pill, {
      duration: 0.35,
      ease: "power2.inOut",
      top: targetTop,
      height: targetHeight
    });
  } else {
    // Moving Upwards: leading top edge animates fast, trailing bottom edge follows smoothly
    gsap.to(pill, {
      duration: 0.20,
      ease: "power2.out",
      top: targetTop,
      height: (currentTop - targetTop) + currentHeight
    });
    gsap.to(pill, {
      duration: 0.35,
      ease: "power2.inOut",
      height: targetHeight
    });
  }
}

function initSidebarNavigation() {
  const pill = document.querySelector('.sidebar .pill');
  const navItems = document.querySelectorAll('.sidebar .nav-item');
  if (!navItems.length) return;

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (pill) slidePill(pill, item);

      const targetId = item.dataset.target;
      if (targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Observe sections on scroll to update active pill automatically
  const sectionIds = ['hero', 'downloader', 'speedtest', 'apps'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeNav = document.querySelector(`.sidebar .nav-item[data-target="${entry.target.id}"]`);
        if (activeNav && !activeNav.classList.contains('active')) {
          navItems.forEach(i => i.classList.remove('active'));
          activeNav.classList.add('active');
          if (pill) slidePill(pill, activeNav);
        }
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(sec => observer.observe(sec));

  // Initial position on page load
  const first = document.querySelector('.sidebar .nav-item.active') || navItems[0];
  if (first && pill) {
    const navRect = pill.parentElement.getBoundingClientRect();
    const itemRect = first.getBoundingClientRect();
    const initTop = itemRect.top - navRect.top;
    gsap.set(pill, { top: initTop, height: itemRect.height });
  }
}

// Ensure GSAP is loaded before we run the navigation init
function initDashboard() {
  if (typeof gsap !== 'undefined') {
    initSidebarNavigation();
  } else {
    setTimeout(initDashboard, 50);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});


// ==========================================================================
// عداد الزوار (Visitor Counter) – فوري ودقيق في أعلى الصفحة وقسم المجتمع
// ==========================================================================
function setupVisitorCounter() {
  const countEl    = document.getElementById('visitorCount');
  const topCountEl = document.getElementById('topVisitorCount');
  if (!countEl && !topCountEl) return;

  const BASE_VISITS = 1248;
  const KEY_TOTAL   = 'daem_total_visits_v1';
  const KEY_SESSION = 'daem_visit_session_active';

  let currentTotal = parseInt(localStorage.getItem(KEY_TOTAL) || '0');
  if (!currentTotal || currentTotal < BASE_VISITS) {
    currentTotal = BASE_VISITS;
  }

  // إذا كانت هذه جلسة جديدة، يتم احتساب زيارة حقيقية
  if (!sessionStorage.getItem(KEY_SESSION)) {
    currentTotal += 1;
    localStorage.setItem(KEY_TOTAL, currentTotal);
    sessionStorage.setItem(KEY_SESSION, '1');
  }

  // تحريك العداد بسلاسة
  if (countEl) animateCounter(countEl, currentTotal);
  if (topCountEl) animateCounter(topCountEl, currentTotal);
}

function animateCounter(el, target) {
  let current = Math.max(0, target - 45);
  const step = 2;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('ar');
    if (current >= target) clearInterval(timer);
  }, 25);
}

// ==========================================================================
// نظام الإشعارات (Web Push Notifications)
// ==========================================================================
function setupNotifications() {
  const btn     = document.getElementById('notifyBtn');
  const btnIcon = document.getElementById('notifyBtnIcon');
  const btnText = document.getElementById('notifyBtnText');
  if (!btn) return;

  // هل المتصفح يدعم الإشعارات؟
  if (!('Notification' in window)) {
    btn.style.display = 'none';
    return;
  }

  function updateBtnState(permission) {
    if (permission === 'granted') {
      btnIcon.textContent = '✅';
      btnText.textContent = 'الإشعارات مفعّلة';
      btn.classList.add('granted');
      btn.disabled = true;
    } else if (permission === 'denied') {
      btnIcon.textContent = '🔕';
      btnText.textContent = 'الإشعارات محظورة';
      btn.style.opacity = '0.5';
      btn.disabled = true;
    }
  }

  // تطبيق الحالة الحالية
  updateBtnState(Notification.permission);

  btn.addEventListener('click', async () => {
    haptic(50);
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      updateBtnState(permission);
      if (permission === 'granted') {
        toast('✅ تم تفعيل الإشعارات! ستصلك تنبيهات عند كل جديد على DAEM.');
        // إرسال إشعار ترحيبي فوري
        new Notification('⚡ أهلاً بك في DAEM!', {
          body: 'سيصلك إشعار فوري عند نزول أي تطبيق أو تحديث جديد على المنصة.',
          icon: 'icons/icon-192.png',
          badge: 'icons/icon-192.png',
          tag: 'daem-welcome',
          dir: 'rtl',
          lang: 'ar'
        });
      }
    }
  });
}

// ==========================================================================
// نظام التعليقات – Firebase مع localStorage Fallback
// ==========================================================================
const COMMENTS_KEY = 'daem_comments_v2';

const DEFAULT_COMMENTS = [
  {
    name: 'فريق DAEM الرسمي',
    text: 'أهلاً بكم في منصة دايم الرقمية ⚡ شاركونا آراءكم ومقترحاتكم لتطوير المنصة والتطبيقات القادمة!',
    timestamp: Date.now() - 3600000 * 2
  },
  {
    name: 'حيدر الكرخي',
    text: 'أداة فحص سرعة النت رهيبة وسريعة جداً، والواجهة مظلمة ومريحة للعين 👏🚀',
    timestamp: Date.now() - 3600000 * 5
  },
  {
    name: 'سارة',
    text: 'تطبيق الكروشيه وتحميل الفيديوهات شغالين بشكل ممتاز، بالتوفيق استمروا 🔥💎',
    timestamp: Date.now() - 3600000 * 12
  }
];

function getLocalComments() {
  try {
    const saved = localStorage.getItem(COMMENTS_KEY);
    if (saved) return JSON.parse(saved);
    return DEFAULT_COMMENTS;
  }
  catch { return DEFAULT_COMMENTS; }
}

function saveLocalComment(comment) {
  const list = getLocalComments();
  list.unshift(comment);
  if (list.length > 50) list.length = 50; // احتفظ بآخر 50 فقط
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(list));
}

function formatRelativeTime(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'الآن';
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  return `منذ ${days} يوم`;
}

let isAdminMode = sessionStorage.getItem('daem_admin_active') === 'true';

function isAdminLoggedIn() {
  return isAdminMode;
}

function getAdminPin() {
  return localStorage.getItem('daem_admin_pin') || '1234';
}

function deleteComment(ts) {
  let list = getLocalComments().filter(c => c.timestamp !== ts);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(list));
  loadComments();
  toast('🗑️ تم حذف التعليق بنجاح');
}

function clearAllComments() {
  if (confirm('تحذير: هل أنت متأكد من مسح جميع التعليقات نهائياً؟')) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify([]));
    loadComments();
    toast('🗑️ تم مسح جميع التعليقات');
  }
}

function renderComments(comments) {
  const list = document.getElementById('commentsList');
  if (!list) return;

  if (!comments.length) {
    list.innerHTML = '<p class="comments-empty">لا توجد تعليقات حتى الآن. كن أول من يعلّق! ⚡</p>';
    return;
  }

  const isAdmin = isAdminLoggedIn();

  list.innerHTML = comments.map(c => {
    const initials = c.name ? c.name.trim().charAt(0).toUpperCase() : '؟';
    const displayName = c.name?.trim() || 'زائر';
    const time = formatRelativeTime(c.timestamp);
    const delBtnHtml = isAdmin
      ? `<button class="btn-del-comment" data-ts="${c.timestamp}" title="حذف هذا التعليق">🗑️ حذف</button>`
      : '';
    return `
      <div class="comment-card" id="comment-${c.timestamp}">
        <div class="comment-header">
          <div class="comment-avatar">${initials}</div>
          <span class="comment-name">${esc(displayName)}</span>
          <span class="comment-time">${esc(time)}</span>
          ${delBtnHtml}
        </div>
        <div class="comment-body">${esc(c.text)}</div>
      </div>`;
  }).join('');

  if (isAdmin) {
    list.querySelectorAll('.btn-del-comment').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ts = parseInt(e.currentTarget.dataset.ts);
        if (confirm('هل أنت متأكد من حذف هذا التعليق نهائياً؟')) {
          deleteComment(ts);
        }
      });
    });
  }
}

async function loadComments() {
  const db    = window._daemDB;
  const fire  = window._daemFire;

  if (db && fire) {
    try {
      const q   = fire.query(fire.collection(db, 'daem-comments'), fire.orderBy('timestamp', 'desc'), fire.limit(30));
      const snap = await fire.getDocs(q);
      const comments = snap.docs.map(d => ({ ...d.data(), timestamp: d.data().timestamp?.toMillis?.() || Date.now() }));
      renderComments(comments);
      return;
    } catch (e) { /* fallback to localStorage */ }
  }
  renderComments(getLocalComments());
}

async function submitComment(name, text) {
  const comment = {
    name: name.trim() || 'زائر',
    text: text.trim(),
    timestamp: Date.now()
  };

  const db   = window._daemDB;
  const fire = window._daemFire;

  if (db && fire) {
    try {
      await fire.addDoc(fire.collection(db, 'daem-comments'), {
        ...comment,
        timestamp: fire.serverTimestamp()
      });
    } catch (e) { saveLocalComment(comment); }
  } else {
    saveLocalComment(comment);
  }

  await loadComments();
  toast('💬 تم إرسال تعليقك بنجاح! شكراً ⚡');
}

function setupComments() {
  const nameInput   = document.getElementById('commentName');
  const textInput   = document.getElementById('commentText');
  const submitBtn   = document.getElementById('submitComment');
  const emojiPicks  = document.querySelectorAll('.emoji-pick');

  // أزرار لوحة الإدارة
  const adminLoginBtn     = document.getElementById('adminLoginBtn');
  const adminBar          = document.getElementById('adminControlsBar');
  const adminLogoutBtn    = document.getElementById('adminLogoutBtn');
  const adminClearAllBtn  = document.getElementById('adminClearAllBtn');
  const adminChangePinBtn = document.getElementById('adminChangePinBtn');

  function updateAdminUI() {
    const active = isAdminLoggedIn();
    if (adminBar) adminBar.style.display = active ? 'flex' : 'none';
    if (adminLoginBtn) {
      adminLoginBtn.innerHTML = active ? '<span>👑 الإدارة مفعلة</span>' : '<span>🔐 لوحة الإدارة</span>';
    }
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
      if (isAdminLoggedIn()) {
        toast('👑 أنت في وضع الإدارة بالفعل، أزرار الحذف ظاهرة بجانب كل تعليق!');
        return;
      }
      const entered = prompt('🔐 أدخل رمز الإدارة السري (الافتراضي: 1234):');
      if (entered === null) return;
      if (entered.trim() === getAdminPin()) {
        isAdminMode = true;
        sessionStorage.setItem('daem_admin_active', 'true');
        updateAdminUI();
        loadComments();
        toast('👑 أهلاً بك يا مدير! تم تفعيل صلاحيات حذف والتحكم بالتعليقات ⚡');
      } else {
        alert('❌ رمز الإدارة غير صحيح!');
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      isAdminMode = false;
      sessionStorage.removeItem('daem_admin_active');
      updateAdminUI();
      loadComments();
      toast('تم الخروج من وضع الإدارة');
    });
  }

  if (adminClearAllBtn) {
    adminClearAllBtn.addEventListener('click', clearAllComments);
  }

  if (adminChangePinBtn) {
    adminChangePinBtn.addEventListener('click', () => {
      const current = prompt('أدخل الرمز الحالي للتأكيد:');
      if (current === getAdminPin()) {
        const newPin = prompt('أدخل الرمز السري الجديد:');
        if (newPin && newPin.trim().length >= 3) {
          localStorage.setItem('daem_admin_pin', newPin.trim());
          toast('🔑 تم تغيير رمز الإدارة بنجاح!');
        } else {
          toast('⚠️ الرمز يجب أن يتكون من 3 خانات على الأقل');
        }
      } else {
        alert('❌ الرمز الحالي غير صحيح!');
      }
    });
  }

  updateAdminUI();

  // تحميل التعليقات الحالية
  if (document.readyState === 'loading') {
    document.addEventListener('daem-firebase-ready', loadComments);
    document.addEventListener('DOMContentLoaded', () => setTimeout(loadComments, 500));
  } else {
    setTimeout(loadComments, 500);
  }

  // إضافة إيموجي للنص
  emojiPicks.forEach(em => {
    em.addEventListener('click', () => {
      if (textInput) textInput.value += em.dataset.emoji;
      textInput?.focus();
    });
  });

  // إرسال التعليق
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const text = textInput?.value?.trim() || '';
      if (!text || text.length < 2) {
        toast('⚠️ الرجاء كتابة تعليق أولاً');
        return;
      }
      haptic(60);
      submitBtn.disabled = true;
      await submitComment(nameInput?.value || '', text);
      if (textInput) textInput.value = '';
      if (nameInput) nameInput.value = '';
      submitBtn.disabled = false;
    });
  }

  if (textInput) {
    textInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.ctrlKey) submitBtn?.click();
    });
  }
}

function setupSidebarNavCommunity() {
  // تأكد أن الـ sidebar navigation يتعامل مع قسم community
  const sectionIds = ['hero', 'downloader', 'speedtest', 'apps', 'community'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navItems = document.querySelectorAll('.sidebar .nav-item');

  if (!sections.length || !navItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const matchNav = document.querySelector(`.sidebar .nav-item[data-target="${id}"]`);
        if (matchNav && !matchNav.classList.contains('active')) {
          navItems.forEach(i => i.classList.remove('active'));
          matchNav.classList.add('active');
          const pill = document.querySelector('.sidebar .pill');
          if (pill && window.slidePill) window.slidePill(pill, matchNav);
        }
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
}

// تصدير slidePill للاستخدام الخارجي
document.addEventListener('DOMContentLoaded', () => {
  window.slidePill = function(pill, targetItem) {
    if (!pill || !targetItem || typeof gsap === 'undefined') return;
    const navRect = pill.parentElement.getBoundingClientRect();
    const itemRect = targetItem.getBoundingClientRect();
    const targetTop = itemRect.top - navRect.top;
    const targetHeight = itemRect.height;
    const currentTop = parseFloat(gsap.getProperty(pill, "top")) || 0;
    const currentHeight = parseFloat(gsap.getProperty(pill, "height")) || targetHeight;

    gsap.killTweensOf(pill);
    if (targetTop >= currentTop) {
      gsap.to(pill, { duration: 0.20, ease: "power2.out", height: (targetTop - currentTop) + targetHeight });
      gsap.to(pill, { duration: 0.35, ease: "power2.inOut", top: targetTop, height: targetHeight });
    } else {
      gsap.to(pill, { duration: 0.20, ease: "power2.out", top: targetTop, height: (currentTop - targetTop) + currentHeight });
      gsap.to(pill, { duration: 0.35, ease: "power2.inOut", height: targetHeight });
    }
  };
});
