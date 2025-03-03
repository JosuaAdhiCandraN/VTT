// welcome
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpFromLine,
  Clock,
  MessageCircle,
  Files,
  Share2,
  Target,
} from "lucide-react";
import bgImage from "../assets/BG_HomeClient.png";
import logo from "../assets/Logo.png";

const Welcome = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header - Matched with admin dashboard */}
      <header className="bg-black p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Dispatch Vox Logo" className="w-40 h-15" />
        </div>
        <button
          onClick={handleNavigation}
          className="bg-white text-black px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          SIGN IN
        </button>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold leading-tight text-white">
              No More
              <br />
              Missed
              <br />
              Details —
            </h1>
            <p className="text-3xl text-white">Every Call, Captured in Text.</p>
            <button
              onClick={handleNavigation}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center hover:bg-opacity-90 transition-colors font-sans border-2 border-white"
            >
              Get Started →
            </button>
          </div>

          {/* Rest of the component remains the same */}
          {/* Right Column - Steps Card */}
          <div className="bg-blue-900/50 p-8 rounded-3xl backdrop-blur-sm border border-white/10">
            <h2 className="text-2xl font-bold mb-12 text-center text-white">
              Generate in 2 Simple Steps
            </h2>
            <div className="flex items-center justify-between gap-4 text-white font-sans text-bold">
              {[
                {
                  number: "1",
                  icon: ArrowUpFromLine,
                  text: ["Upload", "Your", "File"],
                },
                {
                  number: "2",
                  icon: Clock,
                  text: ["Let Us", "Do The", "Work"],
                },
              ].map((step, index, array) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-white font-sans font-bold">
                      <step.icon className="w-8 h-8 text-blue-900" />
                    </div>
                    <div className="text-center font-sans font-bold">
                      {step.text.map((line, i) => (
                        <div key={i} className="text-lg font-extrabold">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                  {index < array.length - 1 && (
                    <div className="w-16 h-0.5 bg-white/50 mt-[-20px]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
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
              className="bg-white text-blue-900 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow"
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
