export async function POST({ locals, request }) {
  if (locals.session == null) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { station, start, end } = await request.json();

  const stationReq = await fetch('https://xmplaylist.com/api/station');
  const stations: Stations = await stationReq.json();

  const stationData = stations.results.find((s) => s.number == station);

  let songs = [];

  let songReq = await fetch(`https://xmplaylist.com/api/station/${stationData.deeplink}`);
  let songRes: Songs = await songReq.json();
  const songData: Song[] = []

  while(new Date(songRes.results.at(-1)!.timestamp) > new Date(start)) {
    songReq = await fetch(songRes.next!);
    songRes = await songReq.json();
  }

  while (new Date(songRes.results.at(-1)!.timestamp) > new Date(end)) {
    songData.push(...songRes.results);
    songReq = await fetch(songRes.next!);
    songRes = await songReq.json();
  }

  songData.push(...songRes.results)

  console.log(songData);

  return new Response('Success', { status: 200 });
}

type Stations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Station[];
}

type Station = {
  id: string;
  name: string;
  number: string;
  deeplink: string;
  isVisible: boolean;
  genres: string[];
  shortDescription: string;
  longDescription: string;
  logoUrl: string;
  spotifyPlaylist: string;
  applePlaylist: string;
}

type Songs = {
  count: number,
  next: string | null,
  previous: string | null,
  results: Song[];
  channel: Station;
}

type Song = {
  id: string;
  timestamp: string;
  track: {
    id: string;
    title: string;
    artists: string[];
  },
  spotify: {
    id: string;
    albumImageLarge: string;
    albumImageMedium: string;
    albumImageSmall: string;
    previewUrl: string;
  }
}