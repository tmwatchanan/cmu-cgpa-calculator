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
    $('.msan').eq(3).html('RegCmu Peek');
    var studentIdList = [];
    $('html body center div table tbody tr').each(function() { studentIdList.push($(this).text()) });
    console.log(studentIdList);
    // $( "tbody tr.msan td:nth-child(0)" ).append( "<span> - pic here!</span>" );
    // $( "tr td:nth-child(4)" ).append( "<span> - pic here!</span>" );
}