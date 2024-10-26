function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

function encoded_letter_output(value){
    let cell = $("<div class='coded-letter'>")
    if (value < 0){
        return cell
    }
    else {
        const box = $("<div class='coded-box'>").append($('<span>', {class: "letter-coded-"+value}).text("\xa0"));
        const code = $("<span>").text(value);
        return cell.append([box, code])
    }
}

function coded_message_pdfMake_table(coded_word) {
    return {
        layout: 'noBorders',
        table: {
            heights: ['*', 30],
            body: [
                // blanks
                coded_word.map((x) => new Object({text: '____', color: (x >=0 ? 'black' : 'white')})),
                // code values
                coded_word.map((x) => new Object({text: (x >= 0 ? x : ' '), alignment: 'center'})),
            ]
        }
    }
}

function math_problem_dom_output(problem, operator) {
    let container = $('<div class="problem-container">')
    container.append([
        $("<div>", {style: "text-align:left"}).text(problem.letter + ":"),
        $("<div>").append($("<h3>").text(problem.number_1)),
        $("<div>").append($("<h3>").text(problem.operator + " " + problem.number_2)),
        $("<div>", {class: "answer-input"}).append($("<input>", {id: problem.letter, type: "number", min: 0, style: "text-align:right"})),
    ]);
    return container
}

function math_problem_pdf_output(problem, operator, sizes={letter: 15, number: 20, height: 40}) {
    const no_border = [false, false, false, false];
    const bottom_border = [false, false, false, true];
    const empty_cell = {text:"", border:no_border};
    let output = {table: {
        heights: ['*', sizes.height],
        widths: ['*', '*', 5],
        body: [[], []]
    }};
    output.table.body[0].push({text: problem.letter+':', border: no_border, fontSize:sizes.letter})
    output.table.body[0].push({text: problem.number_1 + "\n" + problem.operator + " " + problem.number_2, alignment: "right", border: bottom_border, fontSize:sizes.number})
    output.table.body[0].push(empty_cell);
    output.table.body[1] = [empty_cell, empty_cell, empty_cell]
    return output
}

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
    constructor(riddle, text, max_num, problem_type = AdditionProblem) {
        this.riddle = riddle; // Text of the riddle/prompt
        this.text = text; // Text of the answer/message -- this will be encoded
        this.chars = Array.from(new Set(text.split(' ').join('').split(''))).sort(); // unique letters from text
        
        let number_pool = [...Array(Math.max(max_num, this.chars.length)).keys()];

        // Efficient for small number_pools, inefficient for large ones.
        shuffle(number_pool);
        const summation = number_pool.slice(0,this.chars.length);
        // Another way to deal with spaces and non-letter characters?
        this.cipher = new SubCipher([' '].concat(this.chars), [-1].concat(summation));
        this.problems = this.chars.map((x) => new problem_type(x, this.cipher.encode(x)));
        // this.problems = this.chars.map((x) => new SumProblem(x, this.cipher.encode(x)));
    }

    coded_message_output() {
        // Split message text into words encode them, and append an (encoded) space at the end of each word
        const coded_words = this.text.split(' ').map((x) => this.cipher.encode(x.split(''))).map((x) => x.concat(this.cipher.encode([' '])));
        // For each word, generate a `div.coded-word` element that has, as children, a `div.coded-letter` element for each letter
        // `children` is an array of jQuery `div.coded-word` elements
        const children = coded_words.map((x) => $("<div>", {class: "coded-word", style: "grid-template-columns: repeat(" + x.length + ", 1fr); grid-column: span " + x.length + ";"}).append(x.map((y)=>encoded_letter_output(y)))[0]);
        return $('<div class="coded-message">').append(children)
    }

    problems_output() {
        return $('<div class="problems-grid">').append(this.problems.map((x) => x.dom_output()))
    }
}

class MathProblem {
    constructor(letter, answer){
        this.letter = letter;
        this.number_1;
        this.number_2;
        this.answer = answer;
        this.operator;
    }
    dom_output() {
        return math_problem_dom_output(this)
    }

    pdf_output(sizes={letter: 15, number: 20, height: 40}) {
        return math_problem_pdf_output(this, sizes)
    }
}

class AdditionProblem extends MathProblem {
    constructor(letter, answer){
        super(letter, answer);
        this.number_1 = Math.floor(Math.random() * answer);
        this.number_2 = answer - this.number_1;
        this.operator = "+"
    }
}

class SubtractionProblem extends MathProblem {
    constructor(letter, answer){
        super(letter, answer);
        this.number_2 = Math.floor(Math.random() * answer);
        this.number_1 = answer + this.number_2;
        this.operator = "-"
    }
}

function reset_form(){
    $('.answer-form').css({display: "block"});
    $('#solve-container').css({display: "none"});

    $('#coded-message-container').empty();
    $('#math-problems-container').empty();
};

function hide_form(){
    $('.answer-form').css({display: "none"});
    $('#solve-container').css({display: "block"});
}

function check(){
    // checks all answers and populates letters in coded message boxes
    // letters are populated whether or not they are correct
    const answers = encoding.problems.map((x) => x.answer);
    const letters = encoding.problems.map((x) => x.letter)
    const inputs = letters.map((x) => $('#'+x)[0]);
    
    // clear all letters from coded message
    $('div.coded-box').children().text('\xa0')
    for(let i=0; i<inputs.length; i++){
        if(!!inputs[i].value){
            $('.letter-coded-'+inputs[i].value).text(letters[i]) // add letter to matching code values (even if incorrect)
            // change input border color if correct/incorrect/empty
            if(inputs[i].value != answers[i]){
                inputs[i].style.borderColor = "var(--pico-form-element-invalid-active-border-color)";
            }else{
                inputs[i].style.borderColor = "var(--pico-form-element-valid-active-border-color)";
            }
        }else{
            inputs[i].style.borderColor = "var(--pico-form-element-border-color)";
        }
    }
}

let encoding;

$('#reset_button').on("click", reset_form);

$('#text_input_form').on("submit", (e) => {
    e.preventDefault()

    hide_form()
    
    const max_sum = $('#max_sum')[0].value; // maximum sum for addition problems
    const text = $('#text')[0].value.replace(/ +(?= )/g,'').toUpperCase(); // text to encode
    const riddle = $('#riddle')[0].value;
    encoding = new EncodedMessage(riddle, text, max_sum)

    $('#riddle-output').text(riddle);
    $("#coded-message-container").append(encoding.coded_message_output())
    $("#math-problems-container").append(encoding.problems_output())
    $('#decode').on("click", check)

    if($('#live-check')[0].checked){
        for(let i=0; i<encoding.problems.length; i++) {
            $('#'+encoding.problems[i].letter).on("change", check);
        }
    }
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

$('#print_button').on("click", (e) => {

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
    docDefinition.content = docDefinition.content.concat(coded_message.map(coded_message_pdfMake_table))
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