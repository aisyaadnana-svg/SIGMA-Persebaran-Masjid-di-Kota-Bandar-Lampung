// ============================================================
// SIGMA – script.js
// Sistem Informasi Geografis Masjid Kota Bandar Lampung
// ============================================================

const WARNA_MASJID = {
  'MASJID RAYA'            : '#1a3a6b',
  'MASJID AGUNG'           : '#7b2d8b',
  'MASJID BESAR'           : '#e67e22',
  'MASJID JAMI'            : '#27ae60',
  'MASJID DI TEMPAT PUBLIK': '#e74c3c',
};

let map;
let allMarkers = [];
let allData    = [];
let userMarker = null;

// ============================================================
// 1. INISIALISASI PETA
// ============================================================
function initMap() {
  map = L.map('map', {
    center: [-5.4, 105.27],
    zoom: 13,
    zoomControl: false,
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const osmLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '© OpenStreetMap', maxZoom: 19 }
  );

  const satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: '© Esri', maxZoom: 19 }
  );

  osmLayer.addTo(map);

  L.control.layers(
    { 'OpenStreetMap': osmLayer, 'Satellite': satelliteLayer },
    {},
    { position: 'topright', collapsed: false }
  ).addTo(map);

  const legenda = L.control({ position: 'bottomleft' });
  legenda.onAdd = function () {
    const div = L.DomUtil.create('div', 'legenda');
    div.innerHTML = `
      <h4><i class="fas fa-mosque"></i> Legenda Jenis Masjid</h4>
      ${Object.entries(WARNA_MASJID).map(([jenis, warna]) => `
        <div class="legenda-item">
          <div class="legenda-icon" style="background:${warna}">
            <i class="fas fa-mosque"></i>
          </div>
          <span>${jenis.replace('MASJID ', '')}</span>
        </div>
      `).join('')}
    `;
    return div;
  };
  legenda.addTo(map);
}

