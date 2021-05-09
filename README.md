# Lifebit AI tech test

[![TypeScript version][ts-badge]][typescript-4-2]
[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]
[![Build Status - Travis][travis-badge]][travis-ci]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

This is a mini challenge which aims to mimic what popular package solutions such as npm or yarn do. It handles being able to import all of the dependencies of a specific package(s) and is able to identify when a package or a nested package conflicts with another one.

## Data structure

For this challenge I used a DAG (Directed Acyclic Graph) as the data structure for the packages with the conflicts of the package stored on each node. 

## Getting Started

This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].
### Clone repository

To clone the repository use the following commands:

```sh
git clone https://github.com/Joshswooft/cautious-waffle.git
cd cautious-waffle
npm install
```

## Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests

## Code test


The idea behind this problem represents a common situation when dealing with software dependencies.

When you want to install a software package, sometimes the package might have dependencies with other software packages. This means that, for that package to be installed, the dependencies also need to be installed. For example, you cannot install a printing software package if you do not have certain fonts packages installed. (But you can have those font packages installed without the printing package.) If you want to select one software package, then all the dependencies have to also be selected.

In another case, you might want to install a package that is in conflict with another package installation. You cannot have both installed at the same time. If you try to install one, the packages that are in conflict should be uninstalled.

### Rule Sets
Let's say we have a set of packages which the user can select to install. Packages can be related between them in two ways: one can depend on another, and two packages can be mutually exclusive. That means that these equalities must always hold true (note: this is not code, those are logical equations):

"A depends on B", or "for A to be selected, B needs to be selected"
```
ruleSet.AddDep(A, B) =>
if isSelected(A) then isSelected(B)
```
"A and B are exclusive", or "B and A are exclusive", or "for A to be selected, B needs to be unselected; and for B to be selected, A needs to be unselected"
```
ruleSet.AddConflict(A, B) <=> ruleSet.AddConflict(B, A) =>
if isSelected(A) then !isSelected(B) && if isSelected(B) then !isSelected(A)
```
We say that a set of relations are coherent if the laws above are valid for that set. For example, this set of relations is coherent:
```
AddDep(A, B) // "A depends on B"
AddDep(B, C) // "B depends on C"
AddConflict(C, D) // "C and D are exclusive"
```
And these sets are not coherent:
```
AddDep(A, B)
AddConflict(A, B)
```
A depends on B, so it's a contradiction that they are exclusive. If A is selected, then B would need to be selected, but that's impossible because, by the exclusion rule, both can't be selected at the same time.
```
AddDep(A, B)
AddDep(B, C)
AddConflict(A, C)
```
The dependency relation is transitive; it's easy to see, from the rules above, that if A depends on B, and B depends on C, then A also depends on C. So this is a contradiction for the same reason as the previous case.

### Questions
A.

Write a data structure (RuleSet) for expressing these rules between packages, ie. for defining a rule set. You also need to define a constructor and 2 methods:
```
NewRuleSet(): Returns an empty rule set.
RuleSet.AddDep(A, B): a method for rule sets that adds a new dependency A between and B.
RuleSet.AddConflict(A, B): a method for rule sets that add a new conflict between A and B.
```
B.

Implement the algorithm that checks that an instance of that data structure is coherent, that is, that no option can depend, directly or indirectly, on another package and also be mutually exclusive with it.

```
RuleSet.IsCoherent(): a method for rule sets that returns true if it is a coherent rule set, false otherwise.
```

C.

Implement the algorithm that, given the rules between packages, a package, and a collection of selected packages coherent with the rules, adds the package to a collection of selected pacakges, or removes it from the collection if it is already there, selecting and deselecting pacakges automatically based on dependencies and exclusions.

```
New(rs): returns a new (empty) collection of selected packages (Pkgs) for the rule set rs.
Pkgs.Toggle(p): a method for a collection of selected packages, to set or unset package p.
Pkgs.StringSlice(): returns a slice of string with the current list of selected packages.
```

The algorithm for when a checkbox is selected is asked to you in section C, based on the data structures you define in section A. In section B you should provide an algorithm that 'tests' that sections A and C give a good solution.

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE) file for details.

[ts-badge]: https://img.shields.io/badge/TypeScript-4.2-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=%2014.16-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v14.x/docs/api/
[travis-badge]: https://travis-ci.org/jsynowiec/node-typescript-boilerplate.svg?branch=main
[travis-ci]: https://travis-ci.org/jsynowiec/node-typescript-boilerplate
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-4-2]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
[license-badge]: https://img.shields.io/badge/license-APLv2-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[prettier]: https://prettier.io
[gh-actions]: https://github.com/features/actions
[travis]: https://travis-ci.org

