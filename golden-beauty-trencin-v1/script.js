(() => {
  const form = document.querySelector('#booking-form');
  const steps = [...document.querySelectorAll('.form-step')];
  const confirmation = document.querySelector('#demo-confirmation');
  const confirmationCopy = document.querySelector('#confirmation-copy');
  const restart = document.querySelector('#restart');
  const dateInput = document.querySelector('#date');

  if (!form || !confirmation || !dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  let current = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    confirmation.hidden = true;
    current = index;
    const firstControl = steps[index]?.querySelector('input, textarea, button');
    firstControl?.focus({ preventScroll: true });
    steps[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validateStep(index) {
    if (index === 0) {
      const selected = form.querySelector('input[name="intent"]:checked');
      const error = document.querySelector('#intent-error');
      error.hidden = Boolean(selected);
      return Boolean(selected);
    }

    if (index === 1) {
      const error = document.querySelector('#date-error');
      const ok = Boolean(dateInput.value);
      error.hidden = ok;
      return ok;
    }

    return true;
  }

  form.addEventListener('click', (event) => {
    const next = event.target.closest('[data-next]');
    const back = event.target.closest('[data-back]');

    if (next) {
      if (!validateStep(current)) return;
      showStep(Math.min(current + 1, steps.length - 1));
    }

    if (back) {
      showStep(Math.max(current - 1, 0));
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const intent = form.querySelector('input[name="intent"]:checked')?.value;
    const date = form.elements.date.value;
    const error = document.querySelector('#contact-error');

    if (!name || !phone) {
      error.hidden = false;
      return;
    }
    error.hidden = true;

    steps.forEach((step) => { step.hidden = true; });
    confirmation.hidden = false;
    confirmationCopy.textContent = `${name}, vaša demo požiadavka (${intent}) s preferovaným dňom ${date} je pripravená na odoslanie. V tejto ukážke sa však nikam neposiela.`;
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
    confirmation.querySelector('a, button')?.focus({ preventScroll: true });
  });

  restart?.addEventListener('click', () => {
    form.reset();
    showStep(0);
  });
})();
