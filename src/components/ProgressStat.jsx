import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const ProgressStat = () => {
  const { workoutHistory } = useStore();
  const navigate = useNavigate();

  const workoutGroups = useMemo(() => {
    const groups = {};
    workoutHistory.forEach((workout) => {
      if (!groups[workout.name]) {
        groups[workout.name] = {
          name: workout.name,
          count: 0,
          lastCompleted: workout.completedAt,
          totalDuration: 0,
          instances: [],
        };
      }
      groups[workout.name].count++;
      groups[workout.name].totalDuration += workout.duration;
      groups[workout.name].instances.push(workout);
      if (new Date(workout.completedAt) > new Date(groups[workout.name].lastCompleted)) {
        groups[workout.name].lastCompleted = workout.completedAt;
      }
    });
    return Object.values(groups).sort((a, b) => new Date(b.lastCompleted).getTime() - new Date(a.lastCompleted).getTime());
  }, [workoutHistory]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleWorkoutClick = (workoutName) => {
    navigate(`/workout-history/${encodeURIComponent(workoutName)}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[60px] mb-[110px]">
      <h1 className="text-2xl font-bold mb-6">Progrès</h1>
      {workoutGroups.length === 0 ? (
        <p>Aucun entraînement effectué pour le moment.</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Séances réalisées</h2>
          <ul className="space-y-4">
            {workoutGroups.map((group) => (
              <li 
                key={group.name} 
                className="border p-4 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => handleWorkoutClick(group.name)}
              >
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <p>Réalisé {group.count} fois</p>
                <p>Dernière séance : {formatDate(group.lastCompleted)}</p>
                <p>Durée moyenne : {formatDuration(Math.round(group.totalDuration / group.count))}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProgressStat;