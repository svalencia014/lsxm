import { env } from "$env/dynamic/public";
import type { RequestEvent } from "./$types";
import { getApiSignature } from "$lib/lastfm";
import prisma from "$lib/db";
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/auth/auth";

export async function GET(event: RequestEvent): Promise<Response> {
  const token = event.url.searchParams.get("token");
  if (token === null) {
    return new Response(null, {
      status: 400
    })
  }

  console.log(token);
  const api_sig = await getApiSignature(`methodauth.getSessiontoken${token}`, env.PUBLIC_API_KEY);
  console.log(env.PUBLIC_API_KEY);
  const req = await fetch(`https://ws.audioscrobbler.com/2.0/?method=auth.getSession&token=${token}&api_key=${env.PUBLIC_API_KEY}&api_sig=${api_sig}&format=json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })

  const res: lastFmSessionResponse = await req.json();

  await prisma.user.upsert({
    create: {
      id: res.session.name,
      key: res.session.key
    },
    update: {
      key: res.session.key
    },
    where: {
      id: res.session.name
    }
  })
    
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, res.session.name);
  setSessionTokenCookie(event, sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/"
    }
  });
}

type lastFmSessionResponse = {
  session: {
    name: string;
    key: string;
    subscriber: number;
  }
}