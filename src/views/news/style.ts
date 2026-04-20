import type { Category } from "./data";

export type ChipColor = "accent" | "danger" | "default" | "success" | "warning";

export function categoryChipColor(category: Category): ChipColor {
  switch (category) {
    case "Producto":
      return "accent";
    case "Comunidad":
      return "success";
    case "Actualización":
      return "warning";
    case "Educación":
    case "Empresa":
      return "default";
  }
}
