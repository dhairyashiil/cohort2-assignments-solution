const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db");

// Admin Routes
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username: username,
        password: password
    })
    // .then(function() {
    //     res.json({
    //         message: 'Admin created successfully'
    //     })
    // })
    .catch(function() {
        res.json({
            message: 'Admin not created'
        })
    })
    res.json({
        message: 'Admin created successfully'
    })
});

router.post('/courses', adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;

    const newCourse = await Course.create({
        title, description, price, imageLink
    })
    .catch(function() {
        res.json({
            message: 'Course not created'
        })
    })
    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const allCourses = await Course.find({});
    
    res.json({
        courses: allCourses
    })
});

module.exports = router;