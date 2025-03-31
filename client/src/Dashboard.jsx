import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarDaysIcon, ChartBarIcon, ClockIcon, FireIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const API_BASE_URL = '${import.meta.env.VITE_API_URL}/api/dashboard';

const Dashboard = () => {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({ streak: 0, totalSessions: 0, averageScores: { grammar: 0, vocabulary: 0, confidence: 0, relevance: 0, overall: 0 } });
  const [recentSessions, setRecentSessions] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = await getToken();
        const headers = { Authorization: `Bearer ${token}` };

        const [statsResponse, sessionsResponse, weeklyResponse, calendarResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/stats`, { headers }),
          axios.get(`${API_BASE_URL}/sessions`, { headers }),
          axios.get(`${API_BASE_URL}/weekly-progress`, { headers }),
          axios.get(`${API_BASE_URL}/calendar`, { headers })
        ]);

        setUserStats(statsResponse.data);
        setRecentSessions(sessionsResponse.data);
        setWeeklyProgress(weeklyResponse.data);

        const practicedDaysMap = {};
        calendarResponse.data.forEach(item => {
          practicedDaysMap[new Date(item.date).toDateString()] = {
            practiced: item.practiced,
            isToday: item.isToday
          };
        });
        
        setCalendarData(generateMonthCalendar(currentMonth, practicedDaysMap));

        if (sessionsResponse.data[0]?.feedback?.recentFeedback) {
          setRecentFeedback([sessionsResponse.data[0].feedback.recentFeedback]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [getToken, currentMonth]);

  const generateMonthCalendar = (date, practicedDaysMap) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const totalCells = Math.ceil((firstDay.getDay() + daysInMonth) / 7) * 7;
    const today = new Date().toDateString();
    
    return Array.from({ length: totalCells }, (_, i) => {
      const currentDay = new Date(firstDay);
      currentDay.setDate(currentDay.getDate() - firstDay.getDay() + i);
      const dateKey = currentDay.toDateString();
      const dayInfo = practicedDaysMap[dateKey] || {};
      
      return {
        date: currentDay.toISOString().split('T')[0],
        day: currentDay.getDate(),
        practiced: dayInfo.practiced || false,
        isToday: dateKey === today,
        isCurrentMonth: currentDay.getMonth() === month
      };
    });
  };

  const previousMonth = () => setCurrentMonth(new Date(new Date(currentMonth).setMonth(currentMonth.getMonth() - 1)));
  const nextMonth = () => setCurrentMonth(new Date(new Date(currentMonth).setMonth(currentMonth.getMonth() + 1)));
  const formatDuration = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formatChartDate = (dateString) => formatDate(dateString);
  const getCurrentMonthYear = () => currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md">
        <p className="font-medium">Error loading dashboard</p>
        <p className="text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded">
          Retry
        </button>
      </div>
    </div>
  );

  const ScoreCard = ({ score, title, color = "indigo" }) => (
    <div className="bg-white rounded-xl shadow p-6 flex items-center space-x-4">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2" />
          <circle cx="18" cy="18" r="16" fill="none" stroke={`#${color === "indigo" ? "4f46e5" : color === "emerald" ? "10b981" : "f59e0b"}`} 
            strokeWidth="2" strokeDasharray={`${score || 0} 100`} strokeLinecap="round" transform="rotate(-90 18 18)" />
        </svg>
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
          <p className={`text-lg font-bold text-${color}-600`}>{score || 0}%</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title} Score</p>
        <p className="text-lg font-medium text-gray-700">
          {score >= 80 ? "Great progress!" : score >= 60 ? "Good work!" : "Keep practicing!"}
        </p>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, value, label }) => (
    <div className="bg-white rounded-xl shadow p-6 flex items-center space-x-4">
      <div className="p-3 rounded-full bg-indigo-100">
        <Icon className="h-8 w-8 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Your Speaking Progress</h1>
          <p className="mt-1 text-sm text-gray-500">Track your speaking journey with Voxia</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard icon={FireIcon} value={userStats.streak} label="Daily Streak" />
          <StatCard icon={MicrophoneIcon} value={userStats.totalSessions} label="Total Sessions" />
          <ScoreCard score={userStats.averageScores.grammar} title="Grammar" />
          <ScoreCard score={userStats.averageScores.vocabulary} title="Vocabulary" color="emerald" />
          <ScoreCard score={userStats.averageScores.confidence} title="Confidence" color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} labelFormatter={formatChartDate} />
                  <Legend />
                  <Line type="monotone" dataKey="grammar" name="Grammar" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                  <Line type="monotone" dataKey="vocabulary" name="Vocabulary" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                  <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} connectNulls />
                  <Line type="monotone" dataKey="overall" name="Overall" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Practice Streak</h2>
              <div className="flex space-x-2">
                <button onClick={previousMonth} className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-700">{getCurrentMonthYear()}</span>
                <button onClick={nextMonth} className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => <div key={day} className="text-xs text-center font-medium text-gray-500">{day}</div>)}
              {calendarData.map((day, i) => (
                <div key={i} className={`h-10 flex items-center justify-center rounded-md text-xs
                  ${day.isToday ? 'ring-2 ring-indigo-600' : ''}
                  ${!day.isCurrentMonth ? 'text-gray-300' : 
                    day.practiced ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                  title={day.practiced ? `Practiced on ${day.date}` : `No practice on ${day.date}`}>
                  {day.day}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              {userStats.streak > 0 ? `🔥 You're on a ${userStats.streak}-day streak! Keep it up!` : 'Start practicing daily to build your streak!'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Recent Practice Sessions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentSessions.length > 0 ? recentSessions.map((session) => (
              <div key={session._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{formatDate(session.createdAt)}</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {formatDuration(session.duration)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['grammar', 'vocabulary', 'confidence'].map((skill) => (
                    <div key={skill}>
                      <p className="text-sm text-gray-500">{skill.charAt(0).toUpperCase() + skill.slice(1)}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div className={`h-2.5 rounded-full ${
                          skill === 'grammar' ? 'bg-indigo-600' : 
                          skill === 'vocabulary' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} style={{ width: `${session.scores[skill]}%` }} />
                      </div>
                      <p className="text-xs text-right mt-1 text-gray-700">{session.scores[skill]}%</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-gray-600">
                    Overall progress: <span className="font-medium ml-1">{session.scores.overall}%</span>
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500">No practice sessions yet. Start practicing to see your progress!</div>
            )}
          </div>
          {recentSessions.length > 5 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View all sessions →</button>
            </div>
          )}
        </div>

        {recentFeedback.length > 0 && (
          <div className="bg-indigo-50 rounded-xl shadow-sm p-6 border border-indigo-100 mb-8">
            <h2 className="text-lg font-semibold text-indigo-900 mb-2">Personalized Suggestions</h2>
            <p className="text-indigo-700 mb-4">Based on your recent practice session:</p>
            <div className="whitespace-pre-wrap text-gray-800">{recentFeedback[0]}</div>
          </div>
        )}
      </main>

      <div className="fixed bottom-8 right-8">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-colors"
          onClick={() => window.location.href = '/mirror'}>
          <MicrophoneIcon className="h-6 w-6" />
          <span className="ml-2 font-medium">New Practice</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
