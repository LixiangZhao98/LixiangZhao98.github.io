---
layout: wide
title: "Ph.D. Thesis"
permalink: /thesis/
author_profile: false
hide_title: true
---

<main class="thesis-page">
  <header class="thesis-hero glass-card">
    <div class="thesis-hero__copy">
      <p class="thesis-kicker">
        <span data-lang-only="en">Ph.D. thesis</span>
        <span data-lang-only="zh">博士论文</span>
      </p>
      <h1>Bridging Immersion Levels in Spatial Data Exploration: Visualization, Interaction, and Computing</h1>
      <p class="thesis-hero__meta">
        <span data-lang-only="en">Lixiang Zhao · Xi'an Jiaotong-Liverpool University</span>
        <span data-lang-only="zh">赵锂想 · 西交利物浦大学</span>
      </p>
    </div>
    <div class="thesis-hero__actions">
      <a class="pub-action" href="/assets/Publications/thesis/201593126_Nov2025.pdf" download="Lixiang_Zhao_PhD_Thesis.pdf">
        <i class="fas fa-file-pdf" aria-hidden="true"></i>
        <span data-lang-only="en">Download Thesis</span>
        <span data-lang-only="zh">下载论文</span>
      </a>
    </div>
  </header>

  <section class="thesis-section glass-card">
    <h2><span data-lang-only="en">Research Threads</span><span data-lang-only="zh">论文相关研究</span></h2>
    <div class="thesis-paper-grid">
      <a class="thesis-paper-tile" href="/publications/metacast/">
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/thesis/teasers/MeTACAST.webp" alt="MeTACAST teaser" loading="lazy" decoding="async" width="560" height="194"></span>
        <span>MeTACAST</span>
      </a>
      <a class="thesis-paper-tile" href="/publications/scalefree/">
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/thesis/teasers/ScaleFree.webp" alt="ScaleFree teaser" loading="lazy" decoding="async" width="560" height="147"></span>
        <span>ScaleFree</span>
      </a>
      <a class="thesis-paper-tile" href="/publications/l-wim/">
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/thesis/teasers/L_Wim.webp" alt="L-WiM teaser" loading="lazy" decoding="async" width="560" height="218"></span>
        <span>L-WiM</span>
      </a>
      <a class="thesis-paper-tile" href="/publications/spatialtouch/">
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/thesis/teasers/spatialtouch.webp" alt="SpatialTouch teaser" loading="lazy" decoding="async" width="560" height="145"></span>
        <span>SpatialTouch</span>
      </a>
    </div>
  </section>

  <section class="thesis-section glass-card">
    <h2><span data-lang-only="en">Abstract</span><span data-lang-only="zh">摘要</span></h2>
    <div data-lang-only="en">
      <p>Visualization enables experts to interpret domain-specific data through cycles of exploration and decision-making. Immersive visualization, via VR, AR, and MR, has gained attention for spatial data analysis due to stereoscopic rendering and embodied 6DOF interaction.</p>
      <p>Despite progress in immersive analytics, spatial data exploration continues to present challenges across multiple levels of immersion. This thesis addresses the central question: How immersive environments should be designed to support spatial data exploration effectively and efficiently? First, we investigate imprecise mid-air input for spatial data selection and introduce target- and context-aware selection techniques for cosmological data that infer user intent from approximate pointing or stroke input combined with data properties such as density, generating accurate selection volumes despite occlusion, heterogeneous density, and complex geometry. A controlled study shows that these methods outperform region-based techniques in accuracy and intent alignment.</p>
      <p>Second, because our selection techniques depend on computationally expensive scalar fields, we present a GPU-accelerated adaptive kernel density estimation method that recomputes the field at finer resolution as users navigate to smaller scales, providing real-time evaluation of fine-grained structures without perceptible latency. Third, to support multi-scale visualization while preserving global context, we propose two interfaces that maintain users' awareness of scale, position, and orientation, enable smooth transitions across spatial scales, and support multi-user collaboration.</p>
      <p>Finally, recognizing that scientific workflows often require both 2D and 3D representations, we develop a cross-reality environment that unifies a 2D surface with a 3D AR workspace, allowing visualizations to be placed on the surface, in space, or both, while maintaining spatial perception and enabling flexible hybrid interaction. Together, these contributions provide visualization methods, interaction techniques, and high-performance computing solutions that collectively answer the thesis's central question and outline a path toward effective immersive spatial data exploration.</p>
    </div>
    <div data-lang-only="zh">
      <p>可视化帮助专家在探索与决策的循环中理解特定领域数据。基于 VR、AR 和 MR 的沉浸式可视化因立体渲染和具身 6DOF 交互，在空间数据分析中受到越来越多关注。</p>
      <p>尽管沉浸式分析已有显著进展，跨越不同沉浸层级的空间数据探索仍然面临挑战。本论文围绕一个核心问题展开：应如何设计沉浸式环境，以有效且高效地支持空间数据探索？首先，本研究面向空间数据选择中的不精确空中输入，提出目标与上下文感知的选择技术，通过结合近似指向或笔画输入与数据密度等属性推断用户意图，从而在遮挡、非均匀密度和复杂几何条件下生成更准确的选择体。</p>
      <p>其次，由于这些选择技术依赖计算代价较高的标量场，本研究提出 GPU 加速的自适应核密度估计方法，在用户导航到更小尺度时以更高分辨率重新计算场，实现对细粒度结构的实时评估。第三，为支持多尺度可视化并保留全局上下文，本研究提出两个界面，以保持用户对尺度、位置与方向的感知，支持平滑的空间尺度转换和多人协作。</p>
      <p>最后，考虑到科学工作流常常需要同时使用 2D 与 3D 表示，本研究构建了一个跨现实环境，将二维表面与三维 AR 工作空间统一起来，使可视化能够放置在表面、空间或两者之中，同时维持空间感知并支持灵活的混合交互。总体而言，本论文从可视化方法、交互技术和高性能计算三个层面回应核心研究问题，并为有效的沉浸式空间数据探索提供了路径。</p>
    </div>
  </section>

  <section id="graduation-cap-3dgs" class="thesis-section glass-card">
    <div class="thesis-section__head">
      <h2><span data-lang-only="en">3D Gaussian Graduation Cap</span><span data-lang-only="zh">博士帽 3D Gaussian Viewer</span></h2>
      <a class="pub-chip" href="/assets/Publications/thesis/phd_hat_cap.splat" download="phd_hat_cap.splat">
        <i class="fas fa-download" aria-hidden="true"></i>
        <span data-lang-only="en">Download SPLAT</span>
        <span data-lang-only="zh">下载 SPLAT</span>
      </a>
    </div>
    <p class="thesis-gaussian-note thesis-gaussian-thanks">
      <span data-lang-only="en">Many thanks to my supervisor <strong>Lingyun Yu</strong>, and to my lab partners and the cap makers: <strong>Wanfang Xu</strong>, <strong>Fuqi Xie</strong>, <strong>Shuqi He</strong>, <strong>Jifan Yang</strong>, and <strong>Shuzi Zou</strong>.</span>
      <span data-lang-only="zh">特别感谢导师 <strong>俞凌云</strong>，以及实验室伙伴和博士帽制作者：<strong>徐万芳</strong>、<strong>谢馥琪</strong>、<strong>何舒淇</strong>、<strong>杨济帆</strong>、<strong>邹树滋</strong>。</span>
    </p>
    <div id="thesis-splat-viewer" class="splat-viewer thesis-inline-splat" data-splat-url="/assets/Publications/thesis/phd_hat_cap.splat">
      <div class="splat-viewer__prompt">
        <img src="/assets/Publications/thesis/phd_hat_poster.webp" alt="Ph.D. graduation cap 3DGS preview" loading="lazy" decoding="async" width="1600" height="675">
        <button type="button" class="splat-viewer__load">
          <i class="fas fa-cube" aria-hidden="true"></i>
          <span data-lang-only="en">Load 3DGS Viewer</span>
          <span data-lang-only="zh">加载 3DGS Viewer</span>
        </button>
      </div>
      <div class="splat-viewer__status">
        <span data-lang-only="en">3DGS viewer is not loaded yet.</span>
        <span data-lang-only="zh">3DGS Viewer 尚未加载。</span>
      </div>
      <div class="splat-viewer__progress" aria-hidden="true">
        <div class="splat-viewer__progress-bar"></div>
      </div>
    </div>
    <p class="splat-shell__footer thesis-inline-splat__help">
      <span data-lang-only="en">Left drag orbit · right drag pan · wheel or pinch zoom · P toggles point mode · I toggles info</span>
      <span data-lang-only="zh">左键拖拽旋转 · 右键拖拽平移 · 滚轮或双指缩放 · P 切换点模式 · I 显示信息</span>
    </p>
  </section>
