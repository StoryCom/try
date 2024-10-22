import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Pencil, Trash2 } from 'lucide-react';

const Session = () => {
  const navigate = useNavigate();
  const workouts = useStore((state) => state.workouts);
  const startWorkout = useStore((state) => state.startWorkout);
  const deleteWorkout = useStore((state) => state.deleteWorkout);

  const handleStartWorkout = (workout) => {
    startWorkout(workout);
    navigate('/active-workout');
  };

  const handleEditWorkout = (workoutId) => {
    navigate(`/edit-workout/${workoutId}`);
  };

  const handleDeleteWorkout = (workoutId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      deleteWorkout(workoutId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[60px] mb-[110px]">
      <h1 className="text-2xl font-bold mb-6">Séances d'entraînement</h1>
      {workouts.length === 0 ? (
        <p>Aucune séance d'entraînement n'a été créée.</p>
      ) : (
        <ul className="space-y-4">
          {workouts.map((workout) => (
            <li key={workout.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{workout.name}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditWorkout(workout.id)}
                    
                    className="p-1 text-blue-600 hover:text-blue-800"
                    aria-label="Modifier la séance"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    aria-label="Supprimer la séance"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">Repos entre exercices : {workout.restBetweenExercises} secondes</p>
              <h3 className="text-lg font-medium mb-2">Exercices :</h3>
              <ul className="list-disc list-inside space-y-2">
                {workout.exerciseGroups.map((group, groupIndex) => (
                  <li key={groupIndex}>
                    <span className="font-medium">
                      {group.type === 'single' ? 'Exercice' : group.type === 'biset' ? 'Bi-set' : 'Tri-set'}
                    </span>
                    <ul className="list-circle list-inside ml-4">
                      {group.exercises.map((exercise, exerciseIndex) => (
                        <li key={exerciseIndex}>
                          <span className="font-medium">{exercise.name}</span> - {group.sets} séries,{' '}
                          {exercise.minReps}-{exercise.maxReps} répétitions
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 ml-4">Repos entre séries : {group.restBetweenSets} secondes</p>
                  </li>
                ))}
              </ul>
              {workout.notes && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Notes :</h3>
                  <p className="text-gray-600">{workout.notes}</p>
                </div>
              )}
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={() => handleStartWorkout(workout)}
              >
                Lancer l'entraînement
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Session;