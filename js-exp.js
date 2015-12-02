function stringToSExp(str) {
    var exp = [[]],
        word = '',
        inString = false;

    for (var idx = 0; idx < str.length; idx++) {
        var c = str[idx];

        if (c === '(' && !inString) {
            exp.push([]);
        } else if (c === ')' && !inString) {
            if (word.length > 0) {
            pushWord(word);
                word = '';
            }

            var temp = exp.pop();
            pushWord(word);
        }
        else if ([' ', '\n', '\t'].indexOf(c) !== -1 && !inString) {
            pushWord(word);
            word = '';
        } else if (c === '\"') {
            word += '"';
            inString = !inString;
        } else {
            word += c;
        }
    }

    return exp[0];

    function pushWord(word) {
        if (word) {
            exp[exp.length - 1].push(word);
        }
    }
}

function parseSExp(exp) {

}

function sExpMatch(exp, template) {

    if (Array.isArray(exp)) {
        var result = true;

        if (template[template.length - 1] === '...') {
            var fill = template[template.length - 2];
            for (var idx = template.indexOf('...'); idx < exp.length; idx++) {
                template[idx] = fill;
            }
        }

        for (var idx = 0; idx < exp.length; idx++) {
            result = result && sExpMatch(exp[idx], template[idx]);
        }

        return result;
    } else {
        switch (template) {
            case 'NUMBER':
                return /[\d\.e\+\-]+/i.test(exp);
            case 'SYMBOL':
                return /'[a-zA-Z_][a-zA-Z_\d]*/.test(exp);
            case 'BOOLEAN':
                return /(?:true|false)/.test(exp);
            case 'STRING':
                return /".*"/.test(exp);
            case 'ANY':
                return /(?:[\d\.eE\+\-]+|'[a-zA-Z_][a-zA-Z_\d]*|(?:true|false)|\".*\")/.test(exp);
            default:
                return exp === template;
        }
    }
}

// console.log(stringToSExp('(+ 1 \'asdf \"some string\" true)'));
// console.log(stringToSExp('(+ NUMBER STRING)'));

console.log(sExpMatch(stringToSExp('(+ \'thing (* 1 2) 123)'), 
                        stringToSExp('(+ SYMBOL ANY NUMBER)')));