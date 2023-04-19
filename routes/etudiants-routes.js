const express = require("express");

const controleursUtilisateurs = require("../controllers/profs-controlleurs")
const router = express.Router();

router.get('/', controleursUtilisateurs.getUtilisateurs);

router.post('/inscription', controleursUtilisateurs.inscription);

router.post('/connexion', controleursUtilisateurs.connexion);

module.exports = router;