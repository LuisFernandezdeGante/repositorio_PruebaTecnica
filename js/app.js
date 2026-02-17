import { db, collection, addDoc, getDocs, deleteDoc, doc, query, where } from './firebase.js';
import { getIpInfo } from './api.js';

const tableBody = document.getElementById("tableBody");
const searchBtn = document.getElementById("searchBtn");
const ipInput = document.getElementById("ipInput");
const filterInput = document.getElementById("filterInput");

const ipCollection = collection(db, "ip_records");

let map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let currentMarker = null;

function showLocation(lat, lng, ip) {
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    map.setView([lat, lng], 10);

    currentMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`IP: ${ip}`)
        .openPopup();
}

async function renderTable(filter = "") {
    tableBody.innerHTML = "";
    const snapshot = await getDocs(ipCollection);

    snapshot.forEach(document => {
        const record = document.data();

        if (!record.ip.includes(filter)) return;

        tableBody.innerHTML += `
        <tr>
            <td>${record.ip}</td>
            <td>${record.city}</td>
            <td>${record.region}</td>
            <td>${record.country}</td>
            <td>${record.isp}</td>
            <td>${record.timezone}</td>
            <td>${record.date}</td>
            <td>
                
                <button class="btn-view" 
                    onclick="focusMap(${record.latitude}, ${record.longitude}, '${record.ip}'); event.stopPropagation();">
                    Ver
                </button>

                <button class="btn-delete" 
                    onclick="remove('${document.id}'); event.stopPropagation();">
                    Eliminar
                </button>
            

            </td>
        </tr>
        `;
    });
}

window.remove = async function(id) {
    await deleteDoc(doc(db, "ip_records", id));
    renderTable();
}

window.focusMap = function(lat, lng, ip) {
    showLocation(lat, lng, ip);
};

searchBtn.addEventListener("click", async () => {
    const ip = ipInput.value.trim();

    if (!ip) {
        alert("Ingrese una IP válida");
        return;
    }

    const q = query(ipCollection, where("ip", "==", ip));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        alert("⚠ Esta IP ya fue consultada.");
        return;
    }

    const data = await getIpInfo(ip);

    const record = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        isp: data.org,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude,
        date: new Date().toLocaleString()
    };

    await addDoc(ipCollection, record);

    showLocation(record.latitude, record.longitude, record.ip);

    renderTable();
});

filterInput.addEventListener("input", (e) => {
    renderTable(e.target.value);
});

renderTable();
