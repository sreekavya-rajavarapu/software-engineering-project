var db = require('../../../_sequelize/config/db.js');

export function get(req,res,next) {
  db.User.findOne({ where: {csuid: req.user.id}}).then((user) => {
    let response = {}
    response['csuid'] = user.csuid;
    response['fname'] = user.fname;
    response['lname'] = user.lname;
    response['major_1'] = user.major_1;
    response['major_2'] = user.major_2;
    res.json(response).end();
  });
}
