    "use client";

    import React, { useState, useEffect } from 'react';
    import { fetchLeagueStandings } from '@/lib/api';
    import { League, Standing } from '@/app/types';
    import { RiTableLine, RiLoader4Line, RiTeamFill, RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';

    interface LeagueStandingsProps {
      showMessage: (msg: string, type: 'success' | 'error') => void;
    }

    const LeagueStandings: React.FC<LeagueStandingsProps> = ({ showMessage }) => {
      const [standings, setStandings] = useState<Standing[]>([]);
      const [leagueInfo, setLeagueInfo] = useState<League | null>(null);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);

      // PERBAIKAN: Ubah SEASON_YEAR ke tahun yang memiliki data valid (misal 2023)
      const LEAGUE_ID = 140; // Premier League
      const SEASON_YEAR = 2023; // Contoh: Ubah ke 2023 jika 2024 belum ada data

      useEffect(() => {
        const loadStandings = async () => {
          setLoading(true);
          setError(null);
          try {
            const data = await fetchLeagueStandings(LEAGUE_ID, SEASON_YEAR);
            setLeagueInfo(data);
            if (data.standings && data.standings.length > 0) {
              setStandings(data.standings[0]);
            } else {
              setStandings([]);
              showMessage('Data klasemen tidak ditemukan untuk liga ini.', 'error');
            }
          } catch (err: any) {
            console.error('Failed to fetch league standings:', err);
            setError(err.message || 'Gagal memuat klasemen liga.');
            showMessage(err.message || 'Gagal memuat klasemen liga.', 'error');
          } finally {
            setLoading(false);
          }
        };

        loadStandings();
      }, [LEAGUE_ID, SEASON_YEAR, showMessage]);

      if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <RiLoader4Line className="animate-spin text-4xl text-blue-600" />
            <p className="text-gray-700 ml-3">Memuat klasemen liga...</p>
          </div>
        );
      }

      if (error) {
        return (
          <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200 text-red-700">
            <p className="font-semibold">Error: {error}</p>
            <p className="text-sm mt-2">Pastikan API_FOOTBALL_KEY Anda benar dan Anda memiliki koneksi internet.</p>
          </div>
        );
      }

      if (standings.length === 0) {
        return (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
            <RiTableLine className="mx-auto text-4xl mb-3" />
            <p>Tidak ada data klasemen yang tersedia untuk liga ini.</p>
          </div>
        );
      }

      return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h3 className="text-2xl font-bold flex items-center">
              <RiTableLine className="mr-3" />
              Klasemen Liga {leagueInfo?.name} ({leagueInfo?.season})
            </h3>
            <p className="text-blue-100 mt-1">Data klasemen terbaru dari API-Football</p>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">K</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {standings.map((teamStanding) => (
                  <tr key={teamStanding.team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <span>{teamStanding.rank}</span>
                        {teamStanding.status === 'up' && <RiArrowUpSLine className="text-green-500 ml-1" />}
                        {teamStanding.status === 'down' && <RiArrowDownSLine className="text-red-500 ml-1" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {teamStanding.team.logo && (
                          <img
                            src={teamStanding.team.logo}
                            alt={`${teamStanding.team.name} Logo`}
                            className="w-6 h-6 mr-3 object-contain"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/24x24/cccccc/white?text=Logo')}
                          />
                        )}
                        <span>{teamStanding.team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.all.played}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.all.win}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.all.draw}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.all.lose}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.all.goals.for}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.all.goals.against}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.goalsDiff}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{teamStanding.points}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teamStanding.form}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    export default LeagueStandings;
    