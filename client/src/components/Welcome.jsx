import React from "react";
import {
  ArrowUpFromLine,
  Clock,
  MessageCircle,
  Files,
  Share2,
  Target,
} from "lucide-react";

const Welcome = () => {
  return (
    <div className="relative min-h-screen bg-blue-900 text-white flex flex-col overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        {/* Curved lines */}
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl transform rotate-[-20deg] translate-y-[-50%]" />
        <div className="absolute top-20 right-[-10%] w-full h-32 bg-gradient-to-r from-blue-500/20 to-teal-500/20 blur-3xl transform rotate-[-20deg]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 blur-3xl transform rotate-[20deg] translate-y-[50%]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full flex justify-between items-center px-8 py-4 bg-black bg-opacity-50">
        <div className="flex items-center space-x-2">
          <img
            src="/api/placeholder/40/40"
            alt="DispatchVox Logo"
            className="h-10 w-auto"
          />
          <span className="text-2xl font-bold"></span>
        </div>
        <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors">
          SIGN IN
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <h1 className="text-5xl font-bold mb-4">
              No More
              <br />
              Missed
              <br />
              Details -
            </h1>
            <p className="text-3xl text-gray-300 mb-8">
              Every Call, Captured in Text.
            </p>
            <button className="bg-white text-black px-8 py-3 rounded-full font-semibold inline-flex items-center hover:bg-opacity-90 transition-colors">
              Get Started
              <span className="ml-2">→</span>
            </button>
          </div>

          {/* Right Column - Steps */}
          <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-8">
              Generate in 3 Simple Steps
            </h2>
            <div className="flex items-center justify-between">
              {[
                { icon: ArrowUpFromLine, text: "Upload\nYour\nFile" },
                { icon: Clock, text: "Let Us\nDo The\nWork" },
                { icon: MessageCircle, text: "Check\nYour\nWhatsApp" },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <step.icon className="w-8 h-8 text-blue-900" />
                  </div>
                  <p className="text-center whitespace-pre-line">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why DispatchVox?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Files,
              title: "Instant Transcription",
              subtitle: "Turn Speech into Text in Seconds",
              description:
                "Accurate transcription of audio, so you can focus on insights, not note-taking.",
            },
            {
              icon: Share2,
              title: "Sharing Transcript Files",
              subtitle: "Easy Sharing Options",
              description:
                "Share any of your transcription file with just one single click.",
            },
            {
              icon: Target,
              title: "Fast and Accurate",
              subtitle: "Never Miss a Detail Again",
              description:
                "Can reach up to 99% accuracy when transcribing your files depending on the sound quality.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white text-blue-900 p-8 rounded-xl text-center hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-lg font-semibold mb-2">{feature.subtitle}</p>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
