/* ==========================================================================
   DigiMaraa Packaging Machinery — main script
   Vanilla JavaScript. No dependencies.
   Loaded after assets/js/config.js
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var CONFIG = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : null;
  var waBuilder =
    typeof buildWhatsAppUrl === "function"
      ? buildWhatsAppUrl
      : function (msg) {
          return msg ? "https://wa.me/?text=" + encodeURIComponent(msg) : "#";
        };

  var GENERIC_WA_MESSAGE =
    "Hello DigiMaraa Packaging Machinery, I would like to enquire about your packaging machinery and solutions.";

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ----------------------------------------------------------------------
     1. Dynamic business details from config.js
     ---------------------------------------------------------------------- */
  function populateBusinessDetails() {
    if (!CONFIG) return;

    var addressParts = [
      CONFIG.address.line1,
      CONFIG.address.line2,
      CONFIG.address.city,
      CONFIG.address.country
    ].filter(Boolean);
    var addressString = addressParts.join(", ");
    var displayPhone = CONFIG.contacts.enquiries;
    var officialMail = CONFIG.contacts.official;

    $$("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");

      if (key === "brand-name") {
        el.textContent = CONFIG.brandName;
      } else if (key === "address") {
        el.textContent = addressString;
      } else if (key === "phone-display") {
        el.textContent = displayPhone;
      } else if (key === "email-display") {
        el.textContent = officialMail;
      } else if (key === "email-official") {
        el.textContent = CONFIG.contacts.official;
      } else if (key === "email-business") {
        el.textContent = CONFIG.contacts.newBusiness;
      } else if (key === "email-career") {
        el.textContent = CONFIG.contacts.career;
      } else if (key === "credit-name") {
        el.textContent = CONFIG.developer.name;
      }
    });

    $$("[data-config-href]").forEach(function (el) {
      var key = el.getAttribute("data-config-href");

      if (key === "tel") {
        el.setAttribute("href", "tel:" + CONFIG.telNumber);
      } else if (key === "email") {
        el.setAttribute("href", "mailto:" + officialMail);
      } else if (key === "email-business") {
        el.setAttribute("href", "mailto:" + CONFIG.contacts.newBusiness);
      } else if (key === "email-career") {
        el.setAttribute("href", "mailto:" + CONFIG.contacts.career);
      } else if (key === "credit") {
        el.setAttribute("href", CONFIG.developer.website);
        el.setAttribute("rel", "noopener");
      }
    });
  }

  /* ----------------------------------------------------------------------
     2. WhatsApp links — every [data-wa-message] element
     ---------------------------------------------------------------------- */
  function buildAllWhatsAppLinks() {
    $$("[data-wa-message]").forEach(function (el) {
      var message = el.getAttribute("data-wa-message") || GENERIC_WA_MESSAGE;
      el.setAttribute("href", waBuilder(message));
      if (!el.getAttribute("target")) {
        el.setAttribute("target", "_blank");
      }
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  /* ----------------------------------------------------------------------
     3. Mobile navigation
     ---------------------------------------------------------------------- */
  function initNavigation() {
    var toggle = $(".nav-toggle");
    var nav = $("#primary-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute(
        "aria-label",
        open ? "Close main menu" : "Open main menu"
      );
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (
        toggle.getAttribute("aria-expanded") === "true" &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        setOpen(false);
      }
    });

    $$("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 960px)").matches) setOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (!window.matchMedia("(max-width: 960px)").matches) setOpen(false);
    });
  }

  /* ----------------------------------------------------------------------
     4. Sticky header shadow + active section highlighting
     ---------------------------------------------------------------------- */
  function initHeaderState() {
    var header = $(".site-header");
    if (!header) return;

    var links = $$(".nav__link[href^='#']");
    var sections = links
      .map(function (link) {
        var id = link.getAttribute("href");
        return id && id.length > 1 ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    function onScroll() {
      header.classList.toggle("is-stuck", window.scrollY > 8);

      var offset = header.offsetHeight + 24;
      var current = "";
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= offset) {
          current = "#" + section.id;
        }
      });
      if (!current && sections.length) {
        current = "#" + sections[0].id;
      }

      links.forEach(function (link) {
        var active = link.getAttribute("href") === current;
        link.classList.toggle("is-active", active);
        if (active) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          onScroll();
          ticking = false;
        });
      },
      { passive: true }
    );
    onScroll();
  }

  /* ----------------------------------------------------------------------
     5. FAQ accordion (accessible expand / collapse)
     ---------------------------------------------------------------------- */
  function initAccordions() {
    $$(".accordion").forEach(function (accordion) {
      var triggers = $$(".accordion__trigger", accordion);

      triggers.forEach(function (trigger) {
        var panelId = trigger.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;

        trigger.addEventListener("click", function () {
          var isOpen = trigger.getAttribute("aria-expanded") === "true";

          triggers.forEach(function (other) {
            if (other === trigger) return;
            other.setAttribute("aria-expanded", "false");
            var otherPanel = document.getElementById(
              other.getAttribute("aria-controls")
            );
            if (otherPanel) otherPanel.hidden = true;
          });

          trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
          panel.hidden = isOpen;
        });

        trigger.addEventListener("keydown", function (e) {
          var index = triggers.indexOf(trigger);
          var next = null;
          if (e.key === "ArrowDown") next = triggers[index + 1];
          else if (e.key === "ArrowUp") next = triggers[index - 1];
          else if (e.key === "Home") next = triggers[0];
          else if (e.key === "End") next = triggers[triggers.length - 1];
          if (next) {
            e.preventDefault();
            next.focus();
          }
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     6. Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     7. Products — rendered from products.js
     ---------------------------------------------------------------------- */
  function renderProducts() {
    var grid = $("#product-grid");
    if (!grid || typeof PRODUCTS === "undefined" || !PRODUCTS.length) return;

    grid.innerHTML = "";

    PRODUCTS.forEach(function (product) {
      var card = document.createElement("article");
      card.className = "product-card reveal";

      var media = document.createElement("div");
      media.className = "product-card__media";
      var img = document.createElement("img");
      img.src = product.image;
      img.alt = product.alt || product.title;
      img.loading = "lazy";
      img.width = 640;
      img.height = 440;
      media.appendChild(img);
      var tag = document.createElement("span");
      tag.className = "product-card__tag";
      tag.textContent = "Enquiry category";
      media.appendChild(tag);

      var body = document.createElement("div");
      body.className = "product-card__body";

      var title = document.createElement("h3");
      title.textContent = product.title;

      var desc = document.createElement("p");
      desc.textContent = product.description;

      var use = document.createElement("p");
      use.className = "product-card__use";
      var useLabel = document.createElement("strong");
      useLabel.textContent = "Typical application";
      use.appendChild(useLabel);
      use.appendChild(document.createTextNode(product.application));

      var actions = document.createElement("div");
      actions.className = "product-card__actions";

      var wa = document.createElement("a");
      wa.className = "btn btn-primary";
      wa.href = waBuilder(product.enquiry);
      wa.target = "_blank";
      wa.rel = "noopener noreferrer";
      wa.innerHTML =
        '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.18 4.22-9.4 9.41-9.4a9.34 9.34 0 0 1 6.65 2.76 9.34 9.34 0 0 1 2.75 6.65c0 5.18-4.22 9.41-9.4 9.41zM20.52 3.45A11.77 11.77 0 0 0 12.04 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.35-1.66a11.85 11.85 0 0 0 5.61 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.24-6.15-3.49-8.4z"/></svg> Enquire on WhatsApp';
      wa.setAttribute(
        "aria-label",
        "Enquire on WhatsApp about " + product.title
      );

      actions.appendChild(wa);

      body.appendChild(title);
      body.appendChild(desc);
      body.appendChild(use);
      body.appendChild(actions);

      card.appendChild(media);
      card.appendChild(body);
      grid.appendChild(card);
    });

  }

  /* ----------------------------------------------------------------------
     8. Contact form — client-side validation, then WhatsApp hand-off
     ---------------------------------------------------------------------- */
  function initContactForm() {
    var form = $("#enquiry-form");
    if (!form) return;

    var success = $("#form-status");

    function setError(field, message) {
      var errorEl = form.querySelector(
        ".field-error[data-error-for='" + field.id + "']"
      );
      if (errorEl) errorEl.textContent = message || "";
      if (message) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
      return !message;
    }

    function validateField(field) {
      var value = (field.value || "").trim();

      if (field.hasAttribute("required") && !value) {
        return setError(field, "This field is required.");
      }
      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return setError(field, "Please enter a valid email address.");
      }
      if (field.type === "tel" && value && value.replace(/\D/g, "").length < 8) {
        return setError(field, "Please enter a valid phone number.");
      }
      if (field.id === "message" && value && value.length < 10) {
        return setError(field, "Please add a little more detail (10+ characters).");
      }
      return setError(field, "");
    }

    var fields = $$("input, textarea, select", form).filter(function (f) {
      return f.type !== "submit";
    });

    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          valid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (!valid) {
        if (firstInvalid) firstInvalid.focus();
        if (success) success.classList.remove("is-visible");
        return;
      }

      var name = ($("#name") || {}).value || "";
      var phone = ($("#phone") || {}).value || "";
      var email = ($("#email") || {}).value || "";
      var interest = ($("#interest") || {}).value || "General enquiry";
      var msg = ($("#message") || {}).value || "";

      var composed =
        "Hello DigiMaraa Packaging Machinery, I would like to make an enquiry.\n\n" +
        "Name: " +
        name +
        "\nPhone: " +
        phone +
        "\nEmail: " +
        email +
        "\nInterested in: " +
        interest +
        "\nRequirements: " +
        msg;

      if (success) {
        success.classList.add("is-visible");
        success.focus();
      }

      window.open(waBuilder(composed), "_blank", "noopener");
      form.reset();
      fields.forEach(function (field) {
        setError(field, "");
      });
    });
  }

  /* ----------------------------------------------------------------------
     9. Misc — dynamic year, product interest select, canonical/OG sync
     ---------------------------------------------------------------------- */
  function initYear() {
    $$("[data-current-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /**
   * If a production site URL is configured in SITE_CONFIG.seo.siteUrl,
   * propagate it to the canonical link and Open Graph / Twitter URL tags.
   * Until then, the placeholder URLs in index.html are kept untouched.
   */
  function syncProductionUrls() {
    if (!CONFIG || !CONFIG.seo || !CONFIG.seo.siteUrl) return;
    var url = CONFIG.seo.siteUrl.replace(/\/+$/, "") + "/";

    $$('link[rel="canonical"]').forEach(function (el) {
      el.setAttribute("href", url);
    });
    $$("meta[property='og:url']").forEach(function (el) {
      el.setAttribute("content", url);
    });
    $$("meta[property='og:image']").forEach(function (el) {
      el.setAttribute(
        "content",
        url + "assets/images/hero-packaging-placeholder.jpg"
      );
    });
    $$("meta[name='twitter:image']").forEach(function (el) {
      el.setAttribute(
        "content",
        url + "assets/images/hero-packaging-placeholder.jpg"
      );
    });
  }

  function initInterestOptions() {
    var select = $("#interest");
    if (!select || typeof PRODUCTS === "undefined") return;

    PRODUCTS.forEach(function (product) {
      var option = document.createElement("option");
      option.value = product.title;
      option.textContent = product.title;
      select.appendChild(option);
    });
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    populateBusinessDetails();
    buildAllWhatsAppLinks();
    initNavigation();
    initHeaderState();
    initInterestOptions();
    renderProducts();
    buildAllWhatsAppLinks();
    initAccordions();
    initContactForm();
    initYear();
    syncProductionUrls();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
