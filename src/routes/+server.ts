export async function POST({ locals, request }) {
	if (locals.session == null) {
		return new Response('Unauthorized', { status: 401 });
	}

	console.log('Request received');

	const { station, start, end } = await request.json();

  if (station == null || start == null || end == null) {
    return new Response('Bad Request', { status: 400 });
  }

	const stationReq = await fetch('https://xmplaylist.com/api/station');
	const stations: Stations = await stationReq.json();

	const stationData = stations.results.find((s) => s.number == station);

  console.log(end);

	let songs = [];

	let songReq = await fetch(`https://xmplaylist.com/api/station/${stationData.deeplink}?last=${new Date(end).getTime()}`);
	let songRes: Songs = await songReq.json();
	
  console.log(songRes.results.at(-1));


	return new Response('Success', { status: 200 });
}

type Stations = {
	count: number;
	next: string | null;
	previous: string | null;
	results: Station[];
};

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
};

type Songs = {
	count: number;
	next: string | null;
	previous: string | null;
	results: Song[];
	channel: Station;
	error: string | undefined;
};

type Song = {
	id: string;
	timestamp: string;
	track: {
		id: string;
		title: string;
		artists: string[];
	};
	spotify: {
		id: string;
		albumImageLarge: string;
		albumImageMedium: string;
		albumImageSmall: string;
		previewUrl: string;
	};
};
