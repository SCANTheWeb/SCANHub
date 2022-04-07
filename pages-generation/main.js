var fs = require('fs');
var path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

var dir = "tests";
var filesData = [];

let results = {};

// Loop through all the files in the directory
fs.readdir(dir, function(err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  // Store file data into an array
  files.forEach(function(file, index) {
    let fileWithoutExt = file.split(".")[0];
    let data = fileWithoutExt.replace(/\(/g).replace(/\)/g).split("_"); // remove parenthesis and split
	if(data.length == 5 || data.length == 6) {
		filesData.push({
		  "filename": file,
		  "studentyear": data[0],
		  "subject": data[1],
		  "year": data[2],
		  "typeAndNumber": data[3],
		  "tsc": data[4],
		  "comments": data[5],
		});
	} else if(file != ".gitkeep") {
		console.log("A file seams to be badly named : " + file);
	}
  });

  // Order data and sort in results
  for (let i = 0; i < filesData.length; i++) {
    // generate the <a> tag corresponding to each file
    let file = filesData[i];
    let link = "https://scan.insa-lyon.org/sites/scan.insa-lyon.org/files/" + file.filename.toLowerCase();
    let title = "";
    switch (file.tsc) {
      case "s":
        title += "student-correction";
        break;
      case "c":
        title += "correction";
        break;
      case "sc":
        title += "test+correction";
        break;
	  case "tc":
        title += "test+correction";
        break;
      case "t":
        title += "test";
        break;
      case "tsc":
        title += "quizz";
        break;
      default:
        title += file.tsc;
        break;
    }
    if (typeof file.comments != 'undefined')
      title += "("+file.comments+")";
    let aTag = "<a href='" + link + "' target='_blank'>" + title + "</a>";

    // implement the tag at its right spot. Create the spot if it does not exist
    let placed = false;
    while (!placed) {
      if (typeof results[file.studentyear] != 'undefined') {
        if (typeof results[file.studentyear][file.subject] != 'undefined') {
          if (typeof results[file.studentyear][file.subject][file.typeAndNumber] != 'undefined') {
            if (typeof results[file.studentyear][file.subject][file.typeAndNumber][file.year] != 'undefined') {
              results[file.studentyear][file.subject][file.typeAndNumber][file.year] = " | " + aTag + results[file.studentyear][file.subject][file.typeAndNumber][file.year];
              placed = true;
            } else
              results[file.studentyear][file.subject][file.typeAndNumber][file.year] = ""; // create the correct year empty object
          } else
            results[file.studentyear][file.subject][file.typeAndNumber] = {}; // create the correct ie or ds empty object
        } else
          results[file.studentyear][file.subject] = {}; // create the correct subject empty object
      } else
        results[file.studentyear] = {}; // create the correct studentyear empty object
    }
  }

	// create folder
	let paf = path.join(__dirname, '/./pages/');

	  fs.mkdir(paf, { recursive: true}, function (err) {
		if (err) return cb(err);
	  });

  for (studentyear in results) {
    for (subject in results[studentyear]) {
      results[studentyear][subject] = sortme(results[studentyear][subject]);
      let textFile = ""; // resulting textfile containing every test for each subject
      for (typeAndNumber in results[studentyear][subject]) {
        textFile += "<h3>" + typeAndNumber.toUpperCase() + "</h3>" // add the title
        for (year in results[studentyear][subject][typeAndNumber]) {
          textFile += "20" + year + results[studentyear][subject][typeAndNumber][year] + "<br>"; // add links
        }
      }
      // write to file

      fs.writeFile(paf + studentyear + "_" + subject + ".html", textFile, (err) => {
		if (err) return console.log(err);
	  });
    }
  }
});

function sortme(r) {
  const defaultAlphabet = ["IE1", "IE2", "IE3", "IE4", "IE5", "IE6", "IE7", "IE8", "DS1", "DS2", "DS3", "DS4", "DS5", "DS6", "LAB#", "LAB1", "LAB2", "LAB3", "LAB4", "LAB5", "LAB6", "LAB7", "LAB8", "LAB9", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15", "Q16", "Q17", "Q18", "Q19", "Q20", "Q21", "Q22", "Q23", "Q24", "Q25", "Q26", "Q27", "Q28", "Q29"];

  let sortable = [];
  for (let name in r)
    sortable.push([name.toUpperCase(), r[name]]);

  sortable.sort((a, b) => defaultAlphabet.indexOf(a[0]) - defaultAlphabet.indexOf(b[0]));

  let result = {};
  for (let i = 0; i < sortable.length; i++) {
    result[sortable[i][0]] = sortable[i][1];
  }

  return result;
}
