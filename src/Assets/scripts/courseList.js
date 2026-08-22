import python from '../scripts/courseImages/phython.png'
import blender from '../scripts/courseImages/blender.png'
import js from '../scripts/courseImages/js.png'
import nodeJs from '../scripts/courseImages/node.png'

let coursesInfo = [
    {
        name: "Blender 3D Modeling Masterclass",
        author: "Sarah Johnson",
        description: "Learn professional 3D modeling techniques in Blender from scratch. Master sculpting, texturing, and rendering.",
        imgPath: blender,
        rating: 4.8,
        userNo: 12450,
        banner: {
            type: "3D Design",
            courseClass: "Advanced",
            hours: 42
        },
        price: 199
    },
    {
        name: "Python Data Science & Machine Learning",
        author: "Dr. Michael Chen",
        description: "Complete guide to data science using Python. Covers NumPy, Pandas, Matplotlib, and scikit-learn with real-world projects.",
        imgPath: python,
        rating: 4.9,
        userNo: 18320,
        banner: {
            type: "Programming",
            courseClass: "Intermediate",
            hours: 38
        },
        price: 249
    },
    {
        name: "Node.js API Development Bootcamp",
        author: "Alex Rivera",
        description: "Build robust RESTful APIs and GraphQL services using Node.js, Express, and MongoDB. Includes authentication and deployment.",
        imgPath: nodeJs,
        rating: 4.7,
        userNo: 9820,
        banner: {
            type: "Backend",
            courseClass: "Intermediate",
            hours: 35
        },
        price: 179
    },
    {
        name: "Blender Animation & Rigging",
        author: "Emma Watson",
        description: "Master character animation and rigging in Blender. Learn keyframe animation, IK/FK systems, and motion capture integration.",
        imgPath: blender,
        rating: 4.6,
        userNo: 7650,
        banner: {
            type: "Animation",
            courseClass: "Advanced",
            hours: 48
        },
        price: 229
    },
    {
        name: "Python Web Development with Django",
        author: "James Thompson",
        description: "Build full-stack web applications using Python and Django framework. Covers ORM, templates, authentication, and deployment.",
        imgPath: python,
        rating: 4.8,
        userNo: 11200,
        banner: {
            type: "Web Dev",
            courseClass: "Beginner",
            hours: 32
        },
        price: 159
    },
    {
        name: "Node.js Microservices Architecture",
        author: "Priya Sharma",
        description: "Design and implement microservices with Node.js. Learn Docker, Kubernetes, message queues, and distributed systems patterns.",
        imgPath: nodeJs,
        rating: 4.5,
        userNo: 5430,
        banner: {
            type: "Backend",
            courseClass: "Advanced",
            hours: 40
        },
        price: 269
    },
    {
        name: "Blender Interior Design Visualization",
        author: "Mark Davis",
        description: "Create photorealistic interior designs using Blender. Learn lighting, materials, and composition for architectural visualization.",
        imgPath: blender,
        rating: 4.4,
        userNo: 6540,
        banner: {
            type: "Design",
            courseClass: "Intermediate",
            hours: 36
        },
        price: 189
    },
    {
        name: "Python Automation & Scripting",
        author: "Lisa Park",
        description: "Automate repetitive tasks with Python scripts. Covers file handling, web scraping, API integration, and GUI automation.",
        imgPath: python,
        rating: 4.7,
        userNo: 14300,
        banner: {
            type: "Programming",
            courseClass: "Beginner",
            hours: 28
        },
        price: 149
    },
    {
        name: "Node.js Real-Time Apps with Socket.io",
        author: "David Kim",
        description: "Build real-time applications like chat, gaming, and collaboration tools using Node.js and Socket.io with WebSocket protocols.",
        imgPath: nodeJs,
        rating: 4.6,
        userNo: 8210,
        banner: {
            type: "Full Stack",
            courseClass: "Intermediate",
            hours: 30
        },
        price: 199
    },
    {
        name: "Blender Game Development with UPBGE",
        author: "Rachel Green",
        description: "Create 3D games using Blender's game engine (UPBGE). Learn game logic, physics, character controllers, and asset pipeline.",
        imgPath: blender,
        rating: 4.3,
        userNo: 4980,
        banner: {
            type: "Game Dev",
            courseClass: "Advanced",
            hours: 52
        },
        price: 279
    }
];

export default coursesInfo;