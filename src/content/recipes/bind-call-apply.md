---
title: 'Bind vs Call vs Apply'
description: .
publishDate: 'Sep 07 2024'
isFeatured: false
seo:
  image:
    src: ''
    alt: ''
---

These methods are used to manipulate the `this` context in functions. Let me create an example that illustrates their usage and differences.



```javascript
// Define an object with a method
const person = {
  name: "Alice",
  greet: function(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
  }
};

// Define another object
const anotherPerson = {
  name: "Bob"
};

console.log("1. Normal method call:");
person.greet("Hello", "!"); // Output: Hello, I'm Alice!

console.log("\n2. Using bind():");
const boundGreet = person.greet.bind(anotherPerson);
boundGreet("Hi", "!"); // Output: Hi, I'm Bob!

console.log("\n3. Using call():");
person.greet.call(anotherPerson, "Hey", "!"); // Output: Hey, I'm Bob!

console.log("\n4. Using apply():");
person.greet.apply(anotherPerson, ["Hello", "!"]); // Output: Hello, I'm Bob!

console.log("\n5. bind() with preset arguments:");
const boundGreetWithArg = person.greet.bind(anotherPerson, "Hola");
boundGreetWithArg("!"); // Output: Hola, I'm Bob!

```

This example demonstrates the key differences between `bind()`, `call()`, and `apply()`. Let me break it down for you:

1. Normal method call: This shows how the method works when called directly on the object.

2. `bind()`: 
   - Creates a new function with a fixed `this` context.
   - Does not immediately invoke the function.
   - The returned function can be called later.

3. `call()`: 
   - Immediately invokes the function with a specified `this` context.
   - Arguments are passed individually.

4. `apply()`: 
   - Similar to `call()`, it immediately invokes the function with a specified `this` context.
   - Arguments are passed as an array.

5. `bind()` with preset arguments:
   - You can preset some arguments when using `bind()`.
   - The bound function will use these preset arguments, and you can add more when calling it.

Key differences:
- `bind()` returns a new function, while `call()` and `apply()` invoke the function immediately.
- `call()` takes arguments separately, while `apply()` takes arguments as an array.
- `bind()` can preset arguments, which is useful for partial function application.

Would you like me to explain any part of this example in more detail?