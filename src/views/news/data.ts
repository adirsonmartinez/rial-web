export type Category =
  | "Producto"
  | "Comunidad"
  | "Actualización"
  | "Educación"
  | "Empresa";

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  featured?: boolean;
  body: ArticleBlock[];
};

export const ARTICLES: Article[] = [
  {
    slug: "rial-cierra-ronda-semilla",
    title: "Rial cierra su ronda semilla y acelera el lanzamiento regional",
    excerpt:
      "Con el respaldo de Innoven y nuevos socios estratégicos, Rial acelera su expansión por Latinoamérica para acercar la gestión multimoneda a millones de personas.",
    category: "Empresa",
    date: "18 Abr 2026",
    readTime: "6 min",
    author: "Equipo Rial",
    authorRole: "Comunicaciones",
    featured: true,
    body: [
      {
        type: "paragraph",
        text: "Hoy damos un paso importante: cerramos nuestra ronda semilla con la participación de Innoven y un grupo de inversionistas que creen, como nosotros, en una mejor forma de manejar el dinero en Latinoamérica.",
      },
      {
        type: "paragraph",
        text: "La inversión nos permitirá acelerar el lanzamiento en nuevos países, fortalecer el equipo de producto y seguir construyendo las funciones que nuestra comunidad más pide: cuentas multimoneda, metas familiares y automatización de presupuestos.",
      },
      { type: "heading", text: "Qué viene para Rial" },
      {
        type: "list",
        items: [
          "Expansión a tres nuevos mercados en 2026.",
          "Duplicar el equipo de producto e ingeniería.",
          "Nuevas integraciones bancarias locales.",
          "Plantillas de presupuesto adaptadas por país.",
        ],
      },
      {
        type: "quote",
        text: "Queremos que abrir Rial se sienta como tener a tu asesor financiero de confianza en el bolsillo, sin importar en qué moneda vivas.",
        cite: "Fundadores de Rial",
      },
      {
        type: "paragraph",
        text: "Gracias a quienes nos acompañan desde el primer día. Esto apenas empieza.",
      },
    ],
  },
  {
    slug: "cuentas-multimoneda",
    title: "Rial lanza cuentas multimoneda para gestionar bolívares, dólares y euros",
    excerpt:
      "Ahora puedes organizar tu dinero en varias monedas sin salir de la app, con conversiones al cambio real.",
    category: "Producto",
    date: "15 Abr 2026",
    readTime: "4 min",
    author: "Equipo Rial",
    authorRole: "Producto",
    body: [
      {
        type: "paragraph",
        text: "Tu vida financiera ya no ocurre en una sola moneda. Por eso lanzamos las cuentas multimoneda: un espacio dentro de Rial para organizar tus bolívares, dólares y euros con la misma claridad.",
      },
      { type: "heading", text: "Cómo funciona" },
      {
        type: "list",
        items: [
          "Crea una cuenta por cada moneda que uses.",
          "Registra movimientos en la moneda original.",
          "Consulta el total convertido al cambio del día.",
          "Transfiere entre cuentas y deja que Rial calcule la conversión.",
        ],
      },
      {
        type: "paragraph",
        text: "Las cuentas multimoneda están disponibles para todos los usuarios a partir de esta semana. Actualiza tu app y actívalas desde el panel de cuentas.",
      },
    ],
  },
  {
    slug: "40000-usuarios",
    title: "Más de 40,000 usuarios ya confían en Rial para organizar sus finanzas",
    excerpt:
      "Cruzamos un hito importante: miles de personas ya usan Rial a diario para controlar sus gastos e ingresos.",
    category: "Comunidad",
    date: "10 Abr 2026",
    readTime: "3 min",
    author: "Equipo Rial",
    authorRole: "Comunidad",
    body: [
      {
        type: "paragraph",
        text: "Cuando arrancamos Rial, nuestra meta era simple: ayudar a las personas a entender mejor su dinero. Hoy celebramos que más de 40,000 personas usan Rial cada mes.",
      },
      {
        type: "quote",
        text: "Por primera vez siento que sé exactamente cuánto gasto y en qué. Rial me cambió la forma de ver mis finanzas.",
        cite: "Valeria, usuaria desde 2025",
      },
      {
        type: "paragraph",
        text: "Gracias a cada persona que nos ha dado su confianza. Su feedback es lo que hace que Rial mejore cada semana.",
      },
    ],
  },
  {
    slug: "registro-por-voz",
    title: "Nuevo registro por voz: registra tus gastos hablando con Rial",
    excerpt:
      "Abre la app, mantén presionado el botón y di cuánto gastaste. Rial lo categoriza automáticamente.",
    category: "Actualización",
    date: "02 Abr 2026",
    readTime: "5 min",
    author: "Equipo Rial",
    authorRole: "Producto",
    body: [
      {
        type: "paragraph",
        text: "Registrar gastos debería ser tan rápido como pagar. Con el nuevo registro por voz, puedes agregar un movimiento en segundos, sin escribir ni elegir categorías.",
      },
      { type: "heading", text: "Lo que puedes decir" },
      {
        type: "list",
        items: [
          "\"Gasté 15 dólares en el supermercado\".",
          "\"Cobré 200 euros de un freelance\".",
          "\"Pagué 30 bolívares de transporte\".",
        ],
      },
      {
        type: "paragraph",
        text: "Rial detecta el monto, la moneda y la categoría, y te pregunta antes de guardar si algo no está claro.",
      },
    ],
  },
  {
    slug: "primer-presupuesto",
    title: "Cómo armar tu primer presupuesto en 10 minutos",
    excerpt:
      "Una guía paso a paso para definir categorías, metas mensuales y empezar a ahorrar sin complicaciones.",
    category: "Educación",
    date: "28 Mar 2026",
    readTime: "7 min",
    author: "Equipo Rial",
    authorRole: "Educación financiera",
    body: [
      {
        type: "paragraph",
        text: "Armar un presupuesto no tiene que ser complicado. En esta guía corta te mostramos cómo empezar con Rial en menos de lo que dura una película corta.",
      },
      { type: "heading", text: "Paso 1: lista tus ingresos" },
      {
        type: "paragraph",
        text: "Incluye sueldo, freelance, ventas y cualquier ingreso recurrente. Si varía mes a mes, usa un promedio de los últimos tres meses.",
      },
      { type: "heading", text: "Paso 2: define tus categorías" },
      {
        type: "list",
        items: [
          "Vivienda y servicios.",
          "Comida y supermercado.",
          "Transporte.",
          "Ahorros y metas.",
          "Entretenimiento y antojos.",
        ],
      },
      { type: "heading", text: "Paso 3: asigna un monto a cada una" },
      {
        type: "paragraph",
        text: "Rial te sugiere montos según tus movimientos pasados. Puedes ajustarlos en cualquier momento.",
      },
    ],
  },
  {
    slug: "plantillas-presupuesto",
    title: "Plantillas de presupuestos para familias y freelancers",
    excerpt:
      "Empieza en segundos con plantillas diseñadas según tu realidad: hogar, freelance, estudiantes o ahorro.",
    category: "Producto",
    date: "20 Mar 2026",
    readTime: "4 min",
    author: "Equipo Rial",
    authorRole: "Producto",
    body: [
      {
        type: "paragraph",
        text: "Sabemos que no todos vivimos la misma realidad financiera. Por eso diseñamos plantillas de presupuesto pensadas en casos concretos.",
      },
      {
        type: "list",
        items: [
          "Hogar: gastos compartidos, ahorro familiar y metas en conjunto.",
          "Freelance: ingresos variables, apartar impuestos y meses flojos.",
          "Estudiantes: mesada, transporte y ahorro para viajes.",
          "Ahorro agresivo: prioriza metas y reduce gastos opcionales.",
        ],
      },
    ],
  },
  {
    slug: "habitos-ahorradores",
    title: "3 hábitos que aprendimos de nuestros usuarios más ahorradores",
    excerpt:
      "Revisamos los patrones de quienes logran sus metas mes a mes y los resumimos en tres ideas simples.",
    category: "Educación",
    date: "12 Mar 2026",
    readTime: "6 min",
    author: "Equipo Rial",
    authorRole: "Educación financiera",
    body: [
      {
        type: "paragraph",
        text: "Revisamos los datos (siempre anónimos) de quienes logran sus metas de ahorro en Rial y encontramos tres hábitos que se repiten una y otra vez.",
      },
      { type: "heading", text: "1. Registran el mismo día" },
      {
        type: "paragraph",
        text: "No dejan los gastos para el domingo. Registran en el momento o, máximo, el mismo día. Así nada se escapa.",
      },
      { type: "heading", text: "2. Separan el ahorro primero" },
      {
        type: "paragraph",
        text: "Apenas cobran, apartan un porcentaje a su meta. Ahorran lo que queda después de ahorrar, no antes de gastar.",
      },
      { type: "heading", text: "3. Revisan una vez por semana" },
      {
        type: "paragraph",
        text: "Una mirada rápida cada domingo basta para ajustar categorías y prevenir sorpresas de fin de mes.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getFeaturedArticle(): Article {
  const featured = ARTICLES.find((a) => a.featured);
  if (!featured) throw new Error("No featured article configured");
  return featured;
}

export function getListArticles(): Article[] {
  return ARTICLES.filter((a) => !a.featured);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return ARTICLES.slice(0, limit);
  const sameCategory = ARTICLES.filter(
    (a) => a.slug !== slug && a.category === current.category,
  );
  const others = ARTICLES.filter(
    (a) => a.slug !== slug && a.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
