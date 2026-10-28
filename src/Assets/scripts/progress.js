// Small localStorage helpers for the "My Courses" page: course ratings and the
// weekly learning streak. (Lesson progress itself lives in usersList.js, saved
// by the course player through saveProgress().)
// Everything is stored per user, so two accounts on one browser don't mix.

const key = (kind, userId) => `nexora_${kind}_${userId}`;

const read = (k, fallback) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (k, value) => {
  try {
    localStorage.setItem(k, JSON.stringify(value));
  } catch {
    /* storage full / blocked: ignore */
  }
};

// Total lessons = every lesson in every module. This is the same number the
// course player and the course page use, so the percentages always agree.
export const totalLessonsOf = (course) => {
  const sum = (course.courseModules || []).reduce(
    (s, m) => s + (m.lessonList ? m.lessonList.length : m.lessons || 0),
    0,
  );
  return sum || course.lessons || 0;
};

// ---------- Ratings: { [courseId]: 1..5 } ----------
export const loadRatings = (userId) => read(key("ratings", userId), {});

export function saveRating(userId, courseId, stars) {
  const all = loadRatings(userId);
  if (stars > 0) all[courseId] = stars;
  else delete all[courseId];
  write(key("ratings", userId), all);
}

// ---------- Activity + streak ----------
export const loadActivity = (userId) => read(key("activity", userId), []);

export function recordActivity(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const days = loadActivity(userId);
  if (days.includes(today)) return;
  write(key("activity", userId), [...days, today].slice(-400));
}

// Weeks run Monday to Sunday. The streak is the number of consecutive weeks,
// ending this week (or last week, if nothing has happened yet this week),
// that contain at least one day of learning.
const weekIndex = (isoDay) => {
  const ms = Date.parse(isoDay + "T00:00:00Z");
  return Math.floor((ms - 4 * 864e5) / (7 * 864e5)); // 1970-01-05 was a Monday
};

export function getStreakWeeks(userId) {
  const weeks = new Set(loadActivity(userId).map(weekIndex));
  let cur = weekIndex(new Date().toISOString().slice(0, 10));
  if (!weeks.has(cur)) cur -= 1;
  let streak = 0;
  while (weeks.has(cur)) {
    streak += 1;
    cur -= 1;
  }
  return streak;
}