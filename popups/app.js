function getBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("firefox")) {
    return "firefox";
  } else if (userAgent.includes("chrome")) {
    return "chrome";
  } else {
    return "unknown";
  }
}

(getBrowser() === "firefox" ? browser:chrome).tabs.query({ active: true, currentWindow: true }, function(tabs) {
  let regex = new RegExp('^(https?:\\/\\/(www\\.)?)?(deezer\\.com|hyakanime\\.fr|monkeytype\\.com)');
  if (regex.test(tabs[0].url)) {
    if (tabs[0].url.includes('hyakanime.fr')) {
      document.body.innerHTML += `<div class="container">
        <h1>Hyakanime</h1>
        <button id="link">Link</button>
      </div>`
      document.getElementById('link').addEventListener('click', function() {
        (getBrowser() === "firefox" ? browser:chrome).scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => localStorage.token
        }).then((result) => {
          let h_token = result[0].result;
          (getBrowser() === "firefox" ? browser:chrome).storage.sync.get(["token"], function(res) {
            fetch("https://bc-api.oriondev.fr/connections/hyakanime", { method: "POST", headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ token: res.token, hyakanime_token: h_token }) }).then(rs => {
              alert("Hyakanime linked")
            }).catch(err => {
              console.log(err);
              alert("Error while linking Hyakanime:\n" + err);
            })
          })
        }).catch(err => {
          alert("You need to be logged in to Hyakanime.fr");
        })
      })
    } else if (tabs[0].url.includes('deezer.com')) {
      fetch("https://bc-api.oriondev.fr/oauth2-link/deezer").then((response) => {
        response.json().then(res => {
          document.body.innerHTML += `<div class="container">
            <h1>Deezer</h1>
            <a id="link" href="${res.message}" target="_blank">Link</a>
          </div>`
        })
      })
    } else if (tabs[0].url.includes('monkeytype.com')) {
      document.body.innerHTML += `<div class="container">
        <h1>Monkeytype</h1>
        <button id="link">Link</button>
      </div>`
      document.getElementById('link').addEventListener('click', function() {
        (getBrowser() === "firefox" ? browser:chrome).scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: async () => {
            async function getDB() {
              const dbName = "firebaseLocalStorageDb";
              const objectStoreName = "firebaseLocalStorage";

              const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName);
                request.onerror = reject;
                request.onsuccess = () => resolve(request.result);
              });

              const transaction = db.transaction([objectStoreName], "readonly");
              const objectStore = transaction.objectStore(objectStoreName);

              const keys = [];
              const cursorRequest = objectStore.openCursor();

              return new Promise((resolve, reject) => {
                cursorRequest.onerror = reject;

                cursorRequest.onsuccess = () => {
                  const cursor = cursorRequest.result;
                  if (cursor) {
                    keys.push(cursor.key);
                    cursor.continue();
                  } else {
                    if (keys.length > 0) {
                      const firstKey = keys[0];
                      const valueRequest = objectStore.get(firstKey);

                      valueRequest.onsuccess = event => {
                        resolve(event.target.result);
                      };

                      valueRequest.onerror = reject;
                    } else {
                      resolve(undefined);
                    }
                  }
                };
              });

            }

            return (await getDB());
          }
        }).then(result => {
          let token = result[0].result.value.stsTokenManager.accessToken;
          (getBrowser() === "firefox" ? browser:chrome).storage.sync.get(["token"], function(res) {
            fetch("https://bc-api.oriondev.fr/connections/monkeytype", { method: "POST", headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ token: res.token, monkeytype_token: token }) }).then(rs => {
              alert("Monkeytype linked")
            }).catch(err => {
              console.log(err);
              alert("Error while linking Monkeytype:\n" + err);
            })
          })
        })
      })
    }
  }
})

const tokenForm = document.getElementById('tokenForm');
const tokenInput = document.getElementById('tokenInput');

let params = new URLSearchParams(window.location.search);
let token = params.get("token");
if (token) {
  alert("Token saved")
  console.log("Token saved : " + token);
  (getBrowser() === "firefox" ? browser:chrome).storage.sync.set({ 'token': token });
}