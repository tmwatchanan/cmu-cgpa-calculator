var pageTitle = "ผลการเรียนนักศึกษา มหาวิทยาลัยเชียงใหม่";

// Check page title
if (document.title.indexOf(pageTitle) != -1) {
    console.log("RegCMU CGPA CAlculator has been activated!");

    // $("tbody").prepend("<tr><td>...contents...</td></tr>");
    // $('.msan').html('Whatever <b>HTML</b> you want here.');
    $('html body center table').eq(1).find('tbody tr.msan').eq(2).find('td').html('<b>RegCMU</b>');
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