"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/context/AuthContext';
import AuthButton from '@/components/AuthButton';
import { Home, PawPrint, ArrowRight, Plus, Clock, Calendar, Star, CheckCircle2, Circle, Trash2, ArrowLeft, Sparkles, Timer } from 'lucide-react';

const TaskTimer = dynamic(() => import('@/components/task-timer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-sm text-gray-600">Loading timer...</span>
    </div>
  )
});

type Task = {
  id: number;
  created_at: string;
  task_name: string;
  is_completed: boolean;
  frequency: string; 
  home_size: string;
  has_pets: string;
  user_id?: string | null;
};

const TaskItem = ({ task, onToggle, onDelete }: { task: Task, onToggle: (id: number, status: boolean) => void, onDelete: (id: number) => void }) => {
  const [showTimer, setShowTimer] = useState(false);

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'daily': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'weekly': return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'monthly': return <Star className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'daily': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'weekly': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'monthly': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTimerComplete = () => {
    if (!task.is_completed) {
      onToggle(task.id, task.is_completed);
    }
    setShowTimer(false);
  };

  return (
    <div className="space-y-4">
      <div className={`bg-white rounded-xl border ${task.is_completed ? 'border-gray-200 bg-gray-50' : 'border-gray-200'} hover:shadow-md transition-all duration-300 group`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              <div className="mt-0.5 cursor-pointer" onClick={() => onToggle(task.id, task.is_completed)}>
                {task.is_completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 transition-colors hover:text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 transition-colors hover:text-gray-600" />
                )}
              </div>
              <div className="flex-1">
                <label className={`font-medium cursor-pointer transition-all block ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.task_name}
                </label>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    {getFrequencyIcon(task.frequency)}
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getFrequencyColor(task.frequency)}`}>
                      {task.frequency}
                    </span>
                  </div>
                  {!task.is_completed && (
                    <button
                      onClick={() => setShowTimer(!showTimer)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        showTimer 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      <Timer size={12} />
                      <span>{showTimer ? 'Hide Timer' : 'Start Timer'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 h-8 w-8">
              <Trash2 size={16} className="text-red-500" />
            </Button>
          </div>
        </div>
      </div>
      {showTimer && !task.is_completed && (
        <div className="ml-6 animate-in slide-in-from-top-4 duration-300 ease-out">
          <TaskTimer 
            taskName={task.task_name}
            onComplete={handleTimerComplete}
            className="max-w-sm mx-auto shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

const CleaningPlanPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  
  const [currentScreen, setCurrentScreen] = useState<'selection' | 'summary'>('selection');
  const [homeSize, setHomeSize] = useState('');
  const [hasPets, setHasPets] = useState('');
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [displayedTasks, setDisplayedTasks] = useState<{ daily: Task[], weekly: Task[], monthly: Task[] }>({ daily: [], weekly: [], monthly: [] });
  const [loading, setLoading] = useState(true);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskFrequency, setNewTaskFrequency] = useState('Daily');
  const [newlyAddedTaskId, setNewlyAddedTaskId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  //filteredTasks :
  const getFilteredTasks = (tasks: Task[]) => {
  if (filter === 'completed') return tasks.filter(t => t.is_completed);
  if (filter === 'active') return tasks.filter(t => !t.is_completed);
  return tasks;
};

 

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      let query = supabase.from('tasks').select('*');
      if (user) {
        query = query.or(`user_id.eq.${user.id},user_id.is.null`);
      } else {
        query = query.is('user_id', null);
      }
      const { data, error } = await query.order('id');
      if (error) console.error("Error fetching tasks:", error);
      else if (data) setAllTasks(data as Task[]);
      setLoading(false);
    };
    fetchTasks();
  }, [user]);

  const handleNext = (isRefilter = false) => {
    if (!isRefilter && (!homeSize || !hasPets)) {
      toast.error("Please make both selections.");
      return;
    }
    const filtered = allTasks.filter(task => 
      (task.home_size === "All" || task.home_size === homeSize) &&
      (task.has_pets === "All" || task.has_pets === hasPets)
    );
    const grouped = { daily: [], weekly: [], monthly: [] };
    for (const task of filtered) {
        const category = task.frequency.toLowerCase() as keyof typeof grouped;
        if (grouped.hasOwnProperty(category)) grouped[category].push(task);
    }
    setDisplayedTasks(grouped);
    if (!isRefilter) setCurrentScreen('summary');
  };

  useEffect(() => {
    if(currentScreen === 'summary') {
      handleNext(true);
    }
  }, [allTasks]);

  const handleBack = () => {
    setCurrentScreen('selection');
  };

 const deleteTask = async (taskId: number) => {
  // Show toast confirmation BEFORE actually deleting!
  toast(
    "Are you sure you want to delete this task?",
    {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          const originalTasks = [...allTasks];
          setAllTasks(prev => prev.filter(t => t.id !== taskId));
          const { error } = await supabase.from('tasks').delete().eq('id', taskId);
          if (error) {
            setAllTasks(originalTasks);
            toast.error("Failed to delete the task.");
          } else {
            toast.success("Task deleted successfully!");
          }
        },
      
      },
      cancel: {
        label: "Cancel",
      },
      
    }
  );
};


  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setAllTasks(prev => prev.map(t => (t.id === taskId ? { ...t, is_completed: newStatus } : t)));
    const { error } = await supabase.from('tasks').update({ is_completed: newStatus }).eq('id', taskId);
    if (error) {
      console.error("Error updating task:", error.message);
      setAllTasks(prev => prev.map(t => (t.id === taskId ? { ...t, is_completed: currentStatus } : t)));
      toast.error("Failed to update the task.");
    } else {
      if (newStatus) {
        toast.success("Task completed! 🎉");
      } else {
        toast("Task marked as not completed.");
      }
    }
  };

  const addTask = async () => {
    if (!newTaskName.trim()) return;
    if (!user) {
      toast(
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            Create a free account to save your tasks permanently!
          </div>
          <div className="text-gray-600 dark:text-gray-300 mt-1">
            Sign up to access all features and save your cleaning plan.
          </div>
        </div>,
        {
          action: {
            label: "Sign Up",
            onClick: () => router.push('/signup'),
          },
          cancel: {
            label: "Cancel",
          },
        }
      );
      return;
    }
    const newTaskForDb = { 
      task_name: newTaskName.trim(), 
      frequency: newTaskFrequency, 
      home_size: 'All', 
      has_pets: 'All', 
      is_completed: false, 
      user_id: user.id 
    };
    const { data: newDbTask, error } = await supabase.from('tasks').insert(newTaskForDb).select().single();
    if (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add the task.");
    } else if (newDbTask) {
      setAllTasks(prev => [...prev, newDbTask as Task]);
      setNewTaskName('');
      setNewlyAddedTaskId(newDbTask.id);
      toast.success("Task added successfully!");
      setTimeout(() => setNewlyAddedTaskId(null), 900);
    }
  };

  const stats = useMemo(() => {
    const allDisplayed = [...displayedTasks.daily, ...displayedTasks.weekly, ...displayedTasks.monthly];
    const completed = allDisplayed.filter(task => task.is_completed).length;
    const total = allDisplayed.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [displayedTasks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'selection' ? (
        <main className="flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Let's Get Started</h1>
              <p className="text-gray-600">Tell us about your home to create your perfect cleaning plan.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"><Home className="w-4 h-4" />What size is your home?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button key={size} onClick={() => setHomeSize(size)} className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${homeSize === size ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>{size}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4"><PawPrint className="w-4 h-4" />Do you have pets?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'Yes', label: 'Yes, I do' }, { value: 'No', label: 'No pets' }].map((option) => (
                    <button key={option.value} onClick={() => setHasPets(option.value)} className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${hasPets === option.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}>{option.label}</button>
                  ))}
                </div>
              </div>
              <Button onClick={() => handleNext()} disabled={!homeSize || !hasPets} className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={handleBack} variant="ghost" className="flex items-center gap-2 hover:bg-white"><ArrowLeft className="w-4 h-4" /> Back to Selections</Button>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Selections & Progress</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center gap-3 flex-1"><div className="p-3 bg-blue-100 rounded-lg"><Home className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-gray-600">Home Size</p><p className="font-semibold text-gray-900">{homeSize}</p></div></div>
              <div className="flex items-center gap-3 flex-1"><div className="p-3 bg-purple-100 rounded-lg"><PawPrint className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-gray-600">Pets</p><p className="font-semibold text-gray-900">{hasPets === 'Yes' ? 'Has pets' : 'No pets'}</p></div></div>
              <div className="flex-1">
                <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-900">Progress</h3></div><div className="text-2xl font-bold text-blue-600">{stats.percentage}%</div></div>
                <div className="mt-2 w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${stats.percentage}%` }}/></div>
              </div>
            </div>
          </div>
      

<div className="space-y-8 mb-8">
  <div className="flex gap-2 mb-6">
  <button
    className={`px-3 py-1 rounded transition-all font-semibold text-sm
      ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-blue-50'}`}
    onClick={() => setFilter('all')}
  >
    All
  </button>
  <button
    className={`px-3 py-1 rounded transition-all font-semibold text-sm
      ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-green-50'}`}
    onClick={() => setFilter('completed')}
  >
    Completed
  </button>
  <button
    className={`px-3 py-1 rounded transition-all font-semibold text-sm
      ${filter === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-purple-50'}`}
    onClick={() => setFilter('active')}
  >
    Active
  </button>
 </div>
</div>

{Object.entries(displayedTasks).map(([category, tasks]) =>
  getFilteredTasks(tasks).length > 0 && (
    <div key={category}>
      <h3 className="text-lg font-semibold text-gray-900 capitalize mb-4 flex items-center gap-2">
        {category === 'daily' && <Clock className="w-5 h-5 text-blue-600" />}
        {category === 'weekly' && <Calendar className="w-5 h-5 text-emerald-600" />}
        {category === 'monthly' && <Star className="w-5 h-5 text-purple-600" />}
        {category} Tasks
      </h3>
      <div className="space-y-4">
        <AnimatePresence>
          {getFilteredTasks(tasks).map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.45, type: "spring", stiffness: 220 }}
            >
              <TaskItem task={task} onToggle={toggleTask} onDelete={deleteTask} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
)}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Task</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input placeholder="Enter task name..." value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} className="flex-1"/>
              <Select value={newTaskFrequency} onValueChange={setNewTaskFrequency}><SelectTrigger className="sm:w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem></SelectContent></Select>
              <Button onClick={addTask} disabled={!newTaskName.trim()} className="bg-blue-600 hover:bg-blue-700"><Plus size={18} className="mr-1" /> Add</Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default CleaningPlanPage;