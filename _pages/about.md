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
  <header class="academic-home__header glass-card">
    <div>
      <h1 class="academic-home__title"><span data-lang-only="en">{{ site.author.name }}</span><span data-lang-only="zh">赵锂想</span></h1>
      <p class="academic-home__desc">
        <a href="https://www.xjtlu.edu.cn/en/study/departments/school-of-advanced-technology/computer-science-and-software-engineering">
          <span data-lang-only="en">School of Advanced Technology, Department of Computing,<br><span class="academic-home__nowrap">Xi'an Jiaotong-Liverpool University</span></span>
          <span data-lang-only="zh">西交利物浦大学<br>高级技术学院计算机系</span>
        </a>
      </p>
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
  </header>

  <article class="academic-home__body glass-card">
    <aside class="academic-profile">
      <img class="academic-profile__photo" src="/images/{{ site.author.avatar }}" alt="{{ site.author.name }}">
      <div class="academic-profile__info">
        <!-- <p>VIIS Lab</p>
        <p>Xi'an Jiaotong-Liverpool University</p> -->
        {% if site.author.location %}<p>{{ site.author.location }}</p>{% endif %}
      </div>
    </aside>

    <section class="academic-home__intro">
      <p data-lang-only="en">
        I am Lixiang Zhao. I obtained my Ph.D. from Xi'an Jiaotong-Liverpool University, with
        <a href="https://yulingyun.com/">
          Prof. Lingyun Yu
        </a>
         as my advisor.
      </p>
      <p data-lang-only="en">
        My research focuses on immersive visualization, spatial interaction techniques, high-performance computing and machine learning.
      </p>
      <p data-lang-only="en">
        Feel free to reach out by email if you are interested in collaboration.
      </p>
      <p data-lang-only="zh">
        我是赵锂想，博士毕业于西交利物浦大学，导师为
        <a href="https://yulingyun.com/">俞凌云教授</a>。
      </p>
      <p data-lang-only="zh">
        我的研究关注沉浸式可视化、空间交互技术，高性能计算以及机器学习。
      </p>
      <p data-lang-only="zh">
        如果你对合作感兴趣，欢迎通过邮件联系我。
      </p>
    </section>

    <section class="academic-section academic-panel glass-card">
      <h2 class="academic-heading"><span data-lang-only="en">News</span><span data-lang-only="zh">新闻</span></h2>
      <div class="academic-news">
        <table>
          <tbody>
            <tr>
              <th scope="row">Feb 03, 2026</th>
              <td>
                <span data-lang-only="en">I successfully defended my Ph.D. dissertation <a href="/thesis/">&ldquo;Bridging Immersion Levels in Spatial Data Exploration: Visualization, Interaction, and Computing&rdquo;</a>!</span>
                <span data-lang-only="zh">我顺利通过博士论文答辩，论文题目为 <a href="/thesis/">&ldquo;Bridging Immersion Levels in Spatial Data Exploration: Visualization, Interaction, and Computing&rdquo;</a>！</span>
              </td>
            </tr>
            <tr>
              <th scope="row">Jan 10, 2026</th>
              <td>
                <span data-lang-only="en">Our paper <a href="https://ieeexplore.ieee.org/document/11457550">&ldquo;ScaleFree: Dynamic KDE for Multiscale Point Cloud Exploration in VR&rdquo;</a> is accepted by IEEE VR 2026!</span>
                <span data-lang-only="zh">我们的论文 <a href="https://ieeexplore.ieee.org/document/11457550">&ldquo;ScaleFree: Dynamic KDE for Multiscale Point Cloud Exploration in VR&rdquo;</a> 被 IEEE VR 2026 接收！</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="academic-section academic-panel glass-card">
      <h2 class="academic-heading"><a href="/publications/"><span data-lang-only="en">Selected Publications</span><span data-lang-only="zh">精选论文</span></a></h2>
      {% assign selected_ids = "scalefree,spatialtouch,metacast,l-wim" | split: "," %}
      <ol class="selected-publications">
        {% for selected_id in selected_ids %}
          {% for group in site.data.publications %}
            {% assign pub = group.items | where: "id", selected_id | first %}
            {% if pub %}
              <li id="home-{{ pub.id }}" class="selected-publication">
                <div class="selected-publication__image">
                  <img src="{{ pub.image }}" alt="{{ pub.title }}">
                </div>
                <div class="selected-publication__body">
                  <h3 class="selected-publication__title"><a href="{{ pub.url }}">{{ pub.title }}</a></h3>
                  {% if pub.authors %}<div class="selected-publication__meta">{{ pub.authors }}</div>{% endif %}
                  <div class="selected-publication__meta selected-publication__venue">
                    {% if pub.venue %}<span class="selected-publication__venue-text"><em>{{ pub.venue }}</em></span>{% endif %}
                    {% if pub.ccf or pub.jcr %}
                      <span class="pub-card__badges">
                        {% if pub.ccf %}<span class="pub-badge">{{ pub.ccf }}</span>{% endif %}
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
  </article>
</main>
