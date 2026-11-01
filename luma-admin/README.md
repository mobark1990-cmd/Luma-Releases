# Luma Admin Web

لوحة تحكم ويب منفصلة لحساب Luma على Supabase.

## الاستخدام المحلي

افتح المجلد بخادم ثابت، مثل:

```bash
python3 -m http.server 8765 --directory /home/mubarak/Projects/Luma-Linux/admin-web
```

ثم افتح `http://127.0.0.1:8765/`.

## ما يُنشر وما لا يُنشر

يُنشر: `index.html` و`app.js` و`styles.css` و`vendor/`. **لا يُنشر** `verify_rpc.py` (يقرأ جلسة Luma من جهازك). مكتبة Supabase محفوظة محلياً في `vendor/` (النسخة 2.49.1) بدل تحميلها من CDN، والصفحة مقيّدة بسياسة CSP تسمح بالاتصال بخادم Supabase فقط.

## النشر

يُنسخ محتوى هذا المجلد إلى فرع `gh-pages` تحت المسار `luma-admin/` في مستودع `Luma-Releases`:

`https://mobark1990-cmd.github.io/Luma-Releases/luma-admin/`

ملاحظة: صفحات GitHub لهذا المستودع تُبنى من فرع `gh-pages` وليس `main`.

## الصلاحيات

- تسجيل الدخول بحساب Luma (Supabase Auth).
- يستدعي `list_own_addon_access_rules` و`clear_own_addon_access_rules` و`get_hidden_addon_hashes` وجداول `addons` بمفتاح anon فقط.
