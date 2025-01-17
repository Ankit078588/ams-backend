const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./config/db_connection');
const PORT = process.env.PORT || 3000;
const path = require('path');
const cors = require('cors');


const Teacher = require('./models/teachers');
const Attendance = require('./models/attendance');
// const { verifyTokenMiddleware } = require('../middlewares/jwt');

let activeSession = [];


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));    // Static Files



// routes
const authRoutes = require('./routes/authRoute');
const { log } = require('console');
app.use('/api/auth', authRoutes);


// 1. Teacher Dashboard
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/teacher/dashboard', (req, res) => {
    res.render('teacher_dashboard');
});


// app.post('/teacher/start-attendance', verifyTokenMiddleware, async (req, res) => {
app.post('/teacher/start-attendance', async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log('Latitude recieved: ', latitude);
    console.log('Longitude recieved: ', longitude);
    
    // Reset teacher coordinates:
    activeSession = [];

    if (!latitude || !longitude) {
        return res.status(400).send('Latitude and longitude are required.');
    }

    // const attendanceSession = new Attendance({
    //     teacherId: req.user._id, // Assuming user is authenticated 
    //     teacherLocation: { latitude, longitude },
    //     startTime: new Date(),
    // });
    // await attendanceSession.save();

    activeSession.push(
        {
            teacherId: 200, 
            teacherLocation: { latitude: latitude, longitude: longitude },
            startTime: new Date(),
        }
    );

    // res.redirect('/teacher/dashboard');
    res.render('attendance_active', { latitude, longitude });
});




// 2. Student Dashboard
app.get('/student/dashboard', (req, res) => {
    res.render('student_dashboard');
});

// Student - mark attendance
// app.post('/student/mark-attendance', async (req, res) => {
//     const { latitude, longitude } = req.body;

//     const activeSession = await Attendance.findOne({
//         endTime: null,
//     });

//     if (!activeSession) {
//         return res.status(400).send('No active attendance session.');
//     }

//     const distance = calculateDistance(
//         activeSession.teacherLocation.latitude,
//         activeSession.teacherLocation.longitude,
//         latitude,
//         longitude
//     );

//     if (distance > 70) {
//         return res.status(400).send('You are too far from the teacher to mark attendance.');
//     }

//     activeSession.students.push({
//         studentId: req.user._id, // Assuming user is authenticated
//         time: new Date(),
//     });

//     await activeSession.save();
//     res.redirect('/student/dashboard');
// });
app.post('/student/mark-attendance', async (req, res) => {
    const { latitude, longitude } = req.body;
    console.log('User latitude: ', latitude);
    console.log('User longitude: ', longitude);
    

    if (activeSession.length==0) {
        return res.status(400).send('No active attendance session.');
    }


    // console.log(activeSession);
    // console.log(activeSession[0].teacherLocation.latitude);
    // console.log(activeSession[0].teacherLocation.longitude);
    

    const distance = calculateDistance(
        activeSession[0].teacherLocation.latitude,
        activeSession[0].teacherLocation.longitude,
        latitude,
        longitude
    );

    if (distance > 300) {
        return res.status(400).send(`You are not inside the Classroom. Distance: ${distance}`);
    }

    // activeSession.students.push({
    //     studentId: req.user._id, // Assuming user is authenticated
    //     time: new Date(),
    // });
    // await activeSession.save();
    // res.redirect('/student/dashboard');

    res.render('attendance_success', { distance });
});





// Utility function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Radius of Earth in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
}


app.listen(PORT);