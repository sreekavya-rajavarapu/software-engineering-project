var db = require('../../../_sequelize/config/db.js');
const _ = require('underscore');

export function get(req, res, next) {
  // get all projects from database
  let response = []
  db.User.sync().then(() => {
    db.User.findAll().then((users) => {
        _.each(users, (user) => {
          let temp = {}
          temp['csuid'] = user.csuid;
          temp['fname'] = user.fname;
          temp['lname'] = user.lname;
          temp['major_1'] = user.major_1;
          temp['major_2'] = user.major_2;
          response.push(temp)
        });
        res.json(response)
      });
  })
}
