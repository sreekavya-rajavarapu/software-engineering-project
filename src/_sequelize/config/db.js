const Sequelize = require('sequelize');
// the 3 nulls are IP user-name and password. Since this is sqlite those parameters are unset
const connection = new Sequelize('null', 'null', 'null', {
  dialect: 'sqlite',
  storage: 'APPDATA.sqlite',
  logging: false,
  define: {
    timestamps: false
  }});

const db = {}

db.Sequelize = Sequelize;
db.connection = connection;


db.Enrollment = require('../models/enrollment.js')(connection, Sequelize);
db.Project = require('../models/project.js')(connection, Sequelize);
db.User = require('../models/user.js')(connection, Sequelize);


// student <-->> enrollments
db.User.enrollment = db.User.hasMany(db.Enrollment);
db.Enrollment.user = db.Enrollment.belongsTo(db.User);

// project <-->> enrollments
db.Project.enrollment = db.Project.hasMany(db.Enrollment);
db.Enrollment.project = db.Enrollment.belongsTo(db.Project);


module.exports = db;