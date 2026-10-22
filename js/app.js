import { icon } from "./icons.js";
import {
  CATALOG,
  PROFILES,
  STEPS,
  answerLines,
  cleanProfile,
  createHandoff,
  makeEmail,
  questionsFor,
  readHandoff,
  recommend,
} from "./engine.js";

const VIEWS = new Set(["home", "questions", "results", "catalog", "sponsor", "complete", "feedback", "credits"]);

const state = {
  view: "home",
  step: 0,
  profile: {},
  menuOpen: false,
  query: "",
  scope: "all",
  consent: false,
  reviewed: false,
  email: "",
  codeInput: "",
  receipt: null,
  error: "",
  sponsorReady: false,
  feedbackRating: "",
  feedbackNote: "",
  feedbackStatus: "",
};

const app = document.querySelector("#app");

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function go(view, { resetScroll = true } = {}) {
  state.view = VIEWS.has(view) ? view : "home";
  state.menuOpen = false;
  state.error = "";
  const next = `#${state.view}`;
  if (location.hash !== next) location.hash = next;
  render(resetScroll);
}

function render(resetScroll = false) {
  const y = resetScroll ? 0 : window.scrollY;
  app.innerHTML = shell(viewMarkup());
  window.scrollTo(0, y);
}

function shell(main) {
  const nav = [
    ["home", "Overview"],
    ["catalog", "Explore"],
    ["sponsor", "For sponsors"],
  ];
  return `
    <a class="skip" href="#content">Skip to content</a>
    <div class="topline">
      <span><span class="gold-dot"></span> KADENA AIR BASE, OKINAWA, JAPAN</span>
      <span>INDEPENDENT WELCOME PROTOTYPE · AIR FORCE ONLY</span>
    </div>
    <header>
      <button class="identity" type="button" data-action="home" aria-label="Kadena Welcome home">
        <img src="assets/18th-wing.png" alt="18th Wing emblem">
        <span>KADENA <b>WELCOME</b><small>YOUR ASSIGNMENT. YOUR COMMUNITY.</small></span>
      </button>
      <nav class="${state.menuOpen ? "open" : ""}" aria-label="Main navigation">
        ${nav.map(([id, label]) => `<button type="button" class="${state.view === id || (id === "sponsor" && state.view === "results") ? "active" : ""}" data-action="${id}">${label}</button>`).join("")}
        <a href="https://www.kadena.af.mil/" target="_blank" rel="noreferrer">Official Kadena ${icon("arrow-up-right", 13)}</a>
      </nav>
      <button class="btn nav-start" type="button" data-action="start">Build your welcome ${icon("arrow-right", 15)}</button>
      <button class="btn ghost icon mobile-menu" type="button" data-action="menu" aria-label="Toggle navigation" aria-expanded="${state.menuOpen}">${icon("menu", 24)}</button>
    </header>
    <main id="content">${main}</main>
    ${footer()}
  `;
}

function footer() {
  return `
    <footer>
      <div class="footer-top">
        <div class="identity">
          <img src="assets/18th-wing.png" alt="18th Wing emblem">
          <span>KADENA <b>WELCOME</b><small>YOUR NEXT CHAPTER STARTS HERE.</small></span>
        </div>
        <div>
          <h3>Plan your arrival</h3>
          <a href="https://www.kadena.af.mil/Newcomers/" target="_blank" rel="noreferrer">Official newcomer information ↗</a>
          <a href="https://kadenafss.com/" target="_blank" rel="noreferrer">18th Force Support Squadron ↗</a>
        </div>
        <div>
          <h3>Make it better</h3>
          <button type="button" data-action="feedback">Give usability feedback</button>
          <button type="button" data-action="credits">Asset credits & identity</button>
          <button type="button" data-action="clear">Clear session</button>
        </div>
      </div>
      <div class="footer-bottom">
        <span>Independent concept. Not an official USAF website. Official imagery does not imply endorsement.</span>
        <span>Deterministic personalization. No AI service.</span>
      </div>
    </footer>
  `;
}

