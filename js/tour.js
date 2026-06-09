const tourSteps = [
  { target: null,            title: "Halo! Aku SIGI! 👋",        message: "Aku maskot SIGMA — Sistem Informasi Geografis Masjid Kota Bandar Lampung. Aku akan temenin kamu keliling semua fitur website ini! Yuk mulai!", position: "center", section: null },
  { target: ".navbar",       title: "Navbar Navigasi",            message: "Ini navbar utama. Kamu bisa pindah ke Beranda, Peta, Data Masjid, dan Profil dari sini.", position: "bottom", section: "beranda" },
  { target: ".landing-badge",title: "Beranda SIGMA",              message: "Di Beranda kamu bisa lihat info singkat SIGMA, jadwal sholat hari ini, dan statistik masjid di Bandar Lampung.", position: "bottom", section: "beranda" },
  { target: ".jadwal-sholat",title: "Jadwal Sholat ⏰",           message: "Kartu ini nampilin jadwal sholat hari ini secara otomatis. Waktu sholat yang paling dekat bakal di-highlight biru!", position: "top", section: "beranda" },
  { target: ".landing-stats",title: "Statistik Masjid 📊",        message: "Ringkasan data — total 25 masjid tersebar di 14 kecamatan dengan 5 kategori berbeda!", position: "top", section: "beranda" },
  { target: ".sidebar",      title: "Filter & Pencarian 🔍",      message: "Di panel kiri ini kamu bisa cari masjid by nama, filter berdasarkan kategori, atau pilih kecamatan tertentu.", position: "right", section: "peta" },
  { target: ".btn-locate",   title: "Masjid Terdekat 📍",         message: "Klik tombol ini untuk otomatis nemuin masjid yang paling dekat dari lokasi kamu sekarang!", position: "right", section: "peta" },
  { target: "#map",          title: "Peta Interaktif 🗺️",         message: "Ini peta utamanya! Zoom in/out, klik marker masjid untuk lihat detail, dan pilih tampilan OpenStreetMap atau Satelit.", position: "left", section: "peta" },
  { target: ".daftar-header",title: "Data Masjid 🕌",             message: "Halaman ini nampilin semua data masjid dalam bentuk tabel. Bisa dicari by nama dan difilter by kategori atau kecamatan!", position: "bottom", section: "daftar" },
  { target: ".daftar-table", title: "Tabel Data Lengkap",         message: "Tiap baris berisi nama, jenis, kecamatan, dan alamat masjid. Klik 'Lihat Peta' untuk langsung zoom ke lokasi masjid di peta!", position: "top", section: "daftar" },
  { target: null,            title: "Siap Jelajah! 🕌✨",          message: "Itu dia semua fitur SIGMA! Klik aku kapan aja kalau mau tour lagi ya.", position: "center", section: null }
];

const sigiTopics = [
  { label: "🗺️ Cara pakai peta",        section: "peta",   msg: "Buka halaman Peta lalu klik marker masjid mana saja untuk lihat detail lengkapnya. Bisa zoom in/out, dan ganti tampilan ke Satelit kalau mau lihat foto udara!" },
  { label: "🔍 Cara filter masjid",      section: "peta",   msg: "Di sidebar kiri halaman Peta ada 3 cara filter: (1) Ketik nama di kotak pencarian, (2) Centang kategori masjid yang mau ditampilkan, (3) Pilih kecamatan dari dropdown." },
  { label: "📋 Cara lihat data masjid",  section: "daftar", msg: "Buka menu Data Masjid di navbar atas. Ada tabel lengkap semua masjid. Klik tombol Lihat Peta di tiap baris untuk langsung zoom ke lokasi masjid itu di peta!" },
  { label: "📍 Cari masjid terdekat",    section: "peta",   msg: "Buka halaman Peta lalu klik tombol biru 'Temukan Masjid Terdekat' di sidebar kiri. Browser akan minta izin lokasi — izinkan ya! Peta otomatis zoom ke masjid terdekat." },
  { label: "👤 Tentang pembuat SIGMA",   section: "profil", msg: "SIGMA dibuat oleh Aisyah Ananda Putri, mahasiswa Pendidikan Geografi FKIP Universitas Lampung, sebagai bagian dari penelitian skripsi persebaran masjid di Kota Bandar Lampung." },
];

let currentStep = 0;
let bubbleEl, overlayEl;
let bubbleOpen = false;

