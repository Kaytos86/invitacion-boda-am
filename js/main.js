// =========== CONFIGURACIÓN ==========
// 20:00 CDMX (UTC-06) para alinear con itinerario nocturno
const weddingDate = new Date('2025-11-22T20:00:00-06:00');
// Formato recomendado: 52 + 10 dígitos (ejemplo)
const whatsappNumber = '529993572727';
const novia = 'Monserrat';
const novio = 'Alejandro';

// =========== CACHING DE ELEMENTOS DEL DOM (CONTADOR) ==========
const timerElement = document.getElementById('timer');
let countdownIntervalId = null;

// =========== CONTADOR REGRESIVO ==========
function updateCountdown() {
  if (!timerElement) return;
  const now = new Date();
  const diff = weddingDate - now;
  if (diff < 0) {
    timerElement.innerHTML = '<span class="countdown__finished">¡Es hoy! ¡Nos vemos en la boda!</span>';
    if (countdownIntervalId) clearInterval(countdownIntervalId);
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  timerElement.innerHTML = `
    <div class="countdown__timer-box"><span class="countdown__timer-number">${days}</span><span class="countdown__timer-label">Días</span></div>
    <div class="countdown__timer-box"><span class="countdown__timer-number">${hours}</span><span class="countdown__timer-label">Horas</span></div>
    <div class="countdown__timer-box"><span class="countdown__timer-number">${minutes}</span><span class="countdown__timer-label">Minutos</span></div>
    <div class="countdown__timer-box"><span class="countdown__timer-number">${seconds}</span><span class="countdown__timer-label">Segundos</span></div>
  `;
}

if (timerElement) {
  countdownIntervalId = setInterval(updateCountdown, 1000);
  updateCountdown(); // Llamada inicial para que no espere 1 segundo
}

document.addEventListener('DOMContentLoaded', function() {

  // =========== PARALLAX HERO ==========
  const parallaxBg = document.querySelector('.hero__parallax-bg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (parallaxBg && !reduceMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollOffset = window.scrollY;
          if (scrollOffset < window.innerHeight * 1.5) {
            const offset = scrollOffset * 0.33;
            parallaxBg.style.transform = `translateY(${offset}px) scale(1.02)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // === CÓDIGO ACTUALIZADO PARA EL REPRODUCTOR DE MÚSICA PERSONALIZADO ===
  const audioPlayer = document.getElementById('audio-boda');
  const newPlayPauseBtn = document.getElementById('newPlayPauseBtn');
  const iconPlay = newPlayPauseBtn ? newPlayPauseBtn.querySelector('.icon-play') : null;
  const iconPause = newPlayPauseBtn ? newPlayPauseBtn.querySelector('.icon-pause') : null;
  const seekBar = document.getElementById('seekBar');
  const currentTimeDisplay = document.getElementById('currentTimeDisplay');
  const totalDurationDisplay = document.getElementById('totalDurationDisplay');
  let isAudioPlaying = false;
  let hasAttemptedPlay = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) {
        return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  if (audioPlayer && newPlayPauseBtn && iconPlay && iconPause && seekBar && currentTimeDisplay && totalDurationDisplay) {

    const setAudioData = () => {
      if (isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        totalDurationDisplay.textContent = formatTime(audioPlayer.duration);
        seekBar.max = audioPlayer.duration;
        seekBar.step = 1;
      } else {
        totalDurationDisplay.textContent = "0:00";
      }
    };

    audioPlayer.addEventListener('canplaythrough', setAudioData);
    audioPlayer.addEventListener('loadedmetadata', setAudioData);
    audioPlayer.addEventListener('durationchange', setAudioData);

    if (audioPlayer.readyState >= 1 && isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        setAudioData();
    }

    audioPlayer.addEventListener('timeupdate', () => {
      if (isFinite(audioPlayer.currentTime)) {
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        seekBar.value = audioPlayer.currentTime;
      }
    });

    function togglePlay() {
      if (!hasAttemptedPlay && audioPlayer.readyState < 1) { 
        audioPlayer.load();
        hasAttemptedPlay = true;
      }
      if (isAudioPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play().catch(error => {
          console.warn("Reproducción bloqueada por el navegador:", error);
        });
      }
    }

    newPlayPauseBtn.addEventListener('click', togglePlay);
    newPlayPauseBtn.addEventListener('keydown', (ev) => {
      if (ev.code === 'Space' || ev.code === 'Enter') {
        ev.preventDefault();
        togglePlay();
      }
    });

    audioPlayer.onplaying = () => {
        isAudioPlaying = true;
        if(iconPlay) iconPlay.style.display = 'none';
        if(iconPause) iconPause.style.display = 'block';
        if(newPlayPauseBtn) {
          newPlayPauseBtn.setAttribute('aria-label', 'Pausar música');
          newPlayPauseBtn.setAttribute('aria-pressed', 'true');
        }
        setAudioData();
    };

    audioPlayer.onpause = () => {
        isAudioPlaying = false;
        if(iconPlay) iconPlay.style.display = 'block';
        if(iconPause) iconPause.style.display = 'none';
        if(newPlayPauseBtn) {
          newPlayPauseBtn.setAttribute('aria-label', 'Reproducir música');
          newPlayPauseBtn.setAttribute('aria-pressed', 'false');
        }
    };

    seekBar.addEventListener('input', () => {
      if (isFinite(audioPlayer.duration)) {
        audioPlayer.currentTime = parseFloat(seekBar.value) || 0;
      }
    });

    audioPlayer.addEventListener('ended', () => {
        if (audioPlayer.loop) {
            isAudioPlaying = true;
            if(iconPlay) iconPlay.style.display = 'none';
            if(iconPause) iconPause.style.display = 'block';
        } else {
            isAudioPlaying = false;
            if(iconPlay) iconPlay.style.display = 'block';
            if(iconPause) iconPause.style.display = 'none';
            if(newPlayPauseBtn) {
              newPlayPauseBtn.setAttribute('aria-label', 'Reproducir música');
              newPlayPauseBtn.setAttribute('aria-pressed', 'false');
            }
        }
    });

    document.addEventListener("visibilitychange", function() {
      if (document.hidden && isAudioPlaying) {
        audioPlayer.pause();
      }
    });

  } else {
    console.warn("No se encontraron todos los elementos del reproductor de audio personalizado para inicializar.");
  }
}); 

// === Player: recuerda volumen, sin auto-play ===
(function(){
  const audio = document.getElementById('audio-boda');
  if (!audio) return;
  // Restaurar volumen si existiera
  try {
    const savedVol = localStorage.getItem('boda-vol');
    if (savedVol !== null) audio.volume = Math.min(1, Math.max(0, parseFloat(savedVol)));
  } catch(e){}

  // Guardar volumen al cambiar (no auto-play)
  audio.addEventListener('volumechange', ()=>{
    try { localStorage.setItem('boda-vol', String(audio.volume)); } catch(e){}
  });
})();


// Theme helper (opcional, no invade nada existente)
window.setTheme = function(themeName /* "claro" | "profundo" */) {
  document.documentElement.setAttribute('data-theme', themeName);
  try { localStorage.setItem('theme', themeName); } catch(e){}
};
// Autocarga tema guardado
(function(){
  try {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  } catch(e){}
})();

// === Lightbox accesible (sin librerías) ===
(function () {
  const container = document.querySelector('.gallery.grid');
  if (!container) return;

  const candidates = Array.from(container.querySelectorAll('a[data-lightbox], img'));

  let dlg = document.getElementById('lightbox');
  if (!dlg) {
    dlg = document.createElement('dialog');
    dlg.id = 'lightbox';
    dlg.innerHTML = `
      <div class="lb__frame">
        <button class="lb__close" aria-label="Cerrar (Esc)">✕</button>
        <button class="lb__prev" aria-label="Anterior">‹</button>
        <img class="lb__img" alt="" tabindex="-1">
        <button class="lb__next" aria-label="Siguiente">›</button>
      </div>`;
    document.body.appendChild(dlg);
  }
  const imgEl  = dlg.querySelector('.lb__img');
  const btnX   = dlg.querySelector('.lb__close');
  const btnPrev= dlg.querySelector('.lb__prev');
  const btnNext= dlg.querySelector('.lb__next');

  let idx = 0;
  const items = candidates.map(el => {
    const anchor = el.matches('a[data-lightbox]') ? el : el.closest('a[data-lightbox]');
    const thumb  = el.matches('img') ? el : el.querySelector('img');
    const full   = (anchor && anchor.getAttribute('href')) || (thumb && (thumb.dataset.full || thumb.src)) || '';
    const alt    = (thumb && thumb.getAttribute('alt')) || '';
    return { anchor: anchor || thumb, full, alt };
  }).filter(i => !!i.full);

  function show(i) {
    idx = (i + items.length) % items.length;
    imgEl.src = items[idx].full;
    imgEl.alt = items[idx].alt || '';
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') {
        dlg.showModal();
      } else {
        dlg.setAttribute('role','dialog');
        dlg.setAttribute('aria-modal','true');
        if (typeof dlg.show === 'function') {
          dlg.show(); // fallback no modal
        } else {
          dlg.setAttribute('open',''); // último recurso
        }
      }
    }
    items[idx].anchor.focus({preventScroll:true});
  }

  container.addEventListener('click', (ev) => {
    const target = ev.target.closest('a[data-lightbox], img');
    if (!target) return;
    ev.preventDefault();
    const i = items.findIndex(it => it.anchor === target || it.anchor.contains(target));
    if (i >= 0) show(i);
  });

  btnX.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); 

  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });

  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dlg.close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

// RSVP individual: validación + estados (sin registro en Sheet)
(function(){
  const form = document.getElementById('rsvpForm');
  if (!form) return;
  const msgEl = document.getElementById('rsvpMsg');
  const btn   = form.querySelector('button[type="submit"], .rsvp__button') || null;

  const setMsg = (type, text)=>{
    if (!msgEl) return;
    msgEl.hidden = false; msgEl.textContent = text;
    msgEl.classList.remove('form__msg--ok','form__msg--err');
    msgEl.classList.add(type === 'ok' ? 'form__msg--ok' : 'form__msg--err');
    // Accesibilidad: llevar el foco al mensaje (aria-live)
    msgEl.tabIndex = -1;
    msgEl.focus({ preventScroll: true });
  };
  const setLoading = on => { if (btn) btn.classList.toggle('is-loading', !!on); };
  const fieldError = (el, on) => {
    const holder = el.closest('.field') || el;
    holder.classList.toggle('field--error', !!on);
    // Accesibilidad: marcar/desmarcar error en el propio control
    el.setAttribute('aria-invalid', on ? 'true' : 'false');
  };

  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    if (msgEl){ msgEl.hidden = true; msgEl.textContent = ''; }
    setLoading(true);

    // Versión tolerante que acepta guestName o nombre
    const name  = (form.querySelector('#guestName,[name="guestName"],[name="nombre"],#nombre')||{}).value?.trim() || '';
    const nameEl= form.querySelector('#guestName,[name="guestName"],[name="nombre"],#nombre');
    const phone = (form.querySelector('[name="telefono"],#telefono')||{}).value?.trim() || '';
    const note  = (form.querySelector('[name="mensaje"],#mensaje')||{}).value?.trim() || '';
    
    if (nameEl) fieldError(nameEl,false);
    if (name.length < 2){
      if (nameEl) fieldError(nameEl,true);
      setMsg('err','Por favor escribe tu nombre (mínimo 2 letras).');
      setLoading(false); return;
    }

    const resumen = `Hola, soy ${name}. Confirmo mi asistencia${phone?` | Tel: ${phone}`:''}${note?` | Mensaje: ${note}`:''}.`;
    const encoded = encodeURIComponent(resumen);
    const waNum   = form.dataset.wa || (typeof whatsappNumber!=='undefined' ? whatsappNumber : '');
    const waUrl   = `https://wa.me/${waNum}?text=${encoded}`;

    const w = window.open(waUrl,'_blank');
    if (w) {
      w.opener = null;
      setMsg('ok','¡Gracias! Abriendo WhatsApp para confirmar…');
      form.reset();
      setTimeout(()=>{ if (msgEl) msgEl.hidden = true; }, 3000);
    } else {
      setMsg('ok','Si no se abrió WhatsApp, por favor habilita ventanas emergentes y vuelve a intentar.');
    }
    
    setLoading(false);
  });
})();

// Mapa: tap-to-load (inyecta iframe solo al pedirlo)
(function () {
  const box = document.getElementById('map');
  if (!box) return;
  const src = box.getAttribute('data-map-src');
  const btn = box.querySelector('.map__cta');

  function loadMap() {
    if (!src || box.querySelector('iframe')) return;
    const ifr = document.createElement('iframe');
    ifr.title = 'Mapa: Hacienda El Gran Chaparral';
    ifr.width = '100%';
    ifr.height = '360';
    ifr.style.border = '0';
    ifr.loading = 'lazy';
    ifr.referrerPolicy = 'no-referrer-when-downgrade';
    ifr.allowFullscreen = true;
    ifr.src = src;
    box.innerHTML = '';
    box.appendChild(ifr);
  }

  btn?.addEventListener('click', loadMap);
})();

// JS – Inicializaciones en idle (AOS/Swiper)
(function () {
  const idle = fn => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1000 }) : setTimeout(fn, 150));
  idle(() => {
    if (window.AOS && document.querySelector('[data-aos]')) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      AOS.init({ duration: 550, once: true, disable: reduce });
    }
    if (typeof Swiper !== 'undefined' && document.querySelector('.gallery-swiper')) {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cfg = {
        loop: true, effect: 'slide', grabCursor: true,
        spaceBetween: 24, slidesPerView: 1, centeredSlides: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        autoplay: { delay: 4000, disableOnInteraction: false },
        breakpoints: { 700: { slidesPerView: 2, spaceBetween: 28 }, 1000: { slidesPerView: 3, spaceBetween: 32 } }
      };
      if (reduce) { delete cfg.autoplay; cfg.speed = 0; }
      new Swiper('.gallery-swiper', cfg);
    }
  });
})();

