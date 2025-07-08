"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, BarChart3, Flame, Target, Star, Award,
  Clock, CheckCircle2, Home, Users
} from "lucide-react";

// Supabase Client
import { supabase } from "@/lib/supabaseClient";

// (Ago)
function timeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return "Yesterday";
  return past.toLocaleDateString();
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  //  Hydration
  useEffect(() => setIsClient(true), []);
  useEffect(() => {
    if (isClient && !loading && !user) router.replace("/");
  }, [isClient, user, loading, router]);

  //
  useEffect(() => {
    if (!user) return;
    setTasksLoading(true);
    supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (data) setTasks(data);
        setTasksLoading(false);
      });
  }, [user]);

  // Categorize tasks by day/week/month
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday The beginning of the week
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const todayTasks = tasks.filter(t => new Date(t.created_at) >= today);
  const weekTasks = tasks.filter(t => new Date(t.created_at) >= weekStart);
  const monthTasks = tasks.filter(t => new Date(t.created_at) >= monthStart);

  // streak (Daily Achievement Series)
  const calcStreak = (allTasks: any[]) => {
    if (allTasks.length === 0) return 0;
    let streak = 0;
    let prevDay = new Date();
    prevDay.setHours(0,0,0,0);
    for (let i = 0; i < 30; i++) {
      const checkDay = new Date(prevDay);
      checkDay.setDate(prevDay.getDate() - i);
      const done = allTasks.some(t => {
        const d = new Date(t.completed_at || t.updated_at || t.created_at);
        return d.toDateString() === checkDay.toDateString() && t.is_completed;
      });
      if (done) streak++;
      else break;
    }
    return streak;
  };

  const streak = useMemo(() => calcStreak(tasks), [tasks]);

  // badges (model only, improve it according to your logic)Real
  const badges = [
    {
      id: 1, title: "Clean Starter", description: "Completed your first task", icon: "🌟",
      earned: tasks.some(t => t.is_completed)
    },
    {
      id: 2, title: "Week Warrior", description: "7 days cleaning streak", icon: "🔥",
      earned: streak >= 7
    },
    {
      id: 3, title: "Kitchen Master", description: "Completed 50 kitchen tasks", icon: "🍽️",
      earned: tasks.filter(t => t.is_completed && t.task_name?.toLowerCase().includes("kitchen")).length >= 50
    },
    {
      id: 4, title: "Monthly Hero", description: "100% monthly completion", icon: "🏆",
      earned: monthTasks.length > 0 && monthTasks.every(t => t.is_completed)
    }
  ];

  // Recent activity (last 5 completed tasks)
  const recentActivity = tasks
    .filter(t => t.is_completed)
    .sort((a, b) => (new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()))
    .slice(0, 5)
    .map(t => ({
      task: t.task_name,
      completed: timeAgo(t.updated_at || t.created_at)
    }));

  // Weekly Progress Chart (daily for the current week)
  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const weeklyProgress = daysOfWeek.map((day, idx) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + idx);
    const all = tasks.filter(t => new Date(t.created_at).toDateString() === d.toDateString());
    const completed = all.filter(t => t.is_completed);
    return {
      day,
      completed: completed.length,
      total: all.length
    };
  });

  //// When loading: :
  if (!isClient || loading || !user || tasksLoading) {
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
            Welcome back, {user.email?.split("@")[0]}! 👋
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
                {todayTasks.filter(t => t.is_completed).length}/{todayTasks.length}
              </div>
              <Progress
                value={todayTasks.length ? (todayTasks.filter(t => t.is_completed).length / todayTasks.length) * 100 : 0}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {todayTasks.length ? Math.round((todayTasks.filter(t => t.is_completed).length / todayTasks.length) * 100) : 0}% complete
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
                {weekTasks.filter(t => t.is_completed).length}/{weekTasks.length}
              </div>
              <Progress
                value={weekTasks.length ? (weekTasks.filter(t => t.is_completed).length / weekTasks.length) * 100 : 0}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {weekTasks.length ? Math.round((weekTasks.filter(t => t.is_completed).length / weekTasks.length) * 100) : 0}% complete
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
              <div className="text-2xl font-bold">{streak} Days</div>
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
                {monthTasks.filter(t => t.is_completed).length}/{monthTasks.length}
              </div>
              <Progress
                value={monthTasks.length ? (monthTasks.filter(t => t.is_completed).length / monthTasks.length) * 100 : 0}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {monthTasks.length ? Math.round((monthTasks.filter(t => t.is_completed).length / monthTasks.length) * 100) : 0}% complete
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Progress Chart */}
          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-600" />
                <span>Weekly Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1">
                      <Progress value={day.total ? (day.completed / day.total) * 100 : 0} className="h-3" />
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
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${badge.earned
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className={`font-medium ${badge.earned ? "text-gray-900" : "text-gray-500"}`}>
                        {badge.title}
                      </div>
                      <div className={`text-xs ${badge.earned ? "text-gray-600" : "text-gray-400"}`}>
                        {badge.description}
                      </div>
                    </div>
                    {badge.earned && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Earned
                      </Badge>
                    )}
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
              {recentActivity.length === 0 ? (
                <div className="text-center text-gray-400 py-8">No activity yet.</div>
              ) : recentActivity.map((activity, index) => (
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
          <Card
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push("/")}
          >
            <CardContent className="p-6 text-center">
              <Home className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Start Cleaning</h3>
              <p className="text-sm text-blue-100">Go to your cleaning plan</p>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push("/blog")}
          >
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
