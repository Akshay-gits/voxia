import React from 'react';
import { ArrowLeft, Construction, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="w-full max-w-3xl mx-auto text-center">
        {/* 404 Badge */}
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">
          temporary-302 • Page Not Found
        </div>
        
        {/* Logo Space */}
        <div className="w-40 h-40 mx-auto mb-8 flex items-center justify-center rounded-xl bg-white shadow-md">
          {/* Logo will be placed here */}
          <img src="/v logo.png" alt="Voxia Logo" className="h-50 w-auto" />
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-center mb-6">
            <Construction size={48} className="text-indigo-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            This page is under construction
          </h1>
          
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            We're working hard to bring you the best experience. This section of Voxia is currently being developed and will be available soon.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-indigo-600 mb-6">
            <Clock size={20} />
            <span className="font-medium">Coming soon</span>
          </div>
          
          {/* Decorative Elements */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="h-2 bg-indigo-200 rounded-full animate-pulse"></div>
            <div className="h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
            <div className="h-2 bg-indigo-600 rounded-full animate-pulse delay-300"></div>
          </div>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium transition-all hover:bg-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to Homepage
          </Link>
        </div>
        
        {/* Footer */}
        <p className="text-gray-500 text-sm">
          Voxia • Enhance Your Speaking Skills
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;