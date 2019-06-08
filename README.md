# Hobj
> 🔪 Handy object manipulation tools

# Installation

With NPM:
```bash
npm install --save hobj
```

Without:
```html
<script src="https://unpkg.com/lucagez/hobj/dist/hobj.umd.js"></script>
```

# How hooks work

`Hobj` will provide hooks to execute functions before/after a method is executed.
This is done by executing in order:
```bash
=> BEFORE queue
=> fulfilled promise executing AFTER queue
=> called METHOD
```
This way, a micro-task is scheduled thanks to the already fulfilled promise.
So, the AFTER queue will always be executed after the called METHOD. Precisely on `nextTick`.

This will guarantee the order:
1. **BEFORE**
2. **METHOD**
3. **AFTER** 

# Usage

## Init Hobj

You can create a new `Hobj` instance passing an existing js object. 
```javascript
const Hobj = require('hobj');

const obj = new Hobj();

const obj1 = new Hobj({
  hello: 'world',
});
```
The object that is mutated from `Hobj` methods lives in the `.store` property.

```javascript
const obj = new Hobj(); // Hobj instance

obj.store // {}

```
The store property can be manipulated exactly like any other js object.
**NOTE:** This means that you don't have to rely only on the `Hobj` methods to mutate the object.

```javascript
const test = { hello: 'world' };

const obj = new Hobj();

// Example operation.
obj.store = {
  ...test,
  a: 'b',
};
```

## Paths

**Every** `Hobj` method that take a `path` as argument supports dot-notation.

**e.g.** 
```javascript
const obj = new Hobj();

obj.store // {}

obj.set('a.b.c', 'd'); // { a: { b: { C: 'd' } } }

```

## Calling a method

For each `Hobj` method there are two variations:
- Normal => obj.[method] => ALWAYS executes before/after hooks.
- Pure => obj.[_method] => Pure method. No hooks.

**NOTE:** Normal methods can be used also if hooks are not defined.

```javascript
const obj = new Hobj();

obj.before('set', () => console.log('Setting'));

// NORMAL
obj.set('a.b', 'c'); 

// Setting
// { a: { b: 'c' } }


// PURE => no hooks are invoked
obj._set('d', 'e');

// { a: { b: 'c' }, d: 'e' }

```

## Defining hooks

Hooks can be defined calling on a `Hobj` instance a before/after method.
Passing the method to hook and a function responsible for that particular hook.

```javascript
const obj = new Hobj();

// Example using an arbitrary method. You can hook every method defined
// in the `METHODS` section.
obj.before('set', () => {
  console.log('Setting 0');
});

// You can hook with how many functions you like.
// They will be executed in insertion order.
obj.before('set', () => {
  console.log('Setting 1');
});

obj.set('a', 'b');

// Setting 0
// Setting 1
// [Actually setting the property]
```

The same is true for `after` hook.
```javascript
const obj = new Hobj();

obj.before('set', () => {
  console.log('Setting');
});

obj.after('set', () => {
  console.log('Success 🎉');
});

obj.set('a', 'b');

// Setting
// [Actually setting the property]
// Success 🎉
```

Every `before` function will be invoked with the exact same arguments as the invoked method.

```javascript
const obj = new Hobj();

// Hooked function will be invoked with TWO arguments
// as the `set` method accepts TWO arguments.
obj.before('set', (prop, value) => {
  console.log(`Setting ${prop} equal to ${value}`);
});

obj.set('a', 'b');

// Setting a equal to b
// [Actually setting the property]


// Hooked function will be invoked with ONE argument
// as the `set` method accepts ONE argument.
obj.before('has', (value) => {
  console.log(`Checking if ${value} is in obj`);
});

obj.has('a');

// Checking if a is in obj
// TRUE
```

Every `after` function will be invoked with arguments used on the invoked method PLUS the result of the actual invoked method.

```javascript
const obj = new Hobj();

// Hooked function will be invoked with TWO arguments
// as the `set` method accepts TWO arguments.
obj.before('set', (prop, value) => {
  console.log(`Setting ${prop} equal to ${value}`);
});

obj.after('set', (prop, value, result) => {
  console.log('The object is now', result);
});

obj.set('a', 'b');

// Setting a equal to b
// [Actually setting the property]
// The object is now { a: 'b' }

```

# METHODS

For each `Hobj` method there are two variations:
- Normal => obj.[method] => ALWAYS executes before/after hooks.
- Pure => obj.[_method] => Pure method. No hooks.

## store

Not a method. The object on which the mutations are operated will live inside this property.

```bash
obj.store
```

## has / _has

```bash
obj.has(path)
```
Checks if a (nested) path exists in the object.

**RETURNS:** `true/false`

| param | type   | default   | required |
|-------|--------|-----------|----------|
| path  | string | undefined | no       |

## get / _get

```bash
obj.get(path)
```
Returns object belonging to a (nested) path.

**RETURNS:**
- `object` if a path is provided
- `undefined` if the provided path does not exists

| param | type   | default   | required |
|-------|--------|-----------|----------|
| path  | string | undefined | no       |


## set / _set

```bash
obj.set(path, value)
```
Set property at (nested) path.

**RETURNS:** `store`

| param | type   | default   | required |
|-------|--------|-----------|----------|
| path  | string | undefined | no       |
| value | any    | undefined | no       |


## delete / _delete

```bash
obj.delete(path)
```
Delete (nested) property.

**RETURNS:** `true/false`. Deletion is successful or not.

| param | type   | default   | required |
|-------|--------|-----------|----------|
| path  | string | undefined | no       |

## sub / _sub

```bash
obj.sub(path)
```
Returns a **completely new** object belonging to a (nested) path.

**NOTE:** when retrieving a property using `get`, a reference is returned. Using `sub` you are creating a totally new instance.

**RETURNS:**
- `object` if a path is provided
- `undefined` if the provided path does not exists
- `store` (a cloned instance of) if no path is provided

| param | type   | default   | required |
|-------|--------|-----------|----------|
| path  | string | ''        | no       |

