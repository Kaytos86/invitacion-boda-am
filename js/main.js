// =========== CONFIGURACIÓN ==========
const weddingDate = new Date('2025-11-22T20:00:00-06:00');
const whatsappNumber = '529993572727';

// =========== CONTADOR REGRESIVO ==========
const timerElement = document.getElementById('timer');
if (timerElement) {
  const countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = weddingDate - now;
    if (diff < 0) {
      timerElement.innerHTML = '<span class="countdown__finished">¡Llegó el gran día!</span>';
      clearInterval(countdownInterval);
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    timerElement.innerHTML = `
      <div class="countdown__timer-box"><span>${d}</span><span>Días</span></div>
      <div class="countdown__timer-box"><span>${h}</span><span>Horas</span></div>
      <div class="countdown__timer-box"><span>${m}</span><span>Minutos</span></div>
      <div class="countdown__timer-box"><span>${s}</span><span>Segundos</span></div>
    `;
  }, 1000);
}

// =========== LÓGICA GENERAL AL CARGAR LA PÁGINA ==========
document.addEventListener('DOMContentLoaded', function() {

  // =========== PARALLAX HERO ==========
  const parallaxBg = document.querySelector('.hero__parallax-bg');
  if (parallaxBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
        const offset = window.scrollY;
        parallaxBg.style.transform = `translateY(${offset * 0.33}px)`;
    }, { passive: true });
  }

  // === INICIALIZAR REPRODUCTOR DE MÚSICA ===
  setupAudioPlayer();

  // === INICIALIZACIÓN DE OTRAS LIBRERÍAS (AOS, SWIPER) ===
  if (window.AOS) {
    AOS.init({ duration: 600, once: true });
  }
  if (window.Swiper && document.querySelector('.gallery-swiper')) {
    new Swiper('.gallery-swiper', {
      loop: true,
      grabCursor: true,
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
  }
}); 

// =========== REPRODUCTOR DE AUDIO (FUNCIÓN ÚNICA Y CORRECTA) ==========
function setupAudioPlayer() {
    const audioPlayer = document.getElementById('audio-boda');
    const playPauseBtn = document.getElementById('newPlayPauseBtn');
    const iconPlay = playPauseBtn?.querySelector('.icon-play');
    const iconPause = playPauseBtn?.querySelector('.icon-pause');
    const seekBar = document.getElementById('seekBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const totalDurationDisplay = document.getElementById('totalDurationDisplay');
    const musicCard = document.getElementById('music-card');

    if (!audioPlayer || !playPauseBtn || !seekBar || !currentTimeDisplay || !totalDurationDisplay || !musicCard) return;

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    const setAudioData = () => {
        totalDurationDisplay.textContent = formatTime(audioPlayer.duration);
        seekBar.max = audioPlayer.duration;
    };

    audioPlayer.addEventListener('loadedmetadata', setAudioData);
    audioPlayer.addEventListener('timeupdate', () => {
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        seekBar.value = audioPlayer.currentTime;
    });

    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play().catch(e => console.error("Error al reproducir audio:", e));
        } else {
            audioPlayer.pause();
        }
    });

    audioPlayer.onplaying = () => {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        playPauseBtn.setAttribute('aria-pressed', 'true');
        musicCard.classList.add('playing');
    };

    audioPlayer.onpause = () => {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        playPauseBtn.setAttribute('aria-pressed', 'false');
        musicCard.classList.remove('playing');
    };

    seekBar.addEventListener('input', () => {
        audioPlayer.currentTime = seekBar.value;
    });
}

// =========== LIGHTBOX ACCESIBLE ==========
(function () {
  const container = document.querySelector('.gallery-swiper'); // Actualizado para el carrusel
  if (!container) return;
  const dlg = document.getElementById('lightbox');
  if (!dlg) return;
  const imgEl = dlg.querySelector('.lb__img');
  const btnPrev = dlg.querySelector('.lb__prev');
  const btnNext = dlg.querySelector('.lb__next');
  let items = [];
  let idx = 0;

  function updateItems() {
      items = Array.from(container.querySelectorAll('a[data-lightbox]'));
  }
  
  function show(i) {
    idx = (i + items.length) % items.length;
    imgEl.src = items[idx].href;
    imgEl.alt = items[idx].querySelector('img')?.alt || '';
    if (!dlg.open) dlg.showModal();
  }

  container.addEventListener('click', (ev) => {
    updateItems();
    const anchor = ev.target.closest('a[data-lightbox]');
    if (!anchor) return;
    ev.preventDefault();
    const i = items.findIndex(it => it === anchor);
    if (i >= 0) show(i);
  });
  
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.querySelector('.lb__close').addEventListener('click', () => dlg.close());
  btnPrev.addEventListener('click', () => show(idx - 1));
  btnNext.addEventListener('click', () => show(idx + 1));
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dlg.close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

// =========== FORMULARIO RSVP ==========
(function(){
  const form = document.getElementById('rsvpForm');
  if (!form) return;
  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const name = form.querySelector('#guestName')?.value.trim();
    if (name.length < 2){
      alert('Por favor, ingresa tu nombre.');
      return;
    }
    const encoded = encodeURIComponent(`Hola, soy ${name}. Confirmo mi asistencia a la boda.`);
    const waUrl = `https://wa.me/${form.dataset.wa || whatsappNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
  });
})();

// =========== CARGA DEL MAPA ==========
(function () {
  const box = document.getElementById('map');
  const btn = box?.querySelector('.map__cta');
  if (!box || !btn) return;
  btn.addEventListener('click', () => {
    const src = box.getAttribute('data-map-src');
    if (!src || box.querySelector('iframe')) return;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = 'Mapa de ubicación';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    box.innerHTML = '';
    box.appendChild(iframe);
  });
})();

// =========== COPIAR AL PORTAPAPELES PARA REGALOS ==========
(function() {
  const copyButtons = document.querySelectorAll('.copy-button');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const textToCopy = button.getAttribute('data-copy');
      
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          button.classList.add('copied');
          setTimeout(() => {
            button.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Error al copiar texto: ', err);
          alert('No se pudo copiar el texto.');
        });
      } else {
        alert('La función de copiar no está disponible en conexiones no seguras (HTTP).');
      }
    });
  });
})();
