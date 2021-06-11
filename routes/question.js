const router = require('express').Router();
const QuestionController = require('../controllers/QuestionController')

router.post('/create', QuestionController.create);
router.get('/all', QuestionController.getAll);
router.delete('/:id', QuestionController.delete);

module.exports = router;