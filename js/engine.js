const DAY_MS = 24 * 60 * 60 * 1000;
const HANDOFF_TTL_MS = 30 * DAY_MS;

export const STEPS = [
  "Your starting point",
  "A smoother move",
  "Life in Okinawa",
  "Your kind of welcome",
];

export const QUESTIONS = [
  { key: "first", step: 0, title: "Is this your first assignment?", options: [["yes", "My first assignment"], ["no", "I have moved before"]] },
  { key: "firstHelp", step: 0, parent: "first", when: "yes", title: "What would make your first assignment easier?", multi: true, options: [["arrival", "Knowing what happens when I arrive"], ["social", "Meeting people"], ["finances", "Getting financially settled"]] },
  { key: "family", step: 0, title: "Who is making the move?", options: [["alone", "Just me"], ["partner", "With my spouse / partner"], ["children", "With children"]] },
  { key: "partnerHelp", step: 0, parent: "family", when: "partner", title: "What would your household like to explore?", multi: true, options: [["culture", "Shared cultural experiences"], ["food", "Food and markets"], ["social", "Community connections"]] },
  { key: "children", step: 0, parent: "family", when: "children", title: "Which family resources would help?", multi: true, options: [["childcare", "Childcare"], ["school", "K-12 schools"], ["youth", "Youth activities"], ["familyfun", "Family outings"]] },
  { key: "schoolStage", step: 0, parent: "children", when: "school", title: "Which school stages should your sponsor know about?", multi: true, options: [["elementary", "Elementary school"], ["middle", "Middle school"], ["high", "High school"]] },
  { key: "priorities", step: 1, title: "What would help you settle in?", multi: true, options: [["housing", "Housing"], ["transport", "Transportation"], ["pets", "Moving with pets"], ["finances", "Financial readiness"]] },
  { key: "housingHelp", step: 1, multi: true, legacySingle: true, parent: "priorities", when: "housing", title: "Where should the housing conversation start?", options: [["arrival", "Temporary lodging questions"], ["housing", "Understanding housing options"]] },
  { key: "transportHelp", step: 1, multi: true, legacySingle: true, parent: "priorities", when: "transport", title: "What transportation help would be useful?", options: [["pickup", "Coordinate arrival transportation"], ["gettingaround", "Explore before I have a vehicle"], ["driving", "Understand local driving requirements"]] },
  { key: "petHelp", step: 1, parent: "priorities", when: "pets", title: "What pet planning would help?", multi: true, options: [["pettravel", "Travel preparation"], ["petlodging", "Pet-friendly lodging questions"]] },
  { key: "moneyHelp", step: 1, multi: true, legacySingle: true, parent: "priorities", when: "finances", title: "Which financial planning topics would help?", options: [["movebudget", "Moving costs"], ["activitiesbudget", "An activity budget"]] },
  { key: "interests", step: 2, title: "What would you love to discover in Okinawa?", multi: true, options: [["outdoors", "Nature & outdoor adventures"], ["water", "Beaches & the ocean"], ["culture", "Culture & history"], ["food", "Food & local markets"], ["music", "Music & performing arts"], ["creative", "Arts & making"], ["fitness", "Fitness & sports"], ["gaming", "Gaming"], ["travel", "Exploring the islands"], ["volunteer", "Volunteering"], ["events", "Festivals & events"]] },
  { key: "outdoor", step: 2, parent: "interests", when: "outdoors", title: "What draws you outdoors?", multi: true, options: [["forest", "Forests & wildlife"], ["scenery", "Scenic views & easy walks"], ["water", "Water activities"]] },
  { key: "ocean", step: 2, parent: "interests", when: "water", title: "What kind of ocean day?", multi: true, options: [["beach", "Beach time"], ["snorkel", "Snorkeling"], ["islands", "Island scenery"]] },
  { key: "waterComfort", step: 2, parent: "ocean", when: "snorkel", title: "How would you like to start snorkeling?", options: [["beginner", "Beginner information and guided options"], ["experienced", "I have experience; help me explore locations"]] },
  { key: "cultureDetail", step: 2, parent: "interests", when: "culture", title: "Which parts of the culture interest you?", multi: true, options: [["heritage", "History & heritage"], ["crafts", "Traditional crafts"], ["performing", "Dance & traditional music"]] },
  { key: "foodDetail", step: 2, parent: "interests", when: "food", title: "What would you like to explore?", multi: true, options: [["localfood", "Okinawan dishes"], ["markets", "Markets & food events"]] },
  { key: "musicDetail", step: 2, parent: "interests", when: "music", title: "What sounds like your kind of outing?", multi: true, options: [["performing", "Traditional performances"], ["livemusic", "Live music & community events"]] },
  { key: "creativeDetail", step: 2, parent: "interests", when: "creative", title: "How do you like to get creative?", multi: true, options: [["crafts", "Traditional arts & crafts"], ["exhibitions", "Exhibitions & cultural outings"]] },
  { key: "fitnessDetail", step: 2, parent: "interests", when: "fitness", title: "What kind of active time?", multi: true, options: [["gym", "Gym & sports facilities"], ["sportsevents", "Sporting events"], ["scenery", "Outdoor movement"]] },
  { key: "gamingDetail", step: 2, parent: "interests", when: "gaming", title: "How do you like to game?", options: [["esports", "Organized esports"], ["gamingfriends", "Meet other gamers"]] },
  { key: "travelDetail", step: 2, parent: "interests", when: "travel", title: "How far would you like to explore?", multi: true, options: [["mainisland", "Start on Okinawa's main island"], ["islands", "Discover the outer islands"]] },
  { key: "volunteerDetail", step: 2, parent: "interests", when: "volunteer", title: "How should your sponsor help you connect?", options: [["unitvolunteer", "Ask about current unit opportunities"], ["communityvolunteer", "Ask about community opportunities"]] },
  { key: "eventTypes", step: 2, parent: "interests", when: "events", title: "Which events would you look for?", multi: true, options: [["festivals", "Cultural festivals"], ["livemusic", "Music & performances"], ["markets", "Food & markets"], ["sportsevents", "Sporting events"], ["familyfun", "Family-friendly events"]] },
  { key: "social", step: 3, title: "How do you like to connect?", options: [["meet", "Help me meet people"], ["independent", "I prefer to explore independently"], ["unsure", "I am still figuring it out"]] },
  { key: "socialDetail", step: 3, parent: "social", when: "meet", title: "What would make a good introduction?", multi: true, options: [["smallgroup", "A small group"], ["bigevent", "A larger event"], ["oneonone", "A one-to-one introduction"]] },
  { key: "pace", step: 3, title: "What would a good first outing feel like?", options: [["gentle", "Low-key and easy to plan"], ["active", "Active and adventurous"], ["familyday", "A family day out"]] },
  { key: "outingHelp", step: 3, parent: "pace", when: "gentle", title: "What would keep it manageable?", options: [["short", "A short outing"], ["guided", "Something guided or organized"]] },
  { key: "eventWindow", step: 3, title: "When would you like to look for events?", options: [["soon", "Around arrival: dates to confirm with my sponsor"], ["later", "After I have settled in"], ["anytime", "Just browsing for inspiration"]] },
];

