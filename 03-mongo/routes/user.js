const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
// const { default: mongoose } = require("mongoose");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username: username,
        password: password
    })
    // .then(function() {
    //     res.json({
    //         message: 'User created successfully'
    //     })
    // })
    .catch(function() {
        res.json({
            message: 'User not created'
        })
    })
    res.json({
        message: 'User created successfully'
    })
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const allCourses = await Course.find({});
    
    res.json({
        courses: allCourses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;

    await User.updateOne({ 
        username: username 
    }, {
        "$push": {
            // purchasedCourses: new mongoose.Types.ObjectId(courseId)
            purchasedCourses: courseId
        }
    })
    .catch(function(e) {
        console.log(e);
    })

    res.json({
        message: 'Course purchased successfully'
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const username = req.headers.username;

    const currUser = await User.findOne({
        username: username
    })
    const allPurchasedCoursesIdArr = currUser.purchasedCourses;

    const usersCourses = await Course.find({
        _id: {
            "$in": allPurchasedCoursesIdArr
        }
    })

    res.json({
        purchasedCourses: usersCourses
    })
});

module.exports = router