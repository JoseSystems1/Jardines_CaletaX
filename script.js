(function () {
  "use strict";

  console.log("=== SCRIPT INICIANDO ===");

  /* ---------------------------------------------------------------
     0. CONFIGURACIÓN
  ----------------------------------------------------------------- */
  const CONFIG = {
    ADMIN_USER: "adonel",
    ADMIN_PASSWORD: "jardines10y9",
    STORAGE_KEY_PREFIX: "jcx_lots_state_v2_",
    SESSION_KEY: "jcx_admin_session_v1",
    NOTE_MAX: 500,
    // El admin entra con USUARIO + contraseña. Por dentro el usuario se convierte
    // en un correo (usuario@ADMIN_EMAIL_DOMAIN) para la autenticación de Supabase.
    ADMIN_EMAIL_DOMAIN: "jardines-caleta.com",
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

  const LOTS_BASE_IX2 = [
    [216,402.45],[217,230],[218,230],[219,230],[220,230],[221,230],[222,230],
    [223,230],[224,230],[225,230],[226,230],[227,230],[228,230],[229,230],
    [230,230],[231,230],[232,400],[233,400.1],[234,230],[235,230],[236,230],
    [237,230],[238,230],[239,230],[240,230],[241,230],[242,230],[243,230],
    [244,230],[245,230],[246,230],[247,230],[248,230],[249,402.45],[250,405],
    [251,205],[252,205],[253,205],[254,205],[255,205],[256,205],[257,205],
    [258,205],[259,205],[260,205],[261,205],[262,205],[263,205],[264,205],
    [265,205],[266,205],[267,205],[268,409.9],[269,400],[270,200],[271,200],
    [272,200],[273,200],[274,200],[275,200],[276,200],[277,200],[278,200],
    [279,200],[280,200],[281,200],[282,200],[283,200],[284,200],[285,200],
    [286,200],[287,405],
  ];

  const LOTS_BASE_XI = [
    [1,489.77],[2,439.88],[3,444.26],[4,448.55],[5,452.83],[6,457.12],[7,461.38],
    [8,465.65],[9,469.92],[10,474.19],[11,478.45],[12,438.56],[13,489.36],[14,493.6],
    [15,497.83],[16,502.07],[17,506.31],[18,510.55],[19,514.79],[20,518.57],[21,520.14],
    [22,521.41],[23,522.68],[24,533.65],[25,432.43],[26,300],[27,300],[28,300],
    [29,300],[30,300],[31,300],[32,300],[33,300],[34,300],[35,300],
    [36,400],[37,247.08],[38,300],[39,300],[40,300],[41,300],[42,300],
    [43,300],[44,300],[45,300],[46,300],[47,300],[48,300],[49,300],
    [50,300],[51,300],[52,300],[53,300],[54,300],[55,300],[56,300],
    [57,300],[58,300],[59,300],[60,300],[61,300],[62,244.83],[63,400],
    [64,300],[65,300],[66,300],[67,300],[68,300],[69,300],[70,300],
    [71,300],[72,300],[73,300],[74,424.68],[75,413.69],[76,300],[77,300],
    [78,300],[79,300],[80,300],[81,300],[82,300],[83,300],[84,300],
    [85,300],[86,400],[87,321.61],[88,260],[89,260],[90,260],[91,260],
    [92,260],[93,260],[94,260],[95,260],[96,260],[97,260],[98,260],
    [99,260],[100,400],[101,400],[102,260],[103,260],[104,260],[105,260],
    [106,260],[107,260],[108,260],[109,260],[110,260],[111,260],[112,260],
    [113,260],[114,319.39],[115,400],[116,300],[117,300],[118,300],[119,300],
    [120,300],[121,300],[122,300],[123,300],[124,300],[125,300],[126,407.93],
    [127,251.36],[128,250],[129,250],[130,250],[131,250],[132,250],[133,250],
    [134,250],[135,250],[136,250],[137,250],[138,250],[139,250],[140,250],
    [141,300],[142,250],[143,250],[144,250],[145,250],[146,250],[147,250],
    [148,250],[149,250],[150,250],[151,250],[152,250],[153,250],[154,250],
    [155,250],[156,336.14],[157,333.89],[158,250],[159,250],[160,250],[161,250],
    [162,250],[163,250],[164,250],[165,250],[166,250],[167,250],[168,250],
    [169,250],[170,250],[171,250],[172,300],[173,250],[174,250],[175,250],
    [176,250],[177,250],[178,250],[179,250],[180,250],[181,250],[182,250],
    [183,250],[184,250],[185,250],[186,246.73],[187,390.16],[188,250],[189,250],
    [190,250],[191,250],[192,250],[193,250],[194,250],[195,250],[196,250],
    [197,250],[198,250],[199,250],[200,400],[201,250],[202,250],[203,250],
    [204,250],[205,250],[206,250],[207,250],[208,250],[209,250],[210,250],
    [211,250],[212,250],[213,250],[214,250],[215,330.7],[216,328.45],[217,250],
    [218,250],[219,250],[220,250],[221,250],[222,250],[223,250],[224,250],
    [225,250],[226,250],[227,250],[228,250],[229,250],[230,250],[231,400],
    [232,250],[233,250],[234,250],[235,250],[236,250],[237,250],[238,250],
    [239,250],[240,250],[241,250],[242,250],[243,250],[244,385.53],[245,258.96],
    [246,240],[247,240],[248,240],[249,240],[250,240],[251,240],[252,240],
    [253,240],[254,240],[255,240],[256,240],[257,240],[258,240],[259,400],
    [260,304.64],[261,240],[262,240],[263,240],[264,240],[265,240],[266,239.97],
    [267,239.97],[268,240],[269,240],[270,240],[271,240],[272,240],[273,240],
    [274,400],[275,400],[276,240],[277,240],[278,240],[279,240],[280,240],
    [281,240],[282,240],[283,240],[284,240],[285,240],[286,240],[287,240],
    [288,240],[289,301.11],[290,400],[291,240],[292,240],[293,240],[294,240],
    [295,240],[296,240],[297,240],[298,240],[299,240],[300,240],[301,240],
    [302,240],[303,240],[304,254.33],[305,242.73],[306,230],[307,230],[308,230],
    [309,230],[310,230],[311,230],[312,230],[313,230],[314,230],[315,230],
    [316,230],[317,230],[318,230],[319,230],[320,300],[321,293.12],[322,230],
    [323,230],[324,230],[325,230],[326,230],[327,230],[328,230],[329,230],
    [330,230],[331,230],[332,230],[333,230],[334,230],[335,230],[336,300],
    [337,300],[338,230],[339,230],[340,230],[341,230],[342,230],[343,230],
    [344,230],[345,230],[346,230],[347,230],[348,230],[349,230],[350,230],
    [351,230],[352,286.33],[353,300],[354,230],[355,230],[356,230],[357,230],
    [358,230],[359,230],[360,230],[361,230],[362,230],[363,230],[364,230],
    [365,230],[366,230],[367,230],[368,232.58],[369,238.17],[370,200],[371,200],
    [372,200],[373,200],[374,200],[375,200],[376,200],[377,200],[378,200],
    [379,200],[380,200],[381,200],[382,200],[383,200],[384,200],[385,200],
    [386,300],[387,296.53],[388,200],[389,200],[390,200],[391,200],[392,200],
    [393,200],[394,200],[395,200],[396,200],[397,200],[398,200],[399,200],
    [400,200],[401,200],[402,200],[403,200],[404,300],[405,300],[406,200],
    [407,200],[408,200],[409,200],[410,200],[411,200],[412,200],[413,200],
    [414,200],[415,200],[416,200],[417,200],[418,200],[419,200],[420,200],
    [421,200],[422,290.03],[423,300],[424,200],[425,200],[426,200],[427,200],
    [428,200],[429,200],[430,200],[431,200],[432,200],[433,200],[434,200],
    [435,200],[436,200],[437,200],[438,200],[439,200],[440,228.02],[441,398.24],
    [442,383.61],[443,383.07],[444,382.53],[445,381.99],[446,381.45],[447,380.91],[448,380.38],
    [449,379.84],[450,379.3],[451,378.76],[452,378.22],[453,377.69],[454,561.91],[455,376.35],
    [456,375.81],[457,375.27],[458,374.73],[459,374.19],[460,558.1],[461,514.95],[462,371.64],
    [463,371.1],[464,370.57],[465,370.03],[466,369.49],[467,368.96],
  ];

  const PROJECTS = {
    x: { key: "x", title: "Urbanización Jardines de Caleta\u00A0X",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi/plano.dzi", imgW: 10960, imgH: 6476, lots: LOTS_BASE_X },
    ix: { key: "ix", title: "Urbanización Jardines de Caleta\u00A0IX",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi-ix/plano.dzi", imgW: 10300, imgH: 9900, lots: LOTS_BASE_IX },
    ix2: { key: "ix2", title: "Urbanización Jardines de Caleta\u00A0IX — Etapa 2",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi-ix2/plano.dzi", imgW: 7425, imgH: 6861, lots: LOTS_BASE_IX2 },
    xi: { key: "xi", title: "Urbanización Jardines de Caleta\u00A0XI",
      subtitle: "La Romana, República Dominicana — Plano general de distribución de solares",
      dzi: "assets/dzi-xi/plano.dzi", imgW: 13332, imgH: 15098, lots: LOTS_BASE_XI },
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
        price: null, currency: "DOP", reservedDate: null, rate: null,
        planoUrl: null, tituloUrl: null, updatedAt: null,
        reservedAt: null };
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

  const states = { x: defaultState("x"), ix: defaultState("ix"), ix2: defaultState("ix2"), xi: defaultState("xi") };
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
      Object.keys(PROJECTS).forEach((pk) => {
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
      planoUrl: row.plano_url || null,
      tituloUrl: row.titulo_url || null,
      rate: row.rate == null || row.rate === "" ? null : Number(row.rate),
      reservedAt: row.reserved_at || null,
      updatedAt: row.updated_at,
    };
  }

  async function loadStateFromSupabase() {
    if (!sb) { console.warn("⚠️ Supabase no disponible"); return; }
    try {
      const { data, error } = await sb.from("lots").select("*").order("project").order("id");
      if (error || !data || data.length === 0) { console.warn("❌ Error al cargar Supabase:", error); return; }
      const fresh = {};
      Object.keys(PROJECTS).forEach((pk) => { fresh[pk] = defaultState(pk); });
      data.forEach((row) => { const pk = row.project; if (fresh[pk] && fresh[pk][row.id]) fresh[pk][row.id] = rowToLot(row); });
      Object.keys(fresh).forEach((pk) => { states[pk] = fresh[pk]; });
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
  const brandLogo = document.getElementById("brandLogo");
  if (brandLogo) brandLogo.addEventListener("error", () => { brandLogo.style.display = "none"; });

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
    if (sb) {
      try { const { data } = await sb.auth.getSession(); isAdmin = !!(data && data.session); }
      catch (e) { isAdmin = false; }
    } else {
      try { isAdmin = sessionStorage.getItem(CONFIG.SESSION_KEY) === "1"; } catch (e) { isAdmin = false; }
    }
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
    const m2 = $("#tabMetaIx2"); if (m2) m2.textContent = tabMeta("ix2");
    const mxi = $("#tabMetaXi"); if (mxi) mxi.textContent = tabMeta("xi");
  }

  /* ---------------------------------------------------------------
     6. MARCADORES
  ----------------------------------------------------------------- */
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
        const digits = String(lot.id).length;
        const fontSize = digits >= 3 ? 15 : (digits === 2 ? 19 : 23);
        el.innerHTML =
          '<svg viewBox="0 0 44 44" preserveAspectRatio="xMidYMid meet">' +
          '<circle class="marker__bg" cx="22" cy="22" r="19"></circle>' +
          '<text class="marker__txt" x="22" y="22" text-anchor="middle" dominant-baseline="central" font-size="' + fontSize + '">' +
          escapeHtml(lot.id) + '</text></svg>';
        let tip = "Solar #" + lot.id + " — " + STATUS_LABEL[lot.status];
        if (lot.reservedDate) tip += " · " + fmtDateOnly(lot.reservedDate);
        if (isAdmin) { const pTxt = fmtPriceBoth(lot); if (pTxt) tip += " · " + pTxt; }
        el.title = tip;
        const lotId = lot.id;
        const openThis = (ev) => { if (ev) { ev.stopPropagation && ev.stopPropagation(); ev.preventDefault && ev.preventDefault(); } openLotModal(lotId); };
        el.addEventListener("click", openThis);
        el.addEventListener("touchend", openThis, { passive: false });
        // Tamaño del marcador RELATIVO al plano (escala con el zoom).
        const sizeImg = 0.016 * info.W;           // diámetro del marcador en px de imagen
        const imgX = (lot.x / 100) * info.W;
        const imgY = (lot.y / 100) * info.H;
        const rect = v.viewport.imageToViewportRectangle(
          new OpenSeadragon.Rect(imgX - sizeImg / 2, imgY - sizeImg / 2, sizeImg, sizeImg)
        );
        v.addOverlay({ element: el, location: rect });
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
    else if (currentFilter === "disponibles") lots = lots.filter((l) => l.status === "disponible");
    if (lots.length === 0) {
      empty.textContent = currentFilter === "disponibles"
        ? "No hay solares disponibles en este momento."
        : (currentFilter === "activos" ? "Aún no hay solares reservados ni vendidos." : "No hay solares para mostrar.");
      empty.hidden = false; return;
    }
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
        <div class="lot-row__badge is-${lot.status}">#${escapeHtml(lot.id)}</div>
        <div class="lot-row__info">
          <div class="lot-row__title">Solar No. ${escapeHtml(lot.id)} <span class="lot-row__meta">· ${fmtArea(lot.area)}</span></div>
          <div class="lot-row__status is-${lot.status}">${STATUS_LABEL[lot.status]}</div>
          ${dateTxt ? `<div class="lot-row__date">${escapeHtml(dateTxt)}</div>` : ""}
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

    // Se guarda el momento exacto en que el solar pasó a "reservado" (para
    // poder contar los días de reserva configurados por el admin), y se
    // limpia si deja de estar reservado.
    if (patch.status !== undefined) {
      if (newStatus === "reservado" && lot.status !== "reservado") {
        patch.reservedAt = new Date().toISOString();
      } else if (newStatus !== "reservado") {
        patch.reservedAt = null;
      }
    }

    const updatedAt = new Date().toISOString();
    Object.assign(lot, patch, { updatedAt });
    renderAll();
    if (sb) {
      const row = { status: lot.status, area: lot.area, x: lot.x, y: lot.y, note: lot.note,
        price: lot.price, currency: lot.currency, reserved_date: lot.reservedDate,
        plano_url: lot.planoUrl || null, titulo_url: lot.tituloUrl || null,
        rate: lot.rate, reserved_at: lot.reservedAt,
        updated_at: updatedAt };
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
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#publicNoticesBackdrop").hidden) { closePublicNotices(); return; }
    if (!$("#notesBackdrop").hidden) { closeNotesApp(); return; }
    if (!$("#docViewer").hidden) { closeDocViewer(); return; }
    if (!$("#docEditBackdrop").hidden) { closeDocEditor(); return; }
    exitPlacementMode(); closeModals();
  });

  /* ---------------------------------------------------------------
     11. VISORES OpenSeadragon
  ----------------------------------------------------------------- */
  const OSD = {};
  const VW = {
    x:  { ready: false, built: false, W: PROJECTS.x.imgW,  H: PROJECTS.x.imgH },
    ix: { ready: false, built: false, W: PROJECTS.ix.imgW, H: PROJECTS.ix.imgH },
    ix2:{ ready: false, built: false, W: PROJECTS.ix2.imgW, H: PROJECTS.ix2.imgH },
    xi: { ready: false, built: false, W: PROJECTS.xi.imgW, H: PROJECTS.xi.imgH },
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
      const nombre = pk === "ix" ? "Caleta IX" : (pk === "ix2" ? "Caleta IX Etapa 2" : (pk === "xi" ? "Caleta XI" : "Caleta X"));
      const carpeta = pk === "ix" ? "dzi-ix" : (pk === "ix2" ? "dzi-ix2" : (pk === "xi" ? "dzi-xi" : "dzi"));
      toast("⚠️ No se pudo cargar el plano de " + nombre + ". Revisa que la carpeta 'assets/" + carpeta + "' esté subida.");
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

  Object.keys(PROJECTS).forEach((pk) => { const el = viewportEl(pk); if (el) el.style.display = activeProject === pk ? "" : "none"; });
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
    Object.keys(PROJECTS).forEach((pk) => { const el = viewportEl(pk); if (el) el.style.display = projKey === pk ? "" : "none"; });
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

    // Documentos: SOLO en Caleta IX (jardines 9) — prueba temporal.
    const docsEnabled = (activeProject === "ix");
    if (docsEnabled) {
      const planoUrl = safeDocUrl(lot.planoUrl);
      const tituloUrl = safeDocUrl(lot.tituloUrl);
      setupDocButton($("#btnDocPlano"), planoUrl);
      setupDocButton($("#btnDocTitulo"), tituloUrl);
    }
    $("#lotModalDocs").hidden = !docsEnabled;
    // Botón "Documentación" (solo admin, y solo en Caleta IX)
    $("#btnDocEdit").hidden = !(isAdmin && docsEnabled);

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
      const expHint = $("#reservationExpiryHint");
      if (expHint) {
        if (lot.status === "reservado" && lot.reservedAt) {
          const expiry = new Date(new Date(lot.reservedAt).getTime() + RESERVATION_DAYS * 24 * 3600 * 1000);
          expHint.textContent = "Se liberará automáticamente el " +
            expiry.toLocaleString("es-DO", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) +
            " si nadie lo confirma como vendido (72 horas de reserva).";
          expHint.hidden = false;
        } else {
          expHint.hidden = true;
        }
      }
      updatePricePreview();
    }
    $("#lotBackdrop").hidden = false;
  }

  /* ===== Documentos del solar (plano catastral y título) ===== */
  // Solo enlaces http(s) válidos
  function safeDocUrl(u) {
    if (!u) return null;
    const s = String(u).trim();
    return /^https?:\/\//i.test(s) ? s : null;
  }
  // Deja el botón activo (con enlace) o en estado "no disponible"
  function setupDocButton(btn, url) {
    if (!btn) return;
    if (url) { btn.dataset.url = url; btn.classList.remove("is-unavailable"); }
    else { delete btn.dataset.url; btn.classList.add("is-unavailable"); }
  }
  // ----- Zoom y arrastre del documento (mouse, rueda y táctil) -----
  let dz = { scale: 1, x: 0, y: 0 };
  let dzImg = null;

  function dzApply() {
    if (!dzImg) return;
    dzImg.style.transform = "translate(" + dz.x + "px," + dz.y + "px) scale(" + dz.scale + ")";
    dzImg.classList.toggle("is-zoomed", dz.scale > 1.01);
  }
  function dzReset() { dz = { scale: 1, x: 0, y: 0 }; dzApply(); }
  const dzClamp = (s) => Math.min(6, Math.max(1, s));
  function dzZoomTo(newScale) {
    const s = dzClamp(newScale);
    if (s === 1) { dz = { scale: 1, x: 0, y: 0 }; } else { dz.scale = s; }
    dzApply();
  }

  function attachDocZoom(img) {
    dzImg = img; dzReset();
    const body = $("#docViewerBody");

    // Rueda del mouse: zoom hacia el puntero
    body.addEventListener("wheel", (e) => {
      if (!dzImg) return;
      e.preventDefault();
      const prev = dz.scale;
      const next = dzClamp(prev * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
      if (next === prev) return;
      const r = dzImg.getBoundingClientRect();
      const cx = e.clientX - (r.left + r.width / 2);
      const cy = e.clientY - (r.top + r.height / 2);
      const k = next / prev;
      dz.x = dz.x - cx * (k - 1);
      dz.y = dz.y - cy * (k - 1);
      dz.scale = next;
      if (next === 1) { dz.x = 0; dz.y = 0; }
      dzApply();
    }, { passive: false });

    // Doble clic / doble toque: acercar o restablecer
    img.addEventListener("dblclick", (e) => { e.preventDefault(); dzZoomTo(dz.scale > 1.01 ? 1 : 2.5); });

    // Arrastrar con mouse o dedo (cuando hay zoom), y pellizco con dos dedos
    const pts = new Map();
    let startDist = 0, startScale = 1, last = null;
    img.addEventListener("pointerdown", (e) => {
      img.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        startDist = Math.hypot(a.x - b.x, a.y - b.y);
        startScale = dz.scale;
      } else { last = { x: e.clientX, y: e.clientY }; }
    });
    img.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {          // pellizco
        e.preventDefault();
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (startDist > 0) dzZoomTo(startScale * (d / startDist));
      } else if (last && dz.scale > 1.01) {  // arrastrar
        e.preventDefault();
        dz.x += e.clientX - last.x;
        dz.y += e.clientY - last.y;
        last = { x: e.clientX, y: e.clientY };
        dzApply();
      }
    });
    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) startDist = 0; if (pts.size === 0) last = null; };
    img.addEventListener("pointerup", up);
    img.addEventListener("pointercancel", up);
  }

  // Visor DENTRO de la página (sin abrir otra pestaña)
  let currentDoc = { url: null, title: "" };
  function openDocViewer(url, title) {
    const safe = safeDocUrl(url);
    if (!safe) return;
    const body = $("#docViewerBody");
    if (!body) return;
    currentDoc = { url: safe, title: title || "Documento" };
    $("#docViewerTitle").textContent = title || "Documento";
    const isPdf = /\.pdf(\?|#|$)/i.test(safe);
    $("#docViewer").hidden = false;
    body.innerHTML = '<div class="doc-viewer__loading">Cargando…</div>';
    if (isPdf) {
      $("#docViewerZoom").hidden = true;
      const ifr = document.createElement("iframe");
      ifr.src = safe; ifr.title = title || "Documento";
      ifr.addEventListener("load", () => { body.innerHTML = ""; body.appendChild(ifr); });
      setTimeout(() => { if (!body.contains(ifr)) { body.innerHTML = ""; body.appendChild(ifr); } }, 1200);
    } else {
      $("#docViewerZoom").hidden = false;
      const img = new Image();
      img.alt = title || "Documento";
      img.addEventListener("load", () => { body.innerHTML = ""; body.appendChild(img); attachDocZoom(img); });
      img.addEventListener("error", () => { body.innerHTML = '<p class="doc-viewer__loading">No se pudo cargar el documento.</p>'; });
      img.src = safe;
    }
  }
  // Imprime el documento que ya se ve en pantalla, sin volver a pedirlo a R2.
  function printCurrentDoc() {
    if (!currentDoc.url) return;
    document.body.classList.add("printing-doc");
    setTimeout(() => { try { window.print(); } catch (e) { toast("No se pudo imprimir"); } }, 60);
  }
  window.addEventListener("afterprint", () => document.body.classList.remove("printing-doc"));
  function closeDocViewer() {
    const v = $("#docViewer"); if (!v) return;
    v.hidden = true; $("#docViewerBody").innerHTML = "";
    dzImg = null; dz = { scale: 1, x: 0, y: 0 };
  }
  // Clic en los botones públicos: si hay enlace abre el visor; si no, avisa
  function bindDocButton(sel, label) {
    const btn = $(sel);
    if (btn) btn.addEventListener("click", () => {
      const url = btn.dataset.url;
      if (url) openDocViewer(url, label);
      else toast("Aún están en elaboración, por el momento no están disponibles");
    });
  }
  bindDocButton("#btnDocPlano", "Plano catastral");
  bindDocButton("#btnDocTitulo", "Título del terreno");
  (function wireDocViewerClose() {
    const c = $("#docViewerClose"); if (c) c.addEventListener("click", closeDocViewer);
    const pr = $("#docViewerPrint"); if (pr) pr.addEventListener("click", printCurrentDoc);
    const zi = $("#docZoomIn"); if (zi) zi.addEventListener("click", () => dzZoomTo(dz.scale * 1.3));
    const zo = $("#docZoomOut"); if (zo) zo.addEventListener("click", () => dzZoomTo(dz.scale / 1.3));
    const zr = $("#docZoomReset"); if (zr) zr.addEventListener("click", () => dzZoomTo(1));
    const b = $("#docViewerBody"); if (b) b.addEventListener("click", (e) => { if (e.target === b) closeDocViewer(); });
  })();

  /* ===== Editor de Documentación (solo admin) ===== */
  function openDocEditor() {
    if (!activeLotId) return;
    const lot = currentState()[activeLotId];
    if (!lot) return;
    $("#docEditLotLabel").textContent = "Solar No. " + activeLotId;
    $("#docEditPlano").value = lot.planoUrl || "";
    $("#docEditTitulo").value = lot.tituloUrl || "";
    $("#docEditBackdrop").hidden = false;
  }
  function closeDocEditor() { $("#docEditBackdrop").hidden = true; }
  (function wireDocEditor() {
    const btn = $("#btnDocEdit"); if (btn) btn.addEventListener("click", openDocEditor);
    const cancel = $("#btnDocEditCancel"); if (cancel) cancel.addEventListener("click", closeDocEditor);
    const close = $("#btnDocEditClose"); if (close) close.addEventListener("click", closeDocEditor);
    $("#docEditBackdrop").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeDocEditor(); });
    const save = $("#btnDocEditSave");
    if (save) save.addEventListener("click", () => {
      if (!activeLotId) return;
      const rawPlano = ($("#docEditPlano").value || "").trim();
      const rawTitulo = ($("#docEditTitulo").value || "").trim();
      const planoUrl = rawPlano === "" ? null : safeDocUrl(rawPlano);
      const tituloUrl = rawTitulo === "" ? null : safeDocUrl(rawTitulo);
      if (rawPlano !== "" && !planoUrl) { toast("El enlace del plano debe empezar con https://"); return; }
      if (rawTitulo !== "" && !tituloUrl) { toast("El enlace del título debe empezar con https://"); return; }
      updateLot(activeLotId, { planoUrl, tituloUrl });
      toast("Documentación del Solar #" + activeLotId + " guardada");
      closeDocEditor();
      openLotModal(activeLotId); // refresca los botones del solar
    });
  })();




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
  // La tasa del dólar SOLO se cambia (y se fija para todos) desde el recuadro
  // "TASA DEL DÓLAR" del panel de admin. Aquí en el cuadro del solar es solo
  // informativa (no modifica la tasa global).

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
    updateLot(activeLotId, collectLotModalPatch());
    toast(`Solar #${activeLotId} actualizado`);
    closeModals();
  });

  // Imprimir la ficha del solar (solo admin). Usa un iframe oculto: es más
  // confiable que abrir ventana nueva (no sale en blanco ni lo bloquea el navegador).
  function printLotInfo() {
    const lot = activeLotId ? currentState()[activeLotId] : null;
    if (!lot) return;
    const t = computeTotals(lot);
    const proyecto = P().title.replace(/\u00A0/g, " ");
    const rate = (t && t.rate) ? t.rate : usdDopRate;
    const rows = [
      ["Proyecto", proyecto],
      ["Solar No.", lot.id],
      ["Área", fmtArea(lot.area)],
      ["Estado", STATUS_LABEL[lot.status]],
      ["Precio (RD$)", t ? fmtMoney(t.dop, "DOP") : "A consultar"],
      ["Precio (US$)", t ? fmtMoney(t.usd, "USD") : "A consultar"],
      ["Tasa aplicada", "RD$ " + Number(rate).toFixed(2) + " por US$1"],
      [(lot.status === "vendido" ? "Fecha de venta" : "Fecha de reserva"), lot.reservedDate ? fmtDateOnly(lot.reservedDate) : "—"],
      ["Actualizado", fmtDate(lot.updatedAt)],
    ];
    const rowsHtml = rows.map(([k, v]) =>
      `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(String(v))}</td></tr>`).join("");
    const notaHtml =
      '<div class="nota"><div class="nota__label">Nota interna</div>' +
      '<div class="nota__box">' + (lot.note ? escapeHtml(lot.note).replace(/\n/g, "<br>") : "—") + '</div></div>';
    const html =
      '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Solar No. ' + escapeHtml(String(lot.id)) + '</title><style>' +
      '*{box-sizing:border-box;} body{font-family:Arial,Helvetica,sans-serif;color:#0B2540;padding:24px;margin:0;}' +
      'h1{font-size:20px;margin:0;} .sub{color:#666;font-size:12px;margin:2px 0 18px;}' +
      'table{border-collapse:collapse;width:100%;max-width:560px;}' +
      'th,td{text-align:left;padding:9px 12px;border-bottom:1px solid #ddd;font-size:14px;}' +
      'th{width:190px;color:#555;font-weight:600;} td{font-weight:700;}' +
      '.nota{max-width:560px;margin:18px 0 0;} .nota__label{font-size:12px;color:#555;font-weight:600;margin-bottom:6px;}' +
      '.nota__box{border:1px solid #ddd;border-radius:8px;padding:12px 14px;font-size:14px;min-height:70px;' +
      'white-space:pre-wrap;word-wrap:break-word;overflow-wrap:anywhere;line-height:1.5;}' +
      '.foot{margin-top:18px;font-size:11px;color:#999;}' +
      '</style></head><body>' +
      '<h1>ADONEL SERVICES, SRL</h1>' +
      '<p class="sub">' + escapeHtml(proyecto) + ' — Ficha del solar</p>' +
      '<table>' + rowsHtml + '</table>' +
      notaHtml +
      '<p class="foot">Impreso el ' + escapeHtml(fmtDate(new Date().toISOString())) + '</p>' +
      '</body></html>';

    // iframe oculto
    const old = document.getElementById("printFrame");
    if (old) old.remove();
    const iframe = document.createElement("iframe");
    iframe.id = "printFrame";
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
    document.body.appendChild(iframe);

    const doPrint = () => {
      try {
        const win = iframe.contentWindow;
        win.focus();
        win.print();
      } catch (e) { toast("No se pudo imprimir en este navegador"); }
    };

    const idoc = iframe.contentWindow.document;
    idoc.open();
    idoc.write(html);
    idoc.close();
    // esperar a que el contenido del iframe esté listo antes de imprimir
    if (iframe.contentWindow.document.readyState === "complete") {
      setTimeout(doPrint, 250);
    } else {
      iframe.onload = () => setTimeout(doPrint, 250);
    }
  }
  const btnPrintLot = $("#btnPrintLot");
  if (btnPrintLot) btnPrintLot.addEventListener("click", printLotInfo);

  $("#btnRemoveMarker").addEventListener("click", () => {
    if (!activeLotId) return;
    updateLot(activeLotId, { x: null, y: null });
    toast(`Marcador del Solar #${activeLotId} eliminado`);
    openLotModal(activeLotId);
  });

  /* ---------------------------------------------------------------
     12b. AUTO-LIBERADO DE RESERVAS (fijo en 72 horas / 3 días)
     En cuanto un solar pasa a "reservado" se guarda la fecha/hora exacta
     (reservedAt); si nadie lo marca como vendido dentro de 72 horas, se
     libera solo. Este plazo es FIJO — no es editable desde el panel.
     Cualquier navegador con la página abierta revisa esto cada minuto; como
     usa la misma tabla de Supabase, todos lo ven reflejarse al instante
     gracias a la suscripción en tiempo real que ya existe.
  ----------------------------------------------------------------- */
  const RESERVATION_DAYS = 3; // fijo — 72 horas

  function sweepExpiredReservations() {
    if (!sb) return;
    const cutoffIso = new Date(Date.now() - RESERVATION_DAYS * 24 * 3600 * 1000).toISOString();
    sb.from("lots")
      .update({ status: "disponible", reserved_date: null, reserved_at: null, rate: null, updated_at: new Date().toISOString() })
      .eq("status", "reservado")
      .lte("reserved_at", cutoffIso)
      .then(({ error }) => { if (error) console.warn("⚠️ Error liberando reservas vencidas:", error); });
  }

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

  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userRaw = ($("#loginUser").value || "").trim();
    const pass = $("#loginPassword").value || "";
    $("#loginError").hidden = true;
    if (sb) {
      // El usuario escribe solo su USUARIO; por dentro se arma el correo para Supabase.
      const email = userRaw.includes("@") ? userRaw : (userRaw.toLowerCase() + "@" + CONFIG.ADMIN_EMAIL_DOMAIN);
      try {
        const { error } = await sb.auth.signInWithPassword({ email, password: pass });
        if (error) { $("#loginError").hidden = false; return; }
        setAdmin(true); closeModals();
        toast("Sesión de administrador iniciada");
        $("#adminPanel").hidden = false; $("#adminOverlay").hidden = false;
        renderAdminTable(); updateRateDisplay();
      } catch (err) { $("#loginError").hidden = false; }
      return;
    }
    // Respaldo local (solo si no hay Supabase, p. ej. pruebas sin conexión)
    const ok = (userRaw.toLowerCase() === CONFIG.ADMIN_USER.toLowerCase() && pass === CONFIG.ADMIN_PASSWORD);
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
  $("#btnLogoutAdmin").addEventListener("click", async () => {
    if (sb) { try { await sb.auth.signOut(); } catch (e) {} }
    setAdmin(false); toast("Sesión cerrada");
  });

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
     16. NOTAS — blog de notas internas del admin
     Guarda cada página en Supabase (tabla admin_notes). Si no hay
     Supabase disponible, usa localStorage como respaldo, igual que el
     resto de la app.
  ----------------------------------------------------------------- */
  const NOTES_LOCAL_KEY = "jcx_admin_notes_v1";
  let notesList = [];
  let activeNoteId = null;
  let noteSaveTimer = null;

  function rowToNote(row) {
    return { id: row.id, title: row.title || "Sin título", content: row.content || "", position: row.position || 0, isPublic: !!row.is_public };
  }
  function persistNotesLocal() {
    try { localStorage.setItem(NOTES_LOCAL_KEY, JSON.stringify(notesList)); } catch (e) {}
  }
  async function loadNotes() {
    if (sb) {
      try {
        const { data, error } = await sb.from("admin_notes").select("*").order("position").order("id");
        if (!error && data) { notesList = data.map(rowToNote); return; }
        console.warn("⚠️ No se pudieron cargar las notas de Supabase:", error);
      } catch (e) { console.warn("⚠️ Error cargando notas:", e); }
    }
    try {
      const raw = localStorage.getItem(NOTES_LOCAL_KEY);
      notesList = raw ? JSON.parse(raw) : [];
    } catch (e) { notesList = []; }
  }
  async function createNote() {
    const base = { title: "Nueva página", content: "", position: notesList.length, is_public: false };
    if (sb) {
      try {
        const { data, error } = await sb.from("admin_notes").insert(base).select().single();
        if (!error && data) {
          const note = rowToNote(data);
          notesList.push(note);
          renderNotesList();
          openNote(note.id);
          return;
        }
        console.warn("⚠️ No se pudo crear la página en Supabase:", error);
      } catch (e) { console.warn("⚠️ Error creando nota:", e); }
    }
    const note = { title: "Nueva página", content: "", position: notesList.length, isPublic: false, id: "local-" + Date.now() };
    notesList.push(note);
    persistNotesLocal();
    renderNotesList();
    openNote(note.id);
  }
  function saveActiveNote() {
    const note = notesList.find((n) => n.id === activeNoteId);
    if (!note) return;
    note.title = $("#noteTitleInput").value.trim() || "Sin título";
    note.content = $("#noteContentInput").value;
    const tag = $("#noteSavedTag");
    if (tag) tag.textContent = "Guardando…";
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(async () => {
      if (sb && typeof note.id === "number") {
        try {
          const { error } = await sb.from("admin_notes").update({ title: note.title, content: note.content }).eq("id", note.id);
          if (tag) tag.textContent = error ? "⚠️ Error al guardar" : "Guardado";
        } catch (e) { if (tag) tag.textContent = "⚠️ Error al guardar"; }
      } else {
        persistNotesLocal();
        if (tag) tag.textContent = "Guardado";
      }
      renderNotesList();
    }, 500);
  }
  async function deleteActiveNote() {
    if (!activeNoteId) return;
    const idx = notesList.findIndex((n) => n.id === activeNoteId);
    if (idx === -1) return;
    if (!window.confirm("¿Eliminar esta página de notas? No se puede deshacer.")) return;
    if (sb && typeof activeNoteId === "number") {
      try { await sb.from("admin_notes").delete().eq("id", activeNoteId); }
      catch (e) { console.warn("⚠️ Error eliminando nota:", e); }
    }
    notesList.splice(idx, 1);
    persistNotesLocal();
    activeNoteId = notesList.length ? notesList[0].id : null;
    renderNotesList();
    renderNoteEditor();
    refreshPublicNoticesDot();
    if (!activeNoteId) createNote();
  }
  async function toggleNoteVisibility() {
    const note = notesList.find((n) => n.id === activeNoteId);
    if (!note) return;
    note.isPublic = $("#noteVisibilityInput").checked;
    if (sb && typeof note.id === "number") {
      try {
        const { error } = await sb.from("admin_notes").update({ is_public: note.isPublic }).eq("id", note.id);
        if (error) { console.warn("⚠️ Error guardando visibilidad:", error); toast("⚠️ No se pudo guardar la visibilidad"); }
      } catch (e) { console.warn("⚠️ Error guardando visibilidad:", e); }
    } else {
      persistNotesLocal();
    }
    renderNotesList();
    refreshPublicNoticesDot();
    toast(note.isPublic ? `"${note.title}" ahora es visible para todos` : `"${note.title}" ahora es privada`);
  }
  function renderNotesList() {
    const ul = $("#notesPageList");
    if (!ul) return;
    ul.innerHTML = "";
    notesList.forEach((n) => {
      const li = document.createElement("li");
      li.className = "notes-app__page" + (n.id === activeNoteId ? " is-active" : "");
      li.innerHTML = `<span class="notes-app__page-title">${n.isPublic ? "🌐 " : ""}${escapeHtml(n.title || "Sin título")}</span>`;
      li.addEventListener("click", () => openNote(n.id));
      ul.appendChild(li);
    });
  }
  function openNote(id) {
    activeNoteId = id;
    renderNotesList();
    renderNoteEditor();
  }
  function renderNoteEditor() {
    const note = notesList.find((n) => n.id === activeNoteId);
    const titleInp = $("#noteTitleInput");
    const contentInp = $("#noteContentInput");
    const delBtn = $("#btnDeleteNote");
    const tag = $("#noteSavedTag");
    const visInp = $("#noteVisibilityInput");
    if (!note) {
      if (titleInp) { titleInp.value = ""; titleInp.disabled = true; }
      if (contentInp) { contentInp.value = ""; contentInp.disabled = true; }
      if (delBtn) delBtn.hidden = true;
      if (visInp) visInp.disabled = true;
      return;
    }
    if (titleInp) { titleInp.disabled = false; titleInp.value = note.title; }
    if (contentInp) { contentInp.disabled = false; contentInp.value = note.content; }
    if (delBtn) delBtn.hidden = false;
    if (visInp) { visInp.disabled = false; visInp.checked = !!note.isPublic; }
    if (tag) tag.textContent = "Guardado";
  }
  async function openNotesApp() {
    $("#notesBackdrop").hidden = false;
    await loadNotes();
    if (!notesList.length) { await createNote(); return; }
    if (!activeNoteId || !notesList.some((n) => n.id === activeNoteId)) activeNoteId = notesList[0].id;
    renderNotesList();
    renderNoteEditor();
  }
  function closeNotesApp() { $("#notesBackdrop").hidden = true; }

  /* ===== Avisos públicos (lo que el admin marcó "Visible para todos") ===== */
  async function loadPublicNotices() {
    if (!sb) return [];
    try {
      const { data, error } = await sb.from("admin_notes").select("id,title,content,position").eq("is_public", true).order("position").order("id");
      if (error) { console.warn("⚠️ Error cargando avisos públicos:", error); return []; }
      return data || [];
    } catch (e) { console.warn("⚠️ Error cargando avisos públicos:", e); return []; }
  }
  function renderPublicNotices(items) {
    const list = $("#publicNoticesList");
    const empty = $("#publicNoticesEmpty");
    if (!list || !empty) return;
    list.innerHTML = "";
    if (!items.length) { empty.hidden = false; return; }
    empty.hidden = true;
    items.forEach((n) => {
      const div = document.createElement("div");
      div.className = "notice-modal__item";
      div.innerHTML = `<div class="notice-modal__item-title">${escapeHtml(n.title || "Aviso")}</div>` +
        `<div class="notice-modal__item-body">${escapeHtml(n.content || "")}</div>`;
      list.appendChild(div);
    });
  }
  async function openPublicNotices() {
    $("#publicNoticesBackdrop").hidden = false;
    renderPublicNotices(await loadPublicNotices());
  }
  function closePublicNotices() { $("#publicNoticesBackdrop").hidden = true; }
  async function refreshPublicNoticesDot() {
    const dot = $("#publicNoticesDot");
    if (!dot) return;
    const items = await loadPublicNotices();
    dot.hidden = items.length === 0;
  }
  function subscribePublicNoticesRealtime() {
    if (!sb) return;
    try {
      sb.channel("admin-notes-realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "admin_notes" }, () => {
          refreshPublicNoticesDot();
          if (!$("#publicNoticesBackdrop").hidden) openPublicNotices();
        })
        .subscribe();
    } catch (e) {}
  }

  const btnPublicNotices = $("#btnPublicNotices");
  if (btnPublicNotices) btnPublicNotices.addEventListener("click", openPublicNotices);
  const btnClosePublicNotices = $("#btnClosePublicNotices");
  if (btnClosePublicNotices) btnClosePublicNotices.addEventListener("click", closePublicNotices);
  const publicNoticesBackdrop = $("#publicNoticesBackdrop");
  if (publicNoticesBackdrop) publicNoticesBackdrop.addEventListener("click", (e) => { if (e.target === e.currentTarget) closePublicNotices(); });

  const btnOpenNotes = $("#btnOpenNotes");
  if (btnOpenNotes) btnOpenNotes.addEventListener("click", openNotesApp);
  const btnCloseNotes = $("#btnCloseNotes");
  if (btnCloseNotes) btnCloseNotes.addEventListener("click", closeNotesApp);
  const noteVisibilityInput = $("#noteVisibilityInput");
  if (noteVisibilityInput) noteVisibilityInput.addEventListener("change", toggleNoteVisibility);
  const btnBackToPanel = $("#btnBackToPanel");
  if (btnBackToPanel) btnBackToPanel.addEventListener("click", closeNotesApp);
  const btnNewNote = $("#btnNewNote");
  if (btnNewNote) btnNewNote.addEventListener("click", createNote);
  const btnDeleteNote = $("#btnDeleteNote");
  if (btnDeleteNote) btnDeleteNote.addEventListener("click", deleteActiveNote);
  const noteTitleInput = $("#noteTitleInput");
  if (noteTitleInput) noteTitleInput.addEventListener("input", saveActiveNote);
  const noteContentInput = $("#noteContentInput");
  if (noteContentInput) noteContentInput.addEventListener("input", saveActiveNote);
  const notesBackdrop = $("#notesBackdrop");
  if (notesBackdrop) notesBackdrop.addEventListener("click", (e) => { if (e.target === e.currentTarget) closeNotesApp(); });

  /* ---------------------------------------------------------------
     17. INICIALIZACIÓN
  ----------------------------------------------------------------- */
  async function initializeApp() {
    await loadManualRate();
    subscribeRateRealtime();
    recomputeRate();
    if (sb) { await loadStateFromSupabase(); subscribeRealtime(); sweepExpiredReservations(); setInterval(sweepExpiredReservations, 60000); }
    refreshPublicNoticesDot();
    subscribePublicNoticesRealtime();
    Object.keys(PROJECTS).forEach((pk) => {
      const el = viewportEl(pk);
      if (el) el.style.aspectRatio = PROJECTS[pk].imgW + " / " + PROJECTS[pk].imgH;
    });
    await checkAdminSession();
    setAdmin(isAdmin);
    renderAll();
    repaintMarkers("x");
    repaintMarkers("ix");
    repaintMarkers("ix2");
    repaintMarkers("xi");
    console.log("✅ === APP LISTA ===");
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initializeApp); }
  else { initializeApp(); }
})();