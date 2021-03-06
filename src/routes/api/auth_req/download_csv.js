var http = require('http');
var fs = require('fs-extra');
const { sep } = require('path');
const json2csv = require('json2csv').parse;

export function post(req,res,next) {
  // these are the field names which needs to be exported on click


  let jsonTableData = req.body;
  let exportDir = `${process.cwd()}${sep}exports${sep}datatables-export`;

  const fields  = jsonTableData.shift();
  const opts = { fields };
  if (!fs.existsSync(exportDir)){
    console.log("Created Export Directory")
    fs.ensureDirSync(exportDir);
  }

  try {
  const csvData = json2csv(jsonTableData);

  fs.writeFile(`${exportDir}${sep}tempDatatablesExport.csv`, csvData, {spaces:4, EOL:'\n'}, function (err) {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.' + err);
    } else{
      console.log('It\'s saved!');
      res.download(`${exportDir}${sep}tempDatatablesExport.csv`); // Set disposition and send it.
    }
  });
  } catch (err) {
    console.error(err);
  }
}

export function get(req,res,next) {

  res.set('Content-Type', 'text/csv');
  res.download(`${process.cwd()}${sep}exports${sep}datatables-export${sep}tempDatatablesExport.csv`); // Set disposition and send it.
}
