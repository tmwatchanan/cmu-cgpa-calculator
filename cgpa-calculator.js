const urlAPI = 'https://reg-cmu-api.herokuapp.com';

new Noty({
    type: 'information',
    theme: 'mint',
    timeout: '5000',
    animation: {
        open: function (promise) {
            var n = this;
            var Timeline = new mojs.Timeline();
            var body = new mojs.Html({
                el: n.barDom,
                x: { 500: 0, delay: 0, duration: 1000, easing: 'elastic.out' },
                isForce3d: true,
                onComplete: function () {
                    promise(function (resolve) {
                        resolve();
                    })
                }
            });

            var parent = new mojs.Shape({
                parent: n.barDom,
                width: 200,
                height: n.barDom.getBoundingClientRect().height,
                radius: 0,
                x: { [150]: -150 },
                duration: 1.2 * 1000,
                isShowStart: true
            });

            n.barDom.style['overflow'] = 'visible';
            parent.el.style['overflow'] = 'hidden';

            var burst = new mojs.Burst({
                parent: parent.el,
                count: 10,
                top: n.barDom.getBoundingClientRect().height + 75,
                degree: 90,
                radius: 75,
                angle: { [-90]: 40 },
                children: {
                    fill: '#EBD761',
                    delay: 'stagger(500, -50)',
                    radius: 'rand(8, 25)',
                    direction: -1,
                    isSwirl: true
                }
            });

            var fadeBurst = new mojs.Burst({
                parent: parent.el,
                count: 2,
                degree: 0,
                angle: 75,
                radius: { 0: 100 },
                top: '90%',
                children: {
                    fill: '#EBD761',
                    pathScale: [.65, 1],
                    radius: 'rand(12, 15)',
                    direction: [-1, 1],
                    delay: .8 * 1000,
                    isSwirl: true
                }
            });

            Timeline.add(body, burst, fadeBurst, parent);
            Timeline.play();
        },
        close: function (promise) {
            var n = this;
            new mojs.Html({
                el: n.barDom,
                x: { 0: 500, delay: 10, duration: 500, easing: 'cubic.out' },
                skewY: { 0: 10, delay: 10, duration: 500, easing: 'cubic.out' },
                isForce3d: true,
                onComplete: function () {
                    promise(function (resolve) {
                        resolve();
                    })
                }
            }).play();
        }
    },
    text: 'Thanks for using "CMU CGPA Calculator"'
}).show();

var studentId;
var studentNextEnrolledCourseList;
var studentNextSemester;
var studentNextYear;

var idxMyCourse = 2;
var overallCredits = 0;
var overallCreditsGradeS = 0;
var overallCreditsGradeP = 0;
var overallCreditsGradeF = 0;
var overallGPA = 0.0;
var overallGradePoints = 0.0;
var nextCredits = 0;
var nextCreditsGradeS = 0;
var nextCreditsGradeP = 0;
var nextCreditsGradeF = 0;
var nextGradePoints = 0.0
var nextGPA = 0.0;
var expectedCredits = 0;
var expectedGradePoints = 0.0;
var expectedCGPA = 0.0;

var regCmuEnrolledCredits = 0.0;
var regCmuGotCredits = 0.0;

var foundF = false;
var foundU = false;
var firstYear = -1;
var summerAtYearFour = false;

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
    inputCourseNo.setAttribute('id', 'myCourseNo-' + idxMyCourse);
    inputCourseNo.type = "text";
    inputCourseNo.name = "CourseNo";
    inputCourseNo.value = "";
    inputCourseNo.style.textAlign = "center";
    inputCourseNo.setAttribute('maxlength', 6);
    inputCourseNo.setAttribute('size', 6);
    return inputCourseNo;
}

function createCourseCreditInput(idx) {
    var inputCourseCredit = document.createElement("INPUT");
    inputCourseCredit.setAttribute('id', 'myCourseCredit-' + idxMyCourse);
    inputCourseCredit.type = "text";
    inputCourseCredit.name = "CourseCredit";
    inputCourseCredit.value = "0";
    inputCourseCredit.style.textAlign = "center";
    inputCourseCredit.setAttribute('maxlength', 1);
    inputCourseCredit.setAttribute('size', 1);
    return inputCourseCredit;
}

