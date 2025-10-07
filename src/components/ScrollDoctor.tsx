import { useEffect } from "react";

export default function ScrollDoctor() {
  useEffect(() => {
    const unlock = () => {
      document.documentElement.style.overflowY = "auto";
      document.body.style.overflowY = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.classList.remove(
        "overflow-hidden",
        "no-scroll",
        "fixed",
        "menu-open"
      );
    };

    // Initial unlocks to counter late-loading scripts/styles
    unlock();
    const t1 = setTimeout(unlock, 300);
    const t2 = setTimeout(unlock, 1000);
    const t3 = setTimeout(unlock, 2500);

    // Watch for anything re-locking scroll on <html> or <body>
    const mo = new MutationObserver((muts) => {
      let relocked = false;
      for (const m of muts) {
        if (
          m.type === "attributes" &&
          (m.target === document.body || m.target === document.documentElement)
        ) {
          const bd = window.getComputedStyle(document.body);
          const html = window.getComputedStyle(document.documentElement);
          if (
            bd.overflowY === "hidden" ||
            html.overflowY === "hidden" ||
            document.body.classList.contains("overflow-hidden") ||
            document.body.classList.contains("no-scroll") ||
            document.body.classList.contains("fixed") ||
            document.body.classList.contains("menu-open")
          ) {
            relocked = true;
          }
        }
      }
      if (relocked) {
        console.warn("[ScrollDoctor] Detected scroll lock — forcing unlock.", {
          bodyClass: document.body.className,
          bodyOverflow: getComputedStyle(document.body).overflow,
          htmlOverflow: getComputedStyle(document.documentElement).overflow,
        });
        unlock();
      }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });

    // Periodically ensure hidden fullscreen overlays don't intercept events
    const killOverlays = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("body *"));
      els.forEach((el) => {
        const cs = getComputedStyle(el);
        const isFullscreenFixed =
          cs.position === "fixed" &&
          cs.top === "0px" &&
          cs.left === "0px" &&
          (cs.right === "0px" || el.offsetWidth >= window.innerWidth - 2) &&
          (cs.bottom === "0px" || el.offsetHeight >= window.innerHeight - 2);

        if (isFullscreenFixed) {
          const ariaHidden = el.getAttribute("aria-hidden") === "true";
          const hasPENone = cs.pointerEvents === "none" || el.classList.contains("pointer-events-none");
          if (ariaHidden || hasPENone) {
            el.style.pointerEvents = "none";
          }
        }
      });
    };
    const t4 = setInterval(killOverlays, 800);

    // Report if any listener prevents scrolling (wheel/touchmove)
    const report = (ev: Event) => {
      if (ev.defaultPrevented) {
        console.warn("[ScrollDoctor] A listener prevented scrolling.", ev.type, ev.target);
      }
    };
    document.addEventListener("wheel", report, { capture: true, passive: false });
    document.addEventListener("touchmove", report, { capture: true, passive: false });

    // Ensure page can overflow vertically
    document.documentElement.style.height = "auto";
    document.body.style.height = "auto";

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(t4);
      mo.disconnect();
      document.removeEventListener("wheel", report, { capture: true } as any);
      document.removeEventListener("touchmove", report, { capture: true } as any);
    };
  }, []);

  return null;
}
