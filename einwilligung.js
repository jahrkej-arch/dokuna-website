/*
 * Dokuna – Einwilligung (Cookie-Banner) und Google-Messung
 *
 * So lange unten keine Kennung eingetragen ist, passiert hier NICHTS:
 * kein Banner, kein Cookie, keine Verbindung zu Google. Die Website bleibt
 * so cookiefrei wie bisher.
 *
 * Einschalten:
 * 1. GOOGLE_ADS_ID (z. B. "AW-123456789") und/oder GA4_ID (z. B. "G-ABC123XYZ") eintragen
 * 2. Für Anzeigen zusätzlich ANFRAGE_LABEL aus der Conversion-Aktion in Google Ads eintragen
 * 3. Datenschutzerklärung umstellen (Abschnitt "Einwilligung und Messung" einblenden,
 *    Einleitung tauschen; siehe Kommentar in /datenschutz/index.html)
 *
 * YouTube-Videos: an der gewünschten Stelle einfügen
 *   <div class="yt-video" data-yt-id="VIDEO-ID" data-titel="Titel des Videos"></div>
 * Das Video lädt erst nach Klick oder nach Zustimmung zu "Externe Medien"
 * (über youtube-nocookie.com).
 *
 * Banner: CookieConsent 3.3.0 von Orest Bida, MIT-Lizenz, liegt lokal unter /vendor/.
 */
