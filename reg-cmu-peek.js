// Checking page title
if (document.title.indexOf("Students enrollment in course") != -1) {
    console.log("RegCmu Peek has been activated!");
    // $("tbody").prepend("<tr><td>...contents...</td></tr>");
    //Creating Elements
    var btn = document.createElement("BUTTON")
    var t = document.createTextNode("CLICK ME");
    btn.appendChild(t);
    //Appending to DOM 
    document.body.appendChild(btn);

    // $("tbody").prepend("<tr><td>...contents...</td></tr>");
    // $('.msan').html('Whatever <b>HTML</b> you want here.');
    $('.msan').eq(3).html('<b>RegCmu Peek</b>');
    var studentIdList = [];
    // $('html body center div table tbody tr').each(function() { studentIdList.push($(this).text()) });
    var tableObject = $("html body center div table tbody tr.msan")
    .clone()
    .find('td:first').remove().end()
    .find('td:last').remove().end()
    .children()
    .clone()
    .children()
    .remove()	//remove all the children
    .end()	//again go back to selected element
    tableObject.each(function() { studentIdList.push($(this).text()) });
    filtered = studentIdList.filter(function(el, index) {
        return index % 2 === 0;
    });
    // console.log(studentIdList);
    // console.log(filtered);

    var studentDataList = [];
    var studentPictureList = [];
    for (var i = 0; i < filtered.length; i++) {
        var year = filtered[i].substr(0, 2);
        var faculty = filtered[i].substr(2, 2);
        var program = filtered[i].substr(4, 1);
        var id = filtered[i];
        // console.log([year, faculty, program, id]);
        var picUrl = 'http://archive3.lib.cmu.ac.th/innopac/patrons/';
        picUrl += year + '/';
        if (year != '59') {
            picUrl += program + '/';
        }
        picUrl += faculty + '/' + id + '.jpg';
        studentDataList.push([year, faculty, program, id]);
        studentPictureList.push(picUrl);

        $( "tr.msan:contains(" + id + ") td:nth-child(4)" ).html("<img src=\"" + studentPictureList[i] + "\">");
    }
    // console.log(studentPictureList);

    // $( "tr.msan td:nth-child(4)" ).append( "<img src=\"" + studentPictureList[0] + "\">" );
    // $( "tr.msan td:nth-child(4)" ).append( "<span>pic here!</span>" );
}