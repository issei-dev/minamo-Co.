/**
 * MINAMO Inc. - Main Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  function handleScroll() {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav-overlay');
  
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4. Contact Modal Logic
  const modalBackdrop = document.getElementById('contact-modal');
  const openModalButtons = document.querySelectorAll('[data-open-modal="contact"]');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');
  const contactForm = document.getElementById('contact-form');
  const contactSuccessMsg = document.getElementById('contact-success-msg');

  function openContactModal(e) {
    if (e) e.preventDefault();
    if (modalBackdrop) {
      modalBackdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // If mobile nav was open, close it
      if (mobileToggle && mobileNav) {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      }
    }
  }

  function closeContactModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      // Reset form alert if any
      if (contactForm && contactSuccessMsg) {
        setTimeout(() => {
          contactSuccessMsg.style.display = 'none';
          contactForm.style.display = 'block';
          contactForm.reset();
        }, 300);
      }
    }
  }

  openModalButtons.forEach(btn => btn.addEventListener('click', openContactModal));
  closeModalButtons.forEach(btn => btn.addEventListener('click', closeContactModal));

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeContactModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('is-open')) {
      closeContactModal();
    }
  });

  // Handle Form Submission Mock
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '送信中...';
      }

      setTimeout(() => {
        if (contactSuccessMsg) {
          contactForm.style.display = 'none';
          contactSuccessMsg.style.display = 'block';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '送信する';
        }
      }, 700);
    });
  }

  // 5. Blog Category Filter (Interactive preview)
  const categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
});
