I used test-driven development and functional programming to guide the growth of this project over the course of several evenings over several weeks.

In this project, I display my take on:
- effective, practical TDD
- FP techniques for client-side apps

Here are some of my lessons learned while making this:
- The optimal level of functional programming purity is, indeed, roughly 85%: http://www.johndcook.com/blog/2010/04/15/85-functional-language-purity/
- I once read that a node.js best practice is to make methods all synchronous or all asynchronous, not a mix of both.  That idea helped me come up with my current approach to FP in web apps: methods should either NEVER or ONLY write to or read from mutable state.  However, I'm still relatively new to practical functional programming, and I have a lot to learn. :)
- Refactoring without meaningful tests is dangerous. I might rather just re-write everything properly.
- FP makes TDD faster and more effective.
- The 'this' keyword should be used minimally to avoid side-effects.
- I went way too long without using underscore.js to its fullest.
