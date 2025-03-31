import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Mic, Play, RotateCcw, RefreshCw, Send, Copy, XCircle, CheckCircle, AlertTriangle, ThumbsUp, Award, Lightbulb } from 'lucide-react';
import useSpeechToText from 'react-hook-speech-to-text';

const MirrorSpeak = () => {
  const { userId, getToken } = useAuth();
  const [stage, setStage] = useState('initial');
  const [currentTopic, setCurrentTopic] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTopicLoading, setIsTopicLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(5);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: { interimResults: true },
    crossBrowser: true,
    timeout: 10000,
  });

  useEffect(() => {
    if (results.length > 0) setTranscript(results.map(result => result.transcript));
  }, [results]);

  useEffect(() => {
    let timer;
    if (isRecording) timer = setInterval(() => setRecordingDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), []);

  const generateRandomTopic = async () => {
    setIsTopicLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/generate-topic', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) throw new Error('Failed to fetch topic');
      const data = await response.json();
      setCurrentTopic(data.topic);
      setStage('topic');
    } catch (error) {
      console.error('Error generating topic:', error);
      alert('Failed to generate topic. Please try again.');
    } finally {
      setIsTopicLoading(false);
    }
  };
  
  const startRecording = async () => {
    try {
      setStage('recording');
      setRecordingDuration(0);
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.error("Error playing video:", err));
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = e => e.data.size > 0 && chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => setRecordedVideo(URL.createObjectURL(new Blob(chunksRef.current, { type: 'video/webm' })));
      mediaRecorder.start(1000);
      startSpeechToText();
    } catch (err) {
      console.error("Error starting the recording:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = fallbackStream;
        videoRef.current.srcObject = fallbackStream;
        videoRef.current.play().catch(err => console.error("Error playing video:", err));
        const mediaRecorder = new MediaRecorder(fallbackStream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = e => e.data.size > 0 && chunksRef.current.push(e.data);
        mediaRecorder.onstop = () => setRecordedVideo(URL.createObjectURL(new Blob(chunksRef.current, { type: 'video/webm' })));
        mediaRecorder.start(1000);
        startSpeechToText();
      } catch (fallbackErr) {
        console.error("Fallback recording also failed:", fallbackErr);
        alert("Unable to access camera and microphone. Please check your permissions and try again.");
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.state !== 'inactive' && mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    stopSpeechToText();
    setStage('review');
  };

  const resetActivity = () => {
    recordedVideo && URL.revokeObjectURL(recordedVideo);
    setStage('initial');
    setCurrentTopic('');
    setTranscript([]);
    setRecordedVideo(null);
    setRecordingDuration(0);
    chunksRef.current = [];
    setFeedback(null);
    setConfidenceScore(5);
  };

  const formatTime = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const copyTranscript = () => {
    if (transcript.length > 0) navigator.clipboard.writeText(transcript.join('\n'))
      .then(() => alert('Transcript copied to clipboard'))
      .catch(err => console.error('Failed to copy: ', err));
  };

  const getAIFeedback = async () => {
    setIsFeedbackLoading(true);
    try {
      const token = await getToken();
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/get-feedback', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcript: transcript.join('\n'),
          topic: currentTopic,
          confidenceScore: confidenceScore
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch feedback');
      const data = await response.json();
      setFeedback(data.feedback);

      const sessionData = {
        clerkUserId: userId,
        duration: recordingDuration,
        scores: {
          grammar: data.feedback.scores.grammar,
          vocabulary: data.feedback.scores.vocabulary,
          confidence: Math.round(confidenceScore * 10),
          relevance: data.feedback.scores.relevance,
          overall: data.feedback.scores.overall
        },
        feedback: data.feedback.recentFeedback
      };

      await fetch('${import.meta.env.VITE_API_URL}/api/save-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      alert('Failed to fetch feedback. Please try again.');
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const MistakeItem = ({ type, original, correction, explanation }) => {
    const typeColors = {
      grammar: { text: 'text-red-600', bg: 'bg-red-100' },
      filler_word: { text: 'text-amber-600', bg: 'bg-amber-100' },
      clarity: { text: 'text-blue-600', bg: 'bg-blue-100' },
      structure: { text: 'text-purple-600', bg: 'bg-purple-100' },
      pronunciation: { text: 'text-orange-600', bg: 'bg-orange-100' },
      vocabulary: { text: 'text-emerald-600', bg: 'bg-emerald-100' }
    };

    const icons = {
      grammar: <AlertTriangle size={16} className="mr-1" />,
      filler_word: <XCircle size={16} className="mr-1" />,
      clarity: <Lightbulb size={16} className="mr-1" />,
      structure: <Copy size={16} className="mr-1" />,
      default: <AlertTriangle size={16} className="mr-1" />
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className={`${typeColors[type]?.bg || 'bg-gray-100'} px-4 py-2 flex items-center`}>
          <span className={`font-medium ${typeColors[type]?.text || 'text-gray-600'} flex items-center`}>
            {icons[type] || icons.default}
            {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
          </span>
        </div>
        <div className="p-4">
          <div className="mb-2">
            <div className="text-sm text-gray-500 mb-1">Original:</div>
            <div className="bg-red-50 p-2 rounded border-l-2 border-red-400 text-gray-700">"{original}"</div>
          </div>
          <div className="mb-2">
            <div className="text-sm text-gray-500 mb-1">Correction:</div>
            <div className="bg-green-50 p-2 rounded border-l-2 border-green-400 text-gray-700">"{correction}"</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Explanation:</div>
            <div className="text-gray-700">{explanation}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderFeedbackUI = () => {
    if (!feedback) return null;
  
    if (feedback.rawFeedback) {
      return (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-xl mb-3 text-gray-900">AI Feedback</h3>
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-indigo-800 whitespace-pre-line">{feedback.rawFeedback}</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="font-semibold text-xl mb-6 text-gray-900 flex items-center">
          <Award size={24} className="text-indigo-600 mr-2" />
          Speech Analysis & Feedback
        </h3>

        {feedback.scores && (
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
            <h4 className="font-medium text-lg mb-4 text-indigo-800">Performance Scores</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(feedback.scores).map(([key, value]) => (
                <div key={key} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-3xl font-bold text-indigo-600">{value}</div>
                  <div className="text-sm text-gray-600 mt-1">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                  <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full ${
                        value >= 80 ? 'bg-green-500' : 
                        value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 bg-gray-50 rounded-xl p-5 border-l-4 border-gray-400">
          <h4 className="font-medium text-lg mb-2 text-gray-800 flex items-center">
            <Mic size={18} className="text-gray-600 mr-2" />
            What You've Said
          </h4>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-line">{feedback.transcript}</p>
          </div>
        </div>

        <div className="mb-8 bg-indigo-50 rounded-xl p-5 border-l-4 border-indigo-600">
          <h4 className="font-medium text-lg mb-2 text-indigo-800">Overall Feedback</h4>
          <p className="text-gray-700">{feedback.overallFeedback}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-medium text-lg mb-3 text-green-800 flex items-center">
              <ThumbsUp size={18} className="text-green-600 mr-2" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {feedback.strengths?.map((strength, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h4 className="font-medium text-lg mb-3 text-amber-800 flex items-center">
              <Lightbulb size={18} className="text-amber-600 mr-2" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {feedback.improvements?.map((improvement, i) => (
                <li key={i} className="flex items-start">
                  <AlertTriangle size={16} className="text-amber-600 mr-2 mt-1 flex-shrink-0" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-medium text-lg mb-3 text-gray-800 flex items-center">
            <CheckCircle size={18} className="text-green-600 mr-2" />
            Polished Version
          </h4>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <p className="text-gray-700 italic">{feedback.polishedVersion}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-lg mb-3 text-gray-800 flex items-center">
            <AlertTriangle size={18} className="text-red-600 mr-2" />
            Detailed Corrections
          </h4>
          {feedback.mistakes?.length > 0 ? (
            <div className="space-y-4">
              {feedback.mistakes.map((mistake, i) => (
                <MistakeItem key={i} {...mistake} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-gray-600 italic">
              No specific mistakes were identified in your speech.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStage = () => {
    const stages = {
      initial: (
        <div className="text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Mic size={40} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mirror-Speak</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Practice speaking while seeing yourself, just like rehearsing in front of a mirror.
            Generate a random topic or use your own script to improve confidence and delivery.
          </p>
          <button onClick={generateRandomTopic} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto">
            {isTopicLoading ? <RefreshCw size={20} className="animate-spin mr-2" /> : <RotateCcw size={20} className="mr-2" />}
            Generate Random Topic
          </button>
        </div>
      ),
      topic: (
        <div className="text-center">
          <div className="mb-8 animate-fadeIn">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Your Speaking Topic</h3>
            <div className="bg-indigo-50 p-6 rounded-xl max-w-2xl mx-auto border-2 border-indigo-100">
              <p className="text-2xl font-medium text-indigo-800">{currentTopic}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-8">Take a moment to gather your thoughts. When ready, click Start Recording to begin.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={generateRandomTopic} className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center">
              <RefreshCw size={18} className={`mr-2 ${isTopicLoading ? 'animate-spin' : ''}`} />
              {isTopicLoading ? 'Generating...' : 'Try Another Topic'}
            </button>
            <button onClick={startRecording} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
              <Play size={18} className="mr-2" />
              Start Recording
            </button>
          </div>
        </div>
      ),
      recording: (
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-0 pb-[56.25%]">
                <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center text-sm animate-pulse">
                  <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                  REC {formatTime(recordingDuration)}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="bg-white rounded-xl shadow-md flex-grow p-4 mb-4 overflow-y-auto max-h-72">
                <h3 className="font-medium text-gray-900 mb-2">Live Transcript</h3>
                <div className="space-y-2">
                  {transcript.map((line, i) => <p key={i} className="text-gray-700 border-l-2 border-indigo-300 pl-3 py-1">{line}</p>)}
                  {interimResult && <p className="text-gray-500 italic border-l-2 border-gray-300 pl-3 py-1">{interimResult}</p>}
                  {transcript.length === 0 && !interimResult && <p className="text-gray-500 italic">Start speaking to see your transcript appear here...</p>}
                </div>
              </div>
              <div className="text-center">
                <button onClick={stopRecording} className="bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition-colors flex items-center justify-center mx-auto">
                  <XCircle size={18} className="mr-2" />
                  Finish Recording
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 bg-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">Your Topic</h3>
            <p className="text-indigo-800 font-medium">{currentTopic}</p>
          </div>
        </div>
      ),
      review: (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Great job!</h2>
            <p className="text-gray-600 mb-6">You've completed your Mirror-Speak session. Review your recording and transcript below.</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="font-medium text-gray-900 mb-2">Your Recording</h3>
                <div className="bg-black rounded-xl overflow-hidden shadow-md">
                  <div className="relative h-0 pb-[56.25%]">
                    {recordedVideo && <video src={recordedVideo} controls className="absolute inset-0 w-full h-full object-cover" />}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">Duration: {formatTime(recordingDuration)}</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Your Transcript</h3>
                  <button onClick={copyTranscript} className="text-indigo-600 text-sm flex items-center hover:text-indigo-800 transition-colors">
                    <Copy size={14} className="mr-1" />
                    Copy text
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 h-64 overflow-y-auto border border-gray-200">
                  {transcript.length > 0 ? transcript.map((line, i) => <p key={i} className="text-gray-700">{line}</p>) : <p className="text-gray-500 italic">No transcript available.</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">Your Topic</h3>
            <p className="text-indigo-800 font-medium">{currentTopic}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Rate Your Confidence</h3>
            <p className="text-gray-600 mb-4">On a scale of 1-10, how confident did you feel during this speech?</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Not confident</span>
              <span className="text-sm text-gray-600">Very confident</span>
            </div>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <input
                type="range"
                min="1"
                max="10"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xl font-bold text-indigo-600 w-10 text-center">{confidenceScore}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={resetActivity} className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center">
              <RefreshCw size={18} className="mr-2" />
              Try Again
            </button>
            <button 
              onClick={getAIFeedback} 
              className={`${feedback ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center justify-center`}
              disabled={isFeedbackLoading}
            >
              {isFeedbackLoading ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : feedback ? (
                <>
                  <CheckCircle size={18} className="mr-2" />
                  View Feedback
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Get AI Feedback
                </>
              )}
            </button>
          </div>
          
          {renderFeedbackUI()}
        </div>
      )
    };

    return stages[stage] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 font-sans">
      <div className="container mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <Mic size={24} className="text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mirror-Speak Activity</h1>
          </div>
          <div className="max-w-3xl mx-auto mb-12">
            <div className="flex items-center justify-between">
              {['Topic', 'Practice', 'Review'].map((step, i) => (
                <React.Fragment key={step}>
                  <div className={`flex flex-col items-center ${
                    ['topic', 'recording', 'review'].includes(stage) ? i <= ['topic', 'recording', 'review'].indexOf(stage) ? 'text-indigo-600' : 'text-gray-400' : 
                    i === 0 ? 'text-indigo-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      ['topic', 'recording', 'review'].includes(stage) ? i <= ['topic', 'recording', 'review'].indexOf(stage) ? 'bg-indigo-600 text-white' : 'bg-gray-200' : 
                      i === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                    }`}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{step}</span>
                  </div>
                  {i < 2 && (
                    <div className={`w-full h-1 mx-2 ${
                      ['topic', 'recording', 'review'].includes(stage) ? i < ['topic', 'recording', 'review'].indexOf(stage) ? 'bg-indigo-600' : 'bg-gray-200' : 
                      i === 0 ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </header>
        <main className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-500">
          {renderStage()}
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
            <p className="text-sm text-gray-400">© 2025 Voxia. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              {['twitter', 'linkedin', 'github'].map(icon => (
                <a key={icon} href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    {icon === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>}
                    {icon === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>}
                    {icon === 'github' && <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MirrorSpeak;
