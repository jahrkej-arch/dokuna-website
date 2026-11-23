/* Dokuna: YouTube-Video erst nach Klick laden (youtube-nocookie.com). */
(function () {
  document.querySelectorAll('.ytbox[data-yt]').forEach(function (box) {
    var knopf = box.querySelector('button');
    if (!knopf) return;
    knopf.addEventListener('click', function () {
      var id = box.getAttribute('data-yt');
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      var rahmen = document.createElement('div');
      rahmen.className = 'yt-rahmen';
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = box.getAttribute('data-titel') || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      rahmen.appendChild(f);
      box.replaceChildren(rahmen);
    });
  });
})();
