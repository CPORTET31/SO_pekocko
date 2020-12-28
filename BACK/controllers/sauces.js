const Sauce = require('../models/Sauce')
const fs = require('fs')

/** Controllers - CRUD and Specific functions Sauces **/

//Get one sauce function
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
      error
    }));
};

//Get all the sauces function
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({
      error
    }));
}

//Create new sauce function
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({
      message: 'Sauce enregistré.'
    }))
    .catch(error => res.status(400).json({
      error
    }));
}

//Modify one sauce function
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  Sauce.updateOne({
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    })
    .then(() => res.status(200).json({
      message: 'Sauce modifié.'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};

//Delete one sauce function
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({
            _id: req.params.id
          })
          .then(() => res.status(200).json({
            message: 'Sauce supprimé.'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      });
    })
    .catch(error => res.status(500).json({
      error
    }));
};

//Like / Dislike one sauce function
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    case 0:
      Sauce.findOne({
          _id: req.params.id
        })
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({
                _id: req.params.id
              }, {
                $inc: {
                  likes: -1
                },
                $pull: {
                  usersLiked: req.body.userId
                },
                _id: req.params.id
              })
              .then(() => {
                res.status(201).json({
                  message: 'Ton avis a été pris en compte.'
                });
              })
              .catch((error) => {
                res.status(400).json({
                  error: error
                });
              });
          }
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({
                _id: req.params.id
              }, {
                $inc: {
                  dislikes: -1
                },
                $pull: {
                  usersDisliked: req.body.userId
                },
                _id: req.params.id
              })
              .then(() => {
                res.status(201).json({
                  message: 'Ton avis a été pris en compte.'
                });
              })
              .catch((error) => {
                res.status(400).json({
                  error: error
                });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({
            error: error
          });
        });
      break;
    case 1:
      Sauce.updateOne({
          _id: req.params.id
        }, {
          $inc: {
            likes: 1
          },
          $push: {
            usersLiked: req.body.userId
          },
          _id: req.params.id
        })
        .then(() => {
          res.status(201).json({
            message: 'Ton like a été pris en compte.'
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error
          });
        });
      break;

    case -1:
      Sauce.updateOne({
          _id: req.params.id
        }, {
          $inc: {
            dislikes: 1
          },
          $push: {
            usersDisliked: req.body.userId
          },
          _id: req.params.id
        })
        .then(() => {
          res.status(201).json({
            message: 'Ton dislike a été pris en compte.'
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error
          });
        });
      break;
    default:
      console.error('Erreur dans la requête.');
  }
}