function mochiSVG(w, h) {
  return `<svg viewBox="0 0 100 110" width="${w}" height="${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mb${w}" cx="42%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#93c5fd"/>
        <stop offset="60%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </radialGradient>
      <radialGradient id="mf${w}" cx="45%" cy="38%" r="60%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#f0f7ff"/>
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="106" rx="26" ry="5" fill="#1e40af" opacity="0.18"/>
    <path d="M50 8 C28 8 14 22 12 40 C10 58 16 75 28 86 C34 91 42 95 50 95 C58 95 66 91 72 86 C84 75 90 58 88 40 C86 22 72 8 50 8 Z" fill="url(#mb${w})"/>
    <ellipse cx="38" cy="26" rx="10" ry="7" fill="white" opacity="0.2" transform="rotate(-20 38 26)"/>
    <circle cx="50" cy="52" r="28" fill="url(#mf${w})"/>
    <rect x="38" y="6" width="24" height="6" rx="3" fill="#1e40af" opacity="0.9"/>
    <rect x="43" y="1" width="14" height="7" rx="3" fill="#1d4ed8"/>
    <path d="M50 0 L44 4 L56 4 Z" fill="#60a5fa"/>
    <rect x="47" y="3" width="6" height="4" rx="1" fill="#93c5fd"/>
    <circle cx="41" cy="48" r="5.5" fill="#1e3a8a"/>
    <circle cx="59" cy="48" r="5.5" fill="#1e3a8a"/>
    <circle cx="43" cy="46" r="2" fill="white"/>
    <circle cx="61" cy="46" r="2" fill="white"/>
    <circle cx="42.2" cy="45.2" r="0.9" fill="white"/>
    <circle cx="60.2" cy="45.2" r="0.9" fill="white"/>
    <path d="M42 58 Q50 66 58 58" stroke="#1e3a8a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="36" cy="58" rx="5.5" ry="3.5" fill="#fca5a5" opacity="0.6"/>
    <ellipse cx="64" cy="58" rx="5.5" ry="3.5" fill="#fca5a5" opacity="0.6"/>
    <circle cx="16" cy="56" r="7" fill="#3b82f6"/>
    <circle cx="14" cy="54" r="2" fill="white" opacity="0.3"/>
    <circle cx="84" cy="56" r="7" fill="#3b82f6"/>
    <circle cx="82" cy="54" r="2" fill="white" opacity="0.3"/>
    <ellipse cx="38" cy="93" rx="8" ry="5" fill="#2563eb"/>
    <ellipse cx="62" cy="93" rx="8" ry="5" fill="#2563eb"/>
  </svg>`;
}

