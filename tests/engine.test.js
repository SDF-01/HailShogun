import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  PROFILES,
  cleanProfile,
  createHandoff,
  isActive,
  makeEmail,
  questionsFor,
  readHandoff,
  recommend,
} from "../js/engine.js";

test("follow-up questions appear only for the selected path", () => {
  const family = cleanProfile(PROFILES.family);
  assert.equal(questionsFor(family, 0).some((question) => question.key === "schoolStage"), true);
  const alone = { ...family, family: "alone" };
  assert.equal(isActive({ key: "children", parent: "family", when: "children" }, alone), false);
  assert.equal(questionsFor(alone, 0).some((question) => question.key === "schoolStage"), false);
});

test("empty answers still include the official arrival fallbacks", () => {
  const ids = recommend({}).map((item) => item.id);
  assert.deepEqual(ids, ["arrival", "orientation"]);
});

test("fictional profiles keep a stable recommendation order", () => {
  assert.deepEqual(recommend(PROFILES.outdoor).map((item) => item.id), [
    "arrival",
    "orientation",
    "islandnature",
    "snorkeling",
    "mainisland",
    "outdoors",
    "fitness",
    "travel",
    "relocation",
    "kerama",
  ]);
  assert.ok(recommend(PROFILES.first).some((item) => item.id === "gaming"));
  assert.ok(recommend(PROFILES.family).some((item) => item.id === "school"));
});

test("beginner snorkeling points to guided information, not a solo booking", () => {
  const match = recommend(PROFILES.outdoor).find((item) => item.id === "snorkeling");
  assert.match(match.reason, /Beginner information and guided options/i);
  assert.match(match.description, /operator guidance and sea conditions/i);
  assert.doesNotMatch(match.description, /solo/i);
});

test("handoff codes round-trip and expire after 30 days", () => {
  const now = Date.parse("2026-10-22T00:00:00Z");
  const { code, expiresAt } = createHandoff({ ...PROFILES.family, name: "  Jordan (fictional)  ", secret: "nope" }, now);
  assert.equal(code.startsWith("HS1."), true);
  assert.equal(expiresAt, now + 30 * 24 * 60 * 60 * 1000);
  const read = readHandoff(`\n${code}\n`, now + 1000);
  assert.equal(read.ok, true);
  assert.equal(read.profile.name, "Jordan (fictional)");
  assert.equal(read.profile.secret, undefined);
  assert.equal(read.profile.schoolStage[0], "elementary");
  const expired = readHandoff(code, expiresAt);
  assert.equal(expired.ok, false);
  assert.match(expired.error, /expired/i);
  assert.equal(readHandoff("HS1.not-a-code").ok, false);
});

test("legacy single answers still match", () => {
  const clean = cleanProfile({ priorities: ["finances"], moneyHelp: "movebudget" });
  assert.deepEqual(clean.moneyHelp, ["movebudget"]);
});

test("sponsor email is assembled from the selected answers", () => {
  const email = makeEmail(PROFILES.outdoor);
  assert.match(email, /Subject: Casey \(fictional\), your Okinawa welcome starts here/);
  assert.match(email, /YOUR OKINAWA: MATCHED TO YOUR ANSWERS/);
  assert.match(email, /https:\/\/visitokinawajapan.com\/travel-inspiration\/okinawa-snorkeling-guide\//);
  assert.match(email, /Your sponsor/);
});

test("user-facing files do not use an em dash", () => {
  for (const file of ["index.html", "js/app.js", "js/engine.js", "css/styles.css", "README.md"]) {
    if (!fs.existsSync(file)) continue;
    assert.equal(fs.readFileSync(file, "utf8").includes("\u2014"), false, file);
  }
});

test("both prototype image assets are present", () => {
  assert.ok(fs.statSync("assets/18th-wing.png").size > 1000);
  assert.ok(fs.statSync("assets/okinawa-flight.jpg").size > 1000);
  const html = fs.readFileSync("index.html", "utf8") + fs.readFileSync("js/app.js", "utf8");
  assert.match(html, /assets\/18th-wing\.png/);
  assert.match(html, /assets\/okinawa-flight\.jpg/);
});