const baseCatalog = [
  { id: "arrival", title: "Your arrival starting point", category: "Essentials", url: "https://www.kadena.af.mil/Newcomers/", description: "Use the official newcomer hub to plan your move with your sponsor.", always: true, tags: [], verification: "Official search index reviewed; direct access returned 403." },
  { id: "orientation", title: "Newcomer orientation", category: "Essentials", url: "https://www.kadena.af.mil/Agencies/MFRC/", description: "Review current pre-arrival and in-person orientation instructions with M&FRC.", always: true, tags: [], verification: "Official search index reviewed; direct access returned 403." },
  { id: "school", title: "School Liaison Program", category: "Family", url: "https://kadenafss.com/school-liaison-program", description: "A starting point for school transitions and K-12 questions.", tags: ["school"], verification: "Official program page reviewed." },
  { id: "care", title: "Childcare & youth programs", category: "Family", url: "https://kadenafss.com/directory", description: "Find child development, school age care and youth program contacts in the FSS directory.", tags: ["childcare", "youth"], verification: "Programs confirmed in official FSS directory." },
  { id: "outdoors", title: "Outdoor Recreation & Marina", category: "Explore", url: "https://kadenafss.com/directory", description: "Find Outdoor Recreation and Marina contacts; ask staff about current activities and conditions.", tags: ["outdoors", "water"], verification: "Facilities confirmed in official FSS directory." },
  { id: "fitness", title: "Fitness & sports", category: "Interests", url: "https://kadenafss.com/directory", description: "Find fitness and sports facilities through the FSS directory.", tags: ["fitness"], verification: "Facilities confirmed in official FSS directory." },
  { id: "gaming", title: "Kadena Esports", category: "Interests", url: "https://kadenafss.com/directory", description: "Find Kadena Esports through the official directory and check current opportunities.", tags: ["gaming"], verification: "Program confirmed in official FSS directory." },
  { id: "creative", title: "Arts, crafts & library", category: "Interests", url: "https://kadenafss.com/directory", description: "Explore creative facilities and library contacts in the FSS directory.", tags: ["creative", "music"], verification: "Arts & Crafts and Library confirmed; no specific music program promised." },
  { id: "community", title: "Schilling Community Center", category: "Community", url: "https://kadenafss.com/directory", description: "Ask the community center about current activities and ways to connect.", tags: ["social", "volunteer"], verification: "Facility confirmed in official FSS directory." },
  { id: "travel", title: "Information, Tickets & Travel", category: "Explore", url: "https://kadenafss.com/directory", description: "Contact ITT to explore current local travel and cultural opportunities.", tags: ["culture", "travel"], verification: "Facility confirmed in official FSS directory." },
  { id: "relocation", title: "Housing, pets & moving essentials", category: "Relocation", url: "https://www.kadena.af.mil/Newcomers/", description: "Review official relocation links with your sponsor for the priorities you selected.", tags: ["housing", "pets", "transport", "finances"], verification: "Official newcomer search index reviewed; direct access returned 403." },
];

