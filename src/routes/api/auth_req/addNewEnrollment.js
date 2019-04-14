var db = require('../../../_sequelize/config/db.js');
const _ = require('underscore');

export function post(req, res, next) {
  let projectID = req.body.projectID;
  let userID = req.body.userID;
  const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York'
  });
  console.log(nDate);
  db.Enrollment.sync().then(() => {
    db.User.findOne({where: {csuid: userID}}).then((user) => {

      db.Project.findOne({where: {id: projectID}}).then((project) => {
        let insertRow = _.extend({date_of_enrollment: nDate},{user_id: user.csuid}, {project_id: project.id})
        console.log(insertRow);
        db.Enrollment.create(insertRow).then((enrollment) => {
          res.json(enrollment.id);
        })
      })
    })
  })
}
