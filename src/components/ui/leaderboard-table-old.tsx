'use client';

import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils';
import { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title?: string;
  className?: string;
}

export function LeaderboardTable({ entries, title = "Leaderboard", className }: LeaderboardTableProps) {
  const getRankChange = (entry: LeaderboardEntry) => {
    if (!entry.previousRank) return null;
    const change = entry.previousRank - entry.rank;
    if (change === 0) return { icon: Minus, color: 'text-gray-400', text: 'No change' };
    if (change > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${change}` };
    return { icon: TrendingDown, color: 'text-red-600', text: `${change}` };
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800';
    if (rank === 2) return 'bg-gray-100 text-gray-800';
    if (rank === 3) return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {entries[0]?.departmentName ? 'Department' : 'Hospital'}
                </th>
                <th className="text-center py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-center py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => {
                const rankChange = getRankChange(entry);
                const RankIcon = rankChange?.icon;
                
                return (
                  <tr 
                    key={entry.hospitalId + (entry.departmentId || '')} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Rank */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span
                          className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                            getRankBadge(entry.rank)
                          )}
                        >
                          {entry.rank}
                        </span>
                        {entry.rank <= 3 && (
                          <Trophy 
                            className={cn(
                              "h-4 w-4",
                              entry.rank === 1 && "text-yellow-500",
                              entry.rank === 2 && "text-gray-500",
                              entry.rank === 3 && "text-orange-500"
                            )}
                          />
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {entry.departmentName || entry.hospitalName}
                        </span>
                        {entry.departmentName && (
                          <span className="text-sm text-gray-500">
                            {entry.hospitalName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {entry.score.toFixed(1)}
                        </span>
                        <div className="flex space-x-1 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-2 h-2 rounded-full",
                                i < Math.round(entry.score / 20) 
                                  ? "bg-blue-500" 
                                  : "bg-gray-200"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Change */}
                    <td className="py-4 px-6 text-center">
                      {RankIcon && rankChange ? (
                        <div className={cn("flex items-center justify-center space-x-1", rankChange.color)}>
                          <RankIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {rankChange.text}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">New</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {entries.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No leaderboard data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}