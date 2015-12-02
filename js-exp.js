'use strict';

class JSExpression {
    constructor(str) {
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
                pushWord(temp);
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

        function pushWord(word) {
            if (word) {
                exp[exp.length - 1].push(word);
            }
        }

        this.expression = exp[0];
    }

    match(template) {
        return matchExprs(this.expression, template.expression);

        function matchExprs(strExp, strTemplate) {
            if (Array.isArray(strExp)) {
                var result = true;

                if (strTemplate[strTemplate.length - 1] === '...') {
                    var fill = strTemplate[strTemplate.length - 2];
                    for (var idx = strTemplate.indexOf('...'); idx < strExp.length; idx++) {
                        strTemplate[idx] = fill;
                    }
                }

                for (var idx = 0; idx < strExp.length; idx++) {
                    if (strTemplate[idx] === 'ANY') {
                        continue;
                    }

                    result = result && matchExprs(strExp[idx], strTemplate[idx]);
                }

                return result;
            } else {
                switch (strTemplate) {
                    case 'NUMBER':
                        return /[\d\.e\+\-]+/i.test(strExp);
                    case 'SYMBOL':
                        return /'[a-zA-Z_][a-zA-Z_\d]*/.test(strExp);
                    case 'BOOLEAN':
                        return /(?:true|false)/.test(strExp);
                    case 'STRING':
                        return /".*"/.test(strExp);
                    default:
                        return strExp === strTemplate;
                }
            }
        }
    }
}

module.exports = JSExpression;