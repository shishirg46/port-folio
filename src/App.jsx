import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx'; // Ensure "layout" matches the folder name.
import Footer from './components/layout/Footer.jsx'; // Ensure case matches.
import Home from './components/pages/Home.jsx'; // Ensure "pages" and file names are correct.
import AboutPage from './components/pages/AboutPage.jsx';
import Contact from './components/sections/Contact.jsx';
import Projects from './components/sections/Projects.jsx';


function App() {
  return (
    <div className="min-h-screen flex flex-col">
        <Router>
      <Header />
        <Routes>
        <Route path="*" element={<div>Page Not Found</div>} />
          <Route index path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects/>} />
        </Routes>
        <Footer />
        </Router>
      </div>
  );
}

export default App;