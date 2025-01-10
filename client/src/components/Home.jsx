import React from 'react';

const Home = () => {
    return (
        <section className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="text-lg">This is the home page after successful login.</p>
        </section>
    );
};

export default Home;
