import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { FoodDetailPage } from './pages/FoodDetailPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const placeMatch = path.match(/^\/place\/(.+)$/);
  const foodMatch = path.match(/^\/food\/(.+)$/);

  return (
    <AuthProvider>
      {path === '/auth' ? (
        <AuthPage />
      ) : path === '/profile' ? (
        <ProfilePage />
      ) : placeMatch ? (
        <PlaceDetailPage id={placeMatch[1]} />
      ) : foodMatch ? (
        <FoodDetailPage id={foodMatch[1]} />
      ) : (
        <HomePage />
      )}
    </AuthProvider>
  );
}

export default App;
