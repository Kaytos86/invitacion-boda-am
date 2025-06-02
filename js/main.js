// =========== CONFIGURACIÓN ==========
const weddingDate = new Date('2025-11-22T16:00:00');
const whatsappNumber = '5219991234567';
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

  // CORRECCIÓN: Aseguramos la correcta interpolación de variables para el contador.
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
  // =========== RSVP WHATSAPP ==========
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpAlert = document.getElementById('rsvpAlert');
  const guestNameInput = document.getElementById('guestName');
  const adultsInput = document.getElementById('adults');

  if (rsvpForm && guestNameInput && adultsInput && rsvpAlert) {
    rsvpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const guestName = guestNameInput.value.trim();
      const adults = adultsInput.value.trim();
      if (!guestName || !adults || Number(adults) < 1 || Number(adults) > 10) {
        rsvpAlert.textContent = 'Por favor, ingresa tu nombre y un número válido de adultos (1-10).';
        rsvpAlert.style.display = 'block';
        setTimeout(() => { rsvpAlert.style.display = 'none'; }, 3500);
        return;
      }
      const message = `¡Hola! Quiero confirmar mi asistencia a la boda de ${novio} y ${novia}. Mi nombre es: ${guestName}. Asistiremos: ${adults} persona(s).`;
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;
      window.open(url, '_blank');
      rsvpAlert.textContent = 'Redirigiendo a WhatsApp para confirmar...';
      rsvpAlert.style.color = 'var(--color-accent)';
      rsvpAlert.style.display = 'block';
      rsvpForm.reset();
      setTimeout(() => {
        rsvpAlert.style.display = 'none';
        rsvpAlert.style.color = '#d15c22'; // Color original de alerta
      }, 2800);
    });
  }

  // =========== ANIMACIONES AOS ==========
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });
  }

  // =========== GALERÍA SWIPER ==========
  if (typeof Swiper !== 'undefined' && document.querySelector('.gallery-swiper')) {
    new Swiper('.gallery-swiper', {
      loop: true, effect: 'slide', grabCursor: true, spaceBetween: 24, slidesPerView: 1, centeredSlides: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      autoplay: { delay: 4000, disableOnInteraction: false },
      breakpoints: { 700: { slidesPerView: 2, spaceBetween: 28 }, 1000: { slidesPerView: 3, spaceBetween: 32 } }
    });
  }

  // =========== PARALLAX HERO ==========
  const parallaxBg = document.querySelector('.hero__parallax-bg');
  if (parallaxBg) {
    window.addEventListener('scroll', function() {
      const scrollOffset = window.scrollY;
      if (scrollOffset < window.innerHeight * 1.5) { // Limitar efecto para optimizar
        let offset = scrollOffset * 0.33;
        parallaxBg.style.transform = `translateY(${offset}px) scale(1.02)`;
      }
    });
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
      } else {
        totalDurationDisplay.textContent = "0:00"; 
      }
    };

    // Escuchar estos eventos para asegurar que la duración se cargue
    audioPlayer.addEventListener('canplaythrough', setAudioData);
    audioPlayer.addEventListener('loadedmetadata', setAudioData);
    audioPlayer.addEventListener('durationchange', setAudioData);

    // Comprobar si los metadatos ya están cargados (útil si preload="auto" funciona bien)
    if (audioPlayer.readyState >= 1 && isFinite(audioPlayer.duration) && audioPlayer.duration > 0) { // HAVE_METADATA o superior
        setAudioData();
    }
    
    audioPlayer.addEventListener('timeupdate', () => {
      if (isFinite(audioPlayer.currentTime)) {
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        seekBar.value = audioPlayer.currentTime;
      }
    });

    newPlayPauseBtn.addEventListener('click', () => {
      if (!hasAttemptedPlay) {
        // Algunos navegadores (especialmente en móviles) pueden no cargar metadatos hasta
        // que haya una interacción o se llame a load().
        audioPlayer.load(); 
        hasAttemptedPlay = true;
      }
      if (isAudioPlaying) {
        audioPlayer.pause();
      } else {
        audioPlayer.play().catch(error => {
          console.warn("Reproducción bloqueada por el navegador:", error);
          // Aquí podrías mostrar un mensaje al usuario si la reproducción automática falla
          // debido a las políticas del navegador, aunque este play es iniciado por el usuario.
        });
      }
    });

    audioPlayer.onplaying = () => {
        isAudioPlaying = true;
        if(iconPlay) iconPlay.style.display = 'none';
        if(iconPause) iconPause.style.display = 'block';
        if(newPlayPauseBtn) newPlayPauseBtn.setAttribute('aria-label', 'Pausar música');
        setAudioData(); // Re-asegurarse que la duración está actualizada al empezar a sonar
    };

    audioPlayer.onpause = () => {
        isAudioPlaying = false;
        if(iconPlay) iconPlay.style.display = 'block';
        if(iconPause) iconPause.style.display = 'none';
        if(newPlayPauseBtn) newPlayPauseBtn.setAttribute('aria-label', 'Reproducir música');
    };

    seekBar.addEventListener('input', () => {
      if (isFinite(audioPlayer.duration)) {
        audioPlayer.currentTime = seekBar.value;
      }
    });
    
    audioPlayer.addEventListener('ended', () => {
        // El atributo loop en <audio> maneja la repetición.
        // Si el audio está en loop, el navegador lo reiniciará. 
        // Nos aseguramos que el estado visual y de la variable sea el correcto.
        if (audioPlayer.loop) {
            isAudioPlaying = true; // Debería seguir sonando
            if(iconPlay) iconPlay.style.display = 'none';
            if(iconPause) iconPause.style.display = 'block';
        } else { // Si no está en loop
            isAudioPlaying = false;
            if(iconPlay) iconPlay.style.display = 'block';
            if(iconPause) iconPause.style.display = 'none';
            if(newPlayPauseBtn) newPlayPauseBtn.setAttribute('aria-label', 'Reproducir música');
            // Opcional: reiniciar la barra y tiempo a 0
            // currentTimeDisplay.textContent = formatTime(0);
            // seekBar.value = 0;
        }
    });

    document.addEventListener("visibilitychange", function() {
      if (document.hidden && isAudioPlaying) {
        audioPlayer.pause();
        // No es necesario cambiar isAudioPlaying aquí, ya que el evento onpause lo manejará.
      }
    });

  } else {
    console.warn("No se encontraron todos los elementos del reproductor de audio personalizado para inicializar.");
    // Aquí puedes añadir logs más específicos si sigues teniendo problemas:
    // if (!audioPlayer) console.warn("Elemento audio 'audio-boda' NO encontrado.");
    // if (!newPlayPauseBtn) console.warn("Botón 'newPlayPauseBtn' NO encontrado.");
    // if (!iconPlay) console.warn("Icono play '.icon-play' NO encontrado.");
    // if (!iconPause) console.warn("Icono pause '.icon-pause' NO encontrado.");
    // if (!seekBar) console.warn("Barra de progreso 'seekBar' NO encontrada.");
    // if (!currentTimeDisplay) console.warn("Display tiempo actual 'currentTimeDisplay' NO encontrado.");
    // if (!totalDurationDisplay) console.warn("Display duración total 'totalDurationDisplay' NO encontrado.");
  }
  // === FIN DEL CÓDIGO ACTUALIZADO PARA EL REPRODUCTOR ===

}); // Cierre del DOMContentLoaded.