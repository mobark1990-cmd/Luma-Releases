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

  function renderLocks(locks) {
    const root = $("locks-list");
    if (!locks.length) {
      root.innerHTML = '<div class="empty">لا توجد قيود حاليًا.</div>';
      return;
    }
    root.innerHTML = locks
      .map((row) => {
        const foreign = row.is_foreign_session
          ? '<span class="chip warn">جلسة أخرى</span>'
          : '<span class="chip">هذه الجلسة</span>';
        return `<article class="card">
          <div class="title mono">${row.url_hash}</div>
          <div class="small">ملف ${row.profile_id}</div>
          <div class="chips">${foreign}</div>
        </article>`;
      })
      .join("");
  }

  function renderAddons(addons, hidden) {
    const root = $("addons-list");
    if (!addons.length) {
      root.innerHTML = '<div class="empty">لا توجد إضافات مزامَنة لهذا الملف.</div>';
      return;
    }
    root.innerHTML = addons
      .map((a) => {
        // Local hash check is approximate for display of "مخفية هنا" via get_hidden list size only.
        const enabled = a.enabled !== false;
        const chips = [
          enabled ? '<span class="chip">مفعّلة</span>' : '<span class="chip warn">متوقفة</span>',
        ].join("");
        const name = a.name || shortUrl(a.url);
        return `<article class="card">
          <div class="title">${escapeHtml(name)}</div>
          <div class="url">${escapeHtml(shortUrl(a.url))}</div>
          <div class="chips">${chips}</div>
        </article>`;
      })
      .join("");
    void hidden;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  async function refreshDash() {
    setMsg("", false);
    const pid = profileId();
    $("stat-profile").textContent = String(pid);
    try {
      const [addons, locks, hidden] = await Promise.all([
        loadAddons(pid),
        loadLocks(pid),
        loadHidden(pid),
      ]);
      $("stat-addons").textContent = String(addons.length);
      $("stat-locks").textContent = String(locks.length);
      $("stat-foreign").textContent = String(
        locks.filter((r) => r.is_foreign_session).length
      );
      renderLocks(locks);
      renderAddons(addons, hidden);
      if (hidden.size) {
        setMsg(`هذه الجلسة ترى ${hidden.size} إضافة مخفية من جهاز/جلسة أخرى.`, false);
      }
    } catch (e) {
      setMsg(e.message || String(e), true);
    }
  }

  async function clearLocks() {
    const pid = profileId();
    if (!confirm(`مسح كل قيود الإضافات للملف ${pid}؟`)) return;
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

  function wire() {
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