function createMascot() {
  const style = document.createElement('style');
  style.textContent = `
    #sigma-overlay {
      position: fixed; inset: 0;
      background: rgba(5,15,50,0.55);
      z-index: 9990; transition: opacity 0.3s;
      pointer-events: none;
    }

    #sigma-wrap {
      position: fixed;
      bottom: 24px; right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 14px;
      pointer-events: none;
    }

    #sigma-bubble {
      pointer-events: auto;
      background: white;
      border-radius: 20px 20px 6px 20px;
      padding: 22px 24px 18px;
      max-width: 320px; min-width: 260px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.2);
      border: 1.5px solid #dbeafe;
      opacity: 0; transform: scale(0.8) translateY(10px);
      transition: opacity 0.3s, transform 0.3s;
      position: relative;
      pointer-events: none;
    }
    #sigma-bubble.open {
      opacity: 1; transform: scale(1) translateY(0);
      pointer-events: auto;
    }
    #sigma-bubble.center-mode {
      position: fixed;
      bottom: auto; right: auto;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      border-radius: 24px;
      max-width: 400px; min-width: 300px;
      padding: 28px 32px 22px;
    }
    #sigma-bubble.center-mode.open {
      transform: translate(-50%, -50%) scale(1);
    }

    .bub-mochi { display:none; justify-content:center; margin-bottom:14px; animation: sigiFloat 3s ease-in-out infinite; }
    .bub-mochi.show { display:flex; }

    .bub-progress { height:4px; background:#e2e8f0; border-radius:99px; margin-bottom:16px; overflow:hidden; }
    .bub-bar { height:100%; background:linear-gradient(90deg,#3b82f6,#60a5fa); border-radius:99px; transition:width 0.4s; }

    .bub-title { font-family:'Poppins',sans-serif; font-size:17px; font-weight:700; color:#0f2557; margin-bottom:10px; }
    .bub-msg   { font-family:'Poppins',sans-serif; font-size:14px; color:#475569; line-height:1.7; margin-bottom:18px; }
    .bub-nav   { display:flex; justify-content:space-between; align-items:center; }
    .bub-step  { font-family:'Poppins',sans-serif; font-size:12px; color:#94a3b8; }
    .bub-btns  { display:flex; gap:8px; }
    .bub-btn   { font-family:'Poppins',sans-serif; font-size:13px; font-weight:600; border:none; border-radius:10px; padding:9px 18px; cursor:pointer; transition:all 0.2s; }
    .bub-skip  { background:#f1f5f9; color:#64748b; }
    .bub-skip:hover { background:#e2e8f0; }
    .bub-next  { background:linear-gradient(135deg,#3b82f6,#1d4ed8); color:white; box-shadow:0 4px 12px rgba(59,130,246,0.4); }
    .bub-next:hover { opacity:0.9; transform:translateY(-1px); }
    .sigi-topic-btn {
      background: #eff6ff;
      color: #1e40af;
      border: 1.5px solid #bfdbfe;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      font-family: 'Poppins', sans-serif;
      width: 100%;
    }
    .sigi-topic-btn:hover {
      background: #dbeafe;
      border-color: #93c3fd;
      transform: translateX(4px);
    }

    #sigma-close {
      position:absolute; top:-10px; right:-10px;
      width:26px; height:26px;
      background:#ef4444; color:white;
      border-radius:50%; border:2.5px solid white;
      font-size:12px; cursor:pointer;
      display:none; align-items:center; justify-content:center;
      font-family:'Poppins',sans-serif; font-weight:700;
      box-shadow:0 2px 8px rgba(239,68,68,0.35);
    }
    #sigma-close.show { display:flex; }

    #sigma-char {
      pointer-events: auto;
      width: 110px; height: 110px;
      cursor: pointer;
      filter: drop-shadow(0 8px 24px rgba(59,130,246,0.5));
      animation: sigiFloat 3.5s ease-in-out infinite;
      flex-shrink: 0;
      transition: transform 1.2s cubic-bezier(0.34,1.56,0.64,1);
    }
    #sigma-char:hover {
      transform: scale(1.12) rotate(-6deg) !important;
      animation-play-state: paused;
    }

    @keyframes sigiFloat {
      0%,100% { transform: translateY(0) rotate(0deg); }
      35%      { transform: translateY(-12px) rotate(-3deg); }
      65%      { transform: translateY(-6px) rotate(2deg); }
    }

    .sigma-hl {
      outline: 3px solid #3b82f6 !important;
      outline-offset: 6px !important;
      border-radius: 10px !important;
      position: relative !important;
      z-index: 9997 !important;
      transition: all 0.3s !important;
    }
  `;
  document.head.appendChild(style);

  overlayEl = document.createElement('div');
  overlayEl.id = 'sigma-overlay';
  overlayEl.style.opacity = '0';
  document.body.appendChild(overlayEl);

  const wrap = document.createElement('div');
  wrap.id = 'sigma-wrap';
  wrap.innerHTML = `
    <div id="sigma-bubble">
      <div id="sigma-close" onclick="sigiClose()">✕</div>
      <div class="bub-mochi" id="bub-mochi">${mochiSVG(80, 80)}</div>
      <div class="bub-progress"><div class="bub-bar" id="bub-bar" style="width:0%"></div></div>
      <div class="bub-title" id="bub-title"></div>
      <div class="bub-msg"   id="bub-msg"></div>
      <div class="bub-nav">
        <span class="bub-step" id="bub-step"></span>
        <div class="bub-btns">
          <button class="bub-btn bub-skip" id="bub-skip" onclick="sigiClose()">Lewati</button>
          <button class="bub-btn bub-next" id="bub-next" onclick="sigiNext()">Mulai ▶</button>
        </div>
      </div>
    </div>
    <div id="sigma-char" onclick="sigiToggle()" title="Klik untuk panduan!">${mochiSVG(110, 110)}</div>
  `;
  document.body.appendChild(wrap);
  bubbleEl = document.getElementById('sigma-bubble');

  // SIGI muncul besar dulu lalu mengecil ke ukuran normal
  const charEl = document.getElementById('sigma-char');
  charEl.style.transform = 'scale(2.8)';

  setTimeout(() => {
    charEl.style.transform = 'scale(1)';
    setTimeout(() => sigiShow(0), 700);
  }, 1600);
}

