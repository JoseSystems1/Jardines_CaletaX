(function () {
  "use strict";

  console.log("=== SCRIPT INICIANDO ===");

  /* ---------------------------------------------------------------
     0. CONFIGURACIÓN
  ----------------------------------------------------------------- */
  const CONFIG = {
    ADMIN_USER: "adonel",
    ADMIN_PASSWORD: "jardinesx2026",
    STORAGE_KEY_PREFIX: "jcx_lots_state_v2_",
    SESSION_KEY: "jcx_admin_session_v1",
    NOTE_MAX: 500,
  };

  const SUPABASE_URL = "https://tecoypzwhxqczrvfwmbf.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY295cHp3aHhxY3pydmZ3bWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTUwNDksImV4cCI6MjA5Nzk3MTA0OX0.jlk6w44lpkgvTMieC8oqZlxNOt2JsMCNGTxHBOWswfo";

  const USE_SUPABASE = typeof window.supabase !== "undefined";
  const sb = USE_SUPABASE ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  console.log("✓ Cliente Supabase:", sb ? "✅ CONECTADO" : "❌ NO CONECTADO");

  /* ---------------------------------------------------------------
     1. DATOS BASE DE CADA PROYECTO
  ----------------------------------------------------------------- */
  const LOTS_BASE_X = [
    [1,425],[2,427],[3,426],[4,429],[5,430],[6,431],[7,431],
    [8,435],[9,435],[10,431],[11,360],[12,228],[13,249],[14,240],
    [15,240],[16,240],[17,240],[18,240],[19,240],[20,240],[21,240],
    [22,240],[23,240],[24,240],[25,240],[26,240],[27,240],[28,240],
    [29,240],[30,240],[31,240],[32,240],[33,240],[34,240],[35,240],
    [36,240],[37,240],[38,314],[39,352],[40,285],[41,300],[42,347],
    [43,240],[44,240],[45,240],[46,240],[47,240],[48,240],[49,240],
    [50,240],[51,240],[52,240],[53,230],[54,230],[55,230],[56,230],
    [57,230],[58,230],[59,230],[60,230],[61,230],[62,386],[63,367],
    [64,281],[65,301],[66,410],[67,230],[68,230],[69,230],[70,230],
    [71,230],[72,230],[73,230],[74,230],[75,220],[76,220],[77,220],
    [78,220],[79,220],[80,220],[81,220],[82,220],[83,276],[84,382],
    [85,405],[86,224],[87,220],[88,220],[89,220],[90,220],[91,220],
    [92,220],[93,220],[94,220],[95,220],[96,220],[97,220],[98,220],
    [99,220],[100,220],[101,301],[102,382],[103,220],[104,220],[105,220],
    [106,220],[107,220],[108,220],[109,174],[110,604],[111,639],[112,265],
    [113,270],[114,270],[115,270],[116,270],[117,270],[118,270],[119,268],
    [120,439],[121,386],[122,389],[123,392],[124,395],[125,419],[126,294],
    [127,250],[128,250],[129,250],[130,250],[131,250],[132,376],[133,347],
    [134,245],[135,250],[136,254],[137,259],[138,305],[139,444],[140,383],
    [141,383],[142,383],[143,505],[144,471],[145,353],[146,356],[147,359],
    [148,362],[149,365],[150,487],[151,361],[152,363],[153,364],[154,366],
    [155,446],[156,163.62],
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
    x: { key: "x", title: "Urbanización Jardines de Caleta\u00A0X",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi/plano.dzi", imgW: 10960, imgH: 6476, lots: LOTS_BASE_X },
    ix: { key: "ix", title: "Urbanización Jardines de Caleta\u00A0IX",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi-ix/plano.dzi", imgW: 10300, imgH: 9900, lots: LOTS_BASE_IX },
  };

  let activeProject = "x";
  function P() { return PROJECTS[activeProject]; }

  /* ---------------------------------------------------------------
     2. ESTADO / PERSISTENCIA
  ----------------------------------------------------------------- */
  function defaultState(projKey) {
    const obj = {};
    PROJECTS[projKey].lots.forEach(([id, area]) => {
      obj[id] = { id, area, status: "disponible", x: null, y: null, note: "",
        price: null, currency: "DOP", reservedDate: null, rate: null, updatedAt: null };
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
      Object.keys(base).forEach((id) => { if (parsed[id]) base[id] = { ...base[id], ...parsed[id] }; });
      return base;
    } catch (e) { console.warn("No se pudo leer localStorage:", projKey, e); return defaultState(projKey); }
  }

  const states = { x: defaultState("x"), ix: defaultState("ix") };
  function currentState() { return states[activeProject]; }

  function persistLocal(projKey) {
    localStorage.setItem(storageKey(projKey), JSON.stringify(states[projKey]));
    broadcastUpdate(projKey);
  }

  let channel = null;
  if (!sb) { try { channel = new BroadcastChannel("jcx-sync"); } catch (e) { channel = null; } }
  function broadcastUpdate(projKey) {
    if (channel) { try { channel.postMessage({ type: "update", project: projKey, t: Date.now() }); } catch (e) {} }
  }
  if (channel) {
    channel.onmessage = (ev) => {
      if (ev && ev.data && ev.data.type === "update") {
        const pk = ev.data.project;
        if (PROJECTS[pk]) { states[pk] = loadLocalState(pk); repaintMarkers(pk); if (pk === activeProject) renderAll(); else renderTabsMeta(); }
      }
    };
    window.addEventListener("storage", (ev) => {
      ["x", "ix"].forEach((pk) => {
        if (ev.key === storageKey(pk)) { states[pk] = loadLocalState(pk); repaintMarkers(pk); if (pk === activeProject) renderAll(); else renderTabsMeta(); }
      });
    });
  }

  function rowToLot(row) {
    return {
      id: row.id, area: Number(row.area),
      status: ALLOWED_STATUS[row.status] ? row.status : "disponible",
      x: row.x == null ? null : Number(row.x),
      y: row.y == null ? null : Number(row.y),
      note: row.note || "",
      price: row.price == null || row.price === "" ? null : Number(row.price),
      currency: row.currency || "DOP",
      reservedDate: row.reserved_date || null,
      rate: row.rate == null || row.rate === "" ? null : Number(row.rate),
      updatedAt: row.updated_at,
    };
  }

  async function loadStateFromSupabase() {
    if (!sb) { console.warn("⚠️ Supabase no disponible"); return; }
    try {
      const { data, error } = await sb.from("lots").select("*").order("project").order("id");
      if (error || !data || data.length === 0) { console.warn("❌ Error al cargar Supabase:", error); return; }
      const fresh = { x: defaultState("x"), ix: defaultState("ix") };
      data.forEach((row) => { const pk = row.project; if (fresh[pk] && fresh[pk][row.id]) fresh[pk][row.id] = rowToLot(row); });
      states.x = fresh.x; states.ix = fresh.ix;
      console.log("✅ Estados sincronizados desde Supabase");
    } catch (err) { console.error("❌ Error sincronizando Supabase:", err); }
  }

  function subscribeRealtime() {
    if (!sb) return;
    sb.channel("lots-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "lots" }, (payload) => {
        const row = payload.new && Object.keys(payload.new).length ? payload.new : payload.old;
        if (!row || row.id == null) return;
        if (payload.eventType === "DELETE") return;
        const pk = row.project;
        if (!PROJECTS[pk]) return;
        states[pk][row.id] = rowToLot(row);
        repaintMarkers(pk);
        if (pk === activeProject) renderAll(); else renderTabsMeta();
      })
      .subscribe();
  }

  /* ---------------------------------------------------------------
     3. UTILIDADES
  ----------------------------------------------------------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function clampNumber(v, min, max) {
    const n = Number(v);
    if (isNaN(n)) return null;
    return Math.min(max, Math.max(min, n));
  }
  const ALLOWED_STATUS = { disponible: 1, reservado: 1, vendido: 1 };

  const fmtArea = (n) => n.toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m²";
  const CURRENCY_SYMBOL = { USD: "US$", DOP: "RD$" };

  const FALLBACK_RATE = 62;
  let liveRate = null, manualRate = null, rateLoaded = false;
  let usdDopRate = FALLBACK_RATE;

  function recomputeRate() {
    usdDopRate = (manualRate && manualRate > 0) ? manualRate : (liveRate && liveRate > 0 ? liveRate : FALLBACK_RATE);
    try { updateRateDisplay(); } catch (e) {}
    try { renderAll(); } catch (e) {}
    try { updatePricePreview(); } catch (e) {}
  }

  // La tasa del dólar es MANUAL: la fija el admin y se guarda para todos.
  // Si no hay tasa fija guardada, se usa FALLBACK_RATE como respaldo.

  async function loadManualRate() {
    try {
      if (sb) {
        const { data, error } = await sb.from("app_settings").select("value").eq("key", "usd_rate").maybeSingle();
        if (!error && data && data.value != null) { const n = Number(data.value); if (!isNaN(n) && n > 0) manualRate = n; }
      } else {
        const r = localStorage.getItem("jcx_manual_rate");
        if (r) { const n = Number(r); if (!isNaN(n) && n > 0) manualRate = n; }
      }
    } catch (e) { console.warn("No se pudo cargar la tasa fija:", e); }
  }

  function subscribeRateRealtime() {
    if (!sb) return;
    try {
      sb.channel("settings-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "app_settings" }, (payload) => {
          const row = (payload.new && Object.keys(payload.new).length) ? payload.new : payload.old;
          if (!row || row.key !== "usd_rate") return;
          if (payload.eventType === "DELETE") { manualRate = null; }
          else { const n = Number(row.value); manualRate = (!isNaN(n) && n > 0) ? n : null; }
          recomputeRate();
        })
        .subscribe();
    } catch (e) {}
  }

  async function saveManualRate(rate) {
    const clamped = clampNumber(rate, 1, 1000);
    manualRate = (clamped && clamped > 0) ? clamped : null;
    recomputeRate();
    try {
      if (sb) {
        if (manualRate) {
          const { error } = await sb.from("app_settings")
            .upsert({ key: "usd_rate", value: String(manualRate), updated_at: new Date().toISOString() }, { onConflict: "key" });
          if (error) { console.warn("❌ Error guardando tasa:", error); toast("⚠️ No se pudo guardar la tasa (¿creaste la tabla app_settings?)"); }
        } else { await sb.from("app_settings").delete().eq("key", "usd_rate"); }
      } else {
        if (manualRate) localStorage.setItem("jcx_manual_rate", String(manualRate));
        else localStorage.removeItem("jcx_manual_rate");
      }
    } catch (e) { console.warn("Error guardando tasa:", e); }
  }

  function updateRateDisplay() {
    const eff = $("#rateEffective");
    if (eff) eff.textContent = "RD$ " + Number(usdDopRate).toFixed(2) + " por US$1";
    const hint = $("#rateHint");
    if (hint) {
      hint.textContent = (manualRate && manualRate > 0)
        ? "Tasa fija del admin. Se aplica a los solares DISPONIBLES. Los reservados/vendidos conservan la que tenían."
        : "Escribe la tasa del dólar y pulsa Fijar. Se aplica a los disponibles; los reservados/vendidos conservan la suya.";
    }
    const inp = $("#rateInput");
    if (inp && document.activeElement !== inp && manualRate && manualRate > 0) {
      inp.value = manualRate;
    }
  }

  function computeTotals(lot) {
    if (!lot || lot.price == null || isNaN(lot.price)) return null;
    const dop = Number(lot.area) * Number(lot.price);
    // Tasa: si el solar está reservado/vendido y tiene una tasa CONGELADA, se usa esa
    // (la que tenía al reservarlo/venderlo). Si está disponible, se usa la tasa actual.
    const rate = (lot.status !== "disponible" && lot.rate != null && lot.rate > 0) ? lot.rate : usdDopRate;
    const usd = rate ? dop / rate : null;
    return { usd, dop, total: dop, rate };
  }

  function fmtMoney(amount, currency) {
    if (amount == null || isNaN(amount)) return null;
    const sym = CURRENCY_SYMBOL[currency] || "US$";
    return sym + " " + Math.round(Number(amount)).toLocaleString("es-DO");
  }

  function fmtPriceBoth(lot) {
    const t = computeTotals(lot);
    if (!t) return null;
    return fmtMoney(t.usd, "USD") + " · " + fmtMoney(t.dop, "DOP");
  }

  function canSeePrice(lot) { return isAdmin || lot.status === "disponible"; }

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
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  /* ---------------------------------------------------------------
     4. SESIÓN ADMIN
  ----------------------------------------------------------------- */
  let isAdmin = false;
  async function checkAdminSession() {
    try { isAdmin = sessionStorage.getItem(CONFIG.SESSION_KEY) === "1"; } catch (e) { isAdmin = false; }
  }
  function setAdmin(value) {
    isAdmin = value;
    try { sessionStorage.setItem(CONFIG.SESSION_KEY, value ? "1" : "0"); } catch (e) {}
    $("#btnAdminToggle").classList.toggle("is-admin", value);
    $("#adminBtnLabel").textContent = value ? "Modo admin activo" : "Acceso admin";
    document.body.classList.toggle("is-admin", value);
    if (!value) { $("#adminPanel").hidden = true; $("#adminOverlay").hidden = true; exitPlacementMode(); }
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
    return `${all.length} solares · ${all.filter((l) => l.status === "disponible").length} libres`;
  }
  function renderTabsMeta() {
    $("#tabMetaX").textContent = tabMeta("x");
    $("#tabMetaIx").textContent = tabMeta("ix");
  }

  /* ---------------------------------------------------------------
     6. MARCADORES
  ----------------------------------------------------------------- */
  // ¿Hay ya un marcador de OTRO solar muy cerca de este punto? (evita solaparlos)
  // Devuelve el solar en conflicto o null. Umbral ~1.1% del ancho del plano.
  function nearbyMarkedLot(pk, xPct, yPct, excludeId) {
    const info = VW[pk];
    if (!info) return null;
    const W = info.W, H = info.H;
    const px = (xPct / 100) * W, py = (yPct / 100) * H;
    const minDist = 0.025 * W; // distancia mínima permitida entre marcadores (~2.5% del ancho)
    let hit = null, hitD = Infinity;
    Object.values(states[pk]).forEach((l) => {
      if (String(l.id) === String(excludeId)) return;
      if (l.x == null || l.y == null) return;
      const lx = (l.x / 100) * W, ly = (l.y / 100) * H;
      const d = Math.hypot(px - lx, py - ly);
      if (d < minDist && d < hitD) { hit = l; hitD = d; }
    });
    return hit;
  }

  function repaintMarkers(pk) {
    pk = pk || activeProject;
    const v = OSD[pk];
    const info = VW[pk];
    if (!v || !info || !info.ready) return;
    v.clearOverlays();
    let drawn = 0;
    Object.values(states[pk]).forEach((lot) => {
      try {
        if (lot.status === "disponible") return;
        if (lot.x == null || lot.y == null) return;
        const el = document.createElement("div");
        el.className = "marker marker--" + lot.status;
        el.textContent = String(lot.id); // el marcador muestra el NÚMERO del solar
        const digits = String(lot.id).length;
        el.classList.add(digits >= 3 ? "marker--d3" : (digits === 2 ? "marker--d2" : "marker--d1"));
        let tip = "Solar #" + lot.id + " — " + STATUS_LABEL[lot.status];
        if (lot.reservedDate) tip += " · " + fmtDateOnly(lot.reservedDate);
        if (isAdmin) { const pTxt = fmtPriceBoth(lot); if (pTxt) tip += " · " + pTxt; }
        el.title = tip;
        const lotId = lot.id;
        const openThis = (ev) => { if (ev) { ev.stopPropagation && ev.stopPropagation(); ev.preventDefault && ev.preventDefault(); } openLotModal(lotId); };
        el.addEventListener("click", openThis);
        el.addEventListener("touchend", openThis, { passive: false });
        const point = v.viewport.imageToViewportCoordinates(new OpenSeadragon.Point((lot.x / 100) * info.W, (lot.y / 100) * info.H));
        v.addOverlay({ element: el, location: point, placement: OpenSeadragon.Placement.CENTER });
        drawn++;
      } catch (err) { console.warn("Error dibujando marcador:", lot && lot.id, err); }
    });
  }
  function renderMarkers() { repaintMarkers(activeProject); }

  /* ---------------------------------------------------------------
     7. LISTA DE RESERVAS
  ----------------------------------------------------------------- */
  let currentFilter = "activos";

  function renderLotList() {
    const list = $("#lotList");
    const empty = $("#emptyState");
    list.innerHTML = "";
    let lots = Object.values(currentState()).sort((a, b) => a.id - b.id);
    if (currentFilter === "activos") lots = lots.filter((l) => l.status !== "disponible");
    if (lots.length === 0) { empty.hidden = false; return; }
    empty.hidden = true;
    lots.forEach((lot) => {
      const li = document.createElement("li");
      li.className = "lot-row is-" + lot.status;
      li.dataset.lotId = lot.id;
      const t = canSeePrice(lot) ? computeTotals(lot) : null;
      const priceHtml = t
        ? `<div class="lot-row__price">${fmtMoney(t.dop, "DOP")}</div>` +
          `<div class="lot-row__price-usd">${fmtMoney(t.usd, "USD")}</div>`
        : "";
      const dateTxt = (lot.status !== "disponible" && lot.reservedDate)
        ? (lot.status === "vendido" ? "Vendido el " : "Reservado el ") + fmtDateOnly(lot.reservedDate) : null;
      li.innerHTML = `
        <div class="lot-row__badge is-${lot.status}">#${lot.id}</div>
        <div class="lot-row__info">
          <div class="lot-row__title">Solar No. ${lot.id} <span class="lot-row__meta">· ${fmtArea(lot.area)}</span></div>
          <div class="lot-row__status is-${lot.status}">${STATUS_LABEL[lot.status]}</div>
          ${dateTxt ? `<div class="lot-row__date">${dateTxt}</div>` : ""}
          ${priceHtml}
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
        const priceTxt = fmtPriceBoth(lot);
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
            <button class="price-btn ${priceTxt ? "has-price" : ""}" data-id="${lot.id}">${priceTxt ? priceTxt : "Poner precio"}</button>
          </td>
          <td>
            <button class="pin-btn ${lot.x != null ? "has-pin" : ""}" data-id="${lot.id}">${lot.x != null ? "Reubicar" : "Ubicar en mapa"}</button>
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
    body.querySelectorAll(".price-btn").forEach((btn) => { btn.addEventListener("click", () => openLotModal(btn.dataset.id)); });
    body.querySelectorAll(".pin-btn").forEach((btn) => { btn.addEventListener("click", () => enterPlacementMode(btn.dataset.id)); });
  }

  function renderAll() {
    renderProjectChrome(); renderStats(); renderTabsMeta(); renderMarkers(); renderLotList(); renderAdminTable();
  }

  /* ---------------------------------------------------------------
     9. ACTUALIZAR SOLAR
  ----------------------------------------------------------------- */
  function updateLot(id, patch) {
    const lot = currentState()[id];
    if (!lot) return;

    // Congelar / liberar la TASA del dólar según el estado:
    // - Disponible: la tasa "flota" (usa la actual del sistema) -> rate = null
    // - Reservado/Vendido: si aún no tiene tasa congelada, se congela la ACTUAL
    //   (queda con la tasa que tenía en el momento de reservarlo/venderlo).
    const newStatus = (patch.status !== undefined) ? patch.status : lot.status;
    if (patch.rate === undefined) {
      if (newStatus === "disponible") patch.rate = null;
      else if (lot.rate == null) patch.rate = usdDopRate;
    }

    const updatedAt = new Date().toISOString();
    Object.assign(lot, patch, { updatedAt });
    renderAll();
    if (sb) {
      const row = { status: lot.status, area: lot.area, x: lot.x, y: lot.y, note: lot.note,
        price: lot.price, currency: lot.currency, reserved_date: lot.reservedDate,
        rate: lot.rate, updated_at: updatedAt };
      sb.from("lots").update(row).eq("project", activeProject).eq("id", Number(id))
        .then(({ error }) => { if (error) { console.warn("❌ Error guardando en Supabase:", error); toast("⚠️ Error al guardar"); } });
    } else { persistLocal(activeProject); }
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
    activeViewportEl().classList.add("is-placing");
    reopenAdminPanelAfterPlacement = !$("#adminPanel").hidden;
    $("#adminPanel").hidden = true; $("#adminOverlay").hidden = true;
    reopenLotModalAfterPlacement = !$("#lotBackdrop").hidden;
    $("#lotBackdrop").hidden = true;
    exitFullscreenMap();
    const mp = $("#mapPanel"); if (mp) mp.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function exitPlacementMode() {
    placementLotId = null;
    $("#placementBanner").hidden = true;
    activeViewportEl().classList.remove("is-placing");
    if (reopenAdminPanelAfterPlacement && isAdmin) { $("#adminPanel").hidden = false; $("#adminOverlay").hidden = false; renderAdminTable(); }
    reopenAdminPanelAfterPlacement = false;
    if (reopenLotModalAfterPlacement && activeLotId) openLotModal(activeLotId);
    reopenLotModalAfterPlacement = false;
  }
  $("#btnCancelPlacement").addEventListener("click", exitPlacementMode);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { exitPlacementMode(); closeModals(); } });

  /* ---------------------------------------------------------------
     11. VISORES OpenSeadragon
  ----------------------------------------------------------------- */
  const OSD = {};
  const VW = {
    x:  { ready: false, built: false, W: PROJECTS.x.imgW,  H: PROJECTS.x.imgH },
    ix: { ready: false, built: false, W: PROJECTS.ix.imgW, H: PROJECTS.ix.imgH },
  };
  let IMG_W = PROJECTS.x.imgW, IMG_H = PROJECTS.x.imgH;

  function viewportEl(pk) { return $("#mapViewport-" + pk); }
  function activeViewportEl() { return viewportEl(activeProject); }

  function whenViewerOpen(v, cb) {
    let done = false;
    const fire = () => { if (done) return; done = true; try { cb(); } catch (e) { console.warn(e); } };
    if (v.isOpen && v.isOpen()) { fire(); return; }
    v.addHandler("open", fire);
    let tries = 0;
    const iv = setInterval(() => { if (v.isOpen && v.isOpen()) { clearInterval(iv); fire(); } else if (++tries > 100) clearInterval(iv); }, 100);
  }

  function buildViewer(pk) {
    if (VW[pk].built) return OSD[pk];
    VW[pk].built = true;
    const v = OpenSeadragon({
      element: viewportEl(pk),
      prefixUrl: "https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/",
      tileSources: PROJECTS[pk].dzi,
      showNavigationControl: false,
      gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
      gestureSettingsTouch: { clickToZoom: false, dblClickToZoom: true },
      maxZoomPixelRatio: 4, visibilityRatio: 1, constrainDuringPan: true, animationTime: 0.4, springStiffness: 8,
    });
    OSD[pk] = v;
    v.addHandler("open-failed", (e) => {
      VW[pk].ready = false;
      toast("⚠️ No se pudo cargar el plano de " + (pk === "ix" ? "Caleta IX" : "Caleta X") + ". Revisa que la carpeta 'assets/" + (pk === "ix" ? "dzi-ix" : "dzi") + "' esté subida.");
    });
    v.addHandler("zoom", () => {
      if (pk !== activeProject) return;
      const pct = Math.round((v.viewport.getZoom() / v.viewport.getHomeZoom()) * 100);
      $("#zoomReadout").textContent = pct + "%";
    });
    v.addHandler("canvas-click", (event) => {
      if (pk !== activeProject || !placementLotId || !event.quick) return;
      const viewportPoint = v.viewport.pointFromPixel(event.position);
      const imagePoint = v.viewport.viewportToImageCoordinates(viewportPoint);
      let xPct = (imagePoint.x / VW[pk].W) * 100;
      let yPct = (imagePoint.y / VW[pk].H) * 100;
      xPct = Math.max(0, Math.min(100, xPct));
      yPct = Math.max(0, Math.min(100, yPct));

      // Evitar poner el marcador ENCIMA del de otro solar ya marcado
      const conflict = nearbyMarkedLot(pk, xPct, yPct, placementLotId);
      if (conflict) {
        toast("Ahí ya está el marcador del Solar #" + conflict.id + ". Coloca el del Solar #" + placementLotId + " en su propio terreno.");
        return; // no coloca; sigue en modo ubicación para intentar de nuevo
      }

      const lot = states[pk][placementLotId];
      const patch = { x: xPct, y: yPct };
      if (lot && lot.status === "disponible") { patch.status = "reservado"; if (!lot.reservedDate) patch.reservedDate = todayISODate(); }
      updateLot(placementLotId, patch);
      toast(`Marcador colocado en el Solar #${placementLotId}`);
      exitPlacementMode();
    });
    whenViewerOpen(v, () => {
      const item = v.world.getItemAt(0);
      if (!item) return;
      const size = item.getContentSize();
      VW[pk].W = size.x; VW[pk].H = size.y; VW[pk].ready = true;
      if (pk === activeProject) { IMG_W = size.x; IMG_H = size.y; }
      repaintMarkers(pk);
    });
    return v;
  }

  viewportEl("x").style.display  = activeProject === "x"  ? "" : "none";
  viewportEl("ix").style.display = activeProject === "ix" ? "" : "none";
  buildViewer(activeProject);
  let viewer = OSD[activeProject];

  function imageToViewportPoint(xPct, yPct) {
    return viewer.viewport.imageToViewportCoordinates(new OpenSeadragon.Point((xPct / 100) * IMG_W, (yPct / 100) * IMG_H));
  }

  $("#btnZoomIn").addEventListener("click", () => { try { viewer.viewport.zoomBy(1.3); } catch (e) {} });
  $("#btnZoomOut").addEventListener("click", () => { try { viewer.viewport.zoomBy(1 / 1.3); } catch (e) {} });
  $("#btnZoomReset").addEventListener("click", () => { try { viewer.viewport.goHome(); } catch (e) {} });

  /* ---------------------------------------------------------------
     11a. PANTALLA COMPLETA DE TODA LA PÁGINA (tipo F11)
     - Pensado para la pantalla touch RICOH de 75". Funciona con toque o mouse.
     - Usa la API de pantalla completa del navegador (con variantes para Safari).
  ----------------------------------------------------------------- */
  function isPageFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }
  function requestPageFullscreen() {
    const el = document.documentElement;
    const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
    if (fn) { try { const r = fn.call(el); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
  }
  function exitPageFullscreen() {
    const fn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (fn) { try { const r = fn.call(document); if (r && r.catch) r.catch(() => {}); } catch (e) {} }
  }
  function syncFullscreenPageButton() {
    const on = isPageFullscreen();
    const exp = $("#iconPageExpand"), col = $("#iconPageCollapse"), lbl = $("#fullscreenPageLabel");
    if (exp) exp.hidden = on;
    if (col) col.hidden = !on;
    if (lbl) lbl.textContent = on ? "Salir" : "Pantalla completa";
  }
  const btnFsPage = $("#btnFullscreenPage");
  if (btnFsPage) {
    btnFsPage.addEventListener("click", () => {
      if (isPageFullscreen()) exitPageFullscreen(); else requestPageFullscreen();
    });
  }
  ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach((ev) => {
    document.addEventListener(ev, syncFullscreenPageButton);
  });
  syncFullscreenPageButton();

  /* ---------------------------------------------------------------
     11b. CAMBIO DE PESTAÑA
  ----------------------------------------------------------------- */
  function switchProject(projKey) {
    if (!PROJECTS[projKey] || projKey === activeProject) return;
    activeProject = projKey;
    viewportEl("x").style.display  = projKey === "x"  ? "" : "none";
    viewportEl("ix").style.display = projKey === "ix" ? "" : "none";
    buildViewer(projKey);
    viewer = OSD[projKey];
    IMG_W = VW[projKey].W; IMG_H = VW[projKey].H;
    exitPlacementMode(); closeModals();
    $("#searchInput").value = "";
    currentFilter = "activos";
    $$(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.filter === "activos"));
    renderProjectChrome(); renderStats(); renderTabsMeta(); renderLotList(); renderAdminTable();
    setTimeout(() => {
      try { viewer.viewport.goHome(true); } catch (e) {}
      try { viewer.forceRedraw && viewer.forceRedraw(); } catch (e) {}
      repaintMarkers(projKey);
    }, 60);
  }
  $$(".project-tab").forEach((tab) => { tab.addEventListener("click", () => switchProject(tab.dataset.project)); });

  /* ---------------------------------------------------------------
     11c. PANTALLA COMPLETA
  ----------------------------------------------------------------- */
  const mapPanel = $("#mapPanel");
  let isMapFullscreen = false;
  function enterFullscreenMap() {
    isMapFullscreen = true;
    mapPanel.classList.add("is-fullscreen");
    document.body.classList.add("map-fullscreen-active");
    $("#iconExpand").hidden = true; $("#iconCollapse").hidden = false;
    $("#btnMapExpand").setAttribute("aria-label", "Salir de pantalla completa");
  }
  function exitFullscreenMap() {
    if (!isMapFullscreen) return;
    isMapFullscreen = false;
    mapPanel.classList.remove("is-fullscreen");
    document.body.classList.remove("map-fullscreen-active");
    $("#iconExpand").hidden = false; $("#iconCollapse").hidden = true;
    $("#btnMapExpand").setAttribute("aria-label", "Ampliar plano a pantalla completa");
  }
  $("#btnMapExpand").addEventListener("click", () => {
    if (isMapFullscreen) exitFullscreenMap(); else enterFullscreenMap();
    setTimeout(() => { try { viewer.viewport.goHome(true); } catch (e) {} try { viewer.forceRedraw && viewer.forceRedraw(); } catch (e) {} }, 60);
  });

  /* ---------------------------------------------------------------
     12. MODAL DE DETALLE
  ----------------------------------------------------------------- */
  let activeLotId = null;

  function modalRate() {
    const inp = $("#lotModalRateInput");
    if (inp) { const raw = inp.value.trim(); if (raw !== "") { const n = Number(raw.replace(/,/g, "")); if (!isNaN(n) && n > 0) return n; } }
    return usdDopRate;
  }

  function modalArea() {
    const inp = $("#lotModalAreaInput");
    if (inp) { const raw = inp.value.trim(); if (raw !== "") { const n = Number(raw.replace(/,/g, "")); if (!isNaN(n) && n > 0) return n; } }
    const lot = activeLotId ? currentState()[activeLotId] : null;
    return lot ? Number(lot.area) : 0;
  }

  function updatePricePreview() {
    const preview = $("#lotModalPricePreview");
    if (!preview) return;
    const lot = activeLotId ? currentState()[activeLotId] : null;
    if (!lot || $("#lotModalAdminControls").hidden) { preview.innerHTML = ""; return; }
    const area = modalArea();
    const caEl = $("#lotModalCalcArea"); if (caEl) caEl.textContent = fmtArea(area);
    const raw = $("#lotModalPriceInput").value.trim();
    const price = raw === "" ? null : Number(raw.replace(/,/g, ""));
    if (price == null || isNaN(price)) { preview.innerHTML = ""; return; }
    const rate = modalRate();
    const dop = area * price;
    const usd = rate > 0 ? dop / rate : null;
    preview.innerHTML =
      `<div class="total-box__label">Total del solar</div>` +
      `<div class="total-box__amounts"><span class="total-box__dop">${fmtMoney(dop, "DOP")}</span>` +
      `<span class="total-box__usd">${fmtMoney(usd, "USD")}</span></div>` +
      `<div class="total-box__rate">Calculado a RD$ ${Number(rate).toFixed(2)} por US$1</div>`;
  }

  function openLotModal(id) {
    activeLotId = String(id);
    const lot = currentState()[activeLotId];
    if (!lot) return;
    $("#lotModalEyebrow").textContent = "SOLAR No. " + lot.id;
    $("#lotModalTitle").textContent = "Solar No. " + lot.id;
    $("#lotModalArea").textContent = fmtArea(lot.area);
    $("#lotModalStatusText").textContent = STATUS_LABEL[lot.status];
    $("#lotModalUpdated").textContent = fmtDate(lot.updatedAt);
    const rowDOP = $("#lotModalPriceRowDOP");
    const rowUSD = $("#lotModalPriceRowUSD");
    if (canSeePrice(lot)) {
      const t = computeTotals(lot);
      $("#lotModalPriceDOP").textContent = t ? fmtMoney(t.dop, "DOP") : "A consultar";
      $("#lotModalPriceUSD").textContent = t ? fmtMoney(t.usd, "USD") : "A consultar";
      rowDOP.hidden = false; rowUSD.hidden = false;
    } else { rowDOP.hidden = true; rowUSD.hidden = true; }
    const reservedRow = $("#lotModalReservedRow");
    if (lot.status !== "disponible" && lot.reservedDate) {
      $("#lotModalReservedLabel").textContent = lot.status === "vendido" ? "Fecha de venta" : "Fecha de reserva";
      $("#lotModalReserved").textContent = fmtDateOnly(lot.reservedDate);
      reservedRow.hidden = false;
    } else { reservedRow.hidden = true; }
    const adminBox = $("#lotModalAdminControls");
    adminBox.hidden = !isAdmin;
    if (isAdmin) {
      $("#lotModalStatusSelect").value = lot.status;
      $("#lotModalAreaInput").value = lot.area != null ? lot.area : "";
      $("#lotModalNote").value = lot.note || "";
      $("#lotModalCalcArea").textContent = fmtArea(lot.area);
      $("#lotModalPriceInput").value = lot.price != null ? lot.price : "";
      $("#lotModalRateInput").value = Number(usdDopRate).toFixed(2);
      $("#lotModalDateInput").value = lot.reservedDate || "";
      const hasPin = lot.x != null && lot.y != null;
      $("#btnPlaceMarker").textContent = hasPin ? "Reubicar marcador en el plano" : "Ubicar en el plano";
      $("#btnRemoveMarker").hidden = !hasPin;
      updatePricePreview();
    }
    $("#lotBackdrop").hidden = false;
  }

  function closeModals() {
    $("#lotBackdrop").hidden = true;
    $("#loginBackdrop").hidden = true;
    $("#loginError").hidden = true;
    $("#loginPassword").value = "";
    const lu = $("#loginUser"); if (lu) lu.value = "";
  }

  $("#btnCloseLotModal").addEventListener("click", closeModals);
  $("#lotBackdrop").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeModals(); });
  $("#lotModalPriceInput").addEventListener("input", updatePricePreview);
  $("#lotModalAreaInput").addEventListener("input", updatePricePreview);
  $("#lotModalRateInput").addEventListener("input", updatePricePreview);
  $("#lotModalRateInput").addEventListener("change", () => {
    const raw = $("#lotModalRateInput").value.trim();
    const n = raw === "" ? NaN : Number(raw.replace(/,/g, ""));
    if (isNaN(n) || n <= 0) return;
    saveManualRate(n);
  });

  function collectLotModalPatch() {
    let status = $("#lotModalStatusSelect").value;
    if (!ALLOWED_STATUS[status]) status = "disponible";
    const rawArea = $("#lotModalAreaInput").value.trim();
    let area = rawArea === "" ? null : clampNumber(rawArea.replace(/,/g, ""), 0.01, 1e6);
    const rawPrice = $("#lotModalPriceInput").value.trim();
    let price = rawPrice === "" ? null : clampNumber(rawPrice.replace(/,/g, ""), 0, 1e12);
    let note = String($("#lotModalNote").value || "").slice(0, CONFIG.NOTE_MAX);
    let reservedDate = $("#lotModalDateInput").value || null;
    if (reservedDate && !/^\d{4}-\d{2}-\d{2}$/.test(reservedDate)) reservedDate = null;
    if (status !== "disponible" && !reservedDate) reservedDate = todayISODate();
    const patch = { status, note, price, currency: "DOP", reservedDate };
    if (area != null) patch.area = area; // metros editados por el admin
    return patch;
  }

  $("#btnSaveLot").addEventListener("click", () => {
    if (!activeLotId) return;
    const rRaw = $("#lotModalRateInput").value.trim();
    const rn = rRaw === "" ? NaN : Number(rRaw.replace(/,/g, ""));
    if (!isNaN(rn) && rn > 0 && rn !== usdDopRate) saveManualRate(rn);
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
    if (isAdmin) { $("#adminPanel").hidden = false; $("#adminOverlay").hidden = false; renderAdminTable(); updateRateDisplay(); }
    else { $("#loginBackdrop").hidden = false; setTimeout(() => $("#loginPassword").focus(), 50); }
  });

  $("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = ($("#loginUser").value || "").trim().toLowerCase();
    const pass = $("#loginPassword").value || "";
    const ok = (user === CONFIG.ADMIN_USER.toLowerCase() && pass === CONFIG.ADMIN_PASSWORD);
    if (ok) {
      setAdmin(true); closeModals();
      toast("Sesión de administrador iniciada");
      $("#adminPanel").hidden = false; $("#adminOverlay").hidden = false;
      renderAdminTable(); updateRateDisplay();
    } else { $("#loginError").hidden = false; }
  });
  $("#btnCancelLogin").addEventListener("click", closeModals);

  $("#btnCloseAdmin").addEventListener("click", () => { $("#adminPanel").hidden = true; $("#adminOverlay").hidden = true; });
  $("#adminOverlay").addEventListener("click", () => { $("#adminPanel").hidden = true; $("#adminOverlay").hidden = true; });
  $("#btnLogoutAdmin").addEventListener("click", () => { setAdmin(false); toast("Sesión cerrada"); });

  $("#adminSearch").addEventListener("input", renderAdminTable);
  $("#adminStatusFilter").addEventListener("change", renderAdminTable);

  // ----- Tasa del dólar en el panel admin -----
  function saveRateFromInput() {
    const raw = ($("#rateInput").value || "").trim();
    const n = raw === "" ? NaN : Number(raw.replace(/,/g, ""));
    if (isNaN(n) || n <= 0) { toast("Escribe una tasa válida (ej. 60.80)"); return; }
    saveManualRate(n);
    toast("Tasa fija aplicada: RD$ " + n.toFixed(2) + " por US$1");
  }
  const btnSaveRate = $("#btnSaveRate");
  if (btnSaveRate) btnSaveRate.addEventListener("click", saveRateFromInput);
  const rateInputEl = $("#rateInput");
  if (rateInputEl) rateInputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") saveRateFromInput(); });

  $("#btnExportData").addEventListener("click", () => {
    const payload = { project: activeProject, projectName: P().title.replace(/\u00A0/g, " "), lots: currentState() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `jardines-caleta-${activeProject}-solares.json`;
    a.click(); URL.revokeObjectURL(url);
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
  if (window.innerWidth <= 720) { sidebarEl.classList.add("is-collapsed"); $("#btnSidebarToggle").setAttribute("aria-expanded", "false"); }

  /* ---------------------------------------------------------------
     15. BUSCADOR
  ----------------------------------------------------------------- */
  function locateLot(id) {
    if (!currentState()[id]) { toast("No existe el solar #" + id); return false; }
    const lot = currentState()[id];
    if (lot.x != null && lot.y != null && VW[activeProject] && VW[activeProject].ready) {
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
    if (sidebarEl.classList.contains("is-collapsed")) { sidebarEl.classList.remove("is-collapsed"); $("#btnSidebarToggle").setAttribute("aria-expanded", "true"); }
    const row = document.querySelector(`.lot-row[data-lot-id="${id}"]`);
    if (row) { row.scrollIntoView({ behavior: "smooth", block: "center" }); row.classList.remove("flash"); requestAnimationFrame(() => row.classList.add("flash")); }
    return true;
  }
  function performSearch() { const id = $("#searchInput").value.trim(); if (!id) return; locateLot(id); }
  $("#searchInput").addEventListener("keydown", (e) => { if (e.key !== "Enter") return; performSearch(); });
  $("#btnSearchGo").addEventListener("click", performSearch);

  /* ---------------------------------------------------------------
     15b. BOTÓN MARCAR
  ----------------------------------------------------------------- */
  $("#btnAdminMark").addEventListener("click", () => {
    const id = $("#searchInput").value.trim();
    if (!id) { toast("Escribe el número del solar"); $("#searchInput").focus(); return; }
    if (!currentState()[id]) { toast("No existe el solar #" + id); return; }
    exitFullscreenMap(); locateLot(id); openLotModal(id);
  });

  /* ---------------------------------------------------------------
     17. INICIALIZACIÓN
  ----------------------------------------------------------------- */
  async function initializeApp() {
    await loadManualRate();
    subscribeRateRealtime();
    recomputeRate();
    if (sb) { await loadStateFromSupabase(); subscribeRealtime(); }
    viewportEl("x").style.aspectRatio  = PROJECTS.x.imgW + " / " + PROJECTS.x.imgH;
    viewportEl("ix").style.aspectRatio = PROJECTS.ix.imgW + " / " + PROJECTS.ix.imgH;
    await checkAdminSession();
    setAdmin(isAdmin);
    renderAll();
    repaintMarkers("x");
    repaintMarkers("ix");
    console.log("✅ === APP LISTA ===");
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initializeApp); }
  else { initializeApp(); }
})();