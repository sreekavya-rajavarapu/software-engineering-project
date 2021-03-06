var db = require('../../../_sequelize/config/db.js');
const _ = require('underscore');

export function post(req, res, next) {
  let projectID = req.body.projectID;
  let userID = req.body.userID;
  const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York'
  });
  // check if user has already enrolled for 5 projects if so
  db.Enrollment.sync().then(() => {
    db.Enrollment.findAll({where: {user_id: {[db.Sequelize.Op.like] : userID}}}).then((enrollments) => {
      if (enrollments.length >= 5) {
        res.json("Already enrolled for 5 projects. Delete selection to continue")
        return
      } else {
        db.Enrollment.sync().then(() => {
          db.User.sync().then(() => {
            db.User.findOne({where: {csuid: userID}}).then((user) => {
              db.Project.findOne({where: {project_id: projectID}}).then((project) => {
                let insertRow = _.extend({date_of_enrollment: nDate},{user_id: user.csuid}, {project_id: project.project_id})
                console.log(insertRow);
                db.Enrollment.create(insertRow).then((enrollment) => {
                  res.json(enrollment.id);
                })
              })
            })
          })
        })
      }
    })
  })


}
