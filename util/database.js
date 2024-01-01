const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-tracker", "root", "MySQL#1234", {
    dialect : "mysql",
    host : "localhost"
});

module.exports = sequelize;