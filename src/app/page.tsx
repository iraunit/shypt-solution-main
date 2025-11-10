'use client';

import {
  ArrowRight,
  ExternalLink,
  Github,
  Globe,
  Mail,
  Play,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type Project = {
  title: string;
  description: string;
  image: string | null;
  url: string;
  type?: string;
  tech?: string[];
  stars?: string | number;
  forks?: string | number;
};

type AnimatedStats = {
  projects: number;
  users: number;
};

const projectLinks: string[] = [
  'https://codingkaro.in',
  'https://raunit.dev',
  'https://joblistings.fyi',
  'https://play.google.com/store/apps/details?id=com.shyptsolution.mdmbiharcalculator&hl=en-US',
  'https://play.google.com/store/apps/details?id=com.shyptsolution.codingkaro&hl=en_IN',
  'https://chromewebstore.google.com/detail/codingkaro/ndnbpbolkacjjcjhmgfoleilolocmnhg?hl=en',
  'https://chromewebstore.google.com/detail/connectengage-email-link/gcfniighledpnfglhdljbmilonamdlle',
  'https://connectengage.shyptsolution.com/',
  'https://chromewebstore.google.com/detail/get-link-connecting-you/pcphjmlofajahcidbgfgphicmmdfkdif?hl=en&authuser=0',
  'https://play.google.com/store/apps/details?id=com.shyptsolution.quicklink&hl=en',
  'https://raunit.dev/project/google-play-scraper-live',
  'https://www.codingkaro.in/jobs-internships/leetcode-compensation',
  'https://www.codingkaro.in/blog/text-sticker-bomber-whatsapp-telegram-whatsapp-bomber-unlimited-message-prank-with-friends',
  'https://play.google.com/store/apps/details?id=com.shyptsolution.classproject&hl=en_IN',
  'https://zohocrm.shyptsolution.com/',
  'https://interviewexperiences.in',
];

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedStats, setAnimatedStats] = useState<AnimatedStats>({
    projects: 0,
    users: 0,
  });

  const heroRef = useRef<HTMLDivElement | null>(null);


  const scrollToSection = useCallback((selector: string) => {
    const target = document.querySelector(selector);
    if (!target) return;

    const headerOffset = 96;
    const rect = target.getBoundingClientRect();
    const targetPosition = rect.top + window.pageYOffset;
    const offsetPosition = targetPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const projectData = await Promise.all(
          projectLinks.map(async (link) => {
            try {
              const response = await fetch('/api/fetch-metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: link }),
              });

              if (response.ok) {
                const data = (await response.json()) as Partial<Project>;
                return {
                  title: data.title ?? new URL(link).hostname,
                  description:
                    data.description ?? 'Indie project highlight from Shypt Solution.',
                  image: data.image ?? null,
                  url: link,
                  type: data.type ?? 'project',
                  tech: data.tech ?? [],
                  stars: data.stars,
                  forks: data.forks,
                };
              }
            } catch (error) {
              console.error('Metadata fetch failed:', error);
            }

            return {
              title: new URL(link).hostname,
              description: 'Indie project highlight from Shypt Solution.',
              image: null,
              url: link,
              type: 'project',
            } satisfies Project;
          }),
        );

        setProjects(projectData);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setAnimatedStats({
            projects: 10,
            users: 50000,
          });
        }
      },
      { threshold: 0.3 },
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    loadProjects();
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactLoading(true);

    const form = e.currentTarget as HTMLFormElement & {
      fullname: HTMLInputElement;
      email: HTMLInputElement;
      subject: HTMLInputElement;
      message: HTMLTextAreaElement;
    };

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullname.value,
          email: form.email.value,
          subject: form.subject.value,
          message: form.message.value,
        }),
      });

      if (response.ok) {
        form.reset();
        alert('Message sent successfully!');
      } else {
        const error = (await response.json()) as { message?: string };
        alert(`Error: ${error.message ?? 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="relative z-10">
        <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                    Shypt Solution
                  </h1>
                  <p className="text-xs text-gray-400">Indie Software Projects by Raunit Verma</p>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#products"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection('#products');
                  }}
                  className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                >
                  Projects
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </a>
                <a
                  href="#features"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection('#features');
                  }}
                  className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </a>
                <a
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection('#contact');
                  }}
                  className="text-sm text-gray-300 hover:text-white transition-colors relative group"
                >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300" />
                </a>
                <a
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection('#contact');
                  }}
                  className="relative group bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 rounded-full font-semibold text-sm overflow-hidden"
                >
                  <span className="relative z-10">Say Hello</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </a>
              </div>
            </div>
          </div>
        </nav>

        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center pt-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="relative">
              <div
                className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-bounce"
                style={{ animationDuration: '6s' }}
              />
              <div
                className="absolute -top-10 -right-32 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-bounce"
                style={{ animationDuration: '4s', animationDelay: '2s' }}
              />

              <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium mb-8 group hover:bg-white/10 transition-all duration-300">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400 animate-pulse" />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Indie Software by Raunit Verma
                </span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                <span className="block text-white animate-fade-in-up">Shypt Solution</span>
                <span
                  className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fade-in-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  Projects Built
                </span>
                <span
                  className="block text-white animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  For Everyone
                </span>
              </h1>

              <p
                className="text-base md:text-lg text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up"
                style={{ animationDelay: '0.6s' }}
              >
                I’m an independent software developer who loves turning ideas into products people
                actually use. From developer tooling and cross-device sharing to education platforms
                and data utilities, every project under Shypt Solution is crafted for real-world
                impact—and already trusted by 50k+ users.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up"
                style={{ animationDelay: '0.8s' }}
              >
                <button
                  onClick={() => scrollToSection('#products')}
                  className="group relative bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-full font-semibold text-base overflow-hidden transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    Browse Projects
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </button>

                <button
                  onClick={() =>
                    window.open('https://www.linkedin.com/in/iraunit', '_blank', 'noopener,noreferrer')
                  }
                  className="group flex items-center px-8 py-4 border border-white/20 rounded-full font-semibold text-base hover:bg-white/5 transition-all duration-300"
                >
                  <Play className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  About Raunit
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-1 h-16 bg-gradient-to-b from-transparent via-purple-500 to-transparent rounded-full" />
          </div>
        </section>

        <section id="stats-section" className="py-20 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  label: 'Active Products',
                  value: animatedStats.projects ? `${animatedStats.projects}+` : '10+',
                  icon: Zap,
                },
                {
                  label: 'Users Reached',
                  value: animatedStats.users ? `${Math.round(animatedStats.users / 1000)}k+` : '50k+',
                  icon: Users,
                },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative w-16 h-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="relative py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-5 text-4xl font-black md:text-5xl bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Projects Under Shypt Solution
              </h2>
              <p className="mx-auto text-base text-gray-300 md:text-lg max-w-3xl">
                A collection spanning web, mobile, browser, and backend—each built to solve real problems
                for communities, creators, and teams.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="relative">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500" />
                  <div
                    className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500"
                    style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}
                  />
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/40 p-12 text-center text-gray-300 backdrop-blur-xl">
                No projects found right now. Check back soon!
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((project, index) => (
                  <article
                    key={project.url ?? `${project.title}-${index}`}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
                  >
                    <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

                    <div className="relative flex h-full flex-col gap-5">
                      <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/20">
                        {project.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.image}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white transition-transform duration-500 group-hover:rotate-3">
                              <Globe className="h-10 w-10" />
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                              {project.type === 'github' ? 'Open Source' : 'Project'}
                            </span>
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-white/20 bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between gap-5">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-purple-200">
                              {project.title}
                            </h3>
                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-green-400">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                              Live
                            </span>
                          </div>

                          <p className="text-sm leading-relaxed text-gray-300">
                            {project.description ??
                              'Indie project crafted to solve real problems with thoughtful design and reliable technology.'}
                          </p>

                          {project.tech && project.tech.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.tech.map((tech, techIndex) => (
                                <span
                                  key={`${project.url}-tech-${techIndex}`}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-white/10"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm font-semibold text-purple-300 transition-transform hover:translate-x-1 hover:text-purple-100"
                          >
                            Open Project
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>

                          {project.type === 'github' ? (
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                {project.stars ?? '—'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Github className="h-4 w-4" />
                                {project.forks ?? '—'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs uppercase tracking-wide text-gray-500">
                              {new URL(project.url).hostname.replace('www.', '')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="features" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-5 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                My Project Features
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
                Highlights drawn from the products live today across web, mobile, browser, and backend.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Developer Communities',
                  description:
                    'CodingKaro’s web platform, Android app, and Chrome extension keep devs plugged into contests, jobs, and curated resources.',
                },
                {
                  icon: Zap,
                  title: 'Cross-Device Sharing',
                  description:
                    'Get Link apps, extensions, and backend power fast, secure messaging and file transfer between phones, tablets, and desktop.',
                },
                {
                  icon: Users,
                  title: 'Productivity Extensions',
                  description:
                    'ConnectEngage utilities automate email validation and lead capture, while Zoho Mail CRM handles outreach workflows in one click.',
                },
                {
                  icon: TrendingUp,
                  title: 'Data & Insight Utilities',
                  description:
                    'Google Play Scraper Live and Leetcode Compensation surface real-time metrics engineers and researchers rely on.',
                },
                {
                  icon: Globe,
                  title: 'Learning & Campus Tools',
                  description:
                    'Attendance systems, resource hubs, and classroom apps streamline how students and teachers collaborate every day.',
                },
                {
                  icon: Sparkles,
                  title: 'Mobile Problem-Solving',
                  description:
                    'Android builds like MDM Calculator and Text & Sticker Bomber solve niche challenges with lightweight, offline-first design.',
                },
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                  <div className="relative bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-7 group-hover:border-white/20 transition-all duration-500 group-hover:-translate-y-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  <span className="block text-white">Ready to</span>
                  <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Collaborate
                  </span>
                  <span className="block text-white">or Say Hello?</span>
                </h2>

                <p className="text-base md:text-lg text-gray-300 mb-10 leading-relaxed">
                  Whether you’re a community organizer, indie maker, or team looking for a collaborator,
                  let’s chat about how these projects—or something new—can help.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: Mail,
                      title: 'Email Me',
                      info: 'raunit@raunit.dev',
                      color: 'from-purple-600 to-purple-400',
                    },
                  ].map((contact, index) => (
                    <div key={index} className="group flex items-center space-x-6">
                      <div className="relative">
                        <div
                          className={`absolute -inset-1 bg-gradient-to-r ${contact.color} rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000`}
                        />
                        <div className="relative w-14 h-14 bg-black rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
                          <contact.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-white text-base">{contact.title}</div>
                        <div className="text-sm text-gray-300">{contact.info}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition-all duration-1000" />
                <div className="relative bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="fullname"
                          className="block text-xs font-semibold mb-2 text-gray-200 uppercase tracking-wide"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          name="fullname"
                          required
                          className="w-full px-3.5 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold mb-2 text-gray-200 uppercase tracking-wide"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="w-full px-3.5 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 text-sm"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold mb-2 text-gray-200 uppercase tracking-wide"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="w-full px-3.5 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10 text-sm"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold mb-2 text-gray-200 uppercase tracking-wide"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        className="w-full px-3.5 py-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder-gray-400 resize-none transition-all duration-300 focus:bg-white/10 text-sm"
                        placeholder="Tell us about your project and goals..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full relative group/btn bg-gradient-to-r from-purple-600 to-blue-600 py-4 px-6 rounded-xl font-bold text-lg overflow-hidden disabled:opacity-50 transform hover:scale-[1.02] transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {contactLoading ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            Sending Message...
                          </div>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-500" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-16 border-t border-white/10 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-lg">Shypt Solution</div>
                <div className="text-xs text-gray-400">Indie Software Projects by Raunit Verma</div>
              </div>
              <div className="text-gray-400 text-sm">© 2025 Shypt Solution. Crafted by Raunit Verma.</div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

      `}</style>
    </div>
  );
}
