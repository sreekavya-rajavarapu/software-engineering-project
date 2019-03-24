
const db = require('../../_sequelize/config/db');

export function post(req,res,next) {
  // read the json body and create user
  let csuid = req.body.csuid;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let password = req.body.password;
  let major_1 = req.body.major_1;
  let major_2 = req.body.major_2;
  db.User.sync().then(() => {
    db.User.findOne({ where: {csuid: csuid}}).then(user => {
      if (user == null) {
        db.User.create({
          csuid: csuid,
          fname: fname,
          lname: lname,
          password: password,
          major_1: major_1,
          major_2: major_2
        }).then(() => {
          console.log("Student inserted");
          res.json({'status': 'done'}).end();
        }).catch((err) => {
          res.json({'status': err}).end();
        });
      } else {
        res.json({'status': 'student exists'}).end();
        console.log(new Date() + " Student already exists");
      }
    });
  });

}