const islandRows = [
  ["islandnature", "Forests, mangroves & wild Okinawa", "Nature", "https://visitokinawajapan.com/discover/wonderful-nature-okinawa/", "Discover Yanbaru forests, mangrove landscapes and island scenery.", ["outdoors", "forest", "scenery"]],
  ["snorkeling", "Okinawa snorkeling guide", "Ocean", "https://visitokinawajapan.com/travel-inspiration/okinawa-snorkeling-guide/", "Explore the official snorkeling guide and check operator guidance and sea conditions before planning.", ["water", "snorkel", "beginner", "experienced"]],
  ["islandculture", "Ryukyu culture & traditional arts", "Culture", "https://visitokinawajapan.com/discover/traditional-culture/", "Discover Okinawan crafts, performing arts and local traditions.", ["culture", "heritage", "crafts", "performing", "creative", "music", "exhibitions"]],
  ["islandfood", "Okinawan food & local flavors", "Food", "https://visitokinawajapan.com/discover/food-and-longevity/", "Get to know the food traditions that make Okinawa distinctive.", ["food", "localfood", "markets"]],
  ["mainisland", "Explore Okinawa's main island", "Destinations", "https://visitokinawajapan.com/destinations/okinawa-main-island/", "Browse the main island by region and choose a starting point with your sponsor.", ["travel", "mainisland", "scenery", "familyfun", "beach"]],
  ["kerama", "The Kerama Islands", "Destinations", "https://visitokinawajapan.com/destinations/kerama-islands/", "Discover the Kerama Islands; check transport, conditions and trip arrangements before travel.", ["islands"]],
  ["islandevents", "Okinawa festivals & event calendar", "Events", "https://visitokinawajapan.com/discover/events/", "Browse the official English event calendar across festivals, music, sports and family activities.", ["events", "festivals", "livemusic", "sportsevents", "markets", "familyfun", "music", "culture"]],
  ["localevents", "Okinawa Story event finder (Japanese)", "Events", "https://www.okinawastory.jp/event/", "Explore the Japanese tourism event finder by date, area and category.", ["events", "festivals", "markets", "familyfun", "livemusic", "sportsevents"]],
];

export const CATALOG = [
  ...baseCatalog.map((item) => ({ ...item, scope: "Base" })),
  ...islandRows.map(([id, title, category, url, description, tags]) => ({
    id,
    title,
    category,
    url,
    description,
    tags,
    scope: "Okinawa",
    verification: "Official Okinawa Convention & Visitors Bureau page reviewed Oct 21, 2026. Event calendars are external and change over time.",
  })),
];

const community = CATALOG.find((item) => item.id === "community");
community.tags = [...community.tags, "meet", "unitvolunteer", "communityvolunteer"];

