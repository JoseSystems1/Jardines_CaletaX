(function () {
  "use strict";

  console.log("=== SCRIPT INICIANDO ===");

  /* ---------------------------------------------------------------
     0. CONFIGURACIÓN
  ----------------------------------------------------------------- */
  const CONFIG = {
    ADMIN_PASSWORD: "caletax2026",
    STORAGE_KEY_PREFIX: "jcx_lots_state_v2_",
    SESSION_KEY: "jcx_admin_session_v1",
  };

  const SUPABASE_URL = "https://tecoypzwhxqczrvfwmbf.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY295cHp3aHhxY3pydmZ3bWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTUwNDksImV4cCI6MjA5Nzk3MTA0OX0.jlk6w44lpkgvTMieC8oqZlxNOt2JsMCNGTxHBOWswfo";

  console.log("✓ Config cargada");
  console.log("✓ Supabase URL:", SUPABASE_URL);
  console.log("✓ window.supabase existe?", typeof window.supabase !== "undefined");

  const USE_SUPABASE = typeof window.supabase !== "undefined";
  console.log("✓ USE_SUPABASE =", USE_SUPABASE);

  const sb = USE_SUPABASE ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  console.log("✓ Cliente Supabase:", sb ? "✅ CONECTADO" : "❌ NO CONECTADO");

  /* ---------------------------------------------------------------
     1. DATOS BASE DE CADA PROYECTO
  ----------------------------------------------------------------- */
  const LOTS_BASE_X = [
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

  const LOTS_BASE_IX = [
    [1,1000.00],[2,1460.71],[3,1000.00],[4,395.14],[5,324.20],[6,319.51],[7,314.83],
    [8,310.14],[9,305.46],[10,300.77],[11,331.39],[12,335.90],[13,300.00],[14,300.00],
    [15,300.00],[16,300.00],[17,300.00],[18,300.00],[19,360.06],[20,270.40],[21,270.40],
    [22,270.40],[23,270.40],[24,270.40],[25,270.40],[26,270.40],[27,270.40],[28,270.40],
    [29,270.40],[30,270.40],[31,270.40],[32,270.40],[33,270.40],[34,270.40],[35,270.40],
    [36,278.99],[37,207.00],[38,207.00],[39,207.00],[40,207.00],[41,207.00],[42,207.00],
    [43,279.01],[44,288.35],[45,213.93],[46,213.93],[47,213.93],[48,213.93],[49,213.93],
    [50,213.93],[51,288.39],[52,303.79],[53,243.00],[54,243.00],[55,243.00],[56,243.00],
    [57,243.00],[58,243.00],[59,243.00],[60,243.00],[61,243.00],[62,243.00],[63,243.00],
    [64,243.00],[65,243.00],[66,243.00],[67,243.00],[68,303.75],[69,303.75],[70,243.00],
    [71,243.00],[72,243.00],[73,243.00],[74,243.00],[75,243.00],[76,243.00],[77,243.00],
    [78,243.00],[79,243.00],[80,243.00],[81,243.00],[82,243.00],[83,243.00],[84,243.00],
    [85,303.68],[86,352.46],[87,250.00],[88,250.00],[89,250.00],[90,250.00],[91,250.00],
    [92,250.00],[93,250.00],[94,250.00],[95,250.00],[96,250.00],[97,250.00],[98,250.00],
    [99,250.00],[100,250.00],[101,399.88],[102,399.63],[103,250.00],[104,250.00],[105,250.00],
    [106,250.00],[107,250.00],[108,250.00],[109,250.00],[110,250.00],[111,250.00],[112,250.00],
    [113,250.00],[114,250.00],[115,250.00],[116,250.00],[117,352.53],[118,352.46],[119,250.00],
    [120,250.00],[121,250.00],[122,250.00],[123,250.00],[124,250.00],[125,250.00],[126,250.00],
    [127,250.00],[128,250.00],[129,250.00],[130,250.00],[131,250.00],[132,250.00],[133,399.96],
    [134,399.61],[135,250.00],[136,250.00],[137,250.00],[138,250.00],[139,250.00],[140,250.00],
    [141,250.00],[142,250.00],[143,250.00],[144,250.00],[145,250.00],[146,250.00],[147,250.00],
    [148,250.00],[149,352.53],[150,300.00],[151,260.00],[152,260.00],[153,260.00],[154,260.00],
    [155,260.00],[156,260.00],[157,260.00],[158,260.00],[159,260.00],[160,260.00],[161,260.01],
    [162,260.00],[163,260.00],[164,260.00],[165,312.27],[166,312.21],[167,260.00],[168,260.00],
    [169,260.00],[170,260.00],[171,260.00],[172,260.00],[173,260.00],[174,260.00],[175,260.00],
    [176,260.00],[177,260.00],[178,260.00],[179,260.00],[180,260.00],[181,300.00],[182,321.70],
    [183,321.70],[184,321.70],[185,321.70],[186,321.70],[187,321.70],[188,321.70],[189,321.70],
    [190,321.70],[191,321.70],[192,321.70],[193,321.10],[194,350.00],[195,350.00],[196,350.00],
    [197,350.00],[198,350.00],[199,350.00],[200,350.00],[201,350.00],[202,350.00],[203,350.00],
    [204,350.00],[205,350.00],[206,460.00],[207,460.00],[208,460.00],[209,460.00],[210,552.08],
    [211,552.15],[212,460.00],[213,460.00],[214,460.00],[215,460.00],
  ];

  const PROJECTS = {
    x: {
      key: "x",
      title: "Urbanización Jardines de Caleta\u00A0X",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi/plano.dzi",
      imgW: 10960, imgH: 6476,
      lots: LOTS_BASE_X,
    },
    ix: {
      key: "ix",
      title: "Urbanización Jardines de Caleta\u00A0IX",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi-ix/plano.dzi",
      imgW: 13747, imgH: 14423,
      lots: LOTS_BASE_IX,
    },
  };

  let activeProject = "x";
  function P() { return PROJECTS[activeProject]; }

  /* ---------------------------------------------------------------
     2. ESTADO / PERSISTENCIA
  ----------------------------------------------------------------- */
  function defaultState(projKey) {
    const obj = {};
    PROJECTS[projKey].lots.forEach(([id, area]) => {
      obj[id] = {
        id, area, status: "disponible", x: null, y: null, note: "",
        price: null, currency: "USD", reservedDate: null,
        updatedAt: null,
      };
    });
    return obj;
  }

  function storageKey(projKey) { return CONFIG.STORAGE_KEY_PREFIX + projKey; }

  function loadLocalState(projKey) {
    try {
      const raw = localStorage.getItem(storageKey(projKey));
      if (!raw) return defaultState(projKey);
      const parsed = JSON.parse(raw);
      const base = defaultState(projKey);
      Object.keys(base).forEach((id) => {
        if (parsed[id]) base[id] = { ...base[id], ...parsed[id] };
      });
      return base;
    } catch (e) {
      console.warn("No se pudo leer localStorage:", projKey, e);
      return defaultState(projKey);
    }
  }

  const states = {
    x: defaultState("x"),
    ix: defaultState("ix"),
  };
  function currentState() { return states[activeProject]; }

  function persistLocal(projKey) {
    localStorage.setItem(storageKey(projKey), JSON.stringify(states[projKey]));
    broadcastUpdate(projKey);
  }

  let channel = null;
  if (!sb) {
    try { channel = new BroadcastChannel("jcx-sync"); } catch (e) { channel = null; }
  }
  function broadcastUpdate(projKey) {
    if (channel) { try { channel.postMessage({ type: "update", project: projKey, t: Date.now() }); } catch (e) {} }
  }
  if (channel) {
    channel.onmessage = (ev) => {
      if (ev && ev.data && ev.data.type === "update") {
        const pk = ev.data.project;
        if (PROJECTS[pk]) { states[pk] = loadLocalState(pk); if (pk === activeProject) renderAll(); else renderTabsMeta(); }
      }
    };
    window.addEventListener("storage", (ev) => {
      ["x", "ix"].forEach((pk) => {
        if (ev.key === storageKey(pk)) { states[pk] = loadLocalState(pk); if (pk === activeProject) renderAll(); else renderTabsMeta(); }
      });
    });
  }

  function rowToLot(row) {
    return {
      id: row.id,
      area: Number(row.area),
      status: row.status,
      x: row.x == null ? null : Number(row.x),
      y: row.y == null ? null : Number(row.y),
      note: row.note || "",
      price: row.price == null || row.price === "" ? null : Number(row.price),
      currency: row.currency || "USD",
      reservedDate: row.reserved_date || null,
      updatedAt: row.updated_at,
    };
  }

  async function loadStateFromSupabase() {
    if (!sb) {
      console.warn("⚠️ Supabase no disponible");
      return;
    }
    console.log("📡 Cargando datos de Supabase...");
    try {
      const { data, error } = await sb.from("lots").select("*").order("project").order("id");
      if (error || !data || data.length === 0) {
        console.warn("❌ Error al cargar Supabase:", error);
        return;
      }
      console.log("✅ Datos cargados:", data.length, "registros");
      const fresh = { x: defaultState("x"), ix: defaultState("ix") };
      data.forEach((row) => {
        const pk = row.project;
        if (fresh[pk] && fresh[pk][row.id]) {
          fresh[pk][row.id] = rowToLot(row);
        }
      });
      states.x = fresh.x;
      states.ix = fresh.ix;
      console.log("✅ Estados sincronizados desde Supabase");
    } catch (err) {
      console.error("❌ Error sincronizando Supabase:", err);
    }
  }

  function subscribeRealtime() {
    if (!sb) return;
    console.log("🔔 Suscribiendo a cambios en tiempo real...");
    sb.channel("lots-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "lots" }, (payload) => {
        console.log("🔔 Cambio en BD:", payload.eventType);
        const row = payload.new && Object.keys(payload.new).length ? payload.new : payload.old;
        if (!row || row.id == null) return;
        if (payload.eventType === "DELETE") return;
        const pk = row.project;
        if (!PROJECTS[pk]) return;
        states[pk][row.id] = rowToLot(row);
        if (pk === activeProject) renderAll(); else renderTabsMeta();
      })
      .subscribe();
  }

  /* ---------------------------------------------------------------
     3. UTILIDADES
  ----------------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const fmtArea = (n) => n.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m²";
  const CURRENCY_SYMBOL = { USD: "US$", DOP: "RD$" };
  const fmtPrice = (amount, currency) => {
    if (amount == null || isNaN(amount)) return null;
    const sym = CURRENCY_SYMBOL[currency] || "US$";
    return sym + " " + Number(amount).toLocaleString("es-DO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  };
  const fmtDateOnly = (val) => {
    if (!val) return "—";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(val);
    const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(val);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("es-DO", { day: "2-digit", month: "long", year: "numeric" });
  };
  const todayISODate = () => {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  };
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
    document.body.classList.toggle("is-admin", value);
    if (!value) {
      $("#adminPanel").hidden = true;
      $("#adminOverlay").hidden = true;
      exitPlacementMode();
    }
    renderAll();
  }

  /* ---------------------------------------------------------------
     5. RENDER
  ----------------------------------------------------------------- */
  function renderStats() {
    const all = Object.values(currentState());
    const count = (s) => all.filter((l) => l.status === s).length;
    $("#statTotal").textContent = all.length;
    $("#statAvailable").textContent = count("disponible");
    $("#statReserved").textContent = count("reservado");
    $("#statSold").textContent = count("vendido");
  }

  function renderProjectChrome() {
    $("#projectTitle").innerHTML = P().title;
    $("#projectSubtitle").textContent = P().subtitle;
    $("#adminProjectTag").textContent = "Proyecto: " + P().title.replace(/\u00A0/g, " ");
    $$(".project-tab").forEach((t) => t.classList.toggle("is-active", t.dataset.project === activeProject));
  }

  function tabMeta(projKey) {
    const all = Object.values(states[projKey]);
    const total = all.length;
    const libres = all.filter((l) => l.status === "disponible").length;
    return `${total} solares · ${libres} libres`;
  }
  function renderTabsMeta() {
    $("#tabMetaX").textContent = tabMeta("x");
    $("#tabMetaIx").textContent = tabMeta("ix");
  }

  /* ---------------------------------------------------------------
     6. MARCADORES
  ----------------------------------------------------------------- */
  const shownMarkerIds = new Set();
  function renderMarkers() {
    if (!viewerReady) return;
    const shouldShow = new Set();
    Object.values(currentState()).forEach((lot) => {
      try {
      if (lot.x == null || lot.y == null || lot.status === "disponible") return;
      const idStr = String(lot.id);
      shouldShow.add(idStr);
      const elId = "marker-" + lot.id;
      let el = document.getElementById(elId);
      const point = imageToViewportPoint(lot.x, lot.y);
      if (!el) {
        el = document.createElement("div");
        el.id = elId;
        const lotId = lot.id;
        const openThis = (ev) => { if (ev) { ev.stopPropagation && ev.stopPropagation(); ev.preventDefault && ev.preventDefault(); } openLotModal(lotId); };
        viewer.addOverlay({ element: el, location: point, placement: OpenSeadragon.Placement.CENTER });
        el.addEventListener("click", openThis);
        el.addEventListener("touchend", openThis, { passive: false });
        try {
          el._tracker = new OpenSeadragon.MouseTracker({
            element: el,
            clickHandler: (e) => { if (e.quick) openLotModal(lotId); },
          });
          if (el._tracker.setTracking) el._tracker.setTracking(true);
        } catch (err) { }
      } else {
        viewer.updateOverlay(el, point, OpenSeadragon.Placement.CENTER);
      }
      el.className = "marker marker--" + lot.status;
      const pTxt = fmtPrice(lot.price, lot.currency);
      el.title = "Solar #" + lot.id + " — " + STATUS_LABEL[lot.status] + (pTxt ? " · " + pTxt : "");
      el.textContent = lot.status === "vendido" ? "✕" : "●";
      } catch (err) { console.warn("Error dibujando marcador:", lot && lot.id, err); }
    });
    shownMarkerIds.forEach((id) => {
      if (!shouldShow.has(id)) {
        const el = document.getElementById("marker-" + id);
        if (el) { if (el._tracker) { try { el._tracker.destroy(); } catch (e) {} } viewer.removeOverlay(el); el.remove(); }
      }
    });
    shownMarkerIds.clear();
    shouldShow.forEach((id) => shownMarkerIds.add(id));
  }

  /* ---------------------------------------------------------------
     7. LISTA DE RESERVAS
  ----------------------------------------------------------------- */
  let currentFilter = "activos";

  function renderLotList() {
    const list = $("#lotList");
    const empty = $("#emptyState");
    list.innerHTML = "";

    let lots = Object.values(currentState()).sort((a, b) => a.id - b.id);
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
      const priceTxt = fmtPrice(lot.price, lot.currency);
      li.innerHTML = `
        <div class="lot-row__badge is-${lot.status}">#${lot.id}</div>
        <div class="lot-row__info">
          <div class="lot-row__title">Solar No. ${lot.id} <span class="lot-row__meta">· ${fmtArea(lot.area)}</span></div>
          <div class="lot-row__status is-${lot.status}">${STATUS_LABEL[lot.status]}</div>
          ${priceTxt ? `<div class="lot-row__price">${priceTxt}</div>` : ""}
        </div>`;
      li.addEventListener("click", () => openLotModal(lot.id));
      list.appendChild(li);
    });
  }

  /* ---------------------------------------------------------------
     8. PANEL ADMIN
  ----------------------------------------------------------------- */
  function renderAdminTable() {
    if (!isAdmin) return;
    const body = $("#adminTableBody");
    const term = $("#adminSearch").value.trim();
    const statusFilter = $("#adminStatusFilter").value;
    body.innerHTML = "";

    Object.values(currentState())
      .sort((a, b) => a.id - b.id)
      .filter((l) => (term ? String(l.id).includes(term) : true))
      .filter((l) => (statusFilter === "todos" ? true : l.status === statusFilter))
      .forEach((lot) => {
        const tr = document.createElement("tr");
        const priceTxt = fmtPrice(lot.price, lot.currency);
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
            <button class="price-btn ${priceTxt ? "has-price" : ""}" data-id="${lot.id}">
              ${priceTxt ? priceTxt : "Poner precio"}
            </button>
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
        const patch = { status: sel.value };
        const lot = currentState()[id];
        if (sel.value !== "disponible" && lot && !lot.reservedDate) patch.reservedDate = todayISODate();
        updateLot(id, patch);
        toast(`Solar #${id} → ${STATUS_LABEL[sel.value]}`);
      });
    });
    body.querySelectorAll(".price-btn").forEach((btn) => {
      btn.addEventListener("click", () => openLotModal(btn.dataset.id));
    });
    body.querySelectorAll(".pin-btn").forEach((btn) => {
      btn.addEventListener("click", () => enterPlacementMode(btn.dataset.id));
    });
  }

  function renderAll() {
    renderProjectChrome();
    renderStats();
    renderTabsMeta();
    renderMarkers();
    renderLotList();
    renderAdminTable();
  }

  /* ---------------------------------------------------------------
     9. ACTUALIZAR SOLAR
  ----------------------------------------------------------------- */
  function updateLot(id, patch) {
    const lot = currentState()[id];
    if (!lot) return;
    const updatedAt = new Date().toISOString();
    Object.assign(lot, patch, { updatedAt });
    renderAll();

    if (sb) {
      const row = {
        status: lot.status, x: lot.x, y: lot.y, note: lot.note,
        price: lot.price, currency: lot.currency, reserved_date: lot.reservedDate,
        updated_at: updatedAt,
      };
      sb.from("lots").update(row)
        .eq("project", activeProject)
        .eq("id", Number(id))
        .then(({ error }) => {
          if (error) {
            console.warn("❌ Error guardando en Supabase:", error);
            toast("⚠️ Error al guardar");
          } else {
            console.log("✅ Solar #" + id + " guardado");
          }
        });
    } else {
      persistLocal(activeProject);
    }
  }

  /* ---------------------------------------------------------------
     10. UBICAR MARCADOR
  ----------------------------------------------------------------- */
  let placementLotId = null;
  let reopenAdminPanelAfterPlacement = false;
  let reopenLotModalAfterPlacement = false;

  function enterPlacementMode(id) {
    placementLotId = String(id);
    $("#placementBanner").hidden = false;
    $("#placementLotLabel").textContent = "Solar #" + id;
    $("#mapViewport").classList.add("is-placing");
    reopenAdminPanelAfterPlacement = !$("#adminPanel").hidden;
    $("#adminPanel").hidden = true;
    $("#adminOverlay").hidden = true;
    reopenLotModalAfterPlacement = !$("#lotBackdrop").hidden;
    $("#lotBackdrop").hidden = true;
    exitFullscreenMap();
    const mp = $("#mapPanel");
    if (mp) mp.scrollIntoView({ behavior: "smooth", block: "start" });
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
     11. VISOR OpenSeadragon
  ----------------------------------------------------------------- */
  let viewerReady = false;
  let IMG_W = PROJECTS.x.imgW, IMG_H = PROJECTS.x.imgH;
  const mapViewportEl = $("#mapViewport");

  const viewer = OpenSeadragon({
    element: mapViewportEl,
    prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/",
    tileSources: PROJECTS.x.dzi,
    showNavigationControl: false,
    gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
    gestureSettingsTouch: { clickToZoom: false, dblClickToZoom: true },
    maxZoomPixelRatio: 4,
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
    console.log("✓ Plano cargado:", IMG_W, "x", IMG_H);
    renderMarkers();
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

  viewer.addHandler("canvas-click", (event) => {
    if (!placementLotId || !event.quick) return;
    const viewportPoint = viewer.viewport.pointFromPixel(event.position);
    const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
    let xPct = (imagePoint.x / IMG_W) * 100;
    let yPct = (imagePoint.y / IMG_H) * 100;
    xPct = Math.max(0, Math.min(100, xPct));
    yPct = Math.max(0, Math.min(100, yPct));
    const lot = currentState()[placementLotId];
    const patch = { x: xPct, y: yPct };
    if (lot.status === "disponible") {
      patch.status = "reservado";
      if (!lot.reservedDate) patch.reservedDate = todayISODate();
    }
    updateLot(placementLotId, patch);
    toast(`Marcador colocado en el Solar #${placementLotId}`);
    exitPlacementMode();
  });

  $("#btnZoomIn").addEventListener("click", () => viewer.viewport.zoomBy(1.3));
  $("#btnZoomOut").addEventListener("click", () => viewer.viewport.zoomBy(1 / 1.3));
  $("#btnZoomReset").addEventListener("click", () => viewer.viewport.goHome());

  function openProjectInViewer() {
    const p = P();
    viewerReady = false;
    shownMarkerIds.forEach((id) => {
      const el = document.getElementById("marker-" + id);
      if (el && el._tracker) { try { el._tracker.destroy(); } catch (e) {} }
    });
    viewer.clearOverlays();
    shownMarkerIds.clear();
    IMG_W = p.imgW; IMG_H = p.imgH;
    if (!isMapFullscreen) mapViewportEl.style.aspectRatio = p.imgW + " / " + p.imgH;
    console.log("📂 Abriendo proyecto:", p.key);
    viewer.open(p.dzi);
  }

  /* ---------------------------------------------------------------
     11b. CAMBIO DE PESTAÑA
  ----------------------------------------------------------------- */
  function switchProject(projKey) {
    if (!PROJECTS[projKey] || projKey === activeProject) return;
    activeProject = projKey;

    exitPlacementMode();
    closeModals();
    $("#searchInput").value = "";
    currentFilter = "activos";
    $$(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.filter === "activos"));

    renderProjectChrome();
    renderAll();
    openProjectInViewer();

    if (isAdmin && !$("#adminPanel").hidden) renderAdminTable();
  }

  $$(".project-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchProject(tab.dataset.project));
  });

  /* ---------------------------------------------------------------
     11c. PANTALLA COMPLETA
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
     12. MODAL DE DETALLE
  ----------------------------------------------------------------- */
  let activeLotId = null;

  function openLotModal(id) {
    activeLotId = String(id);
    const lot = currentState()[activeLotId];
    if (!lot) return;
    $("#lotModalEyebrow").textContent = "SOLAR No. " + lot.id;
    $("#lotModalTitle").textContent = "Solar No. " + lot.id;
    $("#lotModalArea").textContent = fmtArea(lot.area);
    $("#lotModalStatusText").textContent = STATUS_LABEL[lot.status];
    $("#lotModalUpdated").textContent = fmtDate(lot.updatedAt);

    const priceTxt = fmtPrice(lot.price, lot.currency);
    $("#lotModalPrice").textContent = priceTxt ? priceTxt : "A consultar";
    const reservedRow = $("#lotModalReservedRow");
    if (lot.status !== "disponible" && lot.reservedDate) {
      $("#lotModalReservedLabel").textContent = lot.status === "vendido" ? "Fecha de venta" : "Fecha de reserva";
      $("#lotModalReserved").textContent = fmtDateOnly(lot.reservedDate);
      reservedRow.hidden = false;
    } else {
      reservedRow.hidden = true;
    }

    const adminBox = $("#lotModalAdminControls");
    adminBox.hidden = !isAdmin;
    if (isAdmin) {
      $("#lotModalStatusSelect").value = lot.status;
      $("#lotModalNote").value = lot.note || "";
      $("#lotModalPriceInput").value = lot.price != null ? lot.price : "";
      $("#lotModalCurrency").value = lot.currency || "USD";
      $("#lotModalDateInput").value = lot.reservedDate || "";
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

  function collectLotModalPatch() {
    const status = $("#lotModalStatusSelect").value;
    const rawPrice = $("#lotModalPriceInput").value.trim();
    const price = rawPrice === "" ? null : Number(rawPrice.replace(/,/g, ""));
    const currency = $("#lotModalCurrency").value;
    let reservedDate = $("#lotModalDateInput").value || null;
    if (status !== "disponible" && !reservedDate) reservedDate = todayISODate();
    return {
      status,
      note: $("#lotModalNote").value,
      price: price != null && isNaN(price) ? null : price,
      currency,
      reservedDate,
    };
  }

  $("#btnSaveLot").addEventListener("click", () => {
    if (!activeLotId) return;
    updateLot(activeLotId, collectLotModalPatch());
    toast(`Solar #${activeLotId} actualizado`);
    closeModals();
  });

  $("#btnRemoveMarker").addEventListener("click", () => {
    if (!activeLotId) return;
    updateLot(activeLotId, { x: null, y: null });
    toast(`Marcador del Solar #${activeLotId} eliminado`);
    openLotModal(activeLotId);
  });

  $("#btnPlaceMarker").addEventListener("click", () => {
    if (!activeLotId) return;
    updateLot(activeLotId, collectLotModalPatch());
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
    const payload = { project: activeProject, projectName: P().title.replace(/\u00A0/g, " "), lots: currentState() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `jardines-caleta-${activeProject}-solares.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  /* ---------------------------------------------------------------
     14. FILTROS
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
     14b. SIDEBAR MÓVIL
  ----------------------------------------------------------------- */
  const sidebarEl = $(".sidebar");
  $("#btnSidebarToggle").addEventListener("click", () => {
    if (window.innerWidth > 720) return;
    const collapsed = sidebarEl.classList.toggle("is-collapsed");
    $("#btnSidebarToggle").setAttribute("aria-expanded", String(!collapsed));
  });
  if (window.innerWidth <= 720) {
    sidebarEl.classList.add("is-collapsed");
    $("#btnSidebarToggle").setAttribute("aria-expanded", "false");
  }

  /* ---------------------------------------------------------------
     15. BUSCADOR
  ----------------------------------------------------------------- */
  function locateLot(id) {
    if (!currentState()[id]) { toast("No existe el solar #" + id); return false; }
    const lot = currentState()[id];

    if (lot.x != null && lot.y != null && viewerReady) {
      const point = imageToViewportPoint(lot.x, lot.y);
      viewer.viewport.panTo(point, false);
      viewer.viewport.zoomTo(viewer.viewport.getHomeZoom() * 7, null, false);
    }

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
     15b. BOTÓN MARCAR
  ----------------------------------------------------------------- */
  $("#btnAdminMark").addEventListener("click", () => {
    const id = $("#searchInput").value.trim();
    if (!id) {
      toast("Escribe el número del solar");
      $("#searchInput").focus();
      return;
    }
    if (!currentState()[id]) { toast("No existe el solar #" + id); return; }
    exitFullscreenMap();
    locateLot(id);
    openLotModal(id);
  });

  /* ---------------------------------------------------------------
     16. MODO CALIBRACIÓN (ubicar solares manualmente)
  ----------------------------------------------------------------- */
  let calibrationMode = false;
  let calibrationLotId = null;

  function startCalibration(lotId) {
    if (!isAdmin) return;
    calibrationMode = true;
    calibrationLotId = String(lotId);
    $("#mapViewport").classList.add("is-placing");
    const banner = document.createElement("div");
    banner.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; background: #FF6B35; color: white;
      padding: 12px; text-align: center; z-index: 100; font-weight: bold; font-size: 14px;
    `;
    banner.id = "calibrationBanner";
    banner.textContent = `🎯 MODO CALIBRACIÓN: Haz click en el plano donde está el Solar #${lotId}`;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  function endCalibration() {
    calibrationMode = false;
    calibrationLotId = null;
    $("#mapViewport").classList.remove("is-placing");
    const banner = document.getElementById("calibrationBanner");
    if (banner) banner.remove();
  }

  viewer.addHandler("canvas-click", (event) => {
    // MODO CALIBRACIÓN: ubicar solar
    if (calibrationMode && calibrationLotId && event.quick) {
      const viewportPoint = viewer.viewport.pointFromPixel(event.position);
      const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
      let xPct = (imagePoint.x / IMG_W) * 100;
      let yPct = (imagePoint.y / IMG_H) * 100;
      xPct = Math.max(0, Math.min(100, xPct));
      yPct = Math.max(0, Math.min(100, yPct));
      
      console.log(`📍 Solar #${calibrationLotId}: x=${xPct.toFixed(3)}, y=${yPct.toFixed(3)}`);
      
      // Guardar en Supabase
      const patch = { x: xPct, y: yPct, status: "reservado" };
      updateLot(calibrationLotId, patch);
      toast(`✅ Solar #${calibrationLotId} ubicado en (${xPct.toFixed(1)}%, ${yPct.toFixed(1)}%)`);
      
      endCalibration();
      return;
    }

    // MODO COLOCACIÓN (original)
    if (!placementLotId || !event.quick) return;
    const viewportPoint = viewer.viewport.pointFromPixel(event.position);
    const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
    let xPct = (imagePoint.x / IMG_W) * 100;
    let yPct = (imagePoint.y / IMG_H) * 100;
    xPct = Math.max(0, Math.min(100, xPct));
    yPct = Math.max(0, Math.min(100, yPct));
    const lot = currentState()[placementLotId];
    const patch = { x: xPct, y: yPct };
    if (lot.status === "disponible") {
      patch.status = "reservado";
      if (!lot.reservedDate) patch.reservedDate = todayISODate();
    }
    updateLot(placementLotId, patch);
    toast(`Marcador colocado en el Solar #${placementLotId}`);
    exitPlacementMode();
  });

  /* ---------------------------------------------------------------
     16b. PANEL DE CALIBRACIÓN (botón rápido)
  ----------------------------------------------------------------- */
  // Agregar botón de calibración al header (oculto hasta que sea admin)
  const calibPanel = document.createElement("div");
  calibPanel.id = "calibrationPanel";
  calibPanel.style.cssText = `
    display: none; position: fixed; bottom: 20px; right: 20px; z-index: 80;
    background: white; border: 2px solid #FF6B35; border-radius: 10px; padding: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2); max-width: 280px; font-family: system-ui;
  `;
  calibPanel.innerHTML = `
    <div style="font-size: 12px; font-weight: bold; color: #FF6B35; margin-bottom: 8px;">🎯 CALIBRACIÓN RÁPIDA</div>
    <input type="number" id="calibrationInput" placeholder="Número de solar (ej. 52)" min="1" max="215" 
      style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 8px; font-size: 14px;">
    <button id="btnStartCalibration" style="
      width: 100%; padding: 8px; background: #FF6B35; color: white; border: none; 
      border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px;
    ">Iniciar ubicación</button>
    <button id="btnCancelCalibration" style="
      width: 100%; padding: 8px; background: #ccc; color: #333; border: none; 
      border-radius: 6px; margin-top: 6px; cursor: pointer; font-size: 13px;
    ">Cancelar</button>
  `;
  document.body.appendChild(calibPanel);

  $("#btnStartCalibration").addEventListener("click", () => {
    const lotId = $("#calibrationInput").value.trim();
    if (!lotId) { toast("Escribe el número del solar"); return; }
    if (!currentState()[lotId]) { toast("Solar #" + lotId + " no existe"); return; }
    startCalibration(lotId);
  });

  $("#btnCancelCalibration").addEventListener("click", endCalibration);
  $("#calibrationInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#btnStartCalibration").click();
  });

  // Mostrar panel cuando sea admin
  const origSetAdmin = setAdmin.bind(this);
  setAdmin = function(value) {
    origSetAdmin(value);
    if (value) {
      calibPanel.style.display = "block";
      toast("📍 Panel de calibración activo — ubica solares en el plano");
    } else {
      calibPanel.style.display = "none";
      endCalibration();
    }
  };

  /* ---------------------------------------------------------------
     17. INICIALIZACIÓN (ESPERA A SUPABASE PRIMERO)
  ----------------------------------------------------------------- */
  async function initializeApp() {
    console.log("⏳ Inicializando aplicación...");
    
    // Cargar datos de Supabase
    if (sb) {
      await loadStateFromSupabase();
      subscribeRealtime();
    }
    
    // Configurar DOM
    mapViewportEl.style.aspectRatio = PROJECTS.x.imgW + " / " + PROJECTS.x.imgH;
    setAdmin(isAdmin);
    
    // AHORA renderizar
    renderAll();
    
    console.log("✅ === APP LISTA ===");
  }

  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    console.log("📄 DOM aún cargando, esperando...");
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    console.log("📄 DOM ya listo, inicializando app...");
    initializeApp();
  }
})();