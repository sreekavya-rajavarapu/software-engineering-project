var db = require('../../../_sequelize/config/db.js');
const _ = require('underscore');

export function get(req, res, next) {
  // get all projects from database
  let response = []

  db.Project.findAll().then((projects) => {
      _.each(projects, (project) => {
        let temp = {}
        temp['id'] = project.id;
        temp['title'] = project.title;
        temp['description'] = project.description;
        temp['composition'] = project.composition;
        response.push(temp)
      });
      res.json(response)
    });
}
