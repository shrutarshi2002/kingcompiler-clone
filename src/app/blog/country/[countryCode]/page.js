"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import FloatingDemoButton from "../../../../components/FloatingDemoButton";

// Country data with states/provinces and parent statistics
const countryData = {
  US: {
    name: "United States",
    flag: "🇺🇸",
    description: "Chess & Coding Excellence",
    totalStudents: "500+",
    states: [
      {
        name: "California",
        code: "CA",
        students: "120+",
        parents: "85+",
        cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
        features: ["Chess Tournaments", "Coding Bootcamps", "STEM Workshops"],
        description: "Leading tech hub with world-class chess education",
      },
      {
        name: "Texas",
        code: "TX",
        students: "95+",
        parents: "70+",
        cities: ["Houston", "Dallas", "Austin", "San Antonio"],
        features: [
          "Chess Championships",
          "Programming Classes",
          "AI Education",
        ],
        description: "Growing tech scene with strong chess community",
      },
      {
        name: "New York",
        code: "NY",
        students: "80+",
        parents: "60+",
        cities: ["New York City", "Buffalo", "Rochester", "Syracuse"],
        features: ["Chess Masters", "Coding Academies", "STEM Programs"],
        description: "Cultural capital with elite chess training",
      },
      {
        name: "Florida",
        code: "FL",
        students: "65+",
        parents: "50+",
        cities: ["Miami", "Orlando", "Tampa", "Jacksonville"],
        features: ["Chess Competitions", "Tech Education", "Summer Camps"],
        description: "Year-round learning with chess excellence",
      },
      {
        name: "Illinois",
        code: "IL",
        students: "45+",
        parents: "35+",
        cities: ["Chicago", "Aurora", "Rockford", "Joliet"],
        features: ["Chess Clubs", "Coding Schools", "STEM Labs"],
        description: "Midwest hub for chess and technology education",
      },
    ],
  },
  GB: {
    name: "United Kingdom",
    flag: "🇬🇧",
    description: "Royal Chess Academy",
    totalStudents: "300+",
    states: [
      {
        name: "England",
        code: "ENG",
        students: "200+",
        parents: "150+",
        cities: ["London", "Manchester", "Birmingham", "Liverpool"],
        features: ["Royal Chess Academy", "Coding Schools", "STEM Education"],
        description: "Traditional chess education with modern technology",
      },
      {
        name: "Scotland",
        code: "SCT",
        students: "60+",
        parents: "45+",
        cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
        features: [
          "Chess Championships",
          "Tech Innovation",
          "Educational Programs",
        ],
        description: "Innovative approach to chess and coding education",
      },
      {
        name: "Wales",
        code: "WLS",
        students: "25+",
        parents: "20+",
        cities: ["Cardiff", "Swansea", "Newport", "Wrexham"],
        features: ["Chess Training", "Digital Skills", "STEM Workshops"],
        description: "Growing community of chess and tech enthusiasts",
      },
      {
        name: "Northern Ireland",
        code: "NIR",
        students: "15+",
        parents: "12+",
        cities: ["Belfast", "Derry", "Lisburn", "Newtownabbey"],
        features: ["Chess Clubs", "Programming Classes", "Tech Education"],
        description: "Emerging tech scene with chess excellence",
      },
    ],
  },
  AE: {
    name: "United Arab Emirates",
    flag: "🇦🇪",
    description: "Dubai Chess Masters",
    totalStudents: "250+",
    states: [
      {
        name: "Dubai",
        code: "DXB",
        students: "120+",
        parents: "90+",
        cities: ["Dubai Marina", "Downtown Dubai", "Jumeirah", "Business Bay"],
        features: ["Chess Masters", "AI Programming", "Tech Innovation"],
        description: "Global tech hub with world-class chess education",
      },
      {
        name: "Abu Dhabi",
        code: "AUH",
        students: "80+",
        parents: "60+",
        cities: ["Abu Dhabi City", "Al Ain", "Ras Al Khaimah", "Fujairah"],
        features: ["Chess Championships", "STEM Education", "Future Skills"],
        description: "Capital city with advanced chess and coding programs",
      },
      {
        name: "Sharjah",
        code: "SHJ",
        students: "35+",
        parents: "25+",
        cities: ["Sharjah City", "Al Qasba", "Al Majaz", "Al Khan"],
        features: ["Chess Training", "Digital Literacy", "Tech Workshops"],
        description: "Cultural center with growing tech education",
      },
      {
        name: "Ajman",
        code: "AJM",
        students: "15+",
        parents: "12+",
        cities: ["Ajman City", "Al Nuaimiya", "Al Rawda", "Al Jerf"],
        features: ["Chess Clubs", "Programming Basics", "STEM Introduction"],
        description: "Emerging community with chess and tech focus",
      },
    ],
  },
  NL: {
    name: "Netherlands",
    flag: "🇳🇱",
    description: "Dutch Chess Innovation",
    totalStudents: "200+",
    states: [
      {
        name: "North Holland",
        code: "NH",
        students: "80+",
        parents: "60+",
        cities: ["Amsterdam", "Haarlem", "Zaanstad", "Hilversum"],
        features: ["Chess Innovation", "Tech Startups", "STEM Labs"],
        description: "Innovation hub with cutting-edge chess education",
      },
      {
        name: "South Holland",
        code: "ZH",
        students: "60+",
        parents: "45+",
        cities: ["Rotterdam", "The Hague", "Leiden", "Dordrecht"],
        features: [
          "Chess Strategy",
          "Programming Excellence",
          "Tech Education",
        ],
        description: "Business center with strong chess community",
      },
      {
        name: "Utrecht",
        code: "UT",
        students: "35+",
        parents: "25+",
        cities: ["Utrecht", "Amersfoort", "Nieuwegein", "Zeist"],
        features: ["Chess Training", "Digital Skills", "STEM Programs"],
        description: "Central location with growing tech scene",
      },
      {
        name: "Gelderland",
        code: "GE",
        students: "25+",
        parents: "20+",
        cities: ["Arnhem", "Nijmegen", "Apeldoorn", "Ede"],
        features: ["Chess Clubs", "Coding Schools", "Tech Workshops"],
        description: "Green province with innovative education",
      },
    ],
  },
  AU: {
    name: "Australia",
    flag: "🇦🇺",
    description: "Aussie Chess Champions",
    totalStudents: "180+",
    states: [
      {
        name: "New South Wales",
        code: "NSW",
        students: "70+",
        parents: "55+",
        cities: ["Sydney", "Newcastle", "Wollongong", "Central Coast"],
        features: ["Chess Championships", "Tech Education", "STEM Programs"],
        description: "Australia's largest state with premier chess education",
      },
      {
        name: "Victoria",
        code: "VIC",
        students: "60+",
        parents: "45+",
        cities: ["Melbourne", "Geelong", "Ballarat", "Bendigo"],
        features: ["Chess Masters", "Coding Academies", "Innovation Labs"],
        description: "Cultural capital with world-class chess training",
      },
      {
        name: "Queensland",
        code: "QLD",
        students: "35+",
        parents: "25+",
        cities: ["Brisbane", "Gold Coast", "Sunshine Coast", "Cairns"],
        features: ["Chess Competitions", "Tech Innovation", "STEM Education"],
        description: "Sunshine state with growing tech community",
      },
      {
        name: "Western Australia",
        code: "WA",
        students: "15+",
        parents: "12+",
        cities: ["Perth", "Fremantle", "Rockingham", "Mandurah"],
        features: ["Chess Training", "Digital Skills", "Tech Workshops"],
        description: "Isolated but innovative chess and tech education",
      },
    ],
  },
  SG: {
    name: "Singapore",
    flag: "🇸🇬",
    description: "Singapore Chess Hub",
    totalStudents: "350+",
    states: [
      {
        name: "Central Region",
        code: "CR",
        students: "150+",
        parents: "120+",
        cities: ["Marina Bay", "Orchard", "Chinatown", "Little India"],
        features: ["Chess Excellence", "Tech Innovation", "STEM Leadership"],
        description: "Financial district with world-class chess education",
      },
      {
        name: "East Region",
        code: "ER",
        students: "80+",
        parents: "60+",
        cities: ["Tampines", "Pasir Ris", "Bedok", "Changi"],
        features: ["Chess Training", "Coding Schools", "Tech Hubs"],
        description: "Residential area with strong educational focus",
      },
      {
        name: "North Region",
        code: "NR",
        students: "70+",
        parents: "55+",
        cities: ["Woodlands", "Sembawang", "Yishun", "Ang Mo Kio"],
        features: ["Chess Clubs", "STEM Programs", "Digital Innovation"],
        description: "Growing tech corridor with chess excellence",
      },
      {
        name: "West Region",
        code: "WR",
        students: "50+",
        parents: "40+",
        cities: ["Jurong", "Clementi", "Bukit Batok", "Tuas"],
        features: ["Chess Competitions", "Tech Education", "Future Skills"],
        description: "Industrial hub with innovative education programs",
      },
    ],
  },
  CA: {
    name: "Canada",
    flag: "🇨🇦",
    description: "Canadian Chess Masters",
    totalStudents: "280+",
    states: [
      {
        name: "Ontario",
        code: "ON",
        students: "120+",
        parents: "90+",
        cities: ["Toronto", "Ottawa", "Hamilton", "London"],
        features: ["Chess Championships", "Tech Innovation", "STEM Excellence"],
        description: "Canada's largest province with premier chess education",
      },
      {
        name: "British Columbia",
        code: "BC",
        students: "80+",
        parents: "60+",
        cities: ["Vancouver", "Victoria", "Surrey", "Burnaby"],
        features: ["Chess Masters", "Coding Academies", "Tech Hubs"],
        description: "Pacific coast with world-class chess training",
      },
      {
        name: "Quebec",
        code: "QC",
        students: "60+",
        parents: "45+",
        cities: ["Montreal", "Quebec City", "Laval", "Gatineau"],
        features: ["Chess Excellence", "Tech Innovation", "Bilingual Programs"],
        description: "French-speaking province with chess excellence",
      },
      {
        name: "Alberta",
        code: "AB",
        students: "20+",
        parents: "15+",
        cities: ["Calgary", "Edmonton", "Red Deer", "Lethbridge"],
        features: ["Chess Training", "STEM Programs", "Tech Education"],
        description: "Prairie province with growing tech community",
      },
    ],
  },
  OM: {
    name: "Oman",
    flag: "🇴🇲",
    description: "Oman Chess Academy",
    totalStudents: "100+",
    states: [
      {
        name: "Muscat",
        code: "MCT",
        students: "50+",
        parents: "35+",
        cities: ["Muscat City", "Ruwi", "Al Khuwair", "Qurum"],
        features: ["Chess Training", "Digital Skills", "STEM Programs"],
        description: "Capital city with growing chess and tech community",
      },
      {
        name: "Salalah",
        code: "SLL",
        students: "25+",
        parents: "18+",
        cities: ["Salalah City", "Al Dahariz", "Al Saada", "Al Haffa"],
        features: ["Chess Clubs", "Tech Education", "Summer Programs"],
        description: "Southern region with innovative education programs",
      },
      {
        name: "Sohar",
        code: "SOH",
        students: "15+",
        parents: "12+",
        cities: ["Sohar City", "Al Batinah", "Liwa", "Shinas"],
        features: ["Chess Competitions", "Coding Workshops", "STEM Labs"],
        description: "Industrial hub with chess and technology focus",
      },
      {
        name: "Nizwa",
        code: "NZW",
        students: "10+",
        parents: "8+",
        cities: ["Nizwa City", "Bahla", "Manah", "Izki"],
        features: ["Chess Training", "Digital Literacy", "Tech Introduction"],
        description: "Cultural center with traditional and modern education",
      },
    ],
  },
  QA: {
    name: "Qatar",
    flag: "🇶🇦",
    description: "Qatar Chess Champions",
    totalStudents: "150+",
    states: [
      {
        name: "Doha",
        code: "DOH",
        students: "80+",
        parents: "60+",
        cities: ["Doha City", "West Bay", "Pearl Qatar", "Lusail"],
        features: ["Chess Masters", "AI Programming", "Tech Innovation"],
        description: "Capital city with world-class chess and tech education",
      },
      {
        name: "Al Rayyan",
        code: "RAY",
        students: "35+",
        parents: "25+",
        cities: ["Al Rayyan City", "Al Wakra", "Al Khor", "Dukhan"],
        features: ["Chess Championships", "STEM Education", "Future Skills"],
        description: "Growing region with strong educational focus",
      },
      {
        name: "Al Khor",
        code: "KHO",
        students: "20+",
        parents: "15+",
        cities: ["Al Khor City", "Al Thakhira", "Ras Laffan", "Al Shamal"],
        features: ["Chess Training", "Digital Skills", "Tech Workshops"],
        description: "Northern region with innovative learning programs",
      },
      {
        name: "Al Wakrah",
        code: "WAK",
        students: "15+",
        parents: "12+",
        cities: ["Al Wakrah City", "Mesaieed", "Al Kharrara", "Al Sailiya"],
        features: ["Chess Clubs", "Programming Classes", "STEM Introduction"],
        description: "Southern region with emerging tech community",
      },
    ],
  },
  SA: {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    description: "Saudi Chess Vision",
    totalStudents: "400+",
    states: [
      {
        name: "Riyadh",
        code: "RUH",
        students: "150+",
        parents: "120+",
        cities: ["Riyadh City", "King Fahd District", "Al Olaya", "Al Malaz"],
        features: [
          "Chess Excellence",
          "Tech Innovation",
          "Vision 2030 Programs",
        ],
        description: "Capital city leading Saudi's chess and tech revolution",
      },
      {
        name: "Jeddah",
        code: "JED",
        students: "120+",
        parents: "90+",
        cities: ["Jeddah City", "Al Hamra", "Al Rawdah", "Al Shati"],
        features: [
          "Chess Championships",
          "STEM Education",
          "Digital Transformation",
        ],
        description: "Commercial hub with world-class chess education",
      },
      {
        name: "Dammam",
        code: "DMM",
        students: "80+",
        parents: "60+",
        cities: ["Dammam City", "Al Khobar", "Dhahran", "Qatif"],
        features: ["Chess Training", "Tech Innovation", "Industrial Programs"],
        description: "Eastern province with growing tech and chess community",
      },
      {
        name: "Mecca",
        code: "MAK",
        students: "30+",
        parents: "25+",
        cities: ["Mecca City", "Taif", "Jeddah", "Al Qunfudhah"],
        features: [
          "Chess Clubs",
          "Educational Programs",
          "Cultural Integration",
        ],
        description:
          "Holy city with educational excellence and chess tradition",
      },
      {
        name: "Medina",
        code: "MED",
        students: "20+",
        parents: "15+",
        cities: ["Medina City", "Yanbu", "Al Ula", "Tabuk"],
        features: ["Chess Training", "Digital Skills", "Community Programs"],
        description: "Historic city with modern educational approach",
      },
    ],
  },
};

