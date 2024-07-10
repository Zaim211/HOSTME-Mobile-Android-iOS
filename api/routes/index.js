const { Router } = require('express');
const multer = require('multer');
const AuthController = require('../controllers/AuthController');
const AppController = require('../controllers/AppController');
const PlaceController = require('../controllers/PlaceController');
const FilesController = require('../controllers/FilesController');
const HostingController = require('../controllers/HostingController');

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get('/api/app', AppController.app)

// Routes for Auth
router.post('/api/register', AuthController.register)
router.post('/api/login', AuthController.login)
router.get('/api/profile', AuthController.getProfile)
router.post('/api/logout', AuthController.logout)


// Routes for Places
router.post('/api/places', PlaceController.createPlaces)
router.get('/api/user-places', PlaceController.getUserPlaces)
router.get('/api/places', PlaceController.getAllPlaces)
router.get('/api/places/:id', PlaceController.getPlaceById)
router.put('/api/places', PlaceController.updatePlaces)
router.delete('/api/places/:id', PlaceController.deletePlace)
router.get('/api/latest-places', PlaceController.getLatestPlaces);

// Routes for Hostings
router.post('/api/hosting', HostingController.createHosting)
router.get('/api/hosting', HostingController.getHosting)
router.get('/api/hosted-places', HostingController.getHostedPlaces)
router.delete('/api/hostings/:id', HostingController.deleteHosting)

// Route for uploading images
router.post('/api/upload', upload.array('photos', 100), FilesController.uploadImages);


module.exports = router