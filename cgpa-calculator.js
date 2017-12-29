var idxMyCourse = 2;
var overallCredits = 0;
var overallCreditsGradeS = 0;
var overallCreditsGradeP = 0;
var overallGPA = 0.0;
var overallGradePoints = 0.0;
var nextCredits = 0;
var nextCreditsGradeS = 0;
var nextCreditsGradeP = 0;
var nextGradePoints = 0.0
var nextGPA = 0.0;
var expectedCredits = 0;
var expectedGradePoints = 0.0;
var expectedCGPA = 0.0;

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

function createCourseNoInput() {
    var inputCourseNo = document.createElement("INPUT");
    inputCourseNo.type = "text";
    inputCourseNo.name = "CourseNo";
    inputCourseNo.value = "0";
    inputCourseNo.style.textAlign = "center";
    inputCourseNo.setAttribute('maxlength',6);
    inputCourseNo.setAttribute('size',6);
    return inputCourseNo;
}

function createCourseCreditInput(idx) {
    var inputCourseCredit = document.createElement("INPUT");
    inputCourseCredit.setAttribute('id', 'myCourseCredit-'+idxMyCourse);
    inputCourseCredit.type = "text";
    inputCourseCredit.name = "CourseCredit";
    inputCourseCredit.value = "0";
    inputCourseCredit.style.textAlign = "center";
    inputCourseCredit.setAttribute('maxlength',1);
    inputCourseCredit.setAttribute('size',1);
    return inputCourseCredit;
}

function createSelectLetterGradeDropDown(idx) {
    var array = ["-","A","B+","B","C+","C","D+","D","F","S"];
    var selectList = document.createElement("select");
    selectList.id = "myCourseLetterGrade-"+idxMyCourse;
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];
        selectList.appendChild(option);
    }
    return selectList;
}

function addNewCourseRow() {
    var table = document.getElementById("table-main");
    var row = table.insertRow(-1);
    row.setAttribute('id', 'myCourseTR-'+idxMyCourse);
    row.style.backgroundColor = "#FFE3E4";
    var td1 = row.insertCell(-1);
    td1.style.textAlign = "center";
    td1.innerHTML = idxMyCourse;
    var td2  = document.createElement('td');
    td2.setAttribute('align', 'center');
    row.appendChild(td2);
    var td3 = row.insertCell(-1);
    var td4 = row.insertCell(-1);
    var td5 = row.insertCell(-1);
    var inputCourseNo = createCourseNoInput();
    td2.appendChild(inputCourseNo);
    td3.innerHTML = "COURSE NAME";
    td4.appendChild(createCourseCreditInput());
    td4.setAttribute('align', 'center');
    // var btnRemove = document.createElement("INPUT");
    // btnRemove.type = "button";
    // btnRemove.value = "Remove";
    // btnRemove.setAttribute("onclick", "Remove(this);");
    // td1.appendChild(btnRemove);
    td5.appendChild(createSelectLetterGradeDropDown());
    td5.setAttribute('align', 'center');

    $("#myCourseCredit-"+idxMyCourse).on('change keydown paste input', function(){
        // console.log("-> " + $( this ).val() );
        CalculateExpectedGrades();
    });
    $("#myCourseLetterGrade-"+idxMyCourse).on('change keydown paste input', function(){
        // console.log("-> " + $( this ).val() );
        CalculateExpectedGrades();
    });    

    idxMyCourse++;
};

function Remove(button) {
    //Determine the reference of the Row using the Button.
    var row = button.parentNode.parentNode;
    var name = row.getElementsByTagName("td")[0].innerHTML;
    if (confirm("Do you want to delete: " + name)) {

        //Get the reference of the Table.
        var table = document.getElementById("table-main");

        //Delete the Table row using it's Index.
        table.deleteRow(row.rowIndex);
    }
};

