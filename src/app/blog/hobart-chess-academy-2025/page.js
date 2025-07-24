import Image from "next/image";

export const metadata = {
  title:
    "Best Chess Coaching in Hobart (2025) – Top 5 Academies for Kids & Teens",
  description:
    "Find the best chess academies in Hobart for 2025. Learn why KingCompiler Chess Academy is the top online chess class for Hobart students.",
  authors: [{ name: "King Master Team" }],
  openGraph: {
    title: "Best Chess Coaching in Hobart (2025)",
    description:
      "Find the best chess academies in Hobart for 2025. Learn why KingCompiler Chess Academy is the top online chess class for Hobart students.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
        alt: "Hobart, Australia",
      },
    ],
  },
};

export default function Page() {
  return (
    <article className="prose lg:prose-xl mx-auto py-8">
      <h1>Top 5 Chess Coaching Academies in Hobart, Australia (2025)</h1>
      <Image
        src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80"
        alt="Hobart City and Mount Wellington, Australia"
        width={800}
        height={400}
        className="rounded-xl my-6"
        priority
      />
      <p>
        Chess is gaining popularity in Hobart, with more families discovering
        its benefits for focus, memory, and problem-solving. Whether you want
        in-person coaching or flexible online classes, Hobart has great options.
      </p>
      <p>
        Here are the top 5 chess coaching academies in Hobart for 2025—see why
        KingCompiler Chess Academy is the #1 online choice.
      </p>
      <hr />
      <h2>
        🥇 1. KingCompiler Chess Academy – Hobart’s Top Online Chess School
      </h2>
      <ul>
        <li>
          <b>Website:</b>{" "}
          <a href="https://www.kingcompiler.com" target="_blank" rel="noopener">
            www.kingcompiler.com
          </a>
        </li>
        <li>
          <b>Email:</b> kingcompiler.official@gmail.com
        </li>
        <li>
          <b>WhatsApp:</b> +91 90381 62791
        </li>
      </ul>
      <p>
        KingCompiler Chess Academy offers Hobart families access to world-class
        chess education, with live classes, FIDE-rated coaches, and advanced
        learning tools.
      </p>
      <h3>Why Choose KingCompiler?</h3>
      <ul>
        <li>International, FIDE-rated coaches</li>
        <li>Live, interactive classes (no recordings)</li>
        <li>Flexible schedules for Hobart time zone</li>
        <li>Kids’ groups (ages 5–16)</li>
        <li>
          AI Chess Coach, Puzzle Trainer, Opening Books, Endgame Practice, 200+
          E-books, Intuition Trainer
        </li>
        <li>Weekly tournaments and progress reports</li>
      </ul>
      <blockquote>
        “KingCompiler’s online program is perfect for our busy schedule. My
        son’s chess has improved so much, and he loves the tournaments!” —
        Hobart Parent
      </blockquote>
      <h2>🥈 2. Hobart Chess Club</h2>
      <ul>
        <li>
          <b>Location:</b> Hobart, TAS
        </li>
        <li>
          <b>Website:</b>{" "}
          <a
            href="https://www.hobartchessclub.org.au"
            target="_blank"
            rel="noopener"
          >
            hobartchessclub.org.au
          </a>
        </li>
      </ul>
      <ul>
        <li>In-person coaching and tournaments</li>
        <li>Community events</li>
        <li>No online classes</li>
      </ul>
      <h2>🥉 3. Australian Chess Academy</h2>
      <ul>
        <li>
          <b>Location:</b> Online + Sydney
        </li>
        <li>
          <b>Website:</b>{" "}
          <a
            href="https://www.australianchessacademy.com.au"
            target="_blank"
            rel="noopener"
          >
            australianchessacademy.com.au
          </a>
        </li>
      </ul>
      <ul>
        <li>Online classes for all levels</li>
        <li>Australian coaches</li>
        <li>Affordable plans</li>
      </ul>
      <h2>🏅 4. Chess Kids Australia</h2>
      <ul>
        <li>
          <b>Location:</b> Victoria-based, online available
        </li>
        <li>
          <b>Website:</b>{" "}
          <a href="https://www.chesskids.com.au" target="_blank" rel="noopener">
            chesskids.com.au
          </a>
        </li>
      </ul>
      <ul>
        <li>Fun, child-friendly programs</li>
        <li>School partnerships</li>
        <li>Online experience less advanced</li>
      </ul>
      <h2>🏅 5. Tornelo Chess Academy</h2>
      <ul>
        <li>
          <b>Location:</b> Online
        </li>
        <li>
          <b>Website:</b>{" "}
          <a href="https://www.tornelo.com" target="_blank" rel="noopener">
            tornelo.com
          </a>
        </li>
      </ul>
      <ul>
        <li>Online tournaments and events</li>
        <li>Not a coaching academy</li>
      </ul>
      <hr />
      <h2>Final Thoughts</h2>
      <p>
        For Hobart families, KingCompiler Chess Academy is the #1 online chess
        class for 2025. With expert coaches and engaging lessons, your child
        will love learning chess!
      </p>
      <p className="text-xs text-gray-500 mt-8">
        SEO Tags: HobartChessAcademy, ChessCoachingHobart, OnlineChessClasses,
        HobartKidsChess, KingCompilerAcademy, FIDEChessAustralia, ChessForKids,
        LearnChessHobart
      </p>
    </article>
  );
}
