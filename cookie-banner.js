/* Dokuna – Cookie-Banner (CookieConsent 3.3.0, MIT, lokal unter /vendor/cookieconsent-3.3.0/).
   Google Ads wird erst geladen, wenn
   1. unten eine Conversion-ID eingetragen ist und
   2. die Person der Kategorie „Werbung“ zugestimmt hat.
   Solange GOOGLE_ADS_ID leer ist, lädt die Seite nichts von Google. */
(function () {
  var GOOGLE_ADS_ID = ''; // später z. B. 'AW-123456789' eintragen
  var UMAMI_ID = '9f432958-acad-4e71-b5aa-e869678e8c0d'; // Umami Cloud, Region EU, Konto jonas@dokuna.de

  function umamiLaden() {
    if (!UMAMI_ID || window.__dokunaUmami) return;
    window.__dokunaUmami = true;
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://cloud.umami.is/script.js';
    s.setAttribute('data-website-id', UMAMI_ID);
    s.setAttribute('data-domains', 'dokuna.de,www.dokuna.de');
    document.head.appendChild(s);
  }

  function gtagLaden() {
    if (!GOOGLE_ADS_ID || window.__dokunaGtag) return;
    window.__dokunaGtag = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GOOGLE_ADS_ID);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GOOGLE_ADS_ID);
  }

  function zustimmungSetzen() {
    var werbung = CookieConsent.acceptedCategory('werbung');
    gtag('consent', 'update', {
      ad_storage: werbung ? 'granted' : 'denied',
      ad_user_data: werbung ? 'granted' : 'denied',
      ad_personalization: werbung ? 'granted' : 'denied'
    });
    if (werbung) gtagLaden();
    if (CookieConsent.acceptedCategory('statistik')) umamiLaden();
  }

  // Banner an den Anfang der Seite stellen, damit er mit der Tab-Taste zuerst erreichbar ist
  function nachVorn() {
    var m = document.getElementById('cc-main');
    if (m && document.body.firstElementChild !== m) document.body.insertBefore(m, document.body.firstChild);
  }

  CookieConsent.run({
    revision: 1,
    guiOptions: {
      consentModal: { layout: 'box wide', position: 'bottom left', equalWeightButtons: true, flipButtons: false },
      preferencesModal: { layout: 'box', equalWeightButtons: true, flipButtons: false }
    },
    cookie: { name: 'dokuna_einwilligung', expiresAfterDays: 182, sameSite: 'Lax' },
    categories: {
      notwendig: { enabled: true, readOnly: true },
      statistik: {},
      werbung: {
        autoClear: { cookies: [{ name: /^_gcl_/ }, { name: /^_gac_/ }] }
      }
    },
    onFirstConsent: zustimmungSetzen,
    onConsent: zustimmungSetzen,
    onChange: zustimmungSetzen,
    onModalReady: function () { setTimeout(nachVorn, 0); },
    language: {
      default: 'de',
      translations: {
        de: {
          consentModal: {
            title: 'Cookies auf dokuna.de',
            description: 'Ohne Ihre Zustimmung nutzen wir nur technisch notwendige Cookies. Mit Zustimmung zählen wir außerdem Besucher und messen, ob unsere Google-Anzeigen zu Anfragen führen. Ändern können Sie das jederzeit unter „Cookie-Einstellungen“ unten auf der Seite.',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur notwendige',
            showPreferencesBtn: 'Einstellungen',
            footer: '<a href="/datenschutz/">Datenschutz</a> <a href="/impressum/">Impressum</a>'
          },
          preferencesModal: {
            title: 'Cookie-Einstellungen',
            acceptAllBtn: 'Alle akzeptieren',
            acceptNecessaryBtn: 'Nur notwendige',
            savePreferencesBtn: 'Auswahl speichern',
            closeIconLabel: 'Schließen',
            sections: [
              {
                description: 'Hier legen Sie fest, welche Cookies dokuna.de verwenden darf. Ihre Wahl gilt für sechs Monate und lässt sich jederzeit ändern.'
              },
              {
                title: 'Technisch notwendig <span class="pm__badge">Immer aktiv</span>',
                description: 'Speichert nur Ihre Auswahl in diesem Fenster (Cookie „dokuna_einwilligung“). Ohne dieses Cookie würde die Frage bei jedem Besuch neu erscheinen.',
                linkedCategory: 'notwendig'
              },
              {
                title: 'Statistik',
                description: 'Umami zählt ohne Cookies, wie viele Besucher kommen, welche Seiten sie ansehen und woher sie kommen. Wir sehen nur Zahlen, nie wer Sie sind. Anbieter ist die Umami Software, Inc. Die Daten liegen auf Servern in der EU.',
                linkedCategory: 'statistik'
              },
              {
                title: 'Werbung',
                description: 'Google Ads misst, ob jemand nach einem Klick auf eine Dokuna-Anzeige eine Vorführung anfragt. Anbieter ist die Google Ireland Limited. Dabei können Daten in die USA übertragen werden. Ohne Zustimmung wird Google Ads nicht geladen.',
                linkedCategory: 'werbung'
              },
              {
                title: 'Mehr Informationen',
                description: 'Einzelheiten finden Sie in der <a href="/datenschutz/">Datenschutzerklärung</a>. Fragen beantworten wir gern unter <a href="mailto:info@dokuna.de">info@dokuna.de</a>.'
              }
            ]
          }
        }
      }
    }
  });
})();
