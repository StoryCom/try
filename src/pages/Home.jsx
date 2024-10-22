import React, { useMemo } from 'react';
import useStore from '../store/useStore';

function Home() {
  const { workoutHistory, user } = useStore();

  const recentWorkouts = useMemo(() => {
    return workoutHistory.slice(-3).reverse();
  }, [workoutHistory]);

  const weeklyWorkoutTime = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    
    return workoutHistory.reduce((total, workout) => {
      const workoutDate = new Date(workout.completedAt);
      if (workoutDate >= startOfWeek) {
        return total + workout.duration;
      }
      return total;
    }, 0);
  }, [workoutHistory]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[60px] mb-[110px]">
      <h1 className="text-3xl font-bold mb-6 text-black">Bienvenue, {user.name || 'athlète'} !</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Temps d'entraînement cette semaine</h2>
        <p className="text-4xl font-bold text-green-600">{formatDuration(weeklyWorkoutTime)}</p>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Dernières séances</h2>
        {recentWorkouts.length > 0 ? (
          <ul className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <li key={index} className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{workout.name}</h3>
                <p>Date : {new Date(workout.completedAt).toLocaleDateString()}</p>
                <p>Durée : {formatDuration(workout.duration)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune séance récente. Commencez votre première séance !</p>
        )}
      </div>
    </div>
  );
}

export default Home;