/* Dokuna: Website-Chat (digitaler Assistent über ElevenLabs).
   Es wird nichts von ElevenLabs geladen, bevor der Besucher auf den Knopf klickt.
   Erst dann kommen Skript und Chatfenster von unpkg.com und elevenlabs.io. */
(function () {
  if (window.__dokunaChat) return;
  window.__dokunaChat = true;
  var AGENT = 'agent_0201m7zs0nv0f5y8h0yeh2jg90nh';
  var SKRIPT = 'https://unpkg.com/@elevenlabs/convai-widget-embed';

  var stil = document.createElement('style');
  stil.textContent =
    '.dk-chat-knopf{position:fixed;right:18px;bottom:18px;z-index:9998;display:flex;align-items:center;gap:.5em;' +
    'background:#0e8477;color:#fff;border:0;border-radius:999px;padding:.8em 1.15em;font:600 15px/1.2 Inter,system-ui,sans-serif;' +
    'box-shadow:0 6px 20px rgba(14,132,119,.28);cursor:pointer;transition:transform .15s,box-shadow .15s}' +
    '.dk-chat-knopf:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(14,132,119,.36)}' +
    '.dk-chat-knopf:focus-visible{outline:3px solid #201f1c;outline-offset:3px}' +
    '.dk-chat-knopf svg{width:20px;height:20px;flex:none}' +
    '.dk-chat-knopf[aria-busy="true"]{opacity:.75;cursor:progress}' +
    '@media (max-width:520px){.dk-chat-knopf{right:12px;bottom:12px;padding:.75em 1em;font-size:14px}}' +
    '@media print{.dk-chat-knopf{display:none}}';
  document.head.appendChild(stil);

  var knopf = document.createElement('button');
  knopf.type = 'button';
  knopf.className = 'dk-chat-knopf';
  knopf.setAttribute('aria-label', 'Chat mit dem digitalen Assistenten von Dokuna öffnen');
  knopf.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg><span>Fragen? Chat</span>';

  function oeffnen() {
    if (knopf.getAttribute('aria-busy') === 'true') return;
    knopf.setAttribute('aria-busy', 'true');
    var w = document.createElement('elevenlabs-convai');
    w.setAttribute('agent-id', AGENT);
    document.body.appendChild(w);
    var s = document.createElement('script');
    s.src = SKRIPT;
    s.async = true;
    s.onload = function () { knopf.remove(); };
    s.onerror = function () {
      knopf.removeAttribute('aria-busy');
      w.remove();
      s.remove();
      knopf.querySelector('span').textContent = 'Chat gerade nicht erreichbar';
    };
    document.head.appendChild(s);
    if (window.umami && typeof window.umami.track === 'function') window.umami.track('Chat geöffnet');
  }
  knopf.addEventListener('click', oeffnen);

  function einsetzen() { document.body.appendChild(knopf); }
  if (document.body) einsetzen(); else document.addEventListener('DOMContentLoaded', einsetzen);
})();
