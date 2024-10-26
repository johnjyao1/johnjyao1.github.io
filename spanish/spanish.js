// Test jQuery
// $('#container').text('jQuery works!')

const synth = window.speechSynthesis;

function speakSpanish(text, rate=0.7) {
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.lang = 'es-ES'; // Set the language to Spanish (Spain)
  utterThis.rate = rate

  // Find a Spanish voice
  const spanishVoice = speechSynthesis.getVoices().find(voice => voice.lang === 'es-ES');
  if (spanishVoice) {
    utterThis.voice = spanishVoice;
  }

  synth.speak(utterThis);
}

function checkAnswer(word, answer_form) {
    if(word == answer_form.val()) {
        answer_form.attr("class", "valid")
    }
    else {
        answer_form.attr("class", "invalid")
    }
}

fetch("data.json").then(function(data) {

// const data = [
//     {
//         "date": "Oct 14 2024",
//         "words": [
//             "sale",
//             "silla",
//             "sapo",
//             "soga",
//             "semilla",
//             "señora",
//             "sala",
//             "sofá",
//             "sirena",
//             "sucio"     
//         ]
//     },
//     {
//         "date": "Oct 21 2024",
//         "words": [
//             "dedo",
//             "dama",
//             "diente",
//             "ducha",
//             "dibujo",
//             "delental",
//             "dulce",
//             "dijo",
//             "comunicación",
//             "expresar"     
//         ]
//     },
// ]

for(let i=0; i<data.length; i++) {
    $('#selection').append($("<option>", {value: i}).text(data[i].date))
}

$('#selection').on("change", function(event) {
    $("#container").empty();
    week = $('#selection').val();
    if (week != "") {
        word_audio = [];
        for(let i=0; i < data[week].words.length; i++) {
            //$("#container").append($("<div>").text(words[i]));
            word_audio.push(new Audio("media/"+data[week].words[i]+".mp3"))
            $("#container").append($("<tr>", {"id": "word-container-"+i}));
            $("#word-container-"+i).append($("<td>", {"class": "enum"}).text(i+1+". "));
            $("#word-container-"+i).append($("<td>", {"class": "word"}).text(data[week].words[i]));
            $("#word-container-"+i).append($("<td>")).append($("<button>", {"id": i, "class": "speak"}).text("\u{1F509}"));
            $("#"+i).on("click", function() { 
                word_audio[i].playbackRate = $('#rate').val()
                word_audio[i].play();
            });
            $("#word-container-"+i).append($("<td>")).append($("<input>", {"id": "answer-" + i, "type": "text"}))
            $("#word-container-"+i).append($("<td>")).append($("<button>", {"id": "check-answer-"+i}).text("Check"));
            $("#check-answer-"+i).on("click", function(event) {
                checkAnswer(data[week].words[i], $('#answer-'+i));
            })
        }
        $(".word").hide();
    }
})
})
$("#show-hide-words").on("click", function(event) {
    if ($(event.target).text() == "Hide Words") {
        $(event.target).text("Show Words");
        $(".word").hide();
    }
    else {
        $(event.target).text("Hide Words");
        $(".word").show();
    }
})