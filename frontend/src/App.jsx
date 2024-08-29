import { Routes, BrowserRouter, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Signup from "./components/Signup.jsx";
import Signin from "./components/Signin.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import NotFound from "./components/NotFound.jsx";
import Donation from "./components/Donation.jsx";
import Pricing from "./components/Pricing.jsx";
import Features from "./components/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Contact from "./components/Contact.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import Dashboard from "./components/Dashboard.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Settings from "./components/Settings.jsx";
import AiNotesMaker from "./components/AiNotesMaker.jsx";
import './App.css'
function App() {
  return (
    <>
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Features />} />
              <Route path="/signup" element={<Signup />}></Route>
              <Route path="/signin" element={<Signin />}></Route>
              <Route path="/forgot" element={<ForgotPassword />}></Route>
              <Route path="/reset" element={<ResetPassword />}></Route>
              <Route path="/*" element={<NotFound />}></Route>
              <Route path="/donation" element={<Donation />}></Route>
              <Route path="/pricing" element={<Pricing />}></Route>
              <Route path="/contact" element={<Contact />}></Route>
              <Route path="/tutorial" element={<HowItWorks />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/settings" element={<Settings />}></Route>
              <Route path="/ainotesmaker" element={<AiNotesMaker />}></Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
