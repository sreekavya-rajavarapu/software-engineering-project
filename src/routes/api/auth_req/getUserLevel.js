var db = require('../../../_sequelize/config/db.js');

export function get(req,res,next) {
  db.User.sync().then(() => {
    db.User.findOne({ where: {csuid: req.user.id}}).then((user) => {
      res.json({'type':req.user.type, 'csuid' : user.csuid, 'fname': user.fname, 'lname': user.lname,
      'major_1': user.major_1,'major_2': user.major_2}).end();
    })
  })
}
