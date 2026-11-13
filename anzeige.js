/* Dokuna: Herkunft „Google-Anzeige“ ohne Cookies und ohne Google-Dienste.
   Kommt jemand über eine Anzeige (Adresse mit ?quelle=ads&kw=Suchbegriff), wird das nur hier im Browser
   in den Text der Anfrage-E-Mail übernommen. Nichts wird gespeichert oder an Dritte gesendet. */
(function () {
  try {
    var p = new URLSearchParams(location.search);
    if (p.get('quelle') !== 'ads') return;
    var kw = (p.get('kw') || '').replace(/[^0-9A-Za-zÄÖÜäöüß \-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
    var zeile = 'Gefunden über: Google-Anzeige' + (kw ? ' (Suchbegriff: ' + kw + ')' : '');
    document.querySelectorAll('a[href^="mailto:info@dokuna.de"]').forEach(function (a) {
      var href = a.getAttribute('href');
      var teile = href.split('?');
      var q = new URLSearchParams(teile[1] || '');
      var betreff = q.get('subject') || 'Anfrage zu Dokuna';
      if (betreff.indexOf('Google-Anzeige') === -1) betreff += ' (Google-Anzeige)';
      var text = q.get('body') || 'Guten Tag,\n';
      if (text.indexOf('Gefunden über:') === -1) text += '\n' + zeile + '\n';
      a.setAttribute('href', teile[0] + '?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(text));
    });
  } catch (e) { /* ohne Wirkung, wenn der Browser URLSearchParams nicht kennt */ }
})();
