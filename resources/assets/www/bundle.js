window.__SP_MODULES={};
window.__SP_MODULES["main.js"]=function(module,exports,require){

var VERSION = "2.0";
var Lib = require("scripts/library.js");
var Tags = require("scripts/tags.js");
var STEP = Lib.STEP;
function clean(v, fallback) { v = v == null ? "" : String(v).trim(); return v || fallback; }


var REMOVED = [];
try { REMOVED = storage.get("removed") || []; } catch (e) {}
var T = Lib.tracks.filter(function (t) { return REMOVED.indexOf(t.file) < 0; }).map(function (t) {
  t.title = clean(t.title, "Unknown Song"); t.artist = clean(t.artist, "Unknown Artist"); t.album = clean(t.album, "Unknown Album");
  return t;
});




var IMP_DIR = "songs/";
var ARTDIM = {}, BADART = {};
function impTrack(rel, o) {
  o = o || {};
  var name = String(rel).split("/").pop().replace(/\.[^.]+$/, ""), title = name, artist = "";
  var d = name.indexOf(" - ");
  if (d > 0 && d < name.length - 3) { artist = name.substr(0, d); title = name.substr(d + 3); }
  var t = { imp: true, rel: rel, path: "files/" + rel, title: clean(o.title, title), artist: clean(o.artist, artist || "Unknown Artist"),
           album: clean(o.album, "Imported"), dur: o.dur > 0 ? o.dur : 0, tg: o.tg ? 1 : 0 };
  if (o.genre) t.genre = o.genre;
  try {
    if (o.artRel && o.aw > 0 && o.ah > 0 && files.exists(o.artRel)) {
      t.artRel = o.artRel; t.art = "files/" + o.artRel; t.aw = o.aw; t.ah = o.ah; ARTDIM[t.art] = [o.aw, o.ah];
    }
  } catch (e) {}
  return t;
}
function saveImported() {
  try { storage.set("imported", T.filter(function (t) { return t.imp; }).map(function (t) { return { rel: t.rel, title: t.title, artist: t.artist, album: t.album, genre: t.genre, dur: t.dur, tg: t.tg, artRel: t.artRel, aw: t.aw, ah: t.ah }; })); } catch (e) {}
}
(function () {
  var rows = [];
  try { rows = storage.get("imported") || []; } catch (e) {}
  rows.forEach(function (r) {
    try { if (r && r.rel && files.exists(r.rel)) T.push(impTrack(r.rel, r)); } catch (e) {}
  });
})();
function stepOf(t) { return t.step || STEP; }
var DEF_ART = "assets/art/default.png", ART_PX = 176;
function artOf(x) { return (x && x.art && !BADART[x.art]) ? x.art : DEF_ART; }
function artBox(path) {
  var d = ARTDIM[path];
  if (!d) return [0, 0, ART_PX, ART_PX];
  var q = Math.min(d[0], d[1]);
  return [(d[0] - q) / 2, (d[1] - q) / 2, q, q];
}
function img(c, path, x, y, w, h, a, src) {
  if (ARTDIM[path]) {
    try { c.image(path, x, y, w, h, a == null ? 1 : a, src || artBox(path)); return; }
    catch (e) { BADART[path] = 1; path = DEF_ART; src = null; }
  }
  if (src) c.image(path, x, y, w, h, a == null ? 1 : a, src); else c.image(path, x, y, w, h);
}




var W = 320, H = UIScreen.height;
var LCD_X = 11, LCD_W = 298, BORDER = 2, LW = LCD_W - 2 * BORDER;
var HEAD = 18, ROW = 22;
var R = 99, BR = 39, STEPRAD = 0.3;
var TOP = Math.max(16, Math.min(30, Math.round(H * 0.04)));
var LCD_H = Math.max(176, Math.min(264, H - TOP - 2 * R - 44));
var LH = LCD_H - 2 * BORDER, VIS = Math.floor((LH - HEAD) / ROW);
var LCD_BOT = TOP + LCD_H;
var WCY = Math.max(LCD_BOT + 20 + R, Math.min(Math.round(LCD_BOT + (H - LCD_BOT) * 0.45), H - 20 - R));
var WY = WCY - R;


var DEFAULTS = { frame: "#cecece", wheel: "#f8fbfd", repeat: 0, shuffle: false, volume: 0.7, font: "ipod" };
function isHex(s) { return typeof s === "string" && /^#[0-9a-fA-F]{6}$/.test(s); }
var prefs = (function () {
  var s = storage.get("prefs") || {}, p = Object.assign({}, DEFAULTS, s);
  if (!isHex(s.frame) && s.theme === "black") { p.frame = "#1c1c1e"; p.wheel = "#38383b"; }
  if (!isHex(p.frame)) p.frame = DEFAULTS.frame;
  if (!isHex(p.wheel)) p.wheel = DEFAULTS.wheel;
  p.frame = p.frame.toLowerCase(); p.wheel = p.wheel.toLowerCase();
  if (p.font !== "system") p.font = "ipod";
  delete p.theme;
  return p;
})();
function save() { try { storage.set("prefs", prefs); } catch (e) {} }

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function rgbOf(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
function hexOf(a) {
  return "#" + a.map(function (v) { v = clamp(Math.round(v), 0, 255); return (v < 16 ? "0" : "") + v.toString(16); }).join("");
}
function lum(h) { var c = rgbOf(h); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
function shade(h, k) {
  var c = rgbOf(h), t = k < 0 ? 0 : 255, a = Math.abs(k);
  return hexOf(c.map(function (v) { return v + (t - v) * a; }));
}
function wheelInk() {
  var l = lum(prefs.wheel);
  if (l > 0.9) return "#99a2ae";
  return l > 0.6 ? shade(prefs.wheel, -0.42) : "#ffffff";
}

var SWATCHES = [
  ["Silver", "#cecece"], ["White", "#ffffff"], ["Black", "#1f1f1f"], ["Graphite", "#6b6b6e"],
  ["Red", "#df303b"], ["Orange", "#f2892b"], ["Yellow", "#f4d03f"], ["Green", "#4cb862"],
  ["Teal", "#34b3b0"], ["Blue", "#2f7fd8"], ["Purple", "#8a5cd0"], ["Pink", "#f08cb1"]
];
var PRESETS = [
  ["Silver", "#cecece", "#f8fbfd"], ["Classic Black", "#434245", "#181919"], ["Black & Red", "#1f1f1f", "#df303b"], ["White", "#ffffff", "#6b6b6e"],
  ["Black", "#1c1c1e", "#38383b"], ["Pink", "#f6b3cc", "#ffffff"], ["Blue", "#86b6e8", "#ffffff"],
  ["Green", "#9fd9a6", "#ffffff"], ["Orange", "#f6a85c", "#ffffff"]
];





var IF = null;
try { IF = require("scripts/ipodfont.js"); } catch (e) { console.warn("ipod font unavailable: " + e); }
function fontFor(size, bold) {
  if (!IF || prefs.font === "system") return null;
  var w = bold ? "b" : "r", list = IF.sizes[w], best = -1, bd = 1e9;
  for (var i = 0; i < list.length; i++) { var d = Math.abs(list[i] - size); if (d < bd) { bd = d; best = list[i]; } }
  if (best < 0 || bd > 3) return null;
  return { key: w + best, k: size / best / IF.S, set: IF.f[w + best] };
}
function inkFor(col) {
  var h = String(col || "#000000"), a = 1;
  if (h.length === 4) h = "#" + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2) + h.charAt(3) + h.charAt(3);
  if (h.length === 9) { a = parseInt(h.substr(7, 2), 16) / 255; h = h.substr(0, 7); }
  var c = rgbOf(h);
  if (c[2] > 150 && c[0] < 90 && c[1] < 140) return ["u", a];
  var l = lum(h);
  return l >= 0.7 ? ["w", a * l] : ["k", a * (1 - l)];
}
function glyphRun(str, fk) {
  var G = fk.set.g, adv = [], tot = 0;
  for (var i = 0; i < str.length; i++) {
    var g = G[str.charAt(i)]; if (!g) return null;
    var a = g[6] * fk.k; adv.push(a); tot += a;
  }
  return { adv: adv, tot: tot };
}
function fmeasure(str, o) {
  o = o || {}; str = String(str);
  var fk = fontFor(o.size || 12, !!o.bold), r = fk && glyphRun(str, fk);
  return r ? r.tot : UIFont.measure(str, o);
}
function ctext(c, str, x, y, o) {
  o = o || {}; str = String(str);
  var fk = fontFor(o.size || 12, !!o.bold), run = fk && glyphRun(str, fk), ink = fk && inkFor(o.color);
  if (!run || fk.set.k.indexOf(ink[0]) < 0) { c.text(str, x, y, o); return; }
  var G = fk.set.g, adv = run.adv, tot = run.tot;
  if (o.maxWidth && tot > o.maxWidth) {
    if (!G["\u2026"]) { c.text(str, x, y, o); return; }
    var ew = G["\u2026"][6] * fk.k, n = 0, acc = 0;
    while (n < str.length && acc + adv[n] + ew <= o.maxWidth) { acc += adv[n]; n++; }
    str = str.substr(0, n) + "\u2026"; adv = adv.slice(0, n); adv.push(ew); tot = acc + ew;
  }
  var px = o.align === "center" ? x - tot / 2 : (o.align === "right" ? x - tot : x);
  var path = "assets/f/" + fk.key + ink[0] + ".png", k = fk.k;
  for (var i = 0; i < str.length; i++) {
    var g = G[str.charAt(i)];
    if (g[2]) c.image(path, px + g[4] * k, y + g[5] * k, g[2] * k, g[3] * k, ink[1], [g[0], g[1], g[2], g[3]]);
    px += adv[i];
  }
}

function pad2(n) { return (n < 10 ? "0" : "") + n; }
function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + pad2(s % 60); }
function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
  return a;
}
function allIdx() { return T.map(function (_, i) { return i; }); }
function cmp(a, b) { a = String(a).toLowerCase(); b = String(b).toLowerCase(); return a < b ? -1 : a > b ? 1 : 0; }


var cur = -1, queue = [], qi = 0, pos = 0, playing = false, lastTick = Date.now(), vol = prefs.volume;
var mode = "menu", scrub = false, scrubPos = 0, scrubAt = 0, volUntil = 0;
UIMusic.volume = vol;

UIMusic.onEnd = function () {
  if (playing && cur >= 0 && T[cur].path && T[cur].dur > 0 && pos > T[cur].dur - 3) advance(true);
};
function tailPath(t, k) { return t.file + "_" + pad2(k) + ".mp3"; }
function playFrom(sec) {
  var t = T[cur];
  if (t.path) {
    pos = clamp(sec, 0, Math.max(0, t.dur - 0.05));
    try { UIMusic.volume = vol; UIMusic.play(t.path, false); if (pos > 0) UIMusic.seek(pos); playing = true; }
    catch (e) { console.error("play failed: " + e); playing = false; }
    lastTick = Date.now();
    return;
  }
  var st = stepOf(t), k = clamp(Math.floor(sec / st), 0, t.steps - 1);
  pos = k * st;
  try { UIMusic.volume = vol; UIMusic.play(tailPath(t, k), false); playing = true; }
  catch (e) { console.error("play failed: " + e); playing = false; }
  lastTick = Date.now();
}
function startTrack(i) { cur = i; rev++; playFrom(0); }
function stopAll() { UIMusic.stop(); playing = false; pos = 0; }
function playList(list, n, keepOrder) {
  if (!list.length) return;
  queue = list.slice(); qi = n;
  if (prefs.shuffle && !keepOrder) {
    var first = queue[n];
    queue = [first].concat(shuffle(queue.filter(function (_, k) { return k !== n; })));
    qi = 0;
  }
  startTrack(queue[qi]);
}
function advance(auto) {
  if (auto && prefs.repeat === 1) { playFrom(0); return; }
  if (qi + 1 < queue.length) { qi++; startTrack(queue[qi]); }
  else if (prefs.repeat === 2) { qi = 0; startTrack(queue[0]); }
  else if (auto) { stopAll(); }
  else { playFrom(0); }
}
function nextTrack() { if (cur >= 0) advance(false); }
function prevTrack() {
  if (cur < 0) return;
  if (pos > 3) playFrom(0);
  else if (qi > 0) { qi--; startTrack(queue[qi]); }
  else if (prefs.repeat === 2) { qi = queue.length - 1; startTrack(queue[qi]); }
  else playFrom(0);
}
function togglePlay() {
  if (cur < 0) { playList(allIdx(), 0); return; }
  if (playing) { UIMusic.stop(); playing = false; } else playFrom(pos);
}
function seekTo(s) {
  if (T[cur].path) {
    pos = clamp(s, 0, Math.max(0, T[cur].dur - 0.05));
    if (playing) { try { UIMusic.seek(pos); } catch (e) { playFrom(pos); } }
    return;
  }
  var st = stepOf(T[cur]), k = clamp(Math.round(s / st), 0, T[cur].steps - 1);
  pos = k * st;
  if (playing) playFrom(pos);
}
function commitScrub() { scrub = false; if (cur >= 0) seekTo(scrubPos); }







var cfIdx = 0, cfPos = 0, CF_RATE = 22;
var page = null;
var clock = new UIGameView({ frame: [0, 0, 1, 1], background: null, running: false, fps: 120 });
var lastFrame = 0, fbT = null, fbLast = 0;
function slideIn(dx) {
  if (!page) return;
  page.transform = { translateX: dx };
  UIView.animate({ duration: 0.3, curve: "easeOut" }, function () { page.transform = null; });
}







var tr = null, PANEL_W = 143;
var TR = { slide: 0.3,
  tot: 0.84,
  h0: 0, h: 0.15,
  p0: 0.04, p: 0.32,
  l0: 0.04, l: 0.32,
  f0: 0.20, f: 0.40, zoom0: 0.8,
  r0: 0.62, r: 0.16 };
function trE() { return tr ? (Date.now() - tr.t0) / 1000 : 99; }
function easeOut(u) { u = clamp(u, 0, 1); return 1 - (1 - u) * (1 - u); }
function easeIn(u) { u = clamp(u, 0, 1); return Math.pow(u, 2.2); }
function startTr(kind) { tr = { kind: kind, t0: Date.now() }; wake(); }

function startSlide(kind, old) { if (!old) return; tr = { kind: kind, t0: Date.now(), old: old }; wake(); }
function needFrames() { return !!tr || cfPos !== cfIdx || (mode === "stopwatch" && sw.run) || (mode === "game" && !!game && game.live); }
function step(dt) {
  if (tr && trE() > ((tr.kind === "in" || tr.kind === "out") ? TR.tot : TR.slide) + 0.03) tr = null;
  if (mode === "game" && game) game.update(dt);
  if (cfPos !== cfIdx) {
    cfPos += (cfIdx - cfPos) * (1 - Math.exp(-CF_RATE * dt));
    if (Math.abs(cfIdx - cfPos) < 0.01) cfPos = cfIdx;
  }
}
clock.update = function (dt) {
  lastFrame = Date.now();
  step(dt);
  if (!needFrames()) clock.running = false;
};
function wake() {
  lastFrame = Date.now();
  clock.running = true;
  if (fbT) return;
  fbLast = Date.now();
  fbT = setInterval(function () {
    var now = Date.now(), dt = Math.min((now - fbLast) / 1000, 0.1);
    fbLast = now;
    if (now - lastFrame > 80) step(dt);
    if (!needFrames()) { clearInterval(fbT); fbT = null; }
  }, 16);
}


var sw = { run: false, acc: 0, t0: 0 };
var game = null;
function swTime() { return sw.acc + (sw.run ? (Date.now() - sw.t0) / 1000 : 0); }
function swToggle() { if (sw.run) { sw.acc = swTime(); sw.run = false; } else { sw.t0 = Date.now(); sw.run = true; wake(); } }

setInterval(function () {
  var now = Date.now(), dt = Math.min((now - lastTick) / 1000, 0.5);
  lastTick = now;
  if (playing && cur >= 0) {
    var ct = T[cur];
    if (ct.path) {
      var d = UIMusic.duration;
      if (d > 0 && Math.abs(d - ct.dur) > 0.5) { ct.dur = d; saveImported(); }
    }
    pos += dt;
    if (ct.dur > 0 && pos >= ct.dur) advance(true);
  }
  if (scrub && now - scrubAt > 2500) commitScrub();
}, 200);


var albums = [], byTitle = [];
function buildLibrary() {
  var seen = {};
  albums.length = 0; byTitle.length = 0;
  T.forEach(function (t, i) {
    var k = t.artist + "\u0001" + t.album;
    if (!seen[k]) { seen[k] = { name: t.album, artist: t.artist, art: artOf(t), idx: [] }; albums.push(seen[k]); }
    else if (seen[k].art === DEF_ART && artOf(t) !== DEF_ART) seen[k].art = artOf(t);
    seen[k].idx.push(i);
  });
  albums.sort(function (a, b) { return cmp(a.artist, b.artist) || cmp(a.name, b.name); });
  allIdx().sort(function (a, b) { return cmp(T[a].title, T[b].title); }).forEach(function (i) { byTitle.push(i); });
}
buildLibrary();


var stack = [];
function top() { return stack[stack.length - 1]; }

var rev = 0;
function menuItems(m) { if (!m._i || m._r !== rev) { m._i = m.make(); m._r = rev; } return m._i; }
function push(m) { var prev = stack.length ? top() : null; m.sel = 0; m.top = 0; rev++; stack.push(m); startSlide("push", prev); }
function openNP() { if (cur >= 0) { mode = "np"; scrub = false; } }

function songsMenu(title, idx) {
  return { title: title, panel: true, make: function () {
    if (!idx.length) return [{ label: "No Songs" }];
    return idx.map(function (ti, n) {
      return { label: T[ti].title, art: artOf(T[ti]), info: [T[ti].title, T[ti].artist], playing: ti === cur, go: function () { playList(idx, n); openNP(); } };
    });
  } };
}
function albumsMenu() {
  return { title: "Albums", panel: true, make: function () {
    if (!albums.length) return [{ label: "No Songs" }];
    return albums.map(function (a) { return { label: a.name, sub: true, art: a.art, info: [a.name, a.artist], go: function () { push(songsMenu(a.name, a.idx)); } }; });
  } };
}
function groupMenu(title, key) {
  return { title: title, panel: true, make: function () {
    var seen = {}, names = [];
    T.forEach(function (t) { if (t[key] && !seen[t[key]]) { seen[t[key]] = 1; names.push(t[key]); } });
    names.sort(cmp);
    if (!names.length) return [{ label: "No Songs" }];
    return names.map(function (n) {
      var idx = allIdx().filter(function (i) { return T[i][key] === n; });
      return { label: n, sub: true, art: artOf(T[idx[0]]), info: [n, idx.length + (idx.length === 1 ? " song" : " songs")], go: function () { push(songsMenu(n, idx)); } };
    });
  } };
}
function openCoverFlow() {
  mode = "cf"; cfIdx = clamp(cfIdx, 0, Math.max(0, albums.length - 1)); cfPos = cfIdx;
  startTr("in");
}


var ed = null;
function openEditor(key) { ed = { key: key, ch: 0, rgb: rgbOf(prefs[key]) }; mode = "rgb"; }
function editorApply() { prefs[ed.key] = hexOf(ed.rgb); }
function editorDone() { if (ed) { editorApply(); save(); } ed = null; mode = "menu"; rev++; }

function colorMenu(key) {
  return { title: key === "frame" ? "Frame Color" : "Wheel Color", make: function () {
    var now = prefs[key], found = false;
    var rows = SWATCHES.map(function (s) {
      var on = s[1] === now; if (on) found = true;
      return { label: s[0], swatch: s[1], check: on, go: function () { prefs[key] = s[1]; save(); } };
    });
    rows.push({ label: "Custom", swatch: found ? null : now, check: !found, go: function () { openEditor(key); } });
    return rows;
  } };
}
function presetsMenu() {
  return { title: "Theme", make: function () {
    return PRESETS.map(function (p) {
      return { label: p[0], swatch: p[1], check: prefs.frame === p[1] && prefs.wheel === p[2],
               go: function () { prefs.frame = p[1]; prefs.wheel = p[2]; save(); } };
    });
  } };
}

var musicMenu = { title: "Music", panel: true, make: function () {
  return [
    { label: "Cover Flow", sub: true, go: openCoverFlow },
    { label: "Artists", sub: true, go: function () { push(groupMenu("Artists", "artist")); } },
    { label: "Albums", sub: true, go: function () { push(albumsMenu()); } },
    { label: "Songs", sub: true, go: function () { push(songsMenu("Songs", byTitle)); } },
    { label: "Genres", sub: true, go: function () { push(groupMenu("Genres", "genre")); } },
    { label: "Import Files", go: importFiles },
    { label: "Delete Songs", red: true, sub: true, go: function () { push(deleteMenu); } }
  ];
} };
var importing = false;
function importAlert(title, msg) { try { UIAlertView.show({ title: title, message: msg, buttons: ["OK"] }, function () {}); } catch (e) { console.error(title + ": " + msg); } }
function importFiles() {
  if (importing) return;
  importing = true;
  try {
    files.import({ types: ["audio/*"], multiple: true, to: IMP_DIR }, function (paths, error) {
      importing = false;
      if (error) { importAlert("Import Failed", String(error)); return; }
      if (!paths || !paths.length) return;
      var added = paths.map(function (rel) { var t = impTrack(rel); T.push(t); return t; }), left = added.length;
      saveImported(); buildLibrary(); rev++;
      added.forEach(function (t) {
        queueScan(t, function () {
          if (--left > 0) return;
          importAlert("Import Complete", added.length + (added.length === 1 ? " song" : " songs") + " added to Songs.");
        });
      });
    });
  } catch (e) { importing = false; importAlert("Import Failed", String(e)); }
}


var scanQ = [], scanning = false;
function hash(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0; return h.toString(16); }
function queueScan(t, cb) {
  scanQ.push({ t: t, cb: cb });
  if (!scanning) { scanning = true; setTimeout(scanNext, 40); }
}
function scanNext() {
  var job = scanQ.shift();
  if (!job) { scanning = false; return; }
  readTags(job.t, function () { try { if (job.cb) job.cb(); } catch (e) { console.error("scan cb: " + e); } setTimeout(scanNext, 30); });
}
function readTags(t, done) {
  var r = null;
  if (T.indexOf(t) < 0) return done();
  try { if (files.exists(t.rel)) r = Tags.scan(files.readBase64(t.rel)); } catch (e) { console.error("tags " + t.rel + ": " + e); }
  if (r) {
    if (r.title) t.title = r.title;
    if (r.artist || r.albumartist) t.artist = r.artist || r.albumartist;
    if (r.album) t.album = r.album;
    if (r.genre) t.genre = r.genre;
  }
  t.tg = 1;
  function finish() { if (T.indexOf(t) >= 0) { saveImported(); buildLibrary(); rev++; } done(); }
  if (r && r.pic && !t.art) savePic(t, r.pic, finish); else finish();
}
function savePic(t, pic, cb) {
  var rel = "art/" + String(t.rel).replace(/^.*\//, "").replace(/[^A-Za-z0-9]+/g, "_").substr(0, 40) + "_" + hash(t.rel) + "." + pic.ext, at = 0, CHUNK = 49152;
  function drop() { try { files.remove(rel); } catch (e) {} }
  try { files.mkdir("art"); drop(); } catch (e) { return cb(); }
  (function next() {
    if (T.indexOf(t) < 0) { drop(); return cb(); }
    try { files.appendBase64(rel, pic.chunk(at, CHUNK)); } catch (e) { console.error("cover: " + e); drop(); return cb(); }
    at += CHUNK;
    if (at < pic.len) { setTimeout(next, 0); return; }
    t.artRel = rel; t.art = "files/" + rel; t.aw = pic.w; t.ah = pic.h; ARTDIM[t.art] = [pic.w, pic.h];
    cb();
  })();
}


function removeTrack(i) {
  var t = T[i];
  if (!t) return;
  if (t.imp) {
    try { files.remove(t.rel); } catch (e) {}
    if (t.artRel) { try { files.remove(t.artRel); } catch (e) {} }
  } else if (t.file) {
    REMOVED.push(t.file);
    try { storage.set("removed", REMOVED); } catch (e) {}
  }
  if (cur === i) { stopAll(); cur = -1; } else if (cur > i) cur--;
  queue = queue.filter(function (q) { return q !== i; }).map(function (q) { return q > i ? q - 1 : q; });
  if (cur >= 0) { qi = queue.indexOf(cur); if (qi < 0) { queue = [cur]; qi = 0; } } else { queue = []; qi = 0; }
  T.splice(i, 1);
  saveImported(); buildLibrary();
  cfIdx = clamp(cfIdx, 0, Math.max(0, albums.length - 1)); cfPos = cfIdx;
  rev++;
}
function confirmDelete(t) {
  try {
    UIAlertView.show({ title: "Delete Song", message: "\u201C" + t.title + "\u201D will be removed from SpringPod.", buttons: ["Cancel", "Delete"] }, function (b) {
      if (b !== 1) return;
      var k = T.indexOf(t);
      if (k < 0) return;
      removeTrack(k);
      var n = menuItems(deleteMenu).length;
      deleteMenu.sel = clamp(deleteMenu.sel, 0, Math.max(0, n - 1));
      deleteMenu.top = clamp(deleteMenu.top, 0, Math.max(0, n - VIS));
      if (deleteMenu.sel < deleteMenu.top) deleteMenu.top = deleteMenu.sel;
      if (deleteMenu.sel >= deleteMenu.top + VIS) deleteMenu.top = deleteMenu.sel - VIS + 1;
    });
  } catch (e) { importAlert("Delete Failed", String(e)); }
}
var deleteMenu = { title: "Delete Songs", panel: true, make: function () {
  var idx = allIdx().sort(function (a, b) { return cmp(T[a].title, T[b].title); });
  if (!idx.length) return [{ label: "No Songs" }];
  return idx.map(function (ti) {
    var t = T[ti];
    return { label: t.title, art: artOf(t), info: [t.title, t.artist], playing: ti === cur, go: function () { confirmDelete(t); } };
  });
} };

var extrasMenu = { title: "Extras", make: function () {
  return [
    { label: "Clocks", sub: true, go: function () { mode = "clock"; } },
    { label: "Games", sub: true, go: function () { push(gamesMenu); } },
    { label: "Stopwatch", sub: true, go: function () { mode = "stopwatch"; if (sw.run) wake(); } }
  ];
} };
function openGame(make) { game = make(); game.start(); mode = "game"; wake(); }
var gamesMenu = { title: "Games", make: function () {
  if (!GM) return [{ label: "Games unavailable" }];
  return GM.list.map(function (e) { return { label: e[0], sub: true, go: function () { openGame(e[1]); } }; });
} };
var aboutMenu = { title: "About", make: function () {
  var mins = Math.round(T.reduce(function (s, t) { return s + t.dur; }, 0) / 60);
  var rows = [{ label: "SpringPod " + VERSION }, { label: "Songs", val: String(T.length) }, { label: "Albums", val: String(albums.length) }, { label: "Play time", val: mins + " min" }];
  if (!T.length) rows.push({ label: "Add songs: Music > Import Files" });
  return rows;
} };
var settingsMenu = { title: "Settings", make: function () {
  return [
    { label: "Shuffle", val: prefs.shuffle ? "Songs" : "Off", go: function () { prefs.shuffle = !prefs.shuffle; save(); } },
    { label: "Repeat", val: ["Off", "One", "All"][prefs.repeat], go: function () { prefs.repeat = (prefs.repeat + 1) % 3; save(); } },
    { label: "Font", val: prefs.font === "system" ? "System" : "iPod", go: function () { prefs.font = prefs.font === "system" ? "ipod" : "system"; save(); } },
    { label: "Theme", sub: true, go: function () { push(presetsMenu()); } },
    { label: "Frame Color", sub: true, swatch: prefs.frame, go: function () { push(colorMenu("frame")); } },
    { label: "Wheel Color", sub: true, swatch: prefs.wheel, go: function () { push(colorMenu("wheel")); } },
    { label: "About", sub: true, go: function () { push(aboutMenu); } },
    { label: "Reset Settings", go: function () { prefs = Object.assign({}, DEFAULTS); vol = prefs.volume; UIMusic.volume = vol; save(); } }
  ];
} };


var SP_CLIENT_ID = "f2d712b364c74b8fbbe52deccda33afd";
var SP_REDIRECT = "https://appassets.local/index.html";
var SP_SCOPES = "playlist-read-private playlist-read-collaborative user-library-read";
var SP = {};
function spRefresh() { rev++; try { wake(); } catch (e) {} }
function spTok() { return storage.get("sp_tok"); }
function spLoggedIn() { var t = spTok(); return !!(t && (t.refresh || t.exp > Date.now())); }
function b64url(buf) { var s = ""; new Uint8Array(buf).forEach(function (b) { s += String.fromCharCode(b); }); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function spRand(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return b64url(a); }
function spForm(o) { return Object.keys(o).map(function (k) { return k + "=" + encodeURIComponent(o[k]); }).join("&"); }
function spLogin() {
  if (!SP_CLIENT_ID || SP_CLIENT_ID.indexOf("YOUR_") === 0) { importAlert("Spotify Setup", "No Spotify Client ID is set in this build yet."); return; }
  try {
    var ver = spRand(64), st = spRand(16);
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(ver)).then(function (h) {
      storage.set("sp_auth", { v: ver, s: st });
      location.href = "https://accounts.spotify.com/authorize?response_type=code&client_id=" + encodeURIComponent(SP_CLIENT_ID) + "&scope=" + encodeURIComponent(SP_SCOPES) + "&redirect_uri=" + encodeURIComponent(SP_REDIRECT) + "&state=" + st + "&code_challenge_method=S256&code_challenge=" + b64url(h);
    }).catch(function (e) { importAlert("Spotify", "Login unavailable: " + e); });
  } catch (e) { importAlert("Spotify", "Login unavailable: " + e); }
}
function spTokenReq(body) {
  return fetch("https://accounts.spotify.com/api/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
    .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error_description || j.error || ("HTTP " + r.status)); return j; }); })
    .then(function (j) { var old = spTok() || {}; storage.set("sp_tok", { access: j.access_token, refresh: j.refresh_token || old.refresh, exp: Date.now() + (j.expires_in - 60) * 1000 }); return j; });
}
(function spCallback() {
  var q = location.search; if (!q || (q.indexOf("code=") < 0 && q.indexOf("error=") < 0)) return;
  var P = {}; q.slice(1).split("&").forEach(function (kv) { var i = kv.indexOf("="); if (i > 0) P[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, " ")); });
  try { history.replaceState(null, "", location.pathname); } catch (e) {}
  var a = storage.get("sp_auth"); storage.remove("sp_auth");
  if (P.error) { setTimeout(function () { importAlert("Spotify", "Login cancelled."); }, 300); return; }
  if (!a || a.s !== P.state) return;
  spTokenReq(spForm({ grant_type: "authorization_code", code: P.code, redirect_uri: SP_REDIRECT, client_id: SP_CLIENT_ID, code_verifier: a.v }))
    .then(function () { spRefresh(); importAlert("Spotify", "Logged in. Your playlists are at the bottom of the home screen."); })
    .catch(function (e) { importAlert("Spotify Login Failed", String(e && e.message || e)); });
})();
function spApi(path) {
  var t = spTok(); if (!t) return Promise.reject(new Error("Not logged in"));
  var p = t.exp > Date.now() ? Promise.resolve(t.access)
    : (t.refresh ? spTokenReq(spForm({ grant_type: "refresh_token", refresh_token: t.refresh, client_id: SP_CLIENT_ID })).then(function (j) { return j.access_token; }) : Promise.reject(new Error("Session expired")));
  return p.then(function (tok) { return fetch(path.indexOf("http") === 0 ? path : "https://api.spotify.com/v1" + path, { headers: { Authorization: "Bearer " + tok } }); })
    .then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error((j.error && j.error.message) || ("HTTP " + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
}
function spAll(path, max) {
  var out = [];
  function next(u) { return spApi(u).then(function (j) { out = out.concat(j.items || []); return (j.next && out.length < max) ? next(j.next) : out; }); }
  return next(path);
}
function spFail(e) {
  var msg = String(e && e.message || e);
  if (e && e.status === 401) { storage.remove("sp_tok"); msg = "Session expired. Please log in again."; }
  else if (e && e.status === 403) msg += " (Spotify dev-mode apps only work for accounts on the app's user list, and only list tracks for playlists you own or collaborate on.)";
  importAlert("Spotify", msg);
}
function spTrackRow(it) {
  var t = it && (it.item || it.track || it); if (!t || !t.name) return null;
  var art = (t.artists || []).map(function (a) { return a.name; }).join(", ") || "Unknown Artist";
  return { label: t.name, info: [t.name, art], go: function () { importAlert(t.name, art + (t.album && t.album.name ? " \u00b7 " + t.album.name : "") + ". Spotify songs can't be played inside SpringPod."); } };
}
function spLoaded(title, key, fetcher, toRow) {
  return { title: title, make: function () {
    var s = SP[key];
    if (!s) {
      SP[key] = s = { st: "load" };
      fetcher().then(function (arr) { s.rows = arr.map(toRow).filter(Boolean); s.st = "ok"; spRefresh(); })
        .catch(function (e) { s.st = "err"; spFail(e); spRefresh(); });
    }
    if (s.st === "load") return [{ label: "Loading..." }];
    if (s.st === "err") return [{ label: "Couldn't Load - Retry", go: function () { delete SP[key]; } }];
    return s.rows.length ? s.rows : [{ label: "Nothing Here" }];
  } };
}
function spPlaylists() {
  return spLoaded("Playlists", "lists", function () { return spAll("/me/playlists?limit=50", 200); }, function (p) {
    if (!p || !p.name) return null;
    return { label: p.name, sub: true, go: function () { push(spLoaded(p.name, "pl:" + p.id, function () { return spAll("/playlists/" + p.id + "/items?limit=50", 300); }, spTrackRow)); } };
  });
}
function spMenu() {
  return { title: "Spotify", make: function () {
    return [
      { label: "Playlists", sub: true, go: function () { push(spPlaylists()); } },
      { label: "Liked Songs", sub: true, go: function () { push(spLoaded("Liked Songs", "liked", function () { return spAll("/me/tracks?limit=50", 300); }, spTrackRow)); } },
      { label: "Log Out", red: true, go: function () { storage.remove("sp_tok"); SP = {}; var gone = stack.pop(); startSlide("pop", gone); } }
    ];
  } };
}
function spPinned() {
  return spLoggedIn() ? { label: "Spotify", sub: true, pinned: true, go: function () { push(spMenu()); } }
                      : { label: "Log in to Spotify", pinned: true, go: spLogin };
}

var rootMenu = { title: "SpringPod", panel: true, make: function () {
  var it = [
    { label: "Music", sub: true, go: function () { push(musicMenu); } },
    { label: "Extras", sub: true, go: function () { push(extrasMenu); } },
    { label: "Settings", sub: true, go: function () { push(settingsMenu); } },
    { label: "Shuffle Songs", go: function () { if (T.length) { playList(shuffle(allIdx()), 0, true); openNP(); } } }
  ];
  if (cur >= 0) it.push({ label: "Now Playing", sub: true, go: openNP });
  it.push(spPinned());
  return it;
} };
push(rootMenu);


function gameWake() { if (game && game.live) wake(); }
function wheelStep(dir) {
  if (mode === "game") { if (game) { game.wheel(dir); gameWake(); } return; }
  if (mode === "rgb") { ed.rgb[ed.ch] = clamp(ed.rgb[ed.ch] + dir * 5, 0, 255); editorApply(); return; }
  if (mode === "np") {
    if (scrub) { scrubPos = clamp(scrubPos + dir * Math.max(5, T[cur].dur / 40), 0, T[cur].dur - 0.05); scrubAt = Date.now(); }
    else { vol = clamp(Math.round((vol + dir * 0.05) * 100) / 100, 0, 1); UIMusic.volume = vol; prefs.volume = vol; volUntil = Date.now() + 1500; save(); }
    return;
  }
  if (mode === "cf") { cfIdx = clamp(cfIdx + dir, 0, Math.max(0, albums.length - 1)); wake(); return; }
  if (mode !== "menu") return;
  var m = top(), n = menuItems(m).length, s = clamp(m.sel + dir, 0, n - 1);
  if (s !== m.sel) { m.sel = s; if (s < m.top) m.top = s; if (s >= m.top + VIS) m.top = s - VIS + 1; }
}
function centerPress() {
  if (mode === "game") { if (game) { game.center(); gameWake(); } return; }
  if (mode === "rgb") { if (ed.ch < 2) ed.ch++; else editorDone(); return; }
  if (mode === "np") {
    if (scrub) commitScrub(); else if (T[cur].dur > 0) { scrub = true; scrubPos = pos; scrubAt = Date.now(); }
    return;
  }
  if (mode === "cf") { if (albums.length) { var a = albums[cfIdx]; mode = "menu"; push(songsMenu(a.name, a.idx)); } return; }
  if (mode === "stopwatch") { swToggle(); return; }
  if (mode !== "menu") return;
  var m = top(), it = menuItems(m)[m.sel];
  if (it && it.go) { it.go(); rev++; }
}
function menuButton() {
  if (mode === "game") { if (game && game.menu()) { gameWake(); return; } game = null; mode = "menu"; rev++; return; }
  if (mode === "rgb") { editorDone(); return; }
  if (scrub) { scrub = false; return; }
  if (mode === "cf") { mode = "menu"; startTr("out"); return; }
  if (mode !== "menu") { mode = "menu"; return; }
  if (stack.length > 1) { var gone = stack.pop(); startSlide("pop", gone); }
}


function tri(c, x, y, s, col) { c.fillPath(new UIBezierPath().moveTo(x, y - s).lineTo(x + s * 1.2, y).lineTo(x, y + s).close(), col); }
function skipIcon(c, col) { tri(c, -9, 0, 5.5, col); tri(c, -2.5, 0, 5.5, col); c.fillRect(5, -5.5, 2.8, 11, col); }
var BLUE = ["#4aa6ee", "#2186d6"], FILL = ["#58aef4", "#1f7fd1"];

var GM = null;
try {
  GM = require("scripts/games.js")({
    LW: LW, LH: LH, HEAD: HEAD, clamp: clamp, ctext: ctext, BLUE: BLUE, header: header, T: T, Path: UIBezierPath,
    playClip: function (i) {
      var t = T[i], k = Math.floor(Math.random() * Math.max(1, t.steps));
      playing = false;
      if (t.path) {
        try { UIMusic.volume = vol; UIMusic.play(t.path, false); if (t.dur > 40) UIMusic.seek(Math.random() * (t.dur - 20)); } catch (e) { console.error("clip failed: " + e); }
        return;
      }
      try { UIMusic.volume = vol; UIMusic.play(tailPath(t, k), false); } catch (e) { console.error("clip failed: " + e); }
    },
    stopClip: function () { try { UIMusic.stop(); } catch (e) {} playing = false; }
  });
} catch (e) { console.warn("games unavailable: " + e); }
var pressed = false;


function grain(c, x, y, w, h, base) {
  var l = clamp(lum(base) * 255, 8, 247);
  c.save(); c.alpha(Math.min(0.8, 20 / (255 - l)));
  c.fillRect(x, y, w, h, c.pattern("assets/ui/grain_w.png", 0.5)); c.restore();
  c.save(); c.alpha(Math.min(0.8, 20 / l));
  c.fillRect(x, y, w, h, c.pattern("assets/ui/grain_b.png", 0.5)); c.restore();
}
var body = new UIView({ frame: [0, 0, W, H], draw: function (c) {


  var f = prefs.frame, E = 22, sh = "#000000" + pad2hex((lum(f) < 0.3 ? 0.3 : 0.15) * 255), z = "#00000000";
  c.fillRect(0, 0, W, H, f);
  c.fillRect(0, 0, W, E, c.linearGradient(0, 0, 0, E, [sh, z]));
  c.fillRect(0, H - E, W, E, c.linearGradient(0, H, 0, H - E, [sh, z]));
  c.fillRect(0, 0, E, H, c.linearGradient(0, 0, E, 0, [sh, z]));
  c.fillRect(W - E, 0, E, H, c.linearGradient(W, 0, W - E, 0, [sh, z]));
  grain(c, 0, 0, W, H, f);

  c.save(); c.shadow("#00000058", 2.5, 0, 1); c.fillRect(LCD_X, TOP, LCD_W, LCD_H, "#000000", 5); c.restore();
  c.line(LCD_X + 5, LCD_BOT + 1, LCD_X + LCD_W - 5, LCD_BOT + 1, lum(f) < 0.3 ? "#ffffff30" : "#ffffff80", 1);
} });
function pad2hex(v) { v = clamp(Math.round(v), 0, 255); return (v < 16 ? "0" : "") + v.toString(16); }

function speaker(c, x, y, col, muted) {
  c.fillPath(new UIBezierPath().moveTo(x, y + 3).lineTo(x + 3, y + 3).lineTo(x + 7, y).lineTo(x + 7, y + 10).lineTo(x + 3, y + 7).lineTo(x, y + 7).close(), col);
  if (muted) c.line(x - 1, y + 11, x + 9, y - 1, col, 1.4, { cap: "round" });
  else c.strokePath(new UIBezierPath().arc(x + 7, y + 5, 3.5, -50, 100), col, 1.2, { cap: "round" });
}
function header(c, title) {
  c.fillRect(0, 0, LW, HEAD, c.linearGradient(0, 0, 0, HEAD, ["#efefef", "#abadb0"]));
  c.line(0, HEAD - 0.5, LW, HEAD - 0.5, "#8c8e92", 1);
  ctext(c, title, 5, 13, { size: 11, bold: true, color: "#000000", maxWidth: LW - 100 });
  var ink = "#4a4c50", bx = LW - 28;
  c.strokeRect(bx, 4, 20, 10, "#55575b", 1, 2); c.fillRect(bx + 20, 7, 2, 4, "#55575b");
  c.fillRect(bx + 2, 6, 14, 6, c.linearGradient(0, 6, 0, 12, ["#86d873", "#2f9a2a"]), 1);
  var px = bx - 18;
  if (cur >= 0) {
    if (playing) tri(c, px + 2, 9, 4.5, ink);
    else { c.fillRect(px, 4.5, 3, 9, ink); c.fillRect(px + 6, 4.5, 3, 9, ink); }
    px -= 18;
  }
  speaker(c, px, 4, ink, vol === 0);
}

function tiltOval(path, cx, cy, rx, ry, deg) {
  var a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  for (var i = 0; i < 28; i++) {
    var t = i / 28 * 2 * Math.PI, ex = rx * Math.cos(t), ey = ry * Math.sin(t);
    var px = cx + ex * ca - ey * sa, py = cy + ex * sa + ey * ca;
    if (i) path.lineTo(px, py); else path.moveTo(px, py);
  }
  path.close();
}
function noMusic(c, cx, cy) {
  var x = cx - 32, y = cy - 52, col = "#9eaec6", p = new UIBezierPath();
  p.moveTo(x + 18, y + 16).lineTo(x + 62, y + 3).lineTo(x + 62, y + 19).lineTo(x + 18, y + 32).close();
  p.moveTo(x + 18, y + 16).lineTo(x + 23, y + 16).lineTo(x + 23, y + 58).lineTo(x + 18, y + 58).close();
  p.moveTo(x + 57, y + 3).lineTo(x + 62, y + 3).lineTo(x + 62, y + 50).lineTo(x + 57, y + 50).close();
  tiltOval(p, x + 11, y + 58, 12.5, 8.5, -22);
  tiltOval(p, x + 50, y + 50, 12.5, 8.5, -22);
  c.save(); c.shadow("#00000030", 3, 0, 2); c.fillPath(p, col); c.restore();
  ctext(c, "No Music", cx, cy + 62, { size: 14, bold: true, color: "#ffffff", align: "center", maxWidth: PANEL_W - 10 });
}
function drawMenu(c, mm, o) {
  o = o || {};
  var m = mm || top(), items = menuItems(m), pw = m.panel ? PANEL_W : 0, mw = LW - pw;
  var listDx = 0, listA = 1, grow = 0, ps = 1, pdx = 0;
  if (listA > 0 && o.part !== "panel") {
  c.save(); c.translate(listDx, 0); if (listA < 1) c.alpha(listA);
  c.fillRect(0, 0, mw, LH, "#ffffff");
  if (!o.noHeader) header(c, m.title);
  for (var i = 0; i < VIS; i++) {
    var idx = m.top + i; if (idx >= items.length) break;
    var it = items[idx], y = it.pinned ? LH - ROW : HEAD + i * ROW, sel = idx === m.sel, fg = sel ? "#ffffff" : (it.red ? "#d6261c" : "#000000");
    if (it.pinned) c.fillRect(6, y - 1, mw - 12, 1, "#00000026");
    if (sel) c.fillRect(0, y, mw, ROW, c.linearGradient(0, y, 0, y + ROW, BLUE));
    var right = 8;
    if (it.sub) {
      c.strokePath(new UIBezierPath().moveTo(mw - 13, y + 6.5).lineTo(mw - 7.5, y + 11).lineTo(mw - 13, y + 15.5), sel ? "#ffffff" : "#6d717a", 2, { cap: "round", join: "round" });
      right = 20;
    }
    if (it.playing) { tri(c, mw - right - 8, y + 11, 4, sel ? "#ffffff" : "#1766cc"); right += 14; }
    if (it.swatch) {
      var sx = mw - right - 18;
      c.fillRect(sx, y + 5, 18, 12, it.swatch, 3);
      c.strokeRect(sx + 0.5, y + 5.5, 17, 11, sel ? "#ffffffcc" : "#00000040", 1, 3);
      right += 24;
    }
    if (it.check) {
      c.strokePath(new UIBezierPath().moveTo(mw - right - 12, y + 11.5).lineTo(mw - right - 8.5, y + 15).lineTo(mw - right - 2, y + 7), sel ? "#ffffff" : "#1f1f1f", 2, { cap: "round", join: "round" });
      right += 18;
    }
    var vw = 0;
    if (it.val) { vw = fmeasure(it.val, { size: 12 }); ctext(c, it.val, mw - right, y + 15, { size: 12, color: sel ? "#ffffff" : "#000000", align: "right" }); }
    ctext(c, it.label, 8, y + 15, { size: 12, bold: true, color: fg, maxWidth: mw - right - vw - 16 });
  }
  if (items.length > VIS) {
    var bh = Math.max(14, (LH - HEAD) * VIS / items.length), by = HEAD + (LH - HEAD - bh) * (m.top / (items.length - VIS));
    c.fillRect(mw - 4, by, 3, bh, "#00000040", 1.5);
  }
  c.restore();
  }
  if (m.panel && o.part !== "list") {
    c.save(); c.translate(pdx, 0);
    var gx = mw - grow, gw = pw + grow;


    var hov = items[m.sel], np = cur >= 0 ? T[cur] : null;
    if (!(hov && hov.art) && !np) {
      c.fillRect(gx, HEAD, gw, LH - HEAD, c.linearGradient(0, HEAD, 0, LH, ["#6283a3", "#3a4a60"]));
      noMusic(c, gx + gw / 2, HEAD + (LH - HEAD) * 0.5);
      c.restore();
      return;
    }
    c.fillRect(gx, HEAD, gw, LH - HEAD, c.linearGradient(0, HEAD, 0, LH, ["#a6abb1", "#464a4f"]));
    var shown = hov && hov.art ? hov.art : (np ? artOf(np) : DEF_ART);
    var cap = hov && hov.info ? hov.info : (np ? [np.title, np.artist] : null);
    var ay = HEAD + Math.max(14, Math.round((LH - HEAD - 150) * 0.35)), as = 100 * ps;
    c.save(); c.shadow("#00000070", 4, 0, 2); img(c, shown, gx + (gw - as) / 2, ay + 50 - as / 2, as, as); c.restore();
    if (cap) {
      ctext(c, cap[0], gx + gw / 2, ay + 120, { size: 12, bold: true, color: "#ffffff", align: "center", maxWidth: pw - 10 });
      ctext(c, cap[1], gx + gw / 2, ay + 136, { size: 11, color: "#d9dce1", align: "center", maxWidth: pw - 10 });
    }
    c.restore();
  }
}



function perspArt(c, path, x0, cy, wd, hL, hR, alpha, n) {
  var ab = artBox(path), q = ab[2];
  for (var i = 0; i < n; i++) {
    var u = (i + 0.5) / n, hh = n === 1 ? hL : hL + (hR - hL) * u, xs = x0 + wd * i / n, sw_ = wd / n + 0.8;
    var src = [ab[0] + q * i / n, ab[1], q / n, q], b = cy + hh / 2;
    img(c, path, xs, cy - hh / 2, sw_, hh, alpha, src);
    var rh = hh * 0.45;
    c.save(); c.translate(xs, b); c.scale(1, -1);
    img(c, path, 0, -rh, sw_, rh, 0.55 * alpha, [src[0], ab[1] + q * 0.55, src[2], q * 0.45]);
    c.restore();
    c.fillRect(xs - 0.2, b, sw_ + 0.4, rh + 1, c.linearGradient(0, b, 0, b + rh, ["#ffffff66", "#ffffff"]));
  }
}

function bar(c, x, y, w, f, scrubbing) {
  c.fillRect(x, y, w, 3, "#d9dadd", 1.5);
  var fw = w * clamp(f, 0, 1);
  if (fw > 3) c.fillRect(x, y, fw, 3, c.linearGradient(x, y, x, y + 3, FILL), 1.5);
  if (scrubbing) {
    var mx = x + fw;
    c.fillPath(new UIBezierPath().moveTo(mx, y - 4).lineTo(mx + 5, y + 1.5).lineTo(mx, y + 7).lineTo(mx - 5, y + 1.5).close(), "#1766cc");
  }
}
function drawNP(c) {
  var t = T[cur], cy = Math.round(HEAD + 0.4 * (LH - HEAD)), tx = 138, by = LH - 18, mw_ = LW - tx - 10;
  header(c, "Now Playing");
  perspArt(c, artOf(t), 10, cy, 104, 118, 106, 1, 12);
  ctext(c, t.title, tx, cy - 11, { size: 14, bold: true, color: "#000000", maxWidth: mw_ });
  ctext(c, t.artist, tx, cy + 9, { size: 12, color: "#707074", maxWidth: mw_ });
  ctext(c, t.album, tx, cy + 28, { size: 12, color: "#707074", maxWidth: mw_ });
  ctext(c, (qi + 1) + " of " + queue.length, tx, cy + 46, { size: 10, color: "#a0a1a6" });
  var flags = [prefs.shuffle ? "Shuffle" : null, prefs.repeat === 1 ? "Repeat One" : (prefs.repeat === 2 ? "Repeat All" : null)].filter(Boolean).join("  ·  ");
  if (flags) ctext(c, flags, tx, cy + 62, { size: 10, bold: true, color: "#1766cc", maxWidth: mw_ });
  for (var k = 0; k < 3; k++) { c.fillRect(LW - 27, HEAD + 14 + k * 4, 2, 2, "#8c8e93"); c.fillRect(LW - 23, HEAD + 14 + k * 4, 10, 2, "#8c8e93"); }

  var showVol = !scrub && Date.now() < volUntil, s = scrub ? scrubPos : pos;
  var lt = showVol ? "Volume" : fmt(s), rt = showVol ? Math.round(vol * 100) + "%" : (t.dur > 0 ? "-" + fmt(t.dur - s) : "-:--");
  var slot = fmeasure("-00:00", { size: 10, bold: true });
  var lw = Math.max(slot, fmeasure(lt, { size: 10, bold: true })), rw = Math.max(slot, fmeasure(rt, { size: 10, bold: true }));
  ctext(c, lt, 9, by + 4, { size: 10, bold: true, color: scrub ? "#1766cc" : "#000000" });
  ctext(c, rt, LW - 9, by + 4, { size: 10, bold: true, color: "#000000", align: "right" });
  bar(c, 9 + lw + 6, by, LW - 18 - lw - rw - 12, showVol ? vol : (t.dur > 0 ? s / t.dur : 0), scrub);
}

var CF_N = 10, CF_MOVE_N = 7;
function coverAt(c, path, d) {
  var S = Math.min(104, Math.round((LH - HEAD) * 0.42)), cyc = Math.round(HEAD + 0.4 * (LH - HEAD));
  var ad = Math.abs(d), t = Math.min(1, ad), left = d < 0;
  var cx = LW / 2 + (left ? -1 : 1) * (ad <= 1 ? 66 * ad : 66 + 30 * (ad - 1));
  var wd = S * (1 - 0.5 * t), hIn = S * (1 - 0.22 * t), alpha = clamp(3.3 - ad, 0, 1), n = t < 0.02 ? 1 : (cfPos !== cfIdx ? CF_MOVE_N : CF_N);
  perspArt(c, path, cx - wd / 2, cyc, wd, left ? S : hIn, left ? hIn : S, alpha, n);
}
function cfHeader(c, h) {
  if (h <= 0) return;
  c.save(); if (h < 1) c.alpha(h); header(c, "Cover Flow"); c.restore();
}
function drawCF(c, tf) {
  var capA = 1, hdrA = 1;
  if (tf && tf.kind === "trans") hdrA = 0;
  c.save(); if (tf && tf.kind === "trans" && tf.fade < 1) c.alpha(tf.fade);
  c.fillRect(0, 0, LW, LH, "#ffffff");
  if (!albums.length) { cfHeader(c, hdrA); ctext(c, "No Songs", LW / 2, LH / 2, { size: 14, bold: true, color: "#000000", align: "center" }); c.restore(); return; }
  var vis = [];
  for (var i = 0; i < albums.length; i++) if (Math.abs(i - cfPos) <= 3.3) vis.push(i);
  vis.sort(function (a, b) { return Math.abs(b - cfPos) - Math.abs(a - cfPos); });
  vis.forEach(function (i) { coverAt(c, albums[i].art, i - cfPos); });
  cfHeader(c, hdrA);
  var a = albums[cfIdx];
  c.fillRect(0, LH - 40, LW, 40, c.linearGradient(0, LH - 40, 0, LH - 30, ["#ffffff00", "#ffffff"]));
  if (capA > 0) {
    c.save(); if (capA < 1) c.alpha(capA);
    ctext(c, a.name, LW / 2, LH - 26, { size: 13, bold: true, color: "#000000", align: "center", maxWidth: LW - 20 });
    ctext(c, a.artist, LW / 2, LH - 10, { size: 11, color: "#707074", align: "center", maxWidth: LW - 20 });
    c.restore();
  }
  c.restore();
}

function hand(c, cx, cy, deg, len, w, col) {
  var a = deg * Math.PI / 180;
  c.line(cx, cy, cx + Math.sin(a) * len, cy - Math.cos(a) * len, col, w, { cap: "round" });
}
function drawClock(c) {
  header(c, "Clock");
  var d = new Date(), r = Math.min(66, Math.floor((LH - HEAD - 44) / 2)), cx = LW / 2, cy = HEAD + 8 + r, hh = d.getHours();
  c.circle(cx, cy, r + 3, "#9aa0ab", 0); c.circle(cx, cy, r, "#ffffff", 0);
  for (var i = 0; i < 12; i++) {
    var a = i * Math.PI / 6;
    c.line(cx + Math.sin(a) * (r - 9), cy - Math.cos(a) * (r - 9), cx + Math.sin(a) * (r - 2), cy - Math.cos(a) * (r - 2), "#222222", i % 3 === 0 ? 3 : 1.5);
  }
  hand(c, cx, cy, (hh % 12 + d.getMinutes() / 60) * 30, r * 0.5, 4, "#222222");
  hand(c, cx, cy, d.getMinutes() * 6 + d.getSeconds() / 10, r * 0.78, 3, "#222222");
  hand(c, cx, cy, d.getSeconds() * 6, r * 0.85, 1.5, "#d33");
  c.circle(cx, cy, 4, "#222222", 0);
  ctext(c, (hh % 12 || 12) + ":" + pad2(d.getMinutes()) + ":" + pad2(d.getSeconds()) + (hh < 12 ? " AM" : " PM"), LW / 2, LH - 10, { size: 16, bold: true, color: "#111111", align: "center" });
}
function drawStopwatch(c) {
  header(c, "Stopwatch");
  var t = swTime(), m = Math.floor(t / 60), s = Math.floor(t % 60), ds = Math.floor((t * 10) % 10), my = Math.round(HEAD + (LH - HEAD) * 0.45);
  ctext(c, m + ":" + pad2(s) + "." + ds, LW / 2, my, { size: 52, bold: true, color: "#111111", align: "center" });
  ctext(c, sw.run ? "Center: Stop" : (t > 0 ? "Center: Start   Next: Reset" : "Center: Start"), LW / 2, my + 38, { size: 12, color: "#707074", align: "center" });
}

var CHANNELS = [["Red", "#f0675d"], ["Green", "#59cc55"], ["Blue", "#4f9cf2"]];
function drawRGB(c) {
  var hex = hexOf(ed.rgb);
  header(c, ed.key === "frame" ? "Frame Color" : "Wheel Color");
  var sh = Math.max(30, Math.min(44, LH - HEAD - 3 * 28 - 44));
  c.fillRect(12, HEAD + 10, LW - 24, sh, hex, 5);
  c.strokeRect(12.5, HEAD + 10.5, LW - 25, sh - 1, "#00000038", 1, 5);
  ctext(c, hex.toUpperCase(), LW / 2, HEAD + 10 + sh / 2 + 5, { size: 14, bold: true, color: lum(hex) > 0.55 ? "#000000b0" : "#ffffffe6", align: "center" });
  var y0 = HEAD + 10 + sh + 10, rh = Math.min(30, Math.floor((LH - y0 - 22) / 3));
  for (var i = 0; i < 3; i++) {
    var y = y0 + i * rh, sel = ed.ch === i, v = Math.round(ed.rgb[i]), ty = y + rh / 2 - 2.5, tw = LW - 64 - 50;
    if (sel) c.fillRect(0, y, LW, rh, c.linearGradient(0, y, 0, y + rh, BLUE));
    ctext(c, CHANNELS[i][0], 10, y + rh / 2 + 4, { size: 12, bold: true, color: sel ? "#ffffff" : "#000000" });
    c.fillRect(64, ty, tw, 5, sel ? "#ffffff55" : "#d3d5da", 2.5);
    if (v > 2) c.fillRect(64, ty, tw * v / 255, 5, sel ? "#ffffff" : CHANNELS[i][1], 2.5);
    ctext(c, String(v), LW - 10, y + rh / 2 + 4, { size: 12, color: sel ? "#ffffff" : "#000000", align: "right" });
  }
  ctext(c, "Wheel: adjust    Center: next", LW / 2, LH - 7, { size: 10, color: "#8c8e93", align: "center" });
}


function rollHeader(c, title, y) {
  if (y <= -HEAD) return;
  c.save(); c.clipRect(0, 0, LW, HEAD); c.translate(0, y); header(c, title); c.restore();
}
function seg(p, t0, d) { return clamp((p - t0) / d, 0, 1); }
function drawTrans(c, p) {
  var pw = top().panel ? PANEL_W : 0;
  c.fillRect(0, 0, LW, LH, "#ffffff");
  var fade = seg(p, TR.f0, TR.f); fade = fade * fade * (3 - 2 * fade);
  var zm = TR.zoom0 + (1 - TR.zoom0) * easeOut(seg(p, TR.p0, TR.f0 + TR.f - TR.p0));
  if (fade > 0) {
    c.save(); c.translate(LW / 2, LH / 2); c.scale(zm, zm); c.translate(-LW / 2, -LH / 2);
    drawCF(c, { kind: "trans", fade: fade });
    c.restore();
  }
  var D = LW - pw, pd = D * easeIn(seg(p, TR.p0, TR.p)), ld = D * easeIn(seg(p, TR.l0, TR.l));
  if (pw && pd < pw) { c.save(); c.translate(pd, 0); drawMenu(c, null, { part: "panel", noHeader: true }); c.restore(); }
  if (ld < D) { c.save(); c.translate(-ld, 0); drawMenu(c, null, { part: "list", noHeader: true }); c.restore(); }
  var up = easeIn(seg(p, TR.h0, TR.h)), down = easeOut(seg(p, TR.r0, TR.r));
  if (p < TR.r0) rollHeader(c, top().title, -HEAD * up);
  else rollHeader(c, "Cover Flow", -HEAD * (1 - down));
}
function drawSlide(c) {
  var u = easeOut(trE() / TR.slide), nm = top(), om = tr.old, push_ = tr.kind === "push";
  var ox = push_ ? -LW * u : LW * u, nx = push_ ? LW * (1 - u) : -LW * (1 - u);
  c.save(); c.translate(ox, 0); c.clipRect(0, 0, LW, LH); drawMenu(c, om); c.restore();
  c.save(); c.translate(nx, 0); c.clipRect(0, 0, LW, LH); drawMenu(c, nm); c.restore();
}
page = new UIView({ frame: [BORDER, BORDER, LW, LH], draw: function (c) {
  c.clipRect(0, 0, LW, LH, 3.5);
  if (mode === "np" && cur >= 0) drawNP(c);
  else if (mode === "cf") {
    if (tr && tr.kind === "in") drawTrans(c, trE());
    else drawCF(c, null);
  }
  else if (mode === "game" && game) game.draw(c);
  else if (mode === "clock") drawClock(c);
  else if (mode === "stopwatch") drawStopwatch(c);
  else if (mode === "rgb" && ed) drawRGB(c);
  else if (tr && tr.kind === "out") {
    drawTrans(c, Math.max(0, TR.tot - trE()));
  }
  else if (tr && (tr.kind === "push" || tr.kind === "pop")) drawSlide(c);
  else drawMenu(c);
} });
var lcd = new UIView({ frame: [LCD_X, TOP, LCD_W, LCD_H], background: "#000000", cornerRadius: 5, clipsToBounds: true, draw: function (c) {
  c.fillRect(BORDER, BORDER, LW, LH, "#ffffff", 3.5);
} });
lcd.addSubview(page);

var wheel = new UIView({ frame: [(W - 2 * R) / 2, WY, 2 * R, 2 * R], draw: function (c) {
  var f = prefs.frame, w = prefs.wheel, ink = wheelInk();

  var ring = shade(w, lum(w) > 0.5 ? -0.17 : 0.16);
  c.circle(R, R, R, ring, 0);
  c.circle(R, R, R - 0.8, w, 0);
  ctext(c, "MENU", R, 22, { size: 14, bold: true, color: ink, align: "center" });
  c.save(); c.translate(R + 80, R); skipIcon(c, ink); c.restore();
  c.save(); c.translate(R - 80, R); c.scale(-1, 1); skipIcon(c, ink); c.restore();
  tri(c, R - 11, R + 80, 5.5, ink); c.fillRect(R + 1.5, R + 74.5, 2.8, 11, ink); c.fillRect(R + 6.5, R + 74.5, 2.8, 11, ink);

  var cf = pressed ? shade(f, lum(f) > 0.5 ? -0.1 : 0.1) : f;
  c.circle(R, R, BR, shade(cf, lum(cf) > 0.5 ? -0.2 : 0.12), 0);
  c.circle(R, R, BR - 0.7, c.radialGradient(R, R, BR, [shade(cf, 0.015), shade(cf, -0.06)]), 0);
  c.save(); c.clipPath(new UIBezierPath().oval(R - BR + 0.7, R - BR + 0.7, 2 * BR - 1.4, 2 * BR - 1.4));
  grain(c, R - BR, R - BR, 2 * BR, 2 * BR, cf); c.restore();
} });

var touch = null;
wheel.onTouch = function (phase, x, y) {
  var dx = x - R, dy = y - R, r = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
  if (phase === "began") {
    touch = r <= R + 6 ? { x0: x, y0: y, a: a, acc: 0, total: 0, zone: r < BR ? "c" : "r" } : null;
    pressed = !!touch && touch.zone === "c";
    return;
  }
  if (!touch) return;
  if (phase === "moved") {
    if (touch.zone === "c") { pressed = r <= BR; return; }
    if (touch.zone === "r" && r > BR * 0.8) {
      var d = a - touch.a;
      if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
      touch.a = a; touch.acc += d; touch.total += Math.abs(d);
      while (touch.acc >= STEPRAD) { touch.acc -= STEPRAD; wheelStep(1); }
      while (touch.acc <= -STEPRAD) { touch.acc += STEPRAD; wheelStep(-1); }
    }
    return;
  }
  var tc = touch, wasDown = pressed; touch = null; pressed = false;
  if (phase !== "ended") return;
  var moved = Math.sqrt((x - tc.x0) * (x - tc.x0) + (y - tc.y0) * (y - tc.y0));
  if (tc.zone === "c") { if (wasDown && r <= BR) centerPress(); return; }
  if (tc.total < 0.3 && moved < 14) {
    var ax = tc.x0 - R, ay = tc.y0 - R;
    if (mode === "game") {
      if (Math.abs(ay) > Math.abs(ax)) { if (ay < 0) menuButton(); else if (game) { game.playpause(); gameWake(); } }
      else if (game) { game.skip(ax < 0 ? -1 : 1); gameWake(); }
      return;
    }
    if (Math.abs(ay) > Math.abs(ax)) { if (ay < 0) menuButton(); else if (mode !== "rgb") togglePlay(); }
    else if (mode === "stopwatch" && ax > 0) { if (!sw.run) sw.acc = 0; }
    else if (mode === "rgb") {   }
    else if (ax < 0) prevTrack(); else nextTrack();
  }
};

setTimeout(function () { T.forEach(function (t) { if (t.imp && !t.tg) queueScan(t); }); }, 1200);
UIApplication.run(new UIViewController({ background: "#000000", views: [clock, body, lcd, wheel] }));

};
window.__SP_MODULES["scripts/library.js"]=function(module,exports,require){

module.exports = {
  "STEP": 30,
  "tracks": [
    {
      "file": "assets/m/valve",
      "steps": 4,
      "dur": 120.31,
      "title": "Nuclear Mission Jam",
      "artist": "Valve",
      "album": "Half-Life",
      "art": "assets/art/valve.png"
    },
    {
      "file": "assets/m/monkeys",
      "steps": 5,
      "dur": 125.06,
      "title": "Monkeys Spinning Monkeys",
      "artist": "Kevin MacLeod",
      "album": "Monkeys Spinning Monkeys",
      "art": "assets/art/monkeys.png"
    },
    {
      "file": "assets/m/music",
      "steps": 10,
      "dur": 294.08,
      "title": "music",
      "artist": "guille",
      "album": "music",
      "art": "assets/art/music.png"
    },
    {
      "file": "assets/m/scarlet",
      "steps": 5,
      "dur": 153.83,
      "title": "Scarlet Fire",
      "artist": "Otis McDonald",
      "album": "Scarlet Fire",
      "art": "assets/art/scarlet.png"
    }
  ]
};

};
window.__SP_MODULES["scripts/tags.js"]=function(module,exports,require){




var CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var DEC = new Uint8Array(128);
for (var ci_ = 0; ci_ < 64; ci_++) DEC[CH.charCodeAt(ci_)] = ci_;

function u32(b, o) { return ((b[o] * 16777216) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3]); }
function u32le(b, o) { return ((b[o + 3] * 16777216) + (b[o + 2] << 16) + (b[o + 1] << 8) + b[o]); }
function ss(b, o) { return ((b[o] & 127) << 21) | ((b[o + 1] & 127) << 14) | ((b[o + 2] & 127) << 7) | (b[o + 3] & 127); }

function latin1(a, s, e) {
  var out = [];
  for (var i = s; i < e; i++) out.push(String.fromCharCode(a[i]));
  return out.join("");
}
function utf8(a, s, e) {
  var out = [], i = s;
  while (i < e) {
    var c = a[i++], cp;
    if (c < 0x80) cp = c;
    else if (c >= 0xC0 && c < 0xE0 && i < e) cp = ((c & 31) << 6) | (a[i++] & 63);
    else if (c >= 0xE0 && c < 0xF0 && i + 1 < e) { cp = ((c & 15) << 12) | ((a[i] & 63) << 6) | (a[i + 1] & 63); i += 2; }
    else if (c >= 0xF0 && i + 2 < e) { cp = ((c & 7) << 18) | ((a[i] & 63) << 12) | ((a[i + 1] & 63) << 6) | (a[i + 2] & 63); i += 3; }
    else cp = 0xFFFD;
    if (cp > 0xFFFF) { cp -= 0x10000; out.push(String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 1023))); }
    else out.push(String.fromCharCode(cp));
  }
  return out.join("");
}
function utf16(a, s, e, be) {
  var out = [];
  if (e - s >= 2) {
    if (a[s] === 0xFF && a[s + 1] === 0xFE) { be = false; s += 2; }
    else if (a[s] === 0xFE && a[s + 1] === 0xFF) { be = true; s += 2; }
  }
  for (var i = s; i + 1 < e; i += 2) out.push(String.fromCharCode(be ? (a[i] << 8) | a[i + 1] : (a[i + 1] << 8) | a[i]));
  return out.join("");
}

