/* =============================================
   GROUP SAIL TRIPS — JAVASCRIPT
   ============================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
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
  '.feature-card, .trip-card, .cal-month, .review-card, .faq-item, .captain-grid, .contact-grid, .sustainability-card'
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

// ---- DESTINATIONS: SHOW ALL ----
// The destination cards stay hidden until the visitor asks to see them,
// keeping the page short on both desktop and mobile.
const tripsGrid = document.getElementById('trips-grid');
const tripsMore = document.getElementById('trips-more');
const tripsTotal = tripsGrid
  ? tripsGrid.querySelectorAll('.trip-card').length
  : 0;

if (tripsMore && tripsGrid && tripsTotal > 0) {
  const label = tripsMore.querySelector('.trips-more-text');

  const setTripsLabel = (open) => {
    label.textContent = open
      ? 'Show fewer destinations'
      : `Show all ${tripsTotal} destinations`;
  };
  setTripsLabel(false);

  tripsMore.addEventListener('click', () => {
    const nowOpen = tripsGrid.classList.toggle('is-collapsed') === false;
    tripsMore.setAttribute('aria-expanded', String(nowOpen));
    setTripsLabel(nowOpen);
  });
}

// ---- CAPTAIN: MY COMMITMENT ----
// The captain's personal practices stay behind the badge next to
// "100% safety". The two nature cards (iNaturalist, One boat one tree)
// are deliberately left out of the collapse.
const commitmentGrid = document.getElementById('commitment-grid');
const commitmentToggle = document.getElementById('commitment-toggle');

if (commitmentToggle && commitmentGrid) {
  commitmentToggle.addEventListener('click', () => {
    const nowOpen = commitmentGrid.classList.toggle('is-collapsed') === false;
    commitmentToggle.setAttribute('aria-expanded', String(nowOpen));
    if (nowOpen) {
      commitmentGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

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

// ---- FORMS (Web3Forms) ----
// Both forms post to Web3Forms, which mails the submission to our inbox. The
// access key lives in the markup with the form, not here. While it is empty the
// handler falls back to opening the visitor's own mail app, so a form never
// claims to have sent something it did not.
const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
const CONTACT_EMAIL = 'malasailcharters@gmail.com';

function formAccessKey(form) {
  return form.elements.access_key ? form.elements.access_key.value.trim() : '';
}

function postForm(form) {
  return fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new FormData(form)
  }).then(res => res.json().then(data => {
    if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');
    return data;
  }));
}

function showFormMessage(node, tone, text) {
  node.textContent = text;
  node.className = 'form-message form-message--' + tone;
  node.style.display = 'block';
}

// Hands the visitor's own mail app a ready-made message, so the enquiry still
// lands in the inbox while the access key is missing.
function openMailFallback(subject, body) {
  window.location.href = 'mailto:' + CONTACT_EMAIL +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);
}

// ---- CONTACT FORM ----
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');
  const btn     = document.getElementById('form-submit');

  btn.textContent = 'Sending...';
  btn.disabled = true;
  error.style.display = 'none';

  if (!formAccessKey(form)) {
    const data = new FormData(form);
    openMailFallback('Enquiry from the Mala Sail Charters website', [
      'Name: ' + (data.get('name') || ''),
      'Email: ' + (data.get('email') || ''),
      'Preferred dates: ' + (data.get('dates') || 'Flexible'),
      'Travellers: ' + (data.get('guests') || 'Not specified'),
      'Trip of interest: ' + (data.get('trip') || 'Not decided yet'),
      '',
      data.get('message') || ''
    ].join('\n'));
    btn.textContent = 'Check availability & get pricing';
    btn.disabled = false;
    showFormMessage(error, 'notice',
      'Opening your email app with the message ready. If nothing happens, write to ' +
      CONTACT_EMAIL + ' or use WhatsApp.');
    return;
  }

  postForm(form)
    .then(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    })
    .catch(() => {
      btn.textContent = 'Check availability & get pricing';
      btn.disabled = false;
      showFormMessage(error, 'error',
        'Sorry, that could not be sent. Please write to ' + CONTACT_EMAIL +
        ' or message us on WhatsApp.');
    });
}

// ---- NEWSLETTER FORM ----
function handleNewsletter(e) {
  e.preventDefault();
  const form    = document.getElementById('newsletter-form');
  const success = document.getElementById('newsletter-success');
  const error   = document.getElementById('newsletter-error');
  const btn     = document.getElementById('newsletter-submit');

  btn.textContent = 'Subscribing...';
  btn.disabled = true;
  error.style.display = 'none';

  if (!formAccessKey(form)) {
    openMailFallback('Newsletter signup from the Mala Sail Charters website',
      'Please add this address to the newsletter list: ' + (form.elements.email.value || ''));
    btn.textContent = 'Subscribe';
    btn.disabled = false;
    showFormMessage(error, 'notice',
      'Opening your email app to confirm. If nothing happens, write to ' + CONTACT_EMAIL + '.');
    return;
  }

  postForm(form)
    .then(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    })
    .catch(() => {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
      showFormMessage(error, 'error',
        'That did not go through. Please try again, or write to ' + CONTACT_EMAIL + '.');
    });
}

// ---- REVIEW FORM ----
// Same Web3Forms route as the contact form. Reviews are curated by hand, so a
// successful send only thanks the visitor; nothing is published automatically.
function handleReviewSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('review-form');
  const success = document.getElementById('review-success');
  const error   = document.getElementById('review-error');
  const btn     = document.getElementById('review-submit');

  btn.textContent = 'Sending...';
  btn.disabled = true;
  error.style.display = 'none';

  if (!formAccessKey(form)) {
    const data = new FormData(form);
    openMailFallback('Review from the Mala Sail Charters website', [
      'Name: ' + (data.get('name') || ''),
      'Email: ' + (data.get('email') || ''),
      'Role: ' + (data.get('role') || ''),
      'Trip: ' + (data.get('trip') || 'Not specified'),
      'Rating: ' + (data.get('rating') || '') + ' / 5',
      '',
      data.get('review') || ''
    ].join('\n'));
    btn.textContent = 'Send my review';
    btn.disabled = false;
    showFormMessage(error, 'notice',
      'Opening your email app with the review ready. If nothing happens, write to ' +
      CONTACT_EMAIL + ' or use WhatsApp.');
    return;
  }

  postForm(form)
    .then(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    })
    .catch(() => {
      btn.textContent = 'Send my review';
      btn.disabled = false;
      showFormMessage(error, 'error',
        'Sorry, that could not be sent. Please write to ' + CONTACT_EMAIL +
        ' or message us on WhatsApp.');
    });
}

// ---- LEAVE A REVIEW MODAL ----
const reviewModal = document.getElementById('review');
const reviewTriggers = document.querySelectorAll('[data-open-review]');
const reviewCloseEls = document.querySelectorAll('[data-close-review]');

function openReview(e) {
  if (e) e.preventDefault();
  if (!reviewModal) return;
  reviewModal.classList.add('is-open');
  reviewModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('review-open');
  const dialog = reviewModal.querySelector('.booking-modal-dialog');
  if (dialog) dialog.scrollTop = 0;
  const firstField = reviewModal.querySelector('#review-name');
  if (firstField) firstField.focus();
}
function closeReview() {
  if (!reviewModal) return;
  reviewModal.classList.remove('is-open');
  reviewModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('review-open');
}
reviewTriggers.forEach(el => el.addEventListener('click', openReview));
reviewCloseEls.forEach(el => el.addEventListener('click', closeReview));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && reviewModal && reviewModal.classList.contains('is-open')) closeReview();
});

// Deep link: .../#leave-review opens the form straight away, so the URL can be
// shared on its own (WhatsApp, email, a QR code...). #review also works,
// since that is the modal's own id.
function maybeOpenReviewFromHash() {
  const h = window.location.hash;
  if (h === '#leave-review' || h === '#leave-a-review' || h === '#review') openReview();
}
maybeOpenReviewFromHash();
window.addEventListener('hashchange', maybeOpenReviewFromHash);

// ---- BOOK A DISCOVERY CALL MODAL (HubSpot Meetings) ----
const bookingModal = document.getElementById('book');
const bookingTriggers = document.querySelectorAll('[data-open-booking]');
const bookingCloseEls = document.querySelectorAll('[data-close-booking]');
let hubspotMeetingsLoaded = false;

function loadHubSpotMeetings() {
  if (hubspotMeetingsLoaded) return;
  hubspotMeetingsLoaded = true;
  const script = document.createElement('script');
  script.src = 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
  script.async = true;
  document.body.appendChild(script);
}

function openBooking(e) {
  if (e) e.preventDefault();
  if (!bookingModal) return;
  bookingModal.classList.add('is-open');
  bookingModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('booking-open');
  const dialog = bookingModal.querySelector('.booking-modal-dialog');
  if (dialog) dialog.scrollTop = 0;
  loadHubSpotMeetings();
  const closeBtn = bookingModal.querySelector('.booking-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeBooking() {
  if (!bookingModal) return;
  bookingModal.classList.remove('is-open');
  bookingModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('booking-open');
}

bookingTriggers.forEach(trigger => trigger.addEventListener('click', openBooking));
bookingCloseEls.forEach(el => el.addEventListener('click', closeBooking));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('is-open')) {
    closeBooking();
  }
});

// ---- BOOKING GALLERY (swipeable trip moments before the calendar) ----
(function initBookingGallery() {
  const gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;
  const track = gallery.querySelector('[data-gallery-track]');
  if (!track) return;
  const slides = Array.from(track.children);
  if (!slides.length) return;

  const dotsWrap = gallery.querySelector('[data-gallery-dots]');
  const prevBtn = gallery.querySelector('[data-gallery-prev]');
  const nextBtn = gallery.querySelector('[data-gallery-next]');
  const cta = gallery.parentElement
    ? gallery.parentElement.querySelector('[data-gallery-cta]')
    : null;

  let currentIndex = 0;
  let programmaticUntil = 0;

  // Build the dots once.
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'booking-gallery-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to image ' + (i + 1) + ' of ' + slides.length);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  function setIndex(i) {
    currentIndex = i;
    dots.forEach((dot, di) => dot.classList.toggle('is-active', di === i));
  }

  function goTo(i) {
    const target = Math.max(0, Math.min(i, slides.length - 1));
    programmaticUntil = Date.now() + 650;
    track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
    setIndex(target);
  }

  // Keep the dots in sync when the user swipes natively.
  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(() => {
      if (!track.clientWidth || Date.now() < programmaticUntil) return;
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== currentIndex) setIndex(i);
    });
  }, { passive: true });

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Mouse drag on desktop (touch devices swipe natively).
  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    dragging = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
    if (track.setPointerCapture) {
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    }
  });
  track.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    e.preventDefault();
    track.scrollLeft = startScroll - (e.clientX - startX);
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('is-dragging');
    const i = track.clientWidth ? Math.round(track.scrollLeft / track.clientWidth) : 0;
    goTo(i);
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointerleave', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // "Choose a day & time" slides the modal down to the calendar.
  if (cta && bookingModal) {
    cta.addEventListener('click', () => {
      const embed = bookingModal.querySelector('.booking-embed');
      const dialog = bookingModal.querySelector('.booking-modal-dialog');
      if (embed && dialog) {
        programmaticUntil = 0;
        dialog.scrollTo({ top: embed.offsetTop - 12, behavior: 'smooth' });
      }
    });
  }
})();

// ---- SMOOTH SCROLL (for older Safari) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.hasAttribute('data-open-booking')) return;
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
