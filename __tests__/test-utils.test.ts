import { setsEqual } from "../src/test-utils";

describe('test utils', () => {
    describe('setsEqual', () => {
        test('two arrays should not be equal if they are different length', () => {
            const a = ['a'];
            const b = ['a', 'b'];

            expect(setsEqual(a, b)).toBe(false);
        })

        test('two arrays with the same length but different elements will be false', () => {
            const a = ['a'];
            const b = ['b'];

            expect(setsEqual(a, b)).toBe(false);
        })

        test('should return true for a matching array', () => {
            const a = ['a', 'b', 'c'];

            expect(setsEqual(a, a)).toBe(true);
        })
    })
})