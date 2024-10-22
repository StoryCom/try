import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import countdownSound from '../assets/sound/femalecountdown.mp3';
import ConfirmEndWorkout from './ConfirmEndWorkout';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const {
    activeWorkout,
    activeWorkoutDuration,
    endWorkout,
    updateWorkoutDuration,
    completeSet,
    isWorkoutInProgress,
    setIsWorkoutInProgress
  } = useStore();

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [reps, setReps] = useState({});
  const [comments, setComments] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isExerciseRest, setIsExerciseRest] = useState(false);
  const [skippedExercises, setSkippedExercises] = useState({});
  const [error, setError] = useState(null);

  const audioRef = useRef(new Audio(countdownSound));

  useEffect(() => {
    if (!activeWorkout) {
      navigate('/sessions');
      return;
    }

    setIsWorkoutInProgress(true);

    const interval = setInterval(() => {
      updateWorkoutDuration();
    }, 1000);

    return () => {
      clearInterval(interval);
      setIsWorkoutInProgress(false);
    };
  }, [activeWorkout, navigate, updateWorkoutDuration, setIsWorkoutInProgress]);

  const handleNextSet = useCallback(() => {
    if (!activeWorkout || !activeWorkout.exerciseGroups) return;

    const currentGroup = activeWorkout.exerciseGroups[currentGroupIndex];
    if (!currentGroup) return;

    const allExercisesCompleted = currentGroup.exercises.every((_, index) => {
      const key = `${currentGroupIndex}-${index}`;
      return skippedExercises[key] || (reps[key] && reps[key] !== '');
    });

    if (!allExercisesCompleted) {
      setError("Veuillez entrer le nombre de répétitions pour tous les exercices non zappés avant de continuer.");
      return;
    }

    setError(null);

    currentGroup.exercises.forEach((exercise, index) => {
      const key = `${currentGroupIndex}-${index}`;
      if (!skippedExercises[key]) {
        completeSet(
          currentGroupIndex,
          index,
          currentSetIndex,
          parseInt(reps[key] || '0'),
          comments[key] || ''
        );
      } else {
        completeSet(
          currentGroupIndex,
          index,
          currentSetIndex,
          0,
          comments[key] || 'Exercice zappé'
        );
      }
    });

    if (currentSetIndex + 1 < currentGroup.sets) {
      setCurrentSetIndex(prevIndex => prevIndex + 1);
      setIsResting(true);
      setIsExerciseRest(false);
      setTimer(currentGroup.restBetweenSets);
    } else if (currentGroupIndex + 1 < activeWorkout.exerciseGroups.length) {
      setCurrentGroupIndex(prevIndex => prevIndex + 1);
      setCurrentSetIndex(0);
      setIsExerciseRest(true);
      setIsResting(true);
      setTimer(activeWorkout.restBetweenExercises);
    } else {
      handleEndWorkout();
    }
    setReps({});
    setComments({});
    setSkippedExercises({});
  }, [activeWorkout, currentGroupIndex, currentSetIndex, reps, comments, completeSet, skippedExercises]);

  const getRestInfo = useCallback(() => {
    if (!activeWorkout || !activeWorkout.exerciseGroups) return null;

    if (isExerciseRest) {
      // Rest between exercises
      const nextGroup = activeWorkout.exerciseGroups[currentGroupIndex];
      return {
        type: 'exercise',
        nextExerciseGroup: nextGroup
      };
    } else {
      // Rest between sets
      const currentGroup = activeWorkout.exerciseGroups[currentGroupIndex];
      return {
        type: 'set',
        currentExerciseGroup: currentGroup,
        currentSetNumber: currentSetIndex + 1
      };
    }
  }, [activeWorkout, currentGroupIndex, currentSetIndex, isExerciseRest]);

  const getExerciseGroupDescription = (group) => {
    if (!group) return 'Fin de l\'entraînement';
    const exerciseCount = group.exercises.length;
    const exerciseType = exerciseCount === 1 ? 'Simple' : exerciseCount === 2 ? 'Biset' : 'Triset';
    const exerciseList = group.exercises.map(ex => ex.name).join(', ');
    return `${exerciseType}: ${exerciseList}`;
  };

  useEffect(() => {
    let interval;
    if (isResting && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 6) {
            playSound();
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (isResting && timer === 0) {
      setIsResting(false);
      setIsExerciseRest(false);
    }

    return () => clearInterval(interval);
  }, [isResting, timer]);

  const playSound = () => {
    audioRef.current.play().catch(error => console.error("Error playing sound:", error));
  };

  const handleEndWorkout = () => {
    setShowConfirmation(true);
  };

  const confirmEndWorkout = () => {
    endWorkout();
    setIsWorkoutInProgress(false);
    navigate('/progress');
  };

  const cancelEndWorkout = () => {
    setShowConfirmation(false);
  };

  const handleRepsChange = (groupIndex, exerciseIndex, value) => {
    const key = `${groupIndex}-${exerciseIndex}`;
    setReps(prev => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleCommentChange = (groupIndex, exerciseIndex, value) => {
    const key = `${groupIndex}-${exerciseIndex}`;
    setComments(prev => ({ ...prev, [key]: value }));
  };

  const handleSkipExercise = (groupIndex, exerciseIndex) => {
    const key = `${groupIndex}-${exerciseIndex}`;
    setSkippedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    if (!skippedExercises[key]) {
      setReps(prev => ({ ...prev, [key]: '' }));
    }
    setError(null);
  };

  const handleSkipReasonChange = (groupIndex, exerciseIndex, reason) => {
    const key = `${groupIndex}-${exerciseIndex}`;
    setComments(prev => ({
      ...prev,
      [key]: reason
    }));
  };

  if (!activeWorkout || !activeWorkout.exerciseGroups || activeWorkout.exerciseGroups.length === 0) {
    return <div>Loading workout...</div>;
  }

  const currentGroup = activeWorkout.exerciseGroups[currentGroupIndex];
  if (!currentGroup) {
    return <div>Error: Invalid workout structure</div>;
  }

  const restInfo = getRestInfo();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[60px] mb-[110px]">
      <h1 className="text-2xl font-bold mb-6">{activeWorkout.name}</h1>
      <p className="text-xl mb-4">Durée de la séance : {formatTime(activeWorkoutDuration)}</p>
      
      {isResting ? (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Temps de repos</h2>
          <p className="text-3xl font-bold">{timer} secondes</p>
          {timer <= 5 && (
            <p className="text-red-500 font-bold">Préparez-vous pour {isExerciseRest ? "le prochain exercice" : "la prochaine série"} !</p>
          )}
          {restInfo && (
            <div className="mt-4">
              {restInfo.type === 'set' ? (
                <>
                  <h3 className="text-lg font-medium">Exercice en cours :</h3>
                  <p className="mt-2">{getExerciseGroupDescription(restInfo.currentExerciseGroup)}</p>
                  <p className="mt-2">Série en cours : {restInfo.currentSetNumber} / {currentGroup.sets}</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium">Prochain exercice :</h3>
                  <p className="mt-2">{getExerciseGroupDescription(restInfo.nextExerciseGroup)}</p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{getExerciseGroupDescription(currentGroup)}</h2>
          <p>Série {currentSetIndex + 1} sur {currentGroup.sets}</p>
          {currentGroup.exercises.map((exercise, index) => (
            <div key={index} className="mt-4 p-4 border rounded">
              <h3 className="text-lg font-medium">{exercise.name}</h3>
              <div className="flex items-center justify-between">
                <p>Répétitions : {exercise.minReps}-{exercise.maxReps}</p>
                <button
                  onClick={() => handleSkipExercise(currentGroupIndex, index)}
                  className={`px-2 py-1 rounded ${
                    skippedExercises[`${currentGroupIndex}-${index}`]
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {skippedExercises[`${currentGroupIndex}-${index}`] ? 'Réactiver' : 'Zapper'}
                </button>
              </div>
              {skippedExercises[`${currentGroupIndex}-${index}`] ? (
                <textarea
                  value={comments[`${currentGroupIndex}-${index}`] || ''}
                  onChange={(e) => handleSkipReasonChange(currentGroupIndex, index, e.target.value)}
                  placeholder="Raison du zap"
                  className="mt-2 p-2 border rounded w-full"
                />
              ) : (
                <>
                  <input
                    type="number"
                    value={reps[`${currentGroupIndex}-${index}`] || ''}
                    onChange={(e) => handleRepsChange(currentGroupIndex, index, e.target.value)}
                    placeholder="Nombre de répétitions"
                    className="mt-2 p-2 border rounded w-full"
                    required
                  />
                  <textarea
                    value={comments[`${currentGroupIndex}-${index}`] || ''}
                    onChange={(e) => handleCommentChange(currentGroupIndex, index, e.target.value)}
                    placeholder="Commentaire (variante, charge, etc.)"
                    className="mt-2 p-2 border rounded w-full"
                  />
                </>
              )}
            </div>
          ))}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button 
            onClick={handleNextSet}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {currentGroupIndex === activeWorkout.exerciseGroups.length - 1 &&
             currentSetIndex === currentGroup.sets - 1
              ? "Terminer l'entraînement"
              : "Série terminée"}
          </button>
        </div>
      )}
      
      {!isResting && (
        <button 
          onClick={handleEndWorkout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Terminer l'entraînement
        </button>
      )}

      {showConfirmation && (
        <ConfirmEndWorkout onConfirm={confirmEndWorkout} onCancel={cancelEndWorkout} />
      )}
    </div>
  );
}