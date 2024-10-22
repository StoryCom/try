import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const WorkoutHistory = () => {
  const { workoutName } = useParams();
  const navigate = useNavigate();
  const { workoutHistory } = useStore();

  const workoutInstances = workoutHistory.filter(workout => workout.name === decodeURIComponent(workoutName));

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[60px] mb-[110px]">
      <button
        onClick={() => navigate('/progress')}
        className="mb-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
      >
        Retour aux séances
      </button>
      <h1 className="text-2xl font-bold mb-6">Historique de {decodeURIComponent(workoutName)}</h1>
      {workoutInstances.length === 0 ? (
        <p>Aucun historique trouvé pour cette séance.</p>
      ) : (
        <ul className="space-y-8">
          {workoutInstances.map((workout, index) => (
            <li key={index} className="border p-4 rounded">
              <h2 className="text-xl font-semibold mb-2">Session du {formatDate(workout.completedAt)}</h2>
              <p className="mb-2">Durée : {formatDuration(workout.duration)}</p>
              <h3 className="text-lg font-medium mb-2">Exercices :</h3>
              <ul className="space-y-4">
                {workout.exerciseGroups.map((group, groupIndex) => (
                  <li key={groupIndex} className="border-t pt-2">
                    <h4 className="text-md font-medium">
                      {group.type === 'single' ?   'Exercice' : group.type === 'biset' ? 'Bi-set' : 'Tri-set'}
                    </h4>
                    <p>Nombre de séries : {group.sets}</p>
                    <p>Récupération entre les séries : {group.restBetweenSets}s</p>
                    <ul className="ml-4">
                      {group.exercises.map((exercise, exIndex) => (
                        <li key={exIndex}>
                          <h5 className="font-medium">{exercise.name}</h5>
                          {exercise.completedSets.map((set, setIndex) => (
                            <p key={setIndex}>
                              Série {setIndex + 1}: {set.reps} répétitions
                              {set.comment && <span className="text-sm text-gray-600"> - Commentaire : {set.comment}</span>}
                            </p>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              {index < workoutInstances.length - 1 && (
                <p className="mt-2 text-sm text-gray-600">
                  Récupération avant le prochain exercice : {workout.restBetweenExercises}s
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkoutHistory;