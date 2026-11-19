
console.log("Al Andalous : HTML et CSS prêts, écris maintenant ton JS.");

import { request } from "./services/api.js";
 
request("/posts")
  .then((data) => console.log("OK /posts :", data.length, "articles"))
  .catch((err) => console.log("ERREUR /posts :", err));
 
request("/posts/99999")
  .then((data) => console.log("OK :", data))
  .catch((err) => console.log("ERREUR attendue (404) :", err));

const offlineScreen = document.getElementById("offline-screen");

function updateOfflineScreen() {
  offlineScreen.hidden = navigator.onLine;  
}

window.addEventListener("offline", updateOfflineScreen);
window.addEventListener("online", updateOfflineScreen);
updateOfflineScreen();                    