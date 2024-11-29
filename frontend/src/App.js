import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './components/navbar.js';
import TrackExercise from './components/trackExercise.js';
import Statistics from 'components/statistics.js';
import Footer from './components/footer.js';
import Login from 'components/login.js';
import Signup from './components/signup.js';
import Journal from './components/journal.js';
import Recipes from 'components/recipes.js';
import logo from './img/CFG_logo.png';
import { trackExercise, fetchStatistics, fetchRecipes } from '../src/api.js';
import ErrorBoundary from './components/ErrorBoundary.js';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [recipesError, setRecipesError] = useState('');

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser('');
    };

    const handleLogin = async (username) => {
        setIsLoggedIn(true);
        setCurrentUser(username);
    };

    const handleSignup = async (username) => {
        setIsLoggedIn(true);
        setCurrentUser(username);
    };
    // Fetch recipes when the user is logged in
    useEffect(() => {
        const fetchUserRecipes = async () => {
            if (isLoggedIn) {
                try {
                    const data = await fetchRecipes();
                    setRecipes(data.recipes || []);
                    setRecipesError(''); // Clear any previous error
                } catch (err) {
                    console.error('Failed to fetch recipes:', err.message);
                    setRecipesError('Failed to load recipes. Please try again.');
                }
            }
        };
        fetchUserRecipes();
    }, [isLoggedIn]);

    return (
        <div className="App">
            <Router>
                <ErrorBoundary>
                    <div className="appTitle">
                        <h1>MLA Fitness App</h1>
                        <img src={logo} alt="CFG Fitness App Logo" id="appLogo" />
                    </div>

                    {isLoggedIn && <NavbarComponent onLogout={handleLogout} />}

                    <div className="componentContainer">
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    isLoggedIn ? (
                                        <Navigate to="/" />
                                    ) : (
                                        <Login onLogin={handleLogin} />
                                    )
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    isLoggedIn ? (
                                        <Navigate to="/" />
                                    ) : (
                                        <Signup onSignup={handleSignup} />
                                    )
                                }
                            />
                            <Route
                                path="/trackExercise"
                                element={
                                    isLoggedIn ? (
                                        <TrackExercise trackExercise={trackExercise} currentUser={currentUser} />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/statistics"
                                element={
                                    isLoggedIn ? (
                                        <Statistics fetchStatistics={fetchStatistics} currentUser={currentUser} />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/journal"
                                element={isLoggedIn ? <Journal currentUser={currentUser} /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/recipes"
                                element={isLoggedIn ? <Recipes recipes={recipes} error={recipesError} /> : <Navigate to="/login" />}
                            />
                            <Route path="/" element={isLoggedIn ? <Navigate to="/trackExercise" /> : <Navigate to="/login" />} />
                        </Routes>
                    </div>
                    <Footer />
                </ErrorBoundary>
            </Router>
        </div>
    );
}

export default App;
