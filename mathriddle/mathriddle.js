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

function encoded_letter_output(value){
    let cell = $("<td>", {style: "padding:0px 2px 0px 2px; text-align:center"})
    if (value < 0){
        return cell
    }
    else {
        let box = $("<div>", {style: "border: 2px solid gray; border-radius: 10px;"}).append($('<span>', {class: "code-value-"+value, style: "width:100%; font-size:x-large; font-weight:bold"}).text('\xA0'));
        let code = $("<div>").append("<small>").text(value);
        return cell.append([box, code])
    }
}

function encoded_word_output_pdf(coded_word) {
    coded_word_array = coded_word.map((x) => new Object({text: (x >= 0 ? x : ' '), alignment: 'center'}))
    blanks = coded_word.map((x) => new Object({text: '____', color: (x >=0 ? 'black' : 'white')}))
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

function reset_form(){
    var answer_elements = document.getElementsByClassName('answer_form');
    for(var i=0; i < answer_elements.length; i++) {
        answer_elements[i].style.display = "block";
        // answer_elements[i].disabled = false;
    }
    document.getElementById('submit_button').style.display = "block";
    document.getElementById('reset_button').style.display = "none";
    document.getElementById('print_button').style.display = "none";
    document.getElementById('riddle-output').style.display = "none";
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
    document.getElementById('riddle-output').style.display = "block";
    document.getElementById('output').style.display = "";
    document.getElementById('print_button').style.display = "";
    document.getElementById('math_problems').style.display = "block";
    document.getElementById('decode').style.display = "block";
}

var reset_button = document.getElementById('reset_button');
var textForm = document.getElementById('text_input_form');
var print_button = document.getElementById('print_button');

reset_button.onclick = reset_form;

class SubCipher {
    // Creates a substitution cipher
    constructor(plain_chars, cipher_chars) {
        this.encrypt_map = new Map;
        this.decrypt_map = new Map;

        for(var i=0; i<plain_chars.length; i++) {
            this.encrypt_map.set(plain_chars[i], cipher_chars[i])
            this.decrypt_map.set(cipher_chars[i], plain_chars[i])
        }
    }

    encode(plain_chars){
        // plain_chars can be a single character or an array, but not a string
        // so to encode a string 'MESSAGE' you should pass 'MESSAGE'.split('')
        if(!Array.isArray(plain_chars) && plain_chars.length == 1){
            return this.encrypt_map.get(plain_chars)
        }
        return plain_chars.map((x) => this.encrypt_map.get(x))
    }
    decode(cipher_chars){
        // plain_chars can be a single object or an array
        if(!Array.isArray(cipher_chars)){
            return this.decrypt_map.get(cipher_chars)
        }
        return cipher_chars.map((x) => this.decrypt_map.get(x))
    }
}

class EncodedMessage {
    constructor(riddle, text, max_num) {
        this.riddle = riddle; // Text of the riddle/prompt
        this.text = text; // Text of the answer/message -- this will be encoded
        this.chars = Array.from(new Set(text.split(' ').join('').split(''))).sort(); // unique letters from text
        // Another way to deal with spaces and non-letter characters?
        let number_pool = [...Array(Math.max(max_num, this.chars.length)).keys()];
        shuffle(number_pool);
        const summation = number_pool.slice(0,this.chars.length);
        this.cipher = new SubCipher([' '].concat(this.chars), [-1].concat(summation));
        this.problems = this.chars.map((x) => new SumProblem(x, this.cipher.encode(x)));
    }

    html_output(root, chars_per_line) {
        // Coded message with line breaks
        const coded_message = line_break(this.text, chars_per_line).map((x) => this.cipher.encode(x.split('')))
        root.append(coded_message.map((x) => $("<tr>").append(x.map(encoded_letter_output))))

        // return coded_message.map((x) => '<tr>'+x.map(encoded_letter_output).join('')+'</tr>').join('')
    }

    jquery_output(root, num_cols=4) {
        let num_rows = Math.ceil(encoding.problems.length/(num_cols-1));
        let grid = $('<div class="grid">');
        for(let j=0; j < num_cols; j++) {
            let col = $('<div>');
            for(let i=0; i < num_rows; i++) {
                const k = i*num_cols + j
                if(k < this.problems.length){
                    this.problems[k].jquery_output(col)
                }
            }
            grid.append(col)
        }
        root.append(grid)
    }

    problems_dom_output(root, num_cols=4) {
        let num_rows = Math.ceil(encoding.problems.length/(num_cols-1))
        let grid = document.createElement("div")
        grid.className="grid"
        for(let j=0; j < num_cols; j++) {
            let col = document.createElement("div")
            for(let i=0; i < num_rows; i++) {
                const k = i*num_cols + j
                if(k < this.problems.length){
                    this.problems[k].dom_output(col)
                }
            }
            grid.appendChild(col)
        }
        root.appendChild(grid)
    }
}

class MathProblem {
    constructor(letter, answer){
        this.letter = letter;
        this.answer = answer;
    }
}

class SumProblem extends MathProblem {
    constructor(letter, answer){
        super(letter, answer);
        this.number_1 = Math.floor(Math.random() * answer);
        this.number_2 = answer - this.number_1;
    }

    jquery_output(node) {
        node.append([
            $("<div>").text(this.letter + ":"),
            $("<div>", {style: "text-align:right"}).append($("<h3>").text(this.number_1)),
            $("<div>", {style: "text-align:right; border-bottom:5px solid white"}).append($("<h3>").text("+ " + this.number_2)),
            $("<div>", {style: "text-align:right"}).append($("<input>", {id: this.letter, type: "number", min: 0, style: "text-align:right"})),
        ]);
        return node
    }

    pdf_output(sizes={letter: 15, number: 20, height: 40}) {
        const no_border = [false, false, false, false];
        const bottom_border = [false, false, false, true];
        const empty_cell = {text:"", border:no_border};
        let output = {table: {
            heights: ['*', sizes.height],
            widths: ['*', '*', 5],
            body: [[], []]
        }};
        output.table.body[0].push({text: this.letter+':', border: no_border, fontSize:sizes.letter})
        output.table.body[0].push({text: this.number_1 + "\n+ " + this.number_2, alignment: "right", border: bottom_border, fontSize:sizes.number})
        output.table.body[0].push(empty_cell);
        output.table.body[1] = [empty_cell, empty_cell, empty_cell]
        return output
    }
}

textForm.addEventListener("submit", (e) => {
    e.preventDefault()

    hide_form()
    const max_sum = document.getElementById('max_sum').value; // maximum sum for addition problems
    const text = document.getElementById('text').value.replace(/ +(?= )/g,'').toUpperCase(); // text to encode
    const riddle = document.getElementById('riddle').value;
    encoding = new EncodedMessage(riddle, text, max_sum)

    $('#riddle-output').text(riddle);
    // $('#output').html(encoding.html_output(15));
    encoding.html_output($('#output'), 15)
    encoding.jquery_output($('#math_problems'))

    if(document.querySelector('#live-check').checked){
        for(var i=0; i<encoding.problems.length;i++){
            document.getElementById(encoding.problems[i].letter).addEventListener("change", (e) => {
                e.preventDefault()
                var letter = e.currentTarget.id

                // Get the 
                var index = encoding.problems.map((x) => x.letter).indexOf(letter)
                var answer_input = e.currentTarget
                var answer_value = answer_input.value
                var code_values = document.getElementsByClassName('code-value-' + answer_value)

                // change the color of the answer input field if it's correct/incorrect/empty
                if(!!answer_value){
                    if(answer_value != encoding.problems[index].answer){
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
                    code_values[j].innerHTML = letter;
                    // code_values[j].value = letter;
                }
            });
        }
    }
    document.querySelector('#decode').addEventListener("click", (e) => {
        e.preventDefault
        for(var i=0; i<encoding.problems.length;i++){
            var answer_input = document.getElementById(encoding.problems[i].letter)
            var answer_value = answer.value
            var code_values = document.getElementsByClassName('code-value-' + answer_value)
            // change the color of the answer input field if it's correct/incorrect/empty
            if(!!answer_value){
                if(answer_value != encoding.problems[index].answer){
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
                code_values[j].value = encoding.problems[i].letter;
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
    return { layout: 'noBorders', table: {heights: [height], body: [[]]} }
}



print_button.addEventListener("click", (e) => {
    e.preventDefault()

    let riddle = document.getElementById('riddle').value
    let text = document.getElementById('text').value.replace(/ +(?= )/g,'').toUpperCase(); // text to encode

    pdfMake.fonts = {
            // download default Roboto font from cdnjs.com
        Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        },
    }
    let sizes;
    let num_cols;
    if((encoding.problems.length > 20)){
        num_cols = 5;
        sizes={letter: 10, number: 15, height: 20}
    }
    else{
        num_cols = 4;
        sizes={letter: 15, number: 20, height: 40}
    }
    num_rows = Math.ceil(encoding.problems.length/num_cols)
    coded_message = line_break(text, 20).map((z) => encoding.cipher.encode(z.split('')))

    my_table = []
    let k=0
    for(let i=0; i < num_rows; i++) {
        let row = []
        for(let j=0; j < num_cols; j++) {
            if(k < encoding.problems.length){
                row.push(encoding.problems[k].pdf_output(sizes=sizes))
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
        ]
    };
    docDefinition.content = docDefinition.content.concat(coded_message.map(encoded_word_output_pdf))
    docDefinition.content.push(vspace(50))
    docDefinition.content.push(
        {
            table: {
                widths: Array(num_cols).fill('*'),
                body: my_table,
            }
        }
    )    
    pdfMake.createPdf(docDefinition).open();
});