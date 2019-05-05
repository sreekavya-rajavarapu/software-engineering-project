var db = require('../../../_sequelize/config/db.js');

export function post(req, res, next) {
  // post body will contain the description & title
  console.log(req.user);
  let project_id = req.body.project_id;
  let title = req.body.title;
  let description = req.body.description;
  let composition = req.body.composition;
  // insert it into database
    db.Project.sync().then(() => {
      db.Project.create({
        project_id: project_id,
        title: title,
        description: description,
        composition: composition
      }).then((project) => {
        res.json(project.project_id);
      });
    });
}