function CalculateExpectedGrades() {
    // console.log(overallGradePoints);
    nextCredits = 0;
    nextGradePoints = 0.0;
    nextCreditsIncludeGradeS = 0;
    for (let index = 1; index <= idxMyCourse; index++) {
        const credit = Number.parseInt($("#myCourseCredit-"+index).val());
        const letterGrade = $("#myCourseLetterGrade-"+index).val();
        const grade = ConvertGradeToNumber(letterGrade);
        const gradePoint = credit * grade;
        if (grade != -1) {
            nextCredits += credit;
            nextGradePoints += gradePoint;
        } else if (letterGrade == 'S') {
            nextCreditsGradeS += credit;
        } else if (letterGrade == 'P') {
            nextCreditsGradeP += credit;
        }
        // console.log("nextCredits = " + nextCredits);
        // console.log("nextGradePoints = " + nextGradePoints);
    }
    nextGPA = nextGradePoints / nextCredits;
    nextGPA = nextGPA.toFixed(2);
    $('#nextEnrolledCredits').text(nextCredits);
    $('#nextGotCredits').text(nextCredits);
    $('#nextGPA').text(isNaN(nextGPA) ? 0.00.toFixed(2) : nextGPA);
    expectedCredits = overallCredits + nextCredits;
    expectedGradePoints = overallGradePoints + nextGradePoints;
    expectedCGPA = expectedGradePoints / expectedCredits;
    expectedCGPA = expectedCGPA.toFixed(2);
    $('#expectedEnrolledCredits').text(expectedCredits + nextCreditsGradeS + nextCreditsGradeP + overallCreditsGradeS + overallCreditsGradeP);
    $('#expectedGotCredits').text(expectedCredits + nextCreditsGradeS + overallCreditsGradeS);
    $('#expectedCGPA').text(expectedCGPA);
};

// Check ple
// ChePk ple
const pageTitle = "ผลการเรียนนักศึกษา มหาวิทยาลัยเชียงใหม่";
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

    for (let term_year = 1; term_year < numTableFound; term_year+=2) {
        var credits = $('html body center > table').eq(term_year).find('tbody tr.msan').not(':first').find('td:nth-child(4)').map(function() {
            return $(this).text();
        }).get();
        var letterGrades = $('html body center > table').eq(term_year).find('tbody tr.msan').not(':first').find('td:nth-child(5)').map(function() {
            return $(this).text();
        }).get();
        // console.log(letterGrades);
        var sumCredits = 0.0;
        var sumGradePoints = 0.0;
        for (let index = 0; index < letterGrades.length; index++) {
            const credit = Number.parseInt(credits[index]);
            const letterGrade = letterGrades[index];
            const grade = ConvertGradeToNumber(letterGrade);
            if (grade != -1) {
                sumCredits += credit;
                sumGradePoints += (credit * grade);
            } else if (letterGrade == 'S') {
                overallCreditsGradeS += credit;
            } else if (letterGrade == 'P') {
                overallCreditsGradeP += credit;
            }
            // console.log(credit + " x " + grade);
        }
        // console.log("sumGradeP " + sumGradePoints);
        // console.log("sumGradeP " + sumGradePoPnts);
        overallGradePoints += sumGradePoints; // for CGPA
        overallCredits += sumCredits; // for CGPA
        var gpa = sumGradePoints / sumCredits;
        gpa = gpa.toFixed(2);
        console.log("GPA of this term [" + term_year + "] = " + gpa + " = " + sumGradePoints + "/" + sumCredits);
    }
    console.log("overallGradePoints = " + overallGradePoints);
    console.log("overallCredits = " + overallCredits);

