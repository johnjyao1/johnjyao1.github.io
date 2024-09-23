function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

function encode(text, max_sum) {
    // encode text into a numbers from 0 up to max_sum 
    // (or the number of unique letters if more than max_sum)
    let unique_letters = Array.from(new Set(text.split(' ').join('').split(''))); // unique letters from text
    let num_letters = unique_letters.length; // number of unique letters

    let number_pool = [...Array(Math.max(num_letters, max_sum)).keys()];
    shuffle(number_pool)
    
    let summation = number_pool.slice(0,num_letters);

    let encoding = []
    encoding.push({
        letter: ' ',
        number_1: NaN,
        number_2: NaN,
        sum: -1,    
    })

    for(var i=0; i < num_letters; i++) {
        number_1 = Math.floor(Math.random() * summation[i]);
        encoding.push({
            letter: unique_letters[i],
            number_1: number_1,
            number_2: summation[i] - number_1,
            sum: summation[i]
        })
    };
    // encoding.sort()
    encoding.sort((a, b) => {
        const letter_1 = a.letter.toUpperCase();
        const letter_2 = b.letter.toUpperCase();
        if (letter_1 < letter_2) {
            return -1;
        }
        if (letter_1 > letter_2) {
            return 1;
        }

        return 0;
    });
    return encoding
}

function math_problem_output(object){
    line = [
        '<div>' + object.letter + ': </div>',
        '<div style="text-align:right"><h3>' + object.number_1 + '</h3></div>',
        '<div style="text-align:right"><h3> + ' + object.number_2 + '</h3></div>',
        '<div style="text-align:right"><hr style="border-bottom:5px solid #ffffff" /></div>',
        '<div><input id="' + object.letter + '" type="number" min=0 style="text-align:right"/></div>',
    ]
    return line.join('')
}

function encoded_letter_output(value){
    if (value == -1){
        return '<td>    </td>'
    }
    else {
        return '<td style="text-align:center"><input class="code-value-' + value + '" type="text" maxlength="1" style="padding: 10px; text-align:center"/><small>'+ value + '</small></td>'
    }    

}

function reset_form(){
    var answer_elements = document.getElementsByClassName('answer_form');
    for(var i=0; i < answer_elements.length; i++) {
        answer_elements[i].style.display = "block";
        // answer_elements[i].disabled = false;
    }
    document.getElementById('submit_button').style.display = "block";
    document.getElementById('reset_button').style.display = "none";
    document.getElementById('print_button').style.display = "none";
    document.getElementById('riddle-container').style.display = "none";
    document.getElementById('output').style.display = "none";
    document.getElementById('math_problems').style.display = "none";
    document.getElementById('decode').style.display = "none";
};

function hide_form(){
    var answer_elements = document.getElementsByClassName('answer_form');
    for(var i=0; i < answer_elements.length; i++) {
        answer_elements[i].style.display = "none";
        // answer_elements[i].disabled = true;
    }
    document.getElementById('reset_button').style.display = "block";
    document.getElementById('riddle-container').style.display = "block";
    document.getElementById('output').style.display = "";
    document.getElementById('print_button').style.display = "";
    document.getElementById('math_problems').style.display = "block";
    document.getElementById('decode').style.display = "block";
}

document.getElementById('reset_button').onclick=reset_form;

var textForm = document.getElementById('text_input_form');
var print_button = document.getElementById('print_button')