function createSelectLetterGradeDropDown(idx) {
    var array = ["-", "A", "B+", "B", "C+", "C", "D+", "D", "F", "S", "U", "P"];
    var selectList = document.createElement("select");
    selectList.id = "myCourseLetterGrade-" + idxMyCourse;
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
    row.setAttribute('id', 'myCourseTR-' + idxMyCourse);
    row.style.backgroundColor = "#FFE3E4";
    var td1 = row.insertCell(-1);
    td1.style.textAlign = "center";
    td1.textContent = idxMyCourse;
    var td2 = document.createElement('td');
    td2.setAttribute('align', 'center');
    row.appendChild(td2);
    var td3 = row.insertCell(-1);
    var td4 = row.insertCell(-1);
    var td5 = row.insertCell(-1);
    var inputCourseNo = createCourseNoInput();
    td2.appendChild(inputCourseNo);
    td3.setAttribute('id', 'myCourseName-' + idxMyCourse);
    td3.textContent = "COURSE NAME";
    td4.appendChild(createCourseCreditInput());
    td4.setAttribute('align', 'center');
    td5.appendChild(createSelectLetterGradeDropDown());
    td5.setAttribute('align', 'center');
    var td6 = row.insertCell(-1);
    td6.style.textAlign = "center";
    var btnRemove = document.createElement("INPUT");
    btnRemove.type = "button";
    btnRemove.value = "X";
    // btnRemove.setAttribute("onclick", "RemoveThisRow(row);");
    btnRemove.onclick = function () {
        //Determine the reference of the Row using the Button.
        var row = this.parentNode.parentNode;
        var name = row.getElementsByTagName("td")[0].innerHTML;
        //Get the reference of the Table.
        var table = document.getElementById("table-main");
        //Delete the Table row using it's Index.
        table.deleteRow(row.rowIndex);
        AdjustRowNumber();
        CalculateExpectedGrades();
    };
    td6.appendChild(btnRemove);

    $("#myCourseNo-" + idxMyCourse).focusout(function () {
        GetCourseInformationFromAPI($(this), $(this).attr("id"));
    });
    $("#myCourseCredit-" + idxMyCourse).on('change keydown paste input', function () {
        // console.log("-> " + $( this ).val() );
        CalculateExpectedGrades();
    });
    $("#myCourseLetterGrade-" + idxMyCourse).on('change keydown paste input', function () {
        // console.log("-> " + $( this ).val() );
        CalculateExpectedGrades();
    });

    idxMyCourse++;
    AdjustRowNumber();
    return idxMyCourse-1;
};

function RemoveThisRow(button) {
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
    nextCreditsGradeS = 0;
    nextCreditsGradeP = 0;
    nextCreditsGradeF = 0;
    let nextCreditsEnrolledGradeSorU = 0, nextCreditsGotGradeSorU = 0;
    for (let index = 1; index <= idxMyCourse; index++) {
        var inputCredit = $("#myCourseCredit-" + index).val();
        if (inputCredit == '') {
            inputCredit = '0';
        }
        const credit = Number.parseInt(inputCredit);
        const letterGrade = $("#myCourseLetterGrade-" + index).val();
        const grade = ConvertGradeToNumber(letterGrade);
        const gradePoint = credit * grade;
        if (grade != -1) {
            nextCredits += credit;
            nextGradePoints += gradePoint;
            if (letterGrade == 'F') {
                nextCreditsGradeF += credit;
            }
        } else if (letterGrade == 'S') {
            nextCreditsEnrolledGradeSorU += credit;
            nextCreditsGotGradeSorU += credit;
        } else if (letterGrade == 'P') {
            nextCreditsGradeP += credit;
        } else if (letterGrade == 'U') {
            nextCreditsEnrolledGradeSorU += credit;
        }

        // Check Award
        if (letterGrade == 'F') {
            foundF = true;
        } else if (letterGrade == 'U') {
            foundU = true;
        }
        // console.log("nextCredits = " + nextCredits);
        // console.log("nextGradePoints = " + nextGradePoints);
    }
    nextGPA = nextGradePoints / nextCredits;
    nextGPA = roundNumber(nextGPA, 2);
    $('#nextEnrolledCredits').text(nextCredits + nextCreditsEnrolledGradeSorU);
    $('#nextGotCredits').text(nextCredits + nextCreditsGotGradeSorU);
    $('#nextGPA').text(isNaN(nextGPA) ? 0.00.toFixed(2) : nextGPA.toFixed(2));
    expectedCredits = overallCredits + nextCredits;
    expectedGradePoints = overallGradePoints + nextGradePoints;
    expectedCGPA = expectedGradePoints / expectedCredits;
    expectedCGPA = roundNumber(expectedCGPA, 2).toFixed(2);
    $('#expectedEnrolledCredits').text(regCmuEnrolledCredits + nextCredits + nextCreditsEnrolledGradeSorU + nextCreditsGradeP);
    $('#expectedGotCredits').text(regCmuGotCredits + nextCredits + nextCreditsGotGradeSorU - nextCreditsGradeF);
    $('#expectedCGPA').text(expectedCGPA);
};

