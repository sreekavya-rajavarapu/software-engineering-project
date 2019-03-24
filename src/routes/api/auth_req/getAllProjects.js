var db = require('../../../_sequelize/config/db.js');
const _ = require('underscore');

export function get(req, res, next) {
  // get all projects from database
  let response = []
  db.Project.findAll().then((projects) => {
    console.log(projects);
    _.each(projects, (project) => {
      let temp = {}
      temp['title'] = project.title;
      temp['description'] = project.description;
      response.push(temp)
    });
    res.json(response)
  });

}
