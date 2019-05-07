const parse = require('csv-parse')
var db = require('../../../_sequelize/config/db.js');
const _ = require('underscore');

export function post(req, res, next) {
  let created_ids = []
  let create_rows = [];
  if(! req.files) {
    // files is not presnet
    res.status(400).json("Missing file data")
  }
  let inputFile = req.files.file;

  // Create the parser
  const parser = parse({
    delimiter: ',',
    columns: true
  })
  // Use the readable stream api
  parser.on('readable', function(){
    let record

    while (record = parser.read()) {
      console.log(record);
      let temp = {
        project_id: record['Project ID'],
        title: record['Project Title'],
        description: record['Project Description'],
        composition: record['Project Composition']
      }
      console.log(temp);
      create_rows.push(temp);
    }
  });

  // When we are done, test that the parsed output matched what expected
  parser.on('finish', function(){
    // output will be a array of arrays with first row as header
    db.Project.sync().then(() => {
      db.Project.bulkCreate(create_rows).then((rows) => {
        _.each(rows, (row) => {
          created_ids.push(row.id)
        });
        console.log(new Date() + " finished parsing csv");
        res.status(200).json(created_ids);
      })
    })
  });

  parser.write(inputFile.data);
  parser.end();
}
