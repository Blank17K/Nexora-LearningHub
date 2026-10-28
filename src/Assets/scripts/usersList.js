import usersData from "./usersList.json";

const STORAGE_KEY = "purchasedCourses"; // { [userId]: [courseId, ...] }
const USERS_KEY = "nexoraUsers";        // accounts created through Sign Up
const SESSION_KEY = "nexoraSession";    // { id } of the signed-in user
const CART_KEY = "nexoraCart";          // shape: { [userId]: [courseId, ...] }
const FAV_KEY = "nexoraFavourites";     // shape: { [userId]: [courseId, ...] }
const PROGRESS_KEY = "lessonProgress";  // { [userId]: { [courseId]: { completed: [], lastLesson } } }

// "local" survives closing the browser, "session" only survives a refresh.
function store(kind) {
    return kind === "session" ? window.sessionStorage : window.localStorage;
}

function readJSON(kind, key, fallback) {
    try {
        const raw = store(kind).getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJSON(kind, key, value) {
    try {
        store(kind).setItem(key, JSON.stringify(value));
    } catch {
        // storage unavailable (private mode / quota) - ignore
    }
}

function removeKey(kind, key) {
    try {
        store(kind).removeItem(key);
    } catch {
        // ignore
    }
}

function loadSaved() {
    const saved = readJSON("local", STORAGE_KEY, {});
    return saved && typeof saved === "object" ? saved : {};
}

function loadProgress() {
    const data = readJSON("local", PROGRESS_KEY, {});
    return data && typeof data === "object" ? data : {};
}


// Reads a { [userId]: [courseId, ...] } map and returns one user's list.
function loadUserList(key, userId) {
    const all = readJSON("local", key, {});
    const list = all && typeof all === "object" ? all[userId] : [];
    return Array.isArray(list) ? list : [];
}

function saveUserList(key, userId, list) {
    const all = readJSON("local", key, {});
    const next = all && typeof all === "object" ? all : {};
    next[userId] = list;
    writeJSON("local", key, next);
}

export const loadCart = (userId) => loadUserList(CART_KEY, userId);
export const saveCart = (userId, list) => saveUserList(CART_KEY, userId, list);
export const loadFavourites = (userId) => loadUserList(FAV_KEY, userId);
export const saveFavourites = (userId, list) =>
    saveUserList(FAV_KEY, userId, list);

const saved = loadSaved();

// Accounts registered in the browser are merged after the ones in usersList.json
const storedUsers = readJSON("local", USERS_KEY, []);
const extraUsers = Array.isArray(storedUsers)
    ? storedUsers.filter((s) => s && !usersData.some((u) => u.id === s.id))
    : [];

// Base data comes from usersList.json; registered accounts, purchases and
// lesson progress made in the browser are merged on top of it.
const progressByUser = loadProgress();

const usersInfo = [...usersData, ...extraUsers].map((user) => ({
    ...user,
    purchasedCourses: Array.from(
        new Set([...(user.purchasedCourses || []), ...(saved[user.id] || [])])
    ),
    cart: loadCart(user.id),
    favourites: loadFavourites(user.id),
    progress: progressByUser[user.id] || {},
}));

// Call this after a successful Sign Up so the account survives a refresh.
export function saveRegisteredUser(user) {
    const current = readJSON("local", USERS_KEY, []);
    const list = Array.isArray(current) ? current : [];
    writeJSON("local", USERS_KEY, [...list.filter((u) => u.id !== user.id), user]);
}

// Remember who is signed in. remember=true -> still signed in after the browser
// is closed ("Keep me signed in"); otherwise only until the tab is closed.
export function saveSession(userId, remember = false) {
    clearSession();
    writeJSON(remember ? "local" : "session", SESSION_KEY, { id: userId });
}

// Returns the signed-in user (from the given list) or null.
export function loadSession(users) {
    const data =
        readJSON("local", SESSION_KEY, null) || readJSON("session", SESSION_KEY, null);
    if (!data) return null;
    const found = users.find((u) => u.id === data.id);
    if (!found) clearSession(); // account no longer exists
    return found || null;
}

export function clearSession() {
    removeKey("local", SESSION_KEY);
    removeKey("session", SESSION_KEY);
}

// Call this after a successful payment.
export function savePurchase(userId, courseId) {
    const user = usersInfo.find((u) => u.id === userId);
    if (user && !user.purchasedCourses.includes(courseId)) {
        user.purchasedCourses.push(courseId);
    }

    const current = loadSaved();
    const list = current[userId] || [];
    if (!list.includes(courseId)) {
        current[userId] = [...list, courseId];
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        } catch {
            // storage unavailable (private mode / quota) - ignore
        }
    }
}

// ── Lesson progress (used by coursePlayer.js) ─────────────

/**
 * Persist a user's progress for one course.
 * @param {number} userId
 * @param {number|string} courseId
 * @param {{ completed?: number[], lastLesson?: number }} payload
 */
export function saveProgress(userId, courseId, payload = {}) {
    if (!userId || courseId == null) return;
    const all = loadProgress();
    const forUser = all[userId] || {};
    forUser[courseId] = {
        completed: Array.from(new Set(payload.completed || [])),
        lastLesson:
            typeof payload.lastLesson === "number" ? payload.lastLesson : 0,
    };
    all[userId] = forUser;
    writeJSON("local", PROGRESS_KEY, all);

    // Keep the in-memory user object in sync so navigation doesn't reload stale data.
    const user = usersInfo.find((u) => u.id === userId);
    if (user) {
        user.progress = user.progress || {};
        user.progress[courseId] = forUser[courseId];
    }
}

/**
 * Read a user's saved progress for one course, or null if none exists.
 * @param {number} userId
 * @param {number|string} courseId
 * @returns {{ completed: number[], lastLesson: number } | null}
 */
export function loadProgressFor(userId, courseId) {
    if (!userId || courseId == null) return null;
    const all = loadProgress();
    return all[userId]?.[courseId] || null;
}

export default usersInfo;