var db = require('../../../_sequelize/config/db.js');

export function del(req, res, next) {
  // get a project_id and delete it and all its enrollment from database
  console.log(new Date() + " Delete project " + req.headers.project_id);
  let project_id = req.headers.project_id;
  db.Project.sync().then(() => {
    db.Enrollment.destroy({ where: {project_id: project_id}})
    .then((deleted) => {

      db.Project.destroy({where: {project_id: project_id}}).then((deletedProject) => {
        res.json(deleted);
      })
    })
  }).catch((err) => {
    console.log(err);
  })
}
