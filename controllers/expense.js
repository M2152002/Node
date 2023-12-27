const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;

        if(amount == undefined || amount.length === 0) {
            return res.status(400).json({ success: false, expense: 'Parameters missing'})
        }

        const newExpense = await Expense.create({ amount, description, category });
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

        if(expenseId == undefined || expenseId.length === 0) {
            return res.status(400).json({ success: false})
        }
        const result = await Expense.destroy({ where: { id: expenseId } });

        if (result === 1) {
            res.status(200).json({ success: true, message: 'Expense deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Expense not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};
