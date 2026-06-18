(function () {
  var TRIGGER = { ctrlKey: true, altKey: true, key: "p" };
  var TARGET_SELECTOR = "main .plane-text-brick:not(.plane-target-hit), main img:not(.plane-target-hit)";
  var TEXT_ROOT_SELECTOR = "main h1, main h2, main h3, main p, main th, main td, main li, main figcaption";
  var SKIP_TEXT_SELECTOR = "script, style, noscript, iframe, video, canvas, svg, pre, code, .plane-game-layer";

  var active = false;
  var layer = null;
  var plane = null;
  var scoreNode = null;
  var targets = [];
  var hitTargets = [];
  var imageBites = [];
  var crackedImages = [];
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
    if (!target || target.closest(".plane-game-layer")) return false;
    if (target.classList.contains("plane-target-hit")) return false;
    var rect = target.getBoundingClientRect();
    return rect.width > 4 && rect.height > 4 && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  }

  function collectTargets() {
    targets = Array.prototype.slice.call(document.querySelectorAll(TARGET_SELECTOR)).filter(isVisibleTarget);
  }

  function splitToken(token) {
    if (/^[\u4e00-\u9fff]+$/.test(token)) return token.split("");
    if (token.length <= 14) return [token];
    var chunks = [];
    for (var index = 0; index < token.length; index += 10) {
      chunks.push(token.slice(index, index + 10));
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

      splitToken(part).forEach(function (chunk, chunkIndex, chunkList) {
        var brick = document.createElement("span");
        brick.className = "plane-text-brick";
        brick.textContent = chunk;
        wrapper.appendChild(brick);
        if (chunkIndex < chunkList.length - 1) {
          wrapper.appendChild(document.createTextNode(""));
        }
      });
    });

    return wrapper;
  }

  function prepareTextTargets() {
    if (textWrappers.length) return;

    Array.prototype.forEach.call(document.querySelectorAll(TEXT_ROOT_SELECTOR), function (root) {
      if (root.closest(SKIP_TEXT_SELECTOR)) return;

      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
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

  function prepareImageTargets() {
    Array.prototype.forEach.call(document.querySelectorAll("main img"), function (image) {
      image.classList.add("plane-image-target");
      image.classList.remove("plane-image-cracked");
      image.classList.remove("plane-target-hit");
      image.removeAttribute("data-plane-hits");
      image.style.removeProperty("--plane-hit-x");
      image.style.removeProperty("--plane-hit-y");
      image.style.removeProperty("--plane-hit-rotate");
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
      '<div class="plane-game__plane" aria-hidden="true"></div>'
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
      if (target.tagName && target.tagName.toLowerCase() === "img") {
        clearImageState(target);
      }
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
    image.classList.remove("plane-target-hit");
    image.classList.remove("plane-image-cracked");
    image.removeAttribute("data-plane-hits");
    image.style.removeProperty("--plane-hit-x");
    image.style.removeProperty("--plane-hit-y");
    image.style.removeProperty("--plane-hit-rotate");
  }

  function clearImageTargets() {
    Array.prototype.forEach.call(document.querySelectorAll("main img.plane-image-target"), function (image) {
      clearImageState(image);
      image.classList.remove("plane-image-target");
    });
  }

  function drawPlane() {
    if (!plane) return;
    plane.style.transform = "translate3d(" + planeState.x + "px, " + planeState.y + "px, 0) translate(-50%, -50%) rotate(" + planeState.tilt + "deg)";
  }

  function shoot(now) {
    if (!layer || now - lastShot < 125) return;
    lastShot = now;
    var bullet = {
      x: planeState.x,
      y: planeState.y - 24,
      speed: 780,
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
    if (target.classList.contains("plane-text-brick")) {
      blastTextBrick(target, x, y);
    } else if (target.tagName && target.tagName.toLowerCase() === "img") {
      blastImage(target, x, y);
    }

    createBurst(x, y);
    collectTargets();
  }

  function blastTextBrick(target, x, y) {
    var driftX = Math.round((Math.random() - 0.5) * 48);
    var driftY = Math.round(34 + Math.random() * 42);
    var rotate = Math.round((Math.random() - 0.5) * 24);
    target.style.setProperty("--plane-hit-x", driftX + "px");
    target.style.setProperty("--plane-hit-y", driftY + "px");
    target.style.setProperty("--plane-hit-rotate", rotate + "deg");
    target.classList.add("plane-target-hit");
    hitTargets.push(target);
    incrementScore(1);
  }

  function imageHitLimit(image) {
    var rect = image.getBoundingClientRect();
    return clamp(Math.ceil((rect.width * rect.height) / 18000), 4, 12);
  }

  function blastImage(image, x, y) {
    var hits = Number(image.getAttribute("data-plane-hits") || "0") + 1;
    image.setAttribute("data-plane-hits", String(hits));
    image.classList.add("plane-image-cracked");
    if (crackedImages.indexOf(image) < 0) crackedImages.push(image);
    createImageBite(image, x, y);
    incrementScore(1);

    if (hits >= imageHitLimit(image)) {
      var driftX = Math.round((Math.random() - 0.5) * 44);
      var driftY = Math.round(28 + Math.random() * 36);
      var rotate = Math.round((Math.random() - 0.5) * 10);
      image.style.setProperty("--plane-hit-x", driftX + "px");
      image.style.setProperty("--plane-hit-y", driftY + "px");
      image.style.setProperty("--plane-hit-rotate", rotate + "deg");
      image.classList.add("plane-target-hit");
      hitTargets.push(image);
    }
  }

  function createImageBite(image, x, y) {
    if (!layer) return;
    var bite = document.createElement("span");
    var size = 22 + Math.random() * 28;
    bite.className = "plane-image-bite";
    bite.style.left = x + "px";
    bite.style.top = y + "px";
    bite.style.width = size + "px";
    bite.style.height = size + "px";
    bite.style.setProperty("--bite-rotate", Math.round(Math.random() * 360) + "deg");
    layer.appendChild(bite);
    imageBites.push(bite);
  }

  function createBurst(x, y) {
    if (!layer) return;
    for (var index = 0; index < 7; index += 1) {
      var spark = document.createElement("span");
      var angle = (Math.PI * 2 * index) / 7 + Math.random() * 0.45;
      var distance = 14 + Math.random() * 24;
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
    var speed = 360;
    planeState.x = clamp(planeState.x + horizontal * speed * delta, 28, window.innerWidth - 28);
    planeState.y = clamp(planeState.y + vertical * speed * delta, 52, window.innerHeight - 34);
    planeState.tilt += (horizontal * 16 - planeState.tilt) * 0.18;

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