// SECTION: EXPECTED GRADES

    // $.get(chrome.extension.getURL('table-template.html'), function(data){
    //     $('html body center > hr').last().after(data);
    // });
    $('html body center > hr').last().after('<br> <table id="cgpa-calculator-table" border="0" align="center" cellpadding="0" cellspacing="0" width="597" bgcolor="#0068D0"> <tbody> <tr id="table-caption"> <td bgcolor="#FFFFFF" width="597" align="center" class="msan"> <table cellspacing="0" cellpadding="0" width="100%" align="center" border="0"> <tbody> <tr> <td width="14" height="20" align="left" valign="top" bgcolor="#FFFFFF"> <img id="wait-top-left" src="" width="14" height="29"> </td> <td id="wait-top-bg" width="723" height="20" align="center" background="" bgcolor="#FFFFFF" class="msan12">Expected Letter Grades in the Next Semester <!-- <b>1</b> ปีการศึกษา <b>2560</b> --> </td> <td width="14" height="20" align="right" valign="top"> <img id="wait-top-right" src="" width="14" height="29"> </td> </tr> </tbody> </table> </td> </tr> <tr> <td width="597" bgcolor="#FFFFFF"> <table id="table-main" border="0" cellspacing="1" cellpadding="2" width="100%" bgcolor="#A2BCD9"> <tbody> <tr bgcolor="#C6E2FF" class="msan" id="table-header"> <td width="29" height="26" align="center" bgcolor="#FFC6C7" class="taho7"> <b>NO</b> </td> <td width="84" align="center" bgcolor="#FFC6C7" class="taho7"> <b>COURSE NO</b> </td> <td width="314" align="center" bgcolor="#FFC6C7" class="taho7"> <b>TITLE</b> </td> <td width="66" align="center" bgcolor="#FFC6C7" class="taho7"> <b>CREDIT</b> </td> <td width="78" align="center" bgcolor="#FFC6C7" class="taho7"> <b>GRADE</b> </td> </tr> <tr id="myCourseTR-1" bgcolor="#FFE3E4" class="msan"> <td width="29" height="22" align="center">1</td> <td width="84" height="22" align="center"><input type="text" name="CourseId" value="" style="text-align: center" maxlength="6" size="6"></td> <td width="314" height="22" align="left">COURSE NAME</td> <td height="22" align="center"><input id="myCourseCredit-1" type="text" name="CourseCredit" value="0" style="text-align: center" maxlength="1" size="1"></td> <td width="78" height="22" align="center" class="msan"> <select id="myCourseLetterGrade-1" name="CourseLetterGrade"> <option value="-">-</option> <option value="A">A</option> <option value="B+">B+</option> <option value="B">B</option> <option value="C+">C+</option> <option value="C">C</option> <option value="D+">D+</option> <option value="D">D</option> <option value="F">F</option> <option value="S">S</option> </select> </td> </tr> </tbody> </table> <table cellspacing="0" cellpadding="0" width="100%" align="center" border="0"> <tbody> <tr> <td width="14" height="20" align="left" valign="top" bgcolor="#FFFFFF"> <img id="wait-bottom-left2" src="" width="14" height="21"> </td> <td id="wait-bottom-bg2" width="723" height="20" align="center" background="" bgcolor="#FFFFFF"></td> <td width="14" height="20" align="right" valign="top"> <img id="wait-bottom-right2" src="" width="14" height="21"> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <br> <INPUT id="AddNewCourse" type="button" value="Add" class="btn_medium" /> <br> <hr width="520" size="1">');
    const waitBottomLeft2ImgSrc = chrome.runtime.getURL("images/wait-bottom-left2.gif");
    $('#wait-bottom-left2').attr('src', waitBottomLeft2ImgSrc);
    const waitBottomBg2ImgSrc = chrome.runtime.getURL("images/wait-bottom-bg2.gif");
    $('#wait-bottom-bg2').attr('background', waitBottomBg2ImgSrc);
    const waitBottomRight2ImgSrc = chrome.runtime.getURL("images/wait-bottom-right2.gif");
    $('#wait-bottom-right2').attr('src', waitBottomRight2ImgSrc);
    const waitTopLeft2ImgSrc = chrome.runtime.getURL("images/wait-top-left.gif");
    $('#wait-top-left').attr('src', waitTopLeft2ImgSrc);
    const waitTopBg2ImgSrc = chrome.runtime.getURL("images/wait-top-bg.gif");
    $('#wait-top-bg').attr('background', waitTopBg2ImgSrc);
    const waitTopRight2ImgSrc = chrome.runtime.getURL("images/wait-top-right.gif");
    $('#wait-top-right').attr('src', waitTopRight2ImgSrc);

    $('#AddNewCourse').click(addNewCourseRow);

    $("#myCourseCredit-1").on('change keydown paste input', function(){
        // console.log( $( this ).val() );
        CalculateExpectedGrades();
    });

    $("#myCourseLetterGrade-1").on('change keydown paste input', function(){
        // console.log( $( this ).val() );
        CalculateExpectedGrades();
    });

    $('#AddNewCourse').after('<br> <br> <table width="431" height="38" border="0" cellpadding="4" cellspacing="1" bgcolor="#A2BCD9"> <tbody> <tr> <td width="82" height="10" valign="middle" align="center" bgcolor="#FFC6C7">ผลการศึกษา</td> <td width="75" height="10" valign="middle" align="center" bgcolor="#FFC6C7">หน่วยกิตที่ลง</td> <td width="75" height="10" valign="middle" align="center" bgcolor="#FFC6C7">หน่วยกิตที่ได้</td> <td width="78" height="10" valign="middle" align="center" bgcolor="#FFC6C7">เกรดเฉลี่ย</td> </tr> <tr> <td height="13" valign="middle" align="right" bgcolor="#FFC6C7">ภาคการศึกษา<b>หน้า</b></td> <td id="nextEnrolledCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="nextGotCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="nextGPA" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0.00&nbsp;</td> </tr> <tr> <td height="13" valign="middle" align="right" bgcolor="#FFC6C7"><b>คาดหมาย</b>สะสมทั้งหมด</td> <td id="expectedEnrolledCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="expectedGotCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="expectedCGPA" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0.00&nbsp;</td> </tr> </tbody> </table> <br>');
    CalculateExpectedGrades();

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