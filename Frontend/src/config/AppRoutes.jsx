import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import Home from '../pages/Home';

// Route Guards
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { OTPVerification } from '../pages/auth/OTPVerification';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { VerifyEmail } from '../pages/auth/VerifyEmail';

// Dashboard Pages
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Workspaces } from '../pages/dashboard/Workspaces';
import { WorkspaceDetail } from '../pages/dashboard/WorkspaceDetail';
import { MyDocs } from '../pages/dashboard/MyDocs';
import { PublicDocs } from '../pages/dashboard/PublicDocs';
import { Search } from '../pages/dashboard/Search';
import { Profile } from '../pages/dashboard/Profile';
import { AdminPanel } from '../pages/dashboard/AdminPanel';
import { Editor } from '../pages/dashboard/Editor';
import { DocDetail } from '../pages/dashboard/DocDetail';
import { CommentedDocs } from '../pages/dashboard/CommentedDocs';
import { Categories } from '../pages/dashboard/Categories';
import { SentEmail } from '../pages/auth/SentEmail';
import DocumentCreate from '../pages/dashboard/DocumentCreate';
import DocumentEdit from '../pages/dashboard/DocumentEdit';
import { CreateWorkspace } from '../pages/dashboard/CreateWorkspace';
import { EditWorkspace } from '../pages/dashboard/EditWorkspace';
import { AllDocs } from '../pages/dashboard/AllDocs';
import { MyDrafts } from '../pages/dashboard/MyDrafts';
import DocumentDetails from '../pages/DocumentDetails';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home - Public */}
                <Route path='/' element={<Home />} />
                <Route path='/documentDetail/:slug' element={<DocumentDetails />} />
                <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
                    <Route path="/login" element={<Login />} />

                    <Route path="/signup" element={<Signup />} />
                    <Route path="/sent-email/:email" element={<SentEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/otp/:email" element={<OTPVerification />} />
                    <Route path="/reset-password/:email" element={<ResetPassword />} />
                    <Route path="/verify/:token" element={<VerifyEmail />} />

                </Route>

                {/* Dashboard Routes - Sirf logged-in users ke liye */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/workspace/create" element={<CreateWorkspace />} />
                    <Route path="/workspace/edit/:id" element={<EditWorkspace />} />
                    <Route path="/all-docs" element={<AllDocs />} />
                    <Route path="/my-comments" element={<CommentedDocs />} />
                    <Route path="/workspaces" element={<Workspaces />} />
                    <Route path="/workspace/:id" element={<WorkspaceDetail />} />
                    <Route path="/my-docs" element={<MyDocs />} />
                    <Route path="/my-drafts" element={<MyDrafts />} />
                    <Route path="/public-docs" element={<PublicDocs />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/doc/:id" element={<DocDetail />} />
                    <Route path='/docCreate/:id' element={<DocumentCreate />} />
                    <Route path='/docEdit/:id' element={<DocumentEdit />} />
                </Route>

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;