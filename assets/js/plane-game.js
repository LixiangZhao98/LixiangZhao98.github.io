(function () {
  var TRIGGER = { ctrlKey: true, altKey: true, key: "p" };
  var TARGET_SELECTOR = [
    "main img",
    "main h1",
    "main h2",
    "main h3",
    "main p",
    "main th",
    "main td",
    "main li",
    "main .pub-card",
    "main .selected-publication",
    "main .cv-entry"
  ].join(", ");

  var active = false;
  var layer = null;
  var plane = null;
  var scoreNode = null;
  var targets = [];
  var hitTargets = [];
  var bullets = [];
  var keys = {};
  var frameId = 0;
  var lastTime = 0;
  var lastShot = 0;
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

  function collectTargets() {
    targets = Array.prototype.slice.call(document.querySelectorAll(TARGET_SELECTOR)).filter(function (target) {
      if (!target || target.closest(".plane-game-layer")) return false;
      if (target.classList.contains("plane-target-hit")) return false;
      var rect = target.getBoundingClientRect();
      return rect.width > 18 && rect.height > 10 && rect.bottom > 0 && rect.top < window.innerHeight;
    });
  }

  function start() {
    if (active) return;
    active = true;
    keys = {};
    bullets = [];
    hitTargets = [];
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
    if (layer) layer.remove();
    layer = null;
    plane = null;
    scoreNode = null;
    document.body.classList.remove("plane-game-active");
  }

  function restoreTargets() {
    hitTargets.forEach(function (target) {
      target.classList.remove("plane-target-hit");
      target.style.removeProperty("--plane-hit-x");
      target.style.removeProperty("--plane-hit-y");
      target.style.removeProperty("--plane-hit-rotate");
    });
    hitTargets = [];
    if (scoreNode) scoreNode.textContent = "0";
    collectTargets();
  }

  function drawPlane() {
    if (!plane) return;
    plane.style.transform = "translate3d(" + planeState.x + "px, " + planeState.y + "px, 0) translate(-50%, -50%) rotate(" + planeState.tilt + "deg)";
  }

  function shoot(now) {
    if (!layer || now - lastShot < 135) return;
    lastShot = now;
    var bullet = {
      x: planeState.x,
      y: planeState.y - 24,
      speed: 760,
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
      if (target.classList.contains("plane-target-hit")) return;
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

  function blastTarget(target, x, y) {
    var driftX = Math.round((Math.random() - 0.5) * 42);
    var driftY = Math.round(18 + Math.random() * 30);
    var rotate = Math.round((Math.random() - 0.5) * 13);
    target.style.setProperty("--plane-hit-x", driftX + "px");
    target.style.setProperty("--plane-hit-y", driftY + "px");
    target.style.setProperty("--plane-hit-rotate", rotate + "deg");
    target.classList.add("plane-target-hit");
    hitTargets.push(target);
    createBurst(x, y);
    if (scoreNode) scoreNode.textContent = String(hitTargets.length);
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
})();
