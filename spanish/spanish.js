
function checkAnswer(word, answer_form) {
    if(word == answer_form.val()) {
        answer_form.attr("class", "valid")
    }
    else {
        answer_form.attr("class", "invalid")
    }
}

function setSpellingWords(root, words) {
    root.empty();

    const week = $('#selection').val();
    if (week != "") {
        let word_audio = [];
        for(let i=0; i < words.length; i++) {
            const word = words[i]
            word_audio.push(new Audio("media/"+word+".mp3"))
            root.append($("<tr>", {"id": "word-container-"+i}));
            $("#word-container-"+i).append($("<td>", {"class": "enum"}).text(i+1+". "));
            $("#word-container-"+i).append($("<td>", {"class": "word"}).text(word));
            $("#word-container-"+i).append($("<td>")).append($("<button>", {"id": i, "class": "speak"}).text("\u{1F509}"));
            $("#"+i).on("click", function() { 
                word_audio[i].playbackRate = $('#rate').val()
                word_audio[i].play();
            });
            $("#word-container-"+i).append($("<td>")).append($("<input>", {"id": "answer-" + i, "type": "text"}))
            $("#answer-"+i).on("focus", function() {
                if ($("#answer-"+i).val()=="" && $("#auto-speak").is(":checked")) {
                    word_audio[i].playbackRate = $('#rate').val()
                    word_audio[i].play();        
                }
            })    
            $("#answer-"+i).on("change", function(event) {
                checkAnswer(word, $('#answer-'+i));
            })
        }
        $("#show-hide-words").text("Show Words");
        $(".word").hide();
    }
}

fetch("data.json").then((response) => response.json()).then((json) => {
    var data = json.data

    for(let i=0; i<data.length; i++) {
        $('#selection').append($("<option>", {value: i}).text(data[i].date))
    }
    $('#selection').val(data.length-1)
    setSpellingWords($("#container"), data[$('#selection').val()].words)

    $('#selection').on("change", function(event) {
        setSpellingWords($("#container"), data[$('#selection').val()].words)
    });
});
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