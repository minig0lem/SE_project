const express = require('express');
const router = express.Router();
const multer = require('multer');
const loginController = require('../controllers/loginController');
const myPageController = require('../controllers/myPageController');
const subjectController = require('../controllers/subjectController');
const studyingController = require('../controllers/studyingController');

const upload = multer();

router.get('/', loginController.getProfessorPage);

router.get('/studying/grade/:subject_id', studyingController.getStudentList);
router.post('/studying/grade', studyingController.inputGrade);

router.post('/subject/notice/write', upload.single('upload'), (req, res) => {subjectController.writeNotice(req, res)});

router.post('/subject/syllabus/:subject_id/write', subjectController.writeSyllabus);
router.post('/subject/syllabus/:syllabus_id/update', subjectController.updateSyllabus);

router.get('/mypage/information', myPageController.getUserInfo);
router.post('/mypage/information/update', myPageController.updateUser);

module.exports = router;