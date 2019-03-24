var db = require('../../../_sequelize/config/db.js');

export function post(req, res, next) {
  // post body will contain the description & title
  console.log(req.user);
  let title = req.body.title;
  let description = req.body.description;
  // insert it into database
    db.Project.sync().then(() => {
      db.Project.create({
        title: title,
        description: description
      }).then((project) => {
        res.json(project.id);
      });
    });
}
