/* ============================================
   PORTFOLIO — script.js
   ============================================ */

// ── Mobile menu toggle ──
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('hidden');
});

// ── Close mobile menu when a link is clicked ──
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.add('hidden');
  });
});

// ── Scroll-triggered fade-up animation ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Active nav link highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 80) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#b07a8a' : '';
  });
});

// ── Contact form submit → Google Sheets ──
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwAtJSdLr3KzeMnJn6l2WYyFD7WFzMtf2QW8as_UihUftfZ_TCGjWGFA0eKB8Rz30Istw/exec';

async function handleSubmit() {
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const msg     = document.getElementById('formMsg');

  if (!name || !email || !message) {
    msg.textContent = '⚠ Mohon isi Name, Email, dan Message.';
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3000);
    return;
  }

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    msg.textContent = '✦ Message sent! I\'ll be in touch soon. ✦';
    msg.classList.remove('hidden');
    document.getElementById('contactName').value    = '';
    document.getElementById('contactEmail').value   = '';
    document.getElementById('contactMessage').value = '';
    setTimeout(() => msg.classList.add('hidden'), 4000);

  } catch (err) {
    msg.textContent = '✦ Gagal mengirim, coba lagi. ✦';
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3000);
  }
}

// ── Project Slider ──
(function () {
  const track    = document.getElementById('sliderTrack');
  const slides   = document.querySelectorAll('.slide');
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  const dotsWrap = document.getElementById('dotsWrapper');
  const counter  = document.getElementById('slideCounter');

  if (!track || !slides.length) return;

  const total = slides.length;
  let current = 0;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.style.cssText = 'height:8px; border-radius:999px; border:1px solid rgba(212,160,160,0.4); transition:all 0.3s; cursor:pointer;';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('button').forEach((d, i) => {
      d.style.background = i === current ? '#b07a8a' : '#e8c4c4';
      d.style.width      = i === current ? '20px'   : '8px';
    });
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch / swipe support (mobile)
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });

  updateDots();
})();