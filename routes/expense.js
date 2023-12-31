const express = require('express');

const expenseController = require('../controllers/expense');
const authenticateUser = require('../middlewares/auth')

const router = express.Router();

router.post('/addexpense', authenticateUser.authenticate, expenseController.addExpense);

router.get('/getexpenses', authenticateUser.authenticate, expenseController.getExpenses);

router.delete('/deleteexpense/:expenseid', authenticateUser.authenticate, expenseController.deleteExpense);

module.exports = router;