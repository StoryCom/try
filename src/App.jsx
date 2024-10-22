import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import CreateSession from './pages/CreateSession';
import ActiveWorkout from './components/ActiveWorkout';
import Progress from './pages/Progress';
import ProgressStat from './components/ProgressStat';
import WorkoutHistory from './components/WorkoutHistory';
import EditWorkout from './components/EditWorkout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/active-workout" element={<ActiveWorkout />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/progress" element={<ProgressStat />} />
          <Route path="/workout-history/:workoutName" element={<WorkoutHistory />} />
          <Route path="/edit-workout/:id" element={<EditWorkout />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;