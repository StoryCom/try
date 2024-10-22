import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PlusCircle, Trash2 } from 'lucide-react'
import useStore from '../store/useStore'

export default function EditWorkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { workouts, updateWorkout } = useStore()

  const [workout, setWorkout] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    const workoutToEdit = workouts.find(w => w.id.toString() === id)
    if (workoutToEdit) {
      setWorkout(workoutToEdit)
    } else {
      navigate('/sessions')
    }
  }, [id, workouts, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    updateWorkout(workout)
    setShowConfirmation(true)
    setTimeout(() => {
      navigate('/sessions')
    }, 2000)
  }

  const handleExerciseChange = (groupIndex, exerciseIndex, field, value) => {
    const updatedWorkout = { ...workout }
    updatedWorkout.exerciseGroups[groupIndex].exercises[exerciseIndex][field] = value
    setWorkout(updatedWorkout)
  }

  const handleGroupChange = (groupIndex, field, value) => {
    const updatedWorkout = { ...workout }
    
    updatedWorkout.exerciseGroups[groupIndex][field] = value
    setWorkout(updatedWorkout)
  }

  const addExerciseGroup = (type) => {
    const updatedWorkout = { ...workout }
    updatedWorkout.exerciseGroups.push({
      type,
      exercises: Array(type === 'single' ? 1 : type === 'biset' ? 2 : 3).fill({ 
        name: '', 
        minReps: '', 
        maxReps: '', 
        isMaxRep: false,
      }),
      sets: '',
      restBetweenSets: '',
    })
    setWorkout(updatedWorkout)
  }

  const removeExerciseGroup = (index) => {
    const updatedWorkout = { ...workout }
    updatedWorkout.exerciseGroups.splice(index, 1)
    setWorkout(updatedWorkout)
  }

  if (!workout) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[60px] mb-[110px]">
      <h1 className="text-2xl font-bold mb-6">Modifier la séance</h1>
      {showConfirmation && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Succès!</strong>
          <span className="block sm:inline"> La séance a été modifiée avec succès. Redirection vers la page des sessions...</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700">Nom de la séance</label>
          <input
            id="sessionName"
            type="text"
            value={workout.name}
            onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exercices</h2>
          {workout.exerciseGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {group.type === 'single' ? 'Exercice simple' : group.type === 'biset' ? 'Bi-set' : 'Tri-set'}
                </h3>
                <button
                  type="button"
                  onClick={() => removeExerciseGroup(groupIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div>
                <label htmlFor={`sets-${groupIndex}`} className="block text-sm font-medium text-gray-700">Nombre de séries</label>
                <input
                  id={`sets-${groupIndex}`}
                  type="number"
                  value={group.sets}
                  onChange={(e) => handleGroupChange(groupIndex, 'sets', e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {group.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="space-y-2">
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(groupIndex, exerciseIndex, 'name', e.target.value)}
                    placeholder={`Nom de l'exercice ${exerciseIndex + 1}`}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={exercise.minReps}
                      onChange={(e) => handleExerciseChange(groupIndex, exerciseIndex, 'minReps', e.target.value)}
                      placeholder="Reps min"
                      required={!exercise.isMaxRep}
                      disabled={exercise.isMaxRep}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    <input
                      type="number"
                      value={exercise.maxReps}
                      onChange={(e) => handleExerciseChange(groupIndex, exerciseIndex, 'maxReps', e.target.value)}
                      placeholder="Reps max"
                      required={!exercise.isMaxRep}
                      disabled={exercise.isMaxRep}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id={`maxRep-${groupIndex}-${exerciseIndex}`}
                      type="checkbox"
                      checked={exercise.isMaxRep}
                      onChange={(e) => handleExerciseChange(groupIndex, exerciseIndex, 'isMaxRep', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`maxRep-${groupIndex}-${exerciseIndex}`} className="ml-2 block text-sm text-gray-900">
                      Max rep
                    </label>
                  </div>
                </div>
              ))}
              <div>
                <label htmlFor={`restBetweenSets-${groupIndex}`} className="block text-sm font-medium text-gray-700">Repos entre séries (sec)</label>
                <input
                  id={`restBetweenSets-${groupIndex}`}
                  type="number"
                  value={group.restBetweenSets}
                  onChange={(e) => handleGroupChange(groupIndex, 'restBetweenSets', e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => addExerciseGroup('single')}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un exercice
            </button>
            <button
              type="button"
              onClick={() => addExerciseGroup('biset')}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un bi-set
            </button>
            <button
              type="button"
              onClick={() => addExerciseGroup('triset')}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un tri-set
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="restBetweenExercises" className="block text-sm font-medium text-gray-700">Repos entre les exercices/groupes (sec)</label>
          <input
            id="restBetweenExercises"
            type="number"
            value={workout.restBetweenExercises}
            onChange={(e) => setWorkout({ ...workout, restBetweenExercises: e.target.value })}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes supplémentaires</label>
          <textarea
            id="notes"
            value={workout.notes}
            onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
          />
        </div>
        
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Modifier la séance
        </button>
      </form>
    </div>
  )
}