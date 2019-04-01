var db = require('../../../_sequelize/config/db.js');
const _ = require('underscore');

export function get(req, res, next) {
  let response = []

  let user_id = req.headers.user_id;

  if (user_id == undefined) {
    user_id = "%";
  }

  db.Enrollment.findAll({where: {user_id: {[db.Sequelize.Op.like] : user_id}}}).then((enrollments) => {
      _.each(enrollments, (enrollment) => {
        let temp = {}
        temp['enrollment_id'] = enrollment.id;
        temp['enrollment_date'] = enrollment.date_of_enrollment;
        temp['user_id'] = enrollment.user_id;
        temp['project_id'] = enrollment.project_id;
        response.push(temp)
      });
      res.json(response)
  });
}