function decode(enc, a, s, e) {
  if (enc === 1) return utf16(a, s, e, false);
  if (enc === 2) return utf16(a, s, e, true);
  if (enc === 3) return utf8(a, s, e);
  return latin1(a, s, e);
}
function tidy(s) { return String(s == null ? "" : s).replace(/\uFEFF/g, "").replace(/[\u0000-\u001F]+/g, " ").replace(/\s+/g, " ").trim(); }
function list(s, sep) {
  return s.split(sep || "\u0000").map(tidy).filter(Boolean).slice(0, 4).join(", ");
}
function unsync(a) {
  var out = new Uint8Array(a.length), o = 0;
  for (var i = 0; i < a.length; i++) { out[o++] = a[i]; if (a[i] === 0xFF && i + 1 < a.length && a[i + 1] === 0) i++; }
  return out.subarray(0, o);
}
function encode(a) {
  var out = [], n = a.length, i = 0;
  for (; i + 2 < n; i += 3) {
    var v = (a[i] << 16) | (a[i + 1] << 8) | a[i + 2];
    out.push(CH[v >> 18] + CH[(v >> 12) & 63] + CH[(v >> 6) & 63] + CH[v & 63]);
  }
  if (n - i === 1) { var w = a[i] << 16; out.push(CH[w >> 18] + CH[(w >> 12) & 63] + "=="); }
  else if (n - i === 2) { var x = (a[i] << 16) | (a[i + 1] << 8); out.push(CH[x >> 18] + CH[(x >> 12) & 63] + CH[(x >> 6) & 63] + "="); }
  return out.join("");
}


