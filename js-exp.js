'use strict';

class JSExpression {
    constructor(str) {
        var exp = [[]],
            word = '',
            inString = false;

        for (let idx = 0; idx < str.length; idx++) {
            let c = str[idx];

            if (c === '(' && !inString) {
                exp.push([]);
            } else if (c === ')' && !inString) {
                if (word.length > 0) {
                    pushWord(word);
                    word = '';
                }

                let temp = exp.pop();
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

        pushWord(word);

        function pushWord(word) {
            if (word) {
                exp[exp.length - 1].push(word);
            }
        }

        this.expression = exp[0][0];
    }

    match(template) {
        return matchExprs(this.expression, template.expression);

        function matchExprs(strExp, strTemplate) {
            if (Array.isArray(strExp)) {
                let result = true,
                    repeat;

                for (let idx = 0; idx < strExp.length; idx++) {
                    if (strTemplate[idx] === 'ANY') {
                        continue;
                    } else if (strTemplate[idx] === '...') {
                        repeat = strTemplate[idx - 1];
                    }

                    result = result && matchExprs(strExp[idx], repeat || strTemplate[idx]);
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

    toArray() {
        if (Array.isArray(this.expression)) {
            return this.expression.map(el => {
                return new JSExpression(el);
            });
        } else {
            return [this];
        }
        
    }
}

module.exports = JSExpression;