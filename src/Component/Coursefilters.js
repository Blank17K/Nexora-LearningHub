// Filter definitions + helpers for the Courses page.
// Everything here is derived from fields that really exist on each course:
//   rating, banner.hours, banner.type, banner.courseClass

export const RATING_STEPS = [4.8, 4.5, 4.0];

export const DURATION_BUCKETS = [
  { id: "lt35", label: "Under 35 hours", test: (h) => h < 35 },
  { id: "35to45", label: "35 – 45 hours", test: (h) => h >= 35 && h < 45 },
  { id: "45plus", label: "45+ hours", test: (h) => h >= 45 },
];

const LEVEL_ORDER = ["Beginner", "Intermediate", "Advanced"];

export const EMPTY_FILTERS = {
  rating: 0, // 0 = any rating
  durations: [], // bucket ids
  topics: [], // banner.type values
  levels: [], // banner.courseClass values
};

// An empty group means "no restriction" for that group.
const groupTests = {
  rating: (c, f) => !f.rating || c.rating >= f.rating,
  durations: (c, f) =>
    f.durations.length === 0 ||
    DURATION_BUCKETS.some(
      (b) => f.durations.includes(b.id) && b.test(c.banner.hours)
    ),
  topics: (c, f) => f.topics.length === 0 || f.topics.includes(c.banner.type),
  levels: (c, f) =>
    f.levels.length === 0 || f.levels.includes(c.banner.courseClass),
};

export function matchesFilters(course, filters) {
  return Object.keys(groupTests).every((g) => groupTests[g](course, filters));
}

export function countActiveFilters(f) {
  return (f.rating ? 1 : 0) + f.durations.length + f.topics.length + f.levels.length;
}

export function getTopicList(courses) {
  return [...new Set(courses.map((c) => c.banner.type))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getLevelList(courses) {
  const present = new Set(courses.map((c) => c.banner.courseClass));
  const known = LEVEL_ORDER.filter((l) => present.has(l));
  const extra = [...present].filter((l) => !LEVEL_ORDER.includes(l));
  return [...known, ...extra];
}

// "How many courses would I see if I picked this option?" — respects every
// other filter that is already active, so the numbers never lie.
export function getFilterCounts(courses, filters) {
  const count = (group, value) =>
    courses.filter((c) => matchesFilters(c, { ...filters, [group]: value })).length;

  return {
    rating: Object.fromEntries([
      [0, count("rating", 0)],
      ...RATING_STEPS.map((s) => [s, count("rating", s)]),
    ]),
    durations: Object.fromEntries(
      DURATION_BUCKETS.map((b) => [b.id, count("durations", [b.id])])
    ),
    topics: Object.fromEntries(
      getTopicList(courses).map((t) => [t, count("topics", [t])])
    ),
    levels: Object.fromEntries(
      getLevelList(courses).map((l) => [l, count("levels", [l])])
    ),
  };
}