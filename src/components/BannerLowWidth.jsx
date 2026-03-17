import { useEffect } from "react";

const BannerLowWidth = () => {
  useEffect(() => {
    // Create config script (atOptions)
    const configScript = document.createElement("script");
    configScript.innerHTML = `
      atOptions = {
        'key' : 'fe2b0e5a2d71581531cb7af10d014aa0',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    // Create invoke script
    const adScript = document.createElement("script");
    adScript.src =
      "https://www.highperformanceformat.com/fe2b0e5a2d71581531cb7af10d014aa0/invoke.js";
    adScript.async = true;
    adScript.setAttribute("data-cfasync", "false");

    const container = document.getElementById(
      "container-7debf4bf85e30dcbfcfb1ce228e9ebbb",
    );

    if (container) {
      container.appendChild(configScript); // first config
      container.appendChild(adScript); // then script
    }

    // Cleanup (optional but good)
    return () => {
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div style={{ textAlign: "center", margin: "25px 0" }}>
      <div id="container-7debf4bf85e30dcbfcfb1ce228e9ebbb"></div>
    </div>
  );
};

export default BannerLowWidth;
