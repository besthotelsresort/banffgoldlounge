(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  var navLinks = document.querySelectorAll(".site-nav a");

  if (toggle && nav && header) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });

    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  var anchors = document.querySelectorAll('a[href^="#"]');
  if (anchors.length) {
    anchors.forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  var tablist = document.querySelector('[role="tablist"]');
  if (tablist) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));
    var mqAccordion = window.matchMedia("(max-width: 480px)");

    function activateTab(tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.setAttribute("tabindex", selected ? "0" : "-1");
        if (selected && focus) t.focus();
      });
      panels.forEach(function (panel) {
        var match = panel.getAttribute("id") === tab.getAttribute("aria-controls");
        if (match) {
          panel.removeAttribute("hidden");
          panel.classList.add("is-active");
        } else {
          panel.setAttribute("hidden", "");
          panel.classList.remove("is-active");
        }
      });
    }

    function setAccordionMode(isAccordion) {
      tablist.setAttribute("aria-orientation", isAccordion ? "vertical" : "horizontal");
      var selected = tabs.filter(function (t) {
        return t.getAttribute("aria-selected") === "true";
      })[0] || tabs[0];
      if (selected) activateTab(selected, false);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activateTab(tab, false);
      });

      tab.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(tab);
        var next = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          next = tabs[(i + 1) % tabs.length];
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          next = tabs[(i - 1 + tabs.length) % tabs.length];
        } else if (e.key === "Home") {
          next = tabs[0];
        } else if (e.key === "End") {
          next = tabs[tabs.length - 1];
        }
        if (next) {
          e.preventDefault();
          activateTab(next, true);
        }
      });
    });

    setAccordionMode(mqAccordion.matches);
    if (mqAccordion.addEventListener) {
      mqAccordion.addEventListener("change", function (e) {
        setAccordionMode(e.matches);
      });
    } else if (mqAccordion.addListener) {
      mqAccordion.addListener(function (e) {
        setAccordionMode(e.matches);
      });
    }
  }
})();
