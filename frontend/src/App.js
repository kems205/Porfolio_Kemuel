import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiGithub, FiMail, FiLinkedin, FiTwitter, FiPhone, FiMapPin, FiSun, FiMoon, FiMenu, FiX, FiCode, FiDatabase, FiServer, FiGlobe, FiShield, FiTool, FiArrowRight, FiEye } from 'react-icons/fi';
import { SiReact, SiNodedotjs, SiJavascript, SiPython, SiMongodb, SiDocker, SiLinux, SiNginx, SiExpress, SiTailwindcss, SiGit, SiPostman, SiVisualstudiocode, SiFigma } from 'react-icons/si';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  // Initialiser les données
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      // Initialiser les données de base
      await axios.post(`${API_BASE_URL}/api/seed-data`);
      
      // Charger toutes les données
      await Promise.all([
        loadProjects(),
        loadSkills(),
        loadExperiences()
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadSkills = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/skills`);
      setSkills(response.data);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const loadExperiences = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/experiences`);
      setExperiences(response.data);
    } catch (error) {
      console.error('Error loading experiences:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormStatus('sending');
      await axios.post(`${API_BASE_URL}/api/contact`, contactForm);
      setFormStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(''), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 5000);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  const filteredProjects = projects.filter(project => 
    filterCategory === 'all' || project.category === filterCategory
  );

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const skillIcons = {
    'JavaScript': SiJavascript,
    'React': SiReact,
    'Node.js': SiNodedotjs,
    'Python': SiPython,
    'MongoDB': SiMongodb,
    'Docker': SiDocker,
    'Linux': SiLinux,
    'Nginx': SiNginx,
    'Express': SiExpress,
    'Tailwind': SiTailwindcss,
    'Git': SiGit,
    'Postman': SiPostman,
    'VS Code': SiVisualstudiocode,
    'Figma': SiFigma,
    'Photoshop': SiPhotoshop
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement du portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gradient">BEZARA Kemuel</h1>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
                    <button
                      key={item}
                      onClick={() => handleScroll(item)}
                      className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-primary-500 ${
                        activeSection === item ? 'nav-active' : ''
                      }`}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleScroll(item)}
                    className="block w-full text-left px-3 py-2 text-base font-medium hover:text-primary-500 transition-colors"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
          <div className="absolute inset-0 gradient-animation opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-primary-500 text-lg font-medium">Bonjour, je suis</p>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                      BEZARA <span className="text-gradient">Kemuel</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                      Développeur Full Stack & Administrateur Réseau
                    </p>
                  </div>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                    Passionné par le développement web moderne et l'administration des systèmes réseau, 
                    je crée des solutions innovantes qui transforment les idées en réalité digitale.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => handleScroll('projects')}
                      className="btn-primary inline-flex items-center"
                    >
                      Voir mes projets
                      <FiArrowRight className="ml-2 w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleScroll('contact')}
                      className="btn-outline inline-flex items-center"
                    >
                      Me contacter
                      <FiMail className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex space-x-6">
                    <a href="https://github.com/bezkemuel" className="social-link">
                      <FiGithub className="w-6 h-6" />
                    </a>
                    <a href="https://linkedin.com/in/bezara-kemuel" className="social-link">
                      <FiLinkedin className="w-6 h-6" />
                    </a>
                    <a href="https://twitter.com/bezkemuel" className="social-link">
                      <FiTwitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxkZXZlbG9wZXJ8ZW58MHx8fHwxNzUyNzUxODYwfDA&ixlib=rb-4.1.0&q=85"
                    alt="BEZARA Kemuel - Développeur"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <FiCode className="w-6 h-6" />
                    <span className="font-semibold">2+ ans d'expérience</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title text-gradient">À propos de moi</h2>
              <p className="section-subtitle">
                Découvrez mon parcours et mes passions
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Je suis un développeur full stack passionné avec une expertise en administration réseau. 
                    Mon approche combine créativité technique et rigueur systémique pour créer des solutions 
                    digitales robustes et scalables.
                  </p>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Spécialisé dans le développement web moderne avec React, Node.js, et l'écosystème JavaScript, 
                    je maîtrise également les aspects infrastructure avec Linux, Docker et l'administration réseau.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <FiCode className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Développement</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Full Stack</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <FiServer className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Administration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Systèmes & Réseau</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Mes domaines d'expertise
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { icon: FiGlobe, title: 'Développement Web', desc: 'Applications React, Node.js, APIs REST' },
                      { icon: FiDatabase, title: 'Base de données', desc: 'MongoDB, PostgreSQL, Redis' },
                      { icon: FiServer, title: 'Infrastructure', desc: 'Linux, Docker, Nginx, Cloud' },
                      { icon: FiShield, title: 'Sécurité', desc: 'Sécurité réseau, authentification, HTTPS' },
                      { icon: FiTool, title: 'DevOps', desc: 'CI/CD, monitoring, automatisation' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                          <item.icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title text-gradient">Compétences</h2>
              <p className="section-subtitle">
                Technologies et outils que je maîtrise
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    {category}
                  </h3>
                  
                  <div className="space-y-4">
                    {categorySkills.map((skill) => {
                      const IconComponent = skillIcons[skill.name];
                      return (
                        <div key={skill.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {IconComponent && <IconComponent className="w-5 h-5 text-primary-500" />}
                              <span className="font-medium text-gray-900 dark:text-white">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="skill-bar">
                            <div 
                              className="skill-progress"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title text-gradient">Mes Projets</h2>
              <p className="section-subtitle">
                Découvrez mes réalisations et projets phares
              </p>
            </div>
            
            {/* Filtres */}
            <div className="filter-buttons mb-12">
              {['all', 'web', 'network', 'mobile'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`filter-button ${filterCategory === category ? 'active' : ''}`}
                >
                  {category === 'all' ? 'Tous' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="project-card"
                >
                  <div className="relative">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="project-image"
                    />
                    {project.featured && (
                      <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Projet phare
                      </div>
                    )}
                  </div>
                  
                  <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-tech">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="tag">{tech}</span>
                      ))}
                    </div>
                    
                    <div className="project-links">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm inline-flex items-center"
                        >
                          <FiEye className="w-4 h-4 mr-2" />
                          Démo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline text-sm inline-flex items-center"
                        >
                          <FiGithub className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title text-gradient">Expérience</h2>
              <p className="section-subtitle">
                Mon parcours professionnel et mes réalisations
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="timeline">
                {experiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="timeline-item"
                  >
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-date">
                        {new Date(experience.start_date).toLocaleDateString('fr-FR', { 
                          year: 'numeric', 
                          month: 'long' 
                        })} - {
                          experience.current ? 'Présent' : 
                          new Date(experience.end_date).toLocaleDateString('fr-FR', { 
                            year: 'numeric', 
                            month: 'long' 
                          })
                        }
                      </div>
                      <h3 className="timeline-title">{experience.position}</h3>
                      <p className="text-primary-500 font-medium mb-3">{experience.company}</p>
                      <p className="timeline-description">{experience.description}</p>
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, index) => (
                            <span key={index} className="tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title text-gradient">Contact</h2>
              <p className="section-subtitle">
                Travaillons ensemble sur votre prochain projet
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Restons en contact
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                      Je suis toujours intéressé par de nouveaux projets et opportunités. 
                      N'hésitez pas à me contacter pour discuter de votre vision.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <FiMail className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                        <p className="text-gray-600 dark:text-gray-300">kemuel.bezara@example.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <FiPhone className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Téléphone</h4>
                        <p className="text-gray-600 dark:text-gray-300">+33 6 12 34 56 78</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                        <FiMapPin className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Localisation</h4>
                        <p className="text-gray-600 dark:text-gray-300">Paris, France</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-6">
                    <a href="https://github.com/bezkemuel" className="social-link">
                      <FiGithub className="w-6 h-6" />
                    </a>
                    <a href="https://linkedin.com/in/bezara-kemuel" className="social-link">
                      <FiLinkedin className="w-6 h-6" />
                    </a>
                    <a href="https://twitter.com/bezkemuel" className="social-link">
                      <FiTwitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="form-label">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="form-input"
                        placeholder="Votre nom"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="form-input"
                        placeholder="votre@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Sujet</label>
                      <input
                        type="text"
                        required
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        className="form-input"
                        placeholder="Sujet de votre message"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        className="form-input"
                        placeholder="Votre message..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                    </button>
                    
                    {formStatus === 'success' && (
                      <div className="alert success">
                        Message envoyé avec succès ! Je vous répondrai bientôt.
                      </div>
                    )}
                    
                    {formStatus === 'error' && (
                      <div className="alert error">
                        Une erreur est survenue. Veuillez réessayer.
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gradient mb-4">BEZARA Kemuel</h3>
                <p className="text-gray-300 mb-6">
                  Développeur Full Stack & Administrateur Réseau passionné par l'innovation technologique.
                </p>
                <div className="flex space-x-4">
                  <a href="https://github.com/bezkemuel" className="social-link">
                    <FiGithub className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com/in/bezara-kemuel" className="social-link">
                    <FiLinkedin className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com/bezkemuel" className="social-link">
                    <FiTwitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2">
                  {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((item) => (
                    <li key={item}>
                      <button
                        onClick={() => handleScroll(item)}
                        className="text-gray-300 hover:text-primary-500 transition-colors"
                      >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-gray-300">
                  <p>kemuel.bezara@example.com</p>
                  <p>+33 6 12 34 56 78</p>
                  <p>Paris, France</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 BEZARA Kemuel. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;