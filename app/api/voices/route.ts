//..
export async function GET() {
  const apiKey: string = process.env.ELEVENLABS_API_KEY! || "";
  const endpoint: string = process.env.ELEVENLABS_ENDPOINT_VOICES! || "";

  const options: {} = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
  };

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    throw new Error("Failed to fetch api: voices");
  }

  const data = await res.json();

  return Response.json(data, {
    status: 200,
  });
}
