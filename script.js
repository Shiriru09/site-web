
  /* ── Tabs mods ─────────────────────────────────── */
  function switchTab(btn, tabId) {
    document.querySelectorAll('.mods-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mods-tab-content').forEach(t => t.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.remove('hidden');
    const placeholder = document.getElementById('mods-placeholder');
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
    document.querySelectorAll('.galerie-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.galerie-content').forEach(t => t.classList.add('hidden'));
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
        <img src="${p.url}" alt="${p.description || p.auteur}" loading="lazy"
             onerror="this.onerror=null;this.src='';this.closest('.galerie-card').querySelector('.galerie-img-placeholder').style.display='flex';this.style.display='none';">
        <div class="galerie-img-placeholder" style="display:none;height:200px;align-items:center;justify-content:center;flex-direction:column;gap:8px;background:rgba(201,168,76,.04);border-bottom:1px solid rgba(201,168,76,.1);">
          <span style="font-size:32px;opacity:.4;">🏹</span>
          <span style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:#8A7F65;text-transform:uppercase;">Image expirée</span>
        </div>
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

  /* ── Fetch Discord members + maps + galerie ─────── */
  async function fetchDiscordStats() {
    try {
      const res = await fetch('https://discord-members.desmetcyrille9.workers.dev/?t=' + Date.now());
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
      }

    } catch(e) {
      document.getElementById('stat-members').textContent = '142';
    }
  }
  fetchDiscordStats();
  setInterval(fetchDiscordStats, 2 * 60 * 1000);