function AdjustRowNumber() {
    var table = document.getElementById("table-main");
    for (var i = 1, row; row = table.rows[i]; i++) {
        const noIdx = row.cells[0];
        noIdx.textContent = i;
    }
};

function FindNextEnrolledCourseList(studentId, lastSemester, lastYear) {
    let nextSemester, nextYear;
    let courseListObj;
    // console.log(studentId, lastSemester, lastYear);
    if (lastSemester == "1") {
        nextSemester = "2";
        nextYear = lastYear;
        courseListObj = GetEnrolledCourseListOfStudentIdFromAPI(studentId, nextSemester, nextYear);
    } else if (lastSemester == "2") {
        nextSemester = "1";
        nextYear = (Number.parseInt(lastYear) + 1).toString();
        courseListObj = GetEnrolledCourseListOfStudentIdFromAPI(studentId, nextSemester, nextYear);
    } else if (lastSemester == "3") {
        nextSemester = "1";
        nextYear = (Number.parseInt(lastYear) + 1).toString();
        courseListObj = GetEnrolledCourseListOfStudentIdFromAPI(studentId, nextSemester, nextYear);
    }
    return courseListObj;
}

function GetEnrolledCourseListOfStudentIdFromAPI(studentId, semester, year) {
    let query = { id: studentId, semester: semester, year: year };
    let queryString = jQuery.param(query);
    const url = urlAPI + '/cgpa-calculator?' + queryString;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseObj = JSON.parse(this.responseText);
            // console.log('responseObj', responseObj);
            if (responseObj.status == false && semester != "3") {
                semester = "3";
                responseObj = GetEnrolledCourseListOfStudentIdFromAPI(studentId, semester, year);
            } else if (responseObj.status == true) {
                FillTableWithEnrolledCourses(responseObj);
            }
            return responseObj;
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
};