// ============================================================
// 2. ICON MARKER — lingkaran tegak, tidak miring
// ============================================================
function buatIcon(jenis) {
  const warna = WARNA_MASJID[jenis] || '#374151';

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: ${warna};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <i class="fas fa-mosque" style="
          color: white;
          font-size: 16px;
        "></i>
      </div>
    `,
    iconSize:    [38, 38],
    iconAnchor:  [19, 19],
    popupAnchor: [0, -22],
  });
}

// ============================================================
// 3. POPUP
// ============================================================
function buatPopup(props) {
  const warna = WARNA_MASJID[props.jenis_masjid] || '#374151';

  const fotoHTML = props.foto
    ? `<img src="${props.foto}" alt="${props.nama_masjid}"
            class="popup-foto"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
       <div class="popup-foto-placeholder" style="display:none">
         <i class="fas fa-mosque"></i><span>Foto belum tersedia</span>
       </div>`
    : `<div class="popup-foto-placeholder">
         <i class="fas fa-mosque"></i><span>Foto belum tersedia</span>
       </div>`;

  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${props.latitude},${props.longitude}`;

  return `
    <div class="popup-masjid">
      ${fotoHTML}
      <span class="popup-badge" style="background:${warna}">${props.jenis_masjid}</span>
      <div class="popup-nama">${props.nama_masjid}</div>
      <div class="popup-info"><i class="fas fa-map-marker-alt"></i><span>${props.alamat}</span></div>
      <div class="popup-info"><i class="fas fa-building"></i><span>Kec. ${props.kecamatan}</span></div>
      <div class="popup-info"><i class="fas fa-calendar"></i><span>Berdiri tahun ${props.tahun_berdiri}</span></div>
      <div class="popup-actions">
        <button class="popup-btn popup-btn-rute" onclick="window.open('${gmapsUrl}','_blank')">
          <i class="fas fa-route"></i> Rute
        </button>
        <button class="popup-btn popup-btn-detail" onclick="showSection('daftar')">
          <i class="fas fa-info-circle"></i> Detail
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// 4. LOAD DATA GEOJSON
// ============================================================
function loadData() {
  fetch('data/masjid_sigma.geojson')
    .then(res => res.json())
    .then(geojson => {
      allData = geojson.features;

      const kecamatanSet = [...new Set(allData.map(f => f.properties.kecamatan))].sort();

      ['filter-kecamatan', 'daftar-filter-kecamatan'].forEach(id => {
        const sel = document.getElementById(id);
        kecamatanSet.forEach(kec => {
          const opt = document.createElement('option');
          opt.value = kec;
          opt.textContent = kec;
          sel.appendChild(opt);
        });
      });

      tampilkanMarkers(allData);
      isiTabel(allData);
    })
    .catch(err => console.error('Gagal load GeoJSON:', err));
}

// ============================================================
// 5. TAMPILKAN MARKER
// ============================================================
function tampilkanMarkers(features) {
  allMarkers.forEach(m => map.removeLayer(m));
  allMarkers = [];

  const hasilList = document.getElementById('hasil-list');
  hasilList.innerHTML = '';

  features.forEach(feature => {
    const props = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    const marker = L.marker([lat, lng], { icon: buatIcon(props.jenis_masjid) });
    marker.bindPopup(buatPopup(props), { maxWidth: 280, className: 'sigma-popup' });
    marker.addTo(map);
    allMarkers.push(marker);

    const item = document.createElement('div');
    item.className = 'hasil-item';
    item.textContent = props.nama_masjid;
    item.onclick = () => { map.setView([lat, lng], 17); marker.openPopup(); };
    hasilList.appendChild(item);
  });

  document.getElementById('hasil-count').textContent = features.length;
}

// ============================================================
// 6. FILTER MARKER
// ============================================================
function filterMarkers() {
  const keyword   = document.getElementById('search-input').value.toLowerCase();
  const kecamatan = document.getElementById('filter-kecamatan').value;

  const checkedJenis = [...document.querySelectorAll(
    '#filter-kategori input[type=checkbox]:checked'
  )].map(cb => cb.value);

  const semua = checkedJenis.includes('semua');

  const filtered = allData.filter(f => {
    const p = f.properties;
    return (
      p.nama_masjid.toLowerCase().includes(keyword) &&
      (kecamatan === 'semua' || p.kecamatan === kecamatan) &&
      (semua || checkedJenis.includes(p.jenis_masjid))
    );
  });

  tampilkanMarkers(filtered);
}

// ============================================================
// 7. TABEL DAFTAR MASJID
// ============================================================
function isiTabel(features) {
  const tbody = document.getElementById('daftar-tbody');
  tbody.innerHTML = '';

  features.forEach((f, i) => {
    const p = f.properties;
    const warna = WARNA_MASJID[p.jenis_masjid] || '#374151';
    const [lng, lat] = f.geometry.coordinates;

    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td><b>${p.nama_masjid}</b></td>
        <td><span class="jenis-badge" style="background:${warna}">${p.jenis_masjid.replace('MASJID ','')}</span></td>
        <td>${p.kecamatan}</td>
        <td style="max-width:200px;font-size:11px">${p.alamat}</td>
        <td>
          <button class="btn-lihat" onclick="lihatDiPeta(${lat},${lng})">
            <i class="fas fa-map-marker-alt"></i> Lihat Peta
          </button>
        </td>
      </tr>
    `;
  });
}

function filterDaftar() {
  const keyword   = document.getElementById('daftar-search').value.toLowerCase();
  const jenis     = document.getElementById('daftar-filter-jenis').value;
  const kecamatan = document.getElementById('daftar-filter-kecamatan').value;

  const filtered = allData.filter(f => {
    const p = f.properties;
    return (
      p.nama_masjid.toLowerCase().includes(keyword) &&
      (jenis === 'semua'     || p.jenis_masjid === jenis) &&
      (kecamatan === 'semua' || p.kecamatan === kecamatan)
    );
  });

  isiTabel(filtered);
}

function lihatDiPeta(lat, lng) {
  showSection('peta');
  setTimeout(() => {
    map.setView([lat, lng], 17);
    const marker = allMarkers.find(m => {
      const pos = m.getLatLng();
      return Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001;
    });
    if (marker) marker.openPopup();
  }, 100);
}

