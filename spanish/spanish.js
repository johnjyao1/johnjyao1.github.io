
function checkAnswer(word, answer_form) {
    if(word == answer_form.val()) {
        answer_form.attr("class", "valid")
    }
    else {
        answer_form.attr("class", "invalid")
    }
}

fetch("data.json").then((response) => response.json()).then((json) => {
    const data = json.data

    for(let i=0; i<data.length; i++) {
        $('#selection').append($("<option>", {value: i}).text(data[i].date))
    }

    $('#selection').on("change", function(event) {
        $("#container").empty();
        const week = $('#selection').val();
        if (week != "") {
            let word_audio = [];
            for(let i=0; i < data[week].words.length; i++) {
                const word = data[week].words[i]
                word_audio.push(new Audio("media/"+word+".mp3"))
                $("#container").append($("<tr>", {"id": "word-container-"+i}));
                $("#word-container-"+i).append($("<td>", {"class": "enum"}).text(i+1+". "));
                $("#word-container-"+i).append($("<td>", {"class": "word"}).text(word));
                $("#word-container-"+i).append($("<td>")).append($("<button>", {"id": i, "class": "speak"}).text("\u{1F509}"));
                $("#"+i).on("click", function() { 
                    word_audio[i].playbackRate = $('#rate').val()
                    word_audio[i].play();
                });
                $("#word-container-"+i).append($("<td>")).append($("<input>", {"id": "answer-" + i, "type": "text"}))
                $("#word-container-"+i).append($("<td>")).append($("<button>", {"id": "check-answer-"+i}).text("Check"));
                $("#check-answer-"+i).on("click", function(event) {
                    checkAnswer(word, $('#answer-'+i));
                })
            }
            $(".word").hide();
        }
    });
});
<<<<<<< HEAD
=======

>>>>>>> spanish
$("#show-hide-words").on("click", function(event) {
    if ($(event.target).text() == "Hide Words") {
        $(event.target).text("Show Words");
        $(".word").hide();
    }
    else {
        $(event.target).text("Hide Words");
        $(".word").show();
    }
});