function viewMarkup() {
  switch (state.view) {
    case "questions":
      return questionsView();
    case "results":
      return state.sponsorReady ? resultsView() : sponsorView();
    case "catalog":
      return catalogView();
    case "sponsor":
      return sponsorView();
    case "complete":
      return state.receipt ? completeView() : homeView();
    case "feedback":
      return feedbackView();
    case "credits":
      return creditsView();
    case "home":
      return homeView();
    default: {
      const unknown = state.view;
      state.view = "home";
      return homeView() || unknown;
    }
  }
}

function homeView() {
  const tiles = [
    ["waves", "Ocean & islands", "Beaches, snorkeling and island scenery.", "Okinawa", "water"],
    ["mountain", "Nature & adventure", "Forests, mangroves and a different pace.", "Okinawa", "nature"],
    ["palette", "Culture & local life", "Ryukyu traditions, crafts and flavors.", "Okinawa", "culture"],
    ["calendar", "Festivals & events", "Find what's happening across Okinawa.", "Events", ""],
  ];
  const profiles = [
    ["first", "First assignment", "Gaming, music and finding your people.", "plane"],
    ["family", "A family move", "Schools, family outings and local flavors.", "users"],
    ["outdoor", "The outdoor explorer", "Ocean adventures, forests and island travel.", "compass"],
  ];
  return `
    <section class="hero">
      <img class="hero-photo" src="assets/okinawa-flight.jpg" alt="U.S. Air Force MC-130J aircraft flying near Okinawa's coast">
      <div class="hero-shade"></div>
      <div class="hero-inner">
        <div class="eyebrow light"><span></span> WELCOME TO THE KEYSTONE OF THE PACIFIC</div>
        <h1>A new mission.<br><span>A place to belong.</span></h1>
        <p>Your next chapter is more than an assignment. Discover Okinawa, share what matters to you, and help your sponsor make you feel at home before you land.</p>
        <div class="row">
          <button class="btn lg gold-button" type="button" data-action="start">Build my personal welcome ${icon("arrow-right", 17)}</button>
          <button class="btn lg hero-outline" type="button" data-action="catalog">Explore Okinawa ${icon("compass", 17)}</button>
        </div>
        <div class="hero-assurances">
          <span>${icon("shield-check", 14)} Nothing is stored on a server</span>
          <span>${icon("users", 14)} Code shared with your sponsor</span>
        </div>
      </div>
      <div class="hero-caption">${icon("map-pin", 13)} OKINAWA, JAPAN <span>U.S. Air Force photo / Staff Sgt. Jessi Roth · 2023</span></div>
    </section>
    <div class="quicklinks">
      <span>YOUR ARRIVAL, SIMPLIFIED</span>
      <a href="https://www.kadena.af.mil/Newcomers/" target="_blank" rel="noreferrer">Newcomer essentials ${icon("arrow-up-right", 15)}</a>
      <a href="https://www.kadena.af.mil/Agencies/MFRC/" target="_blank" rel="noreferrer">Military & Family Readiness ${icon("arrow-up-right", 15)}</a>
      <a href="https://kadenafss.com/directory" target="_blank" rel="noreferrer">18th FSS directory ${icon("arrow-up-right", 15)}</a>
    </div>
    <section class="section">
      <div class="section-heading">
        <div>
          <div class="eyebrow">THE WELCOME YOU MAKE YOUR OWN</div>
          <h2>Start with you.<br class="mobile-only"> Connect with everything else.</h2>
        </div>
        <p>A few thoughtful questions.<br>A more personal beginning.</p>
      </div>
      <div class="three-grid steps">
        <div><div class="split">${icon("compass", 24)}<span class="step-number">01</span></div><h3>Tell us what matters</h3><p>Your interests, your household, your moving priorities. Follow-up questions adapt as you answer.</p></div>
        <div><div class="split">${icon("map-pin", 24)}<span class="step-number">02</span></div><h3>Find your Okinawa</h3><p>Discover island experiences and practical resources selected around what you share.</p></div>
        <div><div class="split">${icon("users", 24)}<span class="step-number">03</span></div><h3>Meet your sponsor halfway</h3><p>Create a handoff code and share it with your sponsor. They rebuild your answers and write a personal welcome.</p></div>
      </div>
    </section>
    <section class="discover-band">
      <div class="section">
        <div class="section-heading">
          <div>
            <div class="eyebrow">BEYOND THE GATE</div>
            <h2>One assignment. An island of possibilities.</h2>
          </div>
          <button class="btn outline" type="button" data-action="catalog">Explore the library ${icon("arrow-right", 15)}</button>
        </div>
        <div class="four-grid">
          ${tiles.map(([glyph, title, copy, scope, query]) => `
            <button class="discovery-tile" type="button" data-action="tile" data-scope="${scope}" data-query="${esc(query)}">
              ${icon(glyph, 24)}
              <h3>${title}</h3>
              <p>${copy}</p>
              ${icon("arrow-up-right", 18).replace("<svg ", '<svg class="tile-arrow" ')}
            </button>
          `).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-heading">
        <div>
          <div class="eyebrow">TRY A FICTIONAL PROFILE</div>
          <h2>Different Airmen. Different welcomes.</h2>
        </div>
        <span class="muted">Explore without sharing personal information.</span>
      </div>
      <div class="three-grid">
        ${profiles.map(([id, title, copy, glyph]) => `
          <article class="card profile-card">
            <div class="card-body">
              ${icon(glyph, 24).replace("<svg ", '<svg class="text-primary mb-5" ')}
              <span class="eyebrow">FICTIONAL TEST PROFILE</span>
              <h3>${title}</h3>
              <p>${copy}</p>
              <button class="btn ghost flush" type="button" data-action="profile" data-profile="${id}">Try this form ${icon("arrow-right", 15)}</button>
            </div>
          </article>
        `).join("")}
      </div>
      <div class="sponsor-banner">
        <div>
          <div class="eyebrow">ALREADY A SPONSOR?</div>
          <h3>One code. A more personal welcome.</h3>
          <p>Enter the code your Airman shared to rebuild their form and create a welcome with a personal next step.</p>
        </div>
        <button class="btn" type="button" data-action="sponsor">${icon("upload", 16)} Open sponsor workspace</button>
      </div>
    </section>
  `;
}

