const express = require("express");

const controleursEtudiant = require("../controllers/etudiants-controlleurs")
const router = express.Router();

router.get("/:etudiantId", controleursEtudiant.getEtudiantById);

router.post('/', controleursEtudiant.creerEtudiant);

router.patch('/:etudiantId', controleursEtudiant.updateEtudiant);

router.delete('/:etudiantId', controleursEtudiant.supprimerEtudiant);

module.exports = router;