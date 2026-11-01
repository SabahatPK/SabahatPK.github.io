// Impact map: highlighted countries open a callout with that item's text.
// Uses the self-hosted d3 7.9.0 and topojson-client 3.1.0 (js/vendor/) and
// world-atlas 2.0.2 country shapes (data/countries-110m.json).
(function () {
  var el = document.getElementById('impact-map');
  var wrap = document.getElementById('map-wrap');
  var callout = document.getElementById('callout');
  var body = document.getElementById('callout-body');
  var list = document.getElementById('impacts');
  var gbox = document.getElementById('global-box');
  if (!el || !wrap || !callout || !body || !list) return;

  function message(text) {
    el.textContent = '';
    var p = document.createElement('p');
    p.className = 'map-fallback';
    p.textContent = text;
    el.appendChild(p);
  }
  // If the map can't load, say so and leave the list visible
  function fail() {
    message('The map could not load, so the details are listed below.');
    if (gbox) gbox.hidden = true;
    list.classList.remove('sr-only');
  }
  if (!window.d3 || !window.topojson) { fail(); return; }
  message('Map loading…');

  var DOMAINS = ['c-connect', 'c-dpi', 'c-climate', 'c-enterprise'];
  // Countries: ISO numeric code -> [item number, domain class, name, longitude, latitude]
  var places = {
    '608': [2, 'c-connect', 'Philippines', 122, 12.5],
    '076': [3, 'c-connect', 'Brazil', -51, -10],
    '646': [4, 'c-dpi', 'Rwanda', 29.9, -2],
    '384': [4, 'c-dpi', "Côte d'Ivoire", -5.5, 7.5],
    '710': [4, 'c-dpi', 'South Africa', 24, -29],
    '694': [5, 'c-climate', 'Sierra Leone', -11.8, 8.5],
    '586': [7, 'c-dpi', 'Pakistan', 69.5, 30],
    '840': [8, 'c-enterprise', 'United States', -98, 39]
  };
  var W = 960, H = 470, pinned = false;

  function item(n) { return list.querySelector('[data-n="' + n + '"]'); }

  // x, y are in map (viewBox) units, or null for a global item (placed above the Global box).
  // place: the country chosen, so the callout's last line names only that country.
  function show(n, x, y, place) {
    var li = item(n);
    if (!li) return;
    // Copy the item's content from the list on this page (static text, no outside input)
    body.textContent = '';
    body.appendChild(li.querySelector(':scope > div').cloneNode(true));
    if (place) {
      var where = body.querySelector('.where');
      var parts = where ? where.textContent.split(' · ') : []; // Domain · Place · Org
      if (parts.length === 3) where.textContent = parts[0] + ' · ' + place + ' · ' + parts[2];
    }
    DOMAINS.forEach(function (c) { callout.classList.toggle(c, li.classList.contains(c)); });
    callout.hidden = false;
    if (window.matchMedia('(max-width: 800px)').matches) { callout.style.left = callout.style.top = ''; return; }
    var s = el.clientWidth / W;
    var cw = callout.offsetWidth, ch = callout.offsetHeight, px, py;
    if (x == null) {
      px = 12; py = gbox.offsetTop - ch - 8;
    } else {
      px = x * s + 16; py = y * s - 20;
      if (px + cw > wrap.clientWidth - 8) px = x * s - cw - 16; // flip to the left
    }
    py = Math.max(8, Math.min(py, el.clientHeight - ch - 8));
    callout.style.left = Math.max(8, px) + 'px';
    callout.style.top = py + 'px';
  }
  function hide() { if (!pinned) callout.hidden = true; }
  function close() { pinned = false; callout.hidden = true; }

  d3.json('data/countries-110m.json').then(function (world) {
    var countries = topojson.feature(world, world.objects.countries).features
      .filter(function (f) { return f.id !== '010'; }); // drop Antarctica
    var proj = d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'FeatureCollection', features: countries });
    var path = d3.geoPath(proj);
    el.textContent = '';
    list.classList.add('sr-only'); // map is working: hide the list visually, keep it for screen readers
    var svg = d3.select(el).append('svg').attr('viewBox', '0 0 ' + W + ' ' + H).attr('aria-hidden', 'true');
    svg.selectAll('path').data(countries).join('path')
      .attr('class', function (d) { return 'country' + (places[d.id] ? ' hl ' + places[d.id][1] : ''); })
      .attr('d', path);
    // Dots make small countries (Rwanda, Sierra Leone) easy to hover and tap
    var dots = Object.keys(places).map(function (id) { return [id].concat(places[id]); });
    svg.selectAll('circle.dot').data(dots).join('circle')
      .attr('class', function (d) { return 'dot ' + d[2]; })
      .attr('r', 6)
      .attr('cx', function (d) { return proj([d[4], d[5]])[0]; })
      .attr('cy', function (d) { return proj([d[4], d[5]])[1]; });

    function info(d) { return places[d.id] || (d[0] && places[d[0]]); }
    function at(p) { return proj([p[3], p[4]]); }
    svg.selectAll('.country.hl, circle.dot')
      .on('mouseenter', function (e, d) { if (pinned) return; var p = info(d), xy = at(p); show(p[0], xy[0], xy[1], p[2]); })
      .on('mouseleave', hide)
      .on('click', function (e, d) { var p = info(d), xy = at(p); pinned = true; show(p[0], xy[0], xy[1], p[2]); e.stopPropagation(); });
  }).catch(fail);

  document.querySelectorAll('.global-btn').forEach(function (b) {
    b.addEventListener('mouseenter', function () { if (!pinned) show(+b.dataset.n, null, null); });
    b.addEventListener('mouseleave', hide);
    b.addEventListener('click', function (e) { pinned = true; show(+b.dataset.n, null, null); e.stopPropagation(); });
  });
  document.getElementById('callout-close').addEventListener('click', close);
  callout.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
