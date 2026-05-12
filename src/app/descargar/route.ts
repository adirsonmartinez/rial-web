import { redirect } from "next/navigation";
import { headers } from "next/headers";

const APP_STORE_URL =
  "https://apps.apple.com/us/app/rial-finanzas-personales/id6755372307";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.adimtnez.rial&hl=en";

export async function GET() {
  const userAgent = (await headers()).get("user-agent") ?? "";

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    redirect(APP_STORE_URL);
  }

  if (/Android/i.test(userAgent)) {
    redirect(PLAY_STORE_URL);
  }

  redirect("/#descargar");
}