</main>

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
  }
}
</script>

<script type="module">
  const root = document.getElementById("thesis-splat-viewer");
  const status = root ? root.querySelector(".splat-viewer__status") : null;
  const prompt = root ? root.querySelector(".splat-viewer__prompt") : null;
  const loadButton = root ? root.querySelector(".splat-viewer__load") : null;
  const progressBar = root ? root.querySelector(".splat-viewer__progress-bar") : null;
  let hasStarted = false;
  let activeViewer = null;
  let loadAttempt = 0;
  let displayedLoadProgress = 0;
  const splatAssetVersion = "20260713-cap-progress";
  const loadTimeoutMs = 90000;
  const loadedSplatLabel = "305,513 cap splats loaded";
  const sceneCenterOffset = [0.023077924024633843, 0.15635754090441117, -0.08743903913058844];
  const initialCameraPosition = [0, -0.78, 0.16];
  const initialCameraLookAt = [0, 0, 0];

  function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateProgress(percentComplete, label, stage, floor = 0, span = 100) {
    const numericPercent = Number.isFinite(percentComplete)
      ? percentComplete
      : Number.parseFloat(label) || 0;
    const nextPercent = floor + (clampNumber(numericPercent, 0, 100) * span / 100);
    const percent = Math.max(displayedLoadProgress, clampNumber(nextPercent, 0, 100));
    displayedLoadProgress = percent;
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
    if (status) {
      status.textContent = `${stage} ${Math.round(percent)}%`;
    }
  }

  function buildSplatUrl(baseUrl, attempt) {
    const url = new URL(baseUrl, window.location.href);
    url.searchParams.set("v", splatAssetVersion);
    if (attempt > 1) {
      url.searchParams.set("retry", String(Date.now()));
    }
    return url.href;
  }

  function withTimeout(promiseLike, timeoutMs) {
    let timeoutId = null;
    const promise = promiseLike && promiseLike.promise
      ? promiseLike.promise
      : Promise.resolve(promiseLike);
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = window.setTimeout(() => {
        if (promiseLike && typeof promiseLike.abort === "function") {
          promiseLike.abort("3DGS loading timed out.");
        }
        const error = new Error("3DGS loading timed out.");
        error.name = "TimeoutError";
        reject(error);
      }, timeoutMs);
    });
    return Promise.race([
      promise.finally(() => {
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }
      }),
      timeoutPromise
    ]);
  }

  async function disposeViewer(viewer) {
    if (!viewer || typeof viewer.dispose !== "function") return;
    try {
      await viewer.dispose();
    } catch (error) {
      console.warn("3DGS viewer cleanup failed", error);
    }
  }

  function installStableThesisControls(viewer, THREE) {
    const camera = viewer.camera;
    if (!root || !camera) return;

    const builtInControls = viewer.controls || viewer.orbitControls || null;
    if (builtInControls) {
      builtInControls.enabled = false;
    }

    root.tabIndex = 0;
    camera.near = 0.00005;
    camera.far = 100;
    camera.up.set(0, 0, 1);
    camera.updateProjectionMatrix();

    const target = new THREE.Vector3(...initialCameraLookAt);
    const offset = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3();
    const delta = new THREE.Vector3();
    const orbitRotation = new THREE.Quaternion();
    const pitchRotation = new THREE.Quaternion();
    const yawRotation = new THREE.Quaternion();
    const state = {
      pointerId: null,
      mode: null,
      lastX: 0,
      lastY: 0,
      activePointers: new Map(),
      pinchDistance: 0,
      pinchCameraDistance: 0
    };

    function pointerPoint(event) {
      return { x: event.clientX, y: event.clientY };
    }

    function rememberPointer(event) {
      state.activePointers.set(event.pointerId, pointerPoint(event));
    }

    function touchDistance() {
      const points = Array.from(state.activePointers.values());
      if (points.length < 2) return 0;
      return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }

    function releasePointer(event) {
      if (root.hasPointerCapture && root.hasPointerCapture(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
    }

    function orbit(dx, dy) {
      offset.copy(camera.position).sub(target);
      right.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
      up.copy(camera.up).normalize();
      yawRotation.setFromAxisAngle(up, -dx * 0.006);
      pitchRotation.setFromAxisAngle(right, -dy * 0.006);
      orbitRotation.copy(yawRotation).multiply(pitchRotation);
      offset.applyQuaternion(orbitRotation);
      camera.up.applyQuaternion(orbitRotation).normalize();
      camera.position.copy(target).add(offset);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
    }

    function pan(dx, dy) {
      const distance = Math.max(0.04, camera.position.distanceTo(target));
      const scale = distance * 0.0014;
      right.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
      up.copy(camera.up).normalize();
      delta.copy(right).multiplyScalar(-dx * scale).add(up.multiplyScalar(dy * scale));
      camera.position.add(delta);
      target.add(delta);
      camera.updateProjectionMatrix();
    }

    function setCameraDistance(distance) {
      offset.copy(camera.position).sub(target);
      if (offset.lengthSq() === 0) {
        offset.set(0, -1, 0);
      }
      const nextDistance = clampNumber(distance, 0.018, 4);
      offset.setLength(nextDistance);
      camera.position.copy(target).add(offset);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
    }

    function zoom(deltaY) {
      offset.copy(camera.position).sub(target);
      const distance = Math.max(0.01, offset.length());
      setCameraDistance(distance * Math.exp(deltaY * 0.0012));
    }

    root.addEventListener("contextmenu", (event) => event.preventDefault());

    root.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") {
        event.preventDefault();
        event.stopPropagation();
        root.focus({ preventScroll: true });
        root.setPointerCapture(event.pointerId);
        rememberPointer(event);

        if (state.activePointers.size >= 2) {
          state.pointerId = null;
          state.mode = "pinch";
          state.pinchDistance = touchDistance();
          state.pinchCameraDistance = camera.position.distanceTo(target);
          root.classList.add("is-orbiting");
          return;
        }

        state.pointerId = event.pointerId;
        state.mode = "orbit";
        state.lastX = event.clientX;
        state.lastY = event.clientY;
        root.classList.add("is-orbiting");
        return;
      }

      if (event.button !== 0 && event.button !== 2) return;
      event.preventDefault();
      event.stopPropagation();
      root.focus({ preventScroll: true });
      root.setPointerCapture(event.pointerId);
      state.pointerId = event.pointerId;
      state.mode = event.button === 2 ? "pan" : "orbit";
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      root.classList.toggle("is-orbiting", state.mode === "orbit");
    });

    root.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch" && state.activePointers.has(event.pointerId)) {
        event.preventDefault();
        event.stopPropagation();
        const previous = state.activePointers.get(event.pointerId) || pointerPoint(event);
        const current = pointerPoint(event);
        state.activePointers.set(event.pointerId, current);

        if (state.activePointers.size >= 2) {
          const currentDistance = touchDistance();
          if (!state.pinchDistance || !state.pinchCameraDistance) {
            state.pinchDistance = currentDistance;
            state.pinchCameraDistance = camera.position.distanceTo(target);
          }
          if (currentDistance > 0) {
            setCameraDistance(state.pinchCameraDistance * (state.pinchDistance / currentDistance));
          }
          return;
        }

        if (state.pointerId === event.pointerId && state.mode === "orbit") {
          orbit(current.x - previous.x, current.y - previous.y);
        }
        return;
      }

      if (state.pointerId !== event.pointerId || !state.mode) return;
      event.preventDefault();
      event.stopPropagation();
      const dx = Number.isFinite(event.movementX) && event.movementX !== 0 ? event.movementX : event.clientX - state.lastX;
      const dy = Number.isFinite(event.movementY) && event.movementY !== 0 ? event.movementY : event.clientY - state.lastY;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      if (state.mode === "pan") {
        pan(dx, dy);
      } else {
        orbit(dx, dy);
      }
    });

    function endPointer(event) {
      if (event.pointerType === "touch" && state.activePointers.has(event.pointerId)) {
        event.preventDefault();
        event.stopPropagation();
        state.activePointers.delete(event.pointerId);
        state.pinchDistance = 0;
        state.pinchCameraDistance = 0;
        releasePointer(event);

        if (state.activePointers.size === 1) {
          const remaining = Array.from(state.activePointers.entries())[0];
          state.pointerId = remaining[0];
          state.mode = "orbit";
          state.lastX = remaining[1].x;
          state.lastY = remaining[1].y;
          root.classList.add("is-orbiting");
          return;
        }

        state.pointerId = null;
        state.mode = null;
        root.classList.remove("is-orbiting");
        return;
      }

      if (state.pointerId !== event.pointerId) return;
      releasePointer(event);
      state.pointerId = null;
      state.mode = null;
      root.classList.remove("is-orbiting");
    }

    root.addEventListener("pointerup", endPointer);
    root.addEventListener("pointercancel", endPointer);
    root.addEventListener("wheel", (event) => {
      event.preventDefault();
      event.stopPropagation();
      zoom(event.deltaY);
    }, { passive: false });
  }

  async function startThesisViewer() {
    if (!root || hasStarted) return;
    hasStarted = true;
    const attempt = ++loadAttempt;
    root.classList.remove("is-error");
    root.classList.add("is-loading");
    if (progressBar) {
      progressBar.style.width = "0%";
    }
    displayedLoadProgress = 0;
    if (loadButton) {
      loadButton.disabled = true;
    }
    if (status) {
      status.textContent = "Loading 3DGS scene...";
    }

    let viewer = null;

    try {
      const [GaussianSplats3D, THREE] = await Promise.all([
        import("https://cdn.jsdelivr.net/npm/@mkkellogg/gaussian-splats-3d@0.4.7/build/gaussian-splats-3d.module.js"),
        import("three")
      ]);

      const loaderStatus = { Downloading: 0, Processing: 1, Done: 2 };
      viewer = new GaussianSplats3D.Viewer({
        rootElement: root,
        cameraUp: [0, 0, 1],
        initialCameraPosition,
        initialCameraLookAt,
        sharedMemoryForWorkers: false,
        gpuAcceleratedSort: false,
        integerBasedSort: false,
        halfPrecisionCovariancesOnGPU: true,
        dynamicScene: false,
        renderMode: GaussianSplats3D.RenderMode.Always,
        sceneRevealMode: GaussianSplats3D.SceneRevealMode.Gradual,
        sphericalHarmonicsDegree: 0,
        antialiased: false,
        logLevel: GaussianSplats3D.LogLevel.None
      });
      activeViewer = viewer;

      await withTimeout(viewer.addSplatScene(buildSplatUrl(root.getAttribute("data-splat-url"), attempt), {
        splatAlphaRemovalThreshold: 1,
        format: GaussianSplats3D.SceneFormat.Splat,
        showLoadingUI: false,
        progressiveLoad: true,
        headers: {
          "Cache-Control": "no-cache"
        },
        onProgress(percentComplete, percentCompleteLabel, currentStatus) {
          if (currentStatus === loaderStatus.Processing) {
            updateProgress(percentComplete, percentCompleteLabel, "Processing cap scene", 85, 15);
            return;
          }
          if (currentStatus === loaderStatus.Done) {
            updateProgress(100, "100%", "Finishing cap scene");
            return;
          }
          updateProgress(percentComplete, percentCompleteLabel, "Downloading cap scene", 0, 85);
        },
        position: sceneCenterOffset,
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1]
      }), loadTimeoutMs);

      viewer.start();
      installStableThesisControls(viewer, THREE);
      root.classList.remove("is-loading");
      root.classList.add("is-loaded");
      if (progressBar) {
        progressBar.style.width = "100%";
      }
      if (prompt) {
        prompt.remove();
      }
      if (status) {
        status.textContent = loadedSplatLabel;
      }
      window.thesisSplatViewer = viewer;
    } catch (error) {
      hasStarted = false;
      if (activeViewer === viewer) {
        activeViewer = null;
      }
      await disposeViewer(viewer);
      root.classList.remove("is-loading");
      root.classList.add("is-error");
      if (progressBar) {
        progressBar.style.width = "0%";
      }
      displayedLoadProgress = 0;
      if (loadButton) {
        loadButton.disabled = false;
      }
      if (status) {
        status.textContent = error && error.name === "TimeoutError"
          ? "Loading took too long. Please try again; the next attempt will bypass the cached SPLAT."
          : "3DGS scene could not be loaded. Please refresh or download the SPLAT file.";
      }
      console.error(error);
    }
  }

  if (status) {
    status.textContent = "3DGS viewer is not loaded yet.";
  }

  if (loadButton) {
    loadButton.addEventListener("click", () => {
      startThesisViewer().catch((error) => console.error(error));
    });
  }

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    disposeViewer(activeViewer);
    activeViewer = null;
  });
</script>