function sigiShow(index) {
  currentStep = index;
  const step   = tourSteps[index];
  const isLast  = index === tourSteps.length - 1;
  const isFirst = index === 0;

  sigiClearHL();

  if (step.section && typeof showSection === 'function') showSection(step.section);

  // Kembalikan tombol skip & next ke perilaku tour normal
  const skipEl = document.getElementById('bub-skip');
  const nextEl = document.getElementById('bub-next');
  if (skipEl) { skipEl.textContent = 'Lewati'; skipEl.onclick = sigiClose; }
  if (nextEl) { nextEl.onclick = sigiNext; }

  setTimeout(() => {
    document.getElementById('bub-title').textContent = step.title;
    document.getElementById('bub-msg').textContent   = step.message;
    document.getElementById('bub-step').textContent  = `${index + 1} / ${tourSteps.length}`;
    document.getElementById('bub-next').textContent  = isFirst ? 'Mulai ▶' : isLast ? 'Selesai ✓' : 'Lanjut ▶';
    document.getElementById('bub-bar').style.width   = (index / (tourSteps.length - 1) * 100) + '%';

    const mochiEl = document.getElementById('bub-mochi');
    const closeEl = document.getElementById('sigma-close');

    if (step.position === 'center') {
      bubbleEl.classList.add('center-mode');
      mochiEl.classList.add('show');
      overlayEl.style.opacity = '1';
      overlayEl.style.pointerEvents = 'auto';
      closeEl.classList.add('show');
    } else {
      bubbleEl.classList.remove('center-mode');
      mochiEl.classList.remove('show');
      overlayEl.style.opacity = '0';
      overlayEl.style.pointerEvents = 'none';
      closeEl.classList.remove('show');

      if (step.target) {
        const el = document.querySelector(step.target);
        if (el) {
          el.classList.add('sigma-hl');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          overlayEl.style.opacity = '1';
          overlayEl.style.pointerEvents = 'auto';
          closeEl.classList.add('show');
        }
      }
    }

    bubbleOpen = true;
    bubbleEl.classList.add('open');
  }, step.section ? 260 : 0);
}

function sigiNext() {
  sigiClearHL();
  if (currentStep >= tourSteps.length - 1) { sigiDone(); return; }
  sigiShow(currentStep + 1);
}

function sigiClose() {
  sigiClearHL();
  bubbleEl.classList.remove('open');
  bubbleEl.classList.remove('center-mode');
  overlayEl.style.opacity = '0';
  overlayEl.style.pointerEvents = 'none';
  document.getElementById('sigma-close').classList.remove('show');
  bubbleOpen = false;
}

function sigiDone() {
  sigiClearHL();
  bubbleEl.classList.remove('open');
  bubbleEl.classList.remove('center-mode');
  overlayEl.style.opacity = '0';
  overlayEl.style.pointerEvents = 'none';
  document.getElementById('sigma-close').classList.remove('show');
  bubbleOpen = false;

  // Setelah tour selesai, muncul menu bantuan
  setTimeout(() => sigiTanya(), 700);
}

function sigiTanya() {
  const topicButtons = sigiTopics.map((t, i) =>
    `<button class="bub-btn sigi-topic-btn" onclick="sigiJawab(${i})">${t.label}</button>`
  ).join('');

  document.getElementById('bub-title').textContent = 'Ada yang bisa SIGI bantu? 😊';
  document.getElementById('bub-msg').innerHTML = `
    <div style="margin-bottom:12px;font-size:13px;color:#64748b">
      Pilih topik yang masih membingungkan:
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${topicButtons}
    </div>
  `;

  document.getElementById('bub-step').textContent  = '';
  document.getElementById('bub-bar').style.width   = '100%';
  document.getElementById('bub-mochi').classList.add('show');
  document.getElementById('sigma-close').classList.add('show');

  const skipEl = document.getElementById('bub-skip');
  const nextEl = document.getElementById('bub-next');
  if (skipEl) { skipEl.textContent = 'Tutup'; skipEl.onclick = sigiClose; }
  if (nextEl) { nextEl.textContent = 'Tour Lagi 🔄'; nextEl.onclick = () => sigiShow(0); }

  bubbleEl.classList.add('center-mode');
  bubbleEl.classList.add('open');
  overlayEl.style.opacity = '1';
  overlayEl.style.pointerEvents = 'auto';
  bubbleOpen = true;
}

function sigiJawab(index) {
  const topik = sigiTopics[index];

  if (topik.section && typeof showSection === 'function') showSection(topik.section);

  setTimeout(() => {
    document.getElementById('bub-title').textContent = topik.label;
    document.getElementById('bub-msg').innerHTML = `
      <div style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:4px">
        ${topik.msg}
      </div>
    `;
    document.getElementById('bub-mochi').classList.remove('show');
    bubbleEl.classList.remove('center-mode');

    const skipEl = document.getElementById('bub-skip');
    const nextEl = document.getElementById('bub-next');
    if (skipEl) { skipEl.textContent = '← Kembali'; skipEl.onclick = sigiTanya; }
    if (nextEl) { nextEl.textContent = 'Tutup ✕'; nextEl.onclick = sigiClose; }
  }, 200);
}

function sigiToggle() {
  if (bubbleOpen) {
    sigiClose();
  } else {
    sigiTanya();
  }
}

function sigiClearHL() {
  document.querySelectorAll('.sigma-hl').forEach(el => el.classList.remove('sigma-hl'));
}

document.addEventListener('DOMContentLoaded', createMascot);