// ============================================================
// 8. MASJID TERDEKAT
// ============================================================
function findNearest() {
  if (!navigator.geolocation) {
    alert('Browser kamu tidak mendukung geolokasi.');
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const userLat = pos.coords.latitude;
    const userLng = pos.coords.longitude;

    if (userMarker) map.removeLayer(userMarker);

    userMarker = L.marker([userLat, userLng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="
          width:18px; height:18px;
          background:#3b82f6; border-radius:50%;
          border:3px solid white;
          box-shadow:0 0 0 4px rgba(59,130,246,0.3)
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })
    }).addTo(map).bindPopup('📍 Lokasi kamu').openPopup();

    let terdekat = null;
    let jarakMin = Infinity;

    allData.forEach(f => {
      const [lng, lat] = f.geometry.coordinates;
      const jarak = map.distance([userLat, userLng], [lat, lng]);
      if (jarak < jarakMin) { jarakMin = jarak; terdekat = { ...f, lat, lng }; }
    });

    if (terdekat) {
      const jarakKm = (jarakMin / 1000).toFixed(2);
      map.setView([terdekat.lat, terdekat.lng], 16);
      const marker = allMarkers.find(m => Math.abs(m.getLatLng().lat - terdekat.lat) < 0.0001);
      if (marker) marker.openPopup();
      alert(`Masjid terdekat:\n\n🕌 ${terdekat.properties.nama_masjid}\n📍 ${terdekat.properties.alamat}\n📏 Jarak: ${jarakKm} km`);
    }
  }, () => {
    alert('Tidak bisa mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
  });
}

// ============================================================
// 9. NAVIGASI SECTION
// ============================================================
function showSection(nama) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  document.getElementById('section-' + nama).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('onclick')?.includes(nama)) a.classList.add('active');
  });
  if (nama === 'peta')   setTimeout(() => map.invalidateSize(), 100);
  if (nama === 'daftar') filterDaftar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('sidebar-hidden');
}

// ============================================================
// 10. JADWAL SHOLAT
// ============================================================
function loadJadwalSholat() {
  const url = 'https://api.aladhan.com/v1/timingsByCity?city=Bandar+Lampung&country=ID&method=11';

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const t   = data.data.timings;
      const tgl = data.data.date.readable;

      document.getElementById('jadwal-tanggal').textContent =
        'Jadwal Sholat — ' + tgl + ' · Bandar Lampung';

      document.getElementById('j-subuh').textContent   = t.Fajr;
      document.getElementById('j-dzuhur').textContent  = t.Dhuhr;
      document.getElementById('j-ashar').textContent   = t.Asr;
      document.getElementById('j-maghrib').textContent = t.Maghrib;
      document.getElementById('j-isya').textContent    = t.Isha;

      const sekarang  = new Date();
      const jamSekarang = sekarang.getHours() * 60 + sekarang.getMinutes();
      const keMenit   = str => { const [h, m] = str.split(':').map(Number); return h * 60 + m; };

      const waktuList = [
        { id: 'j-subuh',   waktu: t.Fajr },
        { id: 'j-dzuhur',  waktu: t.Dhuhr },
        { id: 'j-ashar',   waktu: t.Asr },
        { id: 'j-maghrib', waktu: t.Maghrib },
        { id: 'j-isya',    waktu: t.Isha },
      ];

      let aktifId = waktuList[waktuList.length - 1].id;
      for (const w of waktuList) {
        if (jamSekarang < keMenit(w.waktu)) { aktifId = w.id; break; }
      }

      waktuList.forEach(w => {
        const el = document.getElementById(w.id)?.parentElement;
        if (el) el.classList.toggle('aktif', w.id === aktifId);
      });
    })
    .catch(() => {
      document.getElementById('jadwal-tanggal').textContent = 'Jadwal sholat tidak tersedia';
    });
}
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadData();
  loadJadwalSholat();
  function gantiTab(nama, elBtn) {
  // Sembunyikan semua panel
  document.querySelectorAll('.profil-tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.profil-tab').forEach(b => b.classList.remove('active'));
  // Tampilkan yang dipilih
  document.getElementById('tab-' + nama).classList.add('active');
  elBtn.classList.add('active');
}
});