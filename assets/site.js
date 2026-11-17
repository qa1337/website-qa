/* QA1337 Guidelines: shared header, sidebar, heading links, theme toggle.
   To add a page: create the .html file (link to it without ".html"), then add it to NAV below. */
(function () {
  var tag = document.querySelector("script[data-root]");
  var ROOT = tag ? tag.getAttribute("data-root") : "";
  var PAGE = document.body.getAttribute("data-page");
  var SECTION = document.body.getAttribute("data-section");
  var root = document.documentElement;

  /* Sign-up form posts here (your Google Apps Script web app that writes to the spreadsheet) */
  var SIGNUP_URL =
    "https://script.google.com/macros/s/AKfycbxG6yrlaM83XOP_CPaMASzCFdasH4rPQZV9dqGBUKD71JKrLMPshBoks-3P3AGCFPP-/exec";

  /* Top menu (centered header links) */
  var LINKS = [
    ["overview", "Overview", "./"],
    ["ios", "iOS", "ios/"],
    ["android", "Android", "android/"],
    ["web", "Web", "web/"],
    ["fundamentals", "Fundamentals", "fundamentals/"],
    ["resources", "Resources", "resources/checklists"],
  ];

  /* Sidebar: groups > items. An item with "items" is a collapsible category with its own landing page. */
  var NAV = [
    {
      t: "Overview",
      items: [{ id: "index", title: "Getting started", path: "./", icon: "compass" }],
    },
    {
      t: "Platforms",
      items: [
        {
          id: "ios",
          title: "iOS",
          path: "ios/",
          icon: "phone",
          items: [
            { id: "ios-crash-logs", title: "Crash &amp; error logs", path: "ios/crash-logs" },
            { id: "ios-device-logs", title: "Device logs", path: "ios/device-logs" },
            { id: "ios-simulators", title: "Simulators", path: "ios/simulators" },
          ],
        },
        {
          id: "android",
          title: "Android",
          path: "android/",
          icon: "android",
          items: [
            {
              id: "android-crash-logs",
              title: "Crash &amp; error logs",
              path: "android/crash-logs",
            },
            { id: "android-adb", title: "Platform tools &amp; ADB", path: "android/adb" },
            { id: "android-emulators", title: "Emulators", path: "android/emulators" },
            {
              id: "android-fragmentation",
              title: "Device fragmentation",
              path: "android/device-fragmentation",
            },
          ],
        },
        {
          id: "web",
          title: "Web",
          path: "web/",
          icon: "globe",
          items: [
            { id: "web-crash-logs", title: "Exception &amp; error logs", path: "web/crash-logs" },
            { id: "web-console-logs", title: "Console logs", path: "web/console-logs" },
            { id: "web-network", title: "Network debugging", path: "web/network-debugging" },
            { id: "web-storage", title: "Storage and cookies", path: "web/storage-and-cookies" },
          ],
        },
      ],
    },
    {
      t: "Fundamentals",
      items: [
        {
          id: "fundamentals",
          title: "QA fundamentals",
          path: "fundamentals/",
          icon: "book",
          items: [
            {
              id: "fund-methods",
              title: "Black, white &amp; grey box",
              path: "fundamentals/test-methods",
            },
            { id: "fund-levels", title: "Test levels", path: "fundamentals/test-levels" },
            {
              id: "fund-types",
              title: "Functional &amp; non-functional",
              path: "fundamentals/test-types",
            },
            {
              id: "fund-smoke",
              title: "Smoke, sanity &amp; regression",
              path: "fundamentals/smoke-sanity-regression",
            },
            {
              id: "fund-positive-negative",
              title: "Positive &amp; negative",
              path: "fundamentals/positive-negative",
            },
            {
              id: "fund-design",
              title: "Test design techniques",
              path: "fundamentals/test-design",
            },
          ],
        },
      ],
    },
    {
      t: "Resources",
      items: [
        { id: "checklists", title: "Checklists", path: "resources/checklists", icon: "check" },
        { id: "bug-reports", title: "Bug reports", path: "resources/bug-reports", icon: "bug" },
        {
          id: "screen-capture",
          title: "Screenshots &amp; recording",
          path: "resources/screen-capture",
          icon: "camera",
        },
      ],
    },
  ];

  var ICON = {
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    android:
      '<rect x="6" y="9" width="12" height="10" rx="2"/><path d="M8 4l1.5 3M16 4l-1.5 3M9.5 13h.01M14.5 13h.01"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 10 3 2-3 2M12 15h4"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    database:
      '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
    check: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    bug: '<rect x="8" y="8" width="8" height="12" rx="4"/><path d="M12 8V5M8 12H4M16 12h4M9 8 7 5M15 8l2-3M8 17l-3 1M16 17l3 1"/>',
    book: '<path d="M5 4h13v16H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11M9 8h6"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    grid:
      '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    refresh:
      '<path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3"/><path d="M5 3v5h5M19 21v-5h-5"/>',
    plusminus: '<path d="M7 5v6M4 8h6M14 16h6M19 5 5 19"/>',
    target:
      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    camera:
      '<path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
  };
  function svg(n, s, w) {
    return (
      '<svg width="' +
      s +
      '" height="' +
      s +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
      (w || 1.8) +
      '" stroke-linecap="round" stroke-linejoin="round">' +
      ICON[n] +
      "</svg>"
    );
  }
  function get(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  function put(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  /* Theme */
  var th = get("qa-theme");
  if (th) root.setAttribute("data-theme", th);

  /* Header */
  var themeBtn =
    '<button class="ib theme-btn" aria-label="Switch theme">' + svg("moon", 18, 2) + "</button>";
  document.querySelector(".gbar").innerHTML =
    '<div class="inner"><a class="gbrand" href="https://qa1337.com">QA1337</a><div class="sp"></div>' +
    themeBtn +
    "</div>";
  var lk = "";
  LINKS.forEach(function (l) {
    lk +=
      '<a href="' +
      ROOT +
      l[2] +
      '"' +
      (l[0] === SECTION ? ' aria-current="page"' : "") +
      ">" +
      l[1] +
      "</a>";
  });
  document.querySelector(".lbar").innerHTML =
    '<div class="inner"><button class="ib mobile-only" id="menu" aria-label="Toggle navigation">' +
    svg("menu", 20, 2) +
    '</button><a class="ltitle" href="' +
    ROOT +
    './">Guidelines</a><div class="sp"></div><div class="links">' +
    lk +
    '</div><button class="btn" id="signup-open" type="button">Sign up</button>' +
    themeBtn.replace('class="ib theme-btn"', 'class="ib theme-btn mobile-only"') +
    "</div>";

  /* Sidebar */
  var nav = document.getElementById("nav");
  nav.innerHTML =
    '<label class="search">' +
    svg("filter", 16, 2) +
    '<input id="q" type="search" placeholder="Filter" aria-label="Filter pages"></label><div id="list"></div>';
  var listEl = document.getElementById("list"),
    qEl = document.getElementById("q");
  var st = {};
  try {
    st = JSON.parse(get("qa-nav") || "{}");
  } catch (e) {}
  function has(i, id) {
    return (
      i.id === id ||
      (i.items || []).some(function (c) {
        return c.id === id;
      })
    );
  }
  NAV.forEach(function (g) {
    g.items.forEach(function (i) {
      if (has(i, PAGE)) {
        st["g:" + g.t] = true;
        if (i.items) st["c:" + i.id] = true;
      }
    });
  });
  var CH =
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  function isOpen(k) {
    return k in st ? st[k] : k.charAt(0) === "g";
  }
  function on(i) {
    return i.id === PAGE ? " on" : "";
  }
  function cur(i) {
    return i.id === PAGE ? ' aria-current="page"' : "";
  }
  function build(f) {
    var h = "";
    NAV.forEach(function (g) {
      var out = "";
      g.items.forEach(function (i) {
        var own = !f || i.title.toLowerCase().indexOf(f) > -1;
        if (!i.items) {
          if (own)
            out +=
              '<a class="itm' +
              on(i) +
              '"' +
              cur(i) +
              ' href="' +
              ROOT +
              i.path +
              '">' +
              svg(i.icon, 18) +
              i.title +
              "</a>";
          return;
        }
        var kids = own
          ? i.items
          : i.items.filter(function (c) {
              return c.title.toLowerCase().indexOf(f) > -1;
            });
        if (!kids.length) return;
        var op = f ? true : isOpen("c:" + i.id);
        out +=
          '<div class="cat"><button class="chev" aria-expanded="' +
          op +
          '" aria-label="Toggle ' +
          i.title +
          '" data-k="c:' +
          i.id +
          '">' +
          CH +
          '</button><a class="catlink' +
          on(i) +
          '"' +
          cur(i) +
          ' href="' +
          ROOT +
          i.path +
          '">' +
          svg(i.icon, 18) +
          i.title +
          "</a></div>";
        if (op)
          kids.forEach(function (c) {
            out +=
              '<a class="leaf' +
              on(c) +
              '"' +
              cur(c) +
              ' href="' +
              ROOT +
              c.path +
              '">' +
              c.title +
              "</a>";
          });
      });
      if (!out) return;
      var go = f ? true : isOpen("g:" + g.t);
      h +=
        '<button class="g1" aria-expanded="' +
        go +
        '" data-k="g:' +
        g.t +
        '">' +
        CH +
        g.t +
        "</button>" +
        (go ? out : "");
    });
    listEl.innerHTML = h || '<p class="none">No matches</p>';
  }
  build("");
  try {
    nav.scrollTop = +sessionStorage.getItem("qa-navscroll") || 0;
  } catch (e) {}
  listEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-k]");
    if (b) {
      var k = b.getAttribute("data-k");
      st[k] = !isOpen(k);
      put("qa-nav", JSON.stringify(st));
      build(qEl.value.trim().toLowerCase());
      return;
    }
    if (e.target.closest("a")) {
      try {
        sessionStorage.setItem("qa-navscroll", nav.scrollTop);
      } catch (x) {}
    }
  });
  qEl.addEventListener("input", function () {
    build(qEl.value.trim().toLowerCase());
  });
  document.getElementById("menu").addEventListener("click", function () {
    nav.classList.toggle("open");
  });
  document.querySelectorAll(".theme-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var dark = matchMedia("(prefers-color-scheme: dark)").matches;
      var c = root.getAttribute("data-theme") || (dark ? "dark" : "light");
      var n = c === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", n);
      put("qa-theme", n);
    });
  });

  /* Footer */
  var foot = document.createElement("footer");
  foot.className = "foot";
  foot.innerHTML = '<div class="inner">Copyright © ' + new Date().getFullYear() + " QA1337. All rights reserved.</div>";
  document.body.appendChild(foot);

  /* Tile icons */
  document.querySelectorAll("[data-i]").forEach(function (e) {
    e.innerHTML = svg(e.getAttribute("data-i"), 28);
  });

  /* Heading links: every h1-h3 in <main> gets an id and a copy-link button */
  var toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  document.body.appendChild(toastEl);
  var tt;
  function toast(m) {
    toastEl.textContent = m;
    toastEl.classList.add("on");
    clearTimeout(tt);
    tt = setTimeout(function () {
      toastEl.classList.remove("on");
    }, 1600);
  }
  function slug(s) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  document.querySelectorAll("main h1, main h2, main h3").forEach(function (h) {
    var id = h.id;
    if (!id) {
      var b = slug(h.textContent) || "section",
        n = b,
        k = 2;
      while (document.getElementById(n)) n = b + "-" + k++;
      id = n;
      h.id = id;
    }
    var a = document.createElement("a");
    a.className = "anc";
    a.href = "#" + id;
    a.setAttribute("aria-label", "Link to this section");
    a.innerHTML = svg("link", 16, 2);
    a.addEventListener("click", function () {
      var u = location.href.split("#")[0] + "#" + id;
      try {
        navigator.clipboard.writeText(u).then(
          function () {
            toast("Link copied");
          },
          function () {},
        );
      } catch (e) {}
    });
    h.appendChild(a);
  });
  if (location.hash) {
    var el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (el) el.scrollIntoView();
  }

  /* Sign-up popup */
  var dlg = document.createElement("dialog");
  dlg.className = "modal";
  dlg.id = "signup";
  dlg.setAttribute("aria-labelledby", "su-t");
  dlg.innerHTML =
    '<button class="ib x" type="button" aria-label="Close" data-close>' +
    svg("x", 18, 2) +
    "</button>" +
    '<div id="su-main"><h2 id="su-t">Stay connected</h2><p>Get updates and resources straight to your inbox.</p>' +
    '<form id="su-form"><input type="email" name="email" id="su-email" placeholder="Your email address" autocomplete="email" required><button class="btn" type="submit">Sign up</button></form></div>' +
    '<div id="su-done" hidden><h2>Thank you!</h2><p>You’re on the list. Watch your inbox for updates.</p><button class="btn" type="button" data-close>Close</button></div>';
  document.body.appendChild(dlg);
  var suForm = document.getElementById("su-form"),
    suMain = document.getElementById("su-main"),
    suDone = document.getElementById("su-done");
  document.getElementById("signup-open").addEventListener("click", function () {
    suForm.reset();
    suMain.hidden = false;
    suDone.hidden = true;
    var b = suForm.querySelector("button");
    b.disabled = false;
    b.textContent = "Sign up";
    dlg.showModal();
    document.getElementById("su-email").focus();
  });
  dlg.addEventListener("click", function (e) {
    var r = dlg.getBoundingClientRect();
    if (
      e.target.closest("[data-close]") ||
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dlg.close();
  });
  suForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var b = suForm.querySelector("button");
    b.disabled = true;
    b.textContent = "Submitting…";
    var params = new URLSearchParams();
    params.append("email", suForm.email.value);
    var ok = false;
    try {
      ok = navigator.sendBeacon(SIGNUP_URL, params);
    } catch (x) {}
    if (!ok) {
      try {
        fetch(SIGNUP_URL, { method: "POST", mode: "no-cors", body: params });
      } catch (x) {}
    }
    setTimeout(function () {
      suMain.hidden = true;
      suDone.hidden = false;
    }, 400);
  });
})();
