(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function initViewer(root) {
    var canvas = root.querySelector("canvas");
    var status = root.querySelector(".thesis-viewer__status");
    var url = root.getAttribute("data-point-cloud");
    if (!canvas || !url) return;

    var context = canvas.getContext("2d");
    var state = {
      positions: null,
      colors: null,
      count: 0,
      sourceVertices: 0,
      rotX: -0.18,
      rotY: 0.42,
      zoom: 1.08,
      panX: 0,
      panY: 0,
      dragging: false,
      panning: false,
      flying: false,
      keys: {},
      pointers: {},
      pinchStartDistance: 0,
      pinchStartZoom: 1,
      pinchStartMidX: 0,
      pinchStartMidY: 0,
      pinchStartPanX: 0,
      pinchStartPanY: 0,
      lastX: 0,
      lastY: 0,
      lastFrame: 0,
      dpr: 1
    };
    canvas.tabIndex = 0;

    function resize() {
      var rect = root.getBoundingClientRect();
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * state.dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * state.dpr));
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    }

    function projectPoint(index, width, height) {
      var p = state.positions;
      var c = state.colors;
      var x = p[index * 3];
      var y = p[index * 3 + 1];
      var z = p[index * 3 + 2];

      var cosY = Math.cos(state.rotY);
      var sinY = Math.sin(state.rotY);
      var cosX = Math.cos(state.rotX);
      var sinX = Math.sin(state.rotX);

      var x1 = x * cosY - z * sinY;
      var z1 = x * sinY + z * cosY;
      var y1 = y * cosX - z1 * sinX;
      var z2 = y * sinX + z1 * cosX;
      var depth = z2 + 6.2;
      var scale = (height * 0.42 * state.zoom) / Math.max(0.6, depth);

      return {
        x: width * 0.5 + state.panX * state.dpr + x1 * scale,
        y: height * 0.52 + state.panY * state.dpr - y1 * scale,
        z: z2,
        r: Math.round((c[index * 3] || 0.75) * 255),
        g: Math.round((c[index * 3 + 1] || 0.75) * 255),
        b: Math.round((c[index * 3 + 2] || 0.75) * 255),
        size: clamp(scale * 0.013, 1.15 * state.dpr, 3.8 * state.dpr)
      };
    }

    function render() {
      if (!state.positions) return;

      var width = canvas.width;
      var height = canvas.height;
      context.clearRect(0, 0, width, height);

      var gradient = context.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.64);
      gradient.addColorStop(0, "rgba(125, 211, 252, 0.08)");
      gradient.addColorStop(0.55, "rgba(15, 23, 42, 0.08)");
      gradient.addColorStop(1, "rgba(2, 6, 23, 0.22)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      var stride = state.dragging ? Math.max(1, Math.ceil(state.count / 90000)) : Math.max(1, Math.ceil(state.count / 130000));
      context.globalAlpha = 0.9;
      for (var index = 0; index < state.count; index += stride) {
        var point = projectPoint(index, width, height);
        context.beginPath();
        context.fillStyle = "rgba(" + point.r + "," + point.g + "," + point.b + ",0.88)";
        context.fillRect(point.x, point.y, point.size, point.size);
      }
      context.globalAlpha = 1;
    }

    function updateFly(deltaSeconds) {
      if (!state.flying) return;

      var forward = (state.keys.w || state.keys.arrowup ? 1 : 0) - (state.keys.s || state.keys.arrowdown ? 1 : 0);
      var sideways = (state.keys.d || state.keys.arrowright ? 1 : 0) - (state.keys.a || state.keys.arrowleft ? 1 : 0);
      var vertical = (state.keys.e ? 1 : 0) - (state.keys.q ? 1 : 0);
      var zoomFactor = Math.pow(2.1, deltaSeconds);
      var panStep = 260 * deltaSeconds / Math.max(0.8, Math.sqrt(state.zoom));

      if (forward > 0) {
        state.zoom = Math.max(0.05, state.zoom * zoomFactor);
      } else if (forward < 0) {
        state.zoom = Math.max(0.05, state.zoom / zoomFactor);
      }

      state.panX -= sideways * panStep;
      state.panY -= vertical * panStep;
    }

    function animate(timestamp) {
      var deltaSeconds = state.lastFrame ? Math.min(0.05, (timestamp - state.lastFrame) / 1000) : 0;
      state.lastFrame = timestamp;
      updateFly(deltaSeconds);
      if (!state.dragging) {
        state.rotY += 0.0022;
      }
      render();
      window.requestAnimationFrame(animate);
    }

    function getPointerList() {
      return Object.keys(state.pointers).map(function (key) {
        return state.pointers[key];
      });
    }

    function getPinchMetrics(points) {
      var dx = points[0].x - points[1].x;
      var dy = points[0].y - points[1].y;
      return {
        distance: Math.max(1, Math.sqrt(dx * dx + dy * dy)),
        midX: (points[0].x + points[1].x) * 0.5,
        midY: (points[0].y + points[1].y) * 0.5
      };
    }

    function beginPinch() {
      var points = getPointerList();
      if (points.length < 2) return;
      var metrics = getPinchMetrics(points);
      state.dragging = false;
      state.panning = true;
      state.pinchStartDistance = metrics.distance;
      state.pinchStartZoom = state.zoom;
      state.pinchStartMidX = metrics.midX;
      state.pinchStartMidY = metrics.midY;
      state.pinchStartPanX = state.panX;
      state.pinchStartPanY = state.panY;
    }

    canvas.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      state.pointers[event.pointerId] = {
        x: event.clientX,
        y: event.clientY
      };
      state.dragging = true;
      state.flying = event.button === 2;
      state.panning = !state.flying && (event.shiftKey || event.button === 1);
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      root.classList.toggle("is-flying", state.flying);
      canvas.setPointerCapture(event.pointerId);
      if (getPointerList().length >= 2) {
        beginPinch();
      }
    });

    canvas.addEventListener("pointermove", function (event) {
      event.preventDefault();
      if (state.pointers[event.pointerId]) {
        state.pointers[event.pointerId] = {
          x: event.clientX,
          y: event.clientY
        };
      }
      var points = getPointerList();
      if (points.length >= 2) {
        var metrics = getPinchMetrics(points);
        state.zoom = Math.max(0.18, state.pinchStartZoom * (metrics.distance / state.pinchStartDistance));
        state.panX = state.pinchStartPanX + (metrics.midX - state.pinchStartMidX) / state.dpr;
        state.panY = state.pinchStartPanY + (metrics.midY - state.pinchStartMidY) / state.dpr;
        return;
      }
      if (!state.dragging) return;
      var dx = event.clientX - state.lastX;
      var dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      if (state.panning || event.shiftKey) {
        state.panX += dx / state.dpr;
        state.panY += dy / state.dpr;
      } else {
        var lookScale = state.flying ? 0.0052 : 0.008;
        state.rotY += dx * lookScale;
        state.rotX = clamp(state.rotX + dy * lookScale, -1.42, 1.42);
      }
    });

    function endDrag(event) {
      if (event) {
        delete state.pointers[event.pointerId];
      }
      if (getPointerList().length >= 2) {
        beginPinch();
        return;
      }
      state.dragging = false;
      state.panning = false;
      state.flying = false;
      root.classList.remove("is-flying");
      if (event && canvas.releasePointerCapture) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (error) {}
      }
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    canvas.addEventListener("wheel", function (event) {
      event.preventDefault();
      var rect = canvas.getBoundingClientRect();
      var beforeZoom = state.zoom;
      var nextZoom = Math.max(0.05, beforeZoom * (event.deltaY < 0 ? 1.22 : 0.82));
      var anchorX = event.clientX - rect.left - rect.width * 0.5 - state.panX;
      var anchorY = event.clientY - rect.top - rect.height * 0.52 - state.panY;
      state.zoom = nextZoom;
      state.panX -= anchorX * (nextZoom / beforeZoom - 1);
      state.panY -= anchorY * (nextZoom / beforeZoom - 1);
    }, { passive: false });

    window.addEventListener("keydown", function (event) {
      var key = event.key.toLowerCase();
      if (!/^(w|a|s|d|q|e|arrowup|arrowdown|arrowleft|arrowright)$/.test(key)) return;
      if (!state.flying && document.activeElement !== canvas) return;
      state.keys[key] = true;
      if (state.flying) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", function (event) {
      var key = event.key.toLowerCase();
      if (state.keys[key]) {
        state.keys[key] = false;
        if (state.flying) {
          event.preventDefault();
        }
      }
    });

    window.addEventListener("blur", function () {
      state.keys = {};
      state.pointers = {};
      state.dragging = false;
      state.panning = false;
      state.flying = false;
      root.classList.remove("is-flying");
    });

    resize();
    window.addEventListener("resize", resize);

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("Failed to load point cloud");
        return response.json();
      })
      .then(function (data) {
        state.positions = new Float32Array(data.positions || []);
        state.colors = new Float32Array(data.colors || []);
        state.count = data.count || Math.floor(state.positions.length / 3);
        state.sourceVertices = data.sourceVertices || state.count;
        if (status) {
          status.textContent = state.count + " / " + state.sourceVertices + " points · Wheel zoom · RMB + WASD fly";
        }
        root.classList.add("is-loaded");
        animate();
      })
      .catch(function () {
        if (status) {
          status.textContent = "3DGS preview could not be loaded";
        }
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll("[data-thesis-viewer]"), initViewer);
  });
})();
