document.addEventListener("DOMContentLoaded", function () {
  
  // 1. TAMPILKAN NAMA TAMU DARI URL PARAMETER (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName) {
    document.getElementById('guestNameDisplay').textContent = guestName;
  }

  // 2. MUSIK & BUKA COVER
  const audio = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicToggle');
  const openBtn = document.getElementById('openInvitation');
  const cover = document.getElementById('coverOverlay');
  let isPlaying = false;

  function toggleMusic() {
    if (isPlaying) {
      audio.pause();
      musicBtn.textContent = '🔇';
    } else {
      audio.play().catch(e => console.log("Autoplay ditolak browser:", e));
      musicBtn.textContent = '🔊';
    }
    isPlaying = !isPlaying;
  }

  openBtn.addEventListener('click', function () {
    cover.classList.add('hidden');
    toggleMusic(); // Putar musik saat tombol diklik
  });

  musicBtn.addEventListener('click', toggleMusic);

  // 3. COUNTDOWN TIMER (20 Desember 2026)
  const targetDate = new Date("Dec 20, 2026 08:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
      document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
      document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 4. RSVP & UCAPAN (LOCAL STORAGE DEMO)
  const wishesContainer = document.getElementById('wishesContainer');
  const rsvpForm = document.getElementById('rsvpForm');

  // Load ucapan bawaan/tersimpan
  const defaultWishes = [
    { nama: "Budi Santoso", kehadiran: "Hadir", ucapan: "Selamat ya LANCE & ODETTE! Semoga menjadi keluarga sakinah mawaddah warahmah." },
    { nama: "Siti Rahma", kehadiran: "Hadir", ucapan: "Lancar sampai hari H yaa guys!" }
  ];

  function renderWishes() {
    const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || defaultWishes;
    wishesContainer.innerHTML = '';
    wishes.slice().reverse().forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong class="small">${escapeHtml(item.nama)}</strong>
          <span class="badge ${item.kehadiran === 'Hadir' ? 'bg-success' : 'bg-secondary'}" style="font-size:0.65rem">${item.kehadiran}</span>
        </div>
        <p class="small text-muted mb-0">${escapeHtml(item.ucapan || '-')}</p>
      `;
      wishesContainer.appendChild(card);
    });
  }

  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const kehadiran = document.getElementById('kehadiran').value;
    const ucapan = document.getElementById('ucapan').value.trim();

    if (nama && kehadiran) {
      const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || defaultWishes;
      wishes.push({ nama, kehadiran, ucapan });
      localStorage.setItem('weddingWishes', JSON.stringify(wishes));

      renderWishes();
      rsvpForm.reset();
      alert('Terima kasih! Konfirmasi kehadiran Anda berhasil dikirim.');
    }
  });

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  renderWishes();
});

// 5. HELPER: SALIN REKENING
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toastEl = document.getElementById('copyToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  });
}

// 6. HELPER: ADD TO GOOGLE CALENDAR
function addToCalendar(title, startIso, location) {
  const startDate = startIso.replace(/-|:|\.\d\d\d/g, "");
  const endDate = startDate; // Durasi cepat
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(location)}`;
  window.open(googleUrl, '_blank');
}

// 7. HELPER: LIGHTBOX FOTO
function openLightbox(imgUrl) {
  document.getElementById('lightboxImg').src = imgUrl;
  const modal = new bootstrap.Modal(document.getElementById('lightboxModal'));
  modal.show();
}