function questionsView() {
  const questions = questionsFor(state.profile, state.step);
  const followUps = questions.filter((question) => question.parent).length;
  return `
    <section class="section form-layout">
      <aside>
        <div class="eyebrow">YOUR PERSONAL WELCOME</div>
        <h2>A better beginning<br>starts with you.</h2>
        <p>For inbound U.S. Air Force personnel. Use fictional details while testing.</p>
        <ol>
          ${STEPS.map((label, index) => `<li class="${index === state.step ? "current" : index < state.step ? "done" : ""}"><span>${index < state.step ? icon("check", 14) : index + 1}</span>${label}</li>`).join("")}
        </ol>
        <div class="aside-note">
          ${icon("shield-check", 20)}
          <p>No orders, exact travel dates, or sensitive information needed. Your handoff code carries the answers for 30 days. Share it only with your assigned sponsor.</p>
        </div>
      </aside>
      <div class="card">
        <div class="card-body form-content">
          <div class="split muted" style="font-size:12px">
            <span>STEP ${state.step + 1} OF 4</span>
            <span>${Math.round(((state.step + 1) / 4) * 100)}%</span>
          </div>
          <progress value="${state.step + 1}" max="4" aria-label="Questionnaire progress"></progress>
          <h2>${STEPS[state.step]}</h2>
          <p class="muted mb-7" style="font-size:14px">Choose what fits. Follow-up questions appear only when relevant. Every answer is optional.</p>
          ${state.step === 0 ? `<label class="field-label">What should we call you?<input id="display-name" maxlength="60" placeholder="A fictional first name" value="${esc(state.profile.name || "")}"></label>` : ""}
          ${questions.map((question) => `
            <fieldset class="${question.parent ? "nested" : ""}">
              ${question.parent ? '<span class="eyebrow">BASED ON YOUR ANSWER</span>' : ""}
              <legend>${esc(question.title)}${question.multi ? "<small>Select any that apply</small>" : ""}</legend>
              <div class="choice-grid">
                ${question.options.map(([value, label]) => {
                  const selected = question.multi
                    ? (state.profile[question.key] || []).includes(value)
                    : state.profile[question.key] === value;
                  return `<label class="choice"><input type="${question.multi ? "checkbox" : "radio"}" name="${esc(question.key)}" data-choice="1" data-key="${esc(question.key)}" data-value="${esc(value)}" data-multi="${question.multi ? "true" : "false"}" ${selected ? "checked" : ""}><span>${esc(label)}</span></label>`;
                }).join("")}
              </div>
            </fieldset>
          `).join("")}
          <p class="muted" role="status" style="font-size:12px">${followUps} follow-up questions active on this step.</p>
          ${state.step === 3 ? `
            <div class="submission-consent">
              <h3>Create a handoff code for your sponsor</h3>
              <p>The code contains your answers and expires in 30 days. Anyone who has the code can read them. This site does not store a copy. Share the code only with your assigned sponsor.</p>
              <label class="approval"><input id="consent" type="checkbox" ${state.consent ? "checked" : ""}>I agree to put these answers in a handoff code and share that code with my sponsor.</label>
            </div>
          ` : ""}
          ${state.error ? `<p class="error" role="alert">${esc(state.error)}</p>` : ""}
          <div class="form-actions">
            <button class="btn outline" type="button" data-action="back">${icon("arrow-left", 15)} ${state.step ? "Back" : "Cancel"}</button>
            <button class="btn" id="continue-btn" type="button" data-action="continue" ${state.step === 3 && !state.consent ? "disabled" : ""}>${state.step === 3 ? "Create my handoff code" : "Continue"} ${icon("arrow-right", 15)}</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function resourceCard(resource, matched = false) {
  return `
    <article class="card resource">
      <div class="card-body">
        <div class="split">
          <span class="tag">${esc(resource.category)}</span>
          <span class="muted" style="font-size:12px">${resource.scope === "Okinawa" ? "Across Okinawa" : "Kadena AB"}</span>
        </div>
        <h3>${esc(resource.title)}</h3>
        <p>${esc(resource.description)}</p>
        ${matched ? `<p class="match">${icon("check", 14)}<span>${esc(resource.reason)}</span></p>` : ""}
        <a class="source" href="${esc(resource.url)}" target="_blank" rel="noreferrer">Explore official resource ${icon("arrow-up-right", 15)}</a>
        <details>
          <summary>Source verification</summary>
          <p>${esc(resource.verification)} Reviewed Oct 21, 2026. Confirm current availability and instructions.</p>
        </details>
      </div>
    </article>
  `;
}

function resultsView() {
  const items = recommend(state.profile);
  const sections = [
    ["Your Okinawa discoveries", "Okinawa", "BEYOND THE GATE"],
    ["Your base & arrival resources", "Base", "A SMOOTHER LANDING"],
  ];
  return `
    <section class="section">
      <div class="section-heading">
        <div>
          <div class="eyebrow">YOUR ANSWERS. YOUR ISLAND. YOUR WELCOME.</div>
          <h2>${esc(state.profile.name || "Airman")}, start here.</h2>
          <p>Your active answers shape every match and the sponsor's draft.</p>
        </div>
        <button class="btn outline" type="button" data-action="sponsor">Open another code</button>
      </div>
      <article class="card handoff">
        <div class="card-body">
          <span class="eyebrow">SPONSOR WORKSPACE · RETRIEVED FORM</span>
          <h3>Start with what your Airman shared.</h3>
          <p>Review their answers, explore matched resources, and personalize the draft below. The newcomer sees only their submission confirmation and code.</p>
          <details open>
            <summary>Newcomer's form answers</summary>
            <dl class="summary">
              ${answerLines(state.profile).map((line) => `<div><dt>${esc(line.title)}</dt><dd>${esc(line.answer)}</dd></div>`).join("")}
            </dl>
          </details>
        </div>
      </article>
      <article class="card review-panel">
        <div class="card-body">
          <span class="eyebrow">SPONSOR WORKSPACE</span>
          <h2>Make the introduction yours.</h2>
          <p>Verify links and requirements. Add your contact details and a concrete next step before sharing.</p>
          <label class="field-label">Personalized welcome email
            <textarea id="welcome-email">${esc(state.email)}</textarea>
          </label>
          <label class="approval"><input id="sponsor-review" type="checkbox" ${state.reviewed ? "checked" : ""}>I am the reviewing sponsor. I checked the answers, sources and event details, and added my contact details and next step.</label>
          <button class="btn" type="button" data-action="download-email" ${state.reviewed ? "" : "disabled"}>${icon("download", 16)} Download reviewed email</button>
          <p id="review-status" class="muted mt-3" role="status" style="font-size:12px">${state.reviewed ? "Review confirmed for this text." : "Draft: awaiting sponsor review."} This site does not send email.</p>
        </div>
      </article>
      ${sections.map(([title, scope, eyebrow]) => {
        const group = items.filter((item) => item.scope === scope);
        return `
          <section class="resource-section">
            <div class="eyebrow">${eyebrow}</div>
            <h2>${title}</h2>
            ${group.length ? `<div class="three-grid">${group.map((item) => resourceCard(item, true)).join("")}</div>` : "<p>Select interests to personalize island suggestions, or browse the library.</p>"}
          </section>
        `;
      }).join("")}
      <div class="info-strip">
        ${icon("calendar", 24)}
        <p>Event discovery uses official external calendars. This site is not a complete live event feed. Confirm dates, access and availability with organizers.</p>
        <button class="btn outline" type="button" data-action="events">Find events ${icon("arrow-up-right", 15)}</button>
      </div>
    </section>
  `;
}

function catalogView() {
  const query = state.query.trim().toLowerCase();
  const items = CATALOG.filter((item) => {
    const scopeOk = state.scope === "all" || item.scope === state.scope || item.category === state.scope;
    const haystack = `${item.title} ${item.description} ${item.category} ${item.tags.join(" ")}`.toLowerCase();
    return scopeOk && haystack.includes(query);
  }).sort((a, b) => Number(a.scope === "Base") - Number(b.scope === "Base"));
  return `
    <section class="section">
      <div class="eyebrow">OFFICIAL SOURCES. WIDER HORIZONS.</div>
      <h2>Discover your Okinawa.</h2>
      <p class="intro-copy">Island experiences, cultural discoveries, event calendars and practical Kadena resources. Choose a starting point and make it your own.</p>
      <div class="catalog-filters">
        <label>
          ${icon("search", 18)}
          <input id="catalog-search" aria-label="Search resources" placeholder="Search nature, festivals, food, schools..." value="${esc(state.query)}">
        </label>
        <select id="catalog-scope" aria-label="Resource scope">
          ${[["all", "All resources"], ["Okinawa", "Across Okinawa"], ["Events", "Event calendars"], ["Base", "Base & arrival"]].map(([value, label]) => `<option value="${value}" ${state.scope === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </div>
      ${items.length ? `<div class="three-grid">${items.map((item) => resourceCard(item)).join("")}</div>` : '<p role="status">No matches. Try a broader search.</p>'}
    </section>
  `;
}

function sponsorView() {
  return `
    <section class="section narrow">
      <div class="eyebrow">SPONSOR WORKSPACE</div>
      <h2>Bring their answers into the conversation.</h2>
      <p class="intro-copy">Paste the handoff code shared by your newcomer. Their form, matched resources and personalized email draft will open here.</p>
      <div class="card">
        <div class="card-body code-entry">
          ${icon("key", 32)}
          <h3>Retrieve a newcomer's form</h3>
          <form id="lookup-form">
            <label class="field-label" for="handoff-code">Newcomer handoff code
              <textarea id="handoff-code" autocomplete="off" spellcheck="false" maxlength="8000" placeholder="Paste the HS1 code">${esc(state.codeInput)}</textarea>
            </label>
            <button class="btn" type="submit" ${state.codeInput.trim() ? "" : "disabled"}>Retrieve newcomer form ${icon("arrow-right", 16)}</button>
            ${state.error ? `<p class="error" role="alert">${esc(state.error)}</p>` : ""}
          </form>
        </div>
      </div>
      <div class="info-strip">
        ${icon("shield-check", 24)}
        <p>Codes expire 30 days after they are created. The code itself carries the answers, and this site does not keep a copy. Share it only inside your sponsorship conversation.</p>
      </div>
    </section>
  `;
}

function completeView() {
  const expires = new Date(state.receipt.expiresAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Tokyo",
  });
  return `
    <section class="section narrow">
      <article class="card">
        <div class="card-body receipt">
          <div class="receipt-check">${icon("check", 30)}</div>
          <div class="eyebrow">CODE READY · YOU'RE ALL SET</div>
          <h2>Your sponsor takes it from here.</h2>
          <p>Share this code with your assigned sponsor through an approved channel. They paste it on the sponsor page to rebuild your form and prepare your welcome.</p>
          <label class="field-label" for="saved-code">Your handoff code
            <textarea id="saved-code" readonly>${esc(state.receipt.code)}</textarea>
          </label>
          <p class="muted">Expires ${esc(expires)} (Japan time).</p>
          <button class="btn" type="button" data-action="save-code">${icon("download", 16)} Save my code</button>
          <p class="muted mt-5" style="font-size:12px">Save your code before leaving this page. It is not emailed, and this site does not keep a copy. Your form answers, resources and email draft are for your sponsor to review.</p>
        </div>
      </article>
    </section>
  `;
}

function feedbackView() {
  const ratings = ["1: Very difficult", "2: Difficult", "3: Okay", "4: Easy", "5: Very easy"];
  return `
    <section class="section narrow">
      <div class="eyebrow">HELP SHAPE THE NEXT WELCOME</div>
      <h2>How did the experience feel?</h2>
      <article class="card">
        <div class="card-body">
          <form id="feedback-form">
            <label class="field-label">How easy was this to use?
              <select id="feedback-rating">
                <option value="">Choose a rating</option>
                ${ratings.map((rating) => `<option ${state.feedbackRating === rating ? "selected" : ""}>${esc(rating)}</option>`).join("")}
              </select>
            </label>
            <label class="field-label">What helped? What was confusing or missing?
              <textarea id="feedback-note" maxlength="4000" placeholder="Leave out personal or sensitive details.">${esc(state.feedbackNote)}</textarea>
            </label>
            <button class="btn" type="submit">${icon("download", 16)} Download feedback</button>
            ${state.feedbackStatus ? `<p role="status">${esc(state.feedbackStatus)}</p>` : ""}
          </form>
        </div>
      </article>
    </section>
  `;
}

function creditsView() {
  return `
    <section class="section narrow">
      <div class="eyebrow">IDENTITY & ASSET SOURCES</div>
      <h2>Rooted in Kadena.</h2>
      <p>Independent prototype using a navy, blue, white and heritage-gold palette inspired by Air Force and 18th Wing identity. These are design tokens for this prototype, not a certified Kadena brand standard.</p>
      <article class="card">
        <div class="card-body">
          <img class="credits-crest" src="assets/18th-wing.png" alt="18th Wing emblem">
          <h3>18th Wing emblem</h3>
          <p>United States Air Force artwork, retrieved from the Wikimedia Commons reproduction. Preserved without recoloring.</p>
          <a class="source" href="https://commons.wikimedia.org/wiki/File:USAF_-_18th_Wing.png" target="_blank" rel="noreferrer">Asset provenance ${icon("arrow-up-right", 14)}</a>
          <a class="source" href="https://www.kadena.af.mil/About-Us/History/Wing-Emblem/" target="_blank" rel="noreferrer">Kadena emblem history ${icon("arrow-up-right", 14)}</a>
          <h3>Okinawa flight photograph</h3>
          <img src="assets/okinawa-flight.jpg" alt="U.S. Air Force MC-130J aircraft flying near Okinawa's coast">
          <p>U.S. Air Force photo by Staff Sgt. Jessi Roth, Oct. 6, 2023. 353rd Special Operations Wing MC-130J aircraft near Okinawa. Published by the 18th Wing on DVIDS. Historical imagery; not a claim about today's fleet.</p>
          <a class="source" href="https://www.dvidshub.net/image/8121601/353-sow-joint-air-operations" target="_blank" rel="noreferrer">Photo & credit ${icon("arrow-up-right", 14)}</a>
        </div>
      </article>
    </section>
  `;
}

function download(filename, text) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function startFresh() {
  state.profile = {};
  state.step = 0;
  state.consent = false;
  state.sponsorReady = false;
  state.reviewed = false;
  state.email = "";
  go("questions");
}

function loadProfile(id) {
  state.profile = cleanProfile(PROFILES[id]);
  state.step = 0;
  state.consent = false;
  state.sponsorReady = false;
  state.reviewed = false;
  go("questions");
}

function toggleChoice(key, value, multi) {
  const current = state.profile[key];
  if (multi) {
    const list = Array.isArray(current) ? [...current] : [];
    state.profile = {
      ...state.profile,
      [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
    };
  } else {
    state.profile = { ...state.profile, [key]: value };
  }
  state.reviewed = false;
  render(false);
}

function continueForm() {
  if (state.step < 3) {
    state.step += 1;
    state.error = "";
    render(true);
    return;
  }
  if (!state.consent) {
    state.error = "Confirm that you want to create a handoff code for your sponsor.";
    render(false);
    return;
  }
  state.receipt = createHandoff(state.profile);
  state.profile = {};
  state.consent = false;
  state.step = 0;
  go("complete");
}

function lookupCode(code) {
  const result = readHandoff(code);
  if (!result.ok) {
    state.error = result.error;
    render(false);
    return;
  }
  state.profile = result.profile;
  state.email = makeEmail(result.profile);
  state.reviewed = false;
  state.sponsorReady = true;
  state.codeInput = "";
  go("results");
}

function clearSession() {
  state.profile = {};
  state.step = 0;
  state.consent = false;
  state.reviewed = false;
  state.email = "";
  state.codeInput = "";
  state.receipt = null;
  state.sponsorReady = false;
  state.query = "";
  state.scope = "all";
  state.feedbackRating = "";
  state.feedbackNote = "";
  state.feedbackStatus = "";
  go("home");
}

app.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const action = trigger.dataset.action;
  if (action === "menu") {
    state.menuOpen = !state.menuOpen;
    render(false);
    return;
  }
  if (action === "start") {
    startFresh();
    return;
  }
  if (action === "profile") {
    loadProfile(trigger.dataset.profile);
    return;
  }
  if (action === "tile") {
    state.scope = trigger.dataset.scope || "all";
    state.query = trigger.dataset.query || "";
    go("catalog");
    return;
  }
  if (action === "events") {
    state.scope = "Events";
    state.query = "";
    go("catalog");
    return;
  }
  if (action === "back") {
    if (state.step) {
      state.step -= 1;
      state.error = "";
      render(true);
    } else {
      go("home");
    }
    return;
  }
  if (action === "continue") {
    continueForm();
    return;
  }
  if (action === "clear") {
    clearSession();
    return;
  }
  if (action === "download-email") {
    if (!state.reviewed) return;
    download("kadena-reviewed-welcome.txt", state.email);
    return;
  }
  if (action === "save-code" && state.receipt) {
    download(
      "kadena-handoff-code.txt",
      `Kadena Welcome handoff code: ${state.receipt.code}\nExpires: ${new Date(state.receipt.expiresAt).toISOString()}\nSponsor: open ${location.origin}${location.pathname}, select For sponsors, and paste this code.\nShare only with your assigned sponsor.\n`,
    );
    return;
  }
  if (VIEWS.has(action)) go(action);
});

