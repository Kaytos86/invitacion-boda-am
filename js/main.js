// =========== CONFIGURACIÓN ==========
const weddingDate = new Date('2025-11-22T20:00:00-06:00');
const whatsappNumber = '529991631771';

// =========== CONTADOR REGRESIVO ==========
const timerElement = document.getElementById('timer');
let countdownIntervalId = null;

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
  updateCountdown(); // Llamada inicial
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

  // === REPRODUCTOR DE MÚSICA PERSONALIZADO ===
  setupAudioPlayer();
  
  // === INICIALIZACIÓN DE LIBRERÍAS (AOS, SWIPER) ===
  const idle = fn => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1000 }) : setTimeout(fn, 150));
  idle(() => {
    if (window.AOS && document.querySelector('[data-aos]')) {
      AOS.init({ duration: 550, once: true, disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches });
    }
    if (typeof Swiper !== 'undefined' && document.querySelector('.gallery-swiper')) {
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
}); 

// =========== REPRODUCTOR DE AUDIO (FUNCIÓN COMPLETA) ==========
function setupAudioPlayer() {
    const audioPlayer = document.getElementById('audio-boda');
    const playPauseBtn = document.getElementById('newPlayPauseBtn');
    const iconPlay = playPauseBtn?.querySelector('.icon-play');
    const iconPause = playPauseBtn?.querySelector('.icon-pause');
    const seekBar = document.getElementById('seekBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const totalDurationDisplay = document.getElementById('totalDurationDisplay');

    if (!audioPlayer || !playPauseBtn || !seekBar || !currentTimeDisplay || !totalDurationDisplay) return;

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
    };

    audioPlayer.onpause = () => {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        playPauseBtn.setAttribute('aria-pressed', 'false');
    };

    seekBar.addEventListener('input', () => {
        audioPlayer.currentTime = seekBar.value;
    });
}

// =========== LIGHTBOX ACCESIBLE (sin cambios) ==========
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


// =========== CARGA DEL MAPA (sin cambios) ==========
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
      
      // La función de copiado necesita un contexto seguro (HTTPS) para funcionar
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          // Éxito al copiar
          button.classList.add('copied');
          setTimeout(() => {
            button.classList.remove('copied');
          }, 2000); // El mensaje "¡Copiado!" desaparecerá después de 2 segundos
        }).catch(err => {
          console.error('Error al copiar texto: ', err);
          alert('No se pudo copiar el texto.');
        });
      } else {
        // Fallback o alerta para contextos no seguros (ej. http://)
        alert('La función de copiar no está disponible en conexiones no seguras (HTTP).');
      }
    });
  });
})();

