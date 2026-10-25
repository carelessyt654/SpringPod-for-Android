
(function () {
  var G = window;
  var PI = Math.PI;
  var LOGICAL_W = 320;
  var BASE = G.__SP_BASE || "";           
  var N = G.Native;                        

  function now() { return (G.performance && performance.now) ? performance.now() : Date.now(); }
  function logErr(tag, e) { try { console.error(tag + ": " + (e && e.stack ? e.stack : e)); } catch (x) {} }


  var cv = document.getElementById("cv");
  var ctx = cv.getContext("2d");
  var DPR = G.devicePixelRatio || 1;
  var VW = G.innerWidth, VH = G.innerHeight;
  var SCALE = VW / LOGICAL_W;
  G.UIScreen = { width: LOGICAL_W, height: Math.round(VH / SCALE), scale: DPR * SCALE };

  function fitCanvas() {
    VW = G.innerWidth; VH = G.innerHeight; DPR = G.devicePixelRatio || 1;
    SCALE = VW / LOGICAL_W;
    cv.width = Math.max(1, Math.round(VW * DPR));
    cv.height = Math.max(1, Math.round(VH * DPR));
    dirty();
  }
  var activeUntil = 0;
  function dirty(ms) { activeUntil = Math.max(activeUntil, now() + (ms || 150)); }


  var IMG = {};
  function urlFor(path) { return BASE + "/" + path; }
  function loadImg(path) {
    var e = IMG[path];
    if (!e) {
      e = IMG[path] = { im: null, ok: false, bad: false, cbs: [] };
      var im = (G.__mkImage ? G.__mkImage() : new Image());
      e.im = im;
      im.onload = function () { e.ok = true; dirty(); e.cbs.splice(0).forEach(function (f) { f(true); }); };
      im.onerror = function () { e.bad = true; e.cbs.splice(0).forEach(function (f) { f(false); }); };
      im.src = urlFor(path);
    }
    return e;
  }
  function getImg(path) {
    var e = loadImg(path);
    if (e.bad) throw new Error("image failed: " + path);
    return e.ok ? e.im : null;
  }
  function preload(list) {
    return Promise.all(list.map(function (p) {
      return new Promise(function (res) {
        var e = loadImg(p);
        if (e.ok || e.bad) return res();
        e.cbs.push(function () { res(); });
      });
    }));
  }


  function UIBezierPath() { this.ops = []; }
  var BP = UIBezierPath.prototype;
  BP.moveTo = function (x, y) { this.ops.push(["m", x, y]); return this; };
  BP.lineTo = function (x, y) { this.ops.push(["l", x, y]); return this; };
  BP.close = function () { this.ops.push(["z"]); return this; };
  BP.arc = function (cx, cy, r, a0, a1) { this.ops.push(["a", cx, cy, r, a0, a1]); return this; };
  BP.oval = function (x, y, w, h) { this.ops.push(["o", x, y, w, h]); return this; };
  BP.rect = function (x, y, w, h) { this.ops.push(["r", x, y, w, h, 0]); return this; };
  BP.roundedRect = function (x, y, w, h, r) { this.ops.push(["r", x, y, w, h, r || 0]); return this; };
  BP.curveTo = function (x, y, c1x, c1y, c2x, c2y) { this.ops.push(["c", x, y, c1x, c1y, c2x, c2y]); return this; };
  BP.quadTo = function (x, y, cx, cy) { this.ops.push(["q", x, y, cx, cy]); return this; };
  G.UIBezierPath = UIBezierPath;

  function rrect(x, y, w, h, r) {
    if (!(r > 0)) { ctx.rect(x, y, w, h); return; }
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
  function tracePath(p) {
    ctx.beginPath();
    p.ops.forEach(function (o) {
      switch (o[0]) {
        case "m": ctx.moveTo(o[1], o[2]); break;
        case "l": ctx.lineTo(o[1], o[2]); break;
        case "z": ctx.closePath(); break;
        case "a": ctx.arc(o[1], o[2], o[3], o[4] * PI / 180, o[5] * PI / 180, false); break;
        case "o": ctx.moveTo(o[1] + o[3], o[2] + o[4] / 2);
                  ctx.ellipse(o[1] + o[3] / 2, o[2] + o[4] / 2, o[3] / 2, o[4] / 2, 0, 0, 2 * PI); ctx.closePath(); break;
        case "r": rrect(o[1], o[2], o[3], o[4], o[5]); break;
        case "c": ctx.bezierCurveTo(o[3], o[4], o[5], o[6], o[1], o[2]); break;
        case "q": ctx.quadraticCurveTo(o[3], o[4], o[1], o[2]); break;
      }
    });
  }


  var FONT_STACK = '-apple-system, "Helvetica Neue", Roboto, "Segoe UI", Arial, sans-serif';
  function fontStr(o) { return (o && o.bold ? "bold " : "") + ((o && o.size) || 12) + "px " + FONT_STACK; }
  G.UIFont = {
    measure: function (str, o) { ctx.save(); ctx.font = fontStr(o); var w = ctx.measureText(String(str)).width; ctx.restore(); return w; }
  };


  var depth = 0;
  function unit() { return DPR * SCALE; }
  function fillOf(f) { return f == null ? null : f; }
  var patCache = {};
  var C = {
    save: function () { ctx.save(); depth++; },
    restore: function () { if (depth > 0) { ctx.restore(); depth--; } },
    translate: function (x, y) { ctx.translate(x, y); },
    scale: function (x, y) { ctx.scale(x, y == null ? x : y); },
    alpha: function (a) { ctx.globalAlpha = Math.max(0, Math.min(1, ctx.globalAlpha * a)); },
    shadow: function (col, blur, dx, dy) {
      var u = unit();
      ctx.shadowColor = col; ctx.shadowBlur = (blur || 0) * u;
      ctx.shadowOffsetX = (dx || 0) * u; ctx.shadowOffsetY = (dy || 0) * u;
    },
    fillRect: function (x, y, w, h, fill, r) {
      fill = fillOf(fill); if (fill == null) return;
      ctx.fillStyle = fill;
      if (r > 0) { ctx.beginPath(); rrect(x, y, w, h, r); ctx.fill(); } else ctx.fillRect(x, y, w, h);
    },
    strokeRect: function (x, y, w, h, col, lw, r) {
      ctx.strokeStyle = col; ctx.lineWidth = lw == null ? 1 : lw;
      if (r > 0) { ctx.beginPath(); rrect(x, y, w, h, r); ctx.stroke(); } else ctx.strokeRect(x, y, w, h);
    },
    circle: function (x, y, r, fill, lw) {
      fill = fillOf(fill); if (fill == null) return;
      ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, 2 * PI);
      if (lw > 0) { ctx.strokeStyle = fill; ctx.lineWidth = lw; ctx.stroke(); } else { ctx.fillStyle = fill; ctx.fill(); }
    },
    line: function (x1, y1, x2, y2, col, w, o) {
      ctx.strokeStyle = col; ctx.lineWidth = w == null ? 1 : w; ctx.lineCap = (o && o.cap) || "butt";
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    },
    fillPath: function (p, col) { tracePath(p); ctx.fillStyle = col; ctx.fill(); },
    strokePath: function (p, col, w, o) {
      tracePath(p); ctx.strokeStyle = col; ctx.lineWidth = w == null ? 1 : w;
      ctx.lineCap = (o && o.cap) || "butt"; ctx.lineJoin = (o && o.join) || "miter"; ctx.stroke();
    },
    clipRect: function (x, y, w, h, r) { ctx.beginPath(); rrect(x, y, w, h, r); ctx.clip(); },
    clipPath: function (p) { tracePath(p); ctx.clip(); },
    linearGradient: function (x0, y0, x1, y1, colors, stops) {
      var g = ctx.createLinearGradient(x0, y0, x1, y1); addStops(g, colors, stops); return g;
    },
    radialGradient: function (cx, cy, r, colors, stops) {
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); addStops(g, colors, stops); return g;
    },
    pattern: function (path, scale) {
      var im = getImg(path); if (!im) return null;
      var key = path + "@" + scale, p = patCache[key];
      if (!p) {
        p = ctx.createPattern(im, "repeat");
        if (p && p.setTransform && G.DOMMatrix && scale && scale !== 1) { try { p.setTransform(new DOMMatrix().scale(scale, scale)); } catch (e) {} }
        patCache[key] = p;
      }
      return p;
    },
    image: function (path, x, y, w, h, a, src) {
      var im = getImg(path); if (!im) return;
      var prev = ctx.globalAlpha;
      if (a != null) ctx.globalAlpha = prev * a;
      if (src && src.length === 4) ctx.drawImage(im, src[0], src[1], src[2], src[3], x, y, w, h);
      else ctx.drawImage(im, x, y, w, h);
      ctx.globalAlpha = prev;
    },
    text: function (str, x, y, o) {
      o = o || {}; str = String(str);
      ctx.font = fontStr(o); ctx.fillStyle = o.color || "#000000"; ctx.textBaseline = "alphabetic";
      var tw = ctx.measureText(str).width;
      if (o.maxWidth && tw > o.maxWidth) {
        var s = str;
        while (s.length > 0 && ctx.measureText(s + "\u2026").width > o.maxWidth) s = s.slice(0, -1);
        str = s + "\u2026"; tw = ctx.measureText(str).width;
      }
      var px = o.align === "center" ? x - tw / 2 : (o.align === "right" ? x - tw : x);
      ctx.textAlign = "left"; ctx.fillText(str, px, y);
    }
  };
  function addStops(g, colors, stops) {
    var n = colors.length;
    colors.forEach(function (c, i) {
      var o = stops && stops[i] != null ? stops[i] : (n === 1 ? 0 : i / (n - 1));
      g.addColorStop(Math.max(0, Math.min(1, o)), c);
    });
  }

  
  var ANIM = null;
  function easeFn(name) {
    if (name === "linear") return function (u) { return u; };
    if (name === "easeIn") return function (u) { return u * u; };
    if (name === "easeInOut") return function (u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; };
    return function (u) { return 1 - (1 - u) * (1 - u); };
  }
  function tfCopy(t) { return { translateX: (t && t.translateX) || 0, translateY: (t && t.translateY) || 0, scale: (t && t.scale != null) ? t.scale : 1 }; }

  function UIView(o) {
    o = o || {};
    this.frame = o.frame || [0, 0, 0, 0];
    this.draw = o.draw || null;
    this.background = o.background || null;
    this.cornerRadius = o.cornerRadius || 0;
    this.clipsToBounds = !!o.clipsToBounds;
    this.hidden = !!o.hidden;
    this.alpha = o.alpha == null ? 1 : o.alpha;
    this.onTouch = o.onTouch || null;
    this.subviews = [];
    this._tf = null; this._ta = null;
    if (o.transform) this.transform = o.transform;
  }
  Object.defineProperty(UIView.prototype, "transform", {
    get: function () { return this._tf; },
    set: function (v) {
      if (ANIM) {
        this._ta = { from: tfCopy(this._cur ? this._cur : this._tf), to: tfCopy(v), t0: now(), dur: ANIM.dur * 1000, ease: ANIM.ease };
      } else this._ta = null;
      this._tf = v || null; dirty(400);
    }
  });
  UIView.prototype.addSubview = function (v) { this.subviews.push(v); return v; };
  UIView.prototype.removeFromSuperview = function () {};
  UIView.animate = function (o, fn) {
    var prev = ANIM;
    ANIM = { dur: (o && o.duration) || 0.3, ease: easeFn(o && o.curve) };
    try { fn && fn(); } finally { ANIM = prev; }
    dirty(((o && o.duration) || 0.3) * 1000 + 100);
  };
  function currentTF(v) {
    var a = v._ta;
    if (a) {
      var u = (now() - a.t0) / a.dur;
      if (u >= 1) { v._ta = null; v._cur = null; return v._tf ? tfCopy(v._tf) : null; }
      u = a.ease(Math.max(0, u));
      var r = {
        translateX: a.from.translateX + (a.to.translateX - a.from.translateX) * u,
        translateY: a.from.translateY + (a.to.translateY - a.from.translateY) * u,
        scale: a.from.scale + (a.to.scale - a.from.scale) * u
      };
      v._cur = r; dirty(50); return r;
    }
    v._cur = null;
    return v._tf ? tfCopy(v._tf) : null;
  }
  G.UIView = UIView;

  function UIGameView(o) {
    UIView.call(this, o);
    o = o || {};
    this.running = !!o.running;
    this.fps = o.fps || 60;
    this.update = o.update || function () {};
  }
  UIGameView.prototype = Object.create(UIView.prototype);
  UIGameView.prototype.constructor = UIGameView;
  G.UIGameView = UIGameView;

  function UIViewController(o) { o = o || {}; this.background = o.background || "#000000"; this.views = o.views || []; }
  G.UIViewController = UIViewController;

  var errSeen = {};
  function drawView(v) {
    if (v.hidden) return;
    var f = v.frame;
    ctx.save();
    var prevAlpha = ctx.globalAlpha;
    if (v.alpha != null && v.alpha !== 1) ctx.globalAlpha = prevAlpha * v.alpha;
    ctx.translate(f[0], f[1]);
    var tf = currentTF(v);
    if (tf) {
      if (tf.scale !== 1) { ctx.translate(f[2] / 2, f[3] / 2); ctx.scale(tf.scale, tf.scale); ctx.translate(-f[2] / 2, -f[3] / 2); }
      ctx.translate(tf.translateX, tf.translateY);
    }
    if (v.clipsToBounds || v.cornerRadius > 0) { ctx.beginPath(); rrect(0, 0, f[2], f[3], v.cornerRadius); ctx.clip(); }
    if (v.background) { ctx.fillStyle = v.background; ctx.fillRect(0, 0, f[2], f[3]); }
    if (v.draw) {
      ctx.save(); depth = 0;
      try { v.draw(C); } catch (e) { var k = String(e && e.message); if (!errSeen[k]) { errSeen[k] = 1; logErr("draw", e); } }
      while (depth > 0) { ctx.restore(); depth--; }
      ctx.restore();
    }
    for (var i = 0; i < v.subviews.length; i++) drawView(v.subviews[i]);
    ctx.restore();
  }

  
  var VC = null, touching = false;
  function eachView(list, fn) { list.forEach(function (v) { fn(v); eachView(v.subviews || [], fn); }); }

  function hit(list, x, y) {
    for (var i = list.length - 1; i >= 0; i--) {
      var v = list[i]; if (v.hidden) continue;
      var f = v.frame;
      if (x < f[0] || y < f[1] || x >= f[0] + f[2] || y >= f[1] + f[3]) continue;
      var lx = x - f[0], ly = y - f[1];
      var sub = hit(v.subviews, lx, ly);
      if (sub) return sub;
      if (v.onTouch) return { view: v, ox: f[0], oy: f[1] };
    }
    return null;
  }
  function hitAbs(list, x, y, ax, ay) {
    for (var i = list.length - 1; i >= 0; i--) {
      var v = list[i]; if (v.hidden) continue;
      var f = v.frame;
      if (x < ax + f[0] || y < ay + f[1] || x >= ax + f[0] + f[2] || y >= ay + f[1] + f[3]) continue;
      var sub = hitAbs(v.subviews, x, y, ax + f[0], ay + f[1]);
      if (sub) return sub;
      if (v.onTouch) return { view: v, ox: ax + f[0], oy: ay + f[1] };
    }
    return null;
  }
  var grab = null, grabId = null;
  function toLogical(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / SCALE, (e.clientY - r.top) / SCALE]; }
  function sendTouch(phase, e) {
    if (!grab) return;
    var p = toLogical(e);
    try { grab.view.onTouch(phase, p[0] - grab.ox, p[1] - grab.oy); } catch (err) { logErr("onTouch", err); }
    dirty(450);
  }
  function setupTouch() {
    cv.addEventListener("pointerdown", function (e) {
      if (grab || !VC) return;
      var p = toLogical(e);
      grab = hitAbs(VC.views, p[0], p[1], 0, 0);
      if (!grab) return;
      grabId = e.pointerId; touching = true;
      try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      sendTouch("began", e); e.preventDefault();
    }, { passive: false });
    cv.addEventListener("pointermove", function (e) { if (grab && e.pointerId === grabId) { sendTouch("moved", e); e.preventDefault(); } }, { passive: false });
    function end(phase) {
      return function (e) {
        if (!grab || e.pointerId !== grabId) return;
        sendTouch(phase, e); grab = null; grabId = null; touching = false; e.preventDefault();
      };
    }
    cv.addEventListener("pointerup", end("ended"));
    cv.addEventListener("pointercancel", end("cancelled"));
  }

  var lastT = 0, lastDraw = 0;
  function frame(ts) {
    G.requestAnimationFrame(frame);
    if (!VC) return;
    ts = ts || now();
    var dt = lastT ? Math.min((ts - lastT) / 1000, 0.1) : 0.016; lastT = ts;
    var running = false;
    eachView(VC.views, function (v) { if (v instanceof UIGameView && v.running) running = true; });
    var active = running || touching || ts < activeUntil;
    var gap = active ? 14 : 120;
    if (ts - lastDraw < gap) return;
    lastDraw = ts;
    eachView(VC.views, function (v) {
      if (v instanceof UIGameView && v.running) { try { v.update(dt); } catch (e) { logErr("update", e); } }
    });
    render();
  }
  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1; ctx.shadowColor = "rgba(0,0,0,0)"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    ctx.fillStyle = VC.background; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(DPR * SCALE, 0, 0, DPR * SCALE, 0, 0);
    ctx.imageSmoothingEnabled = true; try { ctx.imageSmoothingQuality = "high"; } catch (e) {}
    for (var i = 0; i < VC.views.length; i++) drawView(VC.views[i]);
  }
  G.__spRender = function () { if (VC) render(); };

  G.UIApplication = {
    run: function (vc) {
      VC = vc; setupTouch(); dirty(1000);
      G.requestAnimationFrame(frame);
    }
  };


  var LS = null; try { LS = G.localStorage; } catch (e) {}
  var memStore = {};
  G.storage = {
    get: function (k) {
      try { var s = LS ? LS.getItem("sp:" + k) : memStore[k]; return s == null ? null : JSON.parse(s); } catch (e) { return null; }
    },
    set: function (k, v) {
      var s = JSON.stringify(v);
      try { if (LS) LS.setItem("sp:" + k, s); else memStore[k] = s; } catch (e) { logErr("storage.set", e); }
    },
    remove: function (k) { try { if (LS) LS.removeItem("sp:" + k); else delete memStore[k]; } catch (e) {} }
  };


  var impCbs = {}, impId = 0;
  G.files = {
    exists: function (rel) { return !!N.fsExists(String(rel)); },
    mkdir: function (rel) { N.fsMkdir(String(rel)); },
    remove: function (rel) { delete IMG["files/" + rel]; N.fsRemove(String(rel)); },
    readBase64: function (rel) { var s = N.fsReadBase64(String(rel)); if (!s) throw new Error("read failed: " + rel); return s; },
    appendBase64: function (rel, b64) { if (!N.fsAppendBase64(String(rel), String(b64))) throw new Error("write failed: " + rel); },
    import: function (opts, cb) {
      var id = ++impId; impCbs[id] = cb;
      N.fsImport(JSON.stringify({ types: (opts && opts.types) || [], multiple: !!(opts && opts.multiple), to: (opts && opts.to) || "" }), id);
    }
  };
  G.__spImportDone = function (id, json, err) {
    var cb = impCbs[id]; delete impCbs[id]; if (!cb) return;
    var paths = []; try { paths = JSON.parse(json || "[]"); } catch (e) {}
    try { cb(paths, err || null); } catch (e) { logErr("import cb", e); }
    dirty(500);
  };


  var vol = 1;
  G.UIMusic = {
    get volume() { return vol; },
    set volume(v) { vol = Math.max(0, Math.min(1, +v || 0)); try { N.musicVolume(vol); } catch (e) {} },
    play: function (path, loop) { var r = N.musicPlay(String(path), !!loop); if (r) throw new Error(r); },
    stop: function () { N.musicStop(); },
    seek: function (s) { N.musicSeek(+s || 0); },
    get duration() { try { return N.musicDuration(); } catch (e) { return 0; } },
    onEnd: null
  };
  G.__spMusicEnd = function () { if (G.UIMusic.onEnd) { try { G.UIMusic.onEnd(); } catch (e) { logErr("onEnd", e); } } };


  G.UIAlertView = {
    show: function (o, cb) {
      var ov = document.createElement("div");
      ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:99;font-family:" + FONT_STACK;
      var box = document.createElement("div");
      box.style.cssText = "width:270px;background:rgba(248,248,248,.98);border-radius:14px;overflow:hidden;text-align:center;color:#000";
      var body = document.createElement("div"); body.style.cssText = "padding:18px 16px 16px";
      var t = document.createElement("div"); t.textContent = (o && o.title) || ""; t.style.cssText = "font-weight:600;font-size:17px;margin-bottom:4px";
      var m = document.createElement("div"); m.textContent = (o && o.message) || ""; m.style.cssText = "font-size:13px;line-height:1.3;word-break:break-word";
      body.appendChild(t); body.appendChild(m); box.appendChild(body);
      var btns = (o && o.buttons) || ["OK"];
      var row = document.createElement("div");
      row.style.cssText = "display:flex;border-top:1px solid rgba(60,60,67,.3)" + (btns.length > 2 ? ";flex-direction:column" : "");
      btns.forEach(function (label, i) {
        var b = document.createElement("div");
        b.textContent = label;
        var last = i === btns.length - 1;
        b.style.cssText = "flex:1;padding:12px 0;font-size:17px;color:#007aff;" + (last ? "font-weight:600;" : "") + (i > 0 ? (btns.length > 2 ? "border-top:1px solid rgba(60,60,67,.3);" : "border-left:1px solid rgba(60,60,67,.3);") : "");
        b.addEventListener("click", function () { document.body.removeChild(ov); try { cb && cb(i); } catch (e) { logErr("alert cb", e); } dirty(300); });
        row.appendChild(b);
      });
      box.appendChild(row); ov.appendChild(box); document.body.appendChild(ov);
    }
  };


  var MODS = G.__SP_MODULES || {}, cache = {};
  function req(name) {
    name = String(name).replace(/^\.\//, "");
    if (cache[name]) return cache[name].exports;
    var f = MODS[name]; if (!f) throw new Error("module not found: " + name);
    var m = { exports: {} }; cache[name] = m;
    f(m, m.exports, req);
    return m.exports;
  }
  G.require = req;

  function boot() {
    fitCanvas();
    G.addEventListener("resize", fitCanvas);
    preload(G.__SP_PRELOAD || []).then(function () {
      try { req("main.js"); } catch (e) { logErr("main.js", e); }
    });
  }
  
  function start() {
    var tries = 0;
    (function wait() {
      if ((G.innerHeight > 0 && G.innerWidth > 0) || tries++ > 60) {
    
        setTimeout(function () {
          VW = G.innerWidth; VH = G.innerHeight; SCALE = VW / LOGICAL_W;
          G.UIScreen.height = Math.round(VH / SCALE);
          boot();
        }, 150);
      } else setTimeout(wait, 50);
    })();
  }
  if (G.__SP_MANUAL_START) G.__spStart = start; else start();
})();
