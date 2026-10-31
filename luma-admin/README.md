# Luma Admin Web

لوحة تحكم ويب منفصلة لحساب Luma على Supabase.

## الاستخدام المحلي

افتح المجلد بخادم ثابت، مثل:

```bash
python3 -m http.server 8765 --directory /home/mubarak/Projects/Luma-Linux/admin-web
```

ثم افتح `http://127.0.0.1:8765/`.

## النشر

يُنسخ محتوى هذا المجلد إلى `luma-admin/` داخل مستودع GitHub Pages:

`https://mobark1990-cmd.github.io/Luma-Releases/luma-admin/`

## الصلاحيات

- تسجيل الدخول بحساب Luma (Supabase Auth).
- يستدعي `list_own_addon_access_rules` و`clear_own_addon_access_rules` و`get_hidden_addon_hashes` وجداول `addons` بمفتاح anon فقط.