// =========== FORMULARIO RSVP DINÁMICO (ORDEN CORREGIDO) ==========
(function() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  const mainGuestContainer = document.getElementById('main-guest-container');
  const additionalGuestsContainer = document.getElementById('additional-guests-container');
  const submitButton = document.getElementById('submitRsvpBtn');
  const rsvpChoiceContainer = document.querySelector('.rsvp-choice-container');
  const whatsappNumber = '529991631771';

  // Ocultar campos de nombre y botón de envío al inicio
  mainGuestContainer.classList.add('hidden');
  additionalGuestsContainer.classList.add('hidden');
  submitButton.classList.add('hidden');

  // Lógica para mostrar/ocultar campos al elegir Sí/No
  rsvpChoiceContainer.addEventListener('change', (event) => {
    const choice = event.target.value;
    mainGuestContainer.classList.remove('hidden'); // Siempre mostramos el campo del nombre principal
    submitButton.classList.remove('hidden');

    if (choice === 'yes') {
      additionalGuestsContainer.classList.remove('hidden');
    } else if (choice === 'no') {
      additionalGuestsContainer.classList.add('hidden');
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  let numberOfGuests = parseInt(urlParams.get('pases')) || 1;
  
  const numberOfAdditionalGuests = numberOfGuests - 1;
  if (numberOfAdditionalGuests > 0) {
    // Limpiamos antes de añadir para evitar duplicados
    additionalGuestsContainer.innerHTML = '<p class="guest-fields-title">Por favor, escribe el nombre de tus acompañantes:</p>';
    for (let i = 1; i <= numberOfAdditionalGuests; i++) {
      const fieldHtml = `
        <div class="guest-field">
          <label for="guestName${i+1}">Nombre Completo del Acompañante ${i}</label>
          <input class="rsvp__input" type="text" id="guestName${i+1}" name="guestName${i+1}" placeholder="Nombre y Apellido">
        </div>
      `;
      additionalGuestsContainer.insertAdjacentHTML('beforeend', fieldHtml);
    }
  } else {
      additionalGuestsContainer.style.display = 'none';
  }


  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    
    const mainGuestInput = document.getElementById('mainGuestName');
    const mainGuestName = mainGuestInput.value.trim();
    if (mainGuestName.length < 2) {
      alert('Por favor, escribe tu nombre completo para continuar.');
      return;
    }
    
    const choiceRadio = document.querySelector('input[name="attendance"]:checked');
    if (!choiceRadio) {
      alert('Por favor, selecciona si asistirás o no.');
      return;
    }
    const isAttending = choiceRadio.value === 'yes';
    
    const formData = new FormData();
    let allNames = [mainGuestName];
    
    const entryCodeConfirmacion = 'entry.169600023';
    const googleFormEntryCodes = [
      'entry.985292545', 'entry.333320606', 'entry.428435278', 'entry.1807326494', 'entry.1090018170'
    ];

    let messageText = '';
    formData.append(googleFormEntryCodes[0], mainGuestName);

    if (isAttending) {
      let allFieldsFilled = true;
      for (let i = 1; i <= numberOfAdditionalGuests; i++) {
        const input = document.getElementById(`guestName${i+1}`);
        const name = input.value.trim();
        if (name.length < 2) {
          allFieldsFilled = false;
          break;
        }
        allNames.push(name);
        if (googleFormEntryCodes[i]) {
          formData.append(googleFormEntryCodes[i], name);
        }
      }

      if (numberOfAdditionalGuests > 0 && !allFieldsFilled) {
        alert('Por favor, completa el nombre de todos tus acompañantes.');
        return;
      }

      formData.append(entryCodeConfirmacion, 'Sí asiste');
      messageText = `¡Hola! 👋 Confirmamos nuestra asistencia a su boda.\n\nInvitados (${allNames.length}):\n`;
      allNames.forEach((name) => {
        messageText += `- ${name}\n`;
      });

    } else {
      formData.append(entryCodeConfirmacion, 'No asiste');
      messageText = `Hola, soy ${mainGuestName}. Con mucha pena les informo que no podremos asistir a su boda. ¡Les deseamos todo lo mejor en su gran día!`;
    }

    const googleFormActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeD0yBiMAofT5_5dorw3p1eS737cGqb1al8dhc56cI6BNcriA/formResponse';
    try {
        await fetch(googleFormActionURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
    } catch (error) {
        console.error('Error al enviar a Google Forms:', error);
    }

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  });
})();

// =========== ACTUALIZAR NÚMERO DE PASES EN SECCIÓN "HISTORIA" ==========
document.addEventListener('DOMContentLoaded', function() {
  const passCountElement = document.getElementById('pass-count');
  const passLabelElement = document.getElementById('pass-label');

  if (passCountElement && passLabelElement) {
    // 1. Lee el parámetro 'pases' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    let numberOfGuests = parseInt(urlParams.get('pases'));

    // 2. Si no hay parámetro en la URL, no hace nada y deja el texto original.
    if (!isNaN(numberOfGuests) && numberOfGuests > 0) {
      // 3. Actualiza el número en el HTML
      passCountElement.textContent = numberOfGuests;

      // 4. Cambia 'persona' o 'personas' según el número
      if (numberOfGuests === 1) {
        passLabelElement.textContent = 'persona';
      } else {
        passLabelElement.textContent = 'personas';
      }
    }
  }
});

// =========== FORMULARIO RSVP DINÁMICO (ORDEN CORREGIDO) ==========
(function() {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  const mainGuestContainer = document.getElementById('main-guest-container');
  const additionalGuestsContainer = document.getElementById('additional-guests-container');
  const submitButton = document.getElementById('submitRsvpBtn');
  const rsvpChoiceContainer = document.querySelector('.rsvp-choice-container');
  const whatsappNumber = '529991631771';

  // Ocultar campos de nombre y botón de envío al inicio
  mainGuestContainer.classList.add('hidden');
  additionalGuestsContainer.classList.add('hidden');
  submitButton.classList.add('hidden');

  // Lógica para mostrar/ocultar campos al elegir Sí/No
  rsvpChoiceContainer.addEventListener('change', (event) => {
    const choice = event.target.value;
    mainGuestContainer.classList.remove('hidden'); // Siempre mostramos el campo del nombre principal
    submitButton.classList.remove('hidden');

    if (choice === 'yes') {
      additionalGuestsContainer.classList.remove('hidden');
    } else if (choice === 'no') {
      additionalGuestsContainer.classList.add('hidden');
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  let numberOfGuests = parseInt(urlParams.get('pases')) || 1;
  
  const numberOfAdditionalGuests = numberOfGuests - 1;
  if (numberOfAdditionalGuests > 0) {
    // Limpiamos antes de añadir para evitar duplicados
    additionalGuestsContainer.innerHTML = '<p class="guest-fields-title">Por favor, escribe el nombre de tus acompañantes:</p>';
    for (let i = 1; i <= numberOfAdditionalGuests; i++) {
      const fieldHtml = `
        <div class="guest-field">
          <label for="guestName${i+1}">Nombre Completo del Acompañante ${i}</label>
          <input class="rsvp__input" type="text" id="guestName${i+1}" name="guestName${i+1}" placeholder="Nombre y Apellido">
        </div>
      `;
      additionalGuestsContainer.insertAdjacentHTML('beforeend', fieldHtml);
    }
  } else {
      additionalGuestsContainer.style.display = 'none';
  }


  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    
    const mainGuestInput = document.getElementById('mainGuestName');
    const mainGuestName = mainGuestInput.value.trim();
    if (mainGuestName.length < 2) {
      alert('Por favor, escribe tu nombre completo para continuar.');
      return;
    }
    
    const choiceRadio = document.querySelector('input[name="attendance"]:checked');
    if (!choiceRadio) {
      alert('Por favor, selecciona si asistirás o no.');
      return;
    }
    const isAttending = choiceRadio.value === 'yes';
    
    const formData = new FormData();
    let allNames = [mainGuestName];
    
    const entryCodeConfirmacion = 'entry.169600023';
    const googleFormEntryCodes = [
      'entry.985292545', 'entry.333320606', 'entry.428435278', 'entry.1807326494', 'entry.1090018170'
    ];

    let messageText = '';
    formData.append(googleFormEntryCodes[0], mainGuestName);

    if (isAttending) {
      let allFieldsFilled = true;
      for (let i = 1; i <= numberOfAdditionalGuests; i++) {
        const input = document.getElementById(`guestName${i+1}`);
        const name = input.value.trim();
        if (name.length < 2) {
          allFieldsFilled = false;
          break;
        }
        allNames.push(name);
        if (googleFormEntryCodes[i]) {
          formData.append(googleFormEntryCodes[i], name);
        }
      }

      if (numberOfAdditionalGuests > 0 && !allFieldsFilled) {
        alert('Por favor, completa el nombre de todos tus acompañantes.');
        return;
      }

      formData.append(entryCodeConfirmacion, 'Sí asiste');
      messageText = `¡Hola! 👋 Confirmamos nuestra asistencia a su boda.\n\nInvitados (${allNames.length}):\n`;
      allNames.forEach((name) => {
        messageText += `- ${name}\n`;
      });

    } else {
      formData.append(entryCodeConfirmacion, 'No asiste');
      messageText = `Hola, soy ${mainGuestName}. Con mucha pena les informo que no podremos asistir a su boda. ¡Les deseamos todo lo mejor en su gran día!`;
    }

    const googleFormActionURL = 'https://docs.google.com/forms/d/e/1FAIpQLSeD0yBiMAofT5_5dorw3p1eS737cGqb1al8dhc56cI6BNcriA/formResponse';
    try {
        await fetch(googleFormActionURL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
    } catch (error) {
        console.error('Error al enviar a Google Forms:', error);
    }

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  });
})();

// =========== ACTUALIZAR NÚMERO DE PASES EN SECCIÓN "HISTORIA" ==========
document.addEventListener('DOMContentLoaded', function() {
  const passCountElement = document.getElementById('pass-count');
  const passLabelElement = document.getElementById('pass-label');

  if (passCountElement && passLabelElement) {
    // 1. Lee el parámetro 'pases' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    let numberOfGuests = parseInt(urlParams.get('pases'));

    // 2. Si el parámetro existe y es válido, actualiza el texto
    if (!isNaN(numberOfGuests) && numberOfGuests > 0) {
      // 3. Actualiza el número en el HTML
      passCountElement.textContent = numberOfGuests;

      // 4. Cambia 'persona' o 'personas' según el número
      if (numberOfGuests === 1) {
        passLabelElement.textContent = 'persona';
      } else {
        passLabelElement.textContent = 'personas';
      }
    }
  }
});



