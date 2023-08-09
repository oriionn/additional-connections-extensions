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

if (window.location.href.includes("bc-api.oriondev.fr")) {
  if (window.location.href.includes("connections") && window.location.href.includes("deezer")) {
    let params = new URLSearchParams(window.location.search);
    let code = params.get("code");
    let token = params.get("token");

    if (code) {
      if (!token) {
        (getBrowser() === "firefox" ? browser:chrome).storage.sync.get(["token"], function (result) {
          window.location.href += "&token=" + result.token;
        })
      }
    }
  }
}