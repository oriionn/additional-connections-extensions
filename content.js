if (window.location.href.includes("bc-api.oriondev.fr")) {
  if (window.location.href.includes("connections") && window.location.href.includes("deezer")) {
    let params = new URLSearchParams(window.location.search);
    let code = params.get("code");
    let token = params.get("token");

    if (code) {
      if (!token) {
        chrome.storage.sync.get(["token"], function (result) {
          window.location.href += "&token=" + result.token;
        })
      }
    }
  }
}