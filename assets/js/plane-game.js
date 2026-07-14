(function () {
  var TRIGGER = { ctrlKey: true, altKey: true, key: "p" };
  var TARGET_SELECTOR = [
    ".plane-text-brick:not(.plane-target-hit)",
    ".plane-icon-target:not(.plane-target-hit)",
    "canvas.plane-image-target"
  ].join(", ");
  var SKIP_TEXT_SELECTOR = "script, style, noscript, iframe, video, canvas, svg, .site-bg, .plane-game-layer";
  var ICON_SELECTOR = [
    "i.fa",
    "i.fas",
    "i.far",
    "i.fab",
    "i.ai",
    ".pub-chip i",
    ".cv-pdf-icon i",
    ".plane-nav-button i",
    "svg"
  ].join(", ");

  var active = false;
  var layer = null;
  var plane = null;
  var coachNode = null;
  var scoreNode = null;
  var targets = [];
  var hitTargets = [];
  var imageRecords = [];
  var iconTargets = [];
  var textWrappers = [];
  var bullets = [];
  var keys = {};
  var frameId = 0;
  var lastTime = 0;
  var lastShot = 0;
  var score = 0;
  var planeState = { x: 0, y: 0, tilt: 0 };
  var touchPointerId = null;

  function isEditable(event) {
    var target = event.target;
    if (!target) return false;
    var tagName = target.tagName ? target.tagName.toLowerCase() : "";
    return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function isTrigger(event) {
    return event.ctrlKey === TRIGGER.ctrlKey && event.altKey === TRIGGER.altKey && event.key.toLowerCase() === TRIGGER.key;
  }

  function isVisibleTarget(target) {
    if (!target || target.closest(".plane-game-layer") || target.closest(".site-bg")) return false;
    if ((target.classList.contains("plane-text-brick") || target.classList.contains("plane-icon-target")) && target.classList.contains("plane-target-hit")) return false;
    var rect = target.getBoundingClientRect();
    return rect.width > 3 && rect.height > 3 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  }

  function collectTargets() {
    targets = Array.prototype.slice.call(document.querySelectorAll(TARGET_SELECTOR)).filter(isVisibleTarget);
  }

  function splitToken(token) {
    if (/^[\u4e00-\u9fff]+$/.test(token)) return token.split("");
    if (token.length <= 12) return [token];
    var chunks = [];
    for (var index = 0; index < token.length; index += 8) {
      chunks.push(token.slice(index, index + 8));
    }
    return chunks;
  }

  function buildTextWrapper(text) {
    var wrapper = document.createElement("span");
    wrapper.className = "plane-text-line";
    var parts = text.match(/\s+|[^\s]+/g) || [];

    parts.forEach(function (part) {
      if (/^\s+$/.test(part)) {
        wrapper.appendChild(document.createTextNode(part));
        return;
      }

      splitToken(part).forEach(function (chunk) {
        var brick = document.createElement("span");
        brick.className = "plane-text-brick";
        brick.textContent = chunk;
        wrapper.appendChild(brick);
      });
    });

    return wrapper;
  }

  function prepareTextTargets() {
    if (textWrappers.length || !document.body) return;

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (!node.parentElement || node.parentElement.closest(SKIP_TEXT_SELECTOR)) return NodeFilter.FILTER_REJECT;
        if (node.parentElement.closest(".plane-text-line")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var parent = node.parentNode;
      if (!parent) return;
      var wrapper = buildTextWrapper(node.nodeValue);
      parent.replaceChild(wrapper, node);
      textWrappers.push({ wrapper: wrapper, text: node.nodeValue });
    });
  }

  function restoreTextTargets() {
    for (var index = textWrappers.length - 1; index >= 0; index -= 1) {
      var item = textWrappers[index];
      if (item.wrapper && item.wrapper.parentNode) {
        item.wrapper.parentNode.replaceChild(document.createTextNode(item.text), item.wrapper);
      }
    }
    textWrappers = [];
  }

  function prepareIconTargets() {
    iconTargets = [];
    Array.prototype.forEach.call(document.querySelectorAll(ICON_SELECTOR), function (icon) {
      if (icon.closest(".plane-game-layer") || icon.closest(".site-bg")) return;
      icon.classList.add("plane-icon-target");
      icon.classList.remove("plane-target-hit");
      icon.style.removeProperty("--plane-hit-x");
      icon.style.removeProperty("--plane-hit-y");
      icon.style.removeProperty("--plane-hit-rotate");
      iconTargets.push(icon);
    });
  }

  function clearIconTargets() {
    iconTargets.forEach(function (icon) {
      icon.classList.remove("plane-icon-target");
      icon.classList.remove("plane-target-hit");
      icon.style.removeProperty("--plane-hit-x");
      icon.style.removeProperty("--plane-hit-y");
      icon.style.removeProperty("--plane-hit-rotate");
    });
    iconTargets = [];
  }

  function prepareImageTargets() {
    Array.prototype.forEach.call(document.querySelectorAll("body img"), function (image) {
      if (image.closest(".plane-game-layer") || image.closest(".site-bg")) return;
      if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;

      var rect = image.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) return;

      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.className = image.className;
      canvas.classList.add("plane-image-target");
      canvas.setAttribute("aria-label", image.getAttribute("alt") || "image target");
      canvas.style.cssText = image.style.cssText || "";
      canvas.style.display = "block";
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      canvas.style.maxWidth = "100%";
      canvas.style.borderRadius = window.getComputedStyle(image).borderRadius;
      canvas.style.boxShadow = window.getComputedStyle(image).boxShadow;

      try {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      } catch (error) {
        return;
      }

      canvas._planeImageRecord = {
        image: image,
        canvas: canvas,
        context: context,
        hits: 0
      };
      image.parentNode.replaceChild(canvas, image);
      imageRecords.push(canvas._planeImageRecord);
    });
  }

  function start() {
    if (active) return;
    active = true;
    syncToggleButtons();
    keys = {};
    bullets = [];
    hitTargets = [];
    imageRecords = [];
    score = 0;
    lastShot = 0;
    planeState.x = window.innerWidth / 2;
    planeState.y = clamp(window.innerHeight * 0.16, 92, Math.max(104, window.innerHeight - 120));
    planeState.tilt = 0;
    touchPointerId = null;

    layer = document.createElement("div");
    layer.className = "plane-game-layer";
    layer.innerHTML = [
      '<div class="plane-game__hud" aria-live="polite">',
      '  <span class="plane-game__score">0</span>',
      '  <span class="plane-game__hint">Drag plane · tap to shoot · restore or close anytime</span>',
      '  <button class="plane-game__button plane-game__restore" type="button" aria-label="Restore page" title="Restore page"><i class="fas fa-redo" aria-hidden="true"></i></button>',
      '  <button class="plane-game__button plane-game__close" type="button" aria-label="Close plane mode" title="Close plane mode"><i class="fas fa-times" aria-hidden="true"></i></button>',
      '</div>',
      '<div class="plane-game__plane" aria-hidden="true">',
      '  <span class="plane-game__plane-wing"></span>',
      '  <span class="plane-game__plane-body"></span>',
      '  <span class="plane-game__plane-flame"></span>',
      '</div>',
      '<div class="plane-game__coach" aria-hidden="true">Drag me · tap me to shoot</div>'
    ].join("");
    document.body.appendChild(layer);
    document.body.classList.add("plane-game-active");

    plane = layer.querySelector(".plane-game__plane");
    coachNode = layer.querySelector(".plane-game__coach");
    scoreNode = layer.querySelector(".plane-game__score");
    plane.addEventListener("pointerdown", handlePlanePointerDown);
    layer.querySelector(".plane-game__restore").addEventListener("click", restoreTargets);
    layer.querySelector(".plane-game__close").addEventListener("click", function () {
      stop(true);
    });

    prepareTextTargets();
    prepareIconTargets();
    prepareImageTargets();
    collectTargets();
    drawPlane();
    lastTime = performance.now();
    frameId = window.requestAnimationFrame(tick);
  }

  function stop(restore) {
    if (!active) return;
    active = false;
    window.cancelAnimationFrame(frameId);
    frameId = 0;
    bullets.forEach(function (bullet) {
      bullet.node.remove();
    });
    bullets = [];
    if (restore) restoreTargets();
    clearIconTargets();
    clearImageTargets();
    restoreTextTargets();
    if (layer) layer.remove();
    layer = null;
    plane = null;
    coachNode = null;
    scoreNode = null;
    touchPointerId = null;
    document.body.classList.remove("plane-game-active");
    syncToggleButtons();
  }

  function toggle() {
    if (active) {
      stop(true);
    } else {
      start();
    }
  }

  function syncToggleButtons() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-plane-game-toggle]"), function (button) {
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.setAttribute("aria-label", active ? "Close plane mode" : "Start plane mode");
      button.setAttribute("title", active ? "Close plane mode" : "Start plane mode");
    });
  }

  function restoreTargets() {
    hitTargets.forEach(function (target) {
      target.classList.remove("plane-target-hit");
      target.style.removeProperty("--plane-hit-x");
      target.style.removeProperty("--plane-hit-y");
      target.style.removeProperty("--plane-hit-rotate");
    });
    hitTargets = [];
    imageRecords.forEach(redrawImageRecord);
    score = 0;
    if (scoreNode) scoreNode.textContent = "0";
    collectTargets();
  }

  function redrawImageRecord(record) {
    if (!record || !record.context || !record.canvas || !record.image) return;
    record.context.globalCompositeOperation = "source-over";
    record.context.clearRect(0, 0, record.canvas.width, record.canvas.height);
    record.context.drawImage(record.image, 0, 0, record.canvas.width, record.canvas.height);
    record.hits = 0;
  }

  function clearImageTargets() {
    imageRecords.forEach(function (record) {
      if (record.canvas && record.canvas.parentNode) {
        record.canvas.parentNode.replaceChild(record.image, record.canvas);
      }
    });
    imageRecords = [];
  }

  function drawPlane() {
    if (!plane) return;
    plane.style.transform = "translate3d(" + planeState.x + "px, " + planeState.y + "px, 0) translate(-50%, -50%) rotate(" + planeState.tilt + "deg)";
    if (coachNode) {
      coachNode.style.transform = "translate3d(" + planeState.x + "px, " + (planeState.y + 44) + "px, 0) translate(-50%, 0)";
    }
  }

  function placeBullet(bullet) {
    bullet.node.style.transform = "translate3d(" + bullet.x + "px, " + bullet.y + "px, 0) translate(-50%, -50%)";
  }

  function shoot(now) {
    if (!layer || now - lastShot < 118) return;
    lastShot = now;
    var bullet = {
      x: planeState.x,
      y: planeState.y - 27,
      speed: 820,
      node: document.createElement("span")
    };
    bullet.node.className = "plane-game__bullet";
    placeBullet(bullet);
    layer.appendChild(bullet.node);
    bullets.push(bullet);
  }

  function updateBullets(delta) {
    for (var index = bullets.length - 1; index >= 0; index -= 1) {
      var bullet = bullets[index];
      bullet.y -= bullet.speed * delta;
      placeBullet(bullet);

      var hit = findHit(bullet.x, bullet.y);
      if (hit) {
        blastTarget(hit, bullet.x, bullet.y);
        bullet.node.remove();
        bullets.splice(index, 1);
        continue;
      }

      if (bullet.y < -24) {
        bullet.node.remove();
        bullets.splice(index, 1);
      }
    }
  }

  function findHit(x, y) {
    var best = null;
    var bestArea = Infinity;
    targets.forEach(function (target) {
      if (!isVisibleTarget(target)) return;
      var rect = target.getBoundingClientRect();
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
      var area = rect.width * rect.height;
      if (area < bestArea) {
        best = target;
        bestArea = area;
      }
    });
    return best;
  }

  function incrementScore(amount) {
    score += amount || 1;
    if (scoreNode) scoreNode.textContent = String(score);
  }

  function blastTarget(target, x, y) {
    if (target.classList.contains("plane-text-brick") || target.classList.contains("plane-icon-target")) {
      blastBrick(target);
    } else if (target.tagName && target.tagName.toLowerCase() === "canvas") {
      blastImage(target, x, y);
    }

    createBurst(x, y);
    collectTargets();
  }

  function blastBrick(target) {
    var driftX = Math.round((Math.random() - 0.5) * 54);
    var driftY = Math.round(42 + Math.random() * 56);
    var rotate = Math.round((Math.random() - 0.5) * 30);
    target.style.setProperty("--plane-hit-x", driftX + "px");
    target.style.setProperty("--plane-hit-y", driftY + "px");
    target.style.setProperty("--plane-hit-rotate", rotate + "deg");
    target.classList.add("plane-target-hit");
    hitTargets.push(target);
    incrementScore(1);
  }

  function blastImage(canvas, x, y) {
    var record = canvas._planeImageRecord;
    if (!record || !record.context) return;
    var rect = canvas.getBoundingClientRect();
    var localX = ((x - rect.left) / rect.width) * canvas.width;
    var localY = ((y - rect.top) / rect.height) * canvas.height;
    var scale = canvas.width / Math.max(rect.width, 1);
    var damage = Math.min(record.hits / 18, 1);
    var radius = (18 + Math.random() * 18 + damage * 10) * scale;
    record.hits += 1;
    carveImage(record.context, localX, localY, radius);
    incrementScore(1);
  }

  function carveImage(context, x, y, radius) {
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();

    for (var index = 0; index < 5; index += 1) {
      var angle = Math.random() * Math.PI * 2;
      var distance = radius * (0.28 + Math.random() * 0.7);
      var chipRadius = radius * (0.22 + Math.random() * 0.28);
      context.beginPath();
      context.arc(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, chipRadius, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function createBurst(x, y) {
    if (!layer) return;
    for (var index = 0; index < 8; index += 1) {
      var spark = document.createElement("span");
      var angle = (Math.PI * 2 * index) / 8 + Math.random() * 0.45;
      var distance = 12 + Math.random() * 25;
      spark.className = "plane-game__spark";
      spark.style.left = x + "px";
      spark.style.top = y + "px";
      spark.style.setProperty("--spark-x", Math.cos(angle) * distance + "px");
      spark.style.setProperty("--spark-y", Math.sin(angle) * distance + "px");
      layer.appendChild(spark);
      window.setTimeout(function (node) {
        node.remove();
      }, 620, spark);
    }
  }

  function isTouchControlEvent(event) {
    if (!event || event.pointerType === "mouse") return false;
    if (!event.target || !event.target.closest) return true;
    return !event.target.closest("a, button, input, textarea, select, iframe, video, .plane-game__hud");
  }

  function movePlaneToPointer(event) {
    var previousX = planeState.x;
    planeState.x = clamp(event.clientX, 28, window.innerWidth - 28);
    planeState.y = clamp(event.clientY, 58, window.innerHeight - 44);
    planeState.tilt = clamp((planeState.x - previousX) * 0.35, -18, 18);
    drawPlane();
  }

  function handlePointerDown(event) {
    if (!active || !isTouchControlEvent(event)) return;
    touchPointerId = event.pointerId;
    event.preventDefault();
    movePlaneToPointer(event);
  }

  function handlePlanePointerDown(event) {
    if (!active) return;
    event.preventDefault();
    event.stopPropagation();
    touchPointerId = event.pointerId;
    if (plane && plane.setPointerCapture && event.pointerId !== undefined) {
      try {
        plane.setPointerCapture(event.pointerId);
      } catch (error) {}
    }
    movePlaneToPointer(event);
    shoot(performance.now());
  }

  function handlePointerMove(event) {
    if (!active || touchPointerId === null || event.pointerId !== touchPointerId) return;
    event.preventDefault();
    movePlaneToPointer(event);
  }

  function handlePointerEnd(event) {
    if (!active || touchPointerId === null || event.pointerId !== touchPointerId) return;
    if (plane && plane.releasePointerCapture && event.pointerId !== undefined) {
      try {
        plane.releasePointerCapture(event.pointerId);
      } catch (error) {}
    }
    touchPointerId = null;
  }

  function tick(now) {
    if (!active) return;
    var delta = Math.min((now - lastTime) / 1000, 0.04);
    lastTime = now;

    var horizontal = (keys.arrowright || keys.d ? 1 : 0) - (keys.arrowleft || keys.a ? 1 : 0);
    var vertical = (keys.arrowdown || keys.s ? 1 : 0) - (keys.arrowup || keys.w ? 1 : 0);
    var speed = 370;
    planeState.x = clamp(planeState.x + horizontal * speed * delta, 28, window.innerWidth - 28);
    planeState.y = clamp(planeState.y + vertical * speed * delta, 52, window.innerHeight - 34);
    planeState.tilt += (horizontal * 18 - planeState.tilt) * 0.18;

    if (keys[" "]) shoot(now);
    drawPlane();
    updateBullets(delta);
    frameId = window.requestAnimationFrame(tick);
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest) return;
    var toggleButton = event.target.closest("[data-plane-game-toggle]");
    if (!toggleButton) return;
    event.preventDefault();
    toggle();
  });

  window.addEventListener("keydown", function (event) {
    if (!active && isTrigger(event) && !isEditable(event)) {
      event.preventDefault();
      start();
      return;
    }

    if (!active) return;
    var key = event.key.toLowerCase();
    if (key === "escape") {
      event.preventDefault();
      stop(true);
      return;
    }
    if (key === "r") {
      event.preventDefault();
      restoreTargets();
      return;
    }
    if (["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s", " "].indexOf(key) >= 0) {
      event.preventDefault();
      keys[key] = true;
    }
  });

  window.addEventListener("keyup", function (event) {
    if (!active) return;
    keys[event.key.toLowerCase()] = false;
  });

  window.addEventListener("pointerdown", handlePointerDown, { passive: false });
  window.addEventListener("pointermove", handlePointerMove, { passive: false });
  window.addEventListener("pointerup", handlePointerEnd);
  window.addEventListener("pointercancel", handlePointerEnd);

  window.addEventListener("resize", function () {
    if (!active) return;
    planeState.x = clamp(planeState.x, 28, window.innerWidth - 28);
    planeState.y = clamp(planeState.y, 58, window.innerHeight - 44);
    collectTargets();
  });

  syncToggleButtons();
})();
