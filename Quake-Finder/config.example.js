window.CONFIG = { GOOGLE_MAPS_API_KEY: "Place API key here" };

// Auto-inject Maps JS on load
(function loadMaps() {
  const key = window.CONFIG?.GOOGLE_MAPS_API_KEY || "";
  const s = document.createElement("script");
  s.src =
    "https://maps.googleapis.com/maps/api/js?key=" +
    encodeURIComponent(key) +
    "&libraries=marker&callback=initMap&loading=async";
  s.async = true;
  s.defer = true;
  document.head.appendChild(s);
})();