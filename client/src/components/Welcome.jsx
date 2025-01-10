import React from "react";

const Welcome = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white flex flex-col items-center">
            {/* Header */}
            <header className="w-full flex justify-between items-center px-8 py-4 bg-black bg-opacity-50">
                <div className="flex items-center">
                    <img
                        src="/logo.svg"
                        alt="DispatchVox Logo"
                        className="h-10 w-auto"
                    />
                </div>
                <button className="text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold">
                    Sign In
                </button>
            </header>

            {/* Hero Section */}
            <section className="text-center flex-1 flex flex-col justify-center px-8 py-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    No More Missed Details –
                </h1>
                <p className="text-lg md:text-xl font-medium mb-8">
                    Every Call, Captured in Text.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-md text-lg font-semibold">
                    Get Started →
                </button>
            </section>

            {/* Features Section */}
            <section className="w-full px-8 py-12 bg-blue-800 bg-opacity-50">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Generate in 3 Simple Steps
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
                    {/* Step 1 */}
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">1</div>
                        <p className="text-lg">Upload Your File</p>
                    </div>
                    {/* Step 2 */}
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">2</div>
                        <p className="text-lg">Let Us Do The Work</p>
                    </div>
                    {/* Step 3 */}
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2">3</div>
                        <p className="text-lg">Check Your WhatsApp</p>
                    </div>
                </div>
            </section>

            {/* Why DispatchVox Section */}
            <section className="w-full px-8 py-16 bg-blue-900 bg-opacity-70">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Why DispatchVox?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white bg-opacity-10 p-6 rounded-md text-center">
                        <h3 className="text-xl font-semibold mb-4">
                            Instant Transcription
                        </h3>
                        <p className="text-sm">
                            Turn speech into text in seconds.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="bg-white bg-opacity-10 p-6 rounded-md text-center">
                        <h3 className="text-xl font-semibold mb-4">
                            Sharing Transcript Files
                        </h3>
                        <p className="text-sm">
                            Easy sharing options with just one click.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="bg-white bg-opacity-10 p-6 rounded-md text-center">
                        <h3 className="text-xl font-semibold mb-4">
                            Fast and Accurate
                        </h3>
                        <p className="text-sm">
                            Never miss a detail again with up to 99% accuracy.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Welcome;