(function () {
  'use strict';

  // ===== Hier eintragen =====
  var GOOGLE_ADS_ID = '';   // z. B. 'AW-123456789'
  var ANFRAGE_LABEL = '';   // z. B. 'AbCdEfGhIjKlMnOp' (Label der Conversion "Anfrage")
  var GA4_ID = '';          // z. B. 'G-ABC123XYZ'
  // ==========================

  var LIB = '/vendor/cookieconsent-3.3.0/';
  var hatGoogle = !!(GOOGLE_ADS_ID || GA4_ID);
  var hatVideo = !!document.querySelector('.yt-video');

  if (!hatGoogle && !hatVideo) return; // ruhend: nichts laden, nichts speichern

  // ----- Google Consent Mode v2: alles zuerst verweigert -----
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted'
  });

  var googleGeladen = false;
  function ladeGoogle() {
    if (googleGeladen || !hatGoogle) return;
    googleGeladen = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GOOGLE_ADS_ID || GA4_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    if (GA4_ID) gtag('config', GA4_ID, { anonymize_ip: true });
    if (GOOGLE_ADS_ID) gtag('config', GOOGLE_ADS_ID);
  }

  function setzeEinwilligung(cc) {
    var analyse = cc.acceptedCategory('analyse');
    var werbung = cc.acceptedCategory('werbung');
    gtag('consent', 'update', {
      analytics_storage: analyse ? 'granted' : 'denied',
      ad_storage: werbung ? 'granted' : 'denied',
      ad_user_data: werbung ? 'granted' : 'denied',
      ad_personalization: werbung ? 'granted' : 'denied'
    });
    if ((analyse && GA4_ID) || (werbung && GOOGLE_ADS_ID)) ladeGoogle();
    if (cc.acceptedCategory('medien')) zeigeAlleVideos();
  }

  // ----- Anfragen messen: Vorführung, E-Mail, Telefon -----
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !googleGeladen) return;
    var href = a.getAttribute('href') || '';
    var art = null;
    if (/^mailto:/i.test(href)) art = /Vorf/i.test(href) || /Vorf/i.test(a.textContent) ? 'vorfuehrung' : 'email';
    else if (/^tel:/i.test(href)) art = 'telefon';
    if (!art) return;
    if (GA4_ID) gtag('event', 'generate_lead', { methode: art });
    if (GOOGLE_ADS_ID && ANFRAGE_LABEL) {
      gtag('event', 'conversion', { send_to: GOOGLE_ADS_ID + '/' + ANFRAGE_LABEL });
    }
  }, true);

  // ----- YouTube erst nach Klick oder Zustimmung -----
  function zeigeVideo(box) {
    if (box.getAttribute('data-geladen')) return;
    var id = box.getAttribute('data-yt-id');
    if (!/^[\w-]{6,20}$/.test(id || '')) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0';
    f.title = box.getAttribute('data-titel') || 'Video';
    f.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    f.loading = 'lazy';
    f.setAttribute('allowfullscreen', '');
    box.textContent = '';
    box.appendChild(f);
    box.setAttribute('data-geladen', '1');
  }
  function zeigeAlleVideos() {
    document.querySelectorAll('.yt-video').forEach(zeigeVideo);
  }
  document.querySelectorAll('.yt-video').forEach(function (box) {
    var titel = box.getAttribute('data-titel') || 'Video';
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'yt-start';
    b.innerHTML = '<span class="yt-play" aria-hidden="true">▶</span>' +
      '<span class="yt-titel"></span>' +
      '<span class="yt-hinweis">Mit dem Klick wird das Video von YouTube geladen. ' +
      'Dabei werden Daten an Google übertragen. Mehr in der Datenschutzerklärung.</span>';
    b.querySelector('.yt-titel').textContent = titel;
    b.addEventListener('click', function () {
      zeigeVideo(box);
    });
    box.appendChild(b);
  });

  // ----- Banner laden -----
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = LIB + 'cookieconsent.css';
  document.head.appendChild(css);
  var eigenCss = document.createElement('link');
  eigenCss.rel = 'stylesheet';
  eigenCss.href = '/einwilligung.css';
  document.head.appendChild(eigenCss);

  function linkInFusszeile() {
    var nav = document.querySelector('footer nav') || document.querySelector('footer');
    if (!nav || nav.querySelector('[data-cc]')) return;
    var a = document.createElement('a');
    a.href = '#';
    a.setAttribute('data-cc', 'show-preferencesModal');
    a.textContent = 'Cookie-Einstellungen';
    nav.appendChild(a);
  }

  var kategorien = { notwendig: { enabled: true, readOnly: true } };
  var abschnitte = [
    {
      title: 'Ihre Privatsphäre',
      description: 'Hier legen Sie fest, welche Cookies und Dienste wir verwenden dürfen. Ihre Auswahl gilt für 6 Monate und kann jederzeit über „Cookie-Einstellungen“ am Seitenende geändert werden. Weitere Informationen finden Sie in unserer <a href="/datenschutz/">Datenschutzerklärung</a>.'
    },
    {
      title: 'Unbedingt erforderlich',
      description: 'Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden. Gespeichert wird ausschließlich Ihre Auswahl in diesen Einstellungen (Cookie „cc_cookie“, Speicherdauer 6 Monate). Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG.',
      linkedCategory: 'notwendig'
    }
  ];
  var ANBIETER = ' Anbieter: Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Eine Übermittlung von Daten in die USA ist möglich.';
  var zwecke = [];
  if (GA4_ID) {
    kategorien.analyse = { enabled: false };
    zwecke.push('die Nutzung unserer Website statistisch auszuwerten');
    abschnitte.push({
      title: 'Statistik',
      description: 'Mit Google Analytics 4 erfassen wir in pseudonymisierter Form, wie Besucher unsere Website nutzen, zum Beispiel welche Seiten aufgerufen werden und über welche Wege Besucher zu uns kommen.' + ANBIETER + ' Speicherdauer: bis zu 14 Monate.',
      linkedCategory: 'analyse'
    });
  }
  if (GOOGLE_ADS_ID) {
    kategorien.werbung = { enabled: false };
    zwecke.push('den Erfolg unserer Werbung zu messen');
    abschnitte.push({
      title: 'Marketing',
      description: 'Mit Google Ads messen wir, ob ein Besuch über eine unserer Anzeigen bei Google oder YouTube zu einer Anfrage geführt hat (Conversion-Messung).' + ANBIETER + ' Speicherdauer: bis zu 90 Tage.',
      linkedCategory: 'werbung'
    });
  }
  if (hatVideo) {
    kategorien.medien = { enabled: false };
    zwecke.push('Videos von YouTube einzubinden');
    abschnitte.push({
      title: 'Externe Medien',
      description: 'Eingebundene Videos von YouTube werden direkt beim Aufruf der Seite geladen. Ohne Einwilligung wird ein Video erst geladen, wenn Sie es anklicken.' + ANBIETER,
      linkedCategory: 'medien'
    });
  }
  var zweckText = zwecke.length > 1
    ? zwecke.slice(0, -1).join(', ') + ' und ' + zwecke[zwecke.length - 1]
    : zwecke[0];
  var bannerText = 'Wir verwenden Cookies und ähnliche Technologien. Mit Ihrer Einwilligung setzen wir Dienste von Google ein, um ' + zweckText +
    ' (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Dabei können Daten in die USA übertragen werden. ' +
    'Die Einwilligung ist freiwillig und jederzeit über „Cookie-Einstellungen“ am Seitenende widerrufbar.';

  function start() {
    var cc = window.CookieConsent;
    if (!cc) return;
    linkInFusszeile();
    cc.run({
      revision: 1,
      cookie: { name: 'cc_cookie', expiresAfterDays: 182, sameSite: 'Lax' },
      guiOptions: {
        consentModal: { layout: 'cloud inline', position: 'bottom center', equalWeightButtons: true, flipButtons: false },
        preferencesModal: { layout: 'box', equalWeightButtons: true }
      },
      categories: kategorien,
      onConsent: function () { setzeEinwilligung(cc); },
      onChange: function () {
        setzeEinwilligung(cc);
        // Widerruf: bereits geladenes Google-Skript entfernen wir durch Neuladen
        if (googleGeladen && !cc.acceptedCategory('analyse') && !cc.acceptedCategory('werbung')) {
          location.reload();
        }
      },
      language: {
        default: 'de',
        translations: {
          de: {
            consentModal: {
              title: 'Datenschutz-Einstellungen',
              description: bannerText,
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Alle ablehnen',
              showPreferencesBtn: 'Einstellungen',
              footer: '<a href="/datenschutz/">Datenschutzerklärung</a> <a href="/impressum/">Impressum</a>'
            },
            preferencesModal: {
              title: 'Datenschutz-Einstellungen',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Alle ablehnen',
              savePreferencesBtn: 'Auswahl speichern',
              closeIconLabel: 'Schließen',
              sections: abschnitte
            }
          }
        }
      }
    });
  }

  var lib = document.createElement('script');
  lib.src = LIB + 'cookieconsent.umd.js';
  lib.onload = start;
  document.head.appendChild(lib);
})();
