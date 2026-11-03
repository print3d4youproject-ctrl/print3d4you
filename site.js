/* Shared progressive enhancements. No customer data is stored here. */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('#main-menu');
  if (toggle && menu) {
    toggle.closest('.nav').classList.add('js-navigation');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  const filter = document.querySelector('#platform-filter');
  if (filter) {
    const cards = [...document.querySelectorAll('.product-card')];
    filter.closest('.catalog-filter').hidden = false;
    const update = () => {
      let count = 0;
      cards.forEach(card => {
        const platform = card.querySelector('.tag').textContent.toLowerCase();
        card.hidden = filter.value !== 'all' && !platform.includes(filter.value);
        if (!card.hidden) count++;
      });
      document.querySelector('#filter-count').textContent = `${count} espositori`;
    };
    filter.addEventListener('change', update);
    update();
  }

  const selection = document.querySelector('#request-selection');
  const product = new URLSearchParams(location.search).get('prodotto');
  if (selection && product && product.trim()) {
    const name = product.trim().slice(0, 140);
    selection.hidden = false;
    document.querySelector('#selected-title').textContent = name;
    document.querySelector('#copy-product').addEventListener('click', async () => {
      const status = document.querySelector('#copy-status');
      try {
        await navigator.clipboard.writeText(name);
        status.textContent = 'Copiato. Incollalo nella descrizione del progetto.';
      } catch {
        status.textContent = 'Seleziona il nome del prodotto qui sopra e copialo manualmente.';
      }
    });
  }
})();
