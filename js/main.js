// =========== CONFIGURACIÓN ==========
const weddingDate = new Date('2025-11-22T16:00:00'); // 22 de Noviembre 2025, 4:00pm
const whatsappNumber = '5219991234567'; // Número RSVP en formato internacional sin +
const novia = 'Monserrat';
const novio = 'Alejandro';

// =========== CACHING DE ELEMENTOS DEL DOM ==========
const timerElement = document.getElementById('timer');
let countdownIntervalId = null;

// =========== CONTADOR REGRESIVO ==========
function updateCountdown() {
  if (!timerElement) return;

  const now = new Date();
  const diff = weddingDate - now;

  if (diff < 0) {
    timerElement.innerHTML = '<span class="countdown__finished">¡Es hoy! ¡Nos vemos en la boda!</span>';
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId); // Detener el intervalo
    }
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  timerElement.innerHTML = `
    <div class="countdown__timer-box">
      <span class="countdown__timer-number">${days}</span>
      <span class="countdown__timer-label">Días</span>
    </div>
    <div class="countdown__timer-box">
      <span class="countdown__timer-number">${hours}</span>
      <span class="countdown__timer-label">Horas</span>
    </div>
    <div class="countdown__timer-box">
      <span class="countdown__timer-number">${minutes}</span>
      <span class="countdown__timer-label">Minutos</span>
    </div>
    <div class="countdown__timer-box">
      <span class="countdown__timer-number">${seconds}</span>
      <span class="countdown__timer-label">Segundos</span>
    </div>
  `;
}

if (timerElement) {
  countdownIntervalId = setInterval(updateCountdown, 1000);
  updateCountdown(); 
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
        setTimeout(() => { 
          rsvpAlert.style.display = 'none';
        }, 3500);
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
        rsvpAlert.style.color = '#d15c22'; 
      }, 2800);
    });
  }

  // =========== ANIMACIONES AOS ==========
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
    });
  }

  // =========== GALERÍA SWIPER ==========
  if (typeof Swiper !== 'undefined' && document.querySelector('.gallery-swiper')) {
    new Swiper('.gallery-swiper', {
      loop: true,
      effect: 'slide', 
      grabCursor: true,
      spaceBetween: 24, 
      slidesPerView: 1,
      centeredSlides: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      autoplay: { 
        delay: 4000,
        disableOnInteraction: false,
      },
      breakpoints: { 
        700: { slidesPerView: 2, spaceBetween: 28 },
        1000: { slidesPerView: 3, spaceBetween: 32 }
      }
    });
  }

  // =========== MÚSICA DE FONDO ==========
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const audio = document.getElementById('audio-boda');
  let musicPlaying = false;

  if (musicBtn && musicIcon && audio) {
    musicBtn.addEventListener('click', function() {
      if (!musicPlaying) {
        audio.play().then(() => {
            musicPlaying = true;
            musicIcon.classList.add('playing');
            musicBtn.setAttribute('aria-label', 'Pausar música');
        }).catch(error => {
            console.warn("La reproducción automática de audio fue bloqueada por el navegador.", error);
        });
      } else {
        audio.pause();
        musicPlaying = false;
        musicIcon.classList.remove('playing');
        musicBtn.setAttribute('aria-label', 'Reproducir música');
      }
    });

    document.addEventListener("visibilitychange", function() {
      if (document.hidden && musicPlaying) {
        audio.pause();
      } 
    });
  }

  // =========== PARALLAX HERO ==========
  const parallaxBg = document.querySelector('.hero__parallax-bg');
  if (parallaxBg) {
    window.addEventListener('scroll', function() {
      const scrollOffset = window.scrollY;
      if (scrollOffset < window.innerHeight * 1.5) { 
          let offset = scrollOffset * 0.33;
          parallaxBg.style.transform = `translateY(${offset}px) scale(1.02)`;
      }
    });
  }

  // =========== SMOOTH SCROLL NAV Y ACTIVE LINK (CÓDIGO COMENTADO YA QUE NAVBAR FUE ELIMINADA) ==========
  /*
  const navbarLinks = document.querySelectorAll('#mainNavbar a[href^="#"]'); 
  const navbar = document.getElementById('mainNavbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 60; 

  navbarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      const targetElement = document.querySelector(hash);

      if (targetElement) {
        e.preventDefault();
        const topPos = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        window.scrollTo({ 
          top: topPos, 
          behavior: 'smooth' 
        });
      }
    });
  });

  window.addEventListener('scroll', function() {
    let fromTop = window.scrollY + navbarHeight + 50; 

    navbarLinks.forEach(link => {
      const sectionId = link.getAttribute('href');
      const section = document.querySelector(sectionId);

      if (section) {
        if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
    
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) { 
        navbarLinks.forEach(link => link.classList.remove('active'));
        const lastVisibleLink = Array.from(navbarLinks).reverse().find(link => {
            const section = document.querySelector(link.getAttribute('href'));
            return section && (section.offsetTop <= fromTop);
        });
        if (lastVisibleLink) lastVisibleLink.classList.add('active');
    } else if (window.scrollY < 200 && navbarLinks.length > 0) { 
        navbarLinks.forEach(link => link.classList.remove('active'));
        if(document.querySelector('#hero') && document.querySelector('#hero').offsetTop <= fromTop) {
            const heroLink = document.querySelector('#mainNavbar a[href="#hero"]');
            if (heroLink) heroLink.classList.add('active');
        }
    }
  });
  */
});