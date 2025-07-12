import { NextResponse } from 'next/server';

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';

export async function GET(request: Request) {
  // Pastikan kunci API tersedia
  if (!API_FOOTBALL_KEY) {
    console.error('API_FOOTBALL_KEY not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error: API key missing.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get('league');
  const season = searchParams.get('season');

  if (!leagueId || !season) {
    console.error('Missing parameters for standings API:', { leagueId, season });
    return NextResponse.json({ error: 'Parameter league dan season wajib diisi.' }, { status: 400 });
  }

  try {
    // --- DEBUGGING: Log permintaan sebelum fetch ---
    console.log(`Attempting to fetch standings for league ${leagueId}, season ${season} from API-Football.`);
    console.log(`API URL: ${API_FOOTBALL_BASE_URL}/standings?league=${leagueId}&season=${season}`);
    // --- END DEBUGGING ---

    // Menambahkan AbortController untuk timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout setelah 10 detik

    const response = await fetch(`${API_FOOTBALL_BASE_URL}/standings?league=${leagueId}&season=${season}`, {
      headers: {
        'x-rapidapi-key': API_FOOTBALL_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      },
      cache: 'no-store',
      signal: controller.signal // Menggunakan signal dari AbortController
    });

    clearTimeout(timeoutId); // Hapus timeout jika permintaan berhasil sebelum waktu habis

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching standings from API-Football: Status ${response.status} - Response: ${errorText}`);
      return NextResponse.json({ error: `Gagal memuat klasemen dari API eksternal: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
        console.error('API-Football returned errors:', data.errors);
        return NextResponse.json({ error: `API-Football Error: ${JSON.stringify(data.errors)}` }, { status: 500 });
    }
    
    if (!data.response || data.response.length === 0 || !data.response[0].league || !data.response[0].league.standings) {
        console.warn('API-Football response is empty or malformed for standings:', data);
        return NextResponse.json({ error: 'Data klasemen tidak ditemukan atau format respons tidak sesuai.' }, { status: 404 });
    }

    // --- DEBUGGING: Log data yang berhasil diambil ---
    console.log('Successfully fetched standings data from API-Football.');
    // --- END DEBUGGING ---

    return NextResponse.json(data);

  } catch (error: any) {
    // Menangani error AbortController (timeout)
    if (error.name === 'AbortError') {
      console.error('Request to API-Football timed out:', error);
      return NextResponse.json({ error: 'Permintaan ke API-Football melebihi batas waktu (timeout).' }, { status: 504 });
    }
    console.error('Server error while fetching standings:', error);
    return NextResponse.json({ error: `Gagal memuat klasemen: ${error.message || 'Kesalahan tidak diketahui'}` }, { status: 500 });
  }
}
