var assert = require('assert'),
    JSExpression = require('../js-exp.js');

describe('JSExpression', function() {
    describe('constructor', function() {
        it('should igonre an empty function', function() {
            assert.deepStrictEqual((new JSExpression('()')).expression, []);
        });
    });

    describe('match', function() {
        it('should match single token', function() {
            assert(new JSExpression('123').match(new JSExpression('NUMBER')));
        });

        it('should match wildcards', function() {
            var s = new JSExpression('(12 \'test (+ 1 2) "str" true false)');
            var t = new JSExpression('(NUMBER SYMBOL ANY STRING BOOLEAN BOOLEAN)');
            assert(s.match(t));
        });

        it('should fail for non matching wildcards', function() {
            var s = new JSExpression('(12 \'test (+ 1 2) "str")');
            var t = new JSExpression('(STRING SYMBOL ANY STRING)');
            assert(!s.match(t));
        });

        it('should match specific words', function() {
            var s = new JSExpression('(12 \'test (+ 1 2) somewords)');
            var t = new JSExpression('(NUMBER SYMBOL ANY somewords)');
            assert(s.match(t));
        });

        it('should fail for non matching specific words', function() {
            var s = new JSExpression('(12 \'test (+ 1 2) somewords)');
            var t = new JSExpression('(NUMBER SYMBOL ANY somewords2)');
            assert(!s.match(t));
        });

        it('should match ...', function() {
            var s = new JSExpression('(\'symbol 1 2 3 4 5)');
            var t = new JSExpression('(SYMBOL NUMBER ...)');
            assert(s.match(t));
        });

        it('should match ... inside an inner expression', function() {
            var s = new JSExpression('(\'symbol ("thing" "thing2") 1 2 3)');
            var t = new JSExpression('(SYMBOL (STRING ...) NUMBER ...)');
            assert(s.match(t));
        });
    });

    describe('toArray', function() {
        it('should convert to array', function() {
            var s = new JSExpression('(+ 1 2)');
            assert.deepStrictEqual(s.toArray(), [new JSExpression('+'), new JSExpression('1'), new JSExpression('2')]);
        });

        it('should work for a single element', function() {
            var s = new JSExpression('1');
            assert.deepStrictEqual(s.toArray(), [s]);
        });
    });

    describe('toString', function() {
        it('should turn expression to string', function() {
            var s = new JSExpression('"string"');
            assert.strictEqual(s.toString(), 'string');
        });

        it('should throw error for not a string', function() {
            var s = new JSExpression('1');
            assert.throws(s.toString, Error);
        });
    });

    describe('toNumber', function() {
        it('should turn expression to number', function() {
            var s = new JSExpression('1');
            assert.strictEqual(s.toNumber(), 1);
        });

        it('should throw error for not a string', function() {
            var s = new JSExpression('"str"');
            assert.throws(s.toNumber, Error);
        });
    });

    describe('toBoolean', function() {
        it('should turn expression to boolean', function() {
            var s = new JSExpression('false');
            assert.strictEqual(s.toBoolean(), false);
        });

        it('should throw error for not a string', function() {
            var s = new JSExpression('"str"');
            assert.throws(s.toBoolean, Error);
        });
    });

    describe('toSymbol', function() {
        it('should turn expression to boolean', function() {
            var s = new JSExpression('\'sym');
            assert.strictEqual(s.toSymbol(), '\'sym');
        });

        it('should throw error for not a string', function() {
            var s = new JSExpression('"str"');
            assert.throws(s.toSymbol, Error);
        });
    });
});