app.addEventListener("change", (event) => {
  const choice = event.target.closest("[data-choice]");
  if (choice) {
    toggleChoice(choice.dataset.key, choice.dataset.value, choice.dataset.multi === "true");
    return;
  }
  if (event.target.id === "consent") {
    state.consent = event.target.checked;
    state.error = "";
    const button = document.querySelector("#continue-btn");
    if (button) button.disabled = !state.consent;
    const alert = document.querySelector(".error");
    if (alert) alert.remove();
    return;
  }
  if (event.target.id === "sponsor-review") {
    state.reviewed = event.target.checked;
    const button = document.querySelector('[data-action="download-email"]');
    const status = document.querySelector("#review-status");
    if (button) button.disabled = !state.reviewed;
    if (status) {
      status.textContent = `${state.reviewed ? "Review confirmed for this text." : "Draft: awaiting sponsor review."} This site does not send email.`;
    }
    return;
  }
  if (event.target.id === "catalog-scope") {
    state.scope = event.target.value;
    render(false);
    return;
  }
  if (event.target.id === "feedback-rating") state.feedbackRating = event.target.value;
});

app.addEventListener("input", (event) => {
  if (event.target.id === "display-name") {
    state.profile = { ...state.profile, name: event.target.value };
    return;
  }
  if (event.target.id === "catalog-search") {
    state.query = event.target.value;
    const pos = event.target.selectionStart;
    render(false);
    const next = document.querySelector("#catalog-search");
    if (next) {
      next.focus();
      next.setSelectionRange(pos, pos);
    }
    return;
  }
  if (event.target.id === "welcome-email") {
    state.email = event.target.value;
    state.reviewed = false;
    const box = document.querySelector("#sponsor-review");
    const button = document.querySelector('[data-action="download-email"]');
    const status = document.querySelector("#review-status");
    if (box) box.checked = false;
    if (button) button.disabled = true;
    if (status) status.textContent = "Draft: awaiting sponsor review. This site does not send email.";
    return;
  }
  if (event.target.id === "handoff-code") {
    state.codeInput = event.target.value;
    const button = event.target.form?.querySelector('button[type="submit"]');
    if (button) button.disabled = !state.codeInput.trim();
    return;
  }
  if (event.target.id === "feedback-note") state.feedbackNote = event.target.value;
});

app.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "lookup-form") {
    lookupCode(state.codeInput);
    return;
  }
  if (event.target.id === "feedback-form") {
    if (!state.feedbackRating && !state.feedbackNote.trim()) {
      state.feedbackStatus = "Add a rating or comment first.";
      render(false);
      return;
    }
    download(
      "kadena-usability-feedback.txt",
      `Kadena Welcome usability feedback\nEase: ${state.feedbackRating || "Not rated"}\n\n${state.feedbackNote}\n`,
    );
    state.feedbackStatus = "Downloaded. Share with your test coordinator; nothing was submitted online.";
    render(false);
  }
});

window.addEventListener("hashchange", () => {
  const view = location.hash.replace("#", "") || "home";
  if (!VIEWS.has(view) || view === state.view) return;
  state.view = view;
  state.menuOpen = false;
  state.error = "";
  render(true);
});

const initial = location.hash.replace("#", "");
if (VIEWS.has(initial)) state.view = initial;
if (state.view === "results" && !state.sponsorReady) state.view = "sponsor";
if (state.view === "complete" && !state.receipt) state.view = "home";
render(true);