// === Accesibilidad: lightbox, player y seekbar ===
(function(){
  // --- Lightbox: foco a la imagen al abrir y restaurar al cerrar (JS-only) ---
  const dlg = document.getElementById('lightbox');
  const img = dlg?.querySelector('.lb__img');
  if (dlg && img) {
    // Asegura que la imagen sea “focusable”
    if (!img.hasAttribute('tabindex')) img.setAttribute('tabindex', '-1');

    let lastActive = null;
    const focusImage = () => {
      lastActive = document.activeElement;
      // da un tick para asegurar que open=true ya aplicó
      setTimeout(() => { try { img.focus({ preventScroll: true }); } catch(_){} }, 0);
    };
    const restoreFocus = () => {
      try { lastActive && lastActive.focus({ preventScroll: true }); } catch(_){}
    };

    // Monkey-patch show/showModal para invocar focus
    ['show','showModal'].forEach(fn => {
      if (typeof dlg[fn] === 'function') {
        const orig = dlg[fn].bind(dlg);
        dlg[fn] = function(...args){
          const ret = orig(...args);
          focusImage();
          return ret;
        };
      }
    });
    // Fallback: observa el atributo 'open'
    new MutationObserver(muts => {
      if (dlg.open) focusImage();
    }).observe(dlg, { attributes: true, attributeFilter: ['open'] });

    dlg.addEventListener('close', restoreFocus);
    dlg.addEventListener('cancel', restoreFocus); // Esc en modo modal
  }

  // --- Player: sync aria-pressed/label y seekbar con aria-valuetext ---
  const audio = document.getElementById('audio-boda');
  const btnPP = document.getElementById('newPlayPauseBtn');
  const seek  = document.getElementById('seekBar');

  if (audio && btnPP) {
    const syncBtn = () => {
      const playing = !audio.paused && !audio.ended;
      btnPP.setAttribute('aria-pressed', playing ? 'true' : 'false');
      btnPP.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    };
    audio.addEventListener('play',  syncBtn);
    audio.addEventListener('pause', syncBtn);
    audio.addEventListener('ended', syncBtn);
    syncBtn();
  }

  if (audio && seek) {
    const toMMSS = (s) => {
      const m = Math.floor(s / 60), r = Math.max(0, Math.floor(s % 60));
      return `${m}:${String(r).padStart(2,'0')}`;
    };
    const updateAria = () => {
      if (!isFinite(audio.duration) || audio.duration <= 0) return;
      const val = Number(seek.value) || 0;
      seek.setAttribute('aria-valuemin', '0');
      seek.setAttribute('aria-valuemax', String(Math.floor(audio.duration)));
      seek.setAttribute('aria-valuenow', String(Math.floor(val)));
      seek.setAttribute('aria-valuetext', `${toMMSS(val)} de ${toMMSS(audio.duration)}`);
    };
    audio.addEventListener('timeupdate', updateAria);
    audio.addEventListener('loadedmetadata', updateAria);
    seek.addEventListener('input', updateAria);
    updateAria();
  }
})();

