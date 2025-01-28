import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './components/pages/Home.jsx';
import About from './components/pages/AboutPage.jsx';
import Contact from './components/pages/ContactPage.jsx';
import Projects from './components/sections/Projects.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
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