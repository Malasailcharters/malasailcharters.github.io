/* =============================================
   GROUP SAIL TRIPS — JAVASCRIPT
   ============================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- BURGER MENU ----
const burgerBtn = document.getElementById('burger-btn');
const navLinks  = document.getElementById('nav-links');

burgerBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burgerBtn.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burgerBtn.classList.remove('active');
  });
});

// ---- BACK TO TOP ----
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll(
  '.feature-card, .trip-card, .cal-month, .review-card, .faq-item, .captain-grid, .contact-grid'
);
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * (Array.from(revealEls).indexOf(entry.target) % 6));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ---- REVIEWS: SHOW ALL (desktop) ----
// Above 768px only the first row shows; the rest wait behind the
// button. On phones the swipe strip shows everything, so the button
// stays hidden there and this handler simply never becomes visible.
const reviewsGrid = document.getElementById('reviews-grid');
const reviewsMore = document.getElementById('reviews-more');
const reviewsTotal = reviewsGrid
  ? reviewsGrid.querySelectorAll('.review-card').length
  : 0;

if (reviewsMore && reviewsGrid && reviewsTotal > 2) {
  const label = reviewsMore.querySelector('.reviews-more-text');

  reviewsMore.addEventListener('click', () => {
    const nowOpen = reviewsGrid.classList.toggle('is-collapsed') === false;
    reviewsMore.classList.toggle('is-open', nowOpen);
    reviewsMore.setAttribute('aria-expanded', String(nowOpen));
    label.textContent = nowOpen
      ? 'Show fewer reviews'
      : `Show all ${reviewsTotal} reviews`;
  });
}

// ---- REVIEWS: READ MORE ----
// Long bodies are clamped to four lines and get the button; short ones show
// in full and the button stays hidden.
const reviewCards = [...document.querySelectorAll('.review-card')];

function measureReviews() {
  reviewCards.forEach(card => {
    const text = card.querySelector('.review-text');
    const btn  = card.querySelector('.review-more');
    if (!text || !btn) return;

    const wasExpanded = btn.getAttribute('aria-expanded') === 'true';

    // Cards hidden by the collapsed grid measure 0x0 and would look
    // unclipped. Render just this card while measuring, without changing
    // the collapsed state the user sees.
    const wasHidden = card.offsetParent === null;
    if (wasHidden) card.style.display = 'block';

    text.classList.add('is-clamped');
    const clipped = text.scrollHeight > text.clientHeight + 1;

    if (!clipped) {
      text.classList.remove('is-clamped');
      if (!wasExpanded) btn.hidden = true;
    } else if (!wasExpanded) {
      btn.hidden = false;
    }

    if (wasHidden) card.style.display = '';
  });
}

measureReviews();

// Fonts land after first paint and change the line breaks, so re-measure
// once everything is in.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(measureReviews);
}
window.addEventListener('resize', () => {
  measureReviews();
});

reviewCards.forEach(card => {
  const text = card.querySelector('.review-text');
  const btn  = card.querySelector('.review-more');
  if (!text || !btn) return;

  const label = btn.textContent;

  btn.addEventListener('click', () => {
    const nowOpen = text.classList.toggle('is-clamped') === false;
    btn.setAttribute('aria-expanded', String(nowOpen));
    btn.firstChild.nodeValue = nowOpen ? 'Show less' : label;
  });
});

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if was closed)
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ---- PREFILL DESTINATION IN CONTACT FORM ----
const tripSelect = document.getElementById('form-trip');

function setTripDestination(value) {
  if (tripSelect && tripSelect.querySelector(`option[value="${value}"]`)) {
    tripSelect.value = value;
  }
}

const tripCardValues = {
  'trip-amalfi':    'amalfi',
  'trip-ionian':    'ionian',
  'trip-ibiza':     'ibiza',
  'trip-antigua':   'antigua',
  'trip-thailand':  'thailand',
  'trip-mauritius': 'mauritius'
};

document.querySelectorAll('.trip-card').forEach(card => {
  card.addEventListener('click', () => {
    if (tripCardValues[card.id]) setTripDestination(tripCardValues[card.id]);
  });
});

const calTripValues = {
  'cal-trip-1': 'antigua',
  'cal-trip-2': 'thailand',
  'cal-trip-3': 'mauritius',
  'cal-trip-4': 'amalfi',
  'cal-trip-5': 'ionian',
  'cal-trip-6': 'ibiza'
};

document.querySelectorAll('.cal-trip').forEach(link => {
  link.addEventListener('click', () => {
    if (calTripValues[link.id]) setTripDestination(calTripValues[link.id]);
  });
});

// ---- CONTACT FORM ----
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn     = document.getElementById('form-submit');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate send
  setTimeout(() => {
    form.style.display    = 'none';
    success.style.display = 'block';
  }, 1200);
}

// ---- NEWSLETTER FORM ----
function handleNewsletter(e) {
  e.preventDefault();
  const form    = document.getElementById('newsletter-form');
  const success = document.getElementById('newsletter-success');
  const btn     = document.getElementById('newsletter-submit');

  btn.textContent = 'Subscribing...';
  btn.disabled = true;

  setTimeout(() => {
    form.style.display    = 'none';
    success.style.display = 'block';
  }, 1000);
}

// ---- SMOOTH SCROLL (for older Safari) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--cyan)';
          link.style.background = 'rgba(176,134,82,0.1)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