/* === Lottie: ornamentos “breathe” en hero (opcional, con fallback) === */
(function initLottieOrnaments(){
  const els = document.querySelectorAll('.hero__lottie');
  if (!els.length) return;
  // Carga solo si la librería está disponible:
  if (!window.lottie) return;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  els.forEach(el => {
    const path = el.getAttribute('data-lottie');
    try {
      const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: !mq.matches,
        path: path,                 // coloca tu JSON en /img/ornament-breathe.json
        rendererSettings: { progressiveLoad: true }
      });
      // Guarda referencia para pausar/reanudar según preferencias de movimiento
      el._lottie = anim;
    } catch (e) { console.warn('Lottie init error:', e); }
  });
  // Responder a cambios en prefers-reduced-motion
  try {
    mq.addEventListener('change', (e) => {
      document.querySelectorAll('.hero__lottie').forEach(el => {
        const a = el._lottie; if (!a) return;
        if (e.matches) a.pause(); else a.play();
      });
    });
  } catch(_) { /* Safari antiguo: sincrónico no crítico */ }
})();

// Hint de rendimiento: marca como lazy/async todas las imágenes no críticas (excepto la hero)
(function markNonCriticalImages(){
  const heroImg = document.querySelector('.hero__parallax-bg img');
  document.querySelectorAll('img').forEach(img => {
    if (img === heroImg) return;            // no tocar la hero (ya tiene fetchpriority/preload)
    if (!img.hasAttribute('loading'))  img.setAttribute('loading','lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
  });
})();

/* Desactivar enlaces al itinerario y redirigir suavemente a "Cómo llegar" (si existe) */
(function disableItineraryLinks(){
  const links = document.querySelectorAll('a[href="#itinerario"]');
  if (!links.length) return;
  links.forEach(a => {
    a.setAttribute('aria-disabled','true');
    a.setAttribute('tabindex','-1');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const fallback = document.querySelector('#como-llegar, #ubicaciones, [data-section="mapas"], #mapa');
      if (fallback) fallback.scrollIntoView({behavior:'smooth', block:'start'});
    }, { passive: false }); // passive: false es importante para preventDefault
  });
})();