export default function CountryPage({ params }) {
  const [isClient, setIsClient] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const countryCode = params.countryCode?.toUpperCase();
  const country = countryData[countryCode];

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Country Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The requested country page could not be found.
          </p>
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Country Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{country.flag}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {country.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{country.description}</p>
          <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              {country.totalStudents} Active Students
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Live Classes Available
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              Local Tournaments
            </span>
          </div>
        </div>

        {/* States/Provinces Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Top States/Provinces Where Parents Stay
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Discover the regions where most of our parents and students are
            located. Click on any state to see detailed information about local
            communities and programs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.states.map((state, index) => (
              <div
                key={state.code}
                className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  selectedState === state.code
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() =>
                  setSelectedState(
                    selectedState === state.code ? null : state.code
                  )
                }
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {state.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {state.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Students:</span>
                    <span className="font-semibold text-green-600">
                      {state.students}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Parents:</span>
                    <span className="font-semibold text-blue-600">
                      {state.parents}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Major Cities:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {state.cities.slice(0, 3).map((city, cityIndex) => (
                        <span
                          key={cityIndex}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {city}
                        </span>
                      ))}
                      {state.cities.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{state.cities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Features:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {state.features.map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected State Details */}
        {selectedState && (
          <div className="mb-12">
            {(() => {
              const state = country.states.find(
                (s) => s.code === selectedState
              );
              return (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                      {state.name}
                    </h3>
                    <p className="text-gray-600 text-lg">{state.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-semibold text-gray-700 mb-4">
                        All Cities
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {state.cities.map((city, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-3 text-center shadow-sm"
                          >
                            <span className="text-sm font-medium text-gray-700">
                              {city}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-700 mb-4">
                        Program Features
                      </h4>
                      <div className="space-y-2">
                        {state.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors mr-4">
                      Join Local Community
                    </button>
                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
                      Book Free Trial
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Join Our {country.name} Community?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Connect with parents and students in your area. Get access to local
            tournaments, coding workshops, and exclusive events happening in
            your state.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Start Learning Today
            </button>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Contact Local Team
            </button>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>

      <Footer />
      <FloatingDemoButton />
    </div>
  );
}
