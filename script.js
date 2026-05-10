  /* ── Plugin accordion ──────────────────────────── */
  function togglePlugin(btn) {
    const card = btn.closest('.plugin-card');
    const body = card.querySelector('.plugin-acc-body');
    const isOpen = body.classList.contains('open');

    // Ferme tous les autres accordéons ouverts
    document.querySelectorAll('.plugin-acc-body.open').forEach(function(b) {
      b.classList.remove('open');
      var sibBtn = b.previousElementSibling;
      if (sibBtn && sibBtn.classList.contains('plugin-acc-btn')) {
        sibBtn.classList.remove('open');
        sibBtn.textContent = 'En savoir plus ▼';
      }
    });

    // Ouvre ou referme la carte cliquée
    if (!isOpen) {
      body.classList.add('open');
      btn.classList.add('open');
      btn.textContent = 'Réduire ▲';
    }
  }

  /* ── Tabs mods ─────────────────────────────────── */
  function switchTab(btn, tabId) {
    const isActive = btn.classList.contains('active');
    document.querySelectorAll('.mods-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mods-tab-content').forEach(t => t.classList.add('hidden'));
    const placeholder = document.getElementById('mods-placeholder');
    if (isActive) { if (placeholder) placeholder.style.display = ''; return; }
    btn.classList.add('active');
    document.getElementById(tabId).classList.remove('hidden');
    if (placeholder) placeholder.style.display = 'none';
  }

  /* ── Accordion règlement ───────────────────────── */
  function toggleAccord(btn) {
    const body = btn.nextElementSibling;
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    btn.classList.toggle('active', !isOpen);
  }
  /* Open first section by default */
  document.querySelector('.accord-head').classList.add('active');

  /* ── Braises animées ───────────────────────────── */
  const container = document.getElementById('embers');
  for (let i = 0; i < 30; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    e.style.cssText = [
      `left:${10 + Math.random() * 80}%`,
      `bottom:${Math.random() * 20}%`,
      `--d:${5 + Math.random() * 8}s`,
      `--delay:-${Math.random() * 8}s`,
      `--dx:${(Math.random() - .5) * 80}px`,
      `width:${2 + Math.random() * 3}px`,
      `height:${2 + Math.random() * 3}px`,
      `opacity:0`
    ].join(';');
    container.appendChild(e);
  }

  /* ── Discord OAuth2 ────────────────────────────── */
  // ✏️ Remplacez cette valeur par votre vrai Client ID Discord
  const DISCORD_CLIENT_ID = '1502032552368541816';
  const DISCORD_REDIRECT   = 'https://valhallark.netlify.app/callback';

  function handleDiscordLogin() {
    const params = new URLSearchParams({
      client_id:     DISCORD_CLIENT_ID,
      redirect_uri:  DISCORD_REDIRECT,
      response_type: 'code',
      scope:         'identify guilds',
    });
    window.location.href = 'https://discord.com/api/oauth2/authorize?' + params.toString();
  }

  /* ── Stats Discord (optionnel — nécessite un bot) ─
     Décommentez et remplacez GUILD_ID + TOKEN par
     ceux de votre bot pour afficher les vrais chiffres.
  ──────────────────────────────────────────────────
  async function fetchStats() {
    const GUILD_ID = 'VOTRE_GUILD_ID';
    const BOT_TOKEN = 'VOTRE_BOT_TOKEN'; // ⚠️ ne jamais exposer côté client en prod
    const res = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });
    const data = await res.json();
    document.getElementById('stat-members').textContent = data.approximate_member_count?.toLocaleString() ?? '—';
    document.getElementById('stat-online').textContent  = data.approximate_presence_count?.toLocaleString() ?? '—';
  }
  fetchStats();
  */

  /* ── Galerie ────────────────────────────────────── */
  function switchGalerie(btn, tabId) {
    const isActive = btn.classList.contains('active');
    document.querySelectorAll('.galerie-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.galerie-content').forEach(t => t.classList.add('hidden'));
    if (isActive) return;
    btn.classList.add('active');
    document.getElementById(tabId).classList.remove('hidden');
  }

  function renderGalerie(photos, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    if (!photos || photos.length === 0) {
      grid.innerHTML = '<div class="galerie-empty">📸 Aucune photo pour l\'instant.<br>Postez vos captures sur Discord !</div>';
      return;
    }
    grid.innerHTML = photos.map(p => `
      <div class="galerie-card" onclick="openLightbox('${p.url}','${p.auteur}','${p.description}')">
        <img src="${p.url}" alt="${p.description || p.auteur}" loading="lazy">
        <div class="galerie-info">
          <div class="galerie-auteur">${p.auteur}</div>
          ${p.description ? `<div class="galerie-desc">${p.description}</div>` : ''}
          <div class="galerie-date">📅 ${p.date}</div>
        </div>
      </div>
    `).join('');
  }

  function openLightbox(url, auteur, desc) {
    document.getElementById('lightbox-img').src = url;
    document.getElementById('lightbox-info').textContent = auteur + (desc ? ' — ' + desc : '');
    document.getElementById('lightbox').classList.add('open');
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.getElementById('lightbox-img').src = '';
  }

  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });

  /* ── Hamburger ─────────────────────────────────── */
  (function(){
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    }));
  })();

  /* ── Fetch Discord members + maps + galerie ─────── */
  async function fetchDiscordStats() {
    try {
      const res = await fetch('https://discord-members.desmetcyrille9.workers.dev/');
      const data = await res.json();

      // Membres
      if (data.members) {
        document.getElementById('stat-members').textContent = data.members.toLocaleString();
      }

      // Statut des maps
      if (data.maps) {
        data.maps.forEach(map => {
          document.querySelectorAll('.map-card').forEach(card => {
            const nameEl = card.querySelector('.map-name');
            if (nameEl && nameEl.textContent.trim().toLowerCase() === map.name.toLowerCase()) {
              const badge = card.querySelector('.map-badge');
              if (map.online) {
                card.dataset.status = 'online';
                card.style.opacity = '1';
                if (badge) { badge.textContent = 'En ligne'; badge.className = 'map-badge online'; }
              } else {
                card.dataset.status = 'offline';
                card.style.opacity = '0.5';
                if (badge) { badge.textContent = 'Hors ligne'; badge.className = 'map-badge offline'; }
              }
            }
          });
        });
      }

      // Galerie
      if (data.galerie) {
        renderGalerie(data.galerie.dinos,      'grid-dinos');
        renderGalerie(data.galerie.bases,       'grid-bases');
        renderGalerie(data.galerie.evenements,  'grid-evenements');
        renderGalerie(data.galerie.paysages,     'grid-paysages');
      }

    } catch(e) {
      document.getElementById('stat-members').textContent = '142';
    }
  }
  fetchDiscordStats();
  setInterval(fetchDiscordStats, 24 * 60 * 60 * 1000);

  /* ── FAQ accordion ─────────────────────────────────── */
  function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    document.querySelectorAll('.faq-q').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
  }

  /* ── Fade-in on scroll (IntersectionObserver) ───────── */
  (function(){
    const targets = document.querySelectorAll('.plugin-card, .stat-box, .mod-card, .rates-card, .features-card, .faq-item, .map-card');
    targets.forEach(el => el.classList.add('fade-in'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    targets.forEach(el => obs.observe(el));
  })();


  /* ── Loading screen ────────────────────────────────────── */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => loader.classList.add('hidden'), 1300);
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  });

  /* ── Back to top ───────────────────────────────────────── */
  (function(){
    const btn = document.getElementById('back-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  })();

  /* ── Son ambiance viking ────────────────────────────────── */
  (function(){
    const btn    = document.getElementById('sound-btn');
    const audio  = document.getElementById('ambient-audio');
    const slider  = document.getElementById('sound-slider');
    const volLabel = document.getElementById('sound-vol');
    function updateVolLabel() {
      if (volLabel) volLabel.textContent = Math.round(audio.volume * 100) + '%';
    }
    if (!btn || !audio) return;

    let lastVol = 0.08;
    audio.volume = 0.08;
    if (slider) slider.value = 0.08;
    let started = false;

    function updateIcon() {
      btn.textContent = audio.volume > 0 ? '🔊' : '🔇';
    }

    function onPlaying() {
      started = true;
      updateIcon();
      btn.classList.add('playing');
    }

    // Slider : change volume en temps réel
    if (slider) {
      slider.addEventListener('input', function() {
        audio.volume = parseFloat(slider.value);
        if (audio.volume > 0) lastVol = audio.volume;
        updateVolLabel();
        updateIcon();
        if (!started && audio.volume > 0) {
          audio.play().then(function() { started = true; btn.classList.add('playing'); }).catch(function(){});
        }
      });
    }

    // Tentative de lecture immédiate au chargement
    audio.play().then(onPlaying).catch(function() {
      ['click', 'scroll'].forEach(function(evt) {
        window.addEventListener(evt, function handler() {
          if (started) { window.removeEventListener(evt, handler); return; }
          audio.play().then(onPlaying).catch(function(e) { console.warn('Audio:', e); });
          window.removeEventListener(evt, handler);
        }, { once: true, passive: true });
      });
    });

    // Bouton : mute / unmute
    btn.addEventListener('click', async function(e) {
      e.stopPropagation();
      if (audio.volume > 0) {
        lastVol = audio.volume;
        audio.volume = 0;
        if (slider) slider.value = 0;
        btn.textContent = '🔇';
        btn.classList.remove('playing');
      } else {
        audio.volume = lastVol || 0.08;
        if (slider) slider.value = audio.volume;
        updateIcon();
        try {
          await audio.play();
          started = true;
          btn.classList.add('playing');
        } catch(err) { console.warn('Audio:', err); }
      }
    });
  })();