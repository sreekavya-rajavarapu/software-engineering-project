var db = require('../../../_sequelize/config/db.js');


export function del(req, res, next) {
  let project_id = req.headers.project_id;
  let user_id = req.headers.user_id;
  db.Enrollment.sync().then(() => {
    db.Enrollment.destroy({ where: {project_id: project_id, user_id: user_id}})
    .then((deleted) => {
      res.json(deleted);
    })
  })
}
