// This file is the ONLY module that knows where course data comes from.
// Everything else imports `coursesInfo` from here.
//
// IMPORTANT: the JSON is the database. Do not add a parallel array here.

import python from "../scripts/courseImages/phython.png";
import blender from "../scripts/courseImages/blender.png";
import js from "../scripts/courseImages/js.png";
import nodeJs from "../scripts/courseImages/node.png";
import rawCourses from "./courseList.json";

// imagePath string in JSON -> actual imported module
const IMAGE_MAP = {
  python,
  blender,
  js,
  node: nodeJs,
};

// Hydrate each raw course record: resolve `imgPath` to its imported asset
// and add any derived defaults without inventing content.
const hydrate = (course) => ({
  ...course,
  imgPath: IMAGE_MAP[course.imgPath] ?? course.imgPath,
});

const coursesInfo = rawCourses.map(hydrate);

export default coursesInfo;