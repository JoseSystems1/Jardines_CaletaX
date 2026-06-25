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

     SUPABASE — para que los cambios se vean en tiempo real entre TODOS
     los visitantes y dispositivos (no solo en tu propio navegador):
     1. Crea un proyecto gratis en https://supabase.com/dashboard
     2. Ve a "SQL Editor" → pega y ejecuta el archivo supabase-setup.sql
        que viene junto a este script (crea la tabla, los permisos, el
        tiempo real, y siembra los 156 solares).
     3. Ve a "Settings" → "API" y copia tu "Project URL" y tu llave
        "anon public" (a veces aparece como "publishable key").
     4. Pega esos dos valores abajo, en SUPABASE_URL y SUPABASE_ANON_KEY.
     Mientras no los configures, el sitio sigue funcionando exactamente
     como antes (guardando todo solo en este navegador con localStorage).
  ----------------------------------------------------------------- */
  const CONFIG = {
    ADMIN_PASSWORD: "caletax2026",
    STORAGE_KEY: "jcx_lots_state_v1",
    SESSION_KEY: "jcx_admin_session_v1",
  };

  const SUPABASE_URL = "https://tecoypzwhxqczrvfwmbf.supabase.co"; 
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY295cHp3aHhxY3pydmZ3bWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTUwNDksImV4cCI6MjA5Nzk3MTA0OX0.jlk6w44lpkgvTMieC8oqZlxNOt2JsMCNGTxHBOWswfo"; // <-- reemplaza con tu llave "anon public" / "publishable"

  const USE_SUPABASE =
    typeof window.supabase !== "undefined" &&
    !SUPABASE_URL.includes("TU-PROYECTO") &&
    !SUPABASE_ANON_KEY.includes("TU-ANON-KEY");

  const sb = USE_SUPABASE ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

  /* ---------------------------------------------------------------
     1. DATOS BASE — Solares 1 a 156 (áreas según planilla del plano)
     Esto solo se usa para el modo local (sin Supabase) o como respaldo
     si la conexión a Supabase falla por algún motivo.
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
     MODO SUPABASE (cuando configuraste SUPABASE_URL/ANON_KEY arriba):
     el estado vive en la base de datos compartida; todos los visitantes
     leen y escriben la misma tabla, y "Realtime" avisa a todos los
     navegadores conectados en cuanto algo cambia — sin recargar.

     MODO LOCAL (respaldo, si no configuraste Supabase): el estado se
     guarda en localStorage de este navegador únicamente, igual que
     antes. Sirve para probar el sitio antes de conectar la base de
     datos, pero NO se sincroniza entre distintos visitantes/dispositivos.
  ----------------------------------------------------------------- */

  function defaultState() {
    const obj = {};
    LOTS_BASE.forEach(([id, area]) => {
      obj[id] = { id, area, status: "disponible", x: null, y: null, note: "", updatedAt: null };
    });
    return obj;
  }

  function loadLocalState() {
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

  function persistLocal() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    broadcastUpdate();
  }

  let state = sb ? defaultState() : loadLocalState(); // en modo Supabase esto es solo un placeholder mientras carga la tabla real

  /* --- sincronización entre pestañas del mismo navegador (solo modo local) --- */
  let channel = null;
  if (!sb) {
    try { channel = new BroadcastChannel("jcx-sync"); } catch (e) { channel = null; }
  }

  function broadcastUpdate() {
    if (channel) {
      try { channel.postMessage({ type: "update", t: Date.now() }); } catch (e) {}
    }
  }

  function refreshFromLocalStorage() {
    state = loadLocalState();
    renderAll();
  }

  if (channel) {
    channel.onmessage = (ev) => {
      if (ev && ev.data && ev.data.type === "update") refreshFromLocalStorage();
    };
    window.addEventListener("storage", (ev) => {
      if (ev.key === CONFIG.STORAGE_KEY) refreshFromLocalStorage();
    });
  }

  /* --- modo Supabase: carga inicial + tiempo real entre todos los dispositivos --- */
  function rowToLot(row) {
    return {
      id: row.id,
      area: Number(row.area),
      status: row.status,
      x: row.x == null ? null : Number(row.x),
      y: row.y == null ? null : Number(row.y),
      note: row.note || "",
      updatedAt: row.updated_at,
    };
  }

  async function loadStateFromSupabase() {
    const { data, error } = await sb.from("lots").select("*").order("id");
    if (error || !data || data.length === 0) {
      console.warn("No se pudo cargar la tabla de Supabase, usando valores por defecto.", error);
      toast("No se pudo conectar a la base de datos — revisa supabase-setup.sql y tus llaves");
      state = defaultState();
      renderAll();
      return;
    }
    const fresh = defaultState();
    data.forEach((row) => { fresh[row.id] = rowToLot(row); });
    state = fresh;
    renderAll();
  }

  function subscribeRealtime() {
    sb.channel("lots-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "lots" }, (payload) => {
        const row = payload.new && Object.keys(payload.new).length ? payload.new : payload.old;
        if (!row || row.id == null) return;
        if (payload.eventType === "DELETE") return; // no borramos solares por código, solo se actualizan
        state[row.id] = rowToLot(row);
        renderAll();
      })
      .subscribe();
  }

  if (sb) {
    loadStateFromSupabase();
    subscribeRealtime();
  }

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
     6. RENDER — marcadores sobre el plano (overlays de OpenSeadragon;
     ver sección 11 más abajo para imageToViewportPoint/viewer)
  ----------------------------------------------------------------- */
  const shownMarkerIds = new Set();
  function renderMarkers() {
    if (!viewerReady) return; // el plano (mosaicos) todavía no terminó de cargar
    const shouldShow = new Set();
    Object.values(state).forEach((lot) => {
      if (lot.x == null || lot.y == null || lot.status === "disponible") return;
      const idStr = String(lot.id);
      shouldShow.add(idStr);
      const elId = "marker-" + lot.id;
      let el = document.getElementById(elId);
      const point = imageToViewportPoint(lot.x, lot.y);
      if (!el) {
        el = document.createElement("div");
        el.id = elId;
        el.addEventListener("click", (e) => { e.stopPropagation(); openLotModal(lot.id); });
        viewer.addOverlay({ element: el, location: point, placement: OpenSeadragon.Placement.CENTER });
      } else {
        viewer.updateOverlay(el, point, OpenSeadragon.Placement.CENTER);
      }
      el.className = "marker marker--" + lot.status;
      el.title = "Solar #" + lot.id + " — " + STATUS_LABEL[lot.status];
      el.textContent = lot.status === "vendido" ? "✕" : "●";
    });
    // quita los marcadores de solares que ya no deben mostrarse (se desmarcaron o se quitó el pin)
    shownMarkerIds.forEach((id) => {
      if (!shouldShow.has(id)) {
        const el = document.getElementById("marker-" + id);
        if (el) { viewer.removeOverlay(el); el.remove(); }
      }
    });
    shownMarkerIds.clear();
    shouldShow.forEach((id) => shownMarkerIds.add(id));
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
    const updatedAt = new Date().toISOString();
    Object.assign(lot, patch, { updatedAt });
    renderAll(); // actualiza la pantalla de inmediato (no esperamos a la red)

    if (sb) {
      const row = { status: lot.status, x: lot.x, y: lot.y, note: lot.note, updated_at: updatedAt };
      sb.from("lots").update(row).eq("id", Number(id)).then(({ error }) => {
        if (error) {
          console.warn("No se pudo guardar en Supabase:", error);
          toast("⚠️ No se pudo guardar en la base de datos — revisa tu conexión");
        }
      });
      // los demás visitantes reciben este mismo cambio por la suscripción de Realtime
    } else {
      persistLocal();
    }
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
     11. VISOR DEL PLANO — OpenSeadragon (zoom profesional por mosaicos)
     -----------------------------------------------------------------
     En vez de cargar una sola imagen y "estirarla" con CSS al hacer zoom
     (lo cual se ve borroso en muchos celulares, sin importar qué tan
     grande sea el archivo original), este visor funciona como Google
     Maps: la imagen está pre-cortada en miles de mosaicos pequeños en
     varios niveles de detalle (ver assets/dzi/), y el visor descarga
     SOLO los mosaicos de la zona y el nivel de zoom que estás mirando
     en cada momento — con el detalle real del plano, no una ampliación
     artificial.
  ----------------------------------------------------------------- */
  const mapPanel = $("#mapPanel");
  let viewerReady = false;
  let IMG_W = 10960, IMG_H = 6476; // tamaño de respaldo; se reemplaza por el real en cuanto carga assets/dzi/plano.dzi

  const viewer = OpenSeadragon({
    element: $("#mapViewport"),
    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/",
    tileSources: "assets/dzi/plano.dzi",
    showNavigationControl: false,
    gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
    gestureSettingsTouch: { clickToZoom: false, dblClickToZoom: true },
    maxZoomPixelRatio: 4,      // permite acercarse más allá de la resolución nativa sin verse "a bloques"
    visibilityRatio: 1,
    constrainDuringPan: true,
    animationTime: 0.4,
    springStiffness: 8,
  });

  viewer.addHandler("open", () => {
    viewerReady = true;
    const size = viewer.world.getItem(0).getContentSize();
    IMG_W = size.x;
    IMG_H = size.y;
    renderAll(); // dibuja los marcadores que ya existieran guardados, ahora que el plano está listo
  });

  viewer.addHandler("zoom", () => {
    const pct = Math.round((viewer.viewport.getZoom() / viewer.viewport.getHomeZoom()) * 100);
    $("#zoomReadout").textContent = pct + "%";
  });

  function imageToViewportPoint(xPct, yPct) {
    return viewer.viewport.imageToViewportCoordinates(
      new OpenSeadragon.Point((xPct / 100) * IMG_W, (yPct / 100) * IMG_H)
    );
  }

  /* clic/toque sobre el plano: si hay un solar en modo "ubicar", coloca el marcador ahí */
  viewer.addHandler("canvas-click", (event) => {
    if (!placementLotId || !event.quick) return; // event.quick = toque sin arrastrar (no fue para mover el plano)
    const viewportPoint = viewer.viewport.pointFromPixel(event.position);
    const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
    let xPct = (imagePoint.x / IMG_W) * 100;
    let yPct = (imagePoint.y / IMG_H) * 100;
    xPct = Math.max(0, Math.min(100, xPct));
    yPct = Math.max(0, Math.min(100, yPct));
    const lot = state[placementLotId];
    const patch = { x: xPct, y: yPct };
    if (lot.status === "disponible") patch.status = "reservado";
    updateLot(placementLotId, patch);
    toast(`Marcador colocado en el Solar #${placementLotId}`);
    exitPlacementMode();
  });

  $("#btnZoomIn").addEventListener("click", () => viewer.viewport.zoomBy(1.3));
  $("#btnZoomOut").addEventListener("click", () => viewer.viewport.zoomBy(1 / 1.3));
  $("#btnZoomReset").addEventListener("click", () => viewer.viewport.goHome());

  /* ---------------------------------------------------------------
     11b. PANTALLA COMPLETA DEL PLANO (móvil y escritorio)
     -----------------------------------------------------------------
     OpenSeadragon detecta solo el cambio de tamaño del contenedor y
     reencuadra el plano completo dentro del espacio disponible — ya
     no hace falta calcular ancho/alto a mano como antes.
  ----------------------------------------------------------------- */
  let isMapFullscreen = false;
  function enterFullscreenMap() {
    isMapFullscreen = true;
    mapPanel.classList.add("is-fullscreen");
    document.body.classList.add("map-fullscreen-active");
    $("#iconExpand").hidden = true;
    $("#iconCollapse").hidden = false;
    $("#btnMapExpand").setAttribute("aria-label", "Salir de pantalla completa");
  }
  function exitFullscreenMap() {
    if (!isMapFullscreen) return;
    isMapFullscreen = false;
    mapPanel.classList.remove("is-fullscreen");
    document.body.classList.remove("map-fullscreen-active");
    $("#iconExpand").hidden = false;
    $("#iconCollapse").hidden = true;
    $("#btnMapExpand").setAttribute("aria-label", "Ampliar plano a pantalla completa");
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
    if (lot.x != null && lot.y != null && viewerReady) {
      const point = imageToViewportPoint(lot.x, lot.y);
      viewer.viewport.panTo(point, false);
      viewer.viewport.zoomTo(viewer.viewport.getHomeZoom() * 7, null, false);
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
  renderAll();
})();