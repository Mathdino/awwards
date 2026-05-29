import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Cursor estilo "Jelly Blob" — estica e achata como cartoon
 * baseado na velocidade e direção do mouse (física de animação 2D).
 *
 * Inspirado no exemplo oficial da GreenSock:
 * https://codepen.io/GreenSock/pen/BaZEyoz
 */
const Cursor = () => {
  const blobRef = useRef(null); // bolha que estica/achata
  const dotRef  = useRef(null); // ponto de precisão (instantâneo)

  useEffect(() => {
    // Não exibe em dispositivos touch
    if (window.matchMedia("(hover: none)").matches) return;

    const blob = blobRef.current;
    const dot  = dotRef.current;

    document.body.style.cursor = "none";

    // Posição inicial fora da tela
    gsap.set([blob, dot], { xPercent: -50, yPercent: -50, x: -300, y: -300 });

    // ── quickTo: segue o mouse com easing (blob é mais lento que o dot) ──
    const blobX = gsap.quickTo(blob, "x", { duration: 0.55, ease: "power3" });
    const blobY = gsap.quickTo(blob, "y", { duration: 0.55, ease: "power3" });
    const dotX  = gsap.quickTo(dot,  "x", { duration: 0.04 });
    const dotY  = gsap.quickTo(dot,  "y", { duration: 0.04 });

    // Velocidade acumulada (decai no ticker)
    const vel = { x: 0, y: 0 };
    const last = { x: -300, y: -300 };
    let isHovered = false;

    // ── Mousemove: coleta velocidade e move cursores ──────────────────
    const onMove = (e) => {
      vel.x = e.clientX - last.x;
      vel.y = e.clientY - last.y;
      last.x = e.clientX;
      last.y = e.clientY;

      blobX(e.clientX);
      blobY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };

    // ── Ticker: aplica deformação de cartoon a cada frame ─────────────
    const tick = () => {
      if (isHovered) return; // não deforma durante hover

      // Decaimento da velocidade (amortecimento)
      vel.x *= 0.80;
      vel.y *= 0.80;

      const speed   = Math.sqrt(vel.x ** 2 + vel.y ** 2);
      const angle   = Math.atan2(vel.y, vel.x) * (180 / Math.PI);
      const stretch = Math.min(speed * 0.048, 0.6); // fator de esticamento

      gsap.set(blob, {
        scaleX:   1 + stretch,
        scaleY:   Math.max(1 - stretch * 0.42, 0.62),
        rotation: speed > 1.2 ? angle : 0,
      });
    };
    gsap.ticker.add(tick);

    // ── Hover em elementos interativos ───────────────────────────────
    const SELECTOR = "a, button, [data-hover], input, select, [role=button]";

    const onOver = (e) => {
      if (!e.target.closest(SELECTOR)) return;
      isHovered = true;

      // Reset deformação e expande com overshoot cartoon
      gsap.to(blob, {
        scaleX: 2.6,
        scaleY: 2.6,
        rotation: 0,
        opacity: 0.5,
        duration: 0.4,
        ease: "back.out(3)",
        overwrite: "auto",
      });
      gsap.to(dot, { scale: 0, duration: 0.15 });
    };

    const onOut = (e) => {
      if (!e.target.closest(SELECTOR)) return;
      isHovered = false;

      // Contrai com mola elástica
      gsap.to(blob, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        ease: "elastic.out(1.2, 0.4)",
        overwrite: "auto",
      });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    // ── Click: achata e solta (squash & stretch clássico) ────────────
    const onClick = () => {
      gsap.timeline({ overwrite: "auto" })
        .to(blob, { scaleX: 1.8, scaleY: 0.55, duration: 0.1, ease: "power2.in" })
        .to(blob, { scaleX: 0.7, scaleY: 1.6,  duration: 0.15, ease: "power2.out" })
        .to(blob, { scaleX: 1,   scaleY: 1,    duration: 0.5, ease: "elastic.out(1, 0.4)" });
    };

    // ── Sai/entra na janela ──────────────────────────────────────────
    const onLeaveDoc = () => gsap.to([blob, dot], { autoAlpha: 0, duration: 0.25 });
    const onEnterDoc = () => gsap.to([blob, dot], { autoAlpha: 1, duration: 0.25 });

    window.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.addEventListener("click",      onClick);
    document.addEventListener("mouseleave", onLeaveDoc);
    document.addEventListener("mouseenter", onEnterDoc);

    return () => {
      document.body.style.cursor = "auto";
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("click",      onClick);
      document.removeEventListener("mouseleave", onLeaveDoc);
      document.removeEventListener("mouseenter", onEnterDoc);
    };
  }, []);

  return (
    <>
      {/* ── Blob: estica/achata como cartoon ── */}
      <div
        ref={blobRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full bg-white mix-blend-difference"
      />

      {/* ── Ponto de precisão: segue instantaneamente ── */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[5px] w-[5px] rounded-full bg-white mix-blend-difference"
      />
    </>
  );
};

export default Cursor;
