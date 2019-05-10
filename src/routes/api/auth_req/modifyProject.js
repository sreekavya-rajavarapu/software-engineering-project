var db = require('../../../_sequelize/config/db.js');

export function post(req, res, next) {
  // get a project_id and delete it and all its enrollment from database
  console.log(new Date() + " Modify project " + req.body.project_id);
  let project_id = req.body.project_id;
  let title = req.body.title;
  let description = req.body.description;
  let composition = req.body.composition;

  db.Project.sync().then(() => {
    db.Project.findOne({where: {project_id: project_id}}).then((project) => {
      project.update({
        title: title,
        description: description,
        composition: composition
      }).then((updated) => {
        res.json(updated)
        return null;
      })
    })
  }).catch((err) => {
    console.log(err);
  })
}
