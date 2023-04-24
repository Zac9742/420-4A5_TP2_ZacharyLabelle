const express = require("express");

const controleursCours = require("../controllers/cours-controleurs")
const router = express.Router();


router.get("/:unCoursId", controleursCours.getUnCoursById);

router.post('/', controleursCours.creerUnCours);

router.patch('/:unCoursId', controleursCours.updateUnCours);

router.delete('/:unCoursId', controleursCours.supprimerUnCours);

module.exports = router;
