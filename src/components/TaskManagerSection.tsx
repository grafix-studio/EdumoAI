
import { useState, useEffect } from "react";
import { CalendarDays, CheckCircle, Circle, Clock, Filter, Plus, Trash2, AlignLeft, AlertCircle } from "lucide-react";

// Task type definition
type Task = {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  completed: boolean;
  createdAt: Date;
};

// Task status type
type TaskStatus = 'all' | 'active' | 'completed';

export default function TaskManagerSection() {
  // Task state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [filter, setFilter] = useState<TaskStatus>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        // Convert string dates back to Date objects
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          createdAt: new Date(task.createdAt)
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error parsing tasks:", error);
      }
    }
  }, []);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Get filtered tasks based on current filter
  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  
  // Add a new task
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      deadline: newTaskDeadline ? new Date(newTaskDeadline) : new Date(Date.now() + 24 * 60 * 60 * 1000), // Default: tomorrow
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDeadline('');
    setIsAddingTask(false);
  };
  
  // Toggle task completion status
  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Calculate task status (color) based on deadline and completion
  const getTaskStatus = (task: Task) => {
    if (task.completed) return "task-status-green";
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    const timeRemaining = deadline.getTime() - now.getTime();
    const hoursRemaining = timeRemaining / (1000 * 60 * 60);
    
    if (hoursRemaining < 0) return "task-status-red"; // Overdue
    if (hoursRemaining < 24) return "task-status-yellow"; // Due within 24 hours
    return "task-status-green"; // Due later
  };
  
  // Format relative time (e.g., "3 days ago", "in 2 hours")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    const isPast = diffMs < 0;
    const absDiffDays = Math.abs(diffDays);
    const absDiffHours = Math.abs(diffHours) % 24;
    const absDiffMinutes = Math.abs(diffMinutes) % 60;
    
    if (absDiffDays > 0) {
      return isPast ? `${absDiffDays} day${absDiffDays !== 1 ? 's' : ''} ago` : `in ${absDiffDays} day${absDiffDays !== 1 ? 's' : ''}`;
    }
    
    if (absDiffHours > 0) {
      return isPast ? `${absDiffHours} hour${absDiffHours !== 1 ? 's' : ''} ago` : `in ${absDiffHours} hour${absDiffHours !== 1 ? 's' : ''}`;
    }
    
    if (absDiffMinutes > 0) {
      return isPast ? `${absDiffMinutes} minute${absDiffMinutes !== 1 ? 's' : ''} ago` : `in ${absDiffMinutes} minute${absDiffMinutes !== 1 ? 's' : ''}`;
    }
    
    return isPast ? "just now" : "very soon";
  };
  
  // Calculate task statistics
  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const overdueTasks = tasks.filter(task => 
      !task.completed && new Date(task.deadline) < new Date()
    ).length;
    
    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };
  
  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();

  return (
    <section id="tasks" className="section">
      <div className="section-header">
        <span className="chip mb-2">Task Manager</span>
        <h1 className="text-balance">Interactive Task Manager</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Create, manage, and track your tasks with real-time progress tracking and visual analytics.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Statistics */}
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="text-xl font-medium mb-6">Task Overview</h3>
            
            <div className="space-y-6">
              {/* Completion Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm">{stats.completionRate}%</span>
                </div>
                
                <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Task Counts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="text-sm text-muted-foreground mb-1">Total Tasks</div>
                  <div className="text-2xl font-medium">{stats.totalTasks}</div>
                </div>
                
                <div className="p-4 rounded-lg bg-success/10">
                  <div className="text-sm text-muted-foreground mb-1">Completed</div>
                  <div className="text-2xl font-medium">{stats.completedTasks}</div>
                </div>
                
                <div className="p-4 rounded-lg bg-warning/10">
                  <div className="text-sm text-muted-foreground mb-1">In Progress</div>
                  <div className="text-2xl font-medium">{stats.totalTasks - stats.completedTasks - stats.overdueTasks}</div>
                </div>
                
                <div className="p-4 rounded-lg bg-danger/10">
                  <div className="text-sm text-muted-foreground mb-1">Overdue</div>
                  <div className="text-2xl font-medium">{stats.overdueTasks}</div>
                </div>
              </div>
              
              {/* Add Task Button (Mobile) */}
              <div className="lg:hidden">
                <button
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                  onClick={() => setIsAddingTask(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Task</span>
                </button>
              </div>
              
              {/* Insights */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium mb-1">Task Insight</h4>
                    <p className="text-sm text-muted-foreground">
                      {stats.completionRate > 70 
                        ? "Great work! You're making excellent progress on your tasks." 
                        : stats.overdueTasks > 0 
                        ? "You have overdue tasks. Consider prioritizing them today." 
                        : "Try to complete tasks before their deadlines to maintain good progress."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Task List */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Your Tasks</h3>
              
              <div className="flex items-center space-x-2">
                {/* Filter Dropdown */}
                <div className="relative">
                  <button className="flex items-center space-x-1 text-sm font-medium py-1 px-2 rounded-md hover:bg-secondary/80 transition-all">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-subtle p-1 hidden">
                    <button className="block w-full text-left px-3 py-1 text-sm rounded-md hover:bg-secondary/80 transition-all">
                      All Tasks
                    </button>
                    <button className="block w-full text-left px-3 py-1 text-sm rounded-md hover:bg-secondary/80 transition-all">
                      Active Tasks
                    </button>
                    <button className="block w-full text-left px-3 py-1 text-sm rounded-md hover:bg-secondary/80 transition-all">
                      Completed Tasks
                    </button>
                  </div>
                </div>
                
                {/* Add Task Button (Desktop) */}
                <button
                  className="hidden lg:flex items-center space-x-1 text-sm font-medium py-1 px-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-all"
                  onClick={() => setIsAddingTask(true)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-4 border-b border-border/50">
              <button 
                className={`px-4 py-2 text-sm font-medium ${filter === 'all' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${filter === 'active' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium ${filter === 'completed' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
            
            {/* Task List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No tasks to display</p>
                  <button 
                    className="mt-4 text-primary hover:underline"
                    onClick={() => setIsAddingTask(true)}
                  >
                    Add your first task
                  </button>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`p-4 rounded-lg border ${getTaskStatus(task)}`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h4>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 break-words">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {task.completed 
                                ? "Completed" 
                                : `Due ${formatRelativeTime(task.deadline)}`}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <CalendarDays className="w-3 h-3" />
                            <span>
                              {task.deadline.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded-md hover:bg-danger/10 text-muted-foreground hover:text-danger transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-background rounded-xl shadow-elevated max-w-md w-full animate-scale-in p-6">
            <h3 className="text-xl font-medium mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Task Title</label>
                <input 
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Description (Optional)</label>
                <textarea 
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Deadline</label>
                <input 
                  type="datetime-local"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button 
                className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary/80 transition-all"
                onClick={() => setIsAddingTask(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary py-2"
                onClick={addTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
