var db = require('../../../_sequelize/config/db.js');

export function del(req, res, next) {
  // get a project_id and delete it and all its enrollment from database
  console.log(new Date() + " Delete user " + req.headers.csuid);
  let csuid = req.headers.csuid;
  db.User.sync().then(() => {
    db.User.destroy({where: {csuid: csuid}}).then((deletedUser) => {
      res.json(deletedUser);
    })
  }).catch((err) => {
    console.log(err);
  })
}
