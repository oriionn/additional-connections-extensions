chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  let regex = new RegExp('^(https?:\\/\\/(www\\.)?)?(deezer\\.com|hyakanime\\.fr)');
  if (regex.test(tabs[0].url)) {
    if (tabs[0].url.includes('hyakanime.fr')) {
      document.body.innerHTML += `<div class="container">
        <h1>Hyakanime</h1>
        <button id="link">Link</button>
      </div>`
      document.getElementById('link').addEventListener('click', function() {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => localStorage.token
        }).then((result) => {
          let h_token = result[0].result;
          chrome.storage.sync.get(["token"], function(res) {
            fetch("https://bc-api.oriondev.fr/connections/hyakanime", { method: "POST", headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ token: res.token, hyakanime_token: h_token }) }).then(rs => {
              console.log(rs.json())
              console.log(res)
              console.log(h_token)
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
    }
  }
})

const tokenForm = document.getElementById('tokenForm');
const tokenInput = document.getElementById('tokenInput');

tokenForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const token = tokenInput.value;

  chrome.storage.sync.set({ 'token': token }, function() {
    alert("Token saved")
    console.log("Token saved : " + token);
  });
});