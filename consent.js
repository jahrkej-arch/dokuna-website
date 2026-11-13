/* Dokuna: Einwilligung für die Google-Ads-Messung (Variante B, vorbereitet).
   Solange ADS_ID leer ist, macht dieses Skript nichts: kein Banner, kein Google-Skript, keine Cookies.
   Mit ADS_ID lädt es Google erst NACH „Akzeptieren“ (Consent Mode v2, Standard „abgelehnt“).
   Gemessen wird nur, ob eine Anzeige zu einer Anfrage führt. Keine Personalisierung, kein Remarketing. */
(function () {
  var ADS_ID = '';              // z. B. 'AW-123456789' aus Google Ads > Zielvorhaben > Conversions
  var LABEL_ANFRAGE = '';       // Conversion-Label der Aktion „Vorführung angefragt“
  var SCHLUESSEL = 'dokuna-einwilligung-ads';
  if (!/^AW-\d{6,}$/.test(ADS_ID)) return;

  var w = window, d = document;
  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });

  function lesen() { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) || 'null'); } catch (e) { return null; } }
  function schreiben(ja) { try { localStorage.setItem(SCHLUESSEL, JSON.stringify({ ja: ja, am: new Date().toISOString().slice(0, 10) })); } catch (e) {} }

  var geladen = false;
  function googleLaden() {
    if (geladen) return; geladen = true;
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied' });
    gtag('js', new Date());
    gtag('config', ADS_ID, { allow_ad_personalization_signals: false });
    var s = d.createElement('script'); s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ADS_ID);
    d.head.appendChild(s);
  }
  function anfrageMessen() {
    if (!geladen || !LABEL_ANFRAGE) return;
    gtag('event', 'conversion', { send_to: ADS_ID + '/' + LABEL_ANFRAGE });
  }
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:info@dokuna.de"], a[href^="tel:"]');
    if (a) anfrageMessen();
  });

  function cookiesWeg() {
    d.cookie.split(';').forEach(function (c) {
      var n = c.split('=')[0].trim();
      if (/^(_gcl_|_ga|IDE|test_cookie)/.test(n)) {
        ['', '; domain=.' + location.hostname, '; domain=' + location.hostname].forEach(function (dom) {
          d.cookie = n + '=; Max-Age=0; path=/' + dom;
        });
      }
    });
  }

  var css = '.ek{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:640px;margin:0 auto;background:#fff;border:1px solid #e9e7e2;border-radius:16px;box-shadow:0 18px 40px rgba(15,42,67,.16);padding:18px 20px;font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;color:#2b2a27}' +
    '.ek b{display:block;font-size:16px;margin-bottom:4px}.ek p{margin:0 0 14px}.ek a{color:#0e8477}' +
    '.ek-knoepfe{display:flex;gap:10px}.ek button{flex:1;font:inherit;font-weight:600;padding:11px 14px;border-radius:999px;border:2px solid #0e8477;background:#fff;color:#0e8477;cursor:pointer}' +
    '.ek button:focus-visible{outline:3px solid #f2b705;outline-offset:2px}@media (max-width:480px){.ek{left:10px;right:10px;bottom:10px;padding:16px}.ek-knoepfe{flex-direction:column}}';

  var banner = null;
  function zeigen() {
    if (banner) { banner.hidden = false; banner.querySelector('button').focus(); return; }
    var st = d.createElement('style'); st.textContent = css; d.head.appendChild(st);
    banner = d.createElement('div');
    banner.className = 'ek'; banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-labelledby', 'ek-titel');
    banner.innerHTML = '<b id="ek-titel">Messung unserer Anzeigen</b>' +
      '<p>Wir möchten mit Google Ads messen, ob unsere Anzeigen zu Anfragen führen. Dafür setzt Google mit Ihrer Einwilligung Cookies, dabei können Daten in die USA gehen. Keine Personalisierung, kein Remarketing. Ihre Wahl können Sie jederzeit unter „Cookie-Einstellungen“ unten auf der Seite ändern. Mehr in der <a href="/datenschutz/#google-ads">Datenschutzerklärung</a>.</p>' +
      '<div class="ek-knoepfe"><button type="button" data-wahl="nein">Ablehnen</button><button type="button" data-wahl="ja">Akzeptieren</button></div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var ja = b.getAttribute('data-wahl') === 'ja';
      var vorher = lesen();
      schreiben(ja); banner.hidden = true;
      if (ja) googleLaden();
      else if (vorher && vorher.ja) { cookiesWeg(); location.reload(); }
    });
    d.body.appendChild(banner);
  }

  function fusslink() {
    var nav = d.querySelector('footer nav');
    if (!nav || nav.querySelector('.ek-link')) return;
    var a = d.createElement('a'); a.href = '#'; a.className = 'ek-link'; a.textContent = 'Cookie-Einstellungen';
    a.addEventListener('click', function (e) { e.preventDefault(); zeigen(); });
    nav.appendChild(a);
  }

  function start() {
    fusslink();
    var w0 = lesen();
    if (w0 && w0.ja) googleLaden();
    else if (!w0) zeigen();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();
