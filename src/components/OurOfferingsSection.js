"use client";

export default function OurOfferingsSection() {
  const offerings = [
    {
      title: "Group Classes",
      description:
        "Structure: Classes with 4-6 students, providing a collaborative environment.",
      features: [
        "Fixed Schedule",
        "Social Interaction",
        "Competitive Environment",
        "Cost Effective",
        "Hobby players",
      ],
      bgColor: "bg-[#FFE565]",
      borderColor: "border-yellow-600",
    },
    {
      title: "1-1 Classes",
      description:
        "Structure: Personalized lessons with one student and the instructor.",
      features: [
        "Faster Growth",
        "Flexible Schedule",
        "Personalized Attention",
        "Tournament Preparation",
        "For Young Kids & Serious Players",
      ],
      bgColor: "bg-[#FFE565]",
      borderColor: "border-yellow-600",
    },
    {
      title: "Sibling Classes",
      description:
        "Structure: Lessons for two or more siblings together, with a focus on family learning",
      features: [
        "Family Bonding",
        "Shared Experience",
        "Cost Effective",
        "Friendly Competition",
      ],
      bgColor: "bg-[#FFE565]",
      borderColor: "border-yellow-600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          Our Offerings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerings.map((offering, index) => (
            <div
              key={index}
              className={`${offering.bgColor} ${offering.borderColor} border-2 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <h3 className="text-2xl font-bold mb-4 text-black underline">
                {offering.title}
              </h3>
              <p className="text-black text-sm mb-6 opacity-90">
                {offering.description}
              </p>
              <ul className="space-y-3">
                {offering.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-black"
                  >
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
