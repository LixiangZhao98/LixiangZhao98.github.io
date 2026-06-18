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
      <h1 class="academic-home__title">{{ site.author.name }}</h1>
      <p class="academic-home__desc">
        <a href="https://www.xjtlu.edu.cn/en/study/departments/school-of-advanced-technology/computer-science-and-software-engineering">
          School of Advanced Technology, Department of Computing,
          Xi'an Jiaotong-Liverpool University
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
      <p>
        I am Lixiang Zhao. I obtained my Ph.D. from the University of Xi'an Jiaotong-Liverpool University, with
        <a href="https://yulingyun.com/">
          Prof. Lingyun Yu
        </a>
         as my advisor.
      </p>
      <p>
        My research focuses on immersive visualization, spatial interaction
        techniques, high-performance computing and machine learning.
      </p>
      <p>
        Feel free to reach out by email if you are interested in collaboration. I am currently seeking for postdoctoral research position.
      </p>
      <p>
        By the way, I am currently seeking for postdoctoral research position.
      </p>
    </section>

    <section class="academic-section academic-panel glass-card">
      <h2 class="academic-heading">news</h2>
      <div class="academic-news">
        <table>
          <tbody>
            <tr>
              <th scope="row">Feb 03, 2026</th>
              <td>I successfully defended my Ph.D. dissertation &ldquo;Bridging Immersion Levels in Spatial Data Exploration: Visualization, Interaction, and Computing&rdquo;!</td>
            </tr>
            <tr>
              <th scope="row">Jan 10, 2026</th>
              <td>Our paper <a href="https://ieeexplore.ieee.org/document/11457550">&ldquo;ScaleFree: Dynamic KDE for Multiscale Point Cloud Exploration in VR&rdquo;</a> is accepted by IEEE VR 2026!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="academic-section academic-panel glass-card">
      <h2 class="academic-heading"><a href="/publications/">selected publications</a></h2>
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
                    {% if pub.venue %}<em>{{ pub.venue }}</em>{% endif %}
                    {% if pub.ccf %}<span class="pub-badge">{{ pub.ccf }}</span>{% endif %}
                    {% if pub.jcr %}<span class="pub-badge pub-badge--jcr">{{ pub.jcr }}</span>{% endif %}
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
