import type { RequestEvent } from "./$types";

export async function GET(event: RequestEvent): Promise<Response> {
  const token = event.url.searchParams.get("token");
  if (token === null) {
    return new Response(null, {
      status: 400
    })
  }

  console.log(token);
}