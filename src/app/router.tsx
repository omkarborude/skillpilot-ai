import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './layout';
import { AICoachPage } from '../features/ai/AICoachPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { LearningPlanPage } from '../features/learning-plan/LearningPlanPage';
import { TechniqueDetailPage } from '../features/lesson/TechniqueDetailPage';
import { CreateGoalPage } from '../features/onboarding/CreateGoalPage';
import { PlanGenerationPage } from '../features/plan-generation/PlanGenerationPage';
import { PracticePage } from '../features/practice/PracticePage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { ProgressPage } from '../features/progress/ProgressPage';

const router = createBrowserRouter([
  { path: '/', element: <CreateGoalPage /> },
  { path: '/plan-generation', element: <PlanGenerationPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/plan', element: <LearningPlanPage /> },
      { path: '/techniques/:techniqueId', element: <TechniqueDetailPage /> },
      { path: '/practice/:techniqueId', element: <PracticePage /> },
      { path: '/coach', element: <AICoachPage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
