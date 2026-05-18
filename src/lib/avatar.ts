export type LoreleiAvatarOptions = {
  eyes?: string | null;
  hair?: string | null;
  head?: string | null;
  nose?: string | null;
  mouth?: string | null;
  glasses?: string | null;
  earrings?: string | null;
  eyebrows?: string | null;
  hairAccessories?: string | null;
  facialHair?: string | null;
  freckles?: string | null;
  beard?: string | null;
};

const DICEBEAR_LORELEI_BASE = "https://api.dicebear.com/9.x/lorelei/svg";
export const AVATAR_BG_HEX = "E8EED4";
export const AVATAR_BG_CSS = `#${AVATAR_BG_HEX}`;

export function buildLoreleiUrl(
  options: LoreleiAvatarOptions | null | undefined,
): string | null {
  if (!options) return null;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    if (value === null || value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  if ([...params.keys()].length === 0) return null;
  params.set("backgroundColor", AVATAR_BG_HEX);
  return `${DICEBEAR_LORELEI_BASE}?${params.toString()}`;
}

export function resolveAvatarSrc(
  avatarUrl: string | null | undefined,
  options: LoreleiAvatarOptions | null | undefined,
): string | null {
  if (avatarUrl && avatarUrl.length > 0) return avatarUrl;
  return buildLoreleiUrl(options);
}
