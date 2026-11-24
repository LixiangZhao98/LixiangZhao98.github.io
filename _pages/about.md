---
permalink: /
layout: splash
title: "Home"
author_profile: false
redirect_from:
  - /about/
  - /about.html
---

<main class="academic-home">
  <header class="academic-home__hero glass-card">
    <div class="academic-home__hero-copy">
      <p class="academic-home__eyebrow">
        <span data-lang-only="en">Immersive Visualization · Spatial Interaction</span>
        <span data-lang-only="zh">沉浸式可视化 · 空间交互</span>
      </p>
      <h1 class="academic-home__title"><span data-lang-only="en">{{ site.author.name }}</span><span data-lang-only="zh">赵锂想</span></h1>
      <p class="academic-home__lead">
        <span data-lang-only="en">I design and study interactive systems that help people explore spatial data across VR and cross-reality environments.</span>
        <span data-lang-only="zh">我设计并研究交互系统，帮助人们在虚拟现实与跨现实环境中探索空间数据。</span>
      </p>
      <p class="academic-home__affiliation">
        <a href="https://www.xjtlu.edu.cn/en/study/departments/school-of-advanced-technology/computer-science-and-software-engineering">
          <span data-lang-only="en">Ph.D., Xi'an Jiaotong-Liverpool University</span>
          <span data-lang-only="zh">博士，西交利物浦大学</span>
        </a>
      </p>
      <div class="academic-home__summary">
        <p data-lang-only="en">My work spans immersive visualization, spatial interaction techniques, high-performance computing, and machine learning. I completed my Ph.D. under the supervision of <a href="https://yulingyun.com/">Prof. Lingyun Yu</a>.</p>
        <p data-lang-only="zh">我的研究涵盖沉浸式可视化、空间交互技术、高性能计算与机器学习，并在<a href="https://yulingyun.com/">俞凌云教授</a>指导下完成博士学位。</p>
      </div>
      <div class="academic-home__actions">
        <a class="pub-action academic-home__primary-action" href="/publications/">
          <i class="fas fa-book-open" aria-hidden="true"></i>
          <span data-lang-only="en">View Publications</span><span data-lang-only="zh">查看论文</span>
        </a>
        <a class="pub-action" href="/cv/">
          <i class="fas fa-file-alt" aria-hidden="true"></i>
          <span data-lang-only="en">Curriculum Vitae</span><span data-lang-only="zh">个人简历</span>
        </a>
      </div>
      <nav class="academic-home__quick-links" aria-label="Profile links">
        <a class="profile-icon" href="mailto:{{ site.author.email }}" aria-label="Email" title="Email">
          <i class="fas fa-envelope" aria-hidden="true"></i>
        </a>
        {% if site.author.googlescholar %}
          <a class="profile-icon" href="{{ site.author.googlescholar }}" aria-label="Google Scholar" title="Google Scholar">
            <i class="ai ai-google-scholar" aria-hidden="true"></i>
          </a>
        {% endif %}
        {% if site.author.orcid %}
          <a class="profile-icon" href="{{ site.author.orcid }}" aria-label="ORCID" title="ORCID">
            <i class="ai ai-orcid" aria-hidden="true"></i>
          </a>
        {% endif %}
        {% if site.author.github %}
          <a class="profile-icon" href="https://github.com/{{ site.author.github }}" aria-label="GitHub" title="GitHub">
            <i class="fab fa-github" aria-hidden="true"></i>
          </a>
        {% endif %}
      </nav>
    </div>

    <figure class="academic-profile">
      <img class="academic-profile__photo" src="/images/Lixiang_Zhao-900.webp" alt="Portrait of {{ site.author.name }}" width="900" height="632" loading="eager" decoding="async" fetchpriority="high">
      {% if site.author.location %}
        <figcaption class="academic-profile__info">
          <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
          <span data-lang-only="en">{{ site.author.location }}</span><span data-lang-only="zh">中国苏州</span>
        </figcaption>
      {% endif %}
    </figure>
  </header>

    <section class="academic-section academic-panel glass-card">
      <div class="academic-section__heading">
        <h2 class="academic-heading"><span data-lang-only="en">News</span><span data-lang-only="zh">新闻</span></h2>
      </div>
      <div class="academic-news">
        <table>
          <tbody>
            <tr>
              <th scope="row">Feb 03, 2026</th>
              <td>
                <span data-lang-only="en">I successfully defended my Ph.D. thesis <a href="/thesis/">&ldquo;Bridging Immersion Levels in Spatial Data Exploration: Visualization, Interaction, and Computing&rdquo;</a>!</span>
                <span data-lang-only="zh">我顺利通过博士论文答辩，论文题目为 <a href="/thesis/">&ldquo;Bridging Immersion Levels in Spatial Data Exploration: Visualization, Interaction, and Computing&rdquo;</a>！</span>
              </td>
            </tr>
            <tr>
              <th scope="row">Jan 10, 2026</th>
              <td>
                <span data-lang-only="en">Our paper <a href="/publications/scalefree/">&ldquo;ScaleFree: Dynamic KDE for Multiscale Point Cloud Exploration in VR&rdquo;</a> is accepted by IEEE VR 2026!</span>
                <span data-lang-only="zh">我们的论文 <a href="/publications/scalefree/">&ldquo;ScaleFree: Dynamic KDE for Multiscale Point Cloud Exploration in VR&rdquo;</a> 被 IEEE VR 2026 接收！</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="academic-section academic-panel glass-card">
      <div class="academic-section__heading">
        <h2 class="academic-heading"><span data-lang-only="en">Selected Publications</span><span data-lang-only="zh">精选论文</span></h2>
        <a class="academic-section__link" href="/publications/">
          <span data-lang-only="en">All publications</span><span data-lang-only="zh">全部论文</span>
          <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
      {% assign selected_ids = "scalefree,spatialtouch,metacast,l-wim" | split: "," %}
      <ol class="selected-publications">
        {% for selected_id in selected_ids %}
          {% for group in site.data.publications %}
            {% assign pub = group.items | where: "id", selected_id | first %}
            {% if pub %}
              <li id="home-{{ pub.id }}" class="selected-publication">
                <div class="selected-publication__image">
                  {% assign home_image = pub.home_image | default: pub.image %}
                  <a href="{{ pub.url }}" aria-label="View {{ pub.title }}">
                    <img src="{{ home_image }}" alt="{{ pub.title }}" loading="lazy" decoding="async"{% if pub.home_image_width and pub.home_image_height %} width="{{ pub.home_image_width }}" height="{{ pub.home_image_height }}"{% endif %}>
                  </a>
                </div>
                <div class="selected-publication__body">
                  <h3 class="selected-publication__title"><a href="{{ pub.url }}">{{ pub.title }}</a></h3>
                  {% if pub.authors %}<div class="selected-publication__meta">{{ pub.authors }}</div>{% endif %}
                  <div class="selected-publication__meta selected-publication__venue">
                    {% assign venue_link = pub.venue_url %}
                    {% if pub.venue %}
                      <span class="selected-publication__venue-text">
                        <em>
                          {% if venue_link and venue_link != "" %}
                            <a class="publication-venue-link" href="{{ venue_link | escape }}">{{ pub.venue }}</a>
                          {% else %}
                            {{ pub.venue }}
                          {% endif %}
                        </em>
                      </span>
                    {% endif %}
                    {% if pub.ccf or pub.jcr %}
                      <span class="pub-card__badges">
                        {% if pub.ccf %}<span class="pub-badge pub-badge--ccf">{{ pub.ccf }}</span>{% endif %}
                        {% if pub.jcr %}<span class="pub-badge pub-badge--jcr">{{ pub.jcr }}</span>{% endif %}
                      </span>
                    {% endif %}
                  </div>
                  {% if pub.links and pub.links.size > 0 %}
                    <div class="selected-publication__links">
                      {% for link in pub.links %}
                        <a class="pub-chip" href="{{ link.url }}">{{ link.label }}</a>
                      {% endfor %}
                    </div>
                  {% endif %}
                </div>
              </li>
            {% endif %}
          {% endfor %}
        {% endfor %}
      </ol>
    </section>
</main>
