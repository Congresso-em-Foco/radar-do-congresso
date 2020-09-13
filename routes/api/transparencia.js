const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const models = require("../../models/index");
const casaValidator = require("../../utils/middlewares/casa.validator");

const Transparencia = models.transparencia;

const BAD_REQUEST = 400;
const SUCCESS = 200;

/**
 * Lista transparencia
 * @name get/api/transparencia/
 * @apiparam casa Casa de origem do parlamentar. Pode ser "camara" (default) ou "senado".
 * @function
 * @memberof module:routes/transparencia
 */
router.get("/", casaValidator.validate, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const casa = req.param("casa") || "camara";

  Transparencia.findAll({
    attributes: ["id_parlamentar_voz", "casa", "estrelas"],
    order: [
      ["estrelas", "DESC"]
    ],
    where: {
      casa: casa
    }
  })
    .then(transparencia => {
      return res.status(SUCCESS).json(transparencia);
    })
    .catch(err => res.status(BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;
