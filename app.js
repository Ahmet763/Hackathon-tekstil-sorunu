import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let map;
let markers = {};
let currentUser = null;
let currentFilter = "all";

document.addEventListener("DOMContentLoaded", () => {
  map = L.map("map").setView([39.9255, 32.8663], 6); // Türkiye ortası

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      loadPoints();
    } else {
      window.location.href = "login.html";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth);
  });
});

// ✅ Nokta ekle
window.addPoint = async () => {
  if (!currentUser) return;

  const latlng = map.getCenter();
  const category = prompt("Kategori girin: kıyafet / ayakkabı / aksesuar").toLowerCase();

  if (!["kıyafet", "ayakkabı", "aksesuar"].includes(category)) {
    alert("Geçersiz kategori!");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "points"), {
      lat: latlng.lat,
      lng: latlng.lng,
      userId: currentUser.uid,
      category: category
    });
    console.log("Nokta kaydedildi:", docRef.id);
    addMarker(docRef.id, latlng.lat, latlng.lng, currentUser.uid, category);
  } catch (e) {
    console.error("Hata:", e);
  }
};

// ✅ Firestore’dan noktaları yükle
async function loadPoints() {
  const querySnapshot = await getDocs(collection(db, "points"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    addMarker(docSnap.id, data.lat, data.lng, data.userId, data.category);
  });
}

// ✅ Marker ekle
function addMarker(id, lat, lng, ownerId, category) {
  const marker = L.marker([lat, lng]);

  let popupContent = `<b>${category.toUpperCase()}</b>`;
  if (currentUser && (currentUser.uid === ownerId || currentUser.email === "admin@rewear.com")) {
    popupContent += `<br><button onclick="deletePoint('${id}')">Sil</button>`;
  }

  marker.bindPopup(popupContent);

  // İlk yüklemede filtre uygula
  if (currentFilter === "all" || currentFilter === category) {
    marker.addTo(map);
  }

  markers[id] = { marker, category };
}

// ✅ Nokta sil
window.deletePoint = async (id) => {
  try {
    await deleteDoc(doc(db, "points", id));
    map.removeLayer(markers[id].marker);
    delete markers[id];
    console.log("Nokta silindi:", id);
  } catch (e) {
    console.error("Silme hatası:", e);
  }
};

// ✅ Filtre uygula
window.applyFilter = () => {
  currentFilter = document.getElementById("filterSelect").value;

  // Haritadaki tüm markerları temizle
  Object.values(markers).forEach(({ marker }) => {
    map.removeLayer(marker);
  });

  // Filtreye uygun markerları tekrar ekle
  Object.values(markers).forEach(({ marker, category }) => {
    if (currentFilter === "all" || currentFilter === category) {
      marker.addTo(map);
    }
  });
};
