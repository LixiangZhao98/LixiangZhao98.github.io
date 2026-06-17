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
        Ph.D. student in Computer Science and Software Engineering,
        Xi'an Jiaotong-Liverpool University.
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
        <p>VIIS Lab</p>
        <p>Xi'an Jiaotong-Liverpool University</p>
        {% if site.author.location %}<p>{{ site.author.location }}</p>{% endif %}
      </div>
    </aside>

    <section class="academic-home__intro">
      <p>
        I am a Ph.D. student working on Scientific Visualization (SciVis) and
        Human-Computer Interaction (HCI), with a focus on immersive
        visualization, spatial interaction, and cross-reality data exploration.
      </p>
      <p>
        My research explores how people perceive, select, manipulate, and make
        sense of spatial data across virtual, augmented, and physical
        environments.
      </p>
      <p>
        Feel free to reach out by email if you are interested in collaboration.
      </p>
    </section>

    <section class="academic-section">
      <h2 class="academic-heading">news</h2>
      <div class="academic-news">
        <table>
          <tbody>
            <tr>
              <th scope="row">2026</th>
              <td><em>ScaleFree</em> appeared at <em>IEEE Conference on Virtual Reality and 3D User Interfaces</em>.</td>
            </tr>
            <tr>
              <th scope="row">2024</th>
              <td><em>SpatialTouch</em> was published in <em>IEEE Transactions on Visualization and Computer Graphics</em>.</td>
            </tr>
            <tr>
              <th scope="row">2023</th>
              <td><em>MeTACAST</em> was published in <em>IEEE Transactions on Visualization and Computer Graphics</em>.</td>
            </tr>
            <tr>
              <th scope="row">2022</th>
              <td><em>L-WiM</em> appeared at <em>IEEE International Symposium on Mixed and Augmented Reality Adjunct</em>.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="academic-section">
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
                  {% if pub.venue %}<div class="selected-publication__meta"><em>{{ pub.venue }}</em></div>{% endif %}
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
