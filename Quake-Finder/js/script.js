// ---- Globals ----
let map;
let marker;
let selectedPoint = null; // { lat, lng } set on map click
let submitting = false;

// ---- Helpers ----
function normalizeLatLng(latLng) {
  // Accepts a google.maps.LatLng or a LatLngLiteral
  const lat = typeof latLng.lat === "function" ? latLng.lat() : latLng.lat;
  const lng = typeof latLng.lng === "function" ? latLng.lng() : latLng.lng;
  return { lat: Number(lat), lng: Number(lng) };
}

// Safely get a numeric field from either of two possible IDs
function getNumberFromInputs(primarySelector, fallbackSelector, defaultValue = null) {
  const el = document.querySelector(primarySelector) || document.querySelector(fallbackSelector);
  if (!el || el.value === "" || el.value === null) return defaultValue;
  const n = parseFloat(el.value);
  return Number.isNaN(n) ? defaultValue : n;
}

function getValue(selector, fallbackSelector, defaultValue = "") {
  const el = document.querySelector(selector) || document.querySelector(fallbackSelector);
  return el ? el.value : defaultValue;
}

function setText(id, text) {
  const el = document.querySelector(id);
  if (el) el.textContent = text;
}

function showLoading() {
  const el = document.getElementById("loading");
  if (!el) return;
  el.classList.remove("hidden");
  // retrigger shake if shown multiple times
  el.style.animation = "none"; el.offsetHeight; el.style.animation = "";
}
function hideLoading() {
  document.getElementById("loading")?.classList.add("hidden");
}

// ---- Fetch ----
async function fetchJsonWithChecks(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`USGS request failed: ${res.status} ${res.statusText}` +
      (body ? ` — ${body.slice(0, 200)}…` : ""));
  }

  // Accept application/json or application/geo+json (any charset variants)
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("json")) {
    const body = await res.text().catch(() => "");
    throw new Error(`Expected JSON but got "${ct || "unknown"}".` +
      (body ? ` First bytes: ${body.slice(0, 120)}…` : ""));
  }

  try {
    return await res.json();
  } catch {
    const body = await res.text().catch(() => "");
    throw new Error("Response wasn’t valid JSON." +
      (body ? ` First bytes: ${body.slice(0, 120)}…` : ""));
  }
}

// ---- Map + Marker ----
function initMap() {
  const initialLocation = { lat: 40, lng: -100 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: initialLocation,
    zoom: 4,
    mapId: "DEMO_MAP_ID"
  });

  // Place/move pin on click
  map.addListener("click", (e) => {
    placeMarker(e.latLng, map);
  });
}

// Place or move the marker
function placeMarker(latLng, mapInstance) {
  const pos = normalizeLatLng(latLng);

  if (marker) {
    marker.position = pos; // update existing AdvancedMarkerElement
  } else {
    marker = new google.maps.marker.AdvancedMarkerElement({
      position: pos,
      map: mapInstance
    });
  }

  selectedPoint = pos;

  const latElement = document.getElementById("latitude");
  const lngElement = document.getElementById("longitude");
  if (latElement && lngElement) {
    latElement.textContent = pos.lat.toFixed(5);
    lngElement.textContent = pos.lng.toFixed(5);
  }
}

// ---- Form handling ----
const form = document.querySelector("#earthquakeForm");
if (form) {
  form.addEventListener("submit", handleSubmit);
}

async function handleSubmit(event) {
  event.preventDefault();
  if (submitting) return;

  if (!validateForm(event)) {
    const errorBox = document.querySelector("#errorMessage");
    if (errorBox && !errorBox.textContent) {
      errorBox.textContent = "Magnitude values must be between 1 - 8";
    }
    return;
  }

  submitting = true;
  const errorBox = document.querySelector("#errorMessage");
  const submitBtn = event.submitter || document.querySelector('#earthquakeForm button[type="submit"]');
  if (errorBox) errorBox.textContent = "";

  showLoading();
  submitBtn?.setAttribute?.("disabled", "true");

  try {
    // Grab values
    const startDate = getValue("#startDate", "#startDate", "");
    const endDate   = getValue("#endDate", "#endDate", "");
    const minMag = getNumberFromInputs("#minMag", "#minmag", 1);
    const maxMag = getNumberFromInputs("#maxMag", "#maxmag", 8);
    const radiusKmInput = getNumberFromInputs("#radiusKm", "#radiuskm", NaN);

    // Basic date ordering validation (extra guard)
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      if (errorBox) errorBox.textContent = "Start Date cannot be after End Date.";
      return;
    }

    // Build USGS API URL
    let apiUrl =
      `https://earthquake.usgs.gov/fdsnws/event/1/query` +
      `?format=geojson&starttime=${encodeURIComponent(startDate)}` +
      `&endtime=${encodeURIComponent(endDate)}` +
      `&minmagnitude=${encodeURIComponent(minMag)}` +
      `&maxmagnitude=${encodeURIComponent(maxMag)}`;

    // If a pin is set, prefer point + radius query
    if (selectedPoint) {
      const radiusKm = Number.isNaN(radiusKmInput) ? 100 : radiusKmInput; // default 100 km
      apiUrl +=
        `&latitude=${encodeURIComponent(selectedPoint.lat)}` +
        `&longitude=${encodeURIComponent(selectedPoint.lng)}` +
        `&maxradiuskm=${encodeURIComponent(radiusKm)}`;
    }
    // Else, if a bounding box is available, append it
    else if (window.selectedBounds) {
      const b = window.selectedBounds;
      apiUrl +=
        `&minlatitude=${encodeURIComponent(b.south)}` +
        `&maxlatitude=${encodeURIComponent(b.north)}` +
        `&minlongitude=${encodeURIComponent(b.west)}` +
        `&maxlongitude=${encodeURIComponent(b.east)}`;
    }

    // Fetch + store + redirect
    const data = await fetchJsonWithChecks(apiUrl);
    localStorage.setItem("earthquakeData", JSON.stringify(data));
    window.location.href = "results.html";
  } catch (error) {
    if (errorBox) errorBox.textContent = String(error.message || error);
    console.error("Error:", error);
  } finally {
    hideLoading(); // harmless even if redirect happens quickly
    submitBtn?.removeAttribute?.("disabled");
    submitting = false;
  }
}

function validateForm(event) {
  let isValid = true;

  const minMag = getNumberFromInputs("#minMag", "#minmag", 1);
  const maxMag = getNumberFromInputs("#maxMag", "#maxmag", 8);

  // Clear old errors
  setText("#minmagError", "");
  setText("#maxmagError", "");

  // min checks
  if (!Number.isFinite(minMag)) {
    setText("#minmagError", "Enter a number");
    isValid = false;
  } else if (minMag < 1) {
    setText("#minmagError", "Minimum magnitude must be ≥ 1");
    isValid = false;
  } else if (minMag > 8) {
    setText("#minmagError", "Minimum magnitude must be ≤ 8");
    isValid = false;
  }

  // max checks
  if (!Number.isFinite(maxMag)) {
    setText("#maxmagError", "Enter a number");
    isValid = false;
  } else if (maxMag < 1) {
    setText("#maxmagError", "Maximum magnitude must be ≥ 1");
    isValid = false;
  } else if (maxMag > 8) {
    setText("#maxmagError", "Maximum magnitude must be ≤ 8");
    isValid = false;
  }

  // relational check
  if (isValid && minMag > maxMag) {
    setText("#maxmagError", "Max magnitude must be ≥ min magnitude");
    isValid = false;
  }

  return isValid;
}