const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const UnCours = require("../models/unCours");
const Prof = require("../models/prof");
const Etudiant = require("../models/etudiant");

const COURS = [
  {
    titre: "test",
    discipline: "test",
    nbMaxEtudiants: "test",
    dateDebut: "test",
    dateFin: "test",
    etudiants: [],
    prof: null
  },
];

const getUnCoursById = async (requete, reponse, next) => {
  const unCoursId = requete.params.unCoursId;
  let unCours;
  try {
    unCours = await UnCours.findById(unCoursId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du cours", 500)
    );
  }
  if (!unCours) {
    return next(new HttpErreur("Aucun cours trouvé pour l'id fourni", 404));
  }
  reponse.json({ unCours: unCours.toObject({ getters: true }) });
};

const creerUnCours = async (requete, reponse, next) => {
  const { titre, discipline, nbMaxEtudiants, dateDebut, dateFin, etudiants, prof } = requete.body;
  const nouveauCours = new UnCours({
    titre,
    discipline,
    nbMaxEtudiants,
    dateDebut,
    dateFin,
    etudiants,
    prof,
  });

  let professeur;

  try {
    professeur = await Prof.findById(prof);
    
  } catch {
    
    return next(new HttpErreur("Création du cours échoué", 500));
  }

  if (!professeur) {
    return next(new HttpErreur("Professeur non trouvé selon le id"), 504);
  }

  try {

    await nouveauCours.save();
    //Ce n'est pas le push Javascript, c'est le push de mongoose qui récupe le id du cours et l'ajout au tableau du professeur
    professeur.listeCours.push(nouveauCours);
    // Ajouter le cours à la liste de cours des étudiants
    await Etudiant.updateMany({ _id: { $in: etudiants } }, { $addToSet: { listeCours: nouveauCours._id } });
    await professeur.save();
    //Une transaction ne crée pas automatiquement de collection dans mongodb, même si on a un modèle
    //Il faut la créer manuellement dans Atlas ou Compass
  } catch (err) {
    const erreur = new HttpErreur("Création du cours échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ unCours: nouveauCours });
};

const updateUnCours = async (requete, reponse, next) => {
  const { titre, discipline, nbMaxEtudiants } = requete.body;
  const unCoursId = requete.params.unCoursId;

  let unCours;

  try {
    unCours = await UnCours.findById(unCoursId);
    unCours.titre = titre;
    unCours.discipline = discipline;
    unCours.nbMaxEtudiants = nbMaxEtudiants;
    await unCours.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour du cours", 500)
    );
  }

  reponse.status(200).json({ unCours: unCours.toObject({ getters: true }) });
};

const supprimerUnCours = async (requete, reponse, next) => {
  const unCoursId = requete.params.unCoursId;
  let unCours;
  try {
    unCours = await UnCours.findById(unCoursId).populate("prof");

  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du cours", 500)
    );
  }
  if(!unCours){
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  try{
    
    await unCours.remove();
    await Etudiant.updateMany({ listeCours: unCoursId }, { $pull: { listeCours: unCoursId } });
    unCours.prof.listeCours.pull(unCours);
    await unCours.prof.save()

  }catch{
    return next(
      new HttpErreur("Erreur lors de la suppression du cours", 500)
    );
  }
  reponse.status(200).json({ message: "Cours supprimé" });
};

exports.getUnCoursById = getUnCoursById;
exports.creerUnCours = creerUnCours;
exports.updateUnCours = updateUnCours;
exports.supprimerUnCours = supprimerUnCours;
