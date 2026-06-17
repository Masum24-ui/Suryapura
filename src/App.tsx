import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Menu,
  X,
  Sun,
  GraduationCap,
  Wheat,
  Route,
  Building2,
  CreditCard,
  Users,
  Bell,
  TrendingUp,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  FileText,
  Droplet,
  Zap,
  Trash2,
  Home,
  BookOpen,
  Award,
  Target,
  Heart,
  ArrowRight,
  Star,
  Quote,
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

type Program = {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'farmers' | 'infrastructure' | 'governance' | 'digital';
  status: 'active' | 'completed' | 'upcoming';
  beneficiaries: number;
  budget: string | null;
  image_url: string | null;
};

type News = {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'event' | 'achievement' | 'alert';
  date: string;
  image_url: string | null;
};

type Grievance = {
  id: string;
  name: string;
  phone: string;
  category: 'roads' | 'water' | 'electricity' | 'sanitation' | 'other';
  description: string;
  location: string;
  status: 'pending' | 'in_progress' | 'resolved';
};

type VillageStat = {
  id: string;
  stat_name: string;
  stat_value: string;
  stat_icon: string;
  category: string;
};

const categoryIcons: Record<string, React.ElementType> = {
  education: GraduationCap,
  farmers: Wheat,
  infrastructure: Route,
  governance: Building2,
  digital: CreditCard,
  roads: Route,
  water: Droplet,
  electricity: Zap,
  sanitation: Trash2,
  other: FileText,
};

