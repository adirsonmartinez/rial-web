import Image from "next/image";

const REVIEWS = [
  {
    text: "Por fin una app que entiende cómo manejamos el dinero en Venezuela. Veo mis bolívares, dólares y euros en un solo lugar.",
    author: "María González",
    avatar: "https://i.pravatar.cc/100?img=47",
    time: "hace 6 horas",
  },
  {
    text: "Las metas y presupuestos me cambiaron la rutina. Logré ahorrar para mi próximo viaje mucho antes de lo que pensaba.",
    author: "Carlos Pérez",
    avatar: "https://i.pravatar.cc/100?img=12",
    time: "3 oct, 2025",
  },
  {
    text: "El equipo escucha a sus usuarios. Cada actualización trae justo lo que estaba esperando.",
    author: "Andrea Méndez",
    avatar: "https://i.pravatar.cc/100?img=32",
    time: "hace 2 días",
  },
];

type Review = (typeof REVIEWS)[number];

function Star({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#7CB518">
      <path d="M12 2l2.9 6.9L22 9.7l-5.5 4.7L18 22l-6-3.5L6 22l1.5-7.6L2 9.7l7.1-.8L12 2z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      className="flex w-[280px] shrink-0 flex-col gap-4 rounded-[20px] bg-white p-5"
      style={{ boxShadow: "0 20px 50px -20px rgba(0,0,0,0.35)" }}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={18} />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-[#161616]">{review.text}</p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <Image
          src={review.avatar}
          alt={review.author}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-[#161616]">{review.author}</p>
          <p className="text-xs text-[#666]">{review.time}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 lg:py-16" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative h-[680px] overflow-hidden rounded-[32px] lg:h-[820px]">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1800"
            alt="Persona usando Rial"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-5 p-8 lg:max-w-[55%] lg:p-12">
            <h2 className="font-[family-name:var(--font-sora)] text-[clamp(2.25rem,5.5vw,4.5rem)] font-[800] leading-[1.05] text-white">
              Lo que dice<br />nuestra gente
            </h2>
            <p className="max-w-sm text-sm text-white/85 lg:text-base">
              Miles de venezolanos confían en Rial para organizar sus finanzas día a día.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2">
                <Star size={18} />
                <span className="text-sm font-semibold text-white">Excelente</span>
              </div>
              <span className="text-xs text-white/70">Basado en 2.847 reseñas</span>
            </div>
          </div>

          <div
            className="absolute bottom-12 right-0 hidden lg:block"
            style={{ left: "48%" }}
          >
            <div
              className="flex gap-5 overflow-x-auto pb-4 pr-12"
              style={{ scrollbarWidth: "none" }}
            >
              {REVIEWS.map((r) => (
                <ReviewCard key={r.author} review={r} />
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-6 flex gap-4 overflow-x-auto pb-2 lg:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {REVIEWS.map((r) => (
            <ReviewCard key={r.author} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
