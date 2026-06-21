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
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/Figures/MeTACAST.png" alt="MeTACAST teaser" loading="lazy" decoding="async"></span>
        <span>MeTACAST</span>
      </a>
      <a class="thesis-paper-tile" href="/publications/scalefree/">
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/Figures/ScaleFree.png" alt="ScaleFree teaser" loading="lazy" decoding="async"></span>
        <span>ScaleFree</span>
      </a>
      <a class="thesis-paper-tile" href="/publications/l-wim/">
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/Figures/L_Wim.png" alt="L-WiM teaser" loading="lazy" decoding="async"></span>
        <span>L-WiM</span>
      </a>
      <a class="thesis-paper-tile" href="/publications/spatialtouch/">
        <span class="thesis-paper-tile__media"><img src="/assets/Publications/Figures/spatialtouch.png" alt="SpatialTouch teaser" loading="lazy" decoding="async"></span>
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
      <a class="pub-chip" href="/assets/Publications/thesis/phd_hat_table.splat" download="phd_hat_table.splat">
        <i class="fas fa-download" aria-hidden="true"></i>
        <span data-lang-only="en">Download SPLAT</span>
        <span data-lang-only="zh">下载 SPLAT</span>
      </a>
    </div>
    <p class="thesis-gaussian-note thesis-gaussian-thanks">
      <span data-lang-only="en">Many thanks to my lab partners and the cap makers: <strong>Wanfang Xu</strong>, <strong>Fuqi Xie</strong>, <strong>Shuqi He</strong>, <strong>Jifan Yang</strong>, and <strong>Shuzi Zou</strong>, and to my advisor <strong>Lingyun Yu</strong>.</span>
      <span data-lang-only="zh">特别感谢实验室伙伴和博士帽制作者：<strong>徐万芳</strong>、<strong>谢馥琪</strong>、<strong>何舒淇</strong>、<strong>杨济帆</strong>、<strong>邹树滋</strong>，以及导师 <strong>俞凌云</strong>。</span>
    </p>
    <div id="thesis-splat-viewer" class="splat-viewer thesis-inline-splat" data-splat-url="/assets/Publications/thesis/phd_hat_table.splat">
      <div class="splat-viewer__prompt">
        <img src="/assets/Publications/thesis/phd_hat_poster.jpg" alt="Ph.D. graduation cap 3DGS preview" loading="lazy" decoding="async">
        <div class="splat-viewer__load splat-viewer__load--passive">
          <i class="fas fa-cube" aria-hidden="true"></i>
          <span data-lang-only="en">Loading 3DGS Viewer</span>
          <span data-lang-only="zh">正在加载 3DGS Viewer</span>
        </div>
      </div>
      <div class="splat-viewer__status">
        <span data-lang-only="en">Preparing 3DGS scene...</span>
        <span data-lang-only="zh">正在准备 3DGS 场景...</span>
      </div>
    </div>
    <p class="splat-shell__footer thesis-inline-splat__help">
      <span data-lang-only="en">Left drag orbit · right drag pan · wheel zoom · P toggles point mode · I toggles info</span>
      <span data-lang-only="zh">左键拖拽旋转 · 右键拖拽平移 · 滚轮缩放 · P 切换点模式 · I 显示信息</span>
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
  let hasStarted = false;
  const sceneCenterOffset = [0.02332621530941987, 0.15569970817993717, -0.08836142132126232];

  async function startThesisViewer() {
    if (!root || hasStarted) return;
    hasStarted = true;
    root.classList.remove("is-error");
    root.classList.add("is-loading");
    if (status) {
      status.textContent = "Loading 3DGS scene...";
    }

    const GaussianSplats3D = await import("https://cdn.jsdelivr.net/npm/@mkkellogg/gaussian-splats-3d@0.4.7/build/gaussian-splats-3d.module.js");

    const viewer = new GaussianSplats3D.Viewer({
      rootElement: root,
      cameraUp: [0, 0, 1],
      initialCameraPosition: [0, -0.78, 0.16],
      initialCameraLookAt: [0, 0, 0],
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

    await viewer.addSplatScene(root.getAttribute("data-splat-url"), {
      splatAlphaRemovalThreshold: 1,
      showLoadingUI: false,
      progressiveLoad: true,
      position: sceneCenterOffset,
      rotation: [0, 0, 0, 1],
      scale: [1, 1, 1]
    });

    viewer.start();
    if (viewer.camera) {
      viewer.camera.near = 0.00005;
      viewer.camera.far = 100;
      viewer.camera.updateProjectionMatrix();
    }
    root.classList.remove("is-loading");
    root.classList.add("is-loaded");
    if (prompt) {
      prompt.remove();
    }
    if (status) {
      status.textContent = "1,262,535 focused table splats loaded";
    }
    window.thesisSplatViewer = viewer;
  }

  startThesisViewer().catch((error) => {
    hasStarted = false;
    if (root) {
      root.classList.remove("is-loading");
      root.classList.add("is-error");
    }
    if (status) {
      status.textContent = "3DGS scene could not be loaded. Please refresh or download the SPLAT file.";
    }
    console.error(error);
  });
</script>
