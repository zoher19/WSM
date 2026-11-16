# بتقدر تجاوبني؟ — صفحة ترويجية للورشة

صفحة واحدة (HTML/CSS/JS عادي، بدون أي framework أو build step) مخصصة للموبايل، لعرضها عبر QR code.

## الملفات
- `index.html`
- `style.css`
- `script.js` — فيه object اسمه `CONFIG` بأول الملف فيه رابط الواتساب والتواريخ، عدّل من هناك فقط.
- `og-image.png` — (اختياري) ضيف صورة بهذا الاسم بجانب `index.html` لتظهر بمعاينة الروابط.

## نشر الموقع مجانًا على GitHub Pages

1. **إنشاء مستودع جديد على GitHub**
   - روح لـ https://github.com/new
   - أعطِ المستودع اسم (مثلاً `workshop-promo`)، واختار Public، ثم أنشئه.

2. **رفع الملفات** (من مجلد المشروع على جهازك):

   ```bash
   git init
   git add index.html style.css script.js README.md
   git commit -m "Initial promo page"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

   (استبدل `USERNAME` و `REPO_NAME` باسم حسابك واسم المستودع.)

3. **تفعيل GitHub Pages**
   - بصفحة المستودع على GitHub، روح لـ **Settings → Pages**.
   - تحت **Build and deployment → Source** اختار **Deploy from a branch**.
   - اختار Branch: `main` و Folder: `/ (root)`، ثم اضغط **Save**.
   - انتظر دقيقة أو دقيقتين لحد ما يظهر رابط أخضر بالأعلى.

4. **الرابط النهائي**

   ```
   https://USERNAME.github.io/REPO_NAME/
   ```

   هاد هو الرابط اللي تحوّله لـ QR code (أي موقع QR generator عادي بكفي، مثل qr-code-generator.com).

## تعديل البيانات بسرعة

افتح `script.js` وعدّل القيم بأعلى الملف داخل `CONFIG`:

```js
const CONFIG = {
  whatsappLink: "...",   // رابط قروب الواتساب
  eventStart: "...",     // تاريخ ووقت بداية الورشة (ISO + توقيت عمّان)
  eventEnd: "...",       // تاريخ ووقت نهاية الورشة
  eventTitle: "...",
  eventLocation: "...",
  shareText: "...",
};
```

بعد أي تعديل، اعمل commit و push من جديد وبينزل التحديث خلال دقيقة على GitHub Pages.
