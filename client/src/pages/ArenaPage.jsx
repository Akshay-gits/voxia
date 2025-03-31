import React, { useState } from 'react';
import { Mic, Clock, Award, ChevronRight, Lock, Info, ArrowLeft, Play } from 'lucide-react';

const ArenaPage = () => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const activities = [
    {
      id: 'mirror-speak',
      name: 'Mirror-Speak',
      description: 'Practice speaking while seeing yourself, just like rehearsing in front of a mirror',
      icon: <Mic size={24} />,
      difficulty: 'Beginner',
      duration: '5-10 min',
      benefits: ['Build confidence', 'Improve body language', 'Reduce speaking anxiety'],
      unlocked: true
    },
    {
      id: 'pitch-perfect',
      name: 'Pitch Perfect',
      description: 'Master your elevator pitch with timed sessions and targeted feedback',
      icon: <Clock size={24} />,
      difficulty: 'Intermediate',
      duration: '3-5 min',
      benefits: ['Concise messaging', 'Time management', 'Persuasive speaking'],
      unlocked: false
    },
    {
      id: 'debate-master',
      name: 'Debate Master',
      description: 'Strengthen your argument skills with AI-powered debate scenarios',
      icon: <Award size={24} />,
      difficulty: 'Advanced',
      duration: '10-15 min',
      benefits: ['Critical thinking', 'Counterargument skills', 'Structured reasoning'],
      unlocked: false
    }
  ];

  const renderActivityCard = (activity) => {
    return (
      <div 
        key={activity.id}
        className={`p-6 rounded-2xl transition-all cursor-pointer ${
          activity.unlocked 
            ? "bg-white shadow-md hover:shadow-lg" 
            : "bg-gray-100"
        }`}
        onClick={() => activity.unlocked && setSelectedActivity(activity)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              activity.unlocked ? "bg-indigo-100" : "bg-gray-200"
            }`}>
              {activity.icon}
            </div>
            <div className="ml-4">
              <h3 className={`font-bold text-xl ${activity.unlocked ? "text-gray-900" : "text-gray-500"}`}>
                {activity.name}
              </h3>
              <div className="flex items-center text-sm">
                <span className={activity.unlocked ? "text-indigo-600" : "text-gray-400"}>
                  {activity.difficulty}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span className={activity.unlocked ? "text-gray-600" : "text-gray-400"}>
                  {activity.duration}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            {activity.unlocked ? (
              <ChevronRight size={20} className="text-indigo-600" />
            ) : (
              <Lock size={20} className="text-gray-400" />
            )}
          </div>
        </div>
        
        <p className={`mb-4 ${activity.unlocked ? "text-gray-600" : "text-gray-400"}`}>
          {activity.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {activity.benefits.map((benefit, index) => (
            <span 
              key={index} 
              className={`text-xs px-3 py-1 rounded-full ${
                activity.unlocked 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {benefit}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderActivityDetail = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <button 
          className="flex items-center text-indigo-600 mb-6 hover:text-indigo-700 transition-colors"
          onClick={() => setSelectedActivity(null)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to activities
        </button>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-2/3">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <Mic size={24} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Mirror-Speak</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Mirror-Speak helps you build confidence by practicing speeches while seeing yourself on camera. 
              This simulates real-world public speaking scenarios and helps you become comfortable with your 
              own presentation style.
            </p>
            
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">How it works</h3>
              <ol className="space-y-3">
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
                  <span className="text-gray-700">Grant camera and microphone access when prompted</span>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
                  <span className="text-gray-700">Choose a topic or upload your own speaking script</span>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
                  <span className="text-gray-700">Record yourself speaking while watching your delivery</span>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 flex-shrink-0">4</span>
                  <span className="text-gray-700">Get AI-powered feedback on your speech and delivery</span>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm mr-3 flex-shrink-0">5</span>
                  <span className="text-gray-700">Review your progress and practice again to improve</span>
                </li>
              </ol>
            </div>
            
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center" onClick={() => window.location.href = '/mirror'}>
              <Play size={18} className="mr-2" />
              Start Activity
            </button>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Activity Details</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Difficulty</p>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-indigo-100 rounded-full">
                      <div className="w-8 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <span className="ml-3 text-sm text-gray-700">Beginner</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Skills Improved</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Confidence</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Body Language</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Eye Contact</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Pacing</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">Self-awareness</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start">
                    <Info size={16} className="text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      This activity works best in a quiet environment with good lighting to ensure 
                      accurate speech recognition and clear video.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 font-sans">
      <div className="container mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Practice Arena</h1>
              <p className="text-xl text-gray-600">
                Select an activity to practice and improve your speaking skills
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="bg-white rounded-lg shadow-sm px-4 py-2 inline-flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Award size={16} className="text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Current Level</p>
                  <p className="font-medium text-gray-800">Confident Beginner</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <Mic size={24} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Today's Recommendation</h2>
                <p className="text-gray-600">Continue with Mirror-Speak to build on your progress</p>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors" onClick={() => window.location.href = '/mirror'}>
              Start Now
            </button>
          </div>
        </header>

        <main>
          {selectedActivity ? (
            renderActivityDetail()
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map(activity => renderActivityCard(activity))}
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">Voxia</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-800 pt-6 flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-sm text-gray-400">
              © 2025 Voxia. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArenaPage;