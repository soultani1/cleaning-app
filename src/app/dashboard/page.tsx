"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target, 
  TrendingUp, 
  Star, 
  Award, 
  Flame,
  BarChart3,
  Home,
  Users
} from 'lucide-react';

// Mock data - later we'll fetch from Supabase
const mockStats = {
  todayTasks: { completed: 5, total: 8 },
  weekTasks: { completed: 23, total: 35 },
  monthTasks: { completed: 78, total: 120 },
  streak: 7,
  badges: [
    { id: 1, title: "Clean Starter", description: "Completed your first task", icon: "🌟", earned: true },
    { id: 2, title: "Week Warrior", description: "7 days cleaning streak", icon: "🔥", earned: true },
    { id: 3, title: "Kitchen Master", description: "Completed 50 kitchen tasks", icon: "🍽️", earned: true },
    { id: 4, title: "Monthly Hero", description: "100% monthly completion", icon: "🏆", earned: false },
  ],
  recentActivity: [
    { task: "Clean kitchen counters", completed: "2 hours ago" },
    { task: "Vacuum living room", completed: "4 hours ago" },
    { task: "Organize closet", completed: "Yesterday" },
  ],
  weeklyProgress: [
    { day: "Mon", completed: 6, total: 8 },
    { day: "Tue", completed: 5, total: 7 },
    { day: "Wed", completed: 8, total: 8 },
    { day: "Thu", completed: 4, total: 6 },
    { day: "Fri", completed: 7, total: 9 },
    { day: "Sat", completed: 3, total: 5 },
    { day: "Sun", completed: 2, total: 4 }
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Mock user - we'll replace this later with real auth
  const mockUser = { email: "user@example.com" };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {mockUser.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Here's your cleaning journey overview
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Progress */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.todayTasks.completed}/{mockStats.todayTasks.total}
              </div>
              <Progress 
                value={(mockStats.todayTasks.completed / mockStats.todayTasks.total) * 100} 
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((mockStats.todayTasks.completed / mockStats.todayTasks.total) * 100)}% complete
              </p>
            </CardContent>
          </Card>

          {/* Week Progress */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.weekTasks.completed}/{mockStats.weekTasks.total}
              </div>
              <Progress 
                value={(mockStats.weekTasks.completed / mockStats.weekTasks.total) * 100} 
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((mockStats.weekTasks.completed / mockStats.weekTasks.total) * 100)}% complete
              </p>
            </CardContent>
          </Card>

          {/* Streak Counter */}
          <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Fire Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.streak} Days</div>
              <p className="text-xs text-orange-100 mt-2">Keep it burning! 🔥</p>
            </CardContent>
          </Card>

          {/* Monthly Stats */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.monthTasks.completed}/{mockStats.monthTasks.total}
              </div>
              <Progress 
                value={(mockStats.monthTasks.completed / mockStats.monthTasks.total) * 100} 
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((mockStats.monthTasks.completed / mockStats.monthTasks.total) * 100)}% complete
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Progress Chart */}
          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Weekly Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStats.weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1">
                      <Progress value={(day.completed / day.total) * 100} className="h-3" />
                    </div>
                    <div className="text-sm text-gray-500 w-12">
                      {day.completed}/{day.total}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span>Your Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockStats.badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      badge.earned 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className={`font-medium ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {badge.title}
                      </div>
                      <div className={`text-xs ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {badge.description}
                      </div>
                    </div>
                    {badge.earned && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Earned</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.task}</div>
                    <div className="text-sm text-gray-500">{activity.completed}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push('/')}>
            <CardContent className="p-6 text-center">
              <Home className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Start Cleaning</h3>
              <p className="text-sm text-blue-100">Go to your cleaning plan</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push('/blog')}>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Read Tips</h3>
              <p className="text-sm text-green-100">Discover cleaning tips</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Invite Family</h3>
              <p className="text-sm text-purple-100">Share your plan</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}