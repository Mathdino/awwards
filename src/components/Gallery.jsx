import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GALLERY = [
  { src: "/img/gallery-1.webp", rotation: -11, label: "Chapter I",   z: 2 },
  { src: "/img/gallery-2.webp", rotation:   7, label: "Chapter II",  z: 4 },
  { src: "/img/gallery-3.webp", rotation:  -3, label: "Chapter III", z: 5 },
  { src: "/img/gallery-4.webp", rotation:   9, label: "Chapter IV",  z: 3 },
  { src: "/img/gallery-5.webp", rotation:  -6, label: "Chapter V",   z: 1 },
];

// posições finais de cada card (scattered layout)
const POSITIONS = [
  { left: "1%",  top: "12%" },
  { left: "20%", top: "46%" },
  { left: "38%", top: "8%"  },
  { left: "57%", top: "42%" },
  { left: "75%", top: "10%" },
];

// origens off-screen de cada card (de onde eles voam)
const ORIGINS = [
  { x: -900, y: -500, rot: -60 },
  { x: -700, y:  700, rot:  50 },
  { x:    0, y: -800, rot: -40 },
  { x:  800, y:  600, rot:  55 },
  { x: 1000, y: -500, rot: -50 },
];

const Gallery = () => {
  const sectionRef  = useRef(null);
  const cardsRef    = useRef([]);
  const titleRef    = useRef(null);
  const lineRef     = useRef(null);
  const subtitleRef = useRef(null);
  const floatRef    = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Linha decorativa que expande ──────────────────────────────
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // ── Título entra de baixo ──────────────────────────────────────
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.25,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      // ── Cards voam dos cantos e pousam ────────────────────────────
      cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            x: ORIGINS[i].x,
            y: ORIGINS[i].y,
            rotation: ORIGINS[i].rot,
            scale: 0.3,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotation: GALLERY[i].rotation,
            scale: 1,
            opacity: 1,
            duration: 1.6,
            delay: i * 0.13,
            ease: "back.out(1.3)",
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
            onComplete: () => startFloat(i),
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Float contínuo após a entrada
  const startFloat = (i) => {
    const card = cardsRef.current[i];
    if (!card) return;
    floatRef.current[i] = gsap.to(card, {
      y: (i % 2 === 0 ? 14 : -14),
      duration: 2.2 + i * 0.35,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      overwrite: false,
    });
  };

  const onEnter = (i) => {
    // Para o float e levanta o card
    if (floatRef.current[i]) floatRef.current[i].pause();
    gsap.to(cardsRef.current[i], {
      y: -28,
      scale: 1.08,
      rotation: 0,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onLeave = (i) => {
    // Volta com bounce elástico e retoma o float
    gsap.to(cardsRef.current[i], {
      y: 0,
      scale: 1,
      rotation: GALLERY[i].rotation,
      duration: 0.6,
      ease: "elastic.out(1, 0.55)",
      overwrite: "auto",
      onComplete: () => {
        if (floatRef.current[i]) floatRef.current[i].restart();
      },
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#dfdff0] py-28"
    >
      {/* Blobs decorativos de fundo */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/4 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="absolute right-1/4 top-2/3 h-80 w-80 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-2xl" />
      </div>

      {/* Cabeçalho */}
      <div className="relative z-10 mb-20 text-center">
        {/* Linha decorativa */}
        <div
          ref={lineRef}
          className="mx-auto mb-6 h-px w-40 origin-center bg-black/20"
        />

        <div ref={titleRef} className="overflow-hidden">
          <h2 className="special-font font-zentry text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-none text-black">
            Gal<b>l</b>ery
          </h2>
        </div>

        <p
          ref={subtitleRef}
          className="mt-3 font-general text-[10px] uppercase tracking-[0.3em] text-black/40"
        >
          Visual chronicles of the world
        </p>
      </div>

      {/* Cards espalhados */}
      <div className="relative mx-auto h-[520px] max-w-6xl px-6">
        {GALLERY.map((item, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
            className="absolute cursor-pointer bg-white p-[10px] pb-10"
            style={{
              ...POSITIONS[i],
              transform: `rotate(${item.rotation}deg)`,
              zIndex: item.z,
              width: "200px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
            }}
          >
            <img
              src={item.src}
              alt={`gallery ${i + 1}`}
              className="h-52 w-full object-cover"
              draggable={false}
            />
            {/* Legenda estilo polaroid */}
            <p className="mt-[10px] text-center font-general text-[9px] uppercase tracking-[0.25em] text-black/50">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Linha decorativa inferior */}
      <div
        className="mx-auto mt-16 h-px w-40 origin-center bg-black/20"
        style={{ transform: "scaleX(1)" }}
      />
    </section>
  );
};

export default Gallery;
