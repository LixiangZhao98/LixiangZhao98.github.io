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
      dragging: false,
      lastX: 0,
      lastY: 0,
      dpr: 1
    };

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
        x: width * 0.5 + x1 * scale,
        y: height * 0.52 - y1 * scale,
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

    function animate() {
      if (!state.dragging) {
        state.rotY += 0.0022;
      }
      render();
      window.requestAnimationFrame(animate);
    }

    canvas.addEventListener("pointerdown", function (event) {
      state.dragging = true;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", function (event) {
      if (!state.dragging) return;
      var dx = event.clientX - state.lastX;
      var dy = event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.rotY += dx * 0.008;
      state.rotX = clamp(state.rotX + dy * 0.006, -1.2, 1.2);
    });

    function endDrag(event) {
      state.dragging = false;
      if (event && canvas.releasePointerCapture) {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch (error) {}
      }
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("wheel", function (event) {
      event.preventDefault();
      state.zoom = clamp(state.zoom + (event.deltaY < 0 ? 0.08 : -0.08), 0.62, 2.4);
    }, { passive: false });

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
          status.textContent = state.count + " / " + state.sourceVertices + " 3DGS sample points";
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
