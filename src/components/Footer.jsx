import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Plus, BarChart2 } from 'lucide-react';
import useStore from '../store/useStore';
import ConfirmEndWorkout from './ConfirmEndWorkout';

const NavButton = ({ icon, label, onClick, disabled, isActive }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center ${
      isActive 
        ? 'text-blue-600 font-semibold' 
        : 'text-black hover:text-gray-700'
    } ${
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
    disabled={disabled}
  >
    {icon}
    <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : ''}`}>{label}</span>
  </button>
);

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isWorkoutInProgress = useStore((state) => state.isWorkoutInProgress);
  const endWorkout = useStore((state) => state.endWorkout);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  const handleNavigation = (page) => {
    if (isWorkoutInProgress && location.pathname === '/active-workout') {
      setShowConfirmation(true);
      setPendingNavigation(page);
    } else {
      navigate(`/${page}`);
    }
  };

  const handleConfirm = () => {
    endWorkout();
    setShowConfirmation(false);
    if (pendingNavigation) {
      navigate(`/${pendingNavigation}`);
      setPendingNavigation(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingNavigation(null);
  };

  const isActive = (path) => {
    if (path === '') {
      // Home button is only active when exactly on the home page
      return location.pathname === '/';
    }
    return location.pathname.startsWith(`/${path}`);
  };

  return (
    <>
      <footer className="bg-[#4cd964] fixed bottom-0 left-0 right-0 z-50">
        <nav className="flex justify-around py-2">
          <NavButton
            icon={<Home size={24} />}
            label="Accueil"
            onClick={() => handleNavigation('')}
            disabled={isWorkoutInProgress && location.pathname === '/active-workout'}
            isActive={isActive('')}
          />
          <NavButton
            icon={<Dumbbell size={24} />}
            label="Séances"
            onClick={() => handleNavigation('sessions')}
            disabled={isWorkoutInProgress && location.pathname === '/active-workout'}
            isActive={isActive('sessions')}
          />
          <NavButton
            icon={<Plus size={24} />}
            label="Créer"
            onClick={() => handleNavigation('create')}
            disabled={isWorkoutInProgress && location.pathname === '/active-workout'}
            isActive={isActive('create')}
          />
          <NavButton
            icon={<BarChart2 size={24} />}
            label="Progrès"
            onClick={() => handleNavigation('progress')}
            disabled={isWorkoutInProgress && location.pathname === '/active-workout'}
            isActive={isActive('progress')}
          />
        </nav>
      </footer>
      {showConfirmation && (
        <ConfirmEndWorkout 
          onConfirm={handleConfirm} 
          onCancel={handleCancel} 
          message="Vous avez un entraînement en cours. Voulez-vous le terminer ?"
        />
      )}
    </>
  );
}