function sniff(b) {
  if (b.length > 4 && b[0] === 0xFF && b[1] === 0xD8) {
    var i = 2;
    while (i + 4 <= b.length) {
      if (b[i] !== 0xFF) { i++; continue; }
      var m = b[i + 1];
      if (m === 0xFF) { i++; continue; }
      if (m === 0xD8 || m === 0x01 || (m >= 0xD0 && m <= 0xD7)) { i += 2; continue; }
      var l = (b[i + 2] << 8) | b[i + 3];
      if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC && i + 9 <= b.length)
        return { ext: "jpg", h: (b[i + 5] << 8) | b[i + 6], w: (b[i + 7] << 8) | b[i + 8] };
      i += 2 + l;
    }
    return null;
  }
  if (b.length >= 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) return { ext: "png", w: u32(b, 16), h: u32(b, 20) };
  if (b.length >= 10 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return { ext: "gif", w: b[6] | (b[7] << 8), h: b[8] | (b[9] << 8) };
  return null;
}

function scan(b64) {
  if (/[\r\n]/.test(b64.substr(0, 512))) b64 = b64.replace(/[\r\n]/g, "");
  var n = b64.length, pad = 0;
  if (n > 0 && b64.charCodeAt(n - 1) === 61) pad++;
  if (n > 1 && b64.charCodeAt(n - 2) === 61) pad++;
  var total = (n >> 2) * 3 - pad;


  function rd(off, len) {
    if (off < 0) off = 0;
    if (off >= total || len <= 0) return new Uint8Array(0);
    if (off + len > total) len = total - off;
    var skip = off % 3, ci = ((off - skip) / 3) * 4, ce = Math.min(n, Math.ceil((off + len) / 3) * 4);
    var out = new Uint8Array(((ce - ci) >> 2) * 3), o = 0;
    for (var i = ci; i < ce; i += 4) {
      var a = DEC[b64.charCodeAt(i)], b = DEC[b64.charCodeAt(i + 1)], c = DEC[b64.charCodeAt(i + 2)], d = DEC[b64.charCodeAt(i + 3)];
      out[o++] = (a << 2) | (b >> 4); out[o++] = ((b & 15) << 4) | (c >> 2); out[o++] = ((c & 3) << 6) | d;
    }
    return out.subarray(skip, skip + len);
  }

  function range(off, len) {
    if (off % 3 === 0 && len % 3 === 0 && off + len <= total) return b64.substr((off / 3) * 4, (len / 3) * 4);
    return encode(rd(off, len));
  }

  var res = { title: "", artist: "", albumartist: "", album: "", genre: "", pic: null, src: b64 };
  var best = null;

  function offerPic(ptype, off, len, mem) {
    if (len < 16 || len > 6 * 1024 * 1024) return;
    if (!best || (ptype === 3 && best.ptype !== 3)) best = { ptype: ptype, off: off, len: len, mem: mem || null };
  }


  function id3v2() {
    var h = rd(0, 10);
    if (h.length < 10 || h[0] !== 0x49 || h[1] !== 0x44 || h[2] !== 0x33) return false;
    var ver = h[3], fl = h[5], size = ss(h, 6), end = 10 + size, p = 10;
    var mem = null, get = rd;
    if (ver < 2 || ver > 4) return true;
    if ((fl & 0x80) && ver < 4) {
      mem = unsync(rd(10, Math.min(size, 16 * 1024 * 1024)));
      get = function (o, l) { return mem.subarray(o - 10, o - 10 + l); };
      end = 10 + mem.length;
    }
    if (fl & 0x40) { var eh = get(p, 6); p += ver === 4 ? ss(eh, 0) : u32(eh, 0) + 4; }
    var hl = ver === 2 ? 6 : 10, guard = 0;
    while (p + hl <= end && guard++ < 4000) {
      var fh = get(p, hl);
      if (fh.length < hl || fh[0] === 0) break;
      var id, fs, fmt = 0;
      if (ver === 2) { id = latin1(fh, 0, 3); fs = (fh[3] << 16) | (fh[4] << 8) | fh[5]; }
      else { id = latin1(fh, 0, 4); fs = ver === 4 ? ss(fh, 4) : u32(fh, 4); fmt = fh[9]; }
      var bs = p + hl; p = bs + fs;
      if (fs <= 0) continue;
      if (p > end) break;
      var skip = 0, skipFrame = false, fUnsync = false;
      if (ver === 3) { if (fmt & 0xC0) skipFrame = true; if (fmt & 0x20) skip += 1; }
      if (ver === 4) { if (fmt & 0x0C) skipFrame = true; if (fmt & 0x40) skip += 1; if (fmt & 0x01) skip += 4; if (fmt & 0x02) fUnsync = true; }
      if (skipFrame) continue;
      var key = ver === 2 ? ({ TT2: "title", TP1: "artist", TP2: "albumartist", TAL: "album", TCO: "genre", PIC: "pic" })[id]
                          : ({ TIT2: "title", TPE1: "artist", TPE2: "albumartist", TALB: "album", TCON: "genre", APIC: "pic" })[id];
      if (!key) continue;
      if (key !== "pic") {
        if (res[key]) continue;
        var body = get(bs + skip, Math.min(fs - skip, 4096));
        if (fUnsync) body = unsync(body);
        if (body.length < 2) continue;
        var v = list(decode(body[0], body, 1, body.length));
        if (key === "genre") { v = v.replace(/\(\d+\)/g, "").trim(); if (/^\d+$/.test(v)) v = ""; if (/^\(?[A-Za-z]/.test(v) === false) v = ""; }
        if (v) res[key] = v;
        continue;
      }
      if (fUnsync) continue;
      var head = get(bs + skip, Math.min(fs - skip, 8192)), enc = head[0], i = 1;
      if (head.length < 8) continue;
      if (ver === 2) i = 4;
      else { while (i < head.length && head[i] !== 0) i++; i++; }
      var ptype = head[i++];
      if (enc === 1 || enc === 2) { while (i + 1 < head.length && !(head[i] === 0 && head[i + 1] === 0)) i += 2; i += 2; }
      else { while (i < head.length && head[i] !== 0) i++; i++; }
      if (i >= head.length) continue;
      if (mem) offerPic(ptype, 0, fs - skip - i, mem.subarray(bs - 10 + skip + i, bs - 10 + fs));
      else offerPic(ptype, bs + skip + i, fs - skip - i, null);
    }
    return true;
  }


  function id3v1() {
    if (total < 128) return;
    var t = rd(total - 128, 128);
    if (t[0] !== 0x54 || t[1] !== 0x41 || t[2] !== 0x47) return;
    var f = function (s, e) { return tidy(latin1(t, s, e)); };
    if (!res.title) res.title = f(3, 33);
    if (!res.artist) res.artist = f(33, 63);
    if (!res.album) res.album = f(63, 93);
  }


  function flac() {
    var p = 4, guard = 0;
    while (guard++ < 128) {
      var h = rd(p, 4);
      if (h.length < 4) break;
      var last = h[0] & 0x80, type = h[0] & 0x7F, len = (h[1] << 16) | (h[2] << 8) | h[3], bs = p + 4;
      if (type === 4) {
        var b = rd(bs, Math.min(len, 1 << 20)), q = 4 + u32le(b, 0), cnt = u32le(b, q), got = {};
        q += 4;
        for (var k = 0; k < cnt && q + 4 <= b.length; k++) {
          var l = u32le(b, q); q += 4;
          var s = utf8(b, q, Math.min(q + l, b.length)); q += l;
          var eq = s.indexOf("=");
          if (eq < 1) continue;
          var name = s.substr(0, eq).toUpperCase(), val = tidy(s.substr(eq + 1));
          if (!val) continue;
          var map = { TITLE: "title", ARTIST: "artist", ALBUMARTIST: "albumartist", ALBUM: "album", GENRE: "genre" }[name];
          if (map) got[map] = got[map] ? got[map] + ", " + val : val;
        }
        for (var g in got) if (!res[g]) res[g] = got[g];
      } else if (type === 6) {
        var d = rd(bs, Math.min(len, 8192)), ptype = u32(d, 0), ml = u32(d, 4), dl = u32(d, 8 + ml), at = 8 + ml + 4 + dl + 16;
        if (at + 4 <= d.length) { var dlen = u32(d, at); offerPic(ptype, bs + at + 4, dlen, null); }
      }
      p = bs + len;
      if (last) break;
    }
  }


  function boxes(start, end) {
    var out = [], p = start, guard = 0;
    while (p + 8 <= end && guard++ < 5000) {
      var h = rd(p, 16);
      if (h.length < 8) break;
      var sz = u32(h, 0), hdr = 8, type = latin1(h, 4, 8);
      if (sz === 1 && h.length >= 16) { sz = u32(h, 8) * 4294967296 + u32(h, 12); hdr = 16; }
      else if (sz === 0) sz = end - p;
      if (sz < hdr) break;
      out.push({ type: type, cs: p + hdr, ce: Math.min(end, p + sz) });
      p += sz;
    }
    return out;
  }
  function pick(list_, type) { for (var i = 0; i < list_.length; i++) if (list_[i].type === type) return list_[i]; return null; }
  function mp4() {
    var moov = pick(boxes(0, total), "moov");
    var udta = moov && pick(boxes(moov.cs, moov.ce), "udta");
    var meta = udta && pick(boxes(udta.cs, udta.ce), "meta");
    var ilst = meta && pick(boxes(meta.cs + 4, meta.ce), "ilst");
    if (!ilst) return;
    boxes(ilst.cs, ilst.ce).forEach(function (it) {
      var d = pick(boxes(it.cs, it.ce), "data");
      if (!d) return;
      var len = d.ce - d.cs - 8;
      if (len <= 0) return;
      if (it.type === "covr") { offerPic(3, d.cs + 8, len, null); return; }
      var key = { "\u00A9nam": "title", "\u00A9ART": "artist", "aART": "albumartist", "\u00A9alb": "album", "\u00A9gen": "genre" }[it.type];
      if (!key || res[key]) return;
      var v = tidy(utf8(rd(d.cs + 8, Math.min(len, 2048)), 0, Math.min(len, 2048)));
      if (v) res[key] = v;
    });
  }

  var head = rd(0, 12);
  if (head.length >= 8 && latin1(head, 4, 8) === "ftyp") mp4();
  else if (head.length >= 4 && latin1(head, 0, 4) === "fLaC") flac();
  else { id3v2(); id3v1(); }

  if (best) {
    var info = sniff(best.mem ? best.mem.subarray(0, 65536) : rd(best.off, Math.min(best.len, 65536)));
    if (info && info.w > 0 && info.h > 0) {
      res.pic = {
        ext: info.ext, w: info.w, h: info.h, len: best.len,
        chunk: function (i, count) {
          count = Math.min(count, best.len - i);
          return best.mem ? encode(best.mem.subarray(i, i + count)) : range(best.off + i, count);
        }
      };
    }
  }
  return res;
}

module.exports = { scan: scan };

};
window.__SP_MODULES["scripts/games.js"]=function(module,exports,require){





module.exports = function (U) {
  var LW = U.LW, LH = U.LH, HEAD = U.HEAD, clamp = U.clamp, ctext = U.ctext, BLUE = U.BLUE;
  var HI = "#4aa6ee";

  function rnd(n) { return Math.floor(Math.random() * n); }
  function shuffled(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }


  function Klondike() {
    var CW = 34, CH = 46, GAP = (LW - 7 * CW) / 8;
    var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var SUITS = ["s", "h", "d", "c"];
    var g = { live: false };
    var stock, waste, found, tab, ci, depth, hold, hi, dests, won, moves, hint;

    function red(s) { return s === "h" || s === "d"; }
    function colX(i) { return GAP + i * (CW + GAP); }
    var TY = HEAD + 4, BY = TY + CH + 6;

    function deal() {
      var deck = [];
      SUITS.forEach(function (s) { for (var r = 0; r < 13; r++) deck.push({ r: r, s: s, up: false }); });
      deck = shuffled(deck);
      stock = []; waste = []; found = [[], [], [], []]; tab = [];
      for (var i = 0; i < 7; i++) {
        var col = [];
        for (var k = 0; k <= i; k++) col.push(deck.pop());
        col[col.length - 1].up = true;
        tab.push(col);
      }
      stock = deck;
      ci = 0; depth = 1; hold = null; won = false; moves = 0; hint = "";
    }

    function targets() {
      var t = [{ z: "stock", i: 0 }, { z: "waste", i: 0 }];
      for (var i = 0; i < 4; i++) t.push({ z: "found", i: i });
      for (var j = 0; j < 7; j++) t.push({ z: "tab", i: j });
      return t;
    }
    var TG = targets();
    function pile(z, i) { return z === "stock" ? stock : z === "waste" ? waste : z === "found" ? found[i] : tab[i]; }
    function ups(col) { var n = 0; for (var i = 0; i < col.length; i++) if (col[i].up) n++; return n; }

    function canDrop(cards, z, i) {
      var c0 = cards[0];
      if (z === "found") {
        if (cards.length !== 1) return false;
        var f = found[i];
        if (!f.length) return c0.r === 0;
        var top = f[f.length - 1];
        return top.s === c0.s && c0.r === top.r + 1;
      }
      if (z === "tab") {
        var t = tab[i];
        if (!t.length) return c0.r === 12;
        var tp = t[t.length - 1];
        return tp.up && red(tp.s) !== red(c0.s) && tp.r === c0.r + 1;
      }
      return false;
    }
    function takeCards() {
      var src = pile(hold.z, hold.i);
      return src.slice(src.length - hold.n);
    }
    function listDests() {
      var cards = takeCards(), out = [{ z: hold.z, i: hold.i, cancel: true }];
      TG.forEach(function (t) {
        if ((t.z === "found" || t.z === "tab") && !(t.z === hold.z && t.i === hold.i) && canDrop(cards, t.z, t.i)) out.push({ z: t.z, i: t.i });
      });
      return out;
    }
    function flip(z, i) {
      if (z !== "tab") return;
      var t = tab[i];
      if (t.length && !t[t.length - 1].up) t[t.length - 1].up = true;
    }
    function checkWin() {
      var n = 0; found.forEach(function (f) { n += f.length; });
      if (n === 52) { won = true; hold = null; }
    }
    function moveCards(fz, fi, n, tz, ti) {
      var src = pile(fz, fi), cards = src.splice(src.length - n, n), dst = pile(tz, ti);
      cards.forEach(function (c) { dst.push(c); });
      flip(fz, fi); moves++; checkWin();
    }
    function autoMove() {
      var any = true, count = 0;
      while (any) {
        any = false;
        var srcs = [{ z: "waste", i: 0 }];
        for (var k = 0; k < 7; k++) srcs.push({ z: "tab", i: k });
        for (var s = 0; s < srcs.length && !any; s++) {
          var p = pile(srcs[s].z, srcs[s].i);
          if (!p.length) continue;
          var top = p[p.length - 1];
          if (!top.up) continue;
          for (var f = 0; f < 4; f++) {
            if (canDrop([top], "found", f)) { moveCards(srcs[s].z, srcs[s].i, 1, "found", f); any = true; count++; break; }
          }
        }
      }
      hint = count ? "" : "No moves to foundations";
    }

    g.start = function () { deal(); };
    g.update = function () {};
    g.wheel = function (dir) {
      hint = "";
      if (won) return;
      if (hold) { hi = clamp(hi + dir, 0, dests.length - 1); return; }
      var n = clamp(ci + dir, 0, TG.length - 1);
      if (n !== ci) { ci = n; depth = 1; }
    };
    g.skip = function (dir) {
      if (hold || won) return;
      var t = TG[ci];
      if (t.z !== "tab") return;
      var u = ups(tab[t.i]);
      depth = clamp(depth + (dir > 0 ? 1 : -1), 1, Math.max(1, u));
    };
    g.playpause = function () { if (!hold && !won) autoMove(); };
    g.center = function () {
      hint = "";
      if (won) { deal(); return; }
      var t = TG[ci];
      if (hold) {
        var d = dests[hi];
        if (d.cancel) { hold = null; return; }
        moveCards(hold.z, hold.i, hold.n, d.z, d.i);
        hold = null; depth = 1;
        return;
      }
      if (t.z === "stock") {
        if (stock.length) { var c = stock.pop(); c.up = true; waste.push(c); moves++; }
        else if (waste.length) { while (waste.length) { var w = waste.pop(); w.up = false; stock.push(w); } moves++; }
        return;
      }
      var p = pile(t.z, t.i);
      if (!p.length) return;
      var n = t.z === "tab" ? clamp(depth, 1, ups(p)) : 1;
      if (n < 1) return;
      hold = { z: t.z, i: t.i, n: n };
      dests = listDests();
      hi = dests.length > 1 ? 1 : 0;
    };
    g.menu = function () {
      if (hold) { hold = null; return true; }
      return false;
    };


    function suit(c, s, cx, cy, r, col) {
      if (s === "d") {
        c.fillPath(new U.Path().moveTo(cx, cy - r).lineTo(cx + r * 0.72, cy).lineTo(cx, cy + r).lineTo(cx - r * 0.72, cy).close(), col);
      } else if (s === "h") {
        c.circle(cx - r * 0.5, cy - r * 0.3, r * 0.55, col, 0); c.circle(cx + r * 0.5, cy - r * 0.3, r * 0.55, col, 0);
        c.fillPath(new U.Path().moveTo(cx - r * 1.03, cy - r * 0.1).lineTo(cx, cy + r).lineTo(cx + r * 1.03, cy - r * 0.1).close(), col);
      } else if (s === "s") {
        c.circle(cx - r * 0.5, cy + r * 0.1, r * 0.55, col, 0); c.circle(cx + r * 0.5, cy + r * 0.1, r * 0.55, col, 0);
        c.fillPath(new U.Path().moveTo(cx - r * 1.03, cy + r * 0.0).lineTo(cx, cy - r).lineTo(cx + r * 1.03, cy + r * 0.0).close(), col);
        c.fillPath(new U.Path().moveTo(cx, cy).lineTo(cx - r * 0.38, cy + r).lineTo(cx + r * 0.38, cy + r).close(), col);
      } else {
        c.circle(cx, cy - r * 0.5, r * 0.5, col, 0); c.circle(cx - r * 0.55, cy + r * 0.2, r * 0.5, col, 0); c.circle(cx + r * 0.55, cy + r * 0.2, r * 0.5, col, 0);
        c.fillPath(new U.Path().moveTo(cx, cy).lineTo(cx - r * 0.38, cy + r).lineTo(cx + r * 0.38, cy + r).close(), col);
      }
    }
    function face(c, x, y, card, cut) {
      c.fillRect(x, y, CW, CH, "#ffffff", 3);
      c.strokeRect(x + 0.5, y + 0.5, CW - 1, CH - 1, "#00000050", 1, 3);
      var col = red(card.s) ? "#d4202c" : "#111111";
      ctext(c, RANKS[card.r], x + 3, y + 11, { size: 10, bold: true, color: col });
      suit(c, card.s, x + CW - 8, y + 8, 4, col);
      if (!cut) suit(c, card.s, x + CW / 2, y + CH / 2 + 5, 9, col);
    }
    function back(c, x, y) {
      c.fillRect(x, y, CW, CH, "#ffffff", 3);
      c.fillRect(x + 2, y + 2, CW - 4, CH - 4, "#2a5db0", 2);
      for (var k = 1; k < 5; k++) c.line(x + 2, y + 2 + k * 8, x + CW - 2, y + 2 + k * 8, "#ffffff40", 1);
      c.strokeRect(x + 0.5, y + 0.5, CW - 1, CH - 1, "#00000050", 1, 3);
    }
    function slot(c, x, y) { c.strokeRect(x + 0.5, y + 0.5, CW - 1, CH - 1, "#ffffff55", 1, 3); }
    function cols(col) {
      var downs = 0, u = 0, i;
      for (i = 0; i < col.length; i++) { if (col[i].up) u++; else downs++; }
      var avail = LH - BY - 3, off = clamp(Math.floor((avail - CH - downs * 4) / Math.max(1, u - 1)), 5, 13), ys = [], y = BY;
      for (i = 0; i < col.length; i++) { ys.push(y); y += col[i].up ? off : 4; }
      return ys;
    }
    function ring(c, x, y, w, h) { c.strokeRect(x - 1, y - 1, w + 2, h + 2, HI, 2, 4); }

    g.draw = function (c) {
      c.fillRect(0, 0, LW, LH, "#0e6b34");
      var i, k;

      if (stock.length) back(c, colX(0), TY); else slot(c, colX(0), TY);
      if (waste.length) face(c, colX(1), TY, waste[waste.length - 1]); else slot(c, colX(1), TY);
      for (i = 0; i < 4; i++) {
        if (found[i].length) face(c, colX(3 + i), TY, found[i][found[i].length - 1]);
        else { slot(c, colX(3 + i), TY); suit(c, SUITS[i], colX(3 + i) + CW / 2, TY + CH / 2, 6, "#ffffff40"); }
      }

      var yss = [];
      for (i = 0; i < 7; i++) {
        var col = tab[i], ys = cols(col); yss.push(ys);
        if (!col.length) slot(c, colX(i), BY);
        for (k = 0; k < col.length; k++) {
          var last = k === col.length - 1;
          if (hold && hold.z === "tab" && hold.i === i && k >= col.length - hold.n) continue;
          if (col[k].up) face(c, colX(i), ys[k], col[k], !last); else back(c, colX(i), ys[k]);
        }
      }
      if (hold && hold.z === "waste" && waste.length) {
        c.fillRect(colX(1), TY, CW, CH, "#0e6b34");
        if (waste.length > 1) face(c, colX(1), TY, waste[waste.length - 2]); else slot(c, colX(1), TY);
      }

      var cur = hold ? dests[hi] : TG[ci], cx = colX(cur.z === "tab" ? cur.i : cur.z === "stock" ? 0 : cur.z === "waste" ? 1 : 3 + cur.i);
      if (hold) {
        var cards = takeCards(), base, dy = 0;
        if (cur.z === "tab") {
          var t = tab[cur.i];
          if (cur.cancel) {
            var ys0 = yss[cur.i]; base = ys0[t.length - hold.n] != null ? ys0[t.length - hold.n] : BY;
          } else base = t.length ? yss[cur.i][t.length - 1] + 12 : BY;
        } else base = TY;
        if (!cur.cancel || cur.z !== "tab") base += 0;
        c.save(); c.shadow("#00000090", 4, 0, 2);
        cards.forEach(function (cd, n) { face(c, cx, base + n * 12, cd, n < cards.length - 1); });
        c.restore();
        ring(c, cx, base, CW, CH + (cards.length - 1) * 12);
      } else if (cur.z === "tab") {
        var col2 = tab[cur.i], yy = yss[cur.i];
        if (!col2.length) ring(c, cx, BY, CW, CH);
        else {
          var d0 = clamp(depth, 1, Math.max(1, ups(col2))), top0 = yy[col2.length - d0];
          ring(c, cx, top0, CW, yy[col2.length - 1] + CH - top0);
        }
      } else ring(c, cx, TY, CW, CH);
      U.header(c, "Klondike");
      if (hint) ctext(c, hint, LW / 2, LH - 4, { size: 10, bold: true, color: "#ffffff", align: "center" });
      if (won) {
        c.fillRect(0, HEAD, LW, LH - HEAD, "#000000a0");
        ctext(c, "You Win!", LW / 2, LH / 2, { size: 16, bold: true, color: "#ffffff", align: "center" });
        ctext(c, moves + " moves   Center: New Game", LW / 2, LH / 2 + 20, { size: 11, color: "#ffffff", align: "center" });
      }
    };
    return g;
  }



  function Vortex() {
    var g = { live: false };
    var FY = HEAD, FH = LH - HEAD;
    var COLORS = ["#e04040", "#f2892b", "#f4d03f", "#4cb862", "#34b3b0", "#2f7fd8", "#8a5cd0", "#f08cb1"];
    var level, score, lives, bricks, ball, pad, tx, state, paused, flash, bw, bh, left;

    function build() {
      var rows = Math.min(8, 3 + Math.floor((level + 1) / 2)), cols = 8, i, j;
      bw = (LW - 12) / cols; bh = 11; bricks = [];
      for (i = 0; i < rows; i++) for (j = 0; j < cols; j++) {
        if (level % 3 === 0 && (i + j) % 4 === 3) continue;
        if (level % 3 === 2 && j % 3 === 1 && i % 2 === 1) continue;
        bricks.push({ x: 6 + j * bw, y: FY + 22 + i * (bh + 2), hp: i < Math.floor(level / 3) + (level > 2 ? 1 : 0) ? 2 : 1, c: COLORS[i % COLORS.length] });
      }
      left = bricks.length;
    }
    function serve() { ball = { x: pad.x + pad.w / 2, y: pad.y - 5, vx: 0, vy: 0, r: 4, stuck: true }; }
    function speed() { return 130 + level * 14; }
    function newGame() {
      level = 1; score = 0; lives = 3; state = "play"; paused = false; flash = 0;
      pad = { w: 46, h: 6, x: LW / 2 - 23, y: LH - 12 }; tx = pad.x;
      build(); serve();
    }
    g.start = function () { newGame(); g.live = true; };
    g.wheel = function (dir) { if (state !== "play") return; tx = clamp(tx + dir * 15, 0, LW - pad.w); };
    g.skip = function () {};
    g.playpause = function () { if (state === "play") { paused = !paused; g.live = !paused; } };
    g.center = function () {
      if (state === "over") { newGame(); g.live = true; return; }
      if (paused) { paused = false; g.live = true; return; }
      if (ball.stuck) {
        var a = (Math.random() * 40 - 20) * Math.PI / 180, s = speed();
        ball.vx = s * Math.sin(a); ball.vy = -s * Math.cos(a); ball.stuck = false;
      }
    };
    g.menu = function () {
      if (!paused && state === "play" && !ball.stuck) { paused = true; g.live = false; return true; }
      return false;
    };
    g.update = function (dt) {
      if (paused || state !== "play") return;
      dt = Math.min(dt, 0.05);
      pad.x += (tx - pad.x) * (1 - Math.exp(-22 * dt));
      if (flash > 0) flash -= dt;
      if (ball.stuck) { ball.x = pad.x + pad.w / 2; ball.y = pad.y - ball.r - 1; return; }
      var sp = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy), n = Math.max(1, Math.ceil(sp * dt / 2.5)), k;
      for (k = 0; k < n; k++) {
        ball.x += ball.vx * dt / n; ball.y += ball.vy * dt / n;
        if (ball.x < ball.r) { ball.x = ball.r; ball.vx = Math.abs(ball.vx); }
        if (ball.x > LW - ball.r) { ball.x = LW - ball.r; ball.vx = -Math.abs(ball.vx); }
        if (ball.y < FY + ball.r) { ball.y = FY + ball.r; ball.vy = Math.abs(ball.vy); }
        if (ball.vy > 0 && ball.y + ball.r >= pad.y && ball.y - ball.r <= pad.y + pad.h && ball.x >= pad.x - ball.r && ball.x <= pad.x + pad.w + ball.r) {
          var hit = clamp((ball.x - (pad.x + pad.w / 2)) / (pad.w / 2 + ball.r), -1, 1), a = hit * 62 * Math.PI / 180, s = speed();
          ball.vx = s * Math.sin(a); ball.vy = -s * Math.cos(a); ball.y = pad.y - ball.r;
        }
        for (var i = 0; i < bricks.length; i++) {
          var b = bricks[i]; if (b.hp <= 0) continue;
          var nx = clamp(ball.x, b.x, b.x + bw - 1), ny = clamp(ball.y, b.y, b.y + bh), dx = ball.x - nx, dy = ball.y - ny;
          if (dx * dx + dy * dy < ball.r * ball.r) {
            if (Math.abs(dx) > Math.abs(dy)) ball.vx = dx > 0 ? Math.abs(ball.vx) : -Math.abs(ball.vx);
            else ball.vy = dy > 0 ? Math.abs(ball.vy) : -Math.abs(ball.vy);
            b.hp--; score += 10 * level; if (b.hp <= 0) left--;
            break;
          }
        }
        if (left <= 0) { level++; build(); serve(); flash = 1.2; return; }
        if (ball.y > LH + 6) {
          lives--;
          if (lives <= 0) { state = "over"; g.live = false; return; }
          serve(); return;
        }
      }
    };
    g.draw = function (c) {
      c.fillRect(0, 0, LW, LH, c.linearGradient(0, 0, 0, LH, ["#10163a", "#05060f"]));
      var i;
      for (i = 0; i < bricks.length; i++) {
        var b = bricks[i]; if (b.hp <= 0) continue;
        c.fillRect(b.x, b.y, bw - 1, bh, b.c, 2);
        c.fillRect(b.x, b.y, bw - 1, bh / 2, "#ffffff30", 2);
        if (b.hp > 1) c.strokeRect(b.x + 0.5, b.y + 0.5, bw - 2, bh - 1, "#ffffffb0", 1, 2);
      }
      c.fillRect(pad.x, pad.y, pad.w, pad.h, c.linearGradient(0, pad.y, 0, pad.y + pad.h, ["#e8eaee", "#8c9098"]), 3);
      c.circle(ball.x, ball.y, ball.r, "#ffffff", 0);
      U.header(c, "Vortex");
      ctext(c, "Score " + score, 6, FY + 13, { size: 10, bold: true, color: "#ffffff" });
      ctext(c, "Level " + level, LW / 2, FY + 13, { size: 10, bold: true, color: "#ffffff", align: "center" });
      for (i = 0; i < lives; i++) c.circle(LW - 10 - i * 11, FY + 9, 3.5, "#ffffff", 0);
      if (state === "play" && ball.stuck) ctext(c, "Center: Serve", LW / 2, LH - 24, { size: 11, color: "#ffffffb0", align: "center" });
      if (flash > 0) ctext(c, "Level " + level, LW / 2, LH / 2, { size: 16, bold: true, color: "#ffffff", align: "center" });
      if (paused) {
        c.fillRect(0, FY, LW, FH, "#000000a0");
        ctext(c, "Paused", LW / 2, LH / 2, { size: 16, bold: true, color: "#ffffff", align: "center" });
        ctext(c, "Center: Resume   Menu: Exit", LW / 2, LH / 2 + 20, { size: 11, color: "#ffffff", align: "center" });
      }
      if (state === "over") {
        c.fillRect(0, FY, LW, FH, "#000000b0");
        ctext(c, "Game Over", LW / 2, LH / 2 - 6, { size: 16, bold: true, color: "#ffffff", align: "center" });
        ctext(c, "Score " + score, LW / 2, LH / 2 + 14, { size: 12, color: "#ffffff", align: "center" });
        ctext(c, "Center: New Game", LW / 2, LH / 2 + 32, { size: 11, color: "#ffffffb0", align: "center" });
      }
    };
    return g;
  }



  function Quiz() {
    var g = { live: false };
    var ROUNDS = 8, TIME = 12, REVEAL = 1.8;
    var state, round, score, qi, opts, sel, picked, t, rt, last, streak;

    function enough() { return U.T.length >= 2; }
    function nextRound() {
      round++;
      if (round > ROUNDS) { state = "end"; U.stopClip(); g.live = false; return; }
      var n = U.T.length, pick;
      do { pick = rnd(n); } while (n > 1 && pick === last);
      last = pick; qi = pick;
      var others = shuffled(U.T.map(function (_, i) { return i; }).filter(function (i) { return i !== pick; })).slice(0, 3);
      opts = shuffled(others.concat([pick]));
      sel = 0; picked = -1; t = TIME; state = "play"; g.live = true;
      U.playClip(pick);
    }
    function answer(n) {
      picked = n; state = "reveal"; rt = REVEAL;
      if (n >= 0 && opts[n] === qi) { score += 100 + Math.round(t * 10); streak++; } else streak = 0;
    }
    g.start = function () { state = "intro"; round = 0; score = 0; last = -1; streak = 0; g.live = false; };
    g.update = function (dt) {
      dt = Math.min(dt, 0.1);
      if (state === "play") { t -= dt; if (t <= 0) { t = 0; answer(-1); } }
      else if (state === "reveal") { rt -= dt; if (rt <= 0) nextRound(); }
    };
    g.wheel = function (dir) { if (state === "play") sel = clamp(sel + dir, 0, opts.length - 1); };
    g.skip = function () {};
    g.playpause = function () {};
    g.center = function () {
      if (state === "intro" && enough()) { round = 0; score = 0; streak = 0; nextRound(); return; }
      if (state === "play") answer(sel);
      else if (state === "reveal") { rt = 0; }
      else if (state === "end") { g.start(); }
    };
    g.menu = function () { U.stopClip(); return false; };
    g.draw = function (c) {
      c.fillRect(0, 0, LW, LH, "#ffffff");
      U.header(c, "Music Quiz");
      var y0 = HEAD;
      if (!enough()) {
        ctext(c, "Add at least two songs", LW / 2, LH / 2, { size: 13, bold: true, color: "#000000", align: "center" });
        return;
      }
      if (state === "intro") {
        ctext(c, "Music Quiz", LW / 2, y0 + 50, { size: 16, bold: true, color: "#000000", align: "center" });
        ctext(c, "Name the song that is playing.", LW / 2, y0 + 74, { size: 12, color: "#707074", align: "center" });
        ctext(c, ROUNDS + " rounds, " + TIME + " seconds each.", LW / 2, y0 + 92, { size: 12, color: "#707074", align: "center" });
        ctext(c, "Press Center to start", LW / 2, y0 + 124, { size: 12, bold: true, color: "#1766cc", align: "center" });
        return;
      }
      if (state === "end") {
        ctext(c, "Quiz Over", LW / 2, y0 + 50, { size: 16, bold: true, color: "#000000", align: "center" });
        ctext(c, "Score " + score, LW / 2, y0 + 78, { size: 22, bold: true, color: "#000000", align: "center" });
        ctext(c, "Center: Play Again", LW / 2, y0 + 112, { size: 12, bold: true, color: "#1766cc", align: "center" });
        return;
      }
      ctext(c, "Round " + round + " of " + ROUNDS, 8, y0 + 16, { size: 11, bold: true, color: "#000000" });
      ctext(c, "Score " + score, LW - 8, y0 + 16, { size: 11, bold: true, color: "#000000", align: "right" });
      c.fillRect(8, y0 + 24, LW - 16, 4, "#d9dadd", 2);
      var f = clamp(t / TIME, 0, 1);
      if (f > 0.02) c.fillRect(8, y0 + 24, (LW - 16) * f, 4, f < 0.25 ? "#df303b" : HI, 2);
      ctext(c, "Which song is playing?", LW / 2, y0 + 48, { size: 12, color: "#707074", align: "center" });
      var rh = Math.min(30, Math.floor((LH - y0 - 62) / 4));
      for (var i = 0; i < opts.length; i++) {
        var y = y0 + 58 + i * rh, on = state === "play" && i === sel, right = opts[i] === qi, fg = "#000000";
        if (on) { c.fillRect(0, y, LW, rh, c.linearGradient(0, y, 0, y + rh, BLUE)); fg = "#ffffff"; }
        if (state === "reveal") {
          if (right) { c.fillRect(0, y, LW, rh, "#4cb862"); fg = "#ffffff"; }
          else if (i === picked) { c.fillRect(0, y, LW, rh, "#df303b"); fg = "#ffffff"; }
        }
        ctext(c, U.T[opts[i]].title, 10, y + rh / 2 + 4, { size: 12, bold: true, color: fg, maxWidth: LW - 20 });
      }
      if (state === "reveal") {
        var msg = picked < 0 ? "Time's up" : (opts[picked] === qi ? "Correct!" : "Not quite");
        ctext(c, msg, LW / 2, LH - 6, { size: 11, bold: true, color: picked >= 0 && opts[picked] === qi ? "#2f9a2a" : "#df303b", align: "center" });
      }
    };
    return g;
  }

  return { list: [["Klondike", Klondike], ["Music Quiz", Quiz], ["Vortex", Vortex]] };
};

};
window.__SP_MODULES["scripts/ipodfont.js"]=function(module,exports,require){

module.exports = {"S":4,"sizes":{"r":[10,11,12],"b":[10,11,12,13,14,16,52]},"f":{"r10":{"g":{" ":[0,0,0,0,0,0,11.0],"!":[0,0,15,33,-2,-31,11.0],"\"":[16,0,18,33,-2,-31,14.0],"#":[35,0,27,33,-2,-31,22.0],"$":[63,0,26,40,-2,-33,22.0],"%":[90,0,40,33,-2,-30,36.0],"&":[131,0,31,34,-2,-31,27.0],"'":[163,0,12,33,-2,-31,8.0],"(":[176,0,17,41,-2,-31,13.0],")":[194,0,17,41,-2,-31,13.0],"*":[212,0,20,33,-2,-31,16.0],"+":[233,0,27,25,-2,-23,23.0],",":[261,0,15,14,-2,-6,11.0],"-":[277,0,17,17,-2,-15,13.0],".":[295,0,15,8,-2,-6,11.0],"/":[311,0,17,33,-2,-31,11.0],"0":[329,0,26,33,-2,-30,22.0],"1":[356,0,26,32,-2,-30,22.0],"2":[383,0,26,32,-2,-30,22.0],"3":[410,0,26,33,-2,-30,22.0],"4":[437,0,26,32,-2,-30,22.0],"5":[464,0,26,33,-2,-30,22.0],"6":[491,0,26,33,-2,-30,22.0],"7":[518,0,26,32,-2,-30,22.0],"8":[545,0,26,33,-2,-30,22.0],"9":[572,0,26,33,-2,-30,22.0],":":[599,0,15,26,-2,-24,11.0],";":[615,0,15,32,-2,-24,11.0],"<":[631,0,28,26,-2,-24,23.0],"=":[660,0,27,20,-2,-18,23.0],">":[688,0,28,26,-2,-24,23.0],"?":[717,0,26,33,-2,-31,22.0],"@":[744,0,45,35,-2,-32,41.0],"A":[790,0,31,33,-2,-31,27.0],"B":[822,0,31,33,-2,-31,27.0],"C":[854,0,33,35,-2,-32,29.0],"D":[888,0,33,33,-2,-31,29.0],"E":[922,0,31,33,-2,-31,27.0],"F":[954,0,28,33,-2,-31,24.0],"G":[983,0,35,35,-2,-32,31.0],"H":[1019,0,33,33,-2,-31,29.0],"I":[1053,0,15,33,-2,-31,11.0],"J":[1069,0,24,34,-2,-31,20.0],"K":[1094,0,31,33,-2,-31,27.0],"L":[1126,0,26,33,-2,-31,22.0],"M":[1153,0,37,33,-2,-31,33.0],"N":[1191,0,33,34,-2,-32,29.0],"O":[1225,0,35,35,-2,-32,31.0],"P":[1261,0,31,33,-2,-31,27.0],"Q":[1293,0,35,37,-2,-32,31.0],"R":[1329,0,33,33,-2,-31,29.0],"S":[1363,0,31,35,-2,-32,27.0],"T":[1395,0,28,33,-2,-31,24.0],"U":[1424,0,33,35,-2,-32,29.0],"V":[1458,0,31,33,-2,-31,27.0],"W":[1490,0,42,33,-2,-31,38.0],"X":[1533,0,31,33,-2,-31,27.0],"Y":[1565,0,31,34,-2,-32,27.0],"Z":[1597,0,28,34,-2,-32,24.0],"[":[1626,0,15,41,-2,-31,11.0],"\\":[1642,0,19,33,-4,-31,11.0],"]":[1662,0,15,41,-2,-31,11.0],"^":[1678,0,23,33,-2,-31,19.0],"_":[1702,0,27,9,-2,-2,22.0],"`":[1730,0,17,33,-2,-31,13.0],"a":[1748,0,26,27,-2,-24,22.0],"b":[1775,0,26,34,-2,-31,22.0],"c":[1802,0,24,27,-2,-24,20.0],"d":[1827,0,26,34,-2,-31,22.0],"e":[1854,0,26,27,-2,-24,22.0],"f":[1881,0,15,33,-2,-31,11.0],"g":[1897,0,26,34,-2,-24,22.0],"h":[1924,0,26,33,-2,-31,22.0],"i":[1951,0,13,33,-2,-31,9.0],"j":[1965,0,14,41,-3,-31,9.0],"k":[1980,0,24,33,-2,-31,20.0],"l":[2005,0,13,33,-2,-31,9.0],"m":[0,42,37,26,-2,-24,33.0],"n":[38,42,26,26,-2,-24,22.0],"o":[65,42,26,27,-2,-24,22.0],"p":[92,42,26,34,-2,-24,22.0],"q":[119,42,26,34,-2,-24,22.0],"r":[146,42,17,26,-2,-24,13.0],"s":[164,42,24,27,-2,-24,20.0],"t":[189,42,15,32,-2,-30,11.0],"u":[205,42,26,27,-2,-24,22.0],"v":[232,42,24,26,-2,-24,20.0],"w":[257,42,33,26,-2,-24,29.0],"x":[291,42,24,25,-2,-23,20.0],"y":[316,42,24,34,-2,-24,20.0],"z":[341,42,24,26,-2,-24,20.0],"{":[366,42,18,41,-3,-31,13.0],"|":[385,42,14,33,-2,-31,10.0],"}":[400,42,19,41,-2,-31,13.0],"~":[420,42,28,18,-2,-16,23.0]," ":[0,0,0,0,0,0,11.0],"¡":[449,42,17,33,-2,-24,13.0],"¢":[467,42,26,34,-2,-27,22.0],"£":[494,42,26,34,-2,-31,22.0],"¤":[521,42,26,27,-2,-25,22.0],"¥":[548,42,28,32,-3,-30,22.0],"¦":[577,42,14,33,-2,-31,10.0],"§":[592,42,26,41,-2,-31,22.0],"¨":[619,42,17,33,-2,-31,13.0],"©":[637,42,34,33,-2,-31,29.0],"ª":[672,42,19,34,-2,-32,15.0],"«":[692,42,26,23,-2,-21,22.0],"¬":[719,42,27,20,-2,-18,23.0],"®":[747,42,34,33,-2,-31,29.0],"¯":[782,42,17,31,-2,-29,13.0],"°":[800,42,20,32,-2,-30,16.0],"±":[821,42,26,23,-2,-21,22.0],"²":[848,42,17,32,-2,-30,13.0],"³":[866,42,17,32,-2,-30,13.0],"´":[884,42,17,33,-2,-31,13.0],"µ":[902,42,29,34,-4,-24,23.0],"¶":[932,42,26,40,-3,-31,21.0],"·":[1195,87,15,20,-2,-18,11.0],"¸":[975,42,17,13,-2,-2,13.0],"¹":[993,42,17,32,-2,-30,13.0],"º":[1011,42,19,34,-2,-32,15.0],"»":[1031,42,26,23,-2,-21,22.0],"¼":[1058,42,37,33,-2,-30,33.0],"½":[1096,42,37,33,-2,-30,33.0],"¾":[1134,42,37,33,-2,-30,33.0],"¿":[1172,42,28,33,-2,-24,24.0],"À":[1201,42,31,41,-2,-39,27.0],"Á":[1233,42,31,41,-2,-39,27.0],"Â":[1265,42,31,41,-2,-39,27.0],"Ã":[1297,42,31,41,-2,-39,27.0],"Ä":[1329,42,31,41,-2,-39,27.0],"Å":[1361,42,31,43,-2,-41,27.0],"Æ":[1393,42,44,33,-2,-31,40.0],"Ç":[1438,42,33,44,-2,-32,29.0],"È":[1472,42,31,41,-2,-39,27.0],"É":[1504,42,31,41,-2,-39,27.0],"Ê":[1536,42,31,41,-2,-39,27.0],"Ë":[1568,42,31,41,-2,-39,27.0],"Ì":[1600,42,15,41,-2,-39,11.0],"Í":[1616,42,15,41,-2,-39,11.0],"Î":[1632,42,17,41,-3,-39,11.0],"Ï":[1650,42,15,39,-2,-37,11.0],"Ð":[1666,42,33,33,-2,-31,29.0],"Ñ":[1700,42,33,41,-2,-39,29.0],"Ò":[1734,42,35,43,-2,-40,31.0],"Ó":[1770,42,35,43,-2,-40,31.0],"Ô":[1806,42,35,43,-2,-40,31.0],"Õ":[1842,42,35,43,-2,-40,31.0],"Ö":[1878,42,35,43,-2,-40,31.0],"×":[1914,42,27,25,-2,-23,23.0],"Ø":[1942,42,35,36,-2,-33,31.0],"Ù":[1978,42,33,42,-2,-39,29.0],"Ú":[2012,42,33,42,-2,-39,29.0],"Û":[0,87,33,42,-2,-39,29.0],"Ü":[34,87,33,42,-2,-39,29.0],"Ý":[68,87,31,41,-2,-39,27.0],"Þ":[100,87,31,33,-2,-31,27.0],"ß":[132,87,28,34,-2,-31,24.0],"à":[161,87,26,34,-2,-31,22.0],"á":[188,87,26,34,-2,-31,22.0],"â":[215,87,26,34,-2,-31,22.0],"ã":[242,87,26,34,-2,-31,22.0],"ä":[269,87,26,34,-2,-31,22.0],"å":[296,87,26,37,-2,-34,22.0],"æ":[323,87,40,27,-2,-24,36.0],"ç":[364,87,24,34,-2,-24,20.0],"è":[389,87,26,34,-2,-31,22.0],"é":[416,87,26,34,-2,-31,22.0],"ê":[443,87,26,34,-2,-31,22.0],"ë":[470,87,26,34,-2,-31,22.0],"ì":[497,87,15,33,-2,-31,11.0],"í":[513,87,15,33,-2,-31,11.0],"î":[529,87,17,33,-3,-31,11.0],"ï":[547,87,15,33,-2,-31,11.0],"ð":[563,87,26,37,-2,-34,22.0],"ñ":[590,87,26,33,-2,-31,22.0],"ò":[617,87,26,34,-2,-31,22.0],"ó":[644,87,26,34,-2,-31,22.0],"ô":[671,87,26,34,-2,-31,22.0],"õ":[698,87,26,34,-2,-31,22.0],"ö":[725,87,26,34,-2,-31,22.0],"÷":[752,87,26,23,-2,-21,22.0],"ø":[779,87,28,27,-2,-24,24.0],"ù":[808,87,26,34,-2,-31,22.0],"ú":[835,87,26,34,-2,-31,22.0],"û":[862,87,26,34,-2,-31,22.0],"ü":[889,87,26,34,-2,-31,22.0],"ý":[916,87,24,41,-2,-31,20.0],"þ":[941,87,26,41,-2,-31,22.0],"ÿ":[968,87,24,41,-2,-31,20.0],"…":[993,87,44,8,-2,-6,40.0],"’":[1038,87,13,33,-2,-31,9.0],"‘":[1052,87,13,33,-2,-31,9.0],"“":[1066,87,17,33,-2,-31,13.0],"”":[1084,87,17,33,-2,-31,13.0],"–":[1102,87,28,17,-3,-15,22.0],"—":[1131,87,44,17,-2,-15,40.0],"•":[1176,87,18,23,-2,-21,14.0],"€":[1211,87,34,30,-2,-28,30.0],"™":[1246,87,44,33,-2,-31,40.0]},"k":"kwu"},"r11":{"g":{" ":[0,0,0,0,0,0,12.0],"!":[0,0,16,36,-2,-34,12.0],"\"":[17,0,20,36,-2,-34,16.0],"#":[38,0,29,36,-2,-34,24.0],"$":[68,0,28,43,-2,-36,24.0],"%":[97,0,43,36,-2,-33,39.0],"&":[141,0,33,37,-2,-34,29.0],"'":[175,0,12,36,-2,-34,8.0],"(":[188,0,19,45,-2,-34,15.0],")":[208,0,19,45,-2,-34,15.0],"*":[228,0,21,36,-2,-34,17.0],"+":[250,0,30,25,-2,-23,26.0],",":[281,0,16,15,-2,-6,12.0],"-":[298,0,19,18,-2,-16,15.0],".":[318,0,16,8,-2,-6,12.0],"/":[335,0,18,36,-2,-34,12.0],"0":[354,0,28,36,-2,-33,24.0],"1":[383,0,28,35,-2,-33,24.0],"2":[412,0,28,35,-2,-33,24.0],"3":[441,0,28,36,-2,-33,24.0],"4":[470,0,28,35,-2,-33,24.0],"5":[499,0,28,36,-2,-33,24.0],"6":[528,0,28,36,-2,-33,24.0],"7":[557,0,28,35,-2,-33,24.0],"8":[586,0,28,36,-2,-33,24.0],"9":[615,0,28,36,-2,-33,24.0],":":[644,0,16,28,-2,-26,12.0],";":[661,0,16,35,-2,-26,12.0],"<":[678,0,30,28,-2,-26,26.0],"=":[709,0,30,22,-2,-20,26.0],">":[740,0,30,28,-2,-26,26.0],"?":[771,0,28,36,-2,-34,24.0],"@":[800,0,49,38,-2,-35,45.0],"A":[850,0,33,36,-2,-34,29.0],"B":[884,0,33,36,-2,-34,29.0],"C":[918,0,36,38,-2,-35,32.0],"D":[955,0,36,36,-2,-34,32.0],"E":[992,0,33,36,-2,-34,29.0],"F":[1026,0,31,36,-2,-34,27.0],"G":[1058,0,38,38,-2,-35,34.0],"H":[1097,0,36,36,-2,-34,32.0],"I":[1134,0,16,36,-2,-34,12.0],"J":[1151,0,26,37,-2,-34,22.0],"K":[1178,0,34,36,-2,-34,29.0],"L":[1213,0,28,36,-2,-34,24.0],"M":[1242,0,41,36,-2,-34,37.0],"N":[1284,0,36,37,-2,-35,32.0],"O":[1321,0,38,38,-2,-35,34.0],"P":[1360,0,33,36,-2,-34,29.0],"Q":[1394,0,38,40,-2,-35,34.0],"R":[1433,0,36,36,-2,-34,32.0],"S":[1470,0,33,38,-2,-35,29.0],"T":[1504,0,31,36,-2,-34,27.0],"U":[1536,0,36,38,-2,-35,32.0],"V":[1573,0,33,36,-2,-34,29.0],"W":[1607,0,46,36,-2,-34,42.0],"X":[1654,0,33,36,-2,-34,29.0],"Y":[1688,0,34,37,-2,-35,29.0],"Z":[1723,0,31,37,-2,-35,27.0],"[":[1755,0,16,45,-2,-34,12.0],"\\":[1772,0,21,36,-4,-34,12.0],"]":[1794,0,16,45,-2,-34,12.0],"^":[1811,0,25,36,-2,-34,21.0],"_":[1837,0,29,10,-2,-2,24.0],"`":[1867,0,19,36,-2,-34,15.0],"a":[1887,0,28,29,-2,-26,24.0],"b":[1916,0,28,37,-2,-34,24.0],"c":[1945,0,26,29,-2,-26,22.0],"d":[1972,0,28,37,-2,-34,24.0],"e":[2001,0,28,29,-2,-26,24.0],"f":[2030,0,16,36,-2,-34,12.0],"g":[0,46,28,37,-2,-26,24.0],"h":[29,46,28,36,-2,-34,24.0],"i":[58,46,14,36,-2,-34,10.0],"j":[73,46,15,45,-3,-34,10.0],"k":[89,46,26,36,-2,-34,22.0],"l":[116,46,14,36,-2,-34,10.0],"m":[131,46,41,28,-2,-26,37.0],"n":[173,46,28,28,-2,-26,24.0],"o":[202,46,28,29,-2,-26,24.0],"p":[231,46,28,37,-2,-26,24.0],"q":[260,46,28,37,-2,-26,24.0],"r":[289,46,19,28,-2,-26,15.0],"s":[309,46,26,29,-2,-26,22.0],"t":[336,46,16,35,-2,-33,12.0],"u":[353,46,28,29,-2,-26,24.0],"v":[382,46,26,28,-2,-26,22.0],"w":[409,46,36,28,-2,-26,32.0],"x":[446,46,26,28,-2,-26,22.0],"y":[473,46,26,37,-2,-26,22.0],"z":[500,46,26,28,-2,-26,22.0],"{":[527,46,20,45,-3,-34,15.0],"|":[548,46,15,36,-2,-34,11.0],"}":[564,46,20,45,-2,-34,15.0],"~":[585,46,30,20,-2,-18,26.0]," ":[0,0,0,0,0,0,12.0],"¡":[616,46,19,36,-2,-26,15.0],"¢":[636,46,28,37,-2,-30,24.0],"£":[665,46,28,37,-2,-34,24.0],"¤":[694,46,28,30,-2,-28,24.0],"¥":[723,46,30,35,-3,-33,24.0],"¦":[754,46,15,36,-2,-34,11.0],"§":[770,46,28,45,-2,-34,24.0],"¨":[799,46,19,36,-2,-34,15.0],"©":[819,46,36,36,-2,-34,32.0],"ª":[856,46,20,37,-2,-35,16.0],"«":[877,46,28,24,-2,-22,24.0],"¬":[906,46,30,22,-2,-20,26.0],"®":[937,46,36,36,-2,-34,32.0],"¯":[974,46,19,35,-2,-33,15.0],"°":[994,46,22,35,-2,-33,18.0],"±":[1017,46,28,26,-2,-24,24.0],"²":[1046,46,19,35,-2,-33,15.0],"³":[1066,46,19,35,-2,-33,15.0],"´":[1086,46,19,36,-2,-34,15.0],"µ":[1106,46,31,37,-4,-26,25.0],"¶":[1138,46,29,44,-3,-34,24.0],"·":[1588,94,16,22,-2,-20,12.0],"¸":[1185,46,19,13,-2,-2,15.0],"¹":[1205,46,19,35,-2,-33,15.0],"º":[1225,46,20,37,-2,-35,16.0],"»":[1246,46,28,24,-2,-22,24.0],"¼":[1275,46,41,36,-2,-33,37.0],"½":[1317,46,41,36,-2,-33,37.0],"¾":[1359,46,41,36,-2,-33,37.0],"¿":[1401,46,31,36,-2,-26,27.0],"À":[1433,46,33,44,-2,-42,29.0],"Á":[1467,46,33,44,-2,-42,29.0],"Â":[1501,46,33,44,-2,-42,29.0],"Ã":[1535,46,33,44,-2,-42,29.0],"Ä":[1569,46,33,44,-2,-42,29.0],"Å":[1603,46,33,46,-2,-44,29.0],"Æ":[1637,46,48,36,-2,-34,44.0],"Ç":[1686,46,36,47,-2,-35,32.0],"È":[1723,46,33,44,-2,-42,29.0],"É":[1757,46,33,44,-2,-42,29.0],"Ê":[1791,46,33,44,-2,-42,29.0],"Ë":[1825,46,33,44,-2,-42,29.0],"Ì":[1859,46,16,44,-2,-42,12.0],"Í":[1876,46,16,44,-2,-42,12.0],"Î":[1893,46,18,44,-3,-42,12.0],"Ï":[1912,46,16,43,-2,-41,12.0],"Ð":[1929,46,36,36,-2,-34,32.0],"Ñ":[1966,46,36,44,-2,-42,32.0],"Ò":[2003,46,38,46,-2,-43,34.0],"Ó":[0,94,38,46,-2,-43,34.0],"Ô":[39,94,38,46,-2,-43,34.0],"Õ":[78,94,38,46,-2,-43,34.0],"Ö":[117,94,38,46,-2,-43,34.0],"×":[156,94,30,26,-2,-24,26.0],"Ø":[187,94,38,39,-2,-36,34.0],"Ù":[226,94,36,45,-2,-42,32.0],"Ú":[263,94,36,45,-2,-42,32.0],"Û":[300,94,36,45,-2,-42,32.0],"Ü":[337,94,36,45,-2,-42,32.0],"Ý":[374,94,34,44,-2,-42,29.0],"Þ":[409,94,33,36,-2,-34,29.0],"ß":[443,94,31,37,-2,-34,27.0],"à":[475,94,28,37,-2,-34,24.0],"á":[504,94,28,37,-2,-34,24.0],"â":[533,94,28,37,-2,-34,24.0],"ã":[562,94,28,37,-2,-34,24.0],"ä":[591,94,28,37,-2,-34,24.0],"å":[620,94,28,40,-2,-37,24.0],"æ":[649,94,43,29,-2,-26,39.0],"ç":[693,94,26,37,-2,-26,22.0],"è":[720,94,28,37,-2,-34,24.0],"é":[749,94,28,37,-2,-34,24.0],"ê":[778,94,28,37,-2,-34,24.0],"ë":[807,94,28,37,-2,-34,24.0],"ì":[836,94,16,36,-2,-34,12.0],"í":[853,94,16,36,-2,-34,12.0],"î":[870,94,18,36,-3,-34,12.0],"ï":[889,94,16,36,-2,-34,12.0],"ð":[906,94,28,40,-2,-37,24.0],"ñ":[935,94,28,36,-2,-34,24.0],"ò":[964,94,28,37,-2,-34,24.0],"ó":[993,94,28,37,-2,-34,24.0],"ô":[1022,94,28,37,-2,-34,24.0],"õ":[1051,94,28,37,-2,-34,24.0],"ö":[1080,94,28,37,-2,-34,24.0],"÷":[1109,94,28,25,-2,-23,24.0],"ø":[1138,94,31,30,-2,-27,27.0],"ù":[1170,94,28,37,-2,-34,24.0],"ú":[1199,94,28,37,-2,-34,24.0],"û":[1228,94,28,37,-2,-34,24.0],"ü":[1257,94,28,37,-2,-34,24.0],"ý":[1286,94,26,45,-2,-34,22.0],"þ":[1313,94,28,45,-2,-34,24.0],"ÿ":[1342,94,26,45,-2,-34,22.0],"…":[1369,94,48,8,-2,-6,44.0],"’":[1418,94,14,36,-2,-34,10.0],"‘":[1433,94,14,36,-2,-34,10.0],"“":[1448,94,19,36,-2,-34,15.0],"”":[1468,94,19,36,-2,-34,15.0],"–":[1488,94,30,18,-3,-16,24.0],"—":[1519,94,48,18,-2,-16,44.0],"•":[1568,94,19,25,-2,-23,15.0],"€":[1605,94,37,32,-2,-30,33.0],"™":[1643,94,48,36,-2,-34,44.0]},"k":"kwu"},"r12":{"g":{" ":[0,0,0,0,0,0,13.0],"!":[0,0,17,39,-2,-37,13.0],"\"":[18,0,21,39,-2,-37,17.0],"#":[40,0,31,39,-2,-37,27.0],"$":[72,0,31,47,-2,-39,27.0],"%":[104,0,47,39,-2,-36,43.0],"&":[152,0,36,40,-2,-37,32.0],"'":[189,0,13,39,-2,-37,9.0],"(":[203,0,20,48,-2,-37,16.0],")":[224,0,20,48,-2,-37,16.0],"*":[245,0,23,39,-2,-37,19.0],"+":[269,0,32,28,-2,-26,28.0],",":[302,0,17,15,-2,-6,13.0],"-":[320,0,20,19,-2,-17,16.0],".":[341,0,17,8,-2,-6,13.0],"/":[359,0,19,39,-2,-37,13.0],"0":[379,0,31,39,-2,-36,27.0],"1":[411,0,31,38,-2,-36,27.0],"2":[443,0,31,38,-2,-36,27.0],"3":[475,0,31,39,-2,-36,27.0],"4":[507,0,31,38,-2,-36,27.0],"5":[539,0,31,39,-2,-36,27.0],"6":[571,0,31,39,-2,-36,27.0],"7":[603,0,31,38,-2,-36,27.0],"8":[635,0,31,39,-2,-36,27.0],"9":[667,0,31,39,-2,-36,27.0],":":[699,0,17,30,-2,-28,13.0],";":[717,0,17,37,-2,-28,13.0],"<":[735,0,32,30,-2,-28,28.0],"=":[768,0,32,23,-2,-21,28.0],">":[801,0,32,30,-2,-28,28.0],"?":[834,0,31,39,-2,-37,27.0],"@":[866,0,53,41,-2,-38,49.0],"A":[920,0,36,39,-2,-37,32.0],"B":[957,0,36,39,-2,-37,32.0],"C":[994,0,39,41,-2,-38,35.0],"D":[1034,0,39,39,-2,-37,35.0],"E":[1074,0,36,39,-2,-37,32.0],"F":[1111,0,33,39,-2,-37,29.0],"G":[1145,0,41,41,-2,-38,37.0],"H":[1187,0,39,39,-2,-37,35.0],"I":[1227,0,17,38,-2,-36,13.0],"J":[1245,0,28,40,-2,-37,24.0],"K":[1274,0,36,39,-2,-37,32.0],"L":[1311,0,31,39,-2,-37,27.0],"M":[1343,0,44,39,-2,-37,40.0],"N":[1388,0,39,40,-2,-38,35.0],"O":[1428,0,41,41,-2,-38,37.0],"P":[1470,0,36,39,-2,-37,32.0],"Q":[1507,0,41,43,-2,-38,37.0],"R":[1549,0,39,39,-2,-37,35.0],"S":[1589,0,36,41,-2,-38,32.0],"T":[1626,0,33,39,-2,-37,29.0],"U":[1660,0,39,41,-2,-38,35.0],"V":[1700,0,36,39,-2,-37,32.0],"W":[1737,0,49,39,-2,-37,45.0],"X":[1787,0,36,39,-2,-37,32.0],"Y":[1824,0,36,40,-2,-38,32.0],"Z":[1861,0,33,40,-2,-38,29.0],"[":[1895,0,17,48,-2,-37,13.0],"\\":[1913,0,22,39,-4,-37,13.0],"]":[1936,0,17,48,-2,-37,13.0],"^":[1954,0,27,39,-2,-37,23.0],"_":[1982,0,31,10,-2,-2,27.0],"`":[2014,0,20,39,-2,-37,16.0],"a":[0,49,31,31,-2,-28,27.0],"b":[32,49,31,40,-2,-37,27.0],"c":[64,49,28,31,-2,-28,24.0],"d":[93,49,31,40,-2,-37,27.0],"e":[125,49,31,31,-2,-28,27.0],"f":[157,49,17,39,-2,-37,13.0],"g":[175,49,31,40,-2,-28,27.0],"h":[207,49,31,39,-2,-37,27.0],"i":[239,49,15,39,-2,-37,11.0],"j":[255,49,16,49,-3,-37,11.0],"k":[272,49,28,39,-2,-37,24.0],"l":[301,49,15,39,-2,-37,11.0],"m":[317,49,44,30,-2,-28,40.0],"n":[362,49,31,30,-2,-28,27.0],"o":[394,49,31,31,-2,-28,27.0],"p":[426,49,31,40,-2,-28,27.0],"q":[458,49,31,40,-2,-28,27.0],"r":[490,49,20,30,-2,-28,16.0],"s":[511,49,28,31,-2,-28,24.0],"t":[540,49,17,36,-2,-34,13.0],"u":[558,49,31,31,-2,-28,27.0],"v":[590,49,28,30,-2,-28,24.0],"w":[619,49,39,30,-2,-28,35.0],"x":[659,49,28,30,-2,-28,24.0],"y":[688,49,28,40,-2,-28,24.0],"z":[717,49,28,30,-2,-28,24.0],"{":[746,49,22,48,-4,-37,16.0],"|":[769,49,16,39,-2,-37,12.0],"}":[786,49,21,48,-2,-37,16.0],"~":[808,49,32,22,-2,-20,28.0]," ":[0,0,0,0,0,0,13.0],"¡":[841,49,20,39,-2,-28,16.0],"¢":[862,49,31,40,-2,-32,27.0],"£":[894,49,31,40,-2,-37,27.0],"¤":[926,49,31,32,-2,-30,27.0],"¥":[958,49,32,38,-3,-36,27.0],"¦":[991,49,16,39,-2,-37,12.0],"§":[1008,49,31,49,-2,-37,27.0],"¨":[1040,49,20,39,-2,-37,16.0],"©":[1061,49,39,39,-2,-37,35.0],"ª":[1101,49,22,40,-2,-38,18.0],"«":[1124,49,31,26,-2,-24,27.0],"¬":[1156,49,32,23,-2,-21,28.0],"®":[1189,49,39,39,-2,-37,35.0],"¯":[1229,49,20,37,-2,-35,16.0],"°":[1250,49,23,38,-2,-36,19.0],"±":[1274,49,30,30,-2,-28,26.0],"²":[1305,49,20,38,-2,-36,16.0],"³":[1326,49,20,38,-2,-36,16.0],"´":[1347,49,20,39,-2,-37,16.0],"µ":[1368,49,34,40,-4,-28,28.0],"¶":[1403,49,31,48,-3,-37,26.0],"·":[22,152,17,23,-2,-21,13.0],"¸":[1453,49,20,15,-2,-2,16.0],"¹":[1474,49,20,38,-2,-36,16.0],"º":[1495,49,22,40,-2,-38,18.0],"»":[1518,49,31,26,-2,-24,27.0],"¼":[1550,49,44,39,-2,-36,40.0],"½":[1595,49,44,39,-2,-36,40.0],"¾":[1640,49,44,39,-2,-36,40.0],"¿":[1685,49,33,39,-2,-28,29.0],"À":[1719,49,36,48,-2,-46,32.0],"Á":[1756,49,36,48,-2,-46,32.0],"Â":[1793,49,36,48,-2,-46,32.0],"Ã":[1830,49,36,48,-2,-46,32.0],"Ä":[1867,49,36,48,-2,-46,32.0],"Å":[1904,49,36,50,-2,-48,32.0],"Æ":[1941,49,52,39,-2,-37,48.0],"Ç":[1994,49,39,51,-2,-38,35.0],"È":[0,101,36,48,-2,-46,32.0],"É":[37,101,36,48,-2,-46,32.0],"Ê":[74,101,36,48,-2,-46,32.0],"Ë":[111,101,36,48,-2,-46,32.0],"Ì":[148,101,17,48,-2,-46,13.0],"Í":[166,101,17,48,-2,-46,13.0],"Î":[184,101,19,48,-3,-46,13.0],"Ï":[204,101,17,47,-2,-45,13.0],"Ð":[222,101,39,39,-2,-37,35.0],"Ñ":[262,101,39,48,-2,-46,35.0],"Ò":[302,101,41,50,-2,-47,37.0],"Ó":[344,101,41,50,-2,-47,37.0],"Ô":[386,101,41,50,-2,-47,37.0],"Õ":[428,101,41,50,-2,-47,37.0],"Ö":[470,101,41,50,-2,-47,37.0],"×":[512,101,32,28,-2,-26,28.0],"Ø":[545,101,41,41,-2,-38,37.0],"Ù":[587,101,39,49,-2,-46,35.0],"Ú":[627,101,39,49,-2,-46,35.0],"Û":[667,101,39,49,-2,-46,35.0],"Ü":[707,101,39,49,-2,-46,35.0],"Ý":[747,101,36,48,-2,-46,32.0],"Þ":[784,101,36,39,-2,-37,32.0],"ß":[821,101,33,40,-2,-37,29.0],"à":[855,101,31,40,-2,-37,27.0],"á":[887,101,31,40,-2,-37,27.0],"â":[919,101,31,40,-2,-37,27.0],"ã":[951,101,31,40,-2,-37,27.0],"ä":[983,101,31,40,-2,-37,27.0],"å":[1015,101,31,43,-2,-40,27.0],"æ":[1047,101,47,31,-2,-28,43.0],"ç":[1095,101,28,40,-2,-28,24.0],"è":[1124,101,31,40,-2,-37,27.0],"é":[1156,101,31,40,-2,-37,27.0],"ê":[1188,101,31,40,-2,-37,27.0],"ë":[1220,101,31,40,-2,-37,27.0],"ì":[1252,101,17,39,-2,-37,13.0],"í":[1270,101,17,39,-2,-37,13.0],"î":[1288,101,19,39,-3,-37,13.0],"ï":[1308,101,17,39,-2,-37,13.0],"ð":[1326,101,31,43,-2,-40,27.0],"ñ":[1358,101,31,39,-2,-37,27.0],"ò":[1390,101,31,40,-2,-37,27.0],"ó":[1422,101,31,40,-2,-37,27.0],"ô":[1454,101,31,40,-2,-37,27.0],"õ":[1486,101,31,40,-2,-37,27.0],"ö":[1518,101,31,40,-2,-37,27.0],"÷":[1550,101,30,29,-2,-27,26.0],"ø":[1581,101,33,32,-2,-29,29.0],"ù":[1615,101,31,40,-2,-37,27.0],"ú":[1647,101,31,40,-2,-37,27.0],"û":[1679,101,31,40,-2,-37,27.0],"ü":[1711,101,31,40,-2,-37,27.0],"ý":[1743,101,28,49,-2,-37,24.0],"þ":[1772,101,31,49,-2,-37,27.0],"ÿ":[1804,101,28,49,-2,-37,24.0],"…":[1833,101,52,8,-2,-6,48.0],"’":[1886,101,15,38,-2,-36,11.0],"‘":[1902,101,15,39,-2,-37,11.0],"“":[1918,101,20,39,-2,-37,16.0],"”":[1939,101,20,39,-2,-37,16.0],"–":[1960,101,32,20,-3,-18,27.0],"—":[1993,101,52,20,-2,-18,48.0],"•":[0,152,21,26,-2,-24,17.0],"€":[40,152,40,35,-2,-33,36.0],"™":[81,152,52,39,-2,-37,48.0]},"k":"kwu"},"b10":{"g":{" ":[0,0,0,0,0,0,11.0],"!":[0,0,17,33,-2,-31,13.0],"\"":[18,0,23,33,-2,-31,19.0],"#":[42,0,27,32,-2,-30,22.0],"$":[70,0,26,40,-2,-33,22.0],"%":[97,0,40,34,-2,-31,36.0],"&":[138,0,33,33,-2,-31,29.0],"'":[172,0,14,33,-2,-31,10.0],"(":[187,0,17,41,-2,-31,13.0],")":[205,0,17,41,-2,-31,13.0],"*":[223,0,20,33,-2,-31,16.0],"+":[244,0,27,26,-2,-24,23.0],",":[272,0,15,17,-2,-8,11.0],"-":[288,0,17,18,-2,-16,13.0],".":[306,0,15,10,-2,-8,11.0],"/":[322,0,21,34,-5,-32,11.0],"0":[344,0,26,33,-2,-30,22.0],"1":[371,0,26,32,-2,-30,22.0],"2":[398,0,26,32,-2,-30,22.0],"3":[425,0,26,33,-2,-30,22.0],"4":[452,0,26,32,-2,-30,22.0],"5":[479,0,26,33,-2,-30,22.0],"6":[506,0,26,33,-2,-30,22.0],"7":[533,0,26,32,-2,-30,22.0],"8":[560,0,26,33,-2,-30,22.0],"9":[587,0,26,33,-2,-30,22.0],":":[614,0,17,25,-2,-23,13.0],";":[632,0,17,32,-2,-23,13.0],"<":[650,0,28,27,-2,-25,23.0],"=":[679,0,27,21,-2,-19,23.0],">":[707,0,28,27,-2,-25,23.0],"?":[736,0,28,33,-2,-31,24.0],"@":[765,0,43,34,-2,-32,39.0],"A":[809,0,33,33,-2,-31,29.0],"B":[843,0,33,33,-2,-31,29.0],"C":[877,0,33,35,-2,-32,29.0],"D":[911,0,33,33,-2,-31,29.0],"E":[945,0,31,33,-2,-31,27.0],"F":[977,0,28,33,-2,-31,24.0],"G":[1006,0,35,35,-2,-32,31.0],"H":[1042,0,33,33,-2,-31,29.0],"I":[1076,0,15,33,-2,-31,11.0],"J":[1092,0,26,34,-2,-31,22.0],"K":[1119,0,33,33,-2,-31,29.0],"L":[1153,0,28,33,-2,-31,24.0],"M":[1182,0,37,33,-2,-31,33.0],"N":[1220,0,33,33,-2,-31,29.0],"O":[1254,0,35,35,-2,-32,31.0],"P":[1290,0,31,33,-2,-31,27.0],"Q":[1322,0,35,37,-2,-32,31.0],"R":[1358,0,33,33,-2,-31,29.0],"S":[1392,0,31,35,-2,-32,27.0],"T":[1424,0,28,33,-2,-31,24.0],"U":[1453,0,33,34,-2,-31,29.0],"V":[1487,0,31,33,-2,-31,27.0],"W":[1519,0,42,33,-2,-31,38.0],"X":[1562,0,31,33,-2,-31,27.0],"Y":[1594,0,31,33,-2,-31,27.0],"Z":[1626,0,28,33,-2,-31,24.0],"[":[1655,0,17,41,-2,-31,13.0],"\\":[1673,0,21,34,-5,-32,11.0],"]":[1695,0,17,41,-2,-31,13.0],"^":[1713,0,27,33,-2,-31,23.0],"_":[1741,0,27,9,-2,-2,22.0],"`":[1769,0,17,34,-2,-32,13.0],"a":[1787,0,26,26,-2,-24,22.0],"b":[1814,0,28,33,-2,-31,24.0],"c":[1843,0,26,26,-2,-24,22.0],"d":[1870,0,28,33,-2,-31,24.0],"e":[1899,0,26,26,-2,-24,22.0],"f":[1926,0,17,33,-2,-31,13.0],"g":[1944,0,28,34,-2,-24,24.0],"h":[1973,0,28,33,-2,-31,24.0],"i":[2002,0,15,33,-2,-31,11.0],"j":[2018,0,15,41,-2,-31,11.0],"k":[0,42,27,33,-2,-31,22.0],"l":[28,42,15,33,-2,-31,11.0],"m":[44,42,40,26,-2,-24,36.0],"n":[85,42,28,26,-2,-24,24.0],"o":[114,42,28,26,-2,-24,24.0],"p":[143,42,28,34,-2,-24,24.0],"q":[172,42,28,34,-2,-24,24.0],"r":[201,42,20,26,-2,-24,16.0],"s":[222,42,26,26,-2,-24,22.0],"t":[249,42,17,32,-2,-29,13.0],"u":[267,42,28,26,-2,-24,24.0],"v":[296,42,26,26,-2,-24,22.0],"w":[323,42,35,25,-2,-23,31.0],"x":[359,42,26,26,-2,-24,22.0],"y":[386,42,26,34,-2,-24,22.0],"z":[413,42,24,26,-2,-24,20.0],"{":[438,42,20,41,-2,-31,16.0],"|":[459,42,15,33,-2,-31,11.0],"}":[475,42,20,41,-2,-31,16.0],"~":[496,42,29,19,-3,-17,23.0]," ":[0,0,0,0,0,0,11.0],"¡":[526,42,17,34,-2,-24,13.0],"¢":[544,42,26,33,-2,-27,22.0],"£":[571,42,26,33,-2,-31,22.0],"¤":[598,42,26,28,-2,-26,22.0],"¥":[625,42,28,32,-3,-30,22.0],"¦":[654,42,15,33,-2,-31,11.0],"§":[670,42,26,41,-2,-31,22.0],"¨":[697,42,18,33,-2,-31,13.0],"©":[716,42,34,33,-2,-31,29.0],"ª":[751,42,19,34,-2,-32,15.0],"«":[771,42,26,23,-2,-21,22.0],"¬":[798,42,27,21,-2,-19,23.0],"®":[826,42,34,33,-2,-31,29.0],"¯":[861,42,19,32,-3,-30,13.0],"°":[881,42,20,32,-2,-30,16.0],"±":[902,42,26,25,-2,-23,22.0],"²":[929,42,18,32,-2,-30,13.0],"³":[948,42,18,32,-2,-30,13.0],"´":[967,42,18,34,-2,-32,13.0],"µ":[986,42,29,35,-4,-24,23.0],"¶":[1016,42,27,40,-2,-31,22.0],"·":[1355,86,15,21,-2,-19,11.0],"¸":[1060,42,17,13,-2,-2,13.0],"¹":[1078,42,17,32,-2,-30,13.0],"º":[1096,42,19,34,-2,-32,15.0],"»":[1116,42,26,23,-2,-21,22.0],"¼":[1143,42,37,33,-2,-30,33.0],"½":[1181,42,37,33,-2,-30,33.0],"¾":[1219,42,37,33,-2,-30,33.0],"¿":[1257,42,28,34,-2,-24,24.0],"À":[1286,42,33,41,-2,-39,29.0],"Á":[1320,42,33,41,-2,-39,29.0],"Â":[1354,42,33,41,-2,-39,29.0],"Ã":[1388,42,33,41,-2,-39,29.0],"Ä":[1422,42,33,40,-2,-38,29.0],"Å":[1456,42,33,41,-2,-39,29.0],"Æ":[1490,42,44,33,-2,-31,40.0],"Ç":[1535,42,33,43,-2,-32,29.0],"È":[1569,42,31,41,-2,-39,27.0],"É":[1601,42,31,41,-2,-39,27.0],"Ê":[1633,42,31,41,-2,-39,27.0],"Ë":[1665,42,31,40,-2,-38,27.0],"Ì":[1697,42,16,42,-3,-40,11.0],"Í":[1714,42,17,42,-2,-40,11.0],"Î":[1732,42,19,42,-4,-40,11.0],"Ï":[1752,42,18,41,-3,-39,11.0],"Ð":[1771,42,33,33,-2,-31,29.0],"Ñ":[1805,42,33,41,-2,-39,29.0],"Ò":[1839,42,35,43,-2,-40,31.0],"Ó":[1875,42,35,43,-2,-40,31.0],"Ô":[1911,42,35,43,-2,-40,31.0],"Õ":[1947,42,35,43,-2,-40,31.0],"Ö":[1983,42,35,42,-2,-39,31.0],"×":[2019,42,27,26,-2,-24,23.0],"Ø":[0,86,35,35,-2,-32,31.0],"Ù":[36,86,33,42,-2,-39,29.0],"Ú":[70,86,33,42,-2,-39,29.0],"Û":[104,86,33,42,-2,-39,29.0],"Ü":[138,86,33,41,-2,-38,29.0],"Ý":[172,86,31,41,-2,-39,27.0],"Þ":[204,86,31,33,-2,-31,27.0],"ß":[236,86,28,33,-2,-31,24.0],"à":[265,86,26,34,-2,-32,22.0],"á":[292,86,26,34,-2,-32,22.0],"â":[319,86,26,34,-2,-32,22.0],"ã":[346,86,26,34,-2,-32,22.0],"ä":[373,86,26,33,-2,-31,22.0],"å":[400,86,26,35,-2,-33,22.0],"æ":[427,86,40,26,-2,-24,36.0],"ç":[468,86,26,34,-2,-24,22.0],"è":[495,86,26,34,-2,-32,22.0],"é":[522,86,26,34,-2,-32,22.0],"ê":[549,86,26,34,-2,-32,22.0],"ë":[576,86,26,33,-2,-31,22.0],"ì":[603,86,16,34,-3,-32,11.0],"í":[620,86,17,34,-2,-32,11.0],"î":[638,86,19,34,-4,-32,11.0],"ï":[658,86,18,33,-3,-31,11.0],"ð":[677,86,28,33,-2,-31,24.0],"ñ":[706,86,28,34,-2,-32,24.0],"ò":[735,86,28,34,-2,-32,24.0],"ó":[764,86,28,34,-2,-32,24.0],"ô":[793,86,28,34,-2,-32,24.0],"õ":[822,86,28,34,-2,-32,24.0],"ö":[851,86,28,33,-2,-31,24.0],"÷":[880,86,26,25,-2,-23,22.0],"ø":[907,86,28,27,-2,-25,24.0],"ù":[936,86,28,34,-2,-32,24.0],"ú":[965,86,28,34,-2,-32,24.0],"û":[994,86,28,34,-2,-32,24.0],"ü":[1023,86,28,33,-2,-31,24.0],"ý":[1052,86,26,42,-2,-32,22.0],"þ":[1079,86,28,41,-2,-31,24.0],"ÿ":[1108,86,26,41,-2,-31,22.0],"…":[1135,86,44,10,-2,-8,40.0],"’":[1180,86,15,33,-2,-31,11.0],"‘":[1196,86,15,33,-2,-31,11.0],"“":[1212,86,24,33,-2,-31,20.0],"”":[1237,86,24,33,-2,-31,20.0],"–":[1262,86,28,18,-3,-16,22.0],"—":[1291,86,44,18,-2,-16,40.0],"•":[1336,86,18,23,-2,-21,14.0],"€":[1371,86,34,30,-2,-28,30.0],"™":[1406,86,44,33,-2,-31,40.0]},"k":"kwu"},"b11":{"g":{" ":[0,0,0,0,0,0,12.0],"!":[0,0,19,36,-2,-34,15.0],"\"":[20,0,25,36,-2,-34,21.0],"#":[46,0,29,35,-2,-33,24.0],"$":[76,0,28,43,-2,-36,24.0],"%":[105,0,43,37,-2,-34,39.0],"&":[149,0,36,37,-2,-34,32.0],"'":[186,0,14,36,-2,-34,10.0],"(":[201,0,19,45,-2,-34,15.0],")":[221,0,19,45,-2,-34,15.0],"*":[241,0,21,36,-2,-34,17.0],"+":[263,0,30,28,-2,-26,26.0],",":[294,0,16,17,-2,-8,12.0],"-":[311,0,19,18,-2,-16,15.0],".":[331,0,16,10,-2,-8,12.0],"/":[348,0,22,37,-5,-35,12.0],"0":[371,0,28,36,-2,-33,24.0],"1":[400,0,28,35,-2,-33,24.0],"2":[429,0,28,35,-2,-33,24.0],"3":[458,0,28,36,-2,-33,24.0],"4":[487,0,28,35,-2,-33,24.0],"5":[516,0,28,36,-2,-33,24.0],"6":[545,0,28,36,-2,-33,24.0],"7":[574,0,28,35,-2,-33,24.0],"8":[603,0,28,36,-2,-33,24.0],"9":[632,0,28,36,-2,-33,24.0],":":[661,0,19,26,-2,-24,15.0],";":[681,0,19,33,-2,-24,15.0],"<":[701,0,30,29,-2,-25,26.0],"=":[732,0,30,22,-2,-20,26.0],">":[763,0,30,29,-2,-25,26.0],"?":[794,0,31,36,-2,-34,27.0],"@":[826,0,47,37,-2,-34,43.0],"A":[874,0,36,36,-2,-34,32.0],"B":[911,0,36,36,-2,-34,32.0],"C":[948,0,36,38,-2,-35,32.0],"D":[985,0,36,36,-2,-34,32.0],"E":[1022,0,33,36,-2,-34,29.0],"F":[1056,0,31,36,-2,-34,27.0],"G":[1088,0,38,38,-2,-35,34.0],"H":[1127,0,36,36,-2,-34,32.0],"I":[1164,0,16,36,-2,-34,12.0],"J":[1181,0,28,37,-2,-34,24.0],"K":[1210,0,36,36,-2,-34,32.0],"L":[1247,0,31,36,-2,-34,27.0],"M":[1279,0,41,36,-2,-34,37.0],"N":[1321,0,36,36,-2,-34,32.0],"O":[1358,0,38,38,-2,-35,34.0],"P":[1397,0,33,36,-2,-34,29.0],"Q":[1431,0,38,40,-2,-35,34.0],"R":[1470,0,36,36,-2,-34,32.0],"S":[1507,0,33,38,-2,-35,29.0],"T":[1541,0,31,36,-2,-34,27.0],"U":[1573,0,36,37,-2,-34,32.0],"V":[1610,0,33,36,-2,-34,29.0],"W":[1644,0,46,36,-2,-34,42.0],"X":[1691,0,33,36,-2,-34,29.0],"Y":[1725,0,33,36,-2,-34,29.0],"Z":[1759,0,31,36,-2,-34,27.0],"[":[1791,0,19,44,-2,-34,15.0],"\\":[1811,0,22,37,-5,-35,12.0],"]":[1834,0,19,44,-2,-34,15.0],"^":[1854,0,30,36,-2,-34,26.0],"_":[1885,0,29,10,-2,-2,24.0],"`":[1915,0,19,37,-2,-35,15.0],"a":[1935,0,28,29,-2,-26,24.0],"b":[1964,0,31,37,-2,-34,27.0],"c":[1996,0,28,29,-2,-26,24.0],"d":[0,46,31,37,-2,-34,27.0],"e":[32,46,28,29,-2,-26,24.0],"f":[61,46,19,36,-2,-34,15.0],"g":[81,46,31,37,-2,-26,27.0],"h":[113,46,31,36,-2,-34,27.0],"i":[145,46,16,36,-2,-34,12.0],"j":[162,46,16,45,-2,-34,12.0],"k":[179,46,29,36,-2,-34,24.0],"l":[209,46,16,36,-2,-34,12.0],"m":[226,46,43,28,-2,-26,39.0],"n":[270,46,31,28,-2,-26,27.0],"o":[302,46,31,29,-2,-26,27.0],"p":[334,46,31,37,-2,-26,27.0],"q":[366,46,31,37,-2,-26,27.0],"r":[398,46,21,28,-2,-26,17.0],"s":[420,46,28,29,-2,-26,24.0],"t":[449,46,19,35,-2,-32,15.0],"u":[469,46,31,29,-2,-26,27.0],"v":[501,46,28,28,-2,-26,24.0],"w":[530,46,38,27,-2,-25,34.0],"x":[569,46,28,28,-2,-26,24.0],"y":[598,46,28,37,-2,-26,24.0],"z":[627,46,26,28,-2,-26,22.0],"{":[654,46,21,45,-2,-34,17.0],"|":[676,46,16,36,-2,-34,12.0],"}":[693,46,21,45,-2,-34,17.0],"~":[715,46,31,21,-3,-19,26.0]," ":[0,0,0,0,0,0,12.0],"¡":[747,46,19,36,-2,-26,15.0],"¢":[767,46,28,37,-2,-30,24.0],"£":[796,46,28,37,-2,-34,24.0],"¤":[825,46,28,30,-2,-28,24.0],"¥":[854,46,30,35,-3,-33,24.0],"¦":[885,46,16,36,-2,-34,12.0],"§":[902,46,28,44,-2,-34,24.0],"¨":[931,46,19,36,-2,-34,15.0],"©":[951,46,37,36,-2,-34,32.0],"ª":[989,46,20,37,-2,-35,16.0],"«":[1010,46,28,26,-2,-24,24.0],"¬":[1039,46,30,24,-2,-22,26.0],"®":[1070,46,37,36,-2,-34,32.0],"¯":[1108,46,21,35,-3,-33,15.0],"°":[1130,46,22,35,-2,-33,18.0],"±":[1153,46,28,27,-2,-25,24.0],"²":[1182,46,19,35,-2,-33,15.0],"³":[1202,46,19,35,-2,-33,15.0],"´":[1222,46,19,37,-2,-35,15.0],"µ":[1242,46,32,38,-4,-26,25.0],"¶":[1275,46,29,44,-2,-34,24.0],"·":[1829,94,16,22,-2,-20,12.0],"¸":[1322,46,19,14,-2,-2,15.0],"¹":[1342,46,19,35,-2,-33,15.0],"º":[1362,46,20,37,-2,-35,16.0],"»":[1383,46,28,26,-2,-24,24.0],"¼":[1412,46,41,36,-2,-33,37.0],"½":[1454,46,41,36,-2,-33,37.0],"¾":[1496,46,41,36,-2,-33,37.0],"¿":[1538,46,31,37,-2,-26,27.0],"À":[1570,46,36,45,-2,-43,32.0],"Á":[1607,46,36,45,-2,-43,32.0],"Â":[1644,46,36,45,-2,-43,32.0],"Ã":[1681,46,36,45,-2,-43,32.0],"Ä":[1718,46,36,44,-2,-42,32.0],"Å":[1755,46,36,44,-2,-42,32.0],"Æ":[1792,46,48,36,-2,-34,44.0],"Ç":[1841,46,36,47,-2,-35,32.0],"È":[1878,46,33,45,-2,-43,29.0],"É":[1912,46,33,45,-2,-43,29.0],"Ê":[1946,46,33,45,-2,-43,29.0],"Ë":[1980,46,33,44,-2,-42,29.0],"Ì":[2014,46,18,46,-4,-44,12.0],"Í":[0,94,18,46,-2,-44,12.0],"Î":[19,94,20,46,-4,-44,12.0],"Ï":[40,94,19,45,-3,-43,12.0],"Ð":[60,94,36,36,-2,-34,32.0],"Ñ":[97,94,36,45,-2,-43,32.0],"Ò":[134,94,38,47,-2,-44,34.0],"Ó":[173,94,38,47,-2,-44,34.0],"Ô":[212,94,38,47,-2,-44,34.0],"Õ":[251,94,38,47,-2,-44,34.0],"Ö":[290,94,38,46,-2,-43,34.0],"×":[329,94,30,28,-2,-26,26.0],"Ø":[360,94,38,39,-2,-36,34.0],"Ù":[399,94,36,46,-2,-43,32.0],"Ú":[436,94,36,46,-2,-43,32.0],"Û":[473,94,36,46,-2,-43,32.0],"Ü":[510,94,36,45,-2,-42,32.0],"Ý":[547,94,33,45,-2,-43,29.0],"Þ":[581,94,33,36,-2,-34,29.0],"ß":[615,94,31,37,-2,-34,27.0],"à":[647,94,28,38,-2,-35,24.0],"á":[676,94,28,38,-2,-35,24.0],"â":[705,94,28,38,-2,-35,24.0],"ã":[734,94,28,38,-2,-35,24.0],"ä":[763,94,28,37,-2,-34,24.0],"å":[792,94,28,38,-2,-35,24.0],"æ":[821,94,43,29,-2,-26,39.0],"ç":[865,94,28,37,-2,-26,24.0],"è":[894,94,28,38,-2,-35,24.0],"é":[923,94,28,38,-2,-35,24.0],"ê":[952,94,28,38,-2,-35,24.0],"ë":[981,94,28,37,-2,-34,24.0],"ì":[1010,94,18,37,-4,-35,12.0],"í":[1029,94,18,37,-2,-35,12.0],"î":[1048,94,20,37,-4,-35,12.0],"ï":[1069,94,19,36,-3,-34,12.0],"ð":[1089,94,31,37,-2,-34,27.0],"ñ":[1121,94,31,37,-2,-35,27.0],"ò":[1153,94,31,38,-2,-35,27.0],"ó":[1185,94,31,38,-2,-35,27.0],"ô":[1217,94,31,38,-2,-35,27.0],"õ":[1249,94,31,38,-2,-35,27.0],"ö":[1281,94,31,37,-2,-34,27.0],"÷":[1313,94,28,25,-2,-23,24.0],"ø":[1342,94,31,29,-2,-26,27.0],"ù":[1374,94,31,38,-2,-35,27.0],"ú":[1406,94,31,38,-2,-35,27.0],"û":[1438,94,31,38,-2,-35,27.0],"ü":[1470,94,31,37,-2,-34,27.0],"ý":[1502,94,28,46,-2,-35,24.0],"þ":[1531,94,31,45,-2,-34,27.0],"ÿ":[1563,94,28,45,-2,-34,24.0],"…":[1592,94,48,10,-2,-8,44.0],"’":[1641,94,16,36,-2,-34,12.0],"‘":[1658,94,16,36,-2,-34,12.0],"“":[1675,94,26,36,-2,-34,22.0],"”":[1702,94,26,36,-2,-34,22.0],"–":[1729,94,30,19,-3,-17,24.0],"—":[1760,94,48,19,-2,-17,44.0],"•":[1809,94,19,25,-2,-23,15.0],"€":[1846,94,37,32,-2,-30,33.0],"™":[1884,94,48,36,-2,-34,44.0]},"k":"kwu"},"b12":{"g":{" ":[0,0,0,0,0,0,13.0],"!":[0,0,20,39,-2,-37,16.0],"\"":[21,0,27,39,-2,-37,23.0],"#":[49,0,31,38,-2,-36,27.0],"$":[81,0,31,48,-2,-40,27.0],"%":[113,0,47,40,-2,-37,43.0],"&":[161,0,39,40,-2,-37,35.0],"'":[201,0,15,39,-2,-37,11.0],"(":[217,0,20,49,-2,-37,16.0],")":[238,0,20,49,-2,-37,16.0],"*":[259,0,23,39,-2,-37,19.0],"+":[283,0,32,30,-2,-28,28.0],",":[316,0,17,19,-2,-9,13.0],"-":[334,0,20,20,-2,-18,16.0],".":[355,0,17,11,-2,-9,13.0],"/":[373,0,24,40,-5,-38,13.0],"0":[398,0,31,39,-2,-36,27.0],"1":[430,0,31,38,-2,-36,27.0],"2":[462,0,31,38,-2,-36,27.0],"3":[494,0,31,39,-2,-36,27.0],"4":[526,0,31,38,-2,-36,27.0],"5":[558,0,31,39,-2,-36,27.0],"6":[590,0,31,39,-2,-36,27.0],"7":[622,0,31,38,-2,-36,27.0],"8":[654,0,31,39,-2,-36,27.0],"9":[686,0,31,39,-2,-36,27.0],":":[718,0,20,29,-2,-27,16.0],";":[739,0,20,37,-2,-27,16.0],"<":[760,0,32,31,-2,-27,28.0],"=":[793,0,32,25,-2,-23,28.0],">":[826,0,32,31,-2,-27,28.0],"?":[859,0,33,39,-2,-37,29.0],"@":[893,0,51,41,-2,-38,47.0],"A":[945,0,39,39,-2,-37,35.0],"B":[985,0,39,39,-2,-37,35.0],"C":[1025,0,39,41,-2,-38,35.0],"D":[1065,0,39,39,-2,-37,35.0],"E":[1105,0,36,38,-2,-36,32.0],"F":[1142,0,33,39,-2,-37,29.0],"G":[1176,0,41,41,-2,-38,37.0],"H":[1218,0,39,39,-2,-37,35.0],"I":[1258,0,17,39,-2,-37,13.0],"J":[1276,0,31,40,-2,-37,27.0],"K":[1308,0,39,39,-2,-37,35.0],"L":[1348,0,33,39,-2,-37,29.0],"M":[1382,0,44,39,-2,-37,40.0],"N":[1427,0,39,39,-2,-37,35.0],"O":[1467,0,41,41,-2,-38,37.0],"P":[1509,0,36,39,-2,-37,32.0],"Q":[1546,0,41,43,-2,-38,37.0],"R":[1588,0,39,39,-2,-37,35.0],"S":[1628,0,36,41,-2,-38,32.0],"T":[1665,0,33,39,-2,-37,29.0],"U":[1699,0,39,40,-2,-37,35.0],"V":[1739,0,36,39,-2,-37,32.0],"W":[1776,0,49,39,-2,-37,45.0],"X":[1826,0,36,39,-2,-37,32.0],"Y":[1863,0,36,39,-2,-37,32.0],"Z":[1900,0,33,39,-2,-37,29.0],"[":[1934,0,20,48,-2,-37,16.0],"\\":[1955,0,24,40,-5,-38,13.0],"]":[1980,0,20,48,-2,-37,16.0],"^":[2001,0,32,39,-2,-37,28.0],"_":[0,50,31,10,-2,-2,27.0],"`":[32,50,20,40,-2,-38,16.0],"a":[53,50,31,31,-2,-28,27.0],"b":[85,50,33,40,-2,-37,29.0],"c":[119,50,31,31,-2,-28,27.0],"d":[151,50,33,40,-2,-37,29.0],"e":[185,50,31,31,-2,-28,27.0],"f":[217,50,20,39,-2,-37,16.0],"g":[238,50,33,40,-2,-28,29.0],"h":[272,50,33,39,-2,-37,29.0],"i":[306,50,17,39,-2,-37,13.0],"j":[324,50,17,49,-2,-37,13.0],"k":[342,50,31,39,-2,-37,27.0],"l":[374,50,17,39,-2,-37,13.0],"m":[392,50,47,30,-2,-28,43.0],"n":[440,50,33,30,-2,-28,29.0],"o":[474,50,33,31,-2,-28,29.0],"p":[508,50,33,40,-2,-28,29.0],"q":[542,50,33,40,-2,-28,29.0],"r":[576,50,23,30,-2,-28,19.0],"s":[600,50,31,31,-2,-28,27.0],"t":[632,50,20,37,-2,-34,16.0],"u":[653,50,33,31,-2,-28,29.0],"v":[687,50,31,30,-2,-28,27.0],"w":[719,50,41,30,-2,-28,37.0],"x":[761,50,31,30,-2,-28,27.0],"y":[793,50,31,40,-2,-28,27.0],"z":[825,50,28,30,-2,-28,24.0],"{":[854,50,23,49,-2,-37,19.0],"|":[878,50,17,39,-2,-37,13.0],"}":[896,50,23,49,-2,-37,19.0],"~":[920,50,34,22,-3,-20,28.0]," ":[0,0,0,0,0,0,13.0],"¡":[955,50,20,39,-2,-28,16.0],"¢":[976,50,31,40,-2,-32,27.0],"£":[1008,50,31,40,-2,-37,27.0],"¤":[1040,50,31,33,-2,-31,27.0],"¥":[1072,50,33,38,-3,-36,27.0],"¦":[1106,50,17,39,-2,-37,13.0],"§":[1124,50,31,49,-2,-37,27.0],"¨":[1156,50,20,39,-2,-37,16.0],"©":[1177,50,40,39,-2,-37,35.0],"ª":[1218,50,22,40,-2,-38,18.0],"«":[1241,50,31,27,-2,-25,27.0],"¬":[1273,50,32,25,-2,-23,28.0],"®":[1306,50,40,39,-2,-37,35.0],"¯":[1347,50,22,39,-3,-37,16.0],"°":[1370,50,23,38,-2,-36,19.0],"±":[1394,50,30,30,-2,-28,26.0],"²":[1425,50,20,38,-2,-36,16.0],"³":[1446,50,20,38,-2,-36,16.0],"´":[1467,50,21,40,-2,-38,16.0],"µ":[1489,50,35,41,-5,-28,28.0],"¶":[1525,50,31,47,-2,-37,27.0],"·":[255,152,17,24,-2,-22,13.0],"¸":[1575,50,20,15,-2,-2,16.0],"¹":[1596,50,20,38,-2,-36,16.0],"º":[1617,50,22,40,-2,-38,18.0],"»":[1640,50,31,27,-2,-25,27.0],"¼":[1672,50,44,39,-2,-36,40.0],"½":[1717,50,44,39,-2,-36,40.0],"¾":[1762,50,44,39,-2,-36,40.0],"¿":[1807,50,33,39,-2,-28,29.0],"À":[1841,50,39,49,-2,-47,35.0],"Á":[1881,50,39,49,-2,-47,35.0],"Â":[1921,50,39,49,-2,-47,35.0],"Ã":[1961,50,39,48,-2,-46,35.0],"Ä":[2001,50,39,48,-2,-46,35.0],"Å":[0,100,39,48,-2,-46,35.0],"Æ":[40,100,52,39,-2,-37,48.0],"Ç":[93,100,39,51,-2,-38,35.0],"È":[133,100,36,49,-2,-47,32.0],"É":[170,100,36,49,-2,-47,32.0],"Ê":[207,100,36,49,-2,-47,32.0],"Ë":[244,100,36,48,-2,-46,32.0],"Ì":[281,100,19,49,-4,-47,13.0],"Í":[301,100,19,49,-2,-47,13.0],"Î":[321,100,22,49,-4,-47,13.0],"Ï":[344,100,21,48,-4,-46,13.0],"Ð":[366,100,39,39,-2,-37,35.0],"Ñ":[406,100,39,48,-2,-46,35.0],"Ò":[446,100,41,51,-2,-48,37.0],"Ó":[488,100,41,51,-2,-48,37.0],"Ô":[530,100,41,51,-2,-48,37.0],"Õ":[572,100,41,50,-2,-47,37.0],"Ö":[614,100,41,50,-2,-47,37.0],"×":[656,100,32,30,-2,-28,28.0],"Ø":[689,100,41,41,-2,-38,37.0],"Ù":[731,100,39,50,-2,-47,35.0],"Ú":[771,100,39,50,-2,-47,35.0],"Û":[811,100,39,50,-2,-47,35.0],"Ü":[851,100,39,49,-2,-46,35.0],"Ý":[891,100,36,49,-2,-47,32.0],"Þ":[928,100,36,39,-2,-37,32.0],"ß":[965,100,33,40,-2,-37,29.0],"à":[999,100,31,41,-2,-38,27.0],"á":[1031,100,31,41,-2,-38,27.0],"â":[1063,100,31,41,-2,-38,27.0],"ã":[1095,100,31,40,-2,-37,27.0],"ä":[1127,100,31,40,-2,-37,27.0],"å":[1159,100,31,41,-2,-38,27.0],"æ":[1191,100,47,31,-2,-28,43.0],"ç":[1239,100,31,40,-2,-28,27.0],"è":[1271,100,31,41,-2,-38,27.0],"é":[1303,100,31,41,-2,-38,27.0],"ê":[1335,100,31,41,-2,-38,27.0],"ë":[1367,100,31,40,-2,-37,27.0],"ì":[1399,100,19,40,-4,-38,13.0],"í":[1419,100,19,40,-2,-38,13.0],"î":[1439,100,22,40,-4,-38,13.0],"ï":[1462,100,21,39,-4,-37,13.0],"ð":[1484,100,33,40,-2,-37,29.0],"ñ":[1518,100,33,39,-2,-37,29.0],"ò":[1552,100,33,41,-2,-38,29.0],"ó":[1586,100,33,41,-2,-38,29.0],"ô":[1620,100,33,41,-2,-38,29.0],"õ":[1654,100,33,40,-2,-37,29.0],"ö":[1688,100,33,40,-2,-37,29.0],"÷":[1722,100,30,30,-2,-28,26.0],"ø":[1753,100,33,31,-2,-28,29.0],"ù":[1787,100,33,41,-2,-38,29.0],"ú":[1821,100,33,41,-2,-38,29.0],"û":[1855,100,33,41,-2,-38,29.0],"ü":[1889,100,33,40,-2,-37,29.0],"ý":[1923,100,31,50,-2,-38,27.0],"þ":[1955,100,33,49,-2,-37,29.0],"ÿ":[1989,100,31,49,-2,-37,27.0],"…":[0,152,52,11,-2,-9,48.0],"’":[53,152,17,38,-2,-36,13.0],"‘":[71,152,17,39,-2,-37,13.0],"“":[89,152,28,39,-2,-37,24.0],"”":[118,152,28,39,-2,-37,24.0],"–":[147,152,32,21,-3,-19,27.0],"—":[180,152,52,21,-2,-19,48.0],"•":[233,152,21,26,-2,-24,17.0],"€":[273,152,40,35,-2,-33,36.0],"™":[314,152,52,39,-2,-37,48.0]},"k":"kwu"},"b13":{"g":{" ":[0,0,0,0,0,0,14.0],"!":[0,0,21,42,-2,-40,17.0],"\"":[22,0,29,42,-2,-40,25.0],"#":[52,0,33,41,-2,-39,29.0],"$":[86,0,33,51,-2,-43,29.0],"%":[120,0,50,43,-2,-40,46.0],"&":[171,0,42,43,-2,-40,38.0],"'":[214,0,16,42,-2,-40,12.0],"(":[231,0,21,52,-2,-40,17.0],")":[253,0,21,52,-2,-40,17.0],"*":[275,0,24,42,-2,-40,20.0],"+":[300,0,34,32,-2,-30,30.0],",":[335,0,18,20,-2,-9,14.0],"-":[354,0,21,21,-2,-19,17.0],".":[376,0,18,11,-2,-9,14.0],"/":[395,0,25,43,-5,-41,14.0],"0":[421,0,33,42,-2,-39,29.0],"1":[455,0,33,41,-2,-39,29.0],"2":[489,0,33,41,-2,-39,29.0],"3":[523,0,33,42,-2,-39,29.0],"4":[557,0,33,41,-2,-39,29.0],"5":[591,0,33,42,-2,-39,29.0],"6":[625,0,33,42,-2,-39,29.0],"7":[659,0,33,41,-2,-39,29.0],"8":[693,0,33,42,-2,-39,29.0],"9":[727,0,33,42,-2,-39,29.0],":":[761,0,21,30,-2,-28,17.0],";":[783,0,21,39,-2,-28,17.0],"<":[805,0,35,33,-2,-29,30.0],"=":[841,0,34,26,-2,-24,30.0],">":[876,0,35,33,-2,-29,30.0],"?":[912,0,36,42,-2,-40,32.0],"@":[949,0,55,45,-2,-42,51.0],"A":[1005,0,42,42,-2,-40,38.0],"B":[1048,0,42,42,-2,-40,38.0],"C":[1091,0,42,44,-2,-41,38.0],"D":[1134,0,42,42,-2,-40,38.0],"E":[1177,0,39,42,-2,-40,35.0],"F":[1217,0,36,42,-2,-40,32.0],"G":[1254,0,44,44,-2,-41,40.0],"H":[1299,0,42,42,-2,-40,38.0],"I":[1342,0,18,42,-2,-40,14.0],"J":[1361,0,33,43,-2,-40,29.0],"K":[1395,0,42,42,-2,-40,38.0],"L":[1438,0,36,42,-2,-40,32.0],"M":[1475,0,47,42,-2,-40,43.0],"N":[1523,0,42,42,-2,-40,38.0],"O":[1566,0,44,44,-2,-41,40.0],"P":[1611,0,39,42,-2,-40,35.0],"Q":[1651,0,44,46,-2,-41,40.0],"R":[1696,0,42,42,-2,-40,38.0],"S":[1739,0,39,44,-2,-41,35.0],"T":[1779,0,36,42,-2,-40,32.0],"U":[1816,0,42,43,-2,-40,38.0],"V":[1859,0,39,42,-2,-40,35.0],"W":[1899,0,53,42,-2,-40,49.0],"X":[1953,0,39,42,-2,-40,35.0],"Y":[1993,0,39,42,-2,-40,35.0],"Z":[0,53,36,42,-2,-40,32.0],"[":[37,53,21,52,-2,-40,17.0],"\\":[59,53,25,43,-5,-41,14.0],"]":[85,53,21,52,-2,-40,17.0],"^":[107,53,34,42,-2,-40,30.0],"_":[142,53,33,11,-2,-2,29.0],"`":[176,53,21,42,-2,-40,17.0],"a":[198,53,33,33,-2,-30,29.0],"b":[232,53,36,43,-2,-40,32.0],"c":[269,53,33,33,-2,-30,29.0],"d":[303,53,36,43,-2,-40,32.0],"e":[340,53,33,33,-2,-30,29.0],"f":[374,53,21,42,-2,-40,17.0],"g":[396,53,36,43,-2,-30,32.0],"h":[433,53,36,42,-2,-40,32.0],"i":[470,53,18,42,-2,-40,14.0],"j":[489,53,18,53,-2,-40,14.0],"k":[508,53,33,42,-2,-40,29.0],"l":[542,53,18,42,-2,-40,14.0],"m":[561,53,50,32,-2,-30,46.0],"n":[612,53,36,32,-2,-30,32.0],"o":[649,53,36,33,-2,-30,32.0],"p":[686,53,36,43,-2,-30,32.0],"q":[723,53,36,43,-2,-30,32.0],"r":[760,53,24,32,-2,-30,20.0],"s":[785,53,33,33,-2,-30,29.0],"t":[819,53,21,40,-2,-37,17.0],"u":[841,53,36,33,-2,-30,32.0],"v":[878,53,33,32,-2,-30,29.0],"w":[912,53,44,32,-2,-30,40.0],"x":[957,53,33,32,-2,-30,29.0],"y":[991,53,33,43,-2,-30,29.0],"z":[1025,53,30,32,-2,-30,26.0],"{":[1056,53,24,52,-2,-40,20.0],"|":[1081,53,19,42,-2,-40,15.0],"}":[1101,53,24,52,-2,-40,20.0],"~":[1126,53,36,24,-3,-22,30.0]," ":[0,0,0,0,0,0,14.0],"¡":[1163,53,21,42,-2,-30,17.0],"¢":[1185,53,33,42,-2,-34,29.0],"£":[1219,53,33,43,-2,-40,29.0],"¤":[1253,53,33,35,-2,-33,29.0],"¥":[1287,53,35,41,-3,-39,29.0],"¦":[1323,53,19,42,-2,-40,15.0],"§":[1343,53,33,52,-2,-40,29.0],"¨":[1377,53,22,42,-2,-40,17.0],"©":[1400,53,43,42,-2,-40,38.0],"ª":[1444,53,23,43,-2,-41,19.0],"«":[1468,53,33,29,-2,-27,29.0],"¬":[1502,53,34,28,-2,-26,30.0],"®":[1537,53,43,42,-2,-40,38.0],"¯":[1581,53,23,41,-3,-39,17.0],"°":[1605,53,25,41,-2,-39,21.0],"±":[1631,53,33,32,-2,-30,29.0],"²":[1665,53,22,41,-2,-39,17.0],"³":[1688,53,22,41,-2,-39,17.0],"´":[1711,53,22,42,-2,-40,17.0],"µ":[1734,53,37,44,-5,-30,30.0],"¶":[1772,53,33,51,-2,-40,29.0],"·":[707,163,18,26,-2,-24,14.0],"¸":[1825,53,21,16,-2,-2,17.0],"¹":[1847,53,21,41,-2,-39,17.0],"º":[1869,53,23,43,-2,-41,19.0],"»":[1893,53,33,29,-2,-27,29.0],"¼":[1927,53,47,42,-2,-39,43.0],"½":[1975,53,47,42,-2,-39,43.0],"¾":[0,107,47,42,-2,-39,43.0],"¿":[48,107,36,42,-2,-30,32.0],"À":[85,107,42,52,-2,-50,38.0],"Á":[128,107,42,52,-2,-50,38.0],"Â":[171,107,42,53,-2,-51,38.0],"Ã":[214,107,42,52,-2,-50,38.0],"Ä":[257,107,42,52,-2,-50,38.0],"Å":[300,107,42,52,-2,-50,38.0],"Æ":[343,107,56,42,-2,-40,52.0],"Ç":[400,107,42,55,-2,-41,38.0],"È":[443,107,39,52,-2,-50,35.0],"É":[483,107,39,52,-2,-50,35.0],"Ê":[523,107,39,53,-2,-51,35.0],"Ë":[563,107,39,52,-2,-50,35.0],"Ì":[603,107,20,52,-4,-50,14.0],"Í":[624,107,20,52,-2,-50,14.0],"Î":[645,107,23,53,-4,-51,14.0],"Ï":[669,107,22,52,-4,-50,14.0],"Ð":[692,107,42,42,-2,-40,38.0],"Ñ":[735,107,42,52,-2,-50,38.0],"Ò":[778,107,44,54,-2,-51,40.0],"Ó":[823,107,44,54,-2,-51,40.0],"Ô":[868,107,44,55,-2,-52,40.0],"Õ":[913,107,44,54,-2,-51,40.0],"Ö":[958,107,44,54,-2,-51,40.0],"×":[1003,107,34,32,-2,-30,30.0],"Ø":[1038,107,44,44,-2,-41,40.0],"Ù":[1083,107,42,53,-2,-50,38.0],"Ú":[1126,107,42,53,-2,-50,38.0],"Û":[1169,107,42,54,-2,-51,38.0],"Ü":[1212,107,42,53,-2,-50,38.0],"Ý":[1255,107,39,52,-2,-50,35.0],"Þ":[1295,107,39,42,-2,-40,35.0],"ß":[1335,107,36,43,-2,-40,32.0],"à":[1372,107,33,43,-2,-40,29.0],"á":[1406,107,33,43,-2,-40,29.0],"â":[1440,107,33,44,-2,-41,29.0],"ã":[1474,107,33,43,-2,-40,29.0],"ä":[1508,107,33,43,-2,-40,29.0],"å":[1542,107,33,45,-2,-42,29.0],"æ":[1576,107,50,33,-2,-30,46.0],"ç":[1627,107,33,43,-2,-30,29.0],"è":[1661,107,33,43,-2,-40,29.0],"é":[1695,107,33,43,-2,-40,29.0],"ê":[1729,107,33,44,-2,-41,29.0],"ë":[1763,107,33,43,-2,-40,29.0],"ì":[1797,107,20,42,-4,-40,14.0],"í":[1818,107,20,42,-2,-40,14.0],"î":[1839,107,23,43,-4,-41,14.0],"ï":[1863,107,22,42,-4,-40,14.0],"ð":[1886,107,36,43,-2,-40,32.0],"ñ":[1923,107,36,42,-2,-40,32.0],"ò":[1960,107,36,43,-2,-40,32.0],"ó":[1997,107,36,43,-2,-40,32.0],"ô":[0,163,36,44,-2,-41,32.0],"õ":[37,163,36,43,-2,-40,32.0],"ö":[74,163,36,43,-2,-40,32.0],"÷":[111,163,33,30,-2,-28,29.0],"ø":[145,163,36,33,-2,-30,32.0],"ù":[182,163,36,43,-2,-40,32.0],"ú":[219,163,36,43,-2,-40,32.0],"û":[256,163,36,44,-2,-41,32.0],"ü":[293,163,36,43,-2,-40,32.0],"ý":[330,163,33,53,-2,-40,29.0],"þ":[364,163,36,53,-2,-40,32.0],"ÿ":[401,163,33,53,-2,-40,29.0],"…":[435,163,56,11,-2,-9,52.0],"’":[492,163,18,41,-2,-39,14.0],"‘":[511,163,18,42,-2,-40,14.0],"“":[530,163,30,42,-2,-40,26.0],"”":[561,163,30,42,-2,-40,26.0],"–":[592,163,34,22,-3,-20,29.0],"—":[627,163,56,22,-2,-20,52.0],"•":[684,163,22,28,-2,-26,18.0],"€":[726,163,43,38,-2,-36,39.0],"™":[770,163,56,42,-2,-40,52.0]},"k":"kwu"},"b14":{"g":{" ":[0,0,0,0,0,0,16.0],"!":[0,0,23,45,-2,-43,19.0],"\"":[24,0,31,45,-2,-43,27.0],"#":[56,0,36,44,-2,-42,31.0],"$":[93,0,35,55,-2,-47,31.0],"%":[129,0,54,46,-2,-43,50.0],"&":[184,0,44,46,-2,-43,40.0],"'":[229,0,17,45,-2,-43,13.0],"(":[247,0,23,56,-2,-43,19.0],")":[271,0,23,56,-2,-43,19.0],"*":[295,0,26,45,-2,-43,22.0],"+":[322,0,37,35,-2,-33,33.0],",":[360,0,20,21,-2,-10,16.0],"-":[381,0,23,22,-2,-20,19.0],".":[405,0,20,12,-2,-10,16.0],"/":[426,0,28,46,-6,-44,16.0],"0":[455,0,35,46,-2,-43,31.0],"1":[491,0,35,44,-2,-42,31.0],"2":[527,0,35,45,-2,-43,31.0],"3":[563,0,35,46,-2,-43,31.0],"4":[599,0,35,44,-2,-42,31.0],"5":[635,0,35,45,-2,-42,31.0],"6":[671,0,35,46,-2,-43,31.0],"7":[707,0,35,44,-2,-42,31.0],"8":[743,0,35,46,-2,-43,31.0],"9":[779,0,35,46,-2,-43,31.0],":":[815,0,23,32,-2,-30,19.0],";":[839,0,23,41,-2,-30,19.0],"<":[863,0,37,37,-2,-33,33.0],"=":[901,0,37,27,-2,-25,33.0],">":[939,0,37,37,-2,-33,33.0],"?":[977,0,38,45,-2,-43,34.0],"@":[1016,0,59,46,-2,-43,55.0],"A":[1076,0,44,45,-2,-43,40.0],"B":[1121,0,44,45,-2,-43,40.0],"C":[1166,0,44,47,-2,-44,40.0],"D":[1211,0,44,45,-2,-43,40.0],"E":[1256,0,41,44,-2,-42,37.0],"F":[1298,0,38,45,-2,-43,34.0],"G":[1337,0,48,47,-2,-44,44.0],"H":[1386,0,44,45,-2,-43,40.0],"I":[1431,0,20,45,-2,-43,16.0],"J":[1452,0,35,46,-2,-43,31.0],"K":[1488,0,44,45,-2,-43,40.0],"L":[1533,0,38,45,-2,-43,34.0],"M":[1572,0,51,45,-2,-43,47.0],"N":[1624,0,44,45,-2,-43,40.0],"O":[1669,0,48,47,-2,-44,44.0],"P":[1718,0,41,45,-2,-43,37.0],"Q":[1760,0,48,50,-2,-44,44.0],"R":[1809,0,44,45,-2,-43,40.0],"S":[1854,0,41,47,-2,-44,37.0],"T":[1896,0,38,45,-2,-43,34.0],"U":[1935,0,44,46,-2,-43,40.0],"V":[1980,0,41,45,-2,-43,37.0],"W":[0,57,57,45,-2,-43,53.0],"X":[58,57,41,45,-2,-43,37.0],"Y":[100,57,41,45,-2,-43,37.0],"Z":[142,57,38,45,-2,-43,34.0],"[":[181,57,23,56,-2,-43,19.0],"\\":[205,57,28,46,-6,-44,16.0],"]":[234,57,23,56,-2,-43,19.0],"^":[258,57,37,45,-2,-43,33.0],"_":[296,57,36,11,-2,-2,31.0],"`":[333,57,23,47,-2,-45,19.0],"a":[357,57,35,37,-2,-34,31.0],"b":[393,57,38,46,-2,-43,34.0],"c":[432,57,35,37,-2,-34,31.0],"d":[468,57,38,46,-2,-43,34.0],"e":[507,57,35,37,-2,-34,31.0],"f":[543,57,23,45,-2,-43,19.0],"g":[567,57,38,48,-2,-34,34.0],"h":[606,57,38,45,-2,-43,34.0],"i":[645,57,20,45,-2,-43,16.0],"j":[666,57,20,57,-2,-43,16.0],"k":[687,57,35,45,-2,-43,31.0],"l":[723,57,20,45,-2,-43,16.0],"m":[744,57,54,36,-2,-34,50.0],"n":[799,57,38,36,-2,-34,34.0],"o":[838,57,38,37,-2,-34,34.0],"p":[877,57,38,48,-2,-34,34.0],"q":[916,57,38,48,-2,-34,34.0],"r":[955,57,26,36,-2,-34,22.0],"s":[982,57,35,37,-2,-34,31.0],"t":[1018,57,23,44,-2,-41,19.0],"u":[1042,57,38,37,-2,-34,34.0],"v":[1081,57,35,35,-2,-33,31.0],"w":[1117,57,48,34,-2,-32,44.0],"x":[1166,57,35,35,-2,-33,31.0],"y":[1202,57,35,48,-2,-34,31.0],"z":[1238,57,32,36,-2,-34,28.0],"{":[1271,57,26,56,-2,-43,22.0],"|":[1298,57,20,45,-2,-43,16.0],"}":[1319,57,26,56,-2,-43,22.0],"~":[1346,57,38,25,-3,-23,33.0]," ":[0,0,0,0,0,0,16.0],"¡":[1385,57,23,46,-2,-33,19.0],"¢":[1409,57,35,48,-2,-39,31.0],"£":[1445,57,35,46,-2,-43,31.0],"¤":[1481,57,35,38,-2,-36,31.0],"¥":[1517,57,37,44,-3,-42,31.0],"¦":[1555,57,20,45,-2,-43,16.0],"§":[1576,57,35,55,-2,-43,31.0],"¨":[1612,57,23,45,-2,-43,19.0],"©":[1636,57,46,45,-2,-43,41.0],"ª":[1683,57,25,46,-2,-44,21.0],"«":[1709,57,35,32,-2,-30,31.0],"¬":[1745,57,37,29,-2,-27,33.0],"®":[1783,57,46,45,-2,-43,41.0],"¯":[1830,57,25,44,-3,-42,19.0],"°":[1856,57,26,45,-2,-43,22.0],"±":[1883,57,35,32,-2,-30,31.0],"²":[1919,57,23,45,-2,-43,19.0],"³":[1943,57,23,45,-2,-43,19.0],"´":[1967,57,23,47,-2,-45,19.0],"µ":[1991,57,40,48,-5,-33,32.0],"¶":[0,115,36,54,-2,-43,31.0],"·":[1148,176,20,28,-2,-26,16.0],"¸":[58,115,23,17,-2,-2,19.0],"¹":[82,115,23,45,-2,-43,19.0],"º":[106,115,25,46,-2,-44,20.0],"»":[132,115,35,32,-2,-30,31.0],"¼":[168,115,51,46,-2,-43,47.0],"½":[220,115,51,46,-2,-43,47.0],"¾":[272,115,51,46,-2,-43,47.0],"¿":[324,115,38,46,-2,-33,34.0],"À":[363,115,44,57,-2,-55,40.0],"Á":[408,115,44,57,-2,-55,40.0],"Â":[453,115,44,57,-2,-55,40.0],"Ã":[498,115,44,57,-2,-55,40.0],"Ä":[543,115,44,55,-2,-53,40.0],"Å":[588,115,44,60,-2,-58,40.0],"Æ":[633,115,60,45,-2,-43,56.0],"Ç":[694,115,44,59,-2,-44,40.0],"È":[739,115,41,57,-2,-55,37.0],"É":[781,115,41,57,-2,-55,37.0],"Ê":[823,115,41,57,-2,-55,37.0],"Ë":[865,115,41,55,-2,-53,37.0],"Ì":[907,115,22,58,-4,-56,16.0],"Í":[930,115,22,58,-2,-56,16.0],"Î":[953,115,25,58,-5,-56,16.0],"Ï":[979,115,23,56,-4,-54,16.0],"Ð":[1003,115,44,45,-2,-43,40.0],"Ñ":[1048,115,44,57,-2,-55,40.0],"Ò":[1093,115,48,59,-2,-56,44.0],"Ó":[1142,115,48,59,-2,-56,44.0],"Ô":[1191,115,48,59,-2,-56,44.0],"Õ":[1240,115,48,59,-2,-56,44.0],"Ö":[1289,115,48,57,-2,-54,44.0],"×":[1338,115,37,34,-2,-32,33.0],"Ø":[1376,115,48,47,-2,-44,44.0],"Ù":[1425,115,44,58,-2,-55,40.0],"Ú":[1470,115,44,58,-2,-55,40.0],"Û":[1515,115,44,58,-2,-55,40.0],"Ü":[1560,115,44,56,-2,-53,40.0],"Ý":[1605,115,41,57,-2,-55,37.0],"Þ":[1647,115,41,45,-2,-43,37.0],"ß":[1689,115,38,46,-2,-43,34.0],"à":[1728,115,35,48,-2,-45,31.0],"á":[1764,115,35,48,-2,-45,31.0],"â":[1800,115,35,48,-2,-45,31.0],"ã":[1836,115,35,48,-2,-45,31.0],"ä":[1872,115,35,46,-2,-43,31.0],"å":[1908,115,35,52,-2,-49,31.0],"æ":[1944,115,54,37,-2,-34,50.0],"ç":[1999,115,35,48,-2,-34,31.0],"è":[0,176,35,48,-2,-45,31.0],"é":[36,176,35,48,-2,-45,31.0],"ê":[72,176,35,48,-2,-45,31.0],"ë":[108,176,35,46,-2,-43,31.0],"ì":[144,176,22,47,-4,-45,16.0],"í":[167,176,22,47,-2,-45,16.0],"î":[190,176,25,47,-5,-45,16.0],"ï":[216,176,23,45,-4,-43,16.0],"ð":[240,176,38,46,-2,-43,34.0],"ñ":[279,176,38,47,-2,-45,34.0],"ò":[318,176,38,48,-2,-45,34.0],"ó":[357,176,38,48,-2,-45,34.0],"ô":[396,176,38,48,-2,-45,34.0],"õ":[435,176,38,48,-2,-45,34.0],"ö":[474,176,38,46,-2,-43,34.0],"÷":[513,176,35,32,-2,-30,31.0],"ø":[549,176,38,38,-2,-35,34.0],"ù":[588,176,38,48,-2,-45,34.0],"ú":[627,176,38,48,-2,-45,34.0],"û":[666,176,38,48,-2,-45,34.0],"ü":[705,176,38,46,-2,-43,34.0],"ý":[744,176,35,59,-2,-45,31.0],"þ":[780,176,38,57,-2,-43,34.0],"ÿ":[819,176,35,57,-2,-43,31.0],"…":[855,176,60,12,-2,-10,56.0],"’":[916,176,20,44,-2,-42,16.0],"‘":[937,176,20,45,-2,-43,16.0],"“":[958,176,32,45,-2,-43,28.0],"”":[991,176,32,45,-2,-43,28.0],"–":[1024,176,37,23,-3,-21,31.0],"—":[1062,176,60,23,-2,-21,56.0],"•":[1123,176,24,30,-2,-28,20.0],"€":[1169,176,46,40,-2,-38,42.0],"™":[1216,176,60,45,-2,-43,56.0]},"k":"kwu"},"b16":{"g":{" ":[0,0,0,0,0,0,18.0],"!":[0,0,25,50,-2,-48,21.0],"\"":[26,0,34,50,-2,-48,30.0],"#":[61,0,40,49,-2,-47,36.0],"$":[102,0,40,62,-2,-53,36.0],"%":[143,0,61,51,-2,-48,57.0],"&":[205,0,50,51,-2,-48,46.0],"'":[256,0,19,50,-2,-48,15.0],"(":[276,0,25,64,-2,-49,21.0],")":[302,0,25,64,-2,-49,21.0],"*":[328,0,29,51,-2,-49,25.0],"+":[358,0,41,38,-2,-36,37.0],",":[400,0,22,24,-2,-11,18.0],"-":[423,0,25,26,-2,-24,21.0],".":[449,0,22,13,-2,-11,18.0],"/":[472,0,30,51,-6,-49,18.0],"0":[503,0,40,51,-2,-48,36.0],"1":[544,0,40,49,-2,-47,36.0],"2":[585,0,40,50,-2,-48,36.0],"3":[626,0,40,51,-2,-48,36.0],"4":[667,0,40,49,-2,-47,36.0],"5":[708,0,40,50,-2,-47,36.0],"6":[749,0,40,51,-2,-48,36.0],"7":[790,0,40,49,-2,-47,36.0],"8":[831,0,40,51,-2,-48,36.0],"9":[872,0,40,51,-2,-48,36.0],":":[913,0,25,36,-2,-34,21.0],";":[939,0,25,47,-2,-34,21.0],"<":[965,0,42,41,-2,-37,37.0],"=":[1008,0,41,32,-2,-30,37.0],">":[1050,0,42,41,-2,-37,37.0],"?":[1093,0,43,50,-2,-48,39.0],"@":[1137,0,66,54,-2,-51,62.0],"A":[1204,0,50,50,-2,-48,46.0],"B":[1255,0,50,50,-2,-48,46.0],"C":[1306,0,50,52,-2,-49,46.0],"D":[1357,0,50,50,-2,-48,46.0],"E":[1408,0,47,50,-2,-48,43.0],"F":[1456,0,43,50,-2,-48,39.0],"G":[1500,0,54,52,-2,-49,50.0],"H":[1555,0,50,50,-2,-48,46.0],"I":[1606,0,22,50,-2,-48,18.0],"J":[1629,0,40,51,-2,-48,36.0],"K":[1670,0,50,50,-2,-48,46.0],"L":[1721,0,43,50,-2,-48,39.0],"M":[1765,0,57,50,-2,-48,53.0],"N":[1823,0,50,50,-2,-48,46.0],"O":[1874,0,54,52,-2,-49,50.0],"P":[1929,0,47,50,-2,-48,43.0],"Q":[1977,0,54,55,-2,-49,50.0],"R":[0,65,50,50,-2,-48,46.0],"S":[51,65,47,52,-2,-49,43.0],"T":[99,65,43,50,-2,-48,39.0],"U":[143,65,50,51,-2,-48,46.0],"V":[194,65,47,50,-2,-48,43.0],"W":[242,65,64,50,-2,-48,60.0],"X":[307,65,47,50,-2,-48,43.0],"Y":[355,65,47,50,-2,-48,43.0],"Z":[403,65,43,50,-2,-48,39.0],"[":[447,65,25,63,-2,-49,21.0],"\\":[473,65,30,51,-6,-49,18.0],"]":[504,65,25,63,-2,-49,21.0],"^":[530,65,41,50,-2,-48,37.0],"_":[572,65,40,12,-2,-2,36.0],"`":[613,65,25,52,-2,-50,21.0],"a":[639,65,40,40,-2,-37,36.0],"b":[680,65,43,51,-2,-48,39.0],"c":[724,65,40,40,-2,-37,36.0],"d":[765,65,43,51,-2,-48,39.0],"e":[809,65,40,40,-2,-37,36.0],"f":[850,65,25,50,-2,-48,21.0],"g":[876,65,43,52,-2,-37,39.0],"h":[920,65,43,50,-2,-48,39.0],"i":[964,65,22,50,-2,-48,18.0],"j":[987,65,22,63,-2,-48,18.0],"k":[1010,65,40,50,-2,-48,36.0],"l":[1051,65,22,50,-2,-48,18.0],"m":[1074,65,61,39,-2,-37,57.0],"n":[1136,65,43,39,-2,-37,39.0],"o":[1180,65,43,40,-2,-37,39.0],"p":[1224,65,43,52,-2,-37,39.0],"q":[1268,65,43,52,-2,-37,39.0],"r":[1312,65,29,39,-2,-37,25.0],"s":[1342,65,40,40,-2,-37,36.0],"t":[1383,65,25,49,-2,-46,21.0],"u":[1409,65,43,40,-2,-37,39.0],"v":[1453,65,40,38,-2,-36,36.0],"w":[1494,65,54,38,-2,-36,50.0],"x":[1549,65,40,38,-2,-36,36.0],"y":[1590,65,40,52,-2,-37,36.0],"z":[1631,65,36,39,-2,-37,32.0],"{":[1668,65,29,64,-2,-49,25.0],"|":[1698,65,22,50,-2,-48,18.0],"}":[1721,65,29,64,-2,-49,25.0],"~":[1751,65,43,29,-3,-27,37.0]," ":[0,0,0,0,0,0,18.0],"¡":[1795,65,25,50,-2,-36,21.0],"¢":[1821,65,40,51,-2,-42,36.0],"£":[1862,65,40,51,-2,-48,36.0],"¤":[1903,65,40,43,-2,-41,36.0],"¥":[1944,65,42,49,-3,-47,36.0],"¦":[1987,65,22,50,-2,-48,18.0],"§":[0,130,40,62,-2,-48,36.0],"¨":[41,130,26,51,-2,-49,21.0],"©":[68,130,51,50,-2,-48,47.0],"ª":[120,130,28,51,-2,-49,24.0],"«":[149,130,40,35,-2,-33,36.0],"¬":[190,130,41,33,-2,-31,37.0],"®":[232,130,51,50,-2,-48,47.0],"¯":[284,130,27,50,-3,-48,21.0],"°":[312,130,30,50,-2,-48,26.0],"±":[343,130,39,38,-2,-36,35.0],"²":[383,130,25,50,-2,-48,21.0],"³":[409,130,25,50,-2,-48,21.0],"´":[435,130,26,52,-2,-50,21.0],"µ":[462,130,44,53,-5,-36,37.0],"¶":[507,130,40,62,-2,-48,36.0],"·":[96,263,22,31,-2,-29,18.0],"¸":[571,130,25,19,-2,-2,21.0],"¹":[597,130,25,50,-2,-48,21.0],"º":[623,130,28,51,-2,-49,23.0],"»":[652,130,40,35,-2,-33,36.0],"¼":[693,130,57,51,-2,-48,53.0],"½":[751,130,57,51,-2,-48,53.0],"¾":[809,130,57,51,-2,-48,53.0],"¿":[867,130,43,51,-2,-36,39.0],"À":[911,130,50,64,-2,-62,46.0],"Á":[962,130,50,64,-2,-62,46.0],"Â":[1013,130,50,64,-2,-62,46.0],"Ã":[1064,130,50,63,-2,-61,46.0],"Ä":[1115,130,50,63,-2,-61,46.0],"Å":[1166,130,50,66,-2,-64,46.0],"Æ":[1217,130,68,50,-2,-48,64.0],"Ç":[1286,130,50,65,-2,-49,46.0],"È":[1337,130,47,64,-2,-62,43.0],"É":[1385,130,47,64,-2,-62,43.0],"Ê":[1433,130,47,64,-2,-62,43.0],"Ë":[1481,130,47,63,-2,-61,43.0],"Ì":[1529,130,24,64,-4,-62,18.0],"Í":[1554,130,24,64,-2,-62,18.0],"Î":[1579,130,28,64,-5,-62,18.0],"Ï":[1608,130,26,63,-4,-61,18.0],"Ð":[1635,130,50,50,-2,-48,46.0],"Ñ":[1686,130,50,63,-2,-61,46.0],"Ò":[1737,130,54,66,-2,-63,50.0],"Ó":[1792,130,54,66,-2,-63,50.0],"Ô":[1847,130,54,66,-2,-63,50.0],"Õ":[1902,130,54,65,-2,-62,50.0],"Ö":[1957,130,54,65,-2,-62,50.0],"×":[0,197,41,38,-2,-36,37.0],"Ø":[42,197,54,54,-2,-50,50.0],"Ù":[97,197,50,65,-2,-62,46.0],"Ú":[148,197,50,65,-2,-62,46.0],"Û":[199,197,50,65,-2,-62,46.0],"Ü":[250,197,50,64,-2,-61,46.0],"Ý":[301,197,47,64,-2,-62,43.0],"Þ":[349,197,47,50,-2,-48,43.0],"ß":[397,197,43,52,-2,-49,39.0],"à":[441,197,40,53,-2,-50,36.0],"á":[482,197,40,53,-2,-50,36.0],"â":[523,197,40,53,-2,-50,36.0],"ã":[564,197,40,52,-2,-49,36.0],"ä":[605,197,40,52,-2,-49,36.0],"å":[646,197,40,57,-2,-54,36.0],"æ":[687,197,61,40,-2,-37,57.0],"ç":[749,197,40,52,-2,-37,36.0],"è":[790,197,40,53,-2,-50,36.0],"é":[831,197,40,53,-2,-50,36.0],"ê":[872,197,40,53,-2,-50,36.0],"ë":[913,197,40,52,-2,-49,36.0],"ì":[954,197,24,52,-4,-50,18.0],"í":[979,197,24,52,-2,-50,18.0],"î":[1004,197,28,52,-5,-50,18.0],"ï":[1033,197,26,51,-4,-49,18.0],"ð":[1060,197,43,52,-2,-49,39.0],"ñ":[1104,197,43,51,-2,-49,39.0],"ò":[1148,197,43,53,-2,-50,39.0],"ó":[1192,197,43,53,-2,-50,39.0],"ô":[1236,197,43,53,-2,-50,39.0],"õ":[1280,197,43,52,-2,-49,39.0],"ö":[1324,197,43,52,-2,-49,39.0],"÷":[1368,197,39,38,-2,-36,35.0],"ø":[1408,197,43,41,-2,-38,39.0],"ù":[1452,197,43,53,-2,-50,39.0],"ú":[1496,197,43,53,-2,-50,39.0],"û":[1540,197,43,53,-2,-50,39.0],"ü":[1584,197,43,52,-2,-49,39.0],"ý":[1628,197,40,65,-2,-50,36.0],"þ":[1669,197,43,63,-2,-48,39.0],"ÿ":[1713,197,40,64,-2,-49,36.0],"…":[1754,197,68,13,-2,-11,64.0],"’":[1823,197,22,50,-2,-48,18.0],"‘":[1846,197,22,51,-2,-49,18.0],"“":[1869,197,36,50,-2,-48,32.0],"”":[1906,197,36,50,-2,-48,32.0],"–":[1943,197,41,26,-3,-24,36.0],"—":[0,263,68,26,-2,-24,64.0],"•":[69,263,26,34,-2,-32,22.0],"€":[119,263,52,45,-2,-43,48.0],"™":[172,263,68,50,-2,-48,64.0]},"k":"kwu"},"b52":{"g":{"0":[0,0,120,157,-2,-151,116.0],"1":[121,0,120,150,-2,-148,116.0],"2":[242,0,120,153,-2,-151,116.0],"3":[363,0,120,157,-2,-151,116.0],"4":[484,0,120,150,-2,-148,116.0],"5":[605,0,120,154,-2,-148,116.0],"6":[726,0,120,157,-2,-151,116.0],"7":[847,0,120,150,-2,-148,116.0],"8":[968,0,120,157,-2,-151,116.0],"9":[1089,0,120,157,-2,-151,116.0],":":[1210,0,73,110,-2,-108,69.0],".":[1284,0,62,34,-2,-32,58.0]," ":[0,0,0,0,0,0,58.0],"-":[1347,0,73,75,-2,-73,69.0]},"k":"k"}}};

};
window.__SP_PRELOAD=["assets/ui/grain_b.png", "assets/ui/grain_w.png", "assets/f/b10k.png", "assets/f/b10u.png", "assets/f/b10w.png", "assets/f/b11k.png", "assets/f/b11u.png", "assets/f/b11w.png", "assets/f/b12k.png", "assets/f/b12u.png", "assets/f/b12w.png", "assets/f/b13k.png", "assets/f/b13u.png", "assets/f/b13w.png", "assets/f/b14k.png", "assets/f/b14u.png", "assets/f/b14w.png", "assets/f/b16k.png", "assets/f/b16u.png", "assets/f/b16w.png", "assets/f/b52k.png", "assets/f/r10k.png", "assets/f/r10u.png", "assets/f/r10w.png", "assets/f/r11k.png", "assets/f/r11u.png", "assets/f/r11w.png", "assets/f/r12k.png", "assets/f/r12u.png", "assets/f/r12w.png", "assets/art/default.png", "assets/art/monkeys.png", "assets/art/music.png", "assets/art/scarlet.png", "assets/art/valve.png"];
