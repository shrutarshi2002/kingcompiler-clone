"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GoogleFormModal from "../../components/GoogleFormModal";
import FloatingDemoButton from "../../components/FloatingDemoButton";

export default function AboutPage() {
  const [isClient, setIsClient] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // SEO optimization - Add structured data only on client
  useEffect(() => {
    if (!isClient) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "KingCompiler Academy",
      alternateName: "KingCompiler",
      description:
        "Leading online academy for chess, coding, and AI education for kids. Trusted by 5,000+ students across 10+ countries.",
      url: "https://kingcompiler.com",
      logo: "https://kingcompiler.com/logo.png",
      sameAs: [
        "https://kingcompiler.substack.com",
        "https://linkedin.com/company/kingcompiler",
        "https://twitter.com/kingcompiler",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9038162791",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "India",
        addressLocality: "Dubai",
        addressRegion: "UAE",
      },
      founder: {
        "@type": "Person",
        name: "KingCompiler Team",
        jobTitle: "Founder & CEO",
      },
      foundingDate: "2020",
      numberOfEmployees: "50+",
      knowsAbout: [
        "Chess Education",
        "Coding for Kids",
        "AI Training",
        "Online Learning",
        "Child Development",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Educational Courses",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Online Chess Classes for Kids",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Coding Logic for Kids",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Generative AI for Kids",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Machine Learning and AI for Kids",
            },
          },
        ],
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isClient]);

  const stats = [
    { number: "5,000+", label: "Happy Students", icon: "👨‍🎓" },
    { number: "10+", label: "Countries", icon: "🌍" },
    { number: "4.9/5", label: "Average Rating", icon: "⭐" },
    { number: "100%", label: "Satisfaction Rate", icon: "💯" },
    { number: "50+", label: "Expert Coaches", icon: "👨‍🏫" },
    { number: "12", label: "Specialized Courses", icon: "📚" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Excellence in Education",
      description:
        "We maintain the highest standards in our curriculum and teaching methodologies, ensuring every child receives world-class education.",
    },
    {
      icon: "🤝",
      title: "Personalized Learning",
      description:
        "Every child is unique. We tailor our approach to match individual learning styles and pace, ensuring maximum engagement and growth.",
    },
    {
      icon: "🚀",
      title: "Innovation First",
      description:
        "We stay ahead of educational trends, incorporating cutting-edge technology and modern teaching techniques into our programs.",
    },
    {
      icon: "❤️",
      title: "Child-Centric Approach",
      description:
        "Children's happiness and development are at the heart of everything we do. We create a safe, nurturing environment for learning.",
    },
  ];

  const team = [
    {
      name: "Chess Masters",
      role: "International Chess Coaches",
      image: "/Expert/1.png",
      description: "FIDE-rated players with years of teaching experience",
    },
    {
      name: "Tech Experts",
      role: "Senior Software Engineers",
      image: "/Expert/2.png",
      description: "Industry professionals from top tech companies",
    },
    {
      name: "AI Specialists",
      role: "Machine Learning Engineers",
      image: "/Expert/3.png",
      description: "Experts in AI and emerging technologies",
    },
    {
      name: "Education Leaders",
      role: "Child Development Specialists",
      image: "/Expert/4.png",
      description: "Certified educators with psychology backgrounds",
    },
  ];

  const studentJourney = [
    {
      stage: "Stage 1",
      title: "Complete Beginner",
      description:
        "Students start with zero knowledge, learning basic concepts and building confidence through fun, interactive lessons.",
      icon: "🌱",
      duration: "0-3 months",
    },
    {
      stage: "Stage 2",
      title: "Foundation Builder",
      description:
        "Students develop core skills and understanding, practicing regularly and building a strong foundation for advanced learning.",
      icon: "🏗️",
      duration: "3-6 months",
    },
    {
      stage: "Stage 3",
      title: "Skill Developer",
      description:
        "Students master intermediate concepts, participate in competitions, and start applying their knowledge to real-world projects.",
      icon: "⚡",
      duration: "6-12 months",
    },
    {
      stage: "Stage 4",
      title: "Advanced Learner",
      description:
        "Students tackle complex challenges, mentor others, and develop leadership skills while preparing for championship-level competitions.",
      icon: "🚀",
      duration: "12-18 months",
    },
    {
      stage: "Stage 5",
      title: "Champion",
      description:
        "Students become experts in their field, win competitions, and serve as role models for new learners joining the academy.",
      icon: "🏆",
      duration: "18+ months",
    },
  ];

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  // 50 SEO-rich FAQs for About Us page
  const faqs = [
    {
      question: "What is KingCompiler Academy?",
      answer:
        "KingCompiler Academy is a leading online education platform specializing in chess, coding, and AI courses for children worldwide.",
    },
    {
      question: "Who can join KingCompiler Academy?",
      answer:
        "Our programs are designed for children aged 5 to 18, with courses tailored for all skill levels from beginner to advanced.",
    },
    {
      question: "What makes KingCompiler different from other academies?",
      answer:
        "We offer personalized learning, internationally certified coaches, modern curriculum, and a proven track record of student success.",
    },
    {
      question: "Are your courses live or recorded?",
      answer:
        "All our courses are conducted live online, ensuring real-time interaction and personalized feedback for every student.",
    },
    {
      question: "How do I book a free trial class?",
      answer:
        "You can book a free trial class by clicking the 'Start Free Trial' button or contacting our support team.",
    },
    {
      question: "What subjects do you teach?",
      answer:
        "We teach chess, coding (Scratch, Python, Web Development), AI, robotics, mathematics, and more.",
    },
    {
      question: "Are your instructors qualified?",
      answer:
        "Yes, our instructors are certified professionals, FIDE-rated chess players, and experienced educators from top tech companies.",
    },
    {
      question: "Do you offer certificates?",
      answer:
        "Yes, students receive certificates of completion and achievement badges for milestones.",
    },
    {
      question: "Can siblings join together?",
      answer:
        "Absolutely! We offer sibling discounts and encourage family participation.",
    },
    {
      question: "How do you ensure online safety for kids?",
      answer:
        "All sessions are monitored, and we use secure, child-friendly platforms to ensure a safe learning environment.",
    },
    {
      question: "What is the average class size?",
      answer:
        "We maintain small batch sizes (typically 6-10 students) to ensure personalized attention.",
    },
    {
      question: "What technology do I need to join?",
      answer:
        "A computer or tablet with internet access is required. We guide you through any software setup needed.",
    },
    {
      question: "Do you offer one-on-one classes?",
      answer:
        "Yes, we offer both group and one-on-one classes based on your child's needs.",
    },
    {
      question: "How do you track student progress?",
      answer:
        "We provide regular feedback, progress reports, and assessments to help students improve continuously.",
    },
    {
      question: "Are there homework or practice assignments?",
      answer:
        "Yes, students receive practice exercises and projects to reinforce learning between sessions.",
    },
    {
      question: "Can parents observe classes?",
      answer:
        "Parents are welcome to observe trial classes and can request progress updates anytime.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, and net banking for course payments.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team via email, phone, or the chat option on our website.",
    },
    {
      question: "Do you offer classes in different time zones?",
      answer:
        "Yes, we have flexible scheduling and offer classes suitable for students in various countries.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "We offer a satisfaction guarantee. Please contact our support for details on refunds and cancellations.",
    },
    {
      question: "How do I enroll my child?",
      answer:
        "You can enroll by booking a free trial class or filling out the enrollment form on our website.",
    },
    {
      question: "What languages are classes conducted in?",
      answer:
        "Our primary language of instruction is English, but we also offer support in Hindi.",
    },
    {
      question: "Do you offer summer camps or workshops?",
      answer:
        "Yes, we run special camps and workshops during holidays. Check our website for upcoming events.",
    },
    {
      question: "How long are the courses?",
      answer:
        "Course durations vary from 3 to 12 months, depending on the subject and level.",
    },
    {
      question: "Will my child get personal attention?",
      answer:
        "Yes, our small class sizes and dedicated instructors ensure every child receives personal guidance.",
    },
    {
      question: "Are there any prerequisites?",
      answer:
        "Most courses require only basic computer skills and a willingness to learn.",
    },
    {
      question: "Can my child participate in competitions?",
      answer:
        "Yes, we encourage students to participate in internal and external competitions and olympiads.",
    },
    {
      question: "What is the teaching methodology?",
      answer:
        "We use interactive, project-based learning with a focus on critical thinking and creativity.",
    },
    {
      question: "Do you provide study material?",
      answer:
        "Yes, all necessary study material and resources are provided digitally.",
    },
    {
      question: "How do I know which course is right for my child?",
      answer:
        "Our experts can guide you based on your child's interests and goals. Book a free consultation!",
    },
    {
      question: "Can my child switch courses later?",
      answer:
        "Yes, students can switch or add courses as their interests evolve.",
    },
    {
      question: "Are there any discounts or scholarships?",
      answer:
        "We offer sibling discounts and occasional scholarships for meritorious students.",
    },
    {
      question: "How do you select your instructors?",
      answer:
        "All instructors undergo a rigorous selection process and background checks.",
    },
    {
      question: "What is the student success rate?",
      answer:
        "Over 95% of our students achieve their learning goals and show measurable improvement.",
    },
    {
      question: "Do you offer demo classes?",
      answer:
        "Yes, every new student can attend a free demo class before enrolling.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Our platform is mobile-friendly, and a dedicated app is coming soon.",
    },
    {
      question: "How do you handle feedback and complaints?",
      answer:
        "We value feedback and resolve complaints promptly through our dedicated support team.",
    },
    {
      question: "What is the minimum age to join?",
      answer:
        "Children as young as 5 years old can join our beginner programs.",
    },
    {
      question: "Do you offer parent-teacher meetings?",
      answer:
        "Yes, we schedule regular parent-teacher meetings to discuss progress and address concerns.",
    },
    {
      question: "Are your courses recognized internationally?",
      answer:
        "Our certificates are recognized by several educational partners and organizations.",
    },
    {
      question: "Can I refer a friend?",
      answer:
        "Yes, we have a referral program with exciting rewards for both you and your friend.",
    },
    {
      question: "How do I get updates about new courses?",
      answer:
        "Subscribe to our newsletter or follow us on social media for the latest updates.",
    },
    {
      question: "What is the class duration?",
      answer:
        "Each session typically lasts 60 minutes, including instruction and Q&A.",
    },
    {
      question: "Do you offer group classes?",
      answer:
        "Yes, we offer both group and individual classes to suit different learning preferences.",
    },
    {
      question: "How do you motivate students?",
      answer:
        "We use gamification, rewards, and regular encouragement to keep students motivated.",
    },
    {
      question: "Can my child get extra help if needed?",
      answer:
        "Yes, we offer extra support sessions and doubt-clearing classes as needed.",
    },
    {
      question: "Is there a trial period?",
      answer:
        "Yes, you can try our classes risk-free with a free trial session.",
    },
    {
      question: "How do I access class recordings?",
      answer:
        "Class recordings are available for students who miss a session or want to review.",
    },
    {
      question: "Do you offer career guidance?",
      answer:
        "We provide career guidance and mentorship for older students interested in tech and STEM fields.",
    },
    {
      question: "What is your mission?",
      answer:
        "Our mission is to empower every child with future-ready skills in a fun, engaging, and supportive environment.",
    },
    {
      question: "How can I join the KingCompiler team?",
      answer:
        "Visit our Careers page to see open positions and join our passionate team of educators.",
    },
    {
      question: "Where is KingCompiler Academy based?",
      answer:
        "We are headquartered in India and Dubai, serving students globally through our online platform.",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 text-yellow-500"
              style={{ WebkitTextStroke: "2px black", textStroke: "2px black" }}
            >
              About KingCompiler
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering the next generation through innovative education in
              chess, coding, and AI. We&apos;re building future leaders, one
              child at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <button className="bg-black hover:bg-gray-900 text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                🎯 Our Mission
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                📞 Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                Our Mission & Vision
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                    🎯 Our Mission
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To democratize quality education by making world-class
                    chess, coding, and AI training accessible to every child,
                    regardless of their location or background. We believe every
                    child deserves the opportunity to develop critical thinking,
                    creativity, and technical skills.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
                    🔮 Our Vision
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To become the global leader in online education for
                    children, creating a world where every child is equipped
                    with the skills, confidence, and mindset to thrive in the
                    21st century and beyond.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="rounded-2xl p-8 text-black font-bold"
                style={{ backgroundColor: "#FFE565" }}
              >
                <h3 className="text-2xl font-bold mb-6">
                  Why Choose KingCompiler?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>
                      Expert coaches with international certifications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Personalized learning paths for every child</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Cutting-edge technology and modern curriculum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>
                      Proven track record with 5,000+ successful students
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>24/7 support and flexible scheduling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the learning
              experience we provide to our students.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team consists of certified professionals, industry experts,
              and passionate educators dedicated to your child&apos;s success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-800 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Journey Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Student Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From complete beginner to champion - see how our students
              transform through our structured learning path.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line: visible on all screens, centered. Thinner and shorter on mobile. */}
            <div
              className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-green-400 to-blue-600 z-0"
              style={{ minHeight: "100%" }}
            ></div>
            <div className="space-y-12 relative z-10">
              {studentJourney.map((stage, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center sm:flex-row ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot for mobile, centered above card */}
                  <div className="flex flex-col items-center w-full sm:hidden mb-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  {/* Card */}
                  <div className="w-full sm:w-1/2 px-2 sm:px-8 flex justify-center sm:justify-start">
                    <div
                      className={`bg-white w-full max-w-xs sm:max-w-full p-2 sm:p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 ${
                        index % 2 === 0 ? "sm:text-right" : "sm:text-left"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="text-xl sm:text-3xl">{stage.icon}</div>
                        <div className="text-xs sm:text-sm font-semibold text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                          {stage.duration}
                        </div>
                      </div>
                      <div className="text-sm sm:text-lg font-bold text-green-600 mb-1 sm:mb-2">
                        {stage.stage}
                      </div>
                      <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900">
                        {stage.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                  {/* Timeline dot for desktop, between cards */}
                  <div className="hidden sm:flex w-6 h-6 bg-gradient-to-r from-green-400 to-blue-600 rounded-full border-4 border-white shadow-lg my-2 sm:my-0"></div>
                  <div className="hidden sm:block w-1/2 px-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#FFE565" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Ready to Start Your Child&apos;s Journey?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            Join thousands of parents who have already chosen KingCompiler for
            their child&apos;s education. Start with a free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openFormModal}
              className="bg-black text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 transition-all duration-200 transform hover:scale-105"
            >
              🎯 Start Free Trial
            </button>
            <button
              onClick={openFormModal}
              className="bg-transparent text-black border-2 border-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-black hover:text-yellow-400 transition-all duration-200 transform hover:scale-105"
            >
              📞 Talk to Expert
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <div
            className="space-y-4"
            itemScope
            itemType="https://schema.org/FAQPage"
          >
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-lg shadow-md p-6 transition-all duration-200"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <summary
                  className="cursor-pointer text-lg font-semibold text-gray-800 group-open:text-yellow-600 flex items-center justify-between"
                  itemProp="name"
                >
                  {faq.question}
                  <svg
                    className="w-5 h-5 ml-2 transform transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div
                  className="mt-4 text-gray-700 leading-relaxed"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">{faq.answer}</span>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />
      <FloatingDemoButton />
      <Footer />
    </div>
  );
}