textForm.addEventListener("submit", (e) => {
    e.preventDefault()

    hide_form()
    let max_sum = document.getElementById('max_sum').value; // maximum sum for addition problems
    let text = document.getElementById('text').value.replace(/ +(?= )/g,'').toUpperCase(); // text to encode
    let riddle = document.getElementById('riddle').value;

    encoding = encode(text, max_sum)
    document.getElementById('riddle-output').innerHTML = riddle

    var message = line_break(text, 15)
    var coded_message = message.map((z) => z.split('').map((x) => String(encoding.filter((y) => y.letter == x)[0].sum)));
    var coded_message_output = [];
    for(var i=0; i < coded_message.length; i++) {
        coded_message_output.push('<tr>')
        for(var j=0; j < coded_message[i].length; j++){
            coded_message_output.push(encoded_letter_output(coded_message[i][j]))
        }
        coded_message_output.push('</tr>')
    }

    document.getElementById('output').innerHTML = coded_message_output.join('');
    output = []

    num_cols = 4
    num_rows = Math.ceil(encoding.length/(num_cols-1))
    for(var j=0; j < num_cols; j++) {
        output.push([])
        output[j].push('<div>')
        for(var i=0; i < num_rows; i++) {
            var k = i*num_cols + j+1
            if(k > 0 && k < encoding.length){
                console.log('i=' + i + ' j=' + j + ' k=' + k + ' letter: ' + encoding[k].letter)
                output[j].push(math_problem_output(encoding[k]))
                // output.push('<div><h2>' + encoding[k].letter + ':</h2> <div style="text-align:right"><h3>' + encoding[k].number_1 + '</h3></div><div style="text-align:right"><h3> + ' + encoding[k].number_2 + '</h3></div><div><input id="' + coded_message[i] + '" type="number"/></div>')
                // output.push('<div><h2>' + encoding[k].letter + ':</h2> <br><h3>' + encoding[k].number_1 + " + " + encoding[k].number_2 + ' =</h3> <input id="' + coded_message[i] + '" type="number"/></div>')
            }
        }
        output[j].push('</div>')
    }
    document.getElementById('math_problems').innerHTML = '<div class="grid">' + output.map((x) => x.join('')).join('') + '</div>'; 

    if(document.querySelector('#live-check').checked){
        for(var i=1; i<encoding.length;i++){
            document.getElementById(encoding[i].letter).addEventListener("change", (e) => {
                e.preventDefault()
                var letter = e.currentTarget.id

                // Get the 
                var index = encoding.map((x) => x.letter).indexOf(letter)
                var answer_input = e.currentTarget
                var answer_value = answer_input.value
                var code_values = document.getElementsByClassName('code-value-' + answer_value)

                // change the color of the answer input field if it's correct/incorrect/empty
                if(!!answer_value){
                    if(answer_value != encoding[index].sum){
                        answer_input.style.borderColor = "red";
                    }
                    else{
                        answer_input.style.borderColor = "green";
                    }
                }else{
                    answer_input.style.borderColor = "gray";
                }
                // fill in the letter for any corresponding code values (even if incorrect)
                for(var j=0; j < code_values.length; j++) {
                    code_values[j].value = letter;
                }
            });
        }
    }
    document.querySelector('#decode').addEventListener("click", (e) => {
        e.preventDefault
        for(var i=1; i<encoding.length;i++){
            var answer_input = document.getElementById(encoding[i].letter)
            var answer_value = answer.value
            var code_values = document.getElementsByClassName('code-value-' + answer_value)
            // change the color of the answer input field if it's correct/incorrect/empty
            if(!!answer_value){
                if(answer_value != encoding[index].sum){
                    answer_input.style.borderColor = "red";
                }
                else{
                    answer_input.style.borderColor = "green";
                }
            }else{
                answer_input.style.borderColor = "gray";
            }
            // fill in the letter for any corresponding code values (even if incorrect)
            for(var j=0; j < code_values.length; j++) {
                code_values[j].value = encoding[i].letter;
            }
        }
    });
});


// Calculate word breaks: suppose each line has a max length of 20
// find
function line_break(text, line_length) {
    broken = []
    full_split = text.split(' ')
    broken.push(full_split.shift())
    while(full_split.length > 0){
        next_word = full_split.shift()
        if(next_word.length+broken[broken.length-1].length+1 < line_length){
            broken[broken.length-1] = broken[broken.length-1]+' '+next_word
        }else{
            broken.push(next_word)
        }
    }
    return broken
}