const categoryColors: Record<string, string> = {
  education: 'from-blue-500 to-indigo-600',
  farmers: 'from-green-500 to-emerald-600',
  infrastructure: 'from-orange-500 to-amber-600',
  governance: 'from-purple-500 to-violet-600',
  digital: 'from-cyan-500 to-teal-600',
};

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [stats, setStats] = useState<VillageStat[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!supabase) return;
    const [statsRes, programsRes, newsRes, grievancesRes] = await Promise.all([
      supabase.from('village_stats').select('*'),
      supabase.from('programs').select('*').order('created_at', { ascending: false }),
      supabase.from('news').select('*').order('date', { ascending: false }).limit(4),
      supabase.from('grievances').select('*').order('created_at', { ascending: false }).limit(5),
    ]);
    if (statsRes.data) setStats(statsRes.data);
    if (programsRes.data) setPrograms(programsRes.data);
    if (newsRes.data) setNews(newsRes.data);
    if (grievancesRes.data) setGrievances(grievancesRes.data);
  }

  async function submitGrievance(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setFormSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const grievance = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      category: formData.get('category') as Grievance['category'],
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      status: 'pending' as const,
    };
    const { error } = await supabase.from('grievances').insert([grievance]);
    setFormSubmitting(false);
    if (!error) {
      setShowGrievanceModal(false);
      fetchData();
      form.reset();
    }
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'farmers', label: 'Farmers', icon: Wheat },
    { id: 'infrastructure', label: 'Roads', icon: Route },
    { id: 'governance', label: 'Panchayat', icon: Building2 },
    { id: 'digital', label: 'Digital ID', icon: CreditCard },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getStatIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      users: Users,
      home: Home,
      'book-open': BookOpen,
      'graduation-cap': GraduationCap,
      wheat: Wheat,
      map: MapPin,
      route: Route,
      droplet: Droplet,
      'id-card': CreditCard,
      'file-check': FileText,
      default: Target,
    };
    return icons[iconName] || icons.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-earth-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-earth-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-serif font-bold text-gray-900">Suryapura</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Village Development Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeSection === item.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setShowGrievanceModal(true)}
                className="ml-4 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                File Grievance
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium flex items-center gap-3 ${
                    activeSection === item.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowGrievanceModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                File Grievance
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Village landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${heroInView ? 'animate-slide-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Development in Progress</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                Empowering Our Village for a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">
                  Brighter Tomorrow
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed">
                Welcome to Suryapura, where tradition meets technology. Our village is pioneering
                a new era of rural development with digital services, sustainable farming, and
                world-class infrastructure.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollToSection('governance')}
                  className="group px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  Explore Portal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('infrastructure')}
                  className="px-6 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  View Progress
                </button>
              </div>
            </div>

            {/* Hero Character Card */}
            <div className={`hidden lg:block ${heroInView ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                  <div className="text-center mb-6">
                    <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 ring-4 ring-white/30 shadow-2xl">
                      <Users className="w-14 h-14 text-white" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white">Shri Ramesh Kumar</h3>
                    <p className="text-secondary-300 font-medium">Sarpanch, Suryapura Gram Panchayat</p>
                  </div>

                  <Quote className="w-8 h-8 text-primary-400/50 mx-auto mb-4" />

                  <blockquote className="text-gray-300 text-center italic leading-relaxed">
                    "Our vision is simple - every citizen of Suryapura should have access to quality
                    education, modern healthcare, and digital services. Together, we are building
                    a model village that the nation can be proud of."
                  </blockquote>

                  <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">12+</div>
                      <div className="text-xs text-gray-400">Years Leading</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">45+</div>
                      <div className="text-xs text-gray-400">Projects</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">98%</div>
                      <div className="text-xs text-gray-400">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {stats.slice(0, 5).map((stat, index) => {
                const Icon = getStatIcon(stat.stat_icon);
                return (
                  <div key={stat.id} className="text-center group" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.stat_value}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.stat_name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 sm:py-24 bg-gradient-to-b from-white to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium text-sm">Education & Learning</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
              Building Tomorrow's Leaders
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quality education is the foundation of development. Suryapura has invested heavily in
              educational infrastructure and programs for all age groups.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs
              .filter((p) => p.category === 'education')
              .map((program, index) => (
                <div
                  key={program.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {program.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            program.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : program.status === 'completed'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{program.beneficiaries} beneficiaries</span>
                      </div>
                      {program.budget && (
                        <span className="text-sm font-semibold text-primary-600">{program.budget}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Education Stats */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-blue-100">Schools</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-bold">78%</div>
                  <div className="text-green-100">Literacy Rate</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-bold">45+</div>
                  <div className="text-amber-100">Scholarships</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmers Section */}
      <section id="farmers" className="py-16 sm:py-24 bg-gradient-to-b from-green-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
              <Wheat className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium text-sm">Farmers Welfare</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
              Empowering Our Annadatas
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Agriculture is the backbone of Suryapura. We support our farmers with modern techniques,
              government schemes, and direct market access.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-green-600 mb-2">382</div>
              <div className="text-sm text-gray-500">Farmer Families</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-amber-600 mb-2">1,450</div>
              <div className="text-sm text-gray-500">Hectares Cultivated</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-blue-600 mb-2">847</div>
              <div className="text-sm text-gray-500">PM-Kisan Beneficiaries</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-sm text-gray-500">Seed Varieties</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Programs */}
            <div className="space-y-6">
              {programs
                .filter((p) => p.category === 'farmers')
                .map((program) => {
                  const Icon = categoryIcons[program.category];
                  return (
                    <div
                      key={program.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {program.image_url && (
                          <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                            <img
                              src={program.image_url}
                              alt={program.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
                              <p className="text-gray-600 text-sm mt-1">{program.description}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                  {program.beneficiaries} enrolled
                                </span>
                                {program.budget && (
                                  <span className="text-sm font-semibold text-green-600">
                                    {program.budget}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white h-fit">
              <h3 className="text-2xl font-bold mb-4">Krishi Sahayta Kendra</h3>
              <p className="text-green-100 mb-6">
                Visit our agriculture help center for scheme registration, crop advisories, and
                market price information.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-200" />
                  <span>Panchayat Office, Main Market Road</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-200" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-200" />
                  <span>Mon-Sat: 9:00 AM - 5:00 PM</span>
                </div>
              </div>
              <button className="mt-6 w-full py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section id="infrastructure" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
              <Route className="w-5 h-5 text-orange-600" />
              <span className="text-orange-700 font-medium text-sm">Roads & Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
              Building Connectivity
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every village needs strong infrastructure. From all-weather roads to 24/7 water supply,
              our development projects touch every household.
            </p>
          </div>

          {/* Progress Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {programs
              .filter((p) => p.category === 'infrastructure')
              .map((program) => (
                <div
                  key={program.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                >
                  {program.image_url && (
                    <div className="relative h-56">
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white">{program.title}</h3>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            program.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {program.beneficiaries} beneficiaries
                        </span>
                      </div>
                      {program.budget && (
                        <span className="text-lg font-bold text-orange-600">{program.budget}</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {program.status === 'active' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-orange-600">65%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-[65%] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {/* Infrastructure Stats */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400">Road Connectivity</div>
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">98%</div>
                <div className="text-gray-400">Water Access</div>
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">100%</div>
                <div className="text-gray-400">Electrification</div>
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">85%</div>
                <div className="text-gray-400">Sanitation</div>
                <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section id="governance" className="py-16 sm:py-24 bg-gradient-to-b from-purple-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-4">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="text-purple-700 font-medium text-sm">Gram Panchayat</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
              Transparent Governance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your voice matters. The Suryapura Gram Panchayat operates with full transparency,
              keeping citizens informed about every decision and development.
            </p>
          </div>

          {/* News & Updates */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {news.map((item) => {
              const categoryStyles = {
                announcement: 'bg-blue-100 text-blue-700',
                event: 'bg-purple-100 text-purple-700',
                achievement: 'bg-green-100 text-green-700',
                alert: 'bg-red-100 text-red-700',
              };
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {item.image_url && (
                    <div className="h-36 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          categoryStyles[item.category]
                        }`}
                      >
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Governance Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Grievances */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Grievances</h3>
                <button
                  onClick={() => setShowGrievanceModal(true)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                >
                  File New <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {grievances.length > 0 ? (
                  grievances.slice(0, 4).map((grievance) => {
                    const Icon = categoryIcons[grievance.category];
                    const statusStyles = {
                      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
                      in_progress: {
                        bg: 'bg-blue-100',
                        text: 'text-blue-700',
                        icon: TrendingUp,
                      },
                      resolved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
                    };
                    const status = statusStyles[grievance.status];
                    return (
                      <div
                        key={grievance.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-900 truncate">
                              {grievance.name}
                            </span>
                            <span
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg} ${status.text}`}
                            >
                              <status.icon className="w-3 h-3" />
                              {grievance.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                            {grievance.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {grievance.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">No grievances filed yet</div>
                )}
              </div>
            </div>

            {/* Panchayat Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-6 sm:p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Gram Sabha Meetings</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
                    <Calendar className="w-6 h-6" />
                    <div>
                      <div className="font-medium">Next Meeting</div>
                      <div className="text-purple-200 text-sm">June 25, 2026 at 10:00 AM</div>
                    </div>
                  </div>
                  <p className="text-sm text-purple-100">
                    All villagers are requested to attend the Gram Sabha to discuss development
                    projects and community issues.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="flex-1 text-gray-700">Meeting Minutes Archive</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="flex-1 text-gray-700">Budget & Expenditure</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="flex-1 text-gray-700">Ward Representatives</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Identity Section */}
      <section id="digital" className="py-16 sm:py-24 bg-gradient-to-b from-cyan-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 rounded-full mb-4">
                <CreditCard className="w-5 h-5 text-cyan-600" />
                <span className="text-cyan-700 font-medium text-sm">Digital Identity</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-6">
                One ID, Endless Services
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Every resident of Suryapura now has a unique Digital ID that connects them to all
                government services, schemes, and benefits. No more multiple registrations or lost
                documents.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    title: 'Instant Scheme Access',
                    desc: 'Auto-enroll in eligible schemes with one click',
                    icon: Target,
                  },
                  {
                    title: 'Document Wallet',
                    desc: 'All your certificates in one secure place',
                    icon: FileText,
                  },
                  {
                    title: 'Real-time Updates',
                    desc: 'Track applications and grievances live',
                    icon: Bell,
                  },
                  {
                    title: 'Family Linking',
                    desc: 'Manage services for your entire family',
                    icon: Heart,
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                Apply for Digital ID
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Digital ID Card Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-cyan-600 to-teal-700 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sun className="w-8 h-8 text-cyan-600" />
                    <div>
                      <div className="font-bold text-gray-900">SURYAPURA</div>
                      <div className="text-xs text-gray-500">Digital Village ID</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Priya Sharma</div>
                      <div className="text-gray-500">Ward 3, House No. 72</div>
                      <div className="mt-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-700">ID: SUR-2024-00342</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs">Valid Until</div>
                      <div className="font-semibold text-gray-900">Dec 2029</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-gray-500 text-xs">Linked Schemes</div>
                      <div className="font-semibold text-gray-900">4 Active</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-600 font-medium">Verified</span>
                    </div>
                    <div className="text-xs text-gray-400">scan for verification</div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-cyan-100 text-sm">
                    2,156 Digital IDs issued so far
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Suryapura</h3>
                  <p className="text-gray-400 text-sm">Village Development Portal</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering rural India through digital transformation, sustainable development, and
                community-led governance.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection('education')} className="hover:text-white transition-colors">
                    Education
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('farmers')} className="hover:text-white transition-colors">
                    Farmers Welfare
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('infrastructure')} className="hover:text-white transition-colors">
                    Infrastructure
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('governance')} className="hover:text-white transition-colors">
                    Panchayat
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Suryapura Gram Panchayat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Sat: 9 AM - 5 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>2026 Suryapura Gram Panchayat. All rights reserved.</p>
            <p className="mt-2">Built with care for our village community.</p>
          </div>
        </div>
      </footer>

      {/* Grievance Modal */}
      {showGrievanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">File a Grievance</h2>
                  <p className="text-gray-500 text-sm mt-1">We'll respond within 48 hours</p>
                </div>
                <button
                  onClick={() => setShowGrievanceModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={submitGrievance} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="roads">Roads & Transport</option>
                    <option value="water">Water Supply</option>
                    <option value="electricity">Electricity</option>
                    <option value="sanitation">Sanitation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    name="location"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="e.g., Ward 3, Near Temple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Submit Grievance
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
