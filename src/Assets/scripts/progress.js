// Small localStorage helpers for the "My Courses" page.
// Everything is stored per user, so two accounts on one browser don't mix.
//
// CoursePlayer should call setLessonsCompleted(user.id, courseId, n) whenever
// a lesson is finished. That one call updates the progress bar, the % label,
// the "completed" / certificate counts and the learning streak.

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

// Total lessons = sum of every module's lessons (same maths as CourseView)
export const totalLessonsOf = (course) => {
  const sum = (course.courseModules || []).reduce(
    (s, m) => s + (m.lessons || 0),
    0,
  );
  return sum || course.lessons || 0;
};

// ---------- Progress: { [courseId]: lessonsCompleted } ----------
export const loadProgress = (userId) => read(key("progress", userId), {});

export function setLessonsCompleted(userId, courseId, count) {
  const all = loadProgress(userId);
  all[courseId] = Math.max(0, Math.floor(count));
  write(key("progress", userId), all);
  recordActivity(userId);
}

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