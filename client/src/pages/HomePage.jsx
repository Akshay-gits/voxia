import React, { useState, useEffect } from 'react';
import { ChevronDown, Mic, Brain, BarChart, Play, Check, Github } from 'lucide-react';

const Homepage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 font-sans">
    
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
            <span className="text-indigo-600">Voxia</span>
            <div className="mt-2">Speak with Confidence</div>
          </h1>
          <p className="text-xl mb-8 text-gray-600 max-w-lg">
            Master the art of public speaking with AI-powered feedback and analytics to track your improvement.
          </p>
          <div className="flex items-center justify-start">
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
              <span className="mr-2">•</span> 
              <span className="animate-pulse">Currently in development</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center relative">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
            <div className="bg-indigo-600 h-12 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mx-1"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500 mx-1"></div>
              <div className="h-3 w-3 rounded-full bg-green-500 mx-1"></div>
            </div>
            <div className="p-6 bg-gray-100 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Mic size={36} className="text-indigo-600" />
                </div>
                <p className="text-gray-500">Click to start recording your speech</p>
              </div>
            </div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
          {/* Animation elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 rounded-full opacity-30 animate-pulse"></div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center mb-12">
        <a href="#features" className="animate-bounce bg-white p-2 w-10 h-10 ring-1 ring-slate-200 shadow-lg rounded-full flex items-center justify-center">
          <ChevronDown size={24} className="text-indigo-600" />
        </a>
      </div>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Voxia combines cutting-edge technology with a user-friendly interface to help you become a confident speaker.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-indigo-50 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Mic size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Speech-to-Text</h3>
              <p className="text-gray-600">
                Our advanced React hook accurately transcribes your speech in real-time, allowing you to review your words instantly.
              </p>
            </div>

            <div className="bg-indigo-50 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Brain size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Analysis</h3>
              <p className="text-gray-600">
                Powered by Gemini AI, Voxia provides intelligent feedback on your speech, identifying mistakes and suggesting improvements.
              </p>
            </div>

            <div className="bg-indigo-50 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <BarChart size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Progress Dashboard</h3>
              <p className="text-gray-600">
                Track your speaking progress with comprehensive metrics and visualizations that show your improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Voxia Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to enhance your speaking skills and boost your confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold text-xl">1</div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  <Play size={36} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-900">Record Your Speech</h3>
              <p className="text-gray-600 text-center">
                Open the app, click record, and start speaking. Practice your presentation, speech, or interview answers in a safe environment.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md relative mt-8 md:mt-0">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold text-xl">2</div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  <Brain size={36} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-900">Get AI Feedback</h3>
              <p className="text-gray-600 text-center">
                Voxia's AI analyzes your speech, identifies areas for improvement, and provides actionable suggestions to enhance your delivery.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md relative mt-8 md:mt-0">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold text-xl">3</div>
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  <Check size={36} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-900">Improve & Track</h3>
              <p className="text-gray-600 text-center">
                Practice regularly, implement the feedback, and watch your progress on the dashboard as your speaking skills improve over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-indigo-600 rounded-2xl p-12 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Real Results from Beta Users</h2>
              <p className="text-indigo-200 mt-2">Our early adopters are already seeing significant improvements</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50+</div>
                <p className="text-indigo-200">test cases performed</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">70%</div>
                <p className="text-indigo-200">transcription accuracy obtained</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">95%</div>
                <p className="text-indigo-200">effective feedback</p>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-indigo-500">
              <div className="text-center italic text-indigo-200">
              <p>"Practicing in front of a mirror helps build self-awareness of body language, refine facial expressions, and improve eye contact."</p><br />
              <p>"The most valuable thing you can make is a mistake. You can't learn anything from being perfect."</p>
                <div className="mt-2 font-semibold">— online media, Adam Osborne</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section (replacing CTA) */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center mb-6 px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
            <span className="mr-2">★</span> 
            Community-Powered
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Voxia is Open Source</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We believe in the power of collaboration. Voxia is built with community contributions to create the best speech improvement tool available.
          </p>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center space-x-2 text-gray-600 mb-6">
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full">
                <span>Stars: 0</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full">
                <span>Forks: 0</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full">
                <span>Contributors: 4</span>
              </div>
            </div>
          </div>
          <a 
            href="https://github.com/Akshay-gits/voxia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-colors"
          >
            <Github size={20} />
            View on GitHub
          </a>
          <p className="mt-4 text-gray-500">Contribute to make Voxia even better!</p>
          
          {/* Recent Contributors */}
          <div className="mt-12">
            <div className="text-xl font-semibold mb-4 text-gray-700">Recent Contributors</div>
            <div className="flex justify-center">
              <div className="flex -space-x-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-full bg-indigo-300 border-2 border-white flex items-center justify-center text-white font-bold">
                  A
                </div>
              ))}
                <div className="w-12 h-12 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white font-bold">
                  +1
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-2xl font-bold mb-4">Voxia</div>
              <p className="text-gray-400 max-w-xs">
                Empowering confident communication through AI-powered speech analysis and improvement.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Project</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Roadmap</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Releases</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Community</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Code of Conduct</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contributing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Discord</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Discussions</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">License</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2025 Voxia. All rights reserved. Licensed under MIT.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
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

export default Homepage;