const express = require("express");

const controleursProf = require("../controllers/profs-controlleurs")
const router = express.Router();

router.get("/:profId", controleursProf.getProfById);

router.post('/', controleursProf.creerProf);

router.patch('/:profId', controleursProf.updateProf);

router.delete('/:profId', controleursProf.supprimerProf);

module.exports = router;