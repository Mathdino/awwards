import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GALLERY = [
  { src: "/img/gallery-1.webp", label: "Chapter I",   rotation: -11, z: 5 },
  { src: "/img/gallery-2.webp", label: "Chapter II",  rotation:   7, z: 4 },
  { src: "/img/gallery-3.webp", label: "Chapter III", rotation:  -3, z: 3 },
  { src: "/img/gallery-4.webp", label: "Chapter IV",  rotation:   9, z: 2 },
  { src: "/img/gallery-5.webp", label: "Chapter V",   rotation:  -6, z: 1 },
];

// posição final de cada card (offset do centro, em px)
const SPREAD = [
  { x: -430, y: -50 },
  { x: -205, y:  95 },
  { x:    5, y: -60 },
  { x:  215, y:  90 },
  { x:  430, y: -45 },
];

const Gallery = () => {
  const sectionRef  = useRef(null);
  const wrapperRefs = useRef([]); // parallax / spread
  const cardRefs    = useRef([]); // hover
  const titleRef    = useRef(null);
  const subtitleRef = useRef(null);
  const hintRef     = useRef(null);
  const isDealt     = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ─── Estado inicial ──────────────────────────────────────────
      gsap.set(titleRef.current,    { autoAlpha: 0, y: -50 });
      gsap.set(subtitleRef.current, { autoAlpha: 0, y:  20 });
      gsap.set(hintRef.current,     { autoAlpha: 0.4 });

      wrapperRefs.current.forEach((w, i) => {
        // Todos os wrappers começam no centro com pequena rotação empilhada
        gsap.set(w, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          rotation: (i - 2) * 5,
          zIndex: GALLERY.length - i,
        });
      });

      // ─── Timeline scrubada pela rolagem (efeito de distribuir cartas) ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1000",
          pin: true,
          scrub: 1.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            isDealt.current = self.progress > 0.88;
          },
        },
      });

      // Título aparece no início
      tl.to(titleRef.current,    { autoAlpha: 1, y: 0, duration: 0.25 }, 0);
      tl.to(subtitleRef.current, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.08);
      tl.to(hintRef.current,     { autoAlpha: 0, duration: 0.1 }, 0);

      // Cartas se distribuem com stagger
      SPREAD.forEach((target, i) => {
        tl.to(
          wrapperRefs.current[i],
          {
            x: target.x,
            y: target.y,
            rotation: GALLERY[i].rotation,
            zIndex: GALLERY[i].z,
            duration: 0.55,
            ease: "power3.out",
          },
          0.1 + i * 0.09
        );
      });

      // Leve "respiro" final para assentar as cartas
      tl.to(wrapperRefs.current, { y: "+=8", duration: 0.08, yoyo: true, repeat: 1 }, 0.85);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Hover (só quando as cartas estão distribuídas) ─────────────
  const onEnter = (i) => {
    if (!isDealt.current) return;
    gsap.to(cardRefs.current[i], {
      y: -24,
      scale: 1.09,
      rotation: -GALLERY[i].rotation, // contra-rotação p/ endireitar
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onLeave = (i) => {
    if (!isDealt.current) return;
    gsap.to(cardRefs.current[i], {
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.55,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#dfdff0]"
    >

      {/* ── Blobs de fundo ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/4 top-1/3  h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-200/25 blur-2xl" />
      </div>

      {/* ── Cabeçalho ──────────────────────────────────────────────── */}
      <div className="relative z-10 mb-4 text-center">
        <div ref={titleRef}>
          <h2 className="special-font font-zentry text-[clamp(3.5rem,9vw,8.5rem)] font-black uppercase leading-none text-black">
            Gal<b>l</b>ery
          </h2>
        </div>
        <p ref={subtitleRef} className="mt-2 font-general text-[10px] uppercase tracking-[0.35em] text-black/40">
          Visual chronicles of the world
        </p>
      </div>

      {/* ── Área das cartas ────────────────────────────────────────── */}
      <div className="relative h-[340px] w-full">
        {GALLERY.map((item, i) => (
          // wrapper: controlado pelo scrub (spread / rotação final)
          <div
            key={i}
            ref={(el) => (wrapperRefs.current[i] = el)}
            className="absolute left-1/2 top-1/2"
            style={{ zIndex: item.z }}
          >
            {/* card: controlado pelo hover */}
            <div
              ref={(el) => (cardRefs.current[i] = el)}
              onMouseEnter={() => onEnter(i)}
              onMouseLeave={() => onLeave(i)}
              className="cursor-pointer bg-white p-[10px] pb-10"
              style={{
                width: "195px",
                boxShadow: "0 14px 45px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.09)",
              }}
            >
              <img
                src={item.src}
                alt={`gallery ${i + 1}`}
                className="h-52 w-full object-cover"
                draggable={false}
              />
              <p className="mt-[10px] text-center font-general text-[9px] uppercase tracking-[0.25em] text-black/45">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Hint de scroll ─────────────────────────────────────────── */}
      <div
        ref={hintRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <p className="font-general text-[9px] uppercase tracking-[0.3em] text-black/50">scroll</p>
        <div className="h-8 w-px animate-pulse bg-black/40" />
      </div>

    </section>
  );
};

export default Gallery;
