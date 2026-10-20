<p align="center"><img src="assets/luma_wordmark.svg?v=2" alt="Luma" width="430" /></p>

# Luma Releases

ملفات تثبيت تطبيق **Luma** لأجهزة Android TV والجوالات.

⬇️ **آخر إصدار:** [صفحة الإصدارات](https://github.com/mobark1990-cmd/Luma-Releases/releases) — افتح أعلى إصدار، ثم من قسم *Assets* نزّل الملف المناسب لجهازك:


| الجهاز | الملف |
|---|---|
| **NVIDIA Shield TV / Shield TV Pro** (كل الإصدارات) | `app-full-arm64-v8a-release.apk` |
| أغلب أجهزة Android TV والبوكسات الحديثة، والجوالات الحديثة (64-bit) | `app-full-arm64-v8a-release.apk` |
| الأجهزة القديمة أو الرخيصة بنظام 32-bit | `app-full-armeabi-v7a-release.apk` |
| Waydroid / المحاكيات على الكمبيوتر (64-bit) | `app-full-x86_64-release.apk` |
| محاكي أو جهاز x86 بنظام 32-bit | `app-full-x86-release.apk` |
| **لست متأكداً؟** يعمل على أي جهاز (حجمه أكبر) | `app-full-universal-release.apk` |

**كيف أعرف نوع جهازي؟** ثبّت تطبيق مثل *CPU-Z* أو *Device Info HW* وانظر إلى «Supported ABIs»:
إذا ظهر `arm64-v8a` فاختر ملف arm64، وإذا ظهر `armeabi-v7a` فقط فاختر ملف armeabi.

> بعد التثبيت الأول، تحديثات Luma تصل من داخل التطبيق، ويختار التطبيق الملف المناسب لجهازك تلقائياً.

## لينكس (Linux)

نسخة Luma لأجهزة لينكس (x86_64)، بنفس الواجهة والإضافات. إصداراتها تحمل الوسم `v1.1.0-linux.*` في [صفحة الإصدارات](https://github.com/mobark1990-cmd/Luma-Releases/releases)، والملف المطلوب هو `luma-linux-x86_64.tar.gz`.

```bash
sudo pacman -S --needed jdk21-openjdk mpv     # Java 17+ و mpv
tar xzf luma-linux-x86_64.tar.gz
./luma/bin/install-luma.sh                     # يضيف أمر luma وأيقونة في قائمة التطبيقات
luma
```

بعد التثبيت الأول تصل التحديثات من داخل التطبيق. الأسهم للتنقل، وEnter موافق، وEsc رجوع، وF11 ملء الشاشة.

## الإضافات

Luma لا يأتي بإضافات جاهزة. بعد فتح التطبيق تظهر شاشة **ضبط الإضافات**:

1. الصق رابط الإضافة في خانة **تثبيت إضافة**، ثم اضغط **تثبيت**.
2. أو اضغط **أظهر رمز QR** وامسحه من الجوال، ثم أدر الإضافات من الهاتف.

لاحقاً يمكن تثبيت المزيد أو حذفها من خانة **الإضافات**.

## الترجمات

إضافات الترجمة تُثبَّت بنفس الطريقة: انسخ الرابط والصقه في خانة **تثبيت إضافة**.

| الإضافة | الرابط |
|---|---|
| opensubtitles PRO | https://stremio-addons.net/addons/opensubtitles-pro |
| SubSource Subtitles | https://stremio-addons.net/addons/subsource-subtitles |
| SubDL Subtitles | https://stremio-addons.net/addons/subdl-subtitles |
| SubSense | https://stremio-addons.net/addons/subsense |
