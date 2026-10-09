import usersData from './usersList.json'

const STORAGE_KEY = "purchasedCourses"; // shape: { [userId]: [courseId, ...] }

function loadSaved() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}

const saved = loadSaved();

// Base data comes from usersList.json; purchases made in the browser
// (stored in localStorage) are merged on top of it.
const usersInfo = usersData.map((user) => ({
    ...user,
    purchasedCourses: Array.from(
        new Set([...user.purchasedCourses, ...(saved[user.id] || [])])
    ),
}));

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

export default usersInfo;
