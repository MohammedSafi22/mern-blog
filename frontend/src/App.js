import { BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Header from "./components/headers/Header";
import Home from "./pages/home/Home";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";
import PostsPage from "./pages/posts-page/PostsPage";
import CreatePost from "./pages/create-post/CreatePost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Footer from './components/footer/Footer'
import { PostDetailes } from "./pages/post-detailes/PostDetailes";
import {ToastContainer} from 'react-toastify';
import { useSelector } from "react-redux";
import Category from "./pages/category/Category";
import Profile from "./pages/profile/Profile";
import UserTable from "./pages/admin/UserTable";
import PostsTable from "./pages/admin/PostsTable";
import CategoriesTable from "./pages/admin/CategoriesTable";
import CommentsTable from "./pages/admin/CommentsTable";
import ForgotPassword from "./pages/forms/ForgotPassword";
import ResetPassword from "./pages/forms/ResetPassword";
import NotFound from "./pages/not-found/NotFound";
import VerifyEmail from "./pages/verify-email/VerifyEmail";

function App() {
  const {user} = useSelector(state=>state.auth);
  return (
    <BrowserRouter>
    <ToastContainer theme='colored' />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user? <Login />:<Navigate to="/" />} />
        <Route path="/register" element={!user? <Register />:<Navigate to="/" />} />
        <Route path="/users/:userId/verify/:token" element={!user? <VerifyEmail />:<Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="posts">
          <Route index element={<PostsPage />} />
          <Route path="create-post" element={user?<CreatePost />:<Navigate to="/" />} />
          <Route path="detailes/:id" element={<PostDetailes />} />
          <Route path="categories/:category" element={<Category />} />
        </Route>
        <Route path="admin-dashboard">
          <Route index element={user?.isAdmin ?<AdminDashboard />:<Navigate to="/" />} />
          <Route path="users-table" element={user?.isAdmin ?<UserTable />:<Navigate to="/" />} />
          <Route path="posts-table" element={user?.isAdmin ?<PostsTable />:<Navigate to="/" />} />
          <Route path="categories-table" element={user?.isAdmin ?<CategoriesTable />:<Navigate to="/" />} />
          <Route path="comments-table" element={user?.isAdmin ?<CommentsTable />:<Navigate to="/" />} />
        </Route>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
