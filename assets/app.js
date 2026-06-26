/*
 * app.js — 共用互動與渲染
 *   - 導覽：標記目前頁、手機選單收合（no-JS 時選單預設展開仍可用）
 *   - 內容：依 data-render 把 data.js 的資料渲染進對應容器
 *   - 天氣：Open-Meteo 免金鑰 API，取不到時用 data.js 的快照
 *   - 倒數：距離全馬日的天數
 * JavaScript 只負責增強，導覽與頁面標題在沒有 JS 時仍可閱讀。
 */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  const D = window.TRIP_DATA || {};
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const fmtDate = (iso) => {
    const m = String(iso).match(/(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${+m[2]}/${+m[3]}` : iso;
  };

  /* ---------------------------------------------------------------- Nav */
  function initNav() {
    const toggle = $('.nav-toggle');
    const links = $('.nav-links');
    if (toggle && links) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', () => {
        const open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      $$('a', links).forEach((a) =>
        a.addEventListener('click', () => {
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        })
      );
    }
    // 標記目前頁
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-links a').forEach((a) => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === here || (here === '' && href === 'index.html')) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------------------------------------------------------------- Countdown */
  function initCountdown() {
    const box = $('[data-countdown]');
    if (!box || !D.trip) return;
    const target = new Date(D.trip.marathonDate + 'T07:00:00+10:00');
    const now = new Date();
    const days = Math.ceil((target - now) / 86400000);
    const numEl = $('strong', box);
    const lblEl = $('span', box);
    if (days > 0) {
      numEl.textContent = days;
      lblEl.textContent = '天後 全馬';
    } else if (days === 0) {
      numEl.textContent = '今天';
      lblEl.textContent = '全馬日';
    } else {
      numEl.textContent = '✓';
      lblEl.textContent = '已完賽';
    }
    box.hidden = false;
  }

  /* ---------------------------------------------------------------- Weather */
  const WMO = {
    0: ['☀️', '晴'], 1: ['🌤️', '大致晴'], 2: ['⛅', '局部多雲'], 3: ['☁️', '陰'],
    45: ['🌫️', '霧'], 48: ['🌫️', '霧凇'],
    51: ['🌦️', '毛毛雨'], 53: ['🌦️', '毛毛雨'], 55: ['🌧️', '毛毛雨偏多'],
    61: ['🌧️', '小雨'], 63: ['🌧️', '中雨'], 65: ['🌧️', '大雨'],
    71: ['🌨️', '小雪'], 73: ['🌨️', '中雪'], 75: ['❄️', '大雪'],
    80: ['🌦️', '陣雨'], 81: ['🌧️', '陣雨'], 82: ['⛈️', '強陣雨'],
    95: ['⛈️', '雷雨'], 96: ['⛈️', '雷雨夾雹'], 99: ['⛈️', '強雷雨'],
  };
  const wmo = (c) => WMO[c] || ['🌡️', '—'];

  async function fetchWeather(loc) {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=Australia/Brisbane&start_date=${D.trip.dateStart}&end_date=${D.trip.dateEnd}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('weather http ' + res.status);
    const j = await res.json();
    const d = j.daily;
    return d.time.map((t, i) => ({
      date: t,
      code: d.weather_code[i],
      max: d.temperature_2m_max[i],
      min: d.temperature_2m_min[i],
      rain: d.precipitation_probability_max[i],
      wind: d.wind_speed_10m_max[i],
    }));
  }

  function weatherCardHTML(row, isMarathon) {
    if (!row || row.max == null) {
      return `<div class="wcard wcard--pending"><div class="wcard__date">${esc(fmtDate(row ? row.date : ''))}</div>
        <div class="wcard__icon">🗓️</div><div class="wcard__temp">待更新</div></div>`;
    }
    const [icon, label] = wmo(row.code);
    return `<div class="wcard${isMarathon ? ' is-marathon' : ''}">
      <div class="wcard__date">${esc(fmtDate(row.date))}${isMarathon ? ' · 全馬' : ''}</div>
      <div class="wcard__icon" title="${esc(label)}">${icon}</div>
      <div class="wcard__temp">${Math.round(row.max)}°<small>/${Math.round(row.min)}°</small></div>
      <div class="wcard__sub">${esc(label)} · ☔${row.rain == null ? '—' : row.rain + '%'}</div>
    </div>`;
  }

  async function renderWeather(node) {
    const W = D.weather;
    const which = node.getAttribute('data-loc') || 'gold-coast';
    const loc = (W.locations || []).find((l) => l.key === which) || W.locations[0];
    // 先用快照畫，避免空白；API 成功再覆蓋
    const draw = (rows) => {
      const strip = el('div', 'weather-strip');
      rows.forEach((r) => {
        const isM = r.date === D.trip.marathonDate && which === 'gold-coast';
        strip.insertAdjacentHTML('beforeend', weatherCardHTML(r, isM));
      });
      node.innerHTML = '';
      node.appendChild(strip);
    };
    const snap = (W.snapshot && W.snapshot[which]) || [];
    if (snap.length) draw(snap);
    try {
      const rows = await fetchWeather(loc);
      draw(rows);
      const stamp = node.parentElement && $('[data-weather-stamp]', node.parentElement.closest('section') || document);
      if (stamp) stamp.textContent = '天氣即時更新：' + new Date().toLocaleString('zh-TW', { timeZone: 'Australia/Brisbane' });
    } catch (e) {
      // 維持快照，標示更新時間
      const stamp = $('[data-weather-stamp]');
      if (stamp && !snap.length) node.innerHTML = '<div class="empty-state">目前無法取得天氣，請稍後再試。</div>';
    }
  }

  /* ---------------------------------------------------------------- Renderers */
  const renderers = {
    quicklinks(node) {
      const items = [
        ['itinerary.html', '🗺️', '行程', '7/02–7/08 每日安排'],
        ['intel.html', '🧭', '行前情報', '航班 · 飯店 · 景點 · 購物'],
        ['race.html', '🏃', '馬拉松', '全馬 42K 賽前到賽後'],
        ['journal.html', '📔', '旅行日誌', '每天慢慢補的手帳'],
        ['checklist.html', '✅', '出發清單', '打包與入境提醒'],
        ['budget.html', '💰', '財務', '分類總額'],
      ];
      const grid = el('div', 'quick-grid');
      items.forEach(([href, icon, t, s]) => {
        const a = el('a', 'quick-card');
        a.href = href;
        a.innerHTML = `<span class="quick-card__icon">${icon}</span><strong>${t}</strong><span>${esc(s)}</span>`;
        grid.appendChild(a);
      });
      node.appendChild(grid);
    },

    highlights(node) {
      const t = D.trip, f = D.flights.segments;
      const cards = [
        ['🛫 航班', `${esc(f[0].code)} / ${esc(f[1].code)}`, `${esc(f[0].from)} ⇄ ${esc(f[1].to)}`],
        ['🏨 住宿', '2 間飯店', D.hotels.map((h) => h.city).join(' · ')],
        ['🏙️ 城市', t.cities.length + ' 座城市', t.cities.join(' · ')],
        ['🏅 比賽日', '7/05 全馬 42K', 'ASICS Gold Coast Marathon'],
      ];
      const grid = el('div', 'card-grid card-grid--2');
      cards.forEach(([h, big, sub]) => {
        grid.appendChild(
          el('div', 'card', `<div class="eyebrow">${h}</div>
            <div style="font-size:var(--text-xl);font-weight:750;margin-top:.4rem">${esc(big)}</div>
            <div style="color:var(--track-soft);margin-top:.2rem">${esc(sub)}</div>`)
        );
      });
      node.appendChild(grid);
    },

    itinerary(node) {
      const ol = el('ol', 'timeline');
      D.itinerary.forEach((d) => {
        const li = el('li', 'day' + (d.highlight ? ' day--highlight' : ''));
        const acts = d.activities.map((a) => `<li>${esc(a)}</li>`).join('');
        li.innerHTML =
          `<div class="day__date">${esc(fmtDate(d.date))}<br>${esc(d.weekday)}</div>
          <div class="day__card">
            <div class="day__head">
              <div><span class="day__city">${esc(d.city)}</span></div>
              <span class="chip ${d.highlight ? 'chip--sun' : ''}">${esc(d.tag)}</span>
            </div>
            <p class="day__summary">${esc(d.summary)}</p>
            <div class="day__body">
              <ul class="day__acts">${acts}</ul>
              <div class="day__meta"><span>🍽️ <b>餐食</b> ${esc(d.meals)}</span><span>🛏️ <b>住宿</b> ${esc(d.stay)}</span></div>
              <p class="day__notes">${esc(d.notes)}</p>
            </div>
          </div>`;
        ol.appendChild(li);
      });
      node.appendChild(ol);
    },

    flights(node) {
      const f = D.flights;
      const grid = el('div', 'card-grid card-grid--2');
      f.segments.forEach((s) => {
        grid.appendChild(
          el('div', 'card',
            `<div class="day__head"><span class="chip chip--track">${esc(s.dir)}</span><strong style="font-family:var(--font-num);font-size:var(--text-xl)">${esc(s.code)}</strong></div>
            <div style="font-size:var(--text-lg);font-weight:700;margin-top:.6rem">${esc(s.from)} → ${esc(s.to)}</div>
            <div class="kv" style="margin-top:.8rem">
              <div class="kv__row"><dt>航空</dt><dd style="font-family:var(--font)">${esc(s.airline)}</dd></div>
              <div class="kv__row"><dt>起飛</dt><dd>${esc(s.depart)}</dd></div>
              <div class="kv__row"><dt>抵達</dt><dd>${esc(s.arrive)}</dd></div>
            </div>`)
        );
      });
      node.appendChild(grid);

      const manual = el('div', 'card');
      manual.style.marginTop = 'var(--space-4)';
      manual.innerHTML =
        `<div class="eyebrow">出發前查詢</div>
         <p class="section-lead" style="font-size:var(--text-base)">${esc(f.note)}</p>
         <dl class="kv" style="margin-top:.8rem">` +
        f.manualFields.map((m) =>
          `<div class="kv__row"><dt>${esc(m.label)}</dt><dd class="${m.value ? '' : 'empty'}">${m.value ? esc(m.value) : '出發前查詢'}</dd></div>`
        ).join('') +
        `</dl>
         <div class="link-row" style="margin-top:1rem">` +
        f.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('') +
        `</div>`;
      node.appendChild(manual);

      const tips = el('div', 'card');
      tips.style.marginTop = 'var(--space-4)';
      tips.innerHTML =
        `<div class="eyebrow">座位建議</div><ul class="note-list" style="margin-top:.6rem">` +
        f.seatTips.map((t) => `<li>${esc(t)}</li>`).join('') + `</ul>`;
      node.appendChild(tips);
    },

    hotels(node) {
      const grid = el('div', 'card-grid card-grid--2');
      D.hotels.forEach((h) => {
        grid.appendChild(
          el('div', 'card',
            `<span class="chip">${esc(h.city)}</span>
             <h3 style="font-size:var(--text-lg);margin-top:.5rem">${esc(h.name)}</h3>
             <div class="updated-stamp" style="margin-top:.2rem">${esc(h.nights)}</div>
             <div style="font-size:var(--text-sm);color:var(--track-soft);margin-top:.3rem">📍 ${esc(h.address)}</div>
             <ul class="tag-list" style="margin-top:.8rem">${h.facilities.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
             <ul class="note-list" style="margin-top:.8rem">${h.reminders.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
             <div class="link-row" style="margin-top:.8rem">${h.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>`)
        );
      });
      node.appendChild(grid);
    },

    sights(node) {
      const grid = el('div', 'card-grid card-grid--3');
      D.intel.sights.forEach((s) => {
        grid.appendChild(
          el('div', 'card',
            `<span class="chip">${esc(s.city)}</span>
             <h3 style="font-size:var(--text-lg);margin-top:.5rem">${esc(s.name)}</h3>
             <ul class="note-list" style="margin-top:.6rem">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
             ${s.info ? `<p style="font-size:var(--text-sm);color:var(--track-soft);margin-top:.5rem;border-top:1px dashed var(--line);padding-top:.5rem">⏰ ${esc(s.info)}</p>` : ''}
             ${s.link ? `<div class="link-row" style="margin-top:.8rem"><a href="${esc(s.link)}" target="_blank" rel="noopener">官方資訊</a></div>` : ''}`)
        );
      });
      node.appendChild(grid);
    },

    shopping(node) {
      const grid = el('div', 'card-grid card-grid--2');
      D.intel.shopping.forEach((s) => {
        const picks = s.picks.map((p) =>
          `<div class="kv__row"><dt>${esc(p.label)}</dt><dd style="font-family:var(--font);font-weight:600;text-align:right">${esc(p.stores)}</dd></div>`
        ).join('');
        grid.appendChild(
          el('div', 'card',
            `<span class="chip chip--sun">${esc(s.type)}</span>
             <h3 style="font-size:var(--text-lg);margin-top:.5rem">${esc(s.name)}</h3>
             <p style="color:var(--track-soft);font-size:var(--text-sm);margin-top:.4rem">${esc(s.note)}</p>
             <dl class="kv" style="margin-top:.8rem">${picks}</dl>
             <div class="link-row" style="margin-top:.8rem">
               <a href="${esc(s.home)}" target="_blank" rel="noopener">官方首頁</a>
               <a href="${esc(s.directory)}" target="_blank" rel="noopener">店家目錄</a>
             </div>`)
        );
      });
      node.appendChild(grid);
      const stamp = el('p', 'updated-stamp');
      stamp.style.marginTop = 'var(--space-4)';
      stamp.textContent = `最後更新：${D.intel.shoppingUpdated}　${D.intel.shoppingDisclaimer}`;
      node.appendChild(stamp);
    },

    'local-info'(node) {
      const grid = el('div', 'card-grid card-grid--2');
      D.intel.localInfo.items.forEach((it) =>
        grid.appendChild(el('div', 'card',
          `<div class="eyebrow">${esc(it.label)}</div><p style="margin-top:.5rem;color:var(--track-soft)">${esc(it.text)}</p>`)));
      node.appendChild(grid);
    },

    transport(node) {
      const tp = D.intel.transport;
      const grid = el('div', 'card-grid card-grid--2');
      tp.items.forEach((it) =>
        grid.appendChild(el('div', 'card',
          `<div class="eyebrow">${esc(it.label)}</div><p style="margin-top:.5rem;color:var(--track-soft)">${esc(it.text)}</p>`)));
      node.appendChild(grid);
      const n = el('p', 'private-note');
      n.style.marginTop = 'var(--space-4)';
      n.textContent = tp.note;
      node.appendChild(n);
    },

    'race-clothing'(node) {
      const cl = D.race.clothing;
      if (!cl) return;
      node.innerHTML =
        `<div class="card"><div class="eyebrow">🧥 ${esc(cl.title)}</div>
          <p class="updated-stamp" style="margin-top:.3rem">${esc(cl.sub)}</p>
          <ul class="note-list" style="margin-top:.6rem">${cl.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
    },

    'race-splits'(node) {
      const s = D.race.splits;
      if (!s) return;
      const rows = s.rows.map((r) =>
        `<div class="kv__row"><dt style="font-weight:700;color:var(--track)">${esc(r.km)}</dt><dd style="display:flex;gap:1rem;flex-wrap:wrap"><span>累計 ${esc(r.cum)}</span><span style="color:var(--track-soft)">${esc(r.clock)}</span></dd></div>`).join('');
      node.innerHTML =
        `<div class="card">
          <div class="eyebrow">⏱️ 分段關門參考 · ${esc(s.pace)}</div>
          <dl class="kv" style="margin-top:.6rem">${rows}</dl>
          <p style="margin-top:.6rem;font-size:var(--text-sm);color:var(--track-soft)">${esc(s.note)}</p>
        </div>`;
    },

    'must-do'(node) {
      const e = D.essentials;
      if (!e) return;
      node.innerHTML =
        `<div class="card" style="border-color:var(--warn);background:linear-gradient(160deg,#fdeee6,var(--paper))">
          <div class="eyebrow" style="color:var(--warn)">🚨 出發前一定要做</div>
          <ul class="note-list" style="margin-top:.6rem">${e.mustDo.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>`;
    },

    'trip-notes'(node) {
      const e = D.essentials;
      if (!e) return;
      const card = (eyebrow, body) => `<div class="card"><div class="eyebrow">${eyebrow}</div>${body}</div>`;
      node.innerHTML =
        `<div class="card-grid card-grid--2">
          ${card('🧳 集合 & 行李', `<p style="margin-top:.5rem">${esc(e.gather)}</p><p style="margin-top:.5rem;color:var(--track-soft);font-size:var(--text-sm)">${esc(e.baggage)}</p>`)}
          ${card('🕑 時差 & 緊急', `<p style="margin-top:.5rem">${esc(e.timezone)}</p><p style="margin-top:.5rem;color:var(--track-soft);font-size:var(--text-sm)">${esc(e.emergency)}</p>`)}
          ${card('💳 團費不含（要另付）', `<ul class="note-list" style="margin-top:.5rem">${e.feeExcludes.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`)}
          ${card('🎁 贈送好禮', `<ul class="note-list" style="margin-top:.5rem">${e.gifts.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`)}
        </div>`;
    },

    weather: renderWeather,

    'weather-banner'(node) {
      const r = D.weather.marathonReminder;
      node.innerHTML =
        `<div class="weather-banner">
          <div class="weather-banner__icon">🥶</div>
          <div><div class="weather-banner__title">全馬日天氣提醒 · ${esc(fmtDate(r.date))}</div>
          <div class="weather-banner__text">${esc(r.text)}</div></div>
        </div>`;
    },

    'race-overview'(node) {
      const r = D.race;
      node.innerHTML =
        `<div class="race-hero"><div class="race-hero__inner">
          <span class="chip chip--sun">主賽事 · ${esc(fmtDate(r.eventDate))}</span>
          <h2>${esc(r.name)}</h2>
          <p style="color:rgba(255,255,255,.85);margin-top:.6rem;max-width:48ch">${esc(r.overview)}</p>
          <div class="race-stats">
            <div><span>距離</span><strong>${esc(r.distance)}</strong></div>
            <div><span>賽事日</span><strong>${esc(r.eventDate)}</strong></div>
            <div><span>目標</span><strong>${r.goal.target ? esc(r.goal.target) : '待設定'}</strong></div>
          </div>
          <div class="link-row" style="margin-top:1.2rem"><a href="${esc(r.official)}" target="_blank" rel="noopener" style="background:var(--sun);color:var(--track);border-color:var(--sun)">官方賽事網站</a></div>
        </div></div>`;
    },

    'race-prep'(node) {
      const r = D.race;
      const block = (title, icon, items) =>
        `<div class="card"><div class="eyebrow">${icon} ${title}</div><ul class="note-list" style="margin-top:.6rem">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
      const grid = el('div', 'card-grid card-grid--2');
      grid.innerHTML =
        block('裝備清單', '🎒', r.gear) +
        block('補給策略', '⚡', r.fueling) +
        block('比賽日動線', '📍', r.raceDay) +
        `<div class="card"><div class="eyebrow">🎯 目標與配速</div><p style="margin-top:.6rem;color:var(--track-soft)">${esc(r.goal.paceNote)}</p></div>`;
      node.appendChild(grid);
      const gp = r.goal.pacePlan;
      if (gp) {
        const plan = el('div', 'card');
        plan.style.marginTop = '1rem';
        plan.innerHTML =
          `<div class="eyebrow">🏃 配速補給計畫 · ${esc(r.goal.target)}</div>
           <p style="margin-top:.5rem;font-size:var(--text-sm);color:var(--track-soft)">${esc(gp.note)}</p>
           <dl class="kv" style="margin-top:.8rem">${gp.phases.map((p) =>
             `<div class="kv__row"><dt style="font-weight:700;color:var(--track)">${esc(p.km)}</dt><dd style="display:flex;gap:.7rem;flex-wrap:wrap"><span style="font-weight:600;color:var(--track)">${esc(p.ratio)}</span><span>${esc(p.pace)}</span><span style="color:var(--track-soft)">${esc(p.hr)}</span><span style="color:var(--track-soft)">${esc(p.tip)}</span></dd></div>`).join('')}</dl>
           <p style="margin-top:.6rem;font-size:var(--text-sm);color:var(--track-soft)">⚡ ${esc(gp.fuel)}</p>
           ${gp.pacers ? `<p style="margin-top:.4rem;font-size:var(--text-sm);color:var(--track-soft)">🎈 ${esc(gp.pacers)}</p>` : ''}`;
        node.appendChild(plan);
      }
    },

    'race-map'(node) {
      const c = D.race.course;
      if (!c || !c.mapEmbed) return;
      node.innerHTML =
        `<div class="card" style="padding:.5rem">
          <iframe src="${esc(c.mapEmbed)}" title="黃金海岸馬拉松官方路線地圖" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;height:460px;border:0;border-radius:var(--radius-sm);display:block"></iframe>
        </div>
        <div class="link-row" style="margin-top:.8rem">
          <a href="${esc(c.googleMap)}" target="_blank" rel="noopener">在 Google 地圖開啟</a>
          <a href="${esc(c.gpxDownload)}" target="_blank" rel="noopener">下載 GPX 路線檔</a>
          <a href="${esc(c.mapLinks[0].url)}" target="_blank" rel="noopener">官方賽道頁</a>
        </div>`;
    },

    'race-elevation'(node) {
      const c = D.race.course, p = c && c.profile;
      if (!p) return;
      const ele = p.perKm, totalKm = ele.length - 1;
      const W = 640, H = 200, padL = 34, padR = 12, padT = 14, padB = 42, maxY = 16;
      const xOf = (km) => padL + (km / totalKm) * (W - padL - padR);
      const yOf = (m) => (H - padB) - (Math.max(0, m) / maxY) * (H - padT - padB);
      let line = `M ${xOf(0).toFixed(1)} ${yOf(ele[0]).toFixed(1)}`;
      ele.forEach((m, i) => { line += ` L ${xOf(i).toFixed(1)} ${yOf(m).toFixed(1)}`; });
      const area = `${line} L ${xOf(totalKm).toFixed(1)} ${H - padB} L ${xOf(0).toFixed(1)} ${H - padB} Z`;
      // SVG 內用寫死色碼，不用 var()（Safari 不認 SVG presentation attribute 裡的 CSS 變數）
      const COL = { ocean: '#16637a', sun: '#f2b330', soft: '#4a525a', line: '#ddd2bf' };
      const band = (s) => {
        const m = s.km.split(/[–-]/).map(parseFloat);
        const x1 = xOf(m[0]), x2 = xOf(Math.min(m[1], totalKm));
        return `<rect x="${x1.toFixed(1)}" y="${H - padB + 6}" width="${(x2 - x1).toFixed(1)}" height="8" rx="2" fill="${s.beach ? COL.sun : COL.ocean}"><title>${esc(s.km)}km · ${esc(s.view)}</title></rect>`;
      };
      const turn = (km, label) =>
        `<line x1="${xOf(km).toFixed(1)}" y1="${padT}" x2="${xOf(km).toFixed(1)}" y2="${H - padB}" stroke="${COL.soft}" stroke-dasharray="3 3" stroke-width="1"/>` +
        `<text x="${xOf(km).toFixed(1)}" y="${padT + 8}" font-size="9" fill="${COL.soft}" text-anchor="middle">${label}</text>`;
      const ylab = [0, 8, 16].map((m) =>
        `<line x1="${padL}" y1="${yOf(m).toFixed(1)}" x2="${W - padR}" y2="${yOf(m).toFixed(1)}" stroke="${COL.line}" stroke-width="0.5"/>` +
        `<text x="${padL - 6}" y="${(yOf(m) + 3).toFixed(1)}" font-size="9" fill="${COL.soft}" text-anchor="end">${m}m</text>`).join('');
      const xlab = [0, 10, 20, 30, 42].map((k) =>
        `<text x="${xOf(k).toFixed(1)}" y="${H - padB + 32}" font-size="10" fill="${COL.soft}" text-anchor="middle">${k}km</text>`).join('');
      node.innerHTML =
        `<div class="card">
          <div class="eyebrow">📈 高度剖面（縱軸放大才看得出起伏）</div>
          <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="高度剖面圖：全程海拔約 0 到 21 公尺，幾乎全平" style="width:100%;height:auto;margin-top:.6rem">
            ${ylab}
            <path d="${area}" fill="rgba(22,99,122,0.12)"/>
            <path d="${line}" fill="none" stroke="${COL.ocean}" stroke-width="2"/>
            ${c.sections.map(band).join('')}
            ${turn(17.5, 'Miami 折返')}${turn(37, 'Runaway Bay 折返')}
            ${xlab}
          </svg>
          <div style="display:flex;gap:1.2rem;flex-wrap:wrap;margin-top:.5rem;font-size:var(--text-xs);color:var(--track-soft)">
            <span><span style="display:inline-block;width:11px;height:11px;background:var(--sun);border-radius:2px;vertical-align:-1px"></span> 沖浪海灘段</span>
            <span><span style="display:inline-block;width:11px;height:11px;background:var(--ocean);border-radius:2px;vertical-align:-1px"></span> 內灣 Broadwater 段</span>
          </div>
          <p style="margin-top:.6rem;font-size:var(--text-sm);color:var(--track-soft)">${esc(p.note)}${p.source ? ` <span style="opacity:.75">· 資料來源：${esc(p.source)}</span>` : ''}</p>
        </div>`;
    },

    'race-sections'(node) {
      const secs = D.race.course.sections;
      node.innerHTML =
        '<div class="stack">' +
        secs.map((s) =>
          `<div class="day__card" style="padding:.8rem 1.1rem">
            <div style="display:flex;gap:.6rem;align-items:baseline;flex-wrap:wrap">
              <span class="chip ${s.beach ? 'chip--sun' : ''}" style="font-family:var(--font-num)">${esc(s.km)} km</span>
              <strong>${esc(s.view)}</strong>
            </div>
            <div style="color:var(--track-soft);font-size:var(--text-sm);margin-top:.3rem">${esc(s.place)}</div>
            <div style="color:var(--track-soft);font-size:var(--text-xs);margin-top:.2rem">地形：${esc(s.terrain)}</div>
          </div>`).join('') +
        '</div>';
    },

    'race-course'(node) {
      const c = D.race.course;
      if (!c) return;
      node.innerHTML =
        `<div class="card-grid card-grid--2">
          <div class="card">
            <div class="eyebrow">🗺️ 賽道路線</div>
            <p style="margin-top:.6rem">${esc(c.description)}</p>
            <dl class="kv" style="margin-top:.8rem">
              <div class="kv__row"><dt>起 / 終點</dt><dd style="font-family:var(--font);font-weight:600;text-align:right;max-width:60%">${esc(c.startFinish)}</dd></div>
              <div class="kv__row"><dt>認證</dt><dd style="font-family:var(--font)">${esc(c.certified)}</dd></div>
              <div class="kv__row"><dt>爬升</dt><dd>${esc(c.elevation)}</dd></div>
              <div class="kv__row"><dt>沿海</dt><dd>${esc(c.beachside)}</dd></div>
            </dl>
            <div class="link-row" style="margin-top:.8rem">${c.mapLinks.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</div>
          </div>
          <div class="card">
            <div class="eyebrow">⛲ 補給站</div>
            <p style="margin-top:.6rem">${esc(c.aidStations)}</p>
            <hr class="divider" style="margin-block:1rem">
            <div class="eyebrow">🏆 大會紀錄</div>
            <dl class="kv" style="margin-top:.6rem">
              <div class="kv__row"><dt>${esc(c.records.male)}</dt><dd></dd></div>
              <div class="kv__row"><dt>${esc(c.records.female)}</dt><dd></dd></div>
            </dl>
            <p class="updated-stamp" style="margin-top:.6rem">${esc(c.scale)}</p>
          </div>
        </div>`;
    },

    'race-schedule'(node) {
      const s = D.race.schedule, ce = D.race.companionEvents;
      if (!s) return;
      node.innerHTML =
        `<div class="weather-banner" style="background:linear-gradient(120deg,#fde7e0,#fbd9c8);border-color:var(--warn)">
          <div class="weather-banner__icon">⏱️</div>
          <div><div class="weather-banner__title">關門時間</div>
          <div class="weather-banner__text">${esc(s.cutoff)}　·　${esc(s.paceGuide)}</div></div>
        </div>
        <div class="card-grid card-grid--2" style="margin-top:var(--space-4)">
          <div class="card">
            <div class="eyebrow">🕕 起跑時程 · ${esc(s.date)}</div>
            <dl class="kv" style="margin-top:.6rem">
              <div class="kv__row"><dt>建議抵達</dt><dd>${esc(s.arrive)}</dd></div>
              <div class="kv__row"><dt>鳴槍</dt><dd>${esc(s.gun)}</dd></div>
              <div class="kv__row"><dt>起點關閉</dt><dd>${esc(s.startClosure)}</dd></div>
            </dl>
            <div class="eyebrow" style="margin-top:1rem">🚩 分波起跑</div>
            <ul class="note-list" style="margin-top:.6rem">${s.waves.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
            <p class="private-note" style="border-style:solid;border-color:var(--line);background:var(--white);color:var(--track-soft);margin-top:.8rem">${esc(s.zoneNote)}</p>
          </div>
          <div class="card">
            <div class="eyebrow">👥 ${esc(ce.date)}</div>
            <ul class="note-list" style="margin-top:.6rem">${ce.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>
        </div>`;
    },

    'race-pace-table'(node) {
      const pt = D.race.paceTable, prof = D.race.course && D.race.course.profile;
      if (!pt) return;
      const segs = pt.segments;
      // 累計秒數（晶片計時）到距離 d
      const cumSec = (d) => {
        let t = 0, prev = 0;
        for (const s of segs) { const hi = Math.min(d, s.to); if (hi > prev) t += (hi - prev) * s.secPerKm; prev = s.to; if (d <= s.to) break; }
        return t;
      };
      const segAt = (d) => segs.findIndex((s) => d <= s.to);
      const fmt = (sec) => { const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.round(sec % 60); return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };
      const ele = prof && prof.perKm;
      const eleAt = (d) => { if (!ele) return null; const lo = Math.floor(d), hi = Math.min(Math.ceil(d), ele.length - 1); const a = ele[lo], b = ele[hi]; return Math.round((a + (b - a) * (d - lo)) * 10) / 10; };
      // 預估時刻 = 起跑時鐘 + 累計秒（先取整到分，避免進位出現 :60）
      const sc = (pt.startClock || '6:50').split(':').map(Number), startSec = sc[0] * 3600 + sc[1] * 60;
      const hm = (totalSec) => { const tm = Math.round(totalSec / 60); return `${Math.floor(tm / 60) % 24}:${String(tm % 60).padStart(2, '0')}`; };
      const clock = (sec) => hm(startSec + sec);
      const elapsed = (sec) => { const tm = Math.round(sec / 60); return `${Math.floor(tm / 60)}:${String(tm % 60).padStart(2, '0')}`; };
      const PHASE = ['#2f8f6b', '#d9941a', '#b5403a']; // 綠 / 琥珀 / 紅，對齊配速卡
      const rows = [...pt.stations, { km: pt.finish, finish: true, place: pt.finishPlace }];
      const tr = (r) => {
        const pi = segAt(r.km), col = PHASE[pi < 0 ? PHASE.length - 1 : pi];
        const kmLabel = r.finish ? '🏁 42.2' : `${r.km}`;
        // 補給+點合併一欄：圖示(💧水 / ⛽Fuel X) + 膠 + 折返
        let cell = '';
        if (r.finish) cell = '<strong>衝線！</strong>';
        else {
          cell = r.type === 'RS' ? '⛽' : '💧';
          if (r.gels) cell += ' 🟢膠';
          if (r.turn) cell += ` <span style="color:var(--ocean-deep);font-weight:600;font-size:var(--text-xs)">🔁</span>`;
        }
        const sec = cumSec(r.km);
        return `<tr style="border-left:4px solid ${col}">
          <td style="padding:.45rem .55rem">
            <div style="font-family:var(--font-num);font-weight:700">${kmLabel}<span style="color:var(--track-soft);font-weight:400;font-size:var(--text-xs)"> km</span> <span style="font-size:var(--text-sm)">${cell}</span></div>
            ${r.place ? `<div style="font-size:var(--text-xs);color:var(--track-soft);margin-top:.1rem">${esc(r.place)}</div>` : ''}
          </td>
          <td style="padding:.45rem .55rem;white-space:nowrap;text-align:right">
            <div style="font-family:var(--font-num);font-weight:700;color:var(--ocean-deep)">${clock(sec)}</div>
            <div style="font-family:var(--font-num);font-size:var(--text-xs);color:var(--track-soft)">+${elapsed(sec)}</div>
          </td>
          <td style="font-family:var(--font-num);color:var(--track-soft);padding:.45rem .55rem;white-space:nowrap;text-align:right">${eleAt(r.km) != null ? eleAt(r.km) + 'm' : '—'}</td>
        </tr>`;
      };
      const legend = segs.map((s, i) =>
        `<span style="display:inline-flex;align-items:center;gap:.3rem"><span style="display:inline-block;width:11px;height:11px;border-radius:2px;background:${PHASE[i]}"></span>${i === 0 ? '0' : segs[i - 1].to}–${s.to === D.race.paceTable.finish ? '42.2' : s.to}K ${esc(s.ratio)} ${esc(s.pace)}</span>`).join('');
      node.innerHTML =
        `<div class="card" style="padding:0;overflow:hidden">
          <div style="padding:1rem 1.1rem .6rem">
            <div class="eyebrow">📋 逐站配速・時刻・地點對照</div>
            <div style="display:flex;gap:.9rem;flex-wrap:wrap;margin-top:.6rem;font-size:var(--text-xs);color:var(--track)">${legend}</div>
          </div>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:var(--text-sm)">
              <thead><tr style="background:var(--ocean-soft);color:var(--ocean-deep);text-align:left">
                <th style="padding:.45rem .55rem;font-weight:700">地點 / 距離 / 補給</th>
                <th style="padding:.45rem .55rem;font-weight:700;text-align:right">預估時刻</th>
                <th style="padding:.45rem .55rem;font-weight:700;text-align:right">海拔</th>
              </tr></thead>
              <tbody>${rows.map(tr).join('')}</tbody>
            </table>
          </div>
          <p style="padding:.7rem 1.1rem .2rem;margin:0;font-size:var(--text-xs);color:var(--track-soft)">時刻＝起跑時鐘＋累計（+）　💧 補水站　⛽ Fuel X 站　🟢 膠（僅 30K·限量）　🔁 折返點</p>
          <p style="padding:.2rem 1.1rem 1rem;margin:0;font-size:var(--text-sm);color:var(--track-soft)">${esc(pt.note)}</p>
        </div>`;
    },

    'race-expo'(node) {
      const e = D.race.expo;
      if (!e) return;
      const f = e.facilities;
      node.innerHTML =
        `<div class="card-grid card-grid--2">
          <div class="card" style="border-color:var(--sun)">
            <div class="eyebrow" style="color:var(--track)">🎽 ${esc(e.title)}</div>
            <p style="margin-top:.6rem;color:var(--track-soft);font-size:var(--text-sm)">${esc(e.venue)}</p>
            <dl class="kv" style="margin-top:.8rem">${e.hours.map((h) => {
              const p = h.split('·');
              return `<div class="kv__row"><dt style="font-weight:700;color:var(--track)">${esc((p[0] || h).trim())}</dt><dd>${esc((p[1] || '').trim())}</dd></div>`;
            }).join('')}</dl>
            <p style="margin-top:.6rem;font-size:var(--text-sm);color:var(--track-soft)">${esc(e.free)}</p>
            <p class="private-note" style="border-style:solid;border-color:var(--line);background:var(--white);color:var(--track-soft);margin-top:.8rem">${esc(e.note)}</p>
          </div>
          <div class="card">
            <div class="eyebrow">📍 ${esc(f.title)}</div>
            <ul class="note-list" style="margin-top:.6rem">${f.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
            <hr class="divider" style="margin-block:1rem">
            <p style="font-size:var(--text-sm)">🏅 ${esc(e.finisher)}</p>
            <p style="margin-top:.6rem;font-size:var(--text-sm);color:var(--track-soft)">📲 ${esc(e.tracking)}</p>
          </div>
        </div>`;
    },

    'race-result'(node) {
      const r = D.race.result;
      if (r.finishTime || r.reflection) {
        node.innerHTML =
          `<div class="card"><div class="eyebrow">🏁 完賽紀錄</div>
            <div class="race-stats" style="margin-top:.8rem;color:var(--track)">
              <div><span style="color:var(--track-soft)">完賽時間</span><strong>${esc(r.finishTime || '—')}</strong></div>
              <div><span style="color:var(--track-soft)">名次</span><strong>${esc(r.placing || '—')}</strong></div>
            </div>
            ${r.reflection ? `<p style="margin-top:1rem">${esc(r.reflection)}</p>` : ''}
          </div>`;
      } else {
        node.innerHTML =
          `<div class="card result-card"><div class="placeholder-big">🏁 完賽紀錄</div>
           <p style="color:var(--ocean-deep);margin-top:.5rem">跑完回來，把成績與心得填進 <code>data.js</code> 的 <code>race.result</code>。</p></div>`;
      }
    },

    journal(node) {
      const filled = D.journal.filter((j) => j.title || j.body);
      if (!filled.length) {
        node.innerHTML =
          `<div class="empty-state">日誌還是空白的。<br>旅行中或回來後，把每天的 <strong>短標題、心情、發生的事、最值得記住的一件事</strong> 填進 <code>data.js</code> 的 <code>journal</code>。</div>`;
        return;
      }
      const grid = el('div', 'stack');
      filled.forEach((j) => {
        grid.appendChild(
          el('article', 'card journal-entry',
            `<div class="journal-entry__date">${esc(fmtDate(j.date))}</div>
             <h3 class="journal-entry__title">${esc(j.title || '（未命名）')}</h3>
             ${j.mood ? `<div class="journal-entry__mood">心情/身體：${esc(j.mood)}</div>` : ''}
             ${j.body ? `<p style="margin-top:.6rem">${esc(j.body)}</p>` : ''}
             ${j.oneThing ? `<p class="journal-entry__oneThing">今天最值得記住：${esc(j.oneThing)}</p>` : ''}`)
        );
      });
      node.appendChild(grid);
    },

    gallery(node) {
      D.gallery.forEach((cat) => {
        const sec = el('section', 'gallery-cat');
        const grid = el('div', 'photo-grid');
        if (cat.photos.length) {
          cat.photos.forEach((p) => {
            const img = el('img');
            img.loading = 'lazy';
            img.src = 'assets/photos/' + p.file;
            img.alt = p.alt || cat.label;
            grid.appendChild(img);
          });
        } else {
          for (let i = 0; i < 3; i++) grid.appendChild(el('div', 'photo-ph', '照片待補'));
        }
        sec.innerHTML = `<div class="gallery-cat__head"><h3>${esc(cat.label)}</h3><span class="chip">${cat.photos.length || 0} 張</span></div>`;
        sec.appendChild(grid);
        node.appendChild(sec);
      });
    },

    checklist(node) {
      const grid = el('div', 'card-grid card-grid--2');
      D.checklist.forEach((c) => {
        grid.appendChild(
          el('div', 'card check-cat',
            `<h3>📋 ${esc(c.category)}</h3>
             <ul class="check-list">${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`)
        );
      });
      node.appendChild(grid);
    },

    budget(node) {
      const b = D.budget;
      const grid = el('div', 'budget-grid');
      b.categories.forEach((c) => {
        const has = c.amount != null;
        const amt = has ? `${b.currency} ${Number(c.amount).toLocaleString()}` : '待記錄';
        grid.appendChild(
          el('div', 'card budget-card',
            `<div class="budget-card__label">${esc(c.label)}</div>
             <div class="budget-card__amount ${has ? '' : 'empty'}">${esc(amt)}</div>`)
        );
      });
      node.appendChild(grid);
      const note = el('p', 'private-note');
      note.style.marginTop = 'var(--space-4)';
      note.textContent = b.note;
      node.appendChild(note);
    },
  };

  /* ---------------------------------------------------------------- Boot */
  function boot() {
    initNav();
    initCountdown();
    $$('[data-render]').forEach((node) => {
      const key = node.getAttribute('data-render');
      const fn = renderers[key];
      if (fn) {
        try { fn(node); }
        catch (e) { node.innerHTML = '<div class="empty-state">這個區塊暫時無法顯示。</div>'; console.error('render', key, e); }
      }
    });
    // 頁尾年份
    const y = $('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
