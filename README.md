# Atakan Divan — Portfolyo

Saf HTML/CSS/JS, build adımı yok. Herhangi bir statik sunucuya (Nginx, Apache, GitHub Pages, Netlify, Vercel, Cloudflare Pages…) olduğu gibi yüklenebilir.

## Sunucuya yüklenecek dosyalar

```
index.html
assets/
  css/style.css
  js/i18n.js
  js/main.js
  profile.jpg
  favicon.svg
  atakan-divan-cv.pdf
```

(`.claude/`, kök dizindeki orijinal CV ve WhatsApp fotoğrafının yüklenmesine gerek yok.)

## Düzenleme

- **Metinler (TR/EN):** `assets/js/i18n.js`, her iki dil için tek dosya.
- **Renk:** `assets/css/style.css` başındaki `--accent` değişkeni.
- **Fotoğraf:** `assets/profile.jpg` dosyasını değiştirin (yaklaşık 1.15:1 oran).
- **CV:** `assets/atakan-divan-cv.pdf`.

## Dil seçimi

Öncelik sırası: `?lang=en` / `?lang=tr` URL parametresi → kullanıcının son seçimi → tarayıcı dili (Türkçe ise TR, değilse EN).

## İletişim formu

Form, ziyaretçinin e-posta uygulamasını hazır mesajla açar (`mailto:`), sunucu tarafı gerekmez. Mesajların doğrudan size gelmesini isterseniz Formspree / Web3Forms gibi bir servisle `assets/js/main.js` içindeki submit kısmı değiştirilebilir.
