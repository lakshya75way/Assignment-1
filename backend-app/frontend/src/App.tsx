import React from 'react';
import AppRouter from './routing/AppRouter';
import './index.css';

const App: React.FC = () => {
    return (
        <div className="app">
            <AppRouter />
        </div>
    );
};

export default App;
