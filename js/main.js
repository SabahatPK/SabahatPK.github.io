// Loaded in <head> (not deferred) so the "js" class is set before the page draws.
// CSS uses it to show JavaScript-only parts (map, Experience toggle) and to collapse Experience.
document.documentElement.classList.add('js');

// Contact form: after a message is sent and the visitor comes back with the browser's
// Back button, clear the fields instead of showing the old message again.
// (Unsent text is kept. The flag lives only in this browser tab and holds no form content.)
var SENT_KEY = 'contactSent';
window.addEventListener('pageshow', function () {
  var form = document.getElementById('contact-form');
  var sent = false;
  try { sent = sessionStorage.getItem(SENT_KEY) === '1'; sessionStorage.removeItem(SENT_KEY); } catch (e) {}
  if (form && sent) form.reset();
});

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function () {
      try { sessionStorage.setItem(SENT_KEY, '1'); } catch (e) {}
    });
  }

  // Phone menu: the "Menu" button opens and closes the links. Choosing a link or pressing Escape closes it.
  var nav = document.querySelector('nav');
  var menuBtn = document.getElementById('menu-btn');
  if (nav && menuBtn) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.textContent = open ? 'Close' : 'Menu';
    };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('ul a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
  }

  // Experience: click/tap/keyboard toggle. Hover expansion is handled in CSS.
  var box = document.getElementById('exp-collapse');
  var btn = document.getElementById('exp-toggle');
  if (!box || !btn) return;
  btn.addEventListener('click', function () {
    var open = box.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    // After "Show less", ignore hover until the mouse leaves, so it actually collapses
    if (!open) box.classList.add('no-hover');
  });
  box.addEventListener('mouseleave', function () {
    box.classList.remove('no-hover');
  });
});
