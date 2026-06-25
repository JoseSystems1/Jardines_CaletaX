/* =================================================================
   JARDINES DE CALETA X — lógica de la aplicación
   ================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     0. CONFIGURACIÓN
     -----------------------------------------------------------------
     Cambia la contraseña de admin aquí antes de publicar el sitio.
     Esto es una protección "de cara al cliente", no es seguridad real:
     cualquiera que vea el código fuente puede leer la contraseña.
     Si vas a producción de verdad, valida el acceso admin en un
     backend (ver nota de Firebase más abajo).
  ----------------------------------------------------------------- */
  const CONFIG = {
    ADMIN_PASSWORD: "caletax2026",
    STORAGE_KEY: "jcx_lots_state_v1",
    SESSION_KEY: "jcx_admin_session_v1",
    POLL_MS: 4000,
    MIN_SCALE: 1,
    MAX_SCALE: 6,
  };

  /* ---------------------------------------------------------------
     1. DATOS BASE — Solares 1 a 156 (áreas según planilla del plano)
  ----------------------------------------------------------------- */
  const LOTS_BASE = [
    [1,425.01],[2,427.00],[3,426.00],[4,429.00],[5,430.00],[6,431.00],[7,431.00],
    [8,435.00],[9,435.00],[10,431.00],[11,360.00],[12,228.29],[13,249.00],
    [14,240.00],[15,240.00],[16,240.00],[17,240.00],[18,240.00],[19,240.00],
    [20,240.00],[21,240.00],[22,240.00],[23,240.00],[24,240.00],[25,240.00],
    [26,240.00],[27,240.00],[28,240.00],[29,240.00],[30,240.00],[31,240.00],
    [32,240.00],[33,240.00],[34,240.00],[35,240.00],[36,240.00],[37,240.00],
    [38,314.19],[39,351.74],[40,285.00],[41,300.00],[42,346.62],[43,240.00],
    [44,240.00],[45,240.00],[46,240.00],[47,240.00],[48,240.00],[49,240.00],
    [50,240.00],[51,240.00],[52,240.00],[53,229.93],[54,230.00],[55,230.00],
    [56,230.00],[57,230.00],[58,230.00],[59,230.00],[60,230.00],[61,230.00],
    [62,386.03],[63,367.04],[64,280.79],[65,300.97],[66,409.67],[67,230.00],
    [68,230.00],[69,230.00],[70,230.00],[71,230.00],[72,230.00],[73,230.00],
    [74,230.00],[75,220.00],[76,220.00],[77,220.00],[78,220.00],[79,220.00],
    [80,220.00],[81,220.00],[82,220.00],[83,275.69],[84,382.42],[85,404.90],
    [86,223.73],[87,220.00],[88,220.00],[89,220.00],[90,220.00],[91,220.00],
    [92,220.00],[93,220.00],[94,220.02],[95,220.00],[96,220.00],[97,220.00],
    [98,220.00],[99,220.00],[100,220.00],[101,301.36],[102,382.08],[103,220.00],
    [104,220.00],[105,220.00],[106,220.00],[107,219.99],[108,220.00],[109,174.19],
    [110,603.59],[111,639.47],[112,265.20],[113,270.00],[114,270.00],[115,270.00],
    [116,270.00],[117,270.00],[118,270.00],[119,267.95],[120,439.02],[121,385.78],
    [122,388.97],[123,392.16],[124,395.36],[125,419.12],[126,293.53],[127,250.00],
    [128,250.00],[129,250.00],[130,250.00],[131,250.00],[132,376.21],[133,346.66],
    [134,244.95],[135,249.71],[136,254.48],[137,259.24],[138,305.43],[139,443.62],
    [140,382.71],[141,382.72],[142,382.73],[143,504.54],[144,470.56],[145,353.48],
    [146,356.50],[147,359.47],[148,362.45],[149,365.40],[150,487.15],[151,361.24],
    [152,362.90],[153,364.36],[154,365.88],[155,445.75],[156,163.62],
  ];

  /* ---------------------------------------------------------------
     2. ESTADO / PERSISTENCIA
     -----------------------------------------------------------------
     Por defecto los datos se guardan en localStorage. Esto funciona
     perfectamente para una demo o para un solo dispositivo/admin, y
     se sincroniza automáticamente entre pestañas del MISMO navegador
     (vía BroadcastChannel + evento "storage").

     ⚠️ IMPORTANTE — tiempo real ENTRE DISTINTOS visitantes/dispositivos:
     localStorage vive solo en el navegador de cada persona, así que
     dos visitantes en dos computadoras distintas NO se sincronizan
     entre sí con esta configuración. Para eso necesitas una base de
     datos compartida. Dejamos lista la integración con Firebase
     Realtime Database (gratis) — busca "FIREBASE" en este archivo
     y en el README para activarla en 5 minutos.
  ----------------------------------------------------------------- */

  function defaultState() {
    const obj = {};
    LOTS_BASE.forEach(([id, area]) => {
      obj[id] = { id, area, status: "disponible", x: null, y: null, note: "", updatedAt: null };
    });
    return obj;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      // fusiona por si la base de solares cambia en el futuro
      Object.keys(base).forEach((id) => {
        if (parsed[id]) base[id] = { ...base[id], ...parsed[id] };
      });
      return base;
    } catch (e) {
      console.warn("No se pudo leer el estado guardado, usando valores por defecto.", e);
      return defaultState();
    }
  }

  let state = loadState();

  function persist() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    broadcastUpdate();
  }

  /* --- sincronización en tiempo real entre pestañas (mismo navegador) --- */
  let channel = null;
  try { channel = new BroadcastChannel("jcx-sync"); } catch (e) { channel = null; }

  function broadcastUpdate() {
    if (channel) {
      try { channel.postMessage({ type: "update", t: Date.now() }); } catch (e) {}
    }
  }

  function refreshFromStorage() {
    state = loadState();
    renderAll();
  }

  if (channel) {
    channel.onmessage = (ev) => {
      if (ev && ev.data && ev.data.type === "update") refreshFromStorage();
    };
  }
  window.addEventListener("storage", (ev) => {
    if (ev.key === CONFIG.STORAGE_KEY) refreshFromStorage();
  });
  // sondeo de respaldo, por si BroadcastChannel/storage no disparan (algunos navegadores móviles)
  setInterval(refreshFromStorage, CONFIG.POLL_MS);

  /*
    ---------------------------------------------------------------
    FIREBASE (OPCIONAL) — sincronización real entre distintos dispositivos
    -----------------------------------------------------------------
    1. Crea un proyecto gratis en https://console.firebase.google.com
    2. Activa "Realtime Database" en modo de prueba.
    3. Agrega el SDK en index.html (antes de script.js):
         <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
         <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js"></script>
    4. Pega tu config y descomenta este bloque:

    const firebaseConfig = { apiKey:"...", databaseURL:"...", projectId:"..." };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database().ref("jcx_lots");

    function persist() {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
      db.set(state); // sube el cambio a todos los visitantes en tiempo real
    }
    db.on("value", (snap) => {
      if (snap.exists()) { state = snap.val(); renderAll(); }
    });

    Con esto, cualquier cambio que haga el admin se refleja al instante
    en el navegador de TODAS las personas que tengan la página abierta,
    en cualquier dispositivo del mundo.
    ----------------------------------------------------------------- */

  /* ---------------------------------------------------------------
     3. UTILIDADES
  ----------------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const fmtArea = (n) => n.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m²";
  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("es-DO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };
  const STATUS_LABEL = { disponible: "Disponible", reservado: "Reservado", vendido: "Vendido" };

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  /* ---------------------------------------------------------------
     4. SESIÓN ADMIN
  ----------------------------------------------------------------- */
  let isAdmin = sessionStorage.getItem(CONFIG.SESSION_KEY) === "1";

  function setAdmin(value) {
    isAdmin = value;
    sessionStorage.setItem(CONFIG.SESSION_KEY, value ? "1" : "0");
    $("#btnAdminToggle").classList.toggle("is-admin", value);
    $("#adminBtnLabel").textContent = value ? "Modo admin activo" : "Acceso admin";
    document.body.classList.toggle("is-admin", value); // muestra/oculta controles solo-admin (ej. botón "Marcar")
    if (!value) {
      $("#adminPanel").hidden = true;
      $("#adminOverlay").hidden = true;
      exitPlacementMode();
    }
    renderAll();
  }

  /* ---------------------------------------------------------------
     5. RENDER — estadísticas
  ----------------------------------------------------------------- */
  function renderStats() {
    const all = Object.values(state);
    const count = (s) => all.filter((l) => l.status === s).length;
    $("#statTotal").textContent = all.length;
    $("#statAvailable").textContent = count("disponible");
    $("#statReserved").textContent = count("reservado");
    $("#statSold").textContent = count("vendido");
  }

  /* ---------------------------------------------------------------
     6. RENDER — marcadores sobre el plano
  ----------------------------------------------------------------- */
  function renderMarkers() {
    const layer = $("#markersLayer");
    layer.innerHTML = "";
    Object.values(state).forEach((lot) => {
      if (lot.x == null || lot.y == null) return;
      if (lot.status === "disponible") return;
      const el = document.createElement("div");
      el.className = "marker marker--" + lot.status;
      el.style.left = lot.x + "%";
      el.style.top = lot.y + "%";
      el.style.transform = `translate(-50%,-50%) scale(${1 / view.scale})`;
      el.title = "Solar #" + lot.id + " — " + STATUS_LABEL[lot.status];
      el.textContent = lot.status === "vendido" ? "✕" : "●";
      el.addEventListener("click", (e) => { e.stopPropagation(); openLotModal(lot.id); });
      layer.appendChild(el);
    });
  }

  function rescaleMarkers() {
    $$(".marker").forEach((el) => {
      el.style.transform = `translate(-50%,-50%) scale(${1 / view.scale})`;
    });
  }

  /* ---------------------------------------------------------------
     7. RENDER — lista de reservas (sidebar)
  ----------------------------------------------------------------- */
  let currentFilter = "activos";

  function renderLotList() {
    const list = $("#lotList");
    const empty = $("#emptyState");
    list.innerHTML = "";

    let lots = Object.values(state).sort((a, b) => a.id - b.id);
    if (currentFilter === "activos") {
      lots = lots.filter((l) => l.status !== "disponible");
    }

    if (lots.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    lots.forEach((lot) => {
      const li = document.createElement("li");
      li.className = "lot-row";
      li.dataset.lotId = lot.id;
      li.innerHTML = `
        <div class="lot-row__badge is-${lot.status}">#${lot.id}</div>
        <div class="lot-row__info">
          <div class="lot-row__title">Solar No. ${lot.id} <span class="lot-row__meta">· ${fmtArea(lot.area)}</span></div>
          <div class="lot-row__status is-${lot.status}">${STATUS_LABEL[lot.status]}</div>
        </div>`;
      li.addEventListener("click", () => openLotModal(lot.id));
      list.appendChild(li);
    });
  }

  /* ---------------------------------------------------------------
     8. RENDER — panel admin (tabla completa)
  ----------------------------------------------------------------- */
  function renderAdminTable() {
    if (!isAdmin) return;
    const body = $("#adminTableBody");
    const term = $("#adminSearch").value.trim();
    const statusFilter = $("#adminStatusFilter").value;
    body.innerHTML = "";

    Object.values(state)
      .sort((a, b) => a.id - b.id)
      .filter((l) => (term ? String(l.id).includes(term) : true))
      .filter((l) => (statusFilter === "todos" ? true : l.status === statusFilter))
      .forEach((lot) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>#${lot.id}</td>
          <td class="area-cell">${fmtArea(lot.area)}</td>
          <td>
            <select class="status-select" data-id="${lot.id}">
              <option value="disponible" ${lot.status === "disponible" ? "selected" : ""}>Disponible</option>
              <option value="reservado" ${lot.status === "reservado" ? "selected" : ""}>Reservado</option>
              <option value="vendido" ${lot.status === "vendido" ? "selected" : ""}>Vendido</option>
            </select>
          </td>
          <td>
            <button class="pin-btn ${lot.x != null ? "has-pin" : ""}" data-id="${lot.id}">
              ${lot.x != null ? "Reubicar" : "Ubicar en mapa"}
            </button>
          </td>`;
        body.appendChild(tr);
      });

    body.querySelectorAll(".status-select").forEach((sel) => {
      sel.addEventListener("change", () => {
        const id = sel.dataset.id;
        updateLot(id, { status: sel.value });
        toast(`Solar #${id} → ${STATUS_LABEL[sel.value]}`);
      });
    });
    body.querySelectorAll(".pin-btn").forEach((btn) => {
      btn.addEventListener("click", () => enterPlacementMode(btn.dataset.id));
    });
  }

  function renderAll() {
    renderStats();
    renderMarkers();
    renderLotList();
    renderAdminTable();
  }

  /* ---------------------------------------------------------------
     9. ACTUALIZAR UN SOLAR
  ----------------------------------------------------------------- */
  function updateLot(id, patch) {
    const lot = state[id];
    if (!lot) return;
    Object.assign(lot, patch, { updatedAt: new Date().toISOString() });
    persist();
    renderAll();
  }

  /* ---------------------------------------------------------------
     10. MODO "UBICAR MARCADOR" sobre el plano
  ----------------------------------------------------------------- */
  let placementLotId = null;
  let reopenAdminPanelAfterPlacement = false;
  let reopenLotModalAfterPlacement = false;

  function enterPlacementMode(id) {
    placementLotId = String(id);
    $("#placementBanner").hidden = false;
    $("#placementLotLabel").textContent = "Solar #" + id;
    $("#mapViewport").classList.add("is-placing");
    // el panel/modal tapan el plano; los ocultamos mientras se ubica el marcador
    reopenAdminPanelAfterPlacement = !$("#adminPanel").hidden;
    $("#adminPanel").hidden = true;
    $("#adminOverlay").hidden = true;
    reopenLotModalAfterPlacement = !$("#lotBackdrop").hidden;
    $("#lotBackdrop").hidden = true;
    // si el plano está colapsado o fuera de vista en móvil, llévalo a la vista
    exitFullscreenMap();
    const mapPanel = $("#mapPanel");
    if (mapPanel) mapPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function exitPlacementMode() {
    placementLotId = null;
    $("#placementBanner").hidden = true;
    $("#mapViewport").classList.remove("is-placing");
    if (reopenAdminPanelAfterPlacement && isAdmin) {
      $("#adminPanel").hidden = false;
      $("#adminOverlay").hidden = false;
      renderAdminTable();
    }
    reopenAdminPanelAfterPlacement = false;
    if (reopenLotModalAfterPlacement && activeLotId) {
      openLotModal(activeLotId);
    }
    reopenLotModalAfterPlacement = false;
  }
  $("#btnCancelPlacement").addEventListener("click", exitPlacementMode);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { exitPlacementMode(); closeModals(); }
  });

  /* ---------------------------------------------------------------
     11. VISOR DEL PLANO — zoom y paneo
  ----------------------------------------------------------------- */
  const viewport = $("#mapViewport");
  const stage = $("#mapStage");
  const view = { scale: 1, tx: 0, ty: 0 };

  function applyTransform() {
    stage.style.transform = `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`;
    $("#zoomReadout").textContent = Math.round(view.scale * 100) + "%";
    rescaleMarkers();
  }

  function clampScale(s) { return Math.min(CONFIG.MAX_SCALE, Math.max(CONFIG.MIN_SCALE, s)); }

  function zoomAt(clientX, clientY, factor) {
    const rect = viewport.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    const prev = view.scale;
    const next = clampScale(prev * factor);
    if (next === prev) return;
    view.tx = cx - ((cx - view.tx) * (next / prev));
    view.ty = cy - ((cy - view.ty) * (next / prev));
    view.scale = next;
    clampPan();
    applyTransform();
  }

  function clampPan() {
    const rect = viewport.getBoundingClientRect();
    const w = rect.width * view.scale;
    const h = rect.height * view.scale;
    const minTx = Math.min(0, rect.width - w);
    const minTy = Math.min(0, rect.height - h);
    view.tx = Math.min(0, Math.max(minTx, view.tx));
    view.ty = Math.min(0, Math.max(minTy, view.ty));
  }

  function resetView() {
    view.scale = 1; view.tx = 0; view.ty = 0;
    applyTransform();
  }

  // rueda del mouse
  viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    zoomAt(e.clientX, e.clientY, factor);
  }, { passive: false });

  // arrastre con mouse
  let dragging = false, dragStart = null, moved = false;
  viewport.addEventListener("mousedown", (e) => {
    dragging = true; moved = false;
    dragStart = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
    viewport.classList.add("is-dragging");
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.x, dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    view.tx = dragStart.tx + dx;
    view.ty = dragStart.ty + dy;
    clampPan();
    applyTransform();
  });
  window.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    if (!moved) handleStageClick(e);
  });

  // doble clic para acercar
  viewport.addEventListener("dblclick", (e) => zoomAt(e.clientX, e.clientY, 1.6));

  // touch: paneo de un dedo + pellizco de dos dedos
  let touchState = null;
  let lastTapTime = 0;
  viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchState = { mode: "pan", x: e.touches[0].clientX, y: e.touches[0].clientY, tx: view.tx, ty: view.ty, moved: false };
    } else if (e.touches.length === 2) {
      const [a, b] = e.touches;
      touchState = {
        mode: "pinch",
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        scale: view.scale,
        midX: (a.clientX + b.clientX) / 2,
        midY: (a.clientY + b.clientY) / 2,
      };
    }
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    if (!touchState) return;
    if (touchState.mode === "pan" && e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchState.x;
      const dy = e.touches[0].clientY - touchState.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) touchState.moved = true;
      view.tx = touchState.tx + dx;
      view.ty = touchState.ty + dy;
      clampPan();
      applyTransform();
    } else if (touchState.mode === "pinch" && e.touches.length === 2) {
      const [a, b] = e.touches;
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const factor = dist / touchState.dist;
      const rect = viewport.getBoundingClientRect();
      const cx = touchState.midX - rect.left, cy = touchState.midY - rect.top;
      const prev = view.scale;
      const next = clampScale(touchState.scale * factor);
      view.tx = cx - ((cx - view.tx) * (next / prev));
      view.ty = cy - ((cy - view.ty) * (next / prev));
      view.scale = next;
      clampPan();
      applyTransform();
    }
  }, { passive: true });

  viewport.addEventListener("touchend", (e) => {
    if (touchState && touchState.mode === "pan" && !touchState.moved && e.changedTouches[0]) {
      const now = Date.now();
      const pt = e.changedTouches[0];
      // doble toque rápido en el mismo punto = acercar (equivalente táctil del doble clic)
      if (now - lastTapTime < 320) {
        zoomAt(pt.clientX, pt.clientY, 1.6);
        lastTapTime = 0;
      } else {
        lastTapTime = now;
        handleStageClick(pt);
      }
    }
    touchState = null;
  });

  $("#btnZoomIn").addEventListener("click", () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.3);
  });
  $("#btnZoomOut").addEventListener("click", () => {
    const r = viewport.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1 / 1.3);
  });
  $("#btnZoomReset").addEventListener("click", resetView);

  /* clic/toque sobre el plano: si hay un solar en modo "ubicar", coloca el marcador */
  function handleStageClick(pointLike) {
    if (!placementLotId) return;
    const rect = stage.getBoundingClientRect();
    let xPct = ((pointLike.clientX - rect.left) / rect.width) * 100;
    let yPct = ((pointLike.clientY - rect.top) / rect.height) * 100;
    xPct = Math.max(0, Math.min(100, xPct));
    yPct = Math.max(0, Math.min(100, yPct));
    const lot = state[placementLotId];
    const patch = { x: xPct, y: yPct };
    if (lot.status === "disponible") patch.status = "reservado";
    updateLot(placementLotId, patch);
    toast(`Marcador colocado en el Solar #${placementLotId}`);
    exitPlacementMode();
  }

  /* ---------------------------------------------------------------
     11b. PANTALLA COMPLETA DEL PLANO (móvil y escritorio)
  ----------------------------------------------------------------- */
  const mapPanel = $("#mapPanel");
  let isMapFullscreen = false;

  function enterFullscreenMap() {
    isMapFullscreen = true;
    mapPanel.classList.add("is-fullscreen");
    document.body.classList.add("map-fullscreen-active");
    $("#iconExpand").hidden = true;
    $("#iconCollapse").hidden = false;
    $("#btnMapExpand").setAttribute("aria-label", "Salir de pantalla completa");
    requestAnimationFrame(clampPan);
  }
  function exitFullscreenMap() {
    if (!isMapFullscreen) return;
    isMapFullscreen = false;
    mapPanel.classList.remove("is-fullscreen");
    document.body.classList.remove("map-fullscreen-active");
    $("#iconExpand").hidden = false;
    $("#iconCollapse").hidden = true;
    $("#btnMapExpand").setAttribute("aria-label", "Ampliar plano a pantalla completa");
    requestAnimationFrame(clampPan);
  }
  $("#btnMapExpand").addEventListener("click", () => {
    if (isMapFullscreen) exitFullscreenMap();
    else enterFullscreenMap();
  });

  /* ---------------------------------------------------------------
     12. MODAL DE DETALLE / EDICIÓN DE UN SOLAR
  ----------------------------------------------------------------- */
  let activeLotId = null;

  function openLotModal(id) {
    activeLotId = String(id);
    const lot = state[activeLotId];
    if (!lot) return;
    $("#lotModalEyebrow").textContent = "SOLAR No. " + lot.id;
    $("#lotModalTitle").textContent = "Solar No. " + lot.id;
    $("#lotModalArea").textContent = fmtArea(lot.area);
    $("#lotModalStatusText").textContent = STATUS_LABEL[lot.status];
    $("#lotModalUpdated").textContent = fmtDate(lot.updatedAt);

    const adminBox = $("#lotModalAdminControls");
    adminBox.hidden = !isAdmin;
    if (isAdmin) {
      $("#lotModalStatusSelect").value = lot.status;
      $("#lotModalNote").value = lot.note || "";
      const hasPin = lot.x != null && lot.y != null;
      $("#btnPlaceMarker").textContent = hasPin ? "Reubicar marcador en el plano" : "Ubicar en el plano";
      $("#btnRemoveMarker").hidden = !hasPin;
    }
    $("#lotBackdrop").hidden = false;
  }

  function closeModals() {
    $("#lotBackdrop").hidden = true;
    $("#loginBackdrop").hidden = true;
    $("#loginError").hidden = true;
    $("#loginPassword").value = "";
  }

  $("#btnCloseLotModal").addEventListener("click", closeModals);
  $("#lotBackdrop").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeModals(); });

  $("#btnSaveLot").addEventListener("click", () => {
    if (!activeLotId) return;
    updateLot(activeLotId, {
      status: $("#lotModalStatusSelect").value,
      note: $("#lotModalNote").value,
    });
    toast(`Solar #${activeLotId} actualizado`);
    closeModals();
  });

  $("#btnRemoveMarker").addEventListener("click", () => {
    if (!activeLotId) return;
    updateLot(activeLotId, { x: null, y: null });
    toast(`Marcador del Solar #${activeLotId} eliminado del plano`);
    openLotModal(activeLotId); // refresca el estado del botón "Ubicar/Reubicar"
  });

  $("#btnPlaceMarker").addEventListener("click", () => {
    if (!activeLotId) return;
    // guarda primero el estado/nota elegidos para no perderlos al ubicar el marcador
    updateLot(activeLotId, {
      status: $("#lotModalStatusSelect").value,
      note: $("#lotModalNote").value,
    });
    closeModals();
    enterPlacementMode(activeLotId);
  });

  /* ---------------------------------------------------------------
     13. LOGIN ADMIN
  ----------------------------------------------------------------- */
  $("#btnAdminToggle").addEventListener("click", () => {
    if (isAdmin) {
      $("#adminPanel").hidden = false;
      $("#adminOverlay").hidden = false;
      renderAdminTable();
    } else {
      $("#loginBackdrop").hidden = false;
      setTimeout(() => $("#loginPassword").focus(), 50);
    }
  });

  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = $("#loginPassword").value;
    if (val === CONFIG.ADMIN_PASSWORD) {
      setAdmin(true);
      closeModals();
      toast("Sesión de administrador iniciada");
      $("#adminPanel").hidden = false;
      $("#adminOverlay").hidden = false;
      renderAdminTable();
    } else {
      $("#loginError").hidden = false;
    }
  });
  $("#btnCancelLogin").addEventListener("click", closeModals);

  $("#btnCloseAdmin").addEventListener("click", () => {
    $("#adminPanel").hidden = true;
    $("#adminOverlay").hidden = true;
  });
  $("#adminOverlay").addEventListener("click", () => {
    $("#adminPanel").hidden = true;
    $("#adminOverlay").hidden = true;
  });
  $("#btnLogoutAdmin").addEventListener("click", () => {
    setAdmin(false);
    toast("Sesión cerrada");
  });

  $("#adminSearch").addEventListener("input", renderAdminTable);
  $("#adminStatusFilter").addEventListener("change", renderAdminTable);

  $("#btnExportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "jardines-caleta-x-solares.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---------------------------------------------------------------
     14. FILTROS DE LA LISTA DE RESERVAS
  ----------------------------------------------------------------- */
  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      currentFilter = chip.dataset.filter;
      renderLotList();
    });
  });

  /* ---------------------------------------------------------------
     14b. SIDEBAR PLEGABLE (móvil) — libera espacio para ver el plano
  ----------------------------------------------------------------- */
  const sidebarEl = $(".sidebar");
  $("#btnSidebarToggle").addEventListener("click", () => {
    if (window.innerWidth > 720) return; // en escritorio/tablet la lista siempre está visible
    const collapsed = sidebarEl.classList.toggle("is-collapsed");
    $("#btnSidebarToggle").setAttribute("aria-expanded", String(!collapsed));
  });
  // en móvil arranca plegada para priorizar el plano; en escritorio siempre expandida
  if (window.innerWidth <= 720) {
    sidebarEl.classList.add("is-collapsed");
    $("#btnSidebarToggle").setAttribute("aria-expanded", "false");
  }

  /* ---------------------------------------------------------------
     15. BUSCADOR DE SOLAR
  ----------------------------------------------------------------- */
  function locateLot(id) {
    if (!state[id]) { toast("No existe el solar #" + id); return false; }
    const lot = state[id];

    // si ya hay marcador, centra el plano en ese punto con zoom
    if (lot.x != null && lot.y != null) {
      view.scale = clampScale(3);
      const rect = viewport.getBoundingClientRect();
      view.tx = rect.width / 2 - (lot.x / 100) * rect.width * view.scale;
      view.ty = rect.height / 2 - (lot.y / 100) * rect.height * view.scale;
      clampPan();
      applyTransform();
    }

    // resalta la fila en la lista (cambia a "todos" si hace falta, y despliega la lista en móvil)
    const wasOnlyActive = currentFilter === "activos" && lot.status === "disponible";
    if (wasOnlyActive) {
      currentFilter = "todos";
      $$(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.filter === "todos"));
      renderLotList();
    }
    if (sidebarEl.classList.contains("is-collapsed")) {
      sidebarEl.classList.remove("is-collapsed");
      $("#btnSidebarToggle").setAttribute("aria-expanded", "true");
    }
    const row = document.querySelector(`.lot-row[data-lot-id="${id}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      row.classList.remove("flash");
      requestAnimationFrame(() => row.classList.add("flash"));
    }
    return true;
  }

  function performSearch() {
    const id = $("#searchInput").value.trim();
    if (!id) return;
    locateLot(id);
  }

  $("#searchInput").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    performSearch();
  });
  $("#btnSearchGo").addEventListener("click", performSearch);

  /* ---------------------------------------------------------------
     15b. BOTÓN "MARCAR" (solo admin) — busca el solar por número y abre
     directamente el editor de estado (disponible / reservado / vendido),
     sin tener que entrar antes al panel de administración.
  ----------------------------------------------------------------- */
  $("#btnAdminMark").addEventListener("click", () => {
    const id = $("#searchInput").value.trim();
    if (!id) {
      toast("Escribe primero el número del solar a marcar");
      $("#searchInput").focus();
      return;
    }
    if (!state[id]) { toast("No existe el solar #" + id); return; }
    exitFullscreenMap();
    locateLot(id);
    openLotModal(id);
  });

  /* ---------------------------------------------------------------
     16. INICIO
  ----------------------------------------------------------------- */
  setAdmin(isAdmin); // restaura sesión si ya había una
  applyTransform();
  renderAll();
})();