function GetCourseInformationFromAPI(element) {
    // console.log("> GetCourseInformationFromAPI", element.val());
    const courseNo = element.val();
    const elementId = element.attr('id');
    const noIdx = elementId.substring(elementId.lastIndexOf("-") + 1, elementId.length);
    if (courseNo.length == 6) {
        const url = urlAPI + '/course/' + courseNo;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var responseObj = JSON.parse(this.responseText);
                var courseNameField = document.getElementById('myCourseName-' + noIdx);
                courseNameField.textContent = responseObj.courseName.toUpperCase();
                var courseCreditField = document.getElementById('myCourseCredit-' + noIdx);
                courseCreditField.value = responseObj.courseCredit;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
};

function FillTableWithEnrolledCourses(courseObj) {
    const courseList = courseObj.courseList;
    // console.log("courseList", courseList);
    $("#table-main").find("tr:not(:first)").remove(); // clear all TR expect header row
    courseList.forEach(course => {
        let rowIndex = addNewCourseRow();
        var courseNoField = document.getElementById('myCourseNo-' + rowIndex);
        courseNoField.value = course.courseNo;
        var courseNameField = document.getElementById('myCourseName-' + rowIndex);
        courseNameField.textContent = course.title.toUpperCase();
        var courseCreditField = document.getElementById('myCourseCredit-' + rowIndex);
        courseCreditField.value = course.credit;
    });
};

// Check page title
const pageTitle = "ผลการเรียนนักศึกษา มหาวิทยาลัยเชียงใหม่";
if (document.title.indexOf(pageTitle) != -1) {
    console.log("CMU CGPA CAlculator has been activated!");

    var numTableFound = $('html body center > table').length;
    // console.log("numFound = " + numFound + "\n");
    var numGradeTable = numTableFound - 1;
    // for (let term_year = 0; term_year <= numGradeTable; term_year+=2) {
    //     $('html body center > table').eq(term_year).html("TERM: " + term_year);
    // }

    // Check year and semester
    var yearList = [],
        semesterList = [];
    for (let term_year = 1; term_year < numTableFound; term_year += 2) {
        var tableHeaderText = $('html body center > table').eq(term_year).find('tbody tr td.msan12').text();
        const year = tableHeaderText.substring(tableHeaderText.lastIndexOf(" ") + 1, tableHeaderText.length);
        const yearNum = Number.parseInt(year);
        let semester = tableHeaderText.split(" ")[1];
        semester = (semester == "ฤดูร้อน" ? "3" : semester);
        if (firstYear == -1) {
            firstYear = yearNum;
        }
        if (yearNum == (firstYear + 4) &&
            tableHeaderText.search("ฤดูร้อน") != -1) {
            summerAtYearFour = true;
        }
        yearList.push(year);
        semesterList.push(semester);
    }
    // console.log(yearList);
    // console.log(semesterList);
    // console.log(Array.from(new Set(yearList)));
    // console.log(yearList[yearList.length - 1]);
    const lastYear = yearList[yearList.length - 1];
    const lastSemester = semesterList[semesterList.length - 1];

    studentId = $('html body center table').first().find('tbody tr').eq(2).find('td').eq(1).text().trim();
    FindNextEnrolledCourseList(studentId, lastSemester, lastYear);

    var lastTable;
    for (let term_year = 1; term_year < numTableFound; term_year += 2) {
        var credits = $('html body center > table').eq(term_year).find('tbody tr.msan').not(':first').find('td:nth-child(4)').map(function () {
            return $(this).text();
        }).get();
        var letterGrades = $('html body center > table').eq(term_year).find('tbody tr.msan').not(':first').find('td:nth-child(5)').map(function () {
            return $(this).text()
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
                if (letterGrade == 'F') {
                    overallCreditsGradeF += credit;
                }
            } else if (letterGrade == 'S') {
                overallCreditsGradeS += credit;
            } else if (letterGrade == 'P') {
                overallCreditsGradeP += credit;
            }
            // Check Award
            if (letterGrade == 'F') {
                foundF = true;
            } else if (letterGrade == 'U') {
                foundU = true;
            }
            // console.log(credit + " x " + grade);
        }
        // console.log("sumGradeP " + sumGradePoints);
        // console.log("sumGradeP " + sumGradePoPnts);
        overallGradePoints += sumGradePoints; // for CGPA
        overallCredits += sumCredits; // for CGPA
        var gpa = sumGradePoints / sumCredits;
        gpa = roundNumber(gpa, 2);
        // console.log("GPA of this term [" + term_year + "] = " + gpa + " = " + sumGradePoints + "/" + sumCredits);
        lastTable = term_year + 1;
    }
    // console.log("overallGradePoints = " + overallGradePoints);
    // console.log("overallCredits = " + overallCredits);

    regCmuEnrolledCredits = $('html body center > table').eq(lastTable).find('tbody tr').eq(2).find('td').eq(1).text();
    regCmuEnrolledCredits = Number.parseInt(regCmuEnrolledCredits);
    regCmuGotCredits = $('html body center > table').eq(lastTable).find('tbody tr').eq(2).find('td').eq(2).text();
    regCmuGotCredits = Number.parseInt(regCmuGotCredits);

    // SECTION: EXPECTED GRADES
    $('html body center > hr').last().after('<script> function AdjustRowNumber() { var table = document.getElementById("table-main"); for (var i = 1, row; row = table.rows[i]; i++) { const noIdx = row.cells[0]; noIdx.textContent = i; } }; function RemoveThisRow(button) { var row = button.parentNode.parentNode; var name = row.getElementsByTagName("td")[0].innerHTML; var table = document.getElementById("table-main"); table.deleteRow(row.rowIndex); AdjustRowNumber(); }; </script> <br> <h1>CMU CGPA Calculator</h1> <div id="alert-program"></div> <table id="cgpa-calculator-table" border="0" align="center" cellpadding="0" cellspacing="0" width="597" bgcolor="#0068D0"> <tbody> <tr id="table-caption"> <td bgcolor="#FFFFFF" width="597" align="center" class="msan"> <table cellspacing="0" cellpadding="0" width="100%" align="center" border="0"> <tbody> <tr> <td width="14" height="20" align="left" valign="top" bgcolor="#FFFFFF"> <img id="wait-top-left" src="" width="14" height="29"> </td> <td id="wait-top-bg" width="723" height="20" align="center" background="" bgcolor="#FFFFFF" class="msan12"><b>Expected</b> Grades in the <b>Next</b> Semester <!-- <b>1</b> ปีการศึกษา <b>2560</b> --> </td> <td width="14" height="20" align="right" valign="top"> <img id="wait-top-right" src="" width="14" height="29"> </td> </tr> </tbody> </table> </td> </tr> <tr> <td width="597" bgcolor="#FFFFFF"> <table id="table-main" border="0" cellspacing="1" cellpadding="2" width="100%" bgcolor="#A2BCD9"> <tbody> <tr bgcolor="#C6E2FF" class="msan" id="table-header"> <td width="29" height="26" align="center" bgcolor="#FFC6C7" class="taho7"> <b>NO</b> </td> <td width="84" align="center" bgcolor="#FFC6C7" class="taho7"> <b>COURSE NO</b> </td> <td width="314" align="center" bgcolor="#FFC6C7" class="taho7"> <b>TITLE</b> </td> <td width="66" align="center" bgcolor="#FFC6C7" class="taho7"> <b>CREDIT</b> </td> <td width="78" align="center" bgcolor="#FFC6C7" class="taho7"> <b>GRADE</b> </td> <td width="29" height="26" align="center" bgcolor="#FFC6C7" class="taho7"> </td> </tr> <tr id="myCourseTR-1" bgcolor="#FFE3E4" class="msan"> <td width="29" height="22" align="center">1</td> <td width="84" height="22" align="center"><input id="myCourseNo-1" type="text" name="CourseId" value="" style="text-align: center" maxlength="6" size="6"></td> <td id="myCourseName-1" width="314" height="22" align="left">COURSE NAME</td> <td height="22" align="center"><input id="myCourseCredit-1" type="text" name="CourseCredit" value="0" style="text-align: center" maxlength="1" size="1"></td> <td width="78" height="22" align="center" class="msan"> <select id="myCourseLetterGrade-1" name="CourseLetterGrade"> <option value="-">-</option> <option value="A">A</option> <option value="B+">B+</option> <option value="B">B</option> <option value="C+">C+</option> <option value="C">C</option> <option value="D+">D+</option> <option value="D">D</option> <option value="F">F</option> <option value="S">S</option> <option value="U">U</option> <option value="P">P</option> </select> </td> <td width="29" height="22" align="center"> <input id="myRemoveButton-1" type="button" value="X" onclick="RemoveThisRow(this);"> </td> </tr> </tbody> </table> <table cellspacing="0" cellpadding="0" width="100%" align="center" border="0"> <tbody> <tr> <td width="14" height="20" align="left" valign="top" bgcolor="#FFFFFF"> <img id="wait-bottom-left2" src="" width="14" height="21"> </td> <td id="wait-bottom-bg2" width="723" height="20" align="center" background="" bgcolor="#FFFFFF"></td> <td width="14" height="20" align="right" valign="top"> <img id="wait-bottom-right2" src="" width="14" height="21"> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <br> <INPUT id="AddNewCourse" type="button" value="Add" class="btn_medium" /> <br> <hr width="520" size="1"> ');
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

    $('#alert-program').load(chrome.runtime.getURL('alert-program.html'));

    $('#AddNewCourse').click(addNewCourseRow);

    $("#myCourseNo-1").focusout(function () {
        GetCourseInformationFromAPI($(this), '1');
    });

    $("#myCourseCredit-1").on('change keydown paste input', function () {
        CalculateExpectedGrades();
    });

    $("#myCourseLetterGrade-1").on('change keydown paste input', function () {
        CalculateExpectedGrades();
    });

    $('#AddNewCourse').after('<br> <br> <table width="431" height="38" border="0" cellpadding="4" cellspacing="1" bgcolor="#A2BCD9"> <tbody> <tr> <td width="82" height="10" valign="middle" align="center" bgcolor="#FFC6C7">ผลการศึกษา</td> <td width="75" height="10" valign="middle" align="center" bgcolor="#FFC6C7">หน่วยกิตที่ลง</td> <td width="75" height="10" valign="middle" align="center" bgcolor="#FFC6C7">หน่วยกิตที่ได้</td> <td width="78" height="10" valign="middle" align="center" bgcolor="#FFC6C7">เกรดเฉลี่ย</td> </tr> <tr> <td height="13" valign="middle" align="right" bgcolor="#FFC6C7">ภาคการศึกษา<b>หน้า</b></td> <td id="nextEnrolledCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="nextGotCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="nextGPA" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0.00&nbsp;</td> </tr> <tr> <td height="13" valign="middle" align="right" bgcolor="#FFC6C7"><b>คาดหมาย</b>สะสมทั้งหมด</td> <td id="expectedEnrolledCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="expectedGotCredits" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0&nbsp;</td> <td id="expectedCGPA" height="13" valign="middle" align="center" bgcolor="#FFE3E4">&nbsp;0.00&nbsp;</td> </tr> </tbody> </table> <br>');
    CalculateExpectedGrades();
}

function roundNumber(num, scale) {
    if (!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale) + "e-" + scale);
    } else {
        var arr = ("" + num).split("e");
        var sig = ""
        if (+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}