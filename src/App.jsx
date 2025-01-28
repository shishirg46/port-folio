import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Pages/Home';
import About from './components/Pages/AboutPage';
import Contact from './components/Pages/ContactPage';
import Projects from './components/sections/Projects';

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