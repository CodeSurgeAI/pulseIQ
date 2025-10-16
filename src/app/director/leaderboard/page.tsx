'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { LeaderboardTable } from '@/components/ui/leaderboard-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { withAuth } from '@/hooks/use-auth';
import { useAlert } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/toast';
import { Trophy, Download, Filter, Calendar, Award, TrendingUp, Target } from 'lucide-react';
import { mockLeaderboard } from '@/utils/mock-data';

function DirectorLeaderboardPage() {
  const { showAlert } = useAlert();
  const { showSuccess } = useToast();
  
  const hospitalLeaderboard = mockLeaderboard;

  // Mock department leaderboard data
  const departmentLeaderboard = [
    {
      rank: 1,
      departmentName: 'Cardiology',
      score: 94.2,
      previousRank: 2,
      location: 'Floor 3, West Wing',
    },
    {
      rank: 2,
      departmentName: 'Emergency',
      score: 91.8,
      previousRank: 1,
      location: 'Ground Floor',
    },
    {
      rank: 3,
      departmentName: 'Pediatrics',
      score: 89.5,
      previousRank: 3,
      location: 'Floor 2, East Wing',
    },
    {
      rank: 4,
      departmentName: 'Surgery',
      score: 87.3,
      previousRank: 5,
      location: 'Floor 4',
    },
    {
      rank: 5,
      departmentName: 'ICU',
      score: 85.9,
      previousRank: 4,
      location: 'Floor 5, North Wing',
    },
  ];

  return (
    <DashboardLayout title="Performance Leaderboard">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hospital Rank</p>
                  <p className="text-3xl font-bold text-blue-600">#3</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Regional ranking</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance Score</p>
                  <p className="text-3xl font-bold text-green-600">91.2</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.3 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Department</p>
                  <p className="text-2xl font-bold text-purple-600">Cardiology</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 mt-2">94.2 performance score</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Export Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter Period
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Leaderboards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Regional Hospital Leaderboard */}
          <LeaderboardTable
            title="Regional Hospital Rankings"
            entries={hospitalLeaderboard}
            sortable={true}
            onRowClick={(entry) => {
              console.log('Hospital details:', entry);
              showAlert({
                type: 'info',
                title: 'Hospital Analytics',
                message: `Viewing detailed analytics for ${entry.hospitalName}`
              });
            }}
          />

          {/* Department Leaderboard */}
          <LeaderboardTable
            title="Department Performance"
            entries={departmentLeaderboard as never[]}
            sortable={true}
            onRowClick={(entry) => {
              console.log('Department details:', entry);
              showAlert({
                type: 'info',
                title: 'Department Analytics',
                message: `Viewing detailed analytics for ${entry.departmentName} Department`
              });
            }}
          />
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>
              Key insights and recommendations based on current rankings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800 bg-green-100 p-2 rounded">
                  Strengths
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Cardiology department leads in patient satisfaction (96%)</li>
                  <li>• Emergency response time improved by 18% this quarter</li>
                  <li>• Overall hospital ranking up 2 positions regionally</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-orange-800 bg-orange-100 p-2 rounded">
                  Improvement Areas
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• ICU readmission rates need attention (current: 8.2%)</li>
                  <li>• Surgery wait times can be optimized further</li>
                  <li>• Staff satisfaction in night shifts requires focus</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(DirectorLeaderboardPage, { requiredRole: 'director' });