export const PROFILES = {
  first: {
    name: "Alex (fictional)",
    first: "yes",
    family: "alone",
    interests: ["gaming", "music", "culture"],
    priorities: ["housing", "transport"],
    social: "meet",
    musicDetail: ["livemusic"],
    cultureDetail: ["performing"],
    firstHelp: ["social"],
    eventWindow: "soon",
    pace: "gentle",
    outingHelp: "short",
  },
  family: {
    name: "Jordan (fictional)",
    first: "no",
    family: "children",
    children: ["school", "childcare", "familyfun"],
    schoolStage: ["elementary"],
    interests: ["culture", "food", "events"],
    eventTypes: ["familyfun", "markets"],
    foodDetail: ["localfood"],
    priorities: ["housing", "finances"],
    social: "meet",
    pace: "familyday",
    eventWindow: "later",
  },
  outdoor: {
    name: "Casey (fictional)",
    first: "no",
    family: "alone",
    interests: ["outdoors", "water", "fitness", "travel"],
    outdoor: ["forest", "scenery"],
    ocean: ["snorkel"],
    waterComfort: "beginner",
    travelDetail: ["mainisland", "islands"],
    priorities: ["transport"],
    social: "independent",
    pace: "active",
    eventWindow: "anytime",
  },
};

export function isActive(question, profile) {
  if (!question.parent) return true;
  const parent = QUESTIONS.find((item) => item.key === question.parent);
  if (!parent || !isActive(parent, profile)) return false;
  const value = profile[question.parent];
  return Array.isArray(value) ? value.includes(question.when) : value === question.when;
}

export function questionsFor(profile, step) {
  return QUESTIONS.filter((question) => question.step === step && isActive(question, profile));
}

export function cleanProfile(input) {
  const source = input && typeof input === "object" ? input : {};
  const clean = {};
  if (typeof source.name === "string") {
    const name = source.name.trim().slice(0, 60);
    if (name) clean.name = name;
  }
  for (const question of QUESTIONS) {
    if (!isActive(question, clean)) continue;
    const allowed = question.options.map((option) => option[0]);
    if (question.multi) {
      const raw = Array.isArray(source[question.key])
        ? source[question.key]
        : question.legacySingle && typeof source[question.key] === "string"
          ? [source[question.key]]
          : [];
      const values = [...new Set(raw.filter((value) => allowed.includes(value)))];
      if (values.length) clean[question.key] = values;
    } else if (allowed.includes(source[question.key])) {
      clean[question.key] = source[question.key];
    }
  }
  return clean;
}

export function tagsFor(profile) {
  const clean = cleanProfile(profile);
  const tags = QUESTIONS.flatMap((question) => {
    const value = clean[question.key];
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  });
  return [...new Set(tags)];
}

export function answerLines(profile) {
  const clean = cleanProfile(profile);
  return QUESTIONS.filter((question) => {
    const value = clean[question.key];
    return isActive(question, clean) && value && (!Array.isArray(value) || value.length);
  }).map((question) => ({
    title: question.title,
    answer: question.options
      .filter((option) => {
        const value = clean[question.key];
        return Array.isArray(value) ? value.includes(option[0]) : value === option[0];
      })
      .map((option) => option[1])
      .join(", "),
  }));
}

export function recommend(profile) {
  const clean = cleanProfile(profile);
  const tags = new Set(tagsFor(clean));
  return CATALOG.map((resource, order) => {
    const matched = resource.tags.filter((tag) => tags.has(tag));
    const reasons = QUESTIONS.filter((question) => isActive(question, clean)).flatMap((question) =>
      question.options
        .filter((option) => {
          const value = clean[question.key];
          const selected = Array.isArray(value) ? value.includes(option[0]) : value === option[0];
          return selected && matched.includes(option[0]);
        })
        .map((option) => option[1]),
    );
    return {
      ...resource,
      score: resource.always ? 100 : matched.length * 5,
      reason: resource.always
        ? "Arrival essentials for every inbound Airman"
        : [...new Set(reasons)].join(", "),
      order,
    };
  })
    .filter((resource) => resource.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order);
}

function labels(profile, key) {
  const question = QUESTIONS.find((item) => item.key === key);
  const value = profile[key];
  if (!question || value == null) return "";
  return question.options
    .filter((option) => (Array.isArray(value) ? value.includes(option[0]) : value === option[0]))
    .map((option) => option[1].toLowerCase())
    .join(", ");
}

function section(title, items) {
  if (!items.length) return "";
  const body = items
    .map((item) => `• ${item.title}: because you selected ${item.reason.toLowerCase()}.\n${item.description}\n${item.url}`)
    .join("\n\n");
  return `\n\n${title}\n${body}`;
}

