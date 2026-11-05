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

  const hero = document.querySelector('[data-hero-slideshow]');
  if (hero) {
    const slides = [
      { image: 'site_images/quadro_inter_1.jpg', alt: 'Quadro Inter con logo in rilievo', text: 'La squadra del cuore, in rilievo.', link: 'quadri.html', label: 'Scopri i quadri →' },
      { image: 'site_images/giochi-ambientati/ps5.webp', alt: 'Espositore per giochi PS5', text: 'I tuoi titoli preferiti, in primo piano.', link: 'espositori-giochi.html', label: 'Scopri gli espositori giochi →' },
      { image: 'site_images/console-ambientati/ps1.webp', alt: 'Stand PlayStation 1 senza console', text: 'Uno spazio speciale per la tua console.', link: 'espositori-console.html', label: 'Scopri gli stand console →' }
    ];
    const initial = hero.querySelector('img');
    const nextImage = initial.cloneNode(); nextImage.removeAttribute('fetchpriority'); nextImage.alt = ''; nextImage.setAttribute('aria-hidden', 'true');
    initial.classList.add('hero-slide'); nextImage.classList.add('hero-slide', 'is-hidden'); initial.after(nextImage);
    const layers = [initial, nextImage];
    const caption = hero.querySelector('figcaption span');
    const link = hero.querySelector('figcaption a');
    const button = hero.querySelector('[data-hero-pause]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = motion.matches, index = 0, active = 0, loading = false;
    const sync = () => { button.textContent = paused ? 'Avvia foto' : 'Pausa foto'; button.setAttribute('aria-pressed', String(paused)); };
    button.hidden = false; sync();
    button.addEventListener('click', () => { paused = !paused; sync(); });
    motion.addEventListener('change', event => { paused = event.matches; sync(); });
    setInterval(async () => {
      if (paused || loading || document.hidden || hero.matches(':hover, :focus-within')) return;
      loading = true;
      const nextIndex = (index + 1) % slides.length, slide = slides[nextIndex], target = layers[1 - active];
      target.src = slide.image;
      try {
        await target.decode();
        if (paused || document.hidden || hero.matches(':hover, :focus-within')) return;
        target.alt = slide.alt; target.removeAttribute('aria-hidden');
        layers[active].setAttribute('aria-hidden', 'true'); layers[active].classList.add('is-hidden'); target.classList.remove('is-hidden');
        caption.textContent = slide.text; link.href = slide.link; link.textContent = slide.label;
        active = 1 - active; index = nextIndex;
      } catch {} finally { loading = false; }
    }, 3000);
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

  const imageLinks = [...document.querySelectorAll('[data-product-image]')];
  if (imageLinks.length && typeof HTMLDialogElement !== 'undefined') {
    const dialog = document.createElement('dialog');
    dialog.className = 'product-zoom';
    dialog.setAttribute('aria-label', 'Immagine prodotto ingrandita');
    const close = document.createElement('button'); close.type = 'button';
    close.className = 'zoom-close'; close.textContent = 'Chiudi ×';
    const image = document.createElement('img');
    const caption = document.createElement('p');
    dialog.append(close, image, caption); document.body.append(dialog);
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      }
    });
    imageLinks.forEach(link => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      const original = link.querySelector('img');
      image.src = link.href; image.alt = original.alt;
      caption.textContent = original.alt;
      dialog.showModal();
    }));
  }

  const catalog = Array.isArray(window.PRINT_CATALOG) ? window.PRINT_CATALOG : [];
  const categoryCards = [...document.querySelectorAll('[data-category-slideshow]')];
  const motionButton = document.querySelector('#category-motion');
  if (categoryCards.length && motionButton) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    const slideshows = categoryCards.map(card => {
      const first = card.querySelector('img');
      const paintings = ['site_images/quadro_inter_1.jpg', 'site_images/quadro_milan_1.jpg', 'site_images/quadro_juve_1.jpg', 'site_images/quadro_napoli_1.jpg'];
      const sources = card.dataset.categorySlideshow === 'quadri' ? paintings.map(src => new URL(src, location.href).href) : [first.src, ...catalog.filter(product => product.type === card.dataset.categorySlideshow && !product.imageNote).map(product => new URL(product.image, location.href).href)];
      const images = [...new Set(sources)];
      const second = first.cloneNode(); second.alt = ''; second.setAttribute('aria-hidden', 'true');
      first.alt = card.dataset.categorySlideshow === 'quadri' ? 'Quadri con loghi di squadre stampati in 3D' : card.dataset.categorySlideshow === 'giochi' ? 'Espositori per giochi stampati in 3D' : 'Stand per console stampati in 3D, senza console';
      first.classList.add('category-slide'); second.classList.add('category-slide', 'is-hidden'); first.after(second);
      return { card, images, layers: [first, second], active: 0, index: 0, loading: false };
    });
    motionButton.hidden = false;
    const syncButton = () => { motionButton.textContent = paused ? 'Avvia foto' : 'Pausa foto'; motionButton.setAttribute('aria-pressed', String(paused)); };
    motionButton.addEventListener('click', () => { paused = !paused; syncButton(); });
    reducedMotion.addEventListener('change', event => { paused = event.matches; syncButton(); });
    syncButton();
    setInterval(() => {
      if (paused || document.hidden) return;
      slideshows.forEach(async show => {
        if (show.loading || show.images.length < 2 || show.card.matches(':hover, :focus-within')) return;
        show.loading = true;
        const nextIndex = (show.index + 1) % show.images.length;
        const next = show.layers[1 - show.active];
        next.src = show.images[nextIndex];
        try {
          await next.decode();
          if (!paused && !document.hidden) {
            next.classList.remove('is-hidden'); show.layers[show.active].classList.add('is-hidden');
            show.active = 1 - show.active; show.index = nextIndex;
          }
        } catch { show.index = nextIndex; }
        finally { show.loading = false; }
      });
    }, 5000);
  }
  const money = cents => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  const discountFor = count => count >= 5 ? 20 : count >= 3 ? 10 : 0;
  const normaliseItems = raw => {
    const quantities = new Map();
    if (!Array.isArray(raw)) return [];
    raw.slice(0, 100).forEach(row => {
      if (!Array.isArray(row)) return;
      const product = catalog.find(item => item.id === row[0]);
      const quantity = Number(row[1]);
      if (product && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99) {
        quantities.set(product.id, Math.min(99, (quantities.get(product.id) || 0) + quantity));
      }
    });
    return catalog.filter(item => quantities.has(item.id)).map(product => ({ product, quantity: quantities.get(product.id) }));
  };
  const totalsFor = items => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const rate = discountFor(count);
    const complete = items.every(item => Number.isInteger(item.product.price));
    const gross = items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
    const discount = Math.round(gross * rate / 100);
    return { count, rate, complete, gross, discount, net: gross - discount };
  };

  const builder = document.querySelector('#set-builder');
  if (builder) {
    const list = document.querySelector('#set-products');
    const amounts = new Map();
    catalog.forEach(product => {
      const row = document.createElement('article'); row.className = 'set-product'; row.dataset.type = product.type;
      const image = document.createElement('img'); image.src = product.image; image.alt = ''; image.width = 88; image.height = 88; image.loading = 'lazy';
      const info = document.createElement('div');
      const title = document.createElement('h3'); title.textContent = product.name;
      const price = document.createElement('p'); price.textContent = Number.isInteger(product.price) ? money(product.price) + ' / pezzo · PLA' : 'Prezzo da definire · PLA';
      info.append(title, price);
      if (product.imageNote) { const note = document.createElement('p'); note.textContent = product.imageNote; info.append(note); }
      const label = document.createElement('label'); label.textContent = 'Quantità';
      const input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.max = '99'; input.value = '0'; input.inputMode = 'numeric'; input.dataset.productId = product.id; input.setAttribute('aria-label', 'Quantità ' + product.name);
      amounts.set(product.id, input); label.append(input); row.append(image, info, label); list.append(row);
      input.addEventListener('input', updateSet);
    });
    function updateSet() {
      const items = normaliseItems([...amounts].map(([id, input]) => [id, Number(input.value)]));
      const totals = totalsFor(items);
      document.querySelector('#set-selection').value = JSON.stringify(items.map(item => [item.product.id, item.quantity]));
      const lines = document.querySelector('#set-lines'); lines.replaceChildren();
      if (!items.length) { const empty = document.createElement('p'); empty.textContent = 'Scegli almeno un supporto per iniziare.'; lines.append(empty); }
      items.forEach(({ product, quantity }) => {
        const line = document.createElement('div'); line.className = 'set-summary-line';
        const name = document.createElement('span'); name.textContent = quantity + ' × ' + product.name;
        const value = document.createElement('strong'); value.textContent = Number.isInteger(product.price) ? money(product.price * quantity) : 'Da definire';
        line.append(name, value); lines.append(line);
      });
      amounts.forEach((input, id) => input.closest('.set-product').classList.toggle('is-selected', items.some(item => item.product.id === id)));
      const panel = document.querySelector('#set-totals'); panel.replaceChildren();
      const add = (label, value, cls = '') => { const row = document.createElement('p'); row.className = cls; const text = document.createElement('span'); text.textContent = label; const amount = document.createElement('strong'); amount.textContent = value; row.append(text, amount); panel.append(row); };
      add('Supporti selezionati', String(totals.count));
      if (totals.count && totals.complete) {
        add('Subtotale', money(totals.gross));
        add('Sconto ' + totals.rate + '%', '−' + money(totals.discount), 'discount-value');
        add('Totale supporti', money(totals.net), 'set-grand-total');
        add('Spedizione', 'Esclusa');
      } else if (totals.count) {
        add('Sconto previsto', totals.rate + '% sui supporti');
        const note = document.createElement('p'); note.textContent = 'Il totale sarà disponibile quando saranno definiti tutti i prezzi.'; panel.append(note);
      }
      if (totals.count && totals.count < 3) { const note = document.createElement('p'); note.className = 'set-saving-hint'; note.textContent = 'Aggiungi ' + (3 - totals.count) + ' support' + (3 - totals.count === 1 ? 'o' : 'i') + ' per lo sconto del 10%.'; panel.append(note); }
      if (totals.count >= 3 && totals.count < 5) { const note = document.createElement('p'); note.className = 'set-saving-hint'; note.textContent = 'Con ' + (5 - totals.count) + ' pezz' + (5 - totals.count === 1 ? 'o' : 'i') + ' in più passi al 20%.'; panel.append(note); }
      document.querySelector('#set-submit').disabled = !items.length;
    }
    const tabs = [...document.querySelectorAll('[data-set-type]')];
    const showType = type => { tabs.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.setType === type))); list.querySelectorAll('.set-product').forEach(row => row.hidden = row.dataset.type !== type); };
    tabs.forEach(button => button.addEventListener('click', () => showType(button.dataset.setType)));
    showType(new URLSearchParams(location.search).get('tipo') === 'console' ? 'console' : 'giochi');
    builder.addEventListener('submit', event => { updateSet(); if (!normaliseItems(JSON.parse(document.querySelector('#set-selection').value)).length) { event.preventDefault(); document.querySelector('#set-error').textContent = 'Scegli almeno un supporto.'; } });
    updateSet();
  }

  const selection = document.querySelector('#request-selection');
  const params = new URLSearchParams(location.search);
  const product = params.get('prodotto');
  if (selection && product && product.trim()) {
    const name = product.trim().slice(0, 140);
    let chosen = [];
    try { chosen = normaliseItems(JSON.parse((params.get('selezione') || '[]').slice(0, 10000))); } catch {}
    selection.hidden = false;
    document.querySelector('#selected-title').textContent = name;
    if (/^Set /i.test(name) && !chosen.length) {
      const notice = document.createElement('p'); notice.textContent = 'Per preparare un preventivo completo, scegli prima i modelli e le quantità del tuo set.';
      const link = document.createElement('a'); link.className = 'btn btn-primary'; link.href = 'componi-set.html'; link.textContent = 'Scegli i supporti del set →';
      document.querySelector('#selected-details').append(notice, link);
      document.querySelector('#copy-product').hidden = true;
      document.querySelector('#email-selection').hidden = true;
      return;
    }
    const rows = [];
    if (chosen.length) {
      rows.push(['Composizione', chosen.map(({ product, quantity }) => quantity + ' × ' + product.name + (Number.isInteger(product.price) ? ' — ' + money(product.price) + '/pezzo' : '')).join('\n')]);
      const totals = totalsFor(chosen);
      rows.push(['Quantità totale', String(totals.count)]);
      if (totals.complete) rows.push(['Subtotale supporti', money(totals.gross)], ['Sconto ' + totals.rate + '%', '−' + money(totals.discount)], ['Totale supporti', money(totals.net)], ['Spedizione', 'Esclusa, da confermare nel preventivo']);
      else rows.push(['Sconto previsto', totals.rate + '% sui supporti; prezzo finale da definire']);
    }
    const fields = [['variante', 'Versione'], ['quantita', 'Quantità'], ['colori', 'Colori'], ['preferenze', 'Preferenze colore'], ['materiale', 'Materiale']];
    fields.forEach(([key, label]) => {
      const value = (params.get(key) || '').trim().slice(0, key === 'preferenze' ? 1000 : 200);
      if (key === 'quantita' && (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 999)) return;
      if (value) rows.push([label, value]);
    });
    const quantity = Number(params.get('quantita'));
    const variant = params.get('variante') || '';
    const lookupName = name === 'Stand PS2 Slim / Fat' ? (variant === 'Slim' ? 'Stand PS2 Slim' : variant === 'Fat (PS2 originale)' ? 'Stand PS2 Fat' : 'Stand ' + variant) : name;
    const unit = catalog.find(item => item.name === lookupName && Number.isInteger(item.price));
    if (!chosen.length && unit && Number.isInteger(quantity) && quantity >= 1 && quantity <= 999) {
      const totals = totalsFor([{ product: unit, quantity }]);
      rows.push(['Prezzo unitario standard', money(unit.price)], ['Subtotale supporti', money(totals.gross)], ['Sconto ' + totals.rate + '%', '−' + money(totals.discount)], ['Totale supporti', money(totals.net)], ['Spedizione', 'Esclusa, da confermare nel preventivo']);
    }
    const summary = ['Prodotto: ' + name, ...rows.map(([label, value]) => label + ': ' + value)].join('\n');
    const details = document.querySelector('#selected-details');
    rows.forEach(([label, value]) => { const item = document.createElement('div'); const term = document.createElement('dt'); term.textContent = label; const description = document.createElement('dd'); description.textContent = value; item.append(term, description); details.append(item); });
    const fullText = document.createElement('textarea'); fullText.readOnly = true; fullText.rows = Math.min(16, summary.split('\n').length + 1); fullText.value = summary; fullText.className = 'request-full-text'; fullText.setAttribute('aria-label', 'Testo completo della richiesta');
    details.after(fullText);
    document.querySelector('#email-selection').href = 'mailto:print3d4you.project@gmail.com?subject=' + encodeURIComponent('Richiesta preventivo — ' + name) + '&body=' + encodeURIComponent('Ciao DAMA_Lab, vorrei un preventivo per:\n\n' + summary + '\n\nAltre informazioni e località di consegna:\n');
    document.querySelector('#copy-product').addEventListener('click', async () => {
      const status = document.querySelector('#copy-status');
      try { await navigator.clipboard.writeText(summary); status.textContent = 'Richiesta completa copiata: incollala nel modulo.'; }
      catch { fullText.focus(); fullText.select(); status.textContent = 'Testo selezionato: premi Ctrl+C (o Copia) e incollalo nel modulo.'; }
    });
  }

})();
