# JS-Expression

[![Build Status](https://travis-ci.org/vicjohnson1213/js-expression.svg?branch=master)](https://travis-ci.org/vicjohnson1213/js-expression)

> A Lisp style s-expression data structure for javascript.

```bash
npm i clone git+https://github.com/vicjohnson1213/js-expression.git
```

## Fields

### expression

The s-expression created from the string passesd into the constructor.

## Instance Methods

### constructor(stringExpression)

Used to create a new instance of a JSExpression.

**Arguments**

1. `stringExpression` *(string)*: The string to build the JSExpression from.

**Example:**

```javascript
var jsExp = new JSExpression('(+ 1 2)');
// Returns a new JSExpression object with the s-expression created from the string passed in.
```

### match(template)

Used to determine whether or not a JSExpression matches a specific template.

**Arguments**

1. `template` *(JSExpression)*: The template JSExpression.

**Template Structure**

A template should be any JSExpression with all legal tokens of a regular JSExpression along with an additional few to alow for more general matching.

The additional symbols are as follows:
- `NUMBER`: Match any number (integer, floating point, scientific notation, etc.).
- `STRING`: Match any string enclosed in double quotation marks.
- `BOOLEAN`: Match either of the words true or false.
- `SYMBOL`: Match any legal variable name preceded by a single quote.
- `ANY`: Match anything, including additional expressions.
- `...`: Match the previous template type for an arbitrary number of tokens (may only be done with the last token of an expression.

**Examples:**

```javascript
var template1 = new JSExpression('(func NUMBER NUMBER)');
var badTemplate1 = new JSExpression('(func NUMBER STRING)');
var exp1 = new JSExpression('(func 1 2)');

exp1.match(template1); // Returns true.
exp1.match(badTemplate1); // Returns false.

var template2 = new JSExpression('(func STRING NUMBER ...)')
var exp2 = new JSExpression('(func "some string" 1 2 3 4 5)');
var bigExp2 = new JSEpression('(func "str" 1 2 3 4 5 6 7 8 9 10)')

exp2.match(template2); // Returns true.
bigExp2.match(template2); // Still returns true.

var template3 = new JSExpression('(func ANY)');
var exp3 = new JSExpression('(func 123)');
var exp4 = new JSExpression('(func true)');
var exp5 = new JSExpression('(func (+ 1 2))');

exp3.match(template3); // Returns true
exp4.match(template3); // Returns true
exp5.match(template3); // Returns true
```

### toArray()

Used to convert a JSExpression to an array of JSExpressions.

Returns an array of JSExpression.

**Example:**

```javascript
var exp = new JSExpression('(+ 1 2)');
exp.toArray();

/*
 * returns [new JSExpression('+'),
 *            new JSExpression('1'),
 *            new JSExpression('2')];
 */
```

### toNumber()

Used to convert a JSExpression to a number.

Returns a number or throws an error of the expression is not a number.

**Example:**

```javascript
var exp = new JSExpression('1');
exp.toNumber();

/*
 * returns 1;
 */
```

### toString()

Used to convert a JSExpression to a string.

Returns a string or throws an error of the expression is not a string.

**Example:**

```javascript
var exp = new JSExpression('"string"');
exp.toString();

/*
 * returns 'string';
 */
```

### toBoolean()

Used to convert a JSExpression to a boolean.

Returns a boolean or throws an error of the expression is not a boolean.

**Example:**

```javascript
var exp = new JSExpression('true');
exp.toBoolean();

/*
 * returns true;
 */
```

### toSymbol()

Used to convert a JSExpression to a symbol.

Returns a symbol (string) or throws an error of the expression is not a symbol.

**Example:**

```javascript
var exp = new JSExpression('\'sym');
exp.toSymbol();

/*
 * returns '\'sym';
 */
```