var assert = require('assert'),
    JSExpression = require('../js-exp.js');

describe('JSExpression', function() {
    describe('constructor', function() {
        it('should igonre an empty function', function() {
            assert.deepStrictEqual((new JSExpression('()')).expression, [[]]);
        });
    });

    describe('match', function() {
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
});