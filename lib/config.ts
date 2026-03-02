export enum ConfigCategory {
  MARCH22_VIEWED = "MARCH22_VIEWED",
  MARCH25_VIEWED = "MARCH25_VIEWED",
  JANFEB_UNLOCKED = "JANFEB_UNLOCKED",
}

export interface ConfigState {
  [key: string]: boolean;
}


export async function getConfig(category: ConfigCategory): Promise<boolean> {
  const res = await fetch(`/api/config/${category}`);
  if (!res.ok) throw new Error(`Failed to fetch config ${category}`);
  const data = await res.json();
  return data?.data?.value ?? false;
}


export async function updateConfig(category: ConfigCategory, value: boolean): Promise<boolean> {
  const res = await fetch(`/api/config/${category}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(`Failed to update config ${category}`);
  const data = await res.json();
  return data?.data?.value ?? value;
}