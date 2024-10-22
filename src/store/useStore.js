import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      workouts: [],
      addWorkout: (workout) =>
        set((state) => ({ workouts: [...state.workouts, workout] })),
      deleteWorkout: (workoutId) =>
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== workoutId),
        })),
      updateWorkout: (updatedWorkout) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === updatedWorkout.id ? updatedWorkout : workout
          ),
        })),
      
      activeWorkout: null,
      activeWorkoutStartTime: null,
      activeWorkoutDuration: 0,
      workoutHistory: [],
      isWorkoutInProgress: false,
      
      startWorkout: (workout) => set({ 
        activeWorkout: {
          ...workout,
          exerciseGroups: workout.exerciseGroups.map(group => ({
            ...group,
            exercises: group.exercises.map(exercise => ({
              ...exercise,
              completedSets: Array(parseInt(group.sets)).fill({ reps: 0, comment: '' })
            }))
          }))
        },
        activeWorkoutStartTime: Date.now(),
        activeWorkoutDuration: 0,
        isWorkoutInProgress: true
      }),
      
      updateWorkoutDuration: () => set((state) => ({
        activeWorkoutDuration: Math.round((Date.now() - state.activeWorkoutStartTime) / 1000)
      })),
      
      completeSet: (groupIndex, exerciseIndex, setIndex, reps, comment) => set(state => {
        if (!state.activeWorkout) return state;

        const updatedExerciseGroups = [...state.activeWorkout.exerciseGroups];
        const updatedExercises = [...updatedExerciseGroups[groupIndex].exercises];
        updatedExercises[exerciseIndex] = {
          ...updatedExercises[exerciseIndex],
          completedSets: [
            ...updatedExercises[exerciseIndex].completedSets.slice(0, setIndex),
            { reps, comment },
            ...updatedExercises[exerciseIndex].completedSets.slice(setIndex + 1)
          ]
        };
        updatedExerciseGroups[groupIndex] = {
          ...updatedExerciseGroups[groupIndex],
          exercises: updatedExercises
        };

        return {
          activeWorkout: {
            ...state.activeWorkout,
            exerciseGroups: updatedExerciseGroups
          }
        };
      }),
      
      endWorkout: () => {
        const { activeWorkout, activeWorkoutStartTime, workoutHistory } = get();
        const endTime = Date.now();
        const duration = Math.round((endTime - activeWorkoutStartTime) / 1000); // duration in seconds
        const completedWorkout = {
          ...activeWorkout,
          completedAt: new Date().toISOString(),
          duration: duration
        };
        set({
          activeWorkout: null,
          activeWorkoutStartTime: null,
          activeWorkoutDuration: 0,
          isWorkoutInProgress: false,
          workoutHistory: [...workoutHistory, completedWorkout]
        });
      },
      
      setIsWorkoutInProgress: (value) => set({ isWorkoutInProgress: value }),

      user: {
        name: '',
        height: 0,
        age: 0,
        weight: 0,
        gender: '',
      },
      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ 
        isAuthenticated: false, 
        activeWorkout: null,
        activeWorkoutStartTime: null,
        activeWorkoutDuration: 0,
        isWorkoutInProgress: false
      }),
    }),
    {
      name: 'sport-app-store',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;