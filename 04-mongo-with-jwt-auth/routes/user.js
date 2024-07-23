const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const { User, Course } = require("../db");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password;

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

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.find({
        username,
        password
    })

    if(user) {
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.json({
            token
        })
    }
    else{
        res.status(411).json({
            message: "Incorrect email or password"
        })
    }
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
    const username = req.username;

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
    const username = req.username;

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