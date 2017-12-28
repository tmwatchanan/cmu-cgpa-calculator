var pageTitle = "ผลการเรียนนักศึกษา มหาวิทยาลัยเชียงใหม่";

function ConvertGradeToNumber(gradeChar) {
    switch (gradeChar) {
        case 'A':
            return 4.0;
            break;
        case 'B+':
            return 3.5;
            break;
        case 'B':
            return 3.0;
            break;
        case 'C+':
            return 2.5;
            break;
        case 'C':
            return 2.0;
            break;
        case 'D+':
            return 1.5;
            break;
        case 'D':
            return 1.0;
            break;
        case 'F':
            return 0.0;
            break;
        default:
            return -1;
            break;
    }
}

// Check page title
if (document.title.indexOf(pageTitle) != -1) {
    console.log("RegCMU CGPA CAlculator has been activated!");

    // $("tbody").prepend("<tr><td>...contents...</td></tr>");
    // $('.msan').html('Whatever <b>HTML</b> you want here.');

    var numTableFound = $('html body center > table').length;
    // console.log("numFound = " + numFound + "\n");
    var numGradeTable = numTableFound - 1;
    // for (let term_year = 0; term_year <= numGradeTable; term_year+=2) {
    //     $('html body center > table').eq(term_year).html("TERM: " + term_year);
    // }

    // $('html body center > table').html("First Table [1/1]");
    var overallGPA = 0.0;
    var overallCredits = 0.0;
    for (let term_year = 1; term_year < numTableFound; term_year+=2) {
        var credits = $('html body center > table').eq(term_year).find('tbody tr.msan').not(':first').find('td:nth-child(4)').map(function() {
            return $(this).text();
        }).get();
        var grades = $('html body center > table').eq(term_year).find('tbody tr.msan').not(':first').find('td:nth-child(5)').map(function() {
            return $(this).text();
        }).get();
        // console.log(grades);
        var sumCreditsOfThisTerm = 0.0;
        var gpaOfThisTerm = 0.0;
        for (let index = 0; index < grades.length; index++) {
            const credit = credits[index];
            const grade = ConvertGradeToNumber(grades[index]);
            if (grade != -1) {
                sumCreditsOfThisTerm += Number.parseInt(credit);
                gpaOfThisTerm += (credit * grade);
            }
            // console.log(credit + " x " + grade);
        }
        overallCredits += sumCreditsOfThisTerm;
        gpaOfThisTerm /= sumCreditsOfThisTerm;
        gpaOfThisTerm = gpaOfThisTerm.toFixed(2);
        console.log("GPA of this term [" + term_year + "] = " + gpaOfThisTerm);
        console.log("sumCredits = " + sumCreditsOfThisTerm);
    }
    console.log("overallCredits = " + overallCredits);
    // grades.forEach(element => {
    //     console.log("grade: " + element + "\n");
    // });
    // $('html body center table').eq(1).find('tbody tr.msan').find('td:last-child').html('<b>RegCMU</b>');
    
    // var studentIdList = [];
    // // $('html body center div table tbody tr').each(function() { studentIdList.push($(this).text()) });
    // var tableObject = $("html body center div table tbody tr.msan")
    // .clone()
    // .find('td:first').remove().end()
    // .find('td:last').remove().end()
    // .children()
    // .clone()
    // .children()
    // .remove()	//remove all the children
    // .end()	//again go back to selected element
    // tableObject.each(function() { studentIdList.push($(this).text()) });
    // filtered = studentIdList.filter(function(el, index) {
    //     return index % 2 === 0;
    // });

    // $( "tr.msan td:nth-child(4)" ).append( "<img src=\"" + studentPictureList[0] + "\">" );
    // $( "tr.msan td:nth-child(4)" ).append( "<span>pic here!</span>" );
}