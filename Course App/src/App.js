import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import './scss/style.scss';
import './scss/examples.scss';

// Import pages
const Categorie = lazy(() => import('./views/users/Categories/categoriepage'));
const VerifyEmail = lazy(() => import('./views/pages/login/VerifyEmail'));
const ForgotPassword = lazy(() => import('./views/pages/login/ForgotPassword'));
const PrivateRoute = lazy(() => import('./views/admin/PrivateRoute'));
const Courses = lazy(() => import('./views/users/Coures/courses'));

// Containers
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/login/Register'));
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Chooselanguage = React.lazy(() => import('./views/admin/languagePage/chooselanguage'));
const Documentation = React.lazy(() => import('./views/users/documentation/course'));
import Protecte_Users from './views/users/protecte_Users';

const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
// Reset Password Page Component
const ResetPassword = React.lazy(() => import('./views/pages/login/ResetPassword'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }>
        <Routes>
          <Route exact path="/" name="default page " element={<Navigate to="/login" />} />
          
          {/* Login, Register, Forget Password Routes */}
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/forgetpassword" name="Forgetpassword Page" element={<ForgotPassword />} />
          
          {/* Reset Password route */}
          <Route path="/reset-password/:token" name="Reset Password" element={<ResetPassword />} />
          
          
          
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Language Pages */}
          <Route path="/Categories" element={<Protecte_Users><Categorie /></Protecte_Users>} />
          
          {/* Protecting the Chooselanguage route with PrivateRoute */}
          <Route 
            path="/chooselanguage" 
            element={<PrivateRoute><Chooselanguage /></PrivateRoute>} 
          />

          <Route 
            path="/DefaultLayout/*" 
            element={<PrivateRoute><DefaultLayout /></PrivateRoute>} 
          />
           <Route 
            path="/courses/:categoryId" 
            element={<Protecte_Users><Courses /></Protecte_Users>} 
          />
          <Route 
            path="/Docs/:course_Id" 
            element={<Protecte_Users><Documentation /></Protecte_Users>} 
          />

<Route 
            path="/course/:course_Id/chapter/:chapter_id" 
            element={<Protecte_Users><Documentation /></Protecte_Users>} 
          /> <Route exact path="/404" name="Page 404" element={<PrivateRoute><Page404 /></PrivateRoute>} />
          <Route exact path="/500" name="Page 500" element={<PrivateRoute><Page500 /></PrivateRoute>} />

          <Route exact path="/500" name="Page 500" element={<PrivateRoute><Page500 /></PrivateRoute>} />
       
       
       </Routes>
       
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
