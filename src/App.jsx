import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginView from './components/LoginView';
import TypeAView from './components/TypeAView';
import TypeBView from './components/TypeBView';
import TypeCView from './components/TypeCView';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setUsers(data.users))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const renderView = () => {
    if (!currentUser) {
      return <LoginView users={users} onSelectUser={setCurrentUser} />;
    }

    switch (currentUser.type) {
      case 'A':
        return <TypeAView user={currentUser} onBack={() => setCurrentUser(null)} />;
      case 'B':
        return <TypeBView user={currentUser} onBack={() => setCurrentUser(null)} />;
      case 'C':
        return <TypeCView user={currentUser} onBack={() => setCurrentUser(null)} />;
      default:
        return <div>Unknown User Type</div>;
    }
  };

  return (
    <div className="app-container" style={{ width: '100vw', minHeight: '100vh' }}>
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
    </div>
  );
}

export default App;