export function makeEmail(profile, items = recommend(profile)) {
  const clean = cleanProfile(profile);
  const paragraphs = [];
  if (clean.first === "yes") {
    paragraphs.push("Since this is your first assignment, let's walk through arrival together and make space for your questions.");
  }
  if (clean.family === "children") {
    const stages = labels(clean, "schoolStage");
    const needs = labels(clean, "children");
    const stageText = stages ? ` in ${stages}` : "";
    const needText = needs
      ? `You highlighted ${needs}; I'll use those as starting points for our family conversation.`
      : "Let's talk about what your family needs to settle in.";
    paragraphs.push(`You're moving with children${stageText}. ${needText}`);
  }
  if (clean.family === "partner") {
    const household = labels(clean, "partnerHelp");
    paragraphs.push(
      `You're moving with your spouse or partner.${household ? ` I noted your household's interest in ${household}.` : ""}`,
    );
  }
  const interests = labels(clean, "interests");
  if (interests) {
    paragraphs.push(
      `Beyond the move, you're looking forward to ${interests}. Okinawa has much more to discover beyond the installation, so your suggestions below include the island experiences that match what you shared.`,
    );
  }
  if (clean.social === "meet") {
    const detail = labels(clean, "socialDetail");
    paragraphs.push(
      `You'd like help meeting people${detail ? `, especially through ${detail}` : ""}. Let's discuss an introduction that feels comfortable.`,
    );
  }
  if (clean.social === "independent") {
    paragraphs.push("You prefer exploring independently, so these links can help you choose your own starting points.");
  }
  if (clean.pace) {
    const pace = labels(clean, "pace");
    const help = labels(clean, "outingHelp");
    paragraphs.push(
      `For a first outing, you chose ${pace}${help ? `, with ${help}` : ""}. We can shape the plan around that pace.`,
    );
  }
  const priorities = labels(clean, "priorities");
  if (priorities) {
    paragraphs.push(`For settling in, your priorities are ${priorities}. Let's work through those before committing to an outing.`);
  }
  const matched = items.filter((item) => !item.always);
  const okinawa = matched.filter((item) => item.scope === "Okinawa");
  const base = matched.filter((item) => item.scope === "Base");
  const essentials = items.filter((item) => item.always);
  const answers = answerLines(clean).map((line) => `• ${line.title} ${line.answer}`).join("\n");
  const eventWindow = labels(clean, "eventWindow");
  const intro = paragraphs.length
    ? paragraphs.join("\n\n")
    : "You haven't shared any preferences yet. The arrival links below are a starting point; tell me what you enjoy and what would make the move easier.";
  const eventNote = eventWindow ? `For events, you chose: ${eventWindow}. ` : "";
  return [
    `Subject: ${clean.name || "Airman"}, your Okinawa welcome starts here`,
    "",
    `Hello ${clean.name || "Airman"},`,
    "",
    "Welcome to Kadena! I'm looking forward to getting to know you and helping you feel at home in Okinawa.",
    "",
    intro,
    section("YOUR OKINAWA: MATCHED TO YOUR ANSWERS", okinawa),
    section("SETTLING IN AND CONNECTING ON BASE", base),
    section("ARRIVAL ESSENTIALS", essentials),
    "",
    "",
    `${eventNote}The event links are calendars to explore together, not confirmed bookings or a complete live event feed. Let's confirm the date, location and organizer details when we choose an outing.`,
    "",
    "YOUR ANSWERS AT A GLANCE",
    answers,
    "",
    "What would you like us to plan first?",
    "",
    "Your sponsor",
    "[Sponsor: add your name, approved contact details, and a concrete next step before sharing]",
  ].join("\n");
}

function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function createHandoff(profile, now = Date.now()) {
  const clean = cleanProfile(profile);
  const expiresAt = now + HANDOFF_TTL_MS;
  const code = `HS1.${toBase64Url(JSON.stringify({ v: 1, e: expiresAt, p: clean }))}`;
  return { code, expiresAt };
}

export function readHandoff(code, now = Date.now()) {
  const trimmed = String(code || "").replace(/\s+/g, "");
  if (!trimmed.startsWith("HS1.")) {
    return { ok: false, error: "Enter a HailShogun handoff code that starts with HS1." };
  }
  let payload;
  try {
    payload = JSON.parse(fromBase64Url(trimmed.slice(4)));
  } catch {
    return { ok: false, error: "That code is incomplete or damaged. Paste the full code and try again." };
  }
  if (!payload || payload.v !== 1 || typeof payload.e !== "number" || !payload.p || typeof payload.p !== "object") {
    return { ok: false, error: "That code is not a welcome handoff. Paste the code from the newcomer receipt." };
  }
  if (now >= payload.e) {
    return { ok: false, error: "This code expired. Ask the newcomer to create a new one." };
  }
  return { ok: true, profile: cleanProfile(payload.p), expiresAt: payload.e };
}