function vspace(height){
    return {
        layout: 'noBorders',
        table: {
            heights: [height],
            body: [[]]
        }
    }
}


function encoded_word_output_pdf(coded_word) {
    console.log(coded_word)
    coded_word_array = []
    blanks = []
    for(i=0; i<coded_word.length;i++){
        if(coded_word[i] != -1){
            coded_word_array.push({text: coded_word[i], alignment: 'center'})
            blanks.push('____')    
        }else{
            coded_word_array.push('     ')
            blanks.push({text: '____', color: 'white'})
        }
    }
    output_obj = {
        layout: 'noBorders',
        table: {
            heights: ['*', 30],
            body: [
                blanks,
                coded_word_array,
            ]
        }
    }
    return output_obj
}

function math_problem_output_pdf(object, small=False) {
    if(small){
        sizes = {
            letter: 10,
            number: 15,
            height: 20,
        }
    }else{
        sizes = {
            letter: 15,
            number: 20,
            height: 40,
        }
    }
    no_border = Array(4).fill(false)
    bottom_border = [false, false, false, true]
    letter_cell = {text: object.letter+':', border: no_border, fontSize:sizes.letter}
    equation_cell = {text: object.number_1 + "\n+ " + object.number_2, alignment: "right", border: bottom_border, fontSize:sizes.number}
    empty_cell = {text:"", border:no_border}
    output_obj = {
        table: {
            heights: ['*', sizes.height],
            widths: ['*', '*', 5],
            body: [
                [letter_cell, equation_cell, empty_cell],
                [empty_cell, empty_cell, empty_cell],
            ]
        }
    }
    return output_obj
}
 

print_button.addEventListener("click", (e) => {
    e.preventDefault()

    let riddle = document.getElementById('riddle').value
    text = document.getElementById('text').value.replace(/ +(?= )/g,'').toUpperCase(); // text to encode

    pdfMake.fonts = {
            // download default Roboto font from cdnjs.com
        Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
    }
    var small= (encoding.length > 20)
    if(small){
        num_cols = 5
    }
    else{
        num_cols = 4
    }
    num_rows = Math.ceil(encoding.length/num_cols)
    // math_probs_output = []
    coded_message = line_break(text, 20).map((z) => z.split('').map((x) => String(encoding.filter((y) => y.letter == x)[0].sum)))

    my_table = []
    var k=1
    for(var i=0; i < num_rows; i++) {
        var row = []
        for(var j=0; j < num_cols; j++) {
            if(k < encoding.length){
                row.push(math_problem_output_pdf(encoding[k], small=small))
            }else{
                row.push("")
            }
            k = k+1
        }
        my_table.push(row)
    }

    docDefinition = {
        pageSize: 'Letter',
        content: [
            {text: riddle, fontSize: 20},
            vspace(50),
            // {
            //     layout: 'noBorders',
            //     table: {
            //         body: my_coded_message_output
            //     }
            // },
        ]
    };
    // message = coded_message.map()
    docDefinition.content = docDefinition.content.concat(coded_message.map(encoded_word_output_pdf))
    docDefinition.content.push(vspace(50))
    docDefinition.content.push(
        {
            // layout: 'noBorders',
            table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            //   headerRows: 1,
                // heights: Array(num_rows).fill('100'),
                widths: Array(num_cols).fill('*'),
                body: my_table,
            }
        }
    )
    // console.log(JSON.stringify(my_table))
    // docDefinition.content[1].table.body = my_table
    
    pdfMake.createPdf(docDefinition).open();

    // console.log(riddle)
    // console.log(text)
    // console.log(coded_message)

    // for(var i=1; i < encoding.length; i++) {
    //     console.log(encoding[i].letter + ": " + encoding[i].number_1 + " + " + encoding[i].number_2 + " = ")
    // }
});