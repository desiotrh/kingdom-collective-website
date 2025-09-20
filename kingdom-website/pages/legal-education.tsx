import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LegalEducationPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 'family-law-fundamentals',
      title: 'Family Law Fundamentals',
      description: 'Master the essential concepts of family law including divorce, custody, support, and property division.',
      shortDescription: 'Essential family law concepts for self-represented litigants.',
      duration: '4-5 hours',
      difficulty: 'beginner',
      category: 'family-law',
      thumbnail: '/education/thumbnails/family-law-fundamentals.jpg',
      modules: 3,
      quizzes: 1,
      certificate: true,
      featured: true
    },
    {
      id: 'california-family-law',
      title: 'California Family Law',
      description: 'Comprehensive guide to family law in California, covering divorce, custody, and support.',
      shortDescription: 'Complete family law guide for California residents.',
      duration: '6-8 hours',
      difficulty: 'intermediate',
      category: 'family-law',
      thumbnail: '/education/thumbnails/california-family-law.jpg',
      modules: 4,
      quizzes: 2,
      certificate: true,
      featured: false
    },
    {
      id: 'document-preparation',
      title: 'Legal Document Preparation',
      description: 'Learn how to prepare, complete, and file legal documents correctly.',
      shortDescription: 'Master legal document preparation and filing.',
      duration: '5-6 hours',
      difficulty: 'intermediate',
      category: 'document-preparation',
      thumbnail: '/education/thumbnails/document-preparation.jpg',
      modules: 3,
      quizzes: 1,
      certificate: true,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', icon: '📚' },
    { id: 'family-law', name: 'Family Law', icon: '👨‍👩‍👧‍👦' },
    { id: 'document-preparation', name: 'Documents', icon: '📄' },
    { id: 'court-procedures', name: 'Court Procedures', icon: '⚖️' }
  ];

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'all' || course.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Link
              href="/stand"
              className="inline-flex items-center text-gold-400 hover:text-gold-300 transition-colors mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Kingdom Stand
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Legal Education Hub
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Master family law concepts with interactive courses, expert-verified content, and comprehensive learning tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://apps.apple.com/app/kingdom-stand/id1234567890"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-gold-400 hover:bg-gold-500 transition-colors"
            >
              Download Kingdom Stand
            </Link>
            <Link
              href="/stand#legal-education"
              className="inline-flex items-center justify-center px-8 py-3 border border-gold-400 text-base font-medium rounded-md text-gold-400 hover:bg-gold-400 hover:text-slate-900 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Why Choose Our Legal Education Hub?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon="🎯"
              title="Expert-Verified Content"
              description="All courses reviewed by licensed attorneys and legal professionals to ensure accuracy and relevance."
            />
            <FeatureCard
              icon="📱"
              title="Mobile-First Learning"
              description="Learn anywhere, anytime with our mobile-optimized platform designed for busy schedules."
            />
            <FeatureCard
              icon="📊"
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics, achievements, and completion certificates."
            />
            <FeatureCard
              icon="🔒"
              title="Privacy-Focused"
              description="Your learning data stays secure with local storage and industry-standard encryption."
            />
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Course Categories
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full border-2 transition-colors ${
                  selectedCategory === category.id
                    ? 'border-gold-400 bg-gold-400 text-slate-900'
                    : 'border-slate-600 text-white hover:border-gold-400'
                }`}
              >
                <span className="text-xl mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Available Courses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Learning Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <LearningFeature
                icon="🎥"
                title="Interactive Video Content"
                description="Engaging video lessons with transcripts, captions, and downloadable content for offline learning."
              />
              <LearningFeature
                icon="🧩"
                title="Interactive Exercises"
                description="Hands-on learning with matching games, scenario-based exercises, and practical applications."
              />
              <LearningFeature
                icon="📝"
                title="Personal Notes & Bookmarks"
                description="Take notes, bookmark important content, and create your personal learning library."
              />
            </div>
            
            <div className="space-y-8">
              <LearningFeature
                icon="🏆"
                title="Achievement System"
                description="Earn badges and certificates as you complete courses and master legal concepts."
              />
              <LearningFeature
                icon="📈"
                title="Learning Analytics"
                description="Track your progress, identify strengths and weaknesses, and optimize your learning path."
              />
              <LearningFeature
                icon="👥"
                title="Community Support"
                description="Connect with other learners, share experiences, and get support from the community."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 shadow-lg">
            <div className="text-6xl mb-6">🎓</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Master Legal Concepts?
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Download Kingdom Stand today and access our comprehensive Legal Education Hub. 
              Start your journey toward legal confidence and empowerment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://apps.apple.com/app/kingdom-stand/id1234567890"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 transition-colors"
              >
                Download Kingdom Stand
              </Link>
              <Link
                href="/stand"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore All Features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string; }) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 text-center hover:border-gold-400/50 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-blue-200">{description}</p>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 hover:border-gold-400/50 transition-colors">
      <div className="relative mb-4">
        <div className="w-full h-48 bg-slate-600 rounded-lg flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
        {course.featured && (
          <div className="absolute top-2 right-2 bg-gold-400 text-slate-900 px-2 py-1 rounded text-xs font-bold">
            FEATURED
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(course.difficulty)}`}>
          {course.difficulty.toUpperCase()}
        </span>
        <span className="text-blue-300 text-sm">{course.duration}</span>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
      <p className="text-blue-200 text-sm mb-4">{course.shortDescription}</p>
      
      <div className="flex items-center justify-between text-sm text-blue-300 mb-4">
        <span>{course.modules} modules</span>
        <span>{course.quizzes} quizzes</span>
        <span>{course.certificate ? 'Certificate' : 'No Certificate'}</span>
      </div>
      
      <button className="w-full bg-gold-400 text-slate-900 py-2 px-4 rounded-lg font-semibold hover:bg-gold-500 transition-colors">
        Start Course
      </button>
    </div>
  );
}

function LearningFeature({ icon, title, description }: { icon: string; title: string; description: string; }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-blue-200">{description}</p>
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner': return 'bg-green-500';
    case 'intermediate': return 'bg-yellow-500';
    case 'advanced': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}
