const Expense = require('../models/expense');
const User = require('../models/user');

exports.addExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;

        if (!amount || !description || !category) {
            return res.status(400).json({ success: false, expense: 'Parameters missing'})
        }
        const userId = req.user.id;
        const newExpense = await Expense.create({ amount, description, category, userId});
        res.status(201).json({ success: true, expense: newExpense });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getExpenses  = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json({ success: true, expenses });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({success: false, error: err.message})
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.expenseId;
        const userID = req.user.id; 
        if (expenseId == undefined || expenseId.length === 0) {
            return res.status(400).json({ success: false });
        }

        const expense = await Expense.findByPk(expenseId);
        if (!expense || expense.userId !== userID) {
            return res.status(401).json({ success: false, message: 'Unauthorized to delete this expense' });
        }

        await Expense.destroy({ where: { id: expenseId } });
    }
     catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};