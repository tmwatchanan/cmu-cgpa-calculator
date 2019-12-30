var urlAPI = 'https://reg-cmu-api.herokuapp.com';

new Noty({
    type: 'information',
    theme: 'mint',
    timeout: '5000',
    animation: {
        open: function(promise) {
            var n = this;
            var Timeline = new mojs.Timeline();
            var body = new mojs.Html({
                el: n.barDom,
                x: { 500: 0, delay: 0, duration: 1000, easing: 'elastic.out' },
                isForce3d: true,
                onComplete: function() {
                    promise(function(resolve) {
                        resolve();
                    })
                }
            });

            var parent = new mojs.Shape({
                parent: n.barDom,
                width: 200,
                height: n.barDom.getBoundingClientRect().height,
                radius: 0,
                x: {
                    [150]: -150
                },
                duration: 1.2 * 1000,
                isShowStart: true
            });

            n.barDom.style.overflow = 'visible';
            parent.el.style.overflow = 'hidden';

            var burst = new mojs.Burst({
                parent: parent.el,
                count: 10,
                top: n.barDom.getBoundingClientRect().height + 75,
                degree: 90,
                radius: 75,
                angle: {
                    [-90]: 40
                },
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
        close: function(promise) {
            var n = this;
            new mojs.Html({
                el: n.barDom,
                x: { 0: 500, delay: 10, duration: 500, easing: 'cubic.out' },
                skewY: { 0: 10, delay: 10, duration: 500, easing: 'cubic.out' },
                isForce3d: true,
                onComplete: function() {
                    promise(function(resolve) {
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
    var td1 = row.insertCell(-1);
    td1.textContent = idxMyCourse;
    td1.align = 'center';
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
    td6.align = "center";
    var btnRemove = document.createElement("INPUT");
    btnRemove.id = "myRemoveButton-" + idxMyCourse;
    btnRemove.type = "button";
    btnRemove.value = "X";
    btnRemove.className = "btn btn-danger";
    btnRemove.onclick = function() {
        //Determine the reference of the Row using the Button.
        var row = this.parentNode.parentNode;
        var name = row.getElementsByTagName("td")[0].innerHTML;
        //Get the reference of the Table.
        if (confirm("Do you want to delete: " + name)) {
            var table = document.getElementById("table-main");
            //Delete the Table row using it's Index.
            table.deleteRow(row.rowIndex - 2);
            AdjustRowNumber();
            CalculateExpectedGrades();
        }
    };
    td6.appendChild(btnRemove);

    $("#myCourseNo-" + idxMyCourse).focusout(function() {
        GetCourseInformationFromAPI($(this), $(this).attr("id"));
    });
    $("#myCourseCredit-" + idxMyCourse).on('change keydown paste input', function() {
        // console.log("-> " + $( this ).val() );
        CalculateExpectedGrades();
    });
    $("#myCourseLetterGrade-" + idxMyCourse).on('change keydown paste input', function() {
        // console.log("-> " + $( this ).val() );
        CalculateExpectedGrades();
    });

    idxMyCourse++;
    AdjustRowNumber();
    return idxMyCourse - 1;
}


function CalculateExpectedGrades() {
    // console.log(overallGradePoints);
    nextCredits = 0;
    nextGradePoints = 0.0;
    nextCreditsGradeS = 0;
    nextCreditsGradeP = 0;
    nextCreditsGradeF = 0;
    var nextCreditsEnrolledGradeSorU = 0,
        nextCreditsGotGradeSorU = 0;
    for (var index = 1; index <= idxMyCourse; index++) {
        var inputCredit = $("#myCourseCredit-" + index).val();
        if (inputCredit == '') {
            inputCredit = '0';
        }
        var credit = Number.parseInt(inputCredit);
        var letterGrade = $("#myCourseLetterGrade-" + index).val();
        var grade = ConvertGradeToNumber(letterGrade);
        var gradePoint = credit * grade;
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
}

function AdjustRowNumber() {
    var table = document.getElementById("table-main");
    for (var i = 1, row; row = table.rows[i]; i++) {
        var noIdx = row.cells[0];
        noIdx.textContent = i + 1;
    }
}

function FindNextEnrolledCourseList(studentId, lastSemester, lastYear) {
    var nextSemester, nextYear;
    var courseListObj;
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
    var query = { id: studentId, semester: semester, year: year };
    var queryString = jQuery.param(query);
    var url = urlAPI + '/cgpa-calculator?' + queryString;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
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
}

function GetCourseInformationFromAPI(element) {
    // console.log("> GetCourseInformationFromAPI", element.val());
    var courseNo = element.val();
    var elementId = element.attr('id');
    var noIdx = elementId.substring(elementId.lastIndexOf("-") + 1, elementId.length);
    if (courseNo.length == 6) {
        var url = urlAPI + '/course/' + courseNo;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
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
}

function FillTableWithEnrolledCourses(courseObj) {
    var courseList = courseObj.courseList;
    // console.log("courseList", courseList);
    $("#table-main").find("tr:not(:first)").remove(); // clear all TR expect header row
    courseList.forEach(course => {
        var rowIndex = addNewCourseRow();
        var courseNoField = document.getElementById('myCourseNo-' + rowIndex);
        courseNoField.value = course.courseNo;
        var courseNameField = document.getElementById('myCourseName-' + rowIndex);
        courseNameField.textContent = course.title.toUpperCase();
        var courseCreditField = document.getElementById('myCourseCredit-' + rowIndex);
        courseCreditField.value = course.credit;
    });
}

function roundNumber(num, scale) {
    if (!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale) + "e-" + scale);
    } else {
        var arr = ("" + num).split("e");
        var sig = "";
        if (+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}

// Check page title
var pageTitle = "ระบบงานทะเบียนการศึกษา";
if (document.title.indexOf(pageTitle) != -1) {
    console.log("CMU CGPA CAlculator has been activated!");

    var numTableFound = $('html body div div div > table').length;
    //console.log("numTableFound = " + numTableFound);
    var numGradeTable = numTableFound - 1;
    // for (let term_year = 0; term_year <= numGradeTable; term_year+=2) {
    //     $('html body center > table').eq(term_year).html("TERM: " + term_year);
    // }

    // Check year and semester
    var yearList = [],
        semesterList = [];

    var tableHeaderText = $('html body div div div').find('h3').text();
    //console.log("tableHeaderText = " + tableHeaderText);
    var splitYear = tableHeaderText.split("ภาคการศึกษา");

    for (var i = 1; i <= numTableFound / 2; i++) {

        //console.log("แยกปี[" + i + "] = " + splitYear[i].split(" ")[3]);

        var semester = splitYear[i].split(" ")[1];
        semester = semester.replace(/\s{2,10}/g, '');
        //console.log("เทอม = " + semester);

        yearList.push(splitYear[i].split(" ")[3]);
        semesterList.push(semester);
    }
    //console.log("รายการปี = " + yearList);
    //console.log("รายการเทอม = " + semesterList);

    var yearNum = Number.parseInt(splitYear[1].split(" ")[3]);
    //console.log("ปีแรก = " + yearNum);

    if (firstYear == -1) {
        firstYear = yearNum;
    }
    if (yearNum == (firstYear + 4) &&
        tableHeaderText.search(" 3 ") != -1) {
        summerAtYearFour = true;
    }
    //console.log("ปีล่าสุดคือซัมเมอร์ = " + summerAtYearFour);
    //console.log(Array.from(new Set(yearList)));
    var lastYear = yearList[yearList.length - 1];
    //console.log("ปีล่าสุด = " + lastYear);
    var lastSemester = semesterList[semesterList.length - 1];
    //console.log("เทอมล่าสุด = " + lastSemester);

    studentId = $('html body div > table').first().find('tbody tr').eq(0).find('td').eq(2).text().trim();
    //console.log("รหัสนักศึกษา = " + studentId);
    FindNextEnrolledCourseList(studentId, lastSemester, lastYear);

    var lastTable;
    for (var i = 1; i < numTableFound; i += 2) {
        var numFound = $('html body div > table').eq(i).find('tbody').find('tr').length;
        //console.log("ลงทะเบียนเรียน = " + numFound);
        for (var j = 0; j < numFound; j++) {
            var credits = $('html body div > table').eq(i).find('tbody').find('tr').eq(j).find('td').eq(3).map(function() {
                return $(this).text();
            }).get();
            //console.log("Credit[" + (j + 1) + "] = " + credits);

            var letterGrades = $('html body div > table').eq(i).find('tbody').find('tr').eq(j).find('td').eq(4).map(function() {
                return $(this).text().replace(/\s{2,10}/g, '');
            }).get();
            //console.log("เกรด[" + (j + 1) + "] = " + letterGrades);
        }

        // console.log(letterGrades);
        var sumCredits = 0.0;
        var sumGradePoints = 0.0;
        for (var index = 0; index < letterGrades.length; index++) {
            var credit = Number.parseInt(credits[index]);
            var letterGrade = letterGrades[index];
            var grade = ConvertGradeToNumber(letterGrade);
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
        lastTable = i + 1;
    }

    // console.log("overallGradePoints = " + overallGradePoints);
    // console.log("overallCredits = " + overallCredits);

    regCmuEnrolledCredits = $('html body div > table').eq(lastTable).find('tbody tr').eq(1).find('td').eq(1).text();
    regCmuEnrolledCredits = Number.parseInt(regCmuEnrolledCredits);
    //console.log("regCmuEnrolledCredits = " + regCmuEnrolledCredits);
    regCmuGotCredits = $('html body div > table').eq(lastTable).find('tbody tr').eq(1).find('td').eq(2).text();
    regCmuGotCredits = Number.parseInt(regCmuGotCredits);
    //console.log("regCmuGotCredits = " + regCmuGotCredits);

    // SECTION: EXPECTED GRADES
    $('html body div div div > table').last().after('<hr><h3>CMU CGPA Calculator</h3><div id="alert-program"></div><table id="cgpa-calculator-table" class="table table-bordered table-striped" id="mt2" style="background-color:#eee;"><thead><tr><th colspan="5"><center>Expected Grades in the Next Semester</center></th></tr></thead><thead><tr><th width="4%">No</th><th width="8%">Course no</th><th width="75%">Course Title</th><th width="6%">Credit</th><th width="7%">Grade</th></tr></thead><tbody id="table-main"><tr id="myCourseTR-1"><td align="center">1</td><td align="center"><input id="myCourseNo-1" type="text" name="CourseNo" value="" style="text-align: center" maxlength="6" size="6"></td><td id="myCourseName-1">COURSE NAME</td><td align="center"><input id="myCourseCredit-1" type="text" name="CourseCredit" value="0" style="text-align: center" maxlength="1" size="1"></td><td align="center"><select id="myCourseLetterGrade-1" name="CourseLetterGrade"><option value="-">-</option><option value="A">A</option><option value="B+">B+</option><option value="B">B</option><option value="C+">C+</option><option value="C">C</option><option value="D+">D+</option><option value="D">D</option><option value="F">F</option><option value="S">S</option><option value="P">P</option></select></td><td align="center"><input id="myRemoveButton-1" type="button" value="X" class="btn btn-danger" disabled></td></tr></tbody></table><center><INPUT id="AddNewCourse" type="button" value="Add" class="btn btn-primary" /></center>');

    $('#alert-program').load(chrome.runtime.getURL('alert-program.html'));

    $('#AddNewCourse').click(addNewCourseRow);

    $("#myCourseNo-1").focusout(function() {
        GetCourseInformationFromAPI($(this), '1');
    });

    $("#myCourseCredit-1").on('change keydown paste input', function() {
        CalculateExpectedGrades();
    });

    $("#myCourseLetterGrade-1").on('change keydown paste input', function() {
        CalculateExpectedGrades();
    });

    $('#AddNewCourse').after('<br> <br><table class="table table-bordered table-striped"><thead><tr style="background-color:#DADADA;"><th align="center">ผลการศึกษา/Record</th><th align="center">หน่วยกิตที่ลง / CA</th><th align="center">หน่วยกิตที่ได้ / CE</th><th align="center">เกรดเฉลี่ย / GPA</th></tr></thead><tbody><tr><td>ภาคการศึกษา<b>หน้า</b></td><td id="nextEnrolledCredits" align="center">&nbsp;0.00&nbsp;</td><td id="nextGotCredits" align="center">&nbsp;0.00&nbsp;</td><td id="nextGPA" style="font-weight:bold;" align="center">&nbsp;0.00&nbsp;</td></tr><tr style="font-weight:bold;"><td>คาดหมายสะสมทั้งหมด / Cumulative</td><td id="expectedEnrolledCredits" align="center">&nbsp;0.00&nbsp;</td><td id="expectedGotCredits" align="center">&nbsp;0.00&nbsp;</td><td id="expectedCGPA" align="center">&nbsp;0.00&nbsp;</td></tr></tbody></table><br>');

    CalculateExpectedGrades();
}