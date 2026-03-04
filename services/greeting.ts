export interface Greeting {
  message: string;
  password: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchGreeting(monthName: string, day: number): Promise<Greeting> {
  const res = await fetch(`${BASE_URL}/api/greetings/${monthName}/${day}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch greeting: ${res.status}`);
  }

  const json = await res.json();
  console.log("Greeting response:", json);

  if (!json?.data || !json.data.message || !json.data.password) {
    return { message: "No greeting found for this day.", password: "" };
  }

  return json.data as Greeting;
}