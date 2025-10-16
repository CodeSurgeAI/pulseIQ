'use client';

import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, Eye, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/utils';
import { LeaderboardEntry } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  title?: string;
  className?: string;
  sortable?: boolean;
  onRowClick?: (entry: LeaderboardEntry) => void;
}

type SortKey = 'rank' | 'name' | 'score' | 'previousRank';
type SortOrder = 'asc' | 'desc';

export function LeaderboardTable({ 
  entries, 
  title = "Leaderboard", 
  className,
  sortable = true,
  onRowClick
}: LeaderboardTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleSort = (key: SortKey) => {
    if (!sortable) return;
    
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedEntries = sortable ? [...entries].sort((a, b) => {
    let aValue: string | number, bValue: string | number;
    
    switch (sortKey) {
      case 'rank':
        aValue = a.rank;
        bValue = b.rank;
        break;
      case 'name':
        aValue = (a.hospitalName || a.departmentName || '').toLowerCase();
        bValue = (b.hospitalName || b.departmentName || '').toLowerCase();
        break;
      case 'score':
        aValue = a.score;
        bValue = b.score;
        break;
      case 'previousRank':
        aValue = a.previousRank || 999;
        bValue = b.previousRank || 999;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  }) : entries;

  const handleRowClick = (entry: LeaderboardEntry) => {
    if (onRowClick) {
      onRowClick(entry);
    } else {
      setSelectedEntry(entry);
      setShowDetailModal(true);
    }
  };

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

  const getSortIcon = (key: SortKey) => {
    if (!sortable || sortKey !== key) return <ArrowUpDown className="h-3 w-3 text-gray-300" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-3 w-3 text-gray-600" /> : 
      <ChevronDown className="h-3 w-3 text-gray-600" />;
  };

  return (
    <>
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
                  <th 
                    className={cn(
                      "text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider",
                      sortable && "cursor-pointer hover:bg-gray-50 select-none"
                    )}
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Rank</span>
                      {getSortIcon('rank')}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider",
                      sortable && "cursor-pointer hover:bg-gray-50 select-none"
                    )}
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{entries[0]?.departmentName ? 'Department' : 'Hospital'}</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "text-center py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider",
                      sortable && "cursor-pointer hover:bg-gray-50 select-none"
                    )}
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Score</span>
                      {getSortIcon('score')}
                    </div>
                  </th>
                  <th 
                    className={cn(
                      "text-center py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider",
                      sortable && "cursor-pointer hover:bg-gray-50 select-none"
                    )}
                    onClick={() => handleSort('previousRank')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Change</span>
                      {getSortIcon('previousRank')}
                    </div>
                  </th>
                  <th className="text-center py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedEntries.map((entry, index) => {
                  const rankChange = getRankChange(entry);
                  const RankIcon = rankChange?.icon;
                  
                  return (
                    <tr 
                      key={entry.hospitalName || entry.departmentName || `entry-${index}`}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(entry)}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <span className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                            getRankBadge(entry.rank)
                          )}>
                            {entry.rank}
                          </span>
                        </div>
                      </td>

                      {/* Name/Department */}
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {entry.hospitalName || entry.departmentName}
                            </div>
                            {entry.location && (
                              <div className="text-sm text-gray-500">
                                {entry.location}
                              </div>
                            )}
                          </div>
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

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(entry);
                          }}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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

      {/* Detail Modal */}
      {selectedEntry && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title={`${selectedEntry.hospitalName || selectedEntry.departmentName} Details`}
          description="Detailed performance analysis and metrics"
          size="lg"
        >
          <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Current Rank</div>
                <div className="text-3xl font-bold text-gray-900">#{selectedEntry.rank}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">Performance Score</div>
                <div className="text-3xl font-bold text-blue-600">{selectedEntry.score.toFixed(1)}/100</div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analysis</h3>
              <div className="space-y-3">
                {selectedEntry.previousRank && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">Rank Change</span>
                    <span className={cn(
                      "text-sm font-semibold",
                      getRankChange(selectedEntry)?.color
                    )}>
                      {getRankChange(selectedEntry)?.text}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Performance Level</span>
                  <span className="text-sm font-semibold">
                    {selectedEntry.score >= 90 ? 'Excellent' :
                     selectedEntry.score >= 80 ? 'Good' :
                     selectedEntry.score >= 70 ? 'Average' : 'Needs Improvement'}
                  </span>
                </div>

                {selectedEntry.location && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Location</span>
                    <span className="text-sm">{selectedEntry.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowDetailModal(false);
                alert('Performance report will be generated and downloaded.');
              }}>
                Generate Report
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}