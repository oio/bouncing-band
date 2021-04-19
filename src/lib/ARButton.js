class ARButton {
  static createButton(renderer, sessionInit = {}) {
    const button = document.createElement("button");

    function showStartAR(/*device*/) {
      let currentSession = null;

      function onSessionStarted(session) {
        session.addEventListener("end", onSessionEnded);

        renderer.xr.setReferenceSpaceType("local");

        renderer.xr.setSession(session);
        button.textContent = "STOP AR";

        currentSession = session;
      }

      function onSessionEnded(/*event*/) {
        currentSession.removeEventListener("end", onSessionEnded);

        button.textContent = "START AR!";

        currentSession = null;
      }

      //

      button.style.display = "";

      button.style.cursor = "pointer";
      button.style.left = "calc(50% - 50px)";
      button.style.width = "110px";

      button.textContent = "START AR!";

      button.onmouseenter = function () {
        button.style.opacity = "1.0";
      };

      button.onmouseleave = function () {
        button.style.opacity = "1.0";
      };

      button.onclick = function () {
        if (currentSession === null) {
          navigator.xr
            .requestSession("immersive-ar", sessionInit)
            .then(onSessionStarted);
        } else {
          currentSession.end();
        }
      };
    }

    function disableButton() {
      button.style.display = "";

      button.style.cursor = "auto";
      button.style.left = "calc(50% - 75px)";
      button.style.width = "150px";

      button.onmouseenter = null;
      button.onmouseleave = null;

      button.onclick = null;
    }

    function showARNotSupported() {
      disableButton();
      document.querySelector(".arrows").style.display = "none";
      document.querySelector(".banner").style.display = "block";
      button.textContent = "AR NOT SUPPORTED :(";
    }

    function stylizeElement(element) {
      element.style.position = "absolute";
      element.style.bottom = "20px";
      element.style.padding = "9px 6px";
      element.style.border = "2px solid #fff";
      element.style.borderRadius = "10px";
      element.style.transform = "rotate(2deg)";
      element.style.background = "transparent";
      element.style.color = "#fff";
      element.style.font = '21px "Gaegu", cursive';
      element.style.textAlign = "center";
      element.style.opacity = "1";
      element.style.outline = "none";
      element.style.zIndex = "999";
      element.style.visibility = "hidden";
    }

    if ("xr" in navigator) {
      button.id = "ARButton";
      button.style.display = "none";

      stylizeElement(button);

      navigator.xr
        .isSessionSupported("immersive-ar")
        .then(function (supported) {
          supported ? showStartAR() : showARNotSupported();
        })
        .catch(showARNotSupported);

      return button;
    } else {
      const message = document.createElement("a");

      if (window.isSecureContext === false) {
        message.href = document.location.href.replace(/^http:/, "https:");
        message.innerHTML = "WEBXR NEEDS HTTPS"; // TODO Improve message
      } else {
        message.href = "https://immersiveweb.dev/";
        message.innerHTML = "WEBXR NOT AVAILABLE :(";
        document.querySelector(".arrows").style.display = "none";
      }

      message.style.left = "calc(50% - 90px)";
      message.style.width = "180px";
      message.style.textDecoration = "none";

      stylizeElement(message);

      return message;
    }
  }
}

export { ARButton };
