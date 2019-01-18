const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/plantr', {logging:false});


const Gardener = db.define('gardeners', {
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
});

const Plot = db.define('plots', {
    size: Sequelize.INTEGER,
    shaded: Sequelize.BOOLEAN,
});

const Vegetable = db.define('veggies', {
    name: Sequelize.STRING,
    color: Sequelize.STRING,
    planted_on: Sequelize.DATE,
});

// Vegetable.belongsToMany(Plot, {through: 'vegetable_plot'})
// Plot.belongsToMany(Vegetable, {through: 'vegetable_plot'})
// const db = require('./database');
// const Sequelize = require('sequelize');

const Student = db.define('students', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    imageUrl: {
        type: Sequelize.STRING,
        defaultValue: 'someValue'
    },
    gpa: {
        type: Sequelize.DECIMAL,
        validate: {
            max: 4.0,
            min: 0.0
        }
    }
});

module.exports = {
    // db,
    Gardener,
    Plot,
    Vegetable,
    Student
};

// module.exports = {Student};



