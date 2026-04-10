import { db, articlesTable, quizQuestionsTable } from "@workspace/db";
import { logger } from "./logger";
import { count } from "drizzle-orm";

export async function seedIfEmpty(): Promise<void> {
  const [{ value }] = await db.select({ value: count() }).from(articlesTable);
  if (value > 0) {
    logger.info({ count: value }, "Database already has articles, skipping seed");
    return;
  }

  logger.info("Database is empty — seeding initial data...");

  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 86400000);

  const seedArticles = [
    {
      title: "Supreme Court Upholds Electoral Bond Scheme as Unconstitutional",
      source: "The Hindu",
      sourceUrl: "https://thehindu.com",
      category: "polity",
      gsMapping: "GS2",
      keyPoints: [
        "SC unanimously struck down the Electoral Bond Scheme (EBS), 2018",
        "Bench held that anonymity in political funding violates voters' right to information under Article 19(1)(a)",
        "SBI directed to disclose details of electoral bonds to Election Commission of India",
        "Court ruled that unlimited corporate funding of political parties is unconstitutional",
      ],
      background:
        "The Electoral Bond Scheme was introduced in 2018 allowing donors to purchase bonds from SBI and donate anonymously to political parties. The scheme faced criticism for opaque corporate-political nexus.",
      analysis:
        "The verdict reinforces the principle that transparency in democratic processes is non-negotiable. The right to information is integral to freedom of speech. This has significant implications for campaign finance reform in India. The ruling may lead to greater scrutiny of corporate political donations.",
      examRelevance: "both" as const,
      tags: ["Supreme Court", "Electoral Bonds", "Article 19", "Political Funding", "Democracy"],
      publishedAt: now,
    },
    {
      title: "India's GDP Growth Rate at 8.4% in Q3 — Highest Among G20 Nations",
      source: "Economic Times",
      sourceUrl: "https://economictimes.indiatimes.com",
      category: "economy",
      gsMapping: "GS3",
      keyPoints: [
        "India recorded GDP growth of 8.4% in Q3 FY24, highest in four quarters",
        "Manufacturing sector grew 11.6%, driven by PLI scheme outcomes",
        "Gross Value Added (GVA) grew 6.5%, indicating strong real sector activity",
        "India remains the fastest-growing large economy globally",
      ],
      background:
        "India has been on a growth trajectory post-pandemic, supported by government capex, PLI schemes, and strong domestic consumption. The IMF revised India's growth forecast upward to 6.8% for FY25.",
      analysis:
        "The divergence between GDP and GVA growth raises questions about the role of subsidies and taxes. Strong manufacturing growth validates the PLI approach. However, private consumption and rural demand remain subdued, posing medium-term risks. External trade headwinds from global slowdown could affect future quarters.",
      examRelevance: "both" as const,
      tags: ["GDP Growth", "Manufacturing", "PLI Scheme", "GVA", "Economic Survey", "G20"],
      publishedAt: now,
    },
    {
      title: "COP29: India Commits to Tripling Renewable Energy by 2030",
      source: "Indian Express",
      sourceUrl: "https://indianexpress.com",
      category: "environment",
      gsMapping: "GS3",
      keyPoints: [
        "India pledged to achieve 500 GW of non-fossil fuel capacity by 2030 at COP29",
        "Renewed NDC targets include reducing emissions intensity of GDP by 45% from 2005 levels",
        "Green Hydrogen Mission to receive additional Rs 19,744 crore boost",
        "India pushed for developed nations to provide $100 billion climate finance annually",
      ],
      background:
        "India is the world's third-largest emitter of greenhouse gases but has low per-capita emissions. India's updated NDCs align with its Paris Agreement commitments. The National Action Plan on Climate Change (NAPCC) guides domestic climate policy.",
      analysis:
        "India's position balances development imperatives with climate responsibility. The push for technology transfer and climate finance from developed nations reflects equity principles in climate negotiations. Tripling renewable capacity will require significant grid upgrades and storage solutions.",
      examRelevance: "both" as const,
      tags: ["COP29", "Climate Change", "Renewable Energy", "NDC", "Paris Agreement", "Green Hydrogen"],
      publishedAt: now,
    },
    {
      title: "India-China Disengagement at LAC: Patrol Rights Restored at Depsang",
      source: "Times of India",
      sourceUrl: "https://timesofindia.com",
      category: "international_relations",
      gsMapping: "GS2",
      keyPoints: [
        "India and China completed disengagement at Depsang and Demchok friction points",
        "Patrolling rights at traditional patrol points restored after 4-year standoff",
        "Both sides agreed to gradual de-escalation and reduction of troops",
        "Special Representative talks resumed to discuss broader boundary settlement",
      ],
      background:
        "The India-China boundary dispute along the LAC (Line of Actual Control) escalated in April 2020 at Galwan Valley. Multiple rounds of military and diplomatic talks have been held since. This is the most significant disengagement since the 2020 standoff began.",
      analysis:
        "Disengagement is a positive development but does not resolve the underlying boundary dispute. India's approach reflects pragmatic balancing — economic engagement while maintaining strategic autonomy. The restoration of patrolling rights is crucial for asserting territorial claims.",
      examRelevance: "both" as const,
      tags: ["India-China", "LAC", "Depsang", "Disengagement", "Border Dispute", "Foreign Policy"],
      publishedAt: now,
    },
    {
      title: "ISRO Successfully Tests Gaganyaan Crew Escape System",
      source: "The Hindu",
      sourceUrl: "https://thehindu.com",
      category: "science_tech",
      gsMapping: "GS3",
      keyPoints: [
        "ISRO conducted successful test of Crew Escape System (CES) for Gaganyaan mission",
        "CES uses solid propellant-based quick reaction motors to pull crew module away in emergency",
        "Test conducted at Sriharikota demonstrated escape capability at maximum dynamic pressure",
        "First uncrewed Gaganyaan test flight scheduled for late 2024",
      ],
      background:
        "Gaganyaan is India's first human spaceflight programme, approved in 2018 with a budget of Rs 10,000 crore. ISRO aims to send three Indian astronauts (Vyomanauts) to low Earth orbit. The mission builds on ISRO's PSLV and GSLV heritage.",
      analysis:
        "Crew escape system testing is a critical safety milestone. India joining the elite club of human spaceflight nations will have significant strategic and technological dividends. Gaganyaan will develop critical technologies like life support systems, re-entry thermal protection, and precision recovery.",
      examRelevance: "both" as const,
      tags: ["ISRO", "Gaganyaan", "Human Spaceflight", "Crew Escape System", "Space Technology"],
      publishedAt: now,
    },
    {
      title: "One Nation One Election: Joint Committee Recommendations Submitted",
      source: "Indian Express",
      sourceUrl: "https://indianexpress.com",
      category: "polity",
      gsMapping: "GS2",
      keyPoints: [
        "High-level committee chaired by ex-President Ram Nath Kovind submitted report to President",
        "Recommends simultaneous elections for Lok Sabha and State Assemblies in Phase 1",
        "Phase 2 to include Urban Local Bodies and Panchayats within 100 days",
        "Requires constitutional amendments to Articles 83, 85, 172, 174, 356",
      ],
      background:
        "One Nation One Election (ONOE) concept aims to reduce election fatigue, lower costs, and ensure policy continuity. India held simultaneous elections until 1967 before the tradition broke down. The Law Commission of India recommended ONOE in its 170th report (1999).",
      analysis:
        "ONOE has merits in reducing policy paralysis and model code of conduct disruptions but raises serious federal concerns. Critics argue it centralizes power and undermines regional political dynamics. Constitutional amendments will require two-thirds majority plus state ratification.",
      examRelevance: "both" as const,
      tags: ["One Nation One Election", "Constitutional Amendment", "Federalism", "Election Commission"],
      publishedAt: yesterday,
    },
    {
      title: "RBI Monetary Policy: Repo Rate Held at 6.5%, CRR Cut by 50 bps",
      source: "Economic Times",
      sourceUrl: "https://economictimes.indiatimes.com",
      category: "economy",
      gsMapping: "GS3",
      keyPoints: [
        "RBI MPC kept repo rate unchanged at 6.5% for seventh consecutive time",
        "Cash Reserve Ratio (CRR) reduced by 50 basis points to 4%, injecting Rs 1.16 lakh crore",
        "Stance changed from 'withdrawal of accommodation' to 'neutral'",
        "FY25 GDP growth forecast revised to 7.2% from 7.0%",
      ],
      background:
        "The Monetary Policy Committee (MPC) was constituted under the RBI Act, 1934 (amended 2016) with inflation targeting as the primary mandate. The inflation target is 4% (+/-2%). CRR is the percentage of deposits banks must maintain with RBI.",
      analysis:
        "CRR cut signals RBI's intent to ease liquidity without cutting rates prematurely. The stance change to 'neutral' indicates readiness to cut rates once inflation durably aligns with the 4% target. Liquidity infusion will help credit growth and reduce bond yields.",
      examRelevance: "both" as const,
      tags: ["RBI", "Monetary Policy", "Repo Rate", "CRR", "Inflation", "MPC", "Liquidity"],
      publishedAt: yesterday,
    },
    {
      title: "Cheetah Reintroduction Project: 12 More Cheetahs to Arrive from South Africa",
      source: "Times of India",
      sourceUrl: "https://timesofindia.com",
      category: "environment",
      gsMapping: "GS3",
      keyPoints: [
        "India to receive 12 more cheetahs from South Africa under bilateral agreement",
        "Current population at Kuno National Park stands at 24 cheetahs (8 deaths since 2022)",
        "Gandhi Sagar Wildlife Sanctuary in MP being prepared as second habitat",
        "Project Cheetah aims to establish viable wild population of 35 cheetahs by 2030",
      ],
      background:
        "Cheetah was declared extinct in India in 1952. India signed MoU with Namibia (2022) and South Africa (2023) for cheetah translocation. The first batch of 8 Namibian cheetahs arrived in September 2022.",
      analysis:
        "Cheetah reintroduction is part of India's commitment to biodiversity restoration under the Kunming-Montreal Global Biodiversity Framework. High mortality rate raises questions about habitat suitability and veterinary care. Success requires community involvement, prey base restoration, and landscape connectivity.",
      examRelevance: "both" as const,
      tags: ["Cheetah Reintroduction", "Kuno National Park", "Biodiversity", "Wildlife Conservation", "Project Cheetah"],
      publishedAt: yesterday,
    },
    {
      title: "India Joins Artemis Accords — Signals Space Cooperation with US",
      source: "The Hindu",
      sourceUrl: "https://thehindu.com",
      category: "international_relations",
      gsMapping: "GS2",
      keyPoints: [
        "India formally signed the Artemis Accords during PM Modi's state visit to the US",
        "Accords promote peaceful, transparent, and responsible use of outer space",
        "India becomes 27th country to join the US-led multilateral space agreement",
        "ISRO-NASA collaboration on NISAR satellite mission confirmed",
      ],
      background:
        "Artemis Accords were established in 2020 to extend principles of the Outer Space Treaty to modern space exploration. The Accords include provisions on resource extraction, interoperability, and debris mitigation.",
      analysis:
        "India joining Artemis Accords signals a strategic tilt in its space diplomacy toward the US-led framework. This could affect India's traditional non-alignment in space governance. The NISAR mission collaboration demonstrates deepening technological partnership.",
      examRelevance: "both" as const,
      tags: ["Artemis Accords", "Space Diplomacy", "ISRO-NASA", "iCET", "India-US", "Outer Space Treaty"],
      publishedAt: twoDaysAgo,
    },
    {
      title: "India Develops Indigenous AI Large Language Model BharatGPT",
      source: "Indian Express",
      sourceUrl: "https://indianexpress.com",
      category: "science_tech",
      gsMapping: "GS3",
      keyPoints: [
        "IIT Bombay consortium developed BharatGPT trained on 22 Indian languages",
        "Model trained on 3 billion tokens of multilingual data including Devanagari scripts",
        "Launched under Digital India Initiative with Rs 500 crore government support",
        "To be integrated into BhashaNet for low-connectivity rural areas",
      ],
      background:
        "India's National Language Translation Mission (NLTM) — Bhashini — aims to build AI-based language technology tools. India has 22 scheduled languages and hundreds of dialects. IndiaAI mission allocated Rs 10,372 crore in Union Budget 2024-25.",
      analysis:
        "Multilingual AI is critical for India's digital inclusion. Sovereign AI capability reduces dependency on foreign models for sensitive applications. The initiative aligns with India's AI Strategy that emphasizes responsible AI for social good.",
      examRelevance: "both" as const,
      tags: ["Artificial Intelligence", "BharatGPT", "Bhashini", "Digital India", "IndiaAI", "Language Technology"],
      publishedAt: twoDaysAgo,
    },
  ];

  const inserted = await db.insert(articlesTable).values(seedArticles).returning();
  logger.info({ count: inserted.length }, "Seeded articles");

  const quizData = [
    {
      articleId: inserted[0].id,
      question: "Which constitutional article was cited by the Supreme Court while striking down the Electoral Bond Scheme?",
      options: ["Article 14", "Article 19(1)(a)", "Article 21", "Article 32"],
      correctAnswer: 1,
      explanation:
        "The Supreme Court held that anonymous political funding through Electoral Bonds violates voters' right to information under Article 19(1)(a) — Freedom of Speech and Expression, which includes the right to know.",
      difficulty: "medium",
    },
    {
      articleId: inserted[1].id,
      question: "What does GVA stand for in national income accounting?",
      options: ["Gross Value Assessment", "Gross Value Added", "Gross Variable Amount", "General Value Accumulation"],
      correctAnswer: 1,
      explanation:
        "GVA (Gross Value Added) measures economic output by subtracting input costs from total output value. GDP = GVA + Taxes on products - Subsidies on products.",
      difficulty: "easy",
    },
    {
      articleId: inserted[2].id,
      question: "Which agreement forms the basis of India's international climate commitments?",
      options: ["Kyoto Protocol", "Montreal Protocol", "Paris Agreement", "Cartagena Protocol"],
      correctAnswer: 2,
      explanation:
        "India's climate commitments are guided by the Paris Agreement (2015). India submits Nationally Determined Contributions (NDCs) which outline emission reduction targets and adaptation plans.",
      difficulty: "easy",
    },
    {
      articleId: inserted[3].id,
      question: "What is the full form of LAC in the context of India-China relations?",
      options: ["Land Acquisition Certificate", "Line of Actual Control", "Legal Administration Council", "Line of Armed Conflict"],
      correctAnswer: 1,
      explanation:
        "LAC (Line of Actual Control) is the de-facto border between India and China. It is disputed in several sectors — Western (Ladakh), Middle (Himachal Pradesh & Uttarakhand), and Eastern (Arunachal Pradesh).",
      difficulty: "easy",
    },
    {
      articleId: inserted[4].id,
      question: "Which launch vehicle is used for India's Gaganyaan human spaceflight mission?",
      options: ["PSLV-C51", "GSLV Mk III (LVM3)", "SSLV", "ASLV"],
      correctAnswer: 1,
      explanation:
        "Gaganyaan will be launched on LVM3 (Launch Vehicle Mark-3), also known as GSLV Mk III. It has a payload capacity of 10 tonnes to LEO, making it suitable for human spaceflight.",
      difficulty: "medium",
    },
    {
      articleId: inserted[5].id,
      question: "Under One Nation One Election, which Articles of the Constitution need to be amended?",
      options: [
        "Articles 83, 85, 172, 174, 356",
        "Articles 73, 74, 75, 76, 77",
        "Articles 100, 110, 120, 130, 140",
        "Articles 50, 51, 52, 53, 54",
      ],
      correctAnswer: 0,
      explanation:
        "One Nation One Election requires amendments to Articles 83 (Duration of Parliament), 85 (Sessions), 172 (Duration of State Legislatures), 174 (Sessions), and 356 (President's Rule).",
      difficulty: "hard",
    },
    {
      articleId: inserted[6].id,
      question: "What does CRR stand for in banking?",
      options: ["Credit Reserve Ratio", "Cash Reserve Ratio", "Capital Return Ratio", "Central Redemption Reserve"],
      correctAnswer: 1,
      explanation:
        "CRR (Cash Reserve Ratio) is the percentage of total deposits that commercial banks must maintain as liquid cash reserves with the RBI. A cut in CRR injects liquidity into the banking system.",
      difficulty: "easy",
    },
    {
      articleId: inserted[7].id,
      question: "From which countries did India receive cheetahs under Project Cheetah?",
      options: ["Kenya and Tanzania", "Namibia and South Africa", "Zimbabwe and Botswana", "Iran and Afghanistan"],
      correctAnswer: 1,
      explanation:
        "India received the first batch of African cheetahs from Namibia in September 2022, followed by cheetahs from South Africa in 2023. India also explored bringing Asiatic cheetahs from Iran.",
      difficulty: "medium",
    },
  ];

  await db.insert(quizQuestionsTable).values(quizData);
  logger.info({ count: quizData.length }, "Seeded quiz questions");
  logger.info("Seed complete");
}
