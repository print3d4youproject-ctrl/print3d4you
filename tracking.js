/* Print3D4You tracking and attribution helper */
(function () {
  var STORAGE_KEY = "p4m_attribution";
  var ATTR_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid"
  ];

  function readConfig() {
    if (!window.TRACKING_CONFIG) return {};
    return window.TRACKING_CONFIG;
  }

  function parseParams(search) {
    var params = new URLSearchParams(search || window.location.search);
    var out = {};
    ATTR_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) out[key] = value;
    });
    return out;
  }

  function readStoredAttribution() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (err) {
      return {};
    }
  }

  function saveStoredAttribution(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      /* no-op if storage is unavailable */
    }
  }

  function mergeAttribution(stored, current) {
    var merged = Object.assign({}, stored);
    Object.keys(current).forEach(function (key) {
      if (!merged[key]) merged[key] = current[key];
      merged["last_" + key] = current[key];
    });
    return merged;
  }

  function appendParamsToUrl(url, params) {
    var u = new URL(url, window.location.href);
    Object.keys(params).forEach(function (key) {
      if (params[key] && !u.searchParams.get(key)) {
        u.searchParams.set(key, params[key]);
      }
    });
    /* Always return full URL so iframe/embed (e.g. tally.so) is not loaded from our domain. */
    return u.href;
  }

  function isValidMeasurementId(id) {
    return typeof id === "string" && /^G-[A-Z0-9]+$/i.test(id);
  }

  function setupGA4(measurementId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: true });
  }

  function loadGA4Script(measurementId) {
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function sendEvent(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, params || {});
  }

  document.addEventListener("DOMContentLoaded", function () {
    var cfg = readConfig();
    var measurementId = cfg.measurementId || "";
    var currentAttr = parseParams();
    var storedAttr = readStoredAttribution();
    var attribution = mergeAttribution(storedAttr, currentAttr);

    saveStoredAttribution(attribution);

    if (typeof window.gtag !== "function") {
      if (isValidMeasurementId(measurementId)) {
        loadGA4Script(measurementId);
        setupGA4(measurementId);
      }
    }

    var path = window.location.pathname.toLowerCase();

    if (path.endsWith("/index.html") || path === "/" || path === "") {
      var cta = document.querySelector('.button[href="richiesta.html"]');
      if (cta) {
        cta.addEventListener("click", function () {
          cta.setAttribute("href", appendParamsToUrl("richiesta.html", attribution));
          sendEvent("select_content", {
            content_type: "cta_button",
            content_id: "richiedi_una_stampa",
            funnel_step: "home_to_request"
          });
        });
      }
      sendEvent("funnel_step", { step_name: "home_view" });
    }

    if (path.endsWith("/richiesta.html")) {
      var iframe = document.querySelector("iframe[src*='tally.so/embed']");
      if (iframe) {
        iframe.src = appendParamsToUrl(iframe.src, attribution);
      }
      sendEvent("funnel_step", { step_name: "request_form_view" });
    }

    if (path.endsWith("/grazie.html")) {
      sendEvent("generate_lead", Object.assign({ funnel_step: "lead_completed" }, attribution));
      sendEvent("funnel_step", { step_name: "thank_you_view" });
    }
  });
})();
