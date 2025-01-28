import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx'; // Ensure "layout" matches the folder name.
import Footer from './components/layout/Footer.jsx'; // Ensure case matches.
import Home from './components/pages/Home.jsx'; // Ensure "pages" and file names are correct.
import About from './components/pages/AboutPage.jsx';
import Contact from './components/pages/ContactPage.jsx';
import Projects from './components/sections/Projects.jsx';


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
        <Route path="*" element={<div>Page Not Found</div>} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects/>} />

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;