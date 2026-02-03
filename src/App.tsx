import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { FoodDetailPage } from './pages/FoodDetailPage';

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

  if (placeMatch) {
    return <PlaceDetailPage id={placeMatch[1]} />;
  }

  if (foodMatch) {
    return <FoodDetailPage id={foodMatch[1]} />;
  }

  return <HomePage />;
}

export default App;
