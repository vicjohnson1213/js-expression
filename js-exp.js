'use strict';

var regs = {
    number: /^[\d\.e\+\-]+$/i,
    symbol: /^'[a-zA-Z_][a-zA-Z_\d]*$/,
    string: /^".*"$/,
    bool: /^(?:true|false)$/,
    token: /^(?:[^\s]+|"(?:[^\\"\n]|(?:\\.))*?")$/
}

class JSExpression {
    constructor(mainStr) {
        if (regs.token.test(mainStr)) {
            this.expression = mainStr;
        } else {
            this.expression = parseStr(mainStr);
        }

        function parseStr(str) {
            var exp = [],
                word = '',
                inString = false,
                depth = 0;

            if (str[0] === '(' && str[str.length - 1] === ')') {
                str = str.slice(1, str.length - 1);
            }

            for (let idx = 0; idx < str.length; idx++) {
                let c = str[idx];

                if (c === '(' && !inString && depth === 0) {
                    depth++;
                } else if (c === ')' && !inString) {
                    depth--;
                    pushWord(word);
                    word = '';
                } else if (/^\s$/.test(c) && depth === 0) {
                    pushWord(word);
                    word = '';
                } else if (c === '"') {
                    word += '"';
                    inString = !inString;
                } else {
                    word += c;
                }
            }

            pushWord(word);
            word = '';

            function pushWord(word) {
                if (word) {
                    exp.push(new JSExpression(word));
                }
            }
            
            return exp;
        }
    }

    match(template) {
        return matchExprs(this, template);
        
        function matchExprs(exp, temp) {
            if (Array.isArray(exp.expression)) {
                var result = true,
                    repeat;

                for (let idx = 0; idx < exp.expression.length; idx++) {
                    if (temp.expression === 'ANY') {
                        continue;
                    } else if (temp.expression[idx] && temp.expression[idx].expression === '...') {
                        repeat = temp.expression[idx - 1];
                    }

                    var tempres = matchExprs(exp.expression[idx], repeat || temp.expression[idx]);

                    result = result && tempres;
                }

                return result;
            } else {
                switch (temp.expression) {
                    case 'NUMBER':
                        return regs.number.test(exp.expression);
                    case 'SYMBOL':
                        return regs.symbol.test(exp.expression);
                    case 'BOOLEAN':
                        return regs.bool.test(exp.expression);
                    case 'STRING':
                        return regs.string.test(exp.expression);
                    default:
                        return exp.expression === temp.expression;
                }
            }
        }
    }

    toArray() {
        if (Array.isArray(this.expression)) {
            return this.expression;
        } else {
            return [this];
        }
    }

    toString() {
        if (regs.string.test(this.expression)) {
            return this.expression.slice(1, this.expression.length - 1);
        } else {
            throw new Error('Not a string: ' + this.expression);
        }
    }

    toNumber() {
        if (regs.number.test(this.expression)) {
            return Number(this.expression);
        } else {
            throw new Error('Not a number: ' + this.expression);
        }
    }

    toBoolean() {
        if (regs.bool.test(this.expression)) {
            return this.expression === 'true';
        } else {
            throw new Error('Not a boolean: ' + this.expression);
        }
    }

    toSymbol() {
        if (regs.symbol.test(this.expression)) {
            return this.expression
        } else {
            throw new Error('Not a symbol: ' + this.expression);
        }
    }
}

module.exports = JSExpression;