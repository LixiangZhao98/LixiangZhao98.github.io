(function () {
  var TRIGGER = { ctrlKey: true, altKey: true, key: "p" };
  var TARGET_SELECTOR = [
    ".plane-text-brick:not(.plane-target-hit)",
    ".plane-icon-target:not(.plane-target-hit)",
    "img.plane-image-target:not(.plane-image-consumed)"
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
  var scoreNode = null;
  var targets = [];
  var hitTargets = [];
  var imageBites = [];
  var crackedImages = [];
  var iconTargets = [];
  var textWrappers = [];
  var bullets = [];
  var keys = {};
  var frameId = 0;
  var lastTime = 0;
  var lastShot = 0;
  var score = 0;
  var planeState = { x: 0, y: 0, tilt: 0 };

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
    if (target.classList.contains("plane-target-hit") || target.classList.contains("plane-image-consumed")) return false;
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
      image.classList.add("plane-image-target");
      clearImageState(image);
    });
  }

  function start() {
    if (active) return;
    active = true;
    syncToggleButtons();
    keys = {};
    bullets = [];
    hitTargets = [];
    imageBites = [];
    crackedImages = [];
    score = 0;
    lastShot = 0;
    planeState.x = window.innerWidth / 2;
    planeState.y = window.innerHeight - 82;
    planeState.tilt = 0;

    layer = document.createElement("div");
    layer.className = "plane-game-layer";
    layer.innerHTML = [
      '<div class="plane-game__hud" aria-live="polite">',
      '  <span class="plane-game__score">0</span>',
      '  <button class="plane-game__button plane-game__restore" type="button" aria-label="Restore page" title="Restore page"><i class="fas fa-redo" aria-hidden="true"></i></button>',
      '  <button class="plane-game__button plane-game__close" type="button" aria-label="Close plane mode" title="Close plane mode"><i class="fas fa-times" aria-hidden="true"></i></button>',
      '</div>',
      '<div class="plane-game__plane" aria-hidden="true">',
      '  <span class="plane-game__plane-wing"></span>',
      '  <span class="plane-game__plane-body"></span>',
      '  <span class="plane-game__plane-flame"></span>',
      '</div>'
    ].join("");
    document.body.appendChild(layer);
    document.body.classList.add("plane-game-active");

    plane = layer.querySelector(".plane-game__plane");
    scoreNode = layer.querySelector(".plane-game__score");
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
    scoreNode = null;
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
    crackedImages.forEach(clearImageState);
    crackedImages = [];
    imageBites.forEach(function (bite) {
      bite.remove();
    });
    imageBites = [];
    score = 0;
    if (scoreNode) scoreNode.textContent = "0";
    collectTargets();
  }

  function clearImageState(image) {
    image.classList.remove("plane-image-cracked");
    image.classList.remove("plane-image-consumed");
    image.removeAttribute("data-plane-hits");
    image.style.removeProperty("--plane-image-damage");
    image.style.removeProperty("--plane-image-opacity");
    image.style.removeProperty("--plane-image-saturate");
    image.style.removeProperty("--plane-image-brightness");
    image.style.removeProperty("--plane-image-contrast");
  }

  function clearImageTargets() {
    Array.prototype.forEach.call(document.querySelectorAll("body img.plane-image-target"), function (image) {
      clearImageState(image);
      image.classList.remove("plane-image-target");
    });
  }

  function drawPlane() {
    if (!plane) return;
    plane.style.transform = "translate3d(" + planeState.x + "px, " + planeState.y + "px, 0) translate(-50%, -50%) rotate(" + planeState.tilt + "deg)";
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
    layer.appendChild(bullet.node);
    bullets.push(bullet);
  }

  function updateBullets(delta) {
    for (var index = bullets.length - 1; index >= 0; index -= 1) {
      var bullet = bullets[index];
      bullet.y -= bullet.speed * delta;
      bullet.node.style.transform = "translate3d(" + bullet.x + "px, " + bullet.y + "px, 0) translate(-50%, -50%)";

      var hit = findHit(bullet.x, bullet.y);
      if (hit) {
        blastTarget(hit, bullet.x, bullet.y);
        bullet.node.remove();
        bullets.splice(index, 1);
      } else if (bullet.y < -24) {
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
    } else if (target.tagName && target.tagName.toLowerCase() === "img") {
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

  function imageHitLimit(image) {
    var rect = image.getBoundingClientRect();
    return clamp(Math.ceil((rect.width * rect.height) / 14000), 8, 28);
  }

  function blastImage(image, x, y) {
    var limit = imageHitLimit(image);
    var hits = Number(image.getAttribute("data-plane-hits") || "0") + 1;
    var damage = clamp(hits / limit, 0, 1);
    image.setAttribute("data-plane-hits", String(hits));
    image.style.setProperty("--plane-image-damage", damage.toFixed(3));
    image.style.setProperty("--plane-image-opacity", Math.max(0.18, 1 - damage * 0.78).toFixed(3));
    image.style.setProperty("--plane-image-saturate", Math.max(0.36, 1 - damage * 0.48).toFixed(3));
    image.style.setProperty("--plane-image-brightness", Math.max(0.68, 1 - damage * 0.26).toFixed(3));
    image.style.setProperty("--plane-image-contrast", (1 + damage * 0.12).toFixed(3));
    image.classList.add("plane-image-cracked");
    if (crackedImages.indexOf(image) < 0) crackedImages.push(image);
    createImageBite(image, x, y, damage);
    incrementScore(1);

    if (damage >= 1) {
      image.classList.add("plane-image-consumed");
    }
  }

  function createImageBite(image, x, y, damage) {
    if (!layer) return;
    var bite = document.createElement("span");
    var size = 18 + Math.random() * 24 + damage * 12;
    bite.className = "plane-image-bite";
    bite.style.left = x + "px";
    bite.style.top = y + "px";
    bite.style.width = size + "px";
    bite.style.height = size + "px";
    bite.style.setProperty("--bite-rotate", Math.round(Math.random() * 360) + "deg");
    bite.style.setProperty("--bite-alpha", (0.58 + damage * 0.22).toFixed(2));
    layer.appendChild(bite);
    imageBites.push(bite);
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

  window.addEventListener("resize", function () {
    if (!active) return;
    planeState.x = clamp(planeState.x, 28, window.innerWidth - 28);
    planeState.y = clamp(planeState.y, 52, window.innerHeight - 34);
    collectTargets();
  });

  syncToggleButtons();
})();
