(() => {
  const SUPABASE_URL = "https://hcjbnmheonbfllkdhrph.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_8METCoHofX0o6ddhExRjDA_EX5LXfes";

  const $ = (id) => document.getElementById(id);
  const show = (el, on) => el.classList.toggle("hidden", !on);

  let sb = null;
  let session = null;

  function shortUrl(url) {
    try {
      const u = new URL(url);
      const path = decodeURIComponent(u.pathname).replace(/\/manifest\.json$/i, "");
      const clipped = path.length > 48 ? path.slice(0, 48) + "…" : path;
      return u.host + clipped;
    } catch {
      return url.length > 64 ? url.slice(0, 64) + "…" : url;
    }
  }

  function md5Fallback(str) {
    // Compact MD5 for addon URL hashing (same canonical form as Luma).
    function cmn(q, a, b, x, s, t) {
      a = (a + q + x + t) | 0;
      return (((a << s) | (a >>> (32 - s))) + b) | 0;
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    function md51(s) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i;
      for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
      s = s.substring(i - 64);
      const tail = Array(16).fill(0);
      for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
      tail[i >> 2] |= 0x80 << ((i % 4) * 8);
      if (i > 55) {
        md5cycle(state, tail);
        for (let j = 0; j < 16; j++) tail[j] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }
    function md5blk(s) {
      const md5blks = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] =
          s.charCodeAt(i) +
          (s.charCodeAt(i + 1) << 8) +
          (s.charCodeAt(i + 2) << 16) +
          (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
    function md5cycle(x, k) {
      let [a, b, c, d] = x;
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = (a + x[0]) | 0;
      x[1] = (b + x[1]) | 0;
      x[2] = (c + x[2]) | 0;
      x[3] = (d + x[3]) | 0;
    }
    function rhex(n) {
      let s = "";
      for (let j = 0; j < 4; j++) s += ((n >> (j * 8)) & 255).toString(16).padStart(2, "0");
      return s;
    }
    return md51(unescape(encodeURIComponent(str))).map(rhex).join("");
  }

  function canonicalizeAddonUrl(url) {
    let u = String(url || "").trim();
    let q = "";
    const qi = u.indexOf("?");
    if (qi >= 0) {
      q = u.slice(qi);
      u = u.slice(0, qi);
    }
    u = u.replace(/\/+$/, "");
    if (/\/manifest\.json$/i.test(u)) u = u.replace(/\/manifest\.json$/i, "");
    return u + q;
  }

  function addonUrlHash(url) {
    return md5Fallback(canonicalizeAddonUrl(url));
  }

  function buildHashNames(addons) {
    const map = new Map();
    for (const a of addons || []) {
      map.set(addonUrlHash(a.url), a.name || shortUrl(a.url));
    }
    return map;
  }

  function setMsg(text, isErr) {
    const note = $("dash-msg");
    const err = $("dash-err");
    if (isErr) {
      show(note, false);
      err.textContent = text;
      show(err, true);
    } else {
      show(err, false);
      note.textContent = text;
      show(note, !!text);
    }
  }

  function profileId() {
    const n = Number($("profile-id").value || 1);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
  }

  async function ensureClient() {
    if (sb) return sb;
    if (!window.supabase) throw new Error("Supabase SDK لم يُحمَّل");
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "luma-admin-auth",
      },
    });
    return sb;
  }

  async function renderAuth() {
    await ensureClient();
    const { data } = await sb.auth.getSession();
    session = data.session || null;
    show($("v-login"), !session);
    show($("v-dash"), !!session);
    show($("b-logout"), !!session);
    if (session) {
      $("dash-user").textContent = session.user?.email || session.user?.id || "";
      await refreshDash();
    }
  }

  async function login() {
    const email = $("li-email").value.trim();
    const password = $("li-pass").value;
    const box = $("login-err");
    show(box, false);
    try {
      await ensureClient();
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await renderAuth();
    } catch (e) {
      box.textContent = e.message || String(e);
      show(box, true);
    }
  }

  async function logout() {
    await ensureClient();
    await sb.auth.signOut();
    session = null;
    await renderAuth();
  }

  async function loadAddons(pid) {
    const { data, error } = await sb
      .from("addons")
      .select("url,name,enabled,sort_order,profile_id")
      .eq("profile_id", pid)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function loadLocks(pid) {
    const { data, error } = await sb.rpc("list_own_addon_access_rules", {
      p_profile_id: pid,
    });
    if (error) throw error;
    return data || [];
  }

  async function loadHidden(pid) {
    const { data, error } = await sb.rpc("get_hidden_addon_hashes", {
      p_profile_id: pid,
    });
    if (error) throw error;
    return new Set(data || []);
  }

  const LOCK_ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const OK_ICON = '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>';

  function shortHash(h) {
    const s = String(h || "");
    return s.length > 18 ? s.slice(0, 8) + "…" + s.slice(-6) : s;
  }

  function renderLocks(locks, hashNames) {
    const root = $("locks-list");
    $("locks-count").textContent = locks.length ? String(locks.length) : "";
    if (!locks.length) {
      root.innerHTML = `<div class="empty">${OK_ICON}<strong>لا توجد قيود</strong><span>كل إضافاتك ظاهرة على أجهزتك.</span></div>`;
      return;
    }
    root.innerHTML = locks
      .map((row) => {
        const foreign = !!row.is_foreign_session;
        const pill = foreign
          ? '<span class="pill warn">جلسة أخرى</span>'
          : '<span class="pill ok">هذه الجلسة</span>';
        const label = hashNames.get(row.url_hash) || "إضافة غير معروفة في القائمة";
        return `<article class="row">
          <span class="row-icon ${foreign ? "warn" : ""}">${LOCK_ICON}</span>
          <div class="row-main">
            <div class="row-title">${escapeHtml(label)}</div>
            <div class="row-sub"><span class="mono" title="${escapeHtml(row.url_hash)}">${escapeHtml(shortHash(row.url_hash))}</span>
              <button class="copy" type="button" data-copy="${escapeHtml(row.url_hash)}">نسخ</button>
              <span>· ملف ${escapeHtml(row.profile_id)}</span></div>
          </div>
          <div class="row-side">${pill}
            <button class="btn sec sm" type="button" data-unlock-hash="${escapeHtml(row.url_hash)}">فك القيد مؤقتًا</button>
          </div>
        </article>`;
      })
      .join("");
    root.querySelectorAll("[data-unlock-hash]").forEach((btn) => {
      btn.addEventListener("click", () => unlockOne(btn.getAttribute("data-unlock-hash")));
    });
  }

  let addonsAll = [];
  let addonsStatus = "all";

  function renderAddons(addons, hidden) {
    addonsAll = addons || [];
    void hidden;
    paintAddons();
  }

  function paintAddons() {
    const root = $("addons-list");
    const q = ($("addons-filter").value || "").trim().toLowerCase();
    const filtered = addonsAll.filter((a) => {
      const enabled = a.enabled !== false;
      if (addonsStatus === "on" && !enabled) return false;
      if (addonsStatus === "off" && enabled) return false;
      if (!q) return true;
      return String(a.name || "").toLowerCase().includes(q) || String(a.url || "").toLowerCase().includes(q);
    });
    const total = addonsAll.length;
    $("addons-count").textContent = !total ? "" : filtered.length === total ? String(total) : `${filtered.length} من ${total}`;
    if (!total) {
      root.innerHTML = '<div class="empty"><strong>لا توجد إضافات مزامَنة</strong><span>أضف إضافات من Luma وستظهر هنا لهذا الملف.</span></div>';
      return;
    }
    if (!filtered.length) {
      root.innerHTML = '<div class="empty"><strong>ما فيه نتائج</strong><span>جرّب كلمة ثانية أو غيّر التصفية.</span></div>';
      return;
    }
    root.innerHTML = filtered
      .map((a) => {
        const enabled = a.enabled !== false;
        const name = a.name || shortUrl(a.url);
        const initial = String(name).trim().charAt(0).toUpperCase() || "؟";
        const pill = enabled ? '<span class="pill ok">مفعّلة</span>' : '<span class="pill">متوقفة</span>';
        return `<article class="row">
          <span class="row-icon ${enabled ? "" : "off"}">${escapeHtml(initial)}</span>
          <div class="row-main">
            <div class="row-title">${escapeHtml(name)}</div>
            <div class="row-sub"><span class="mono">${escapeHtml(shortUrl(a.url))}</span></div>
          </div>
          <div class="row-side">${pill}</div>
        </article>`;
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function setPill(el, kind, text) {
    el.className = "pill " + kind;
    el.textContent = text;
  }

  async function refreshDash() {
    setMsg("", false);
    const pid = profileId();
    $("stat-profile").textContent = String(pid);
    const refreshBtn = $("b-refresh");
    refreshBtn.classList.add("busy");
    refreshBtn.disabled = true;
    try {
      const [addons, locks, hidden] = await Promise.all([
        loadAddons(pid),
        loadLocks(pid),
        loadHidden(pid),
      ]);
      $("stat-addons").textContent = String(addons.length);
      $("stat-locks").textContent = String(locks.length);
      const foreignCount = locks.filter((r) => r.is_foreign_session).length;
      $("stat-foreign").textContent = String(foreignCount);
      setPill($("locks-state"), locks.length ? "warn" : "ok", locks.length ? "مقيّدة" : "بدون قيود");
      setPill($("foreign-state"), foreignCount ? "warn" : "ok", foreignCount ? "تحتاج مراجعة" : "سليمة");
      $("dash-updated").textContent = "آخر تحديث " + new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });
      const hashNames = buildHashNames(addons);
      renderLocks(locks, hashNames);
      renderAddons(addons, hidden);
      if (hidden.size) {
        setMsg(`هذه الجلسة ترى ${hidden.size} إضافة مخفية من جهاز/جلسة أخرى.`, false);
      }
    } catch (e) {
      setMsg(e.message || String(e), true);
    } finally {
      refreshBtn.classList.remove("busy");
      refreshBtn.disabled = false;
    }
  }

  async function unlockOne(urlHash) {
    if (!urlHash) return;
    if (!confirm("فك هذا القيد مؤقتًا؟ يمكن إعادته لاحقًا من Luma عبر «إخفاء ومنع بالأجهزة الأخرى».")) return;
    setMsg("", false);
    try {
      const { data, error } = await sb.rpc("clear_own_addon_access_rule_by_hash", {
        p_url_hash: urlHash,
        p_profile_id: profileId(),
      });
      if (error) throw error;
      setMsg(data ? "تم فك القيد مؤقتًا." : "ما لقيت قيد بهالهاش.", false);
      await refreshDash();
    } catch (e) {
      setMsg(e.message || String(e), true);
    }
  }

  async function clearLocks() {
    const pid = profileId();
    if (!confirm(`تحذير: هذه القيود هي التي تخفي إضافاتك الخاصة (مثل إضافات البالغين) عن بقية الأجهزة، كالتلفزيون. مسحها يكشف هذه الإضافات على كل جهاز يزامن حسابك.\n\nمسح كل القيود للملف ${pid}؟`)) return;
    setMsg("", false);
    try {
      const { data, error } = await sb.rpc("clear_own_addon_access_rules", {
        p_profile_id: pid,
      });
      if (error) throw error;
      setMsg(`تم مسح ${data ?? 0} قيد.`, false);
      await refreshDash();
    } catch (e) {
      setMsg(e.message || String(e), true);
    }
  }

  const THEME_KEY = "luma-admin-theme";

  function themeChoice() {
    try {
      const v = localStorage.getItem(THEME_KEY);
      return v === "light" || v === "dark" ? v : "system";
    } catch {
      return "system";
    }
  }

  function applyTheme(choice) {
    const root = document.documentElement;
    if (choice === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", choice);
    try {
      if (choice === "system") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, choice);
    } catch { /* storage blocked */ }
    document.querySelectorAll("[data-theme-choice]").forEach((b) => {
      b.setAttribute("aria-checked", String(b.dataset.themeChoice === choice));
    });
    const dark = choice === "dark" || (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const meta = document.getElementById("meta-theme-color");
    if (meta) meta.setAttribute("content", dark ? "#0e0c09" : "#ffffff");
  }

  async function copyText(btn) {
    const text = btn.getAttribute("data-copy") || "";
    const done = () => {
      const old = btn.textContent;
      btn.textContent = "تم النسخ";
      setTimeout(() => { btn.textContent = old; }, 1200);
    };
    try {
      await navigator.clipboard.writeText(text);
      done();
    } catch {
      const r = document.createRange();
      r.selectNodeContents(btn.previousElementSibling || btn);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }

  function wire() {
    applyTheme(themeChoice());
    document.querySelectorAll("[data-theme-choice]").forEach((b) => {
      b.addEventListener("click", () => applyTheme(b.dataset.themeChoice));
    });
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (themeChoice() === "system") applyTheme("system");
      });
    } catch { /* old browser */ }
    const bump = (d) => {
      $("profile-id").value = String(Math.max(1, profileId() + d));
      refreshDash();
    };
    $("b-prof-dec").addEventListener("click", () => bump(-1));
    $("b-prof-inc").addEventListener("click", () => bump(1));
    $("profile-id").addEventListener("change", refreshDash);
    $("addons-filter").addEventListener("input", paintAddons);
    document.querySelectorAll("#status-seg [data-status]").forEach((b) => {
      b.addEventListener("click", () => {
        addonsStatus = b.dataset.status;
        document.querySelectorAll("#status-seg [data-status]").forEach((x) => {
          x.setAttribute("aria-checked", String(x === b));
        });
        paintAddons();
      });
    });
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (btn) copyText(btn);
    });
    $("b-login").addEventListener("click", login);
    $("b-logout").addEventListener("click", logout);
    $("b-refresh").addEventListener("click", refreshDash);
    $("b-clear-locks").addEventListener("click", clearLocks);
    $("li-pass").addEventListener("keydown", (e) => {
      if (e.key === "Enter") login();
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    wire();
    try {
      await renderAuth();
    } catch (e) {
      const box = $("login-err");
      box.textContent = e.message || String(e);
      show($("v-login"), true);
      show(box, true);
    }
  });
})();
