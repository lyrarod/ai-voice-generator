//...
export async function POST(req: Request) {
  const { text, voice_id } = await req.json();

  if (!text.trim() || !voice_id) return;

  const apiKey = process.env.ELEVENLABS_API_KEY! || "";
  const endpoint = process.env.ELEVENLABS_ENDPOINT_GENERATE! || "";

  const url = `${endpoint}/${voice_id}`;
  const model_id = "eleven_multilingual_v2";

  const options = {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id,
      use_speaker_boost: true,
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    }),
  };

  try {
    const response = await fetch(url, options);
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
      status: 200,
    });

    //...
  } catch (error) {
    console.log({ Error: error });
    throw new Error("Failed to fetch api: generate");
  }
}
