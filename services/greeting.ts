export interface Greeting {
  message: string;
  password: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchGreeting(monthName: string, day: number): Promise<Greeting> {
  const res = await fetch(`${BASE_URL}/api/greetings/${monthName}/${day}`);
  if (!res.ok) {
    throw new Error(`Greeting not found for ${monthName} ${day}`);
  }

  const json = await res.json();
  if (!json?.data) {
    throw new Error(`Invalid response from server`);
  }

  return json.data as Greeting;
}