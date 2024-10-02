import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Home = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        doSignOut().then(() => {
            navigate('/login'); 
        }).catch((error) => {
            console.error("Logout error: ", error);
            
        });
    };

    return (
        <div className="flex h-screen">
            {}
            <aside className="w-1/4 bg-blue-900 text-white p-4">
                <h2 className="text-lg font-bold mb-4">Dashboard</h2>
                <nav className="space-y-4">
                    <Link to="/calendar" className="block hover:bg-blue-700 p-2 rounded">My Calendar</Link>
                    <Link to="/event" className="block hover:bg-blue-700 p-2 rounded">My Event</Link>
                    <Link to="/todo" className="block hover:bg-blue-700 p-2 rounded">To Do List</Link>
                    <Link to="/settings" className="block hover:bg-blue-700 p-2 rounded">Settings</Link>
                    <button onClick={handleLogout} className="block hover:bg-blue-700 p-2 rounded">Log Out</button>
                </nav>
            </aside>

            {/* Main content area */}
            <main className="flex-1 p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-center">
    Hello {currentUser.displayName ? currentUser.displayName : currentUser.email.split('@')[0]}
</h1>


                <div className="grid grid-cols-2 gap-4">
                    <Link to="/class-routine" className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                        Class Routine
                    </Link>
                    <Link to="/forum" className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                        Forum
                    </Link>
                    <Link to="/events" className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                        Events
                    </Link>
                    <Link to="/lost-and-found" className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                        Lost and Found
                    </Link>
                    <Link to="/seat-plan" className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                        Seat Plan
                    </Link>
                    <Link to="/others" className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow hover:bg-blue-600 transition duration-200">
                        Others
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;
