(function(){
  var d = document, root = d.documentElement;

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Bewusst nur Flaechen und Bilder - Fliesstext bleibt sofort scharf lesbar. */
  var ZIELE = '.karte, .punkt, .preis, .schritt, .stats .s, .karten > a, .cta-block,'
            + ' .leitfrage, .produkt, figure, picture, .zitat .text, .fotokarte, .blatt .tf';

  var el = [].slice.call(d.querySelectorAll(ZIELE)).filter(function(e){
    return !e.closest('header, footer, [data-noreveal], .no-reveal');
  });
  if (!el.length) return;

  el.forEach(function(e){
    e.setAttribute('data-reveal','');
    var g = e.parentElement;
    var pos = [].indexOf.call(g.children, e);
    e.style.transitionDelay = Math.min(pos, 4) * 80 + 'ms';
  });
  root.classList.add('reveal-on');

  var io = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    });
  }, { threshold: .2, rootMargin: '0px 0px -6% 0px' });

  el.forEach(function(e){ io.observe(e); });

  setTimeout(function(){
    el.forEach(function(e){ e.classList.add('is-in'); });
  }, 5000);
})();
