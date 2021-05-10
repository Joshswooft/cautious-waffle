import { NodeType } from "../src/package";
import { arraysEqual, setsEqual } from "../src/test-utils";

describe('test utils', () => {
    describe('arraysEqual', () => {
        test('two arrays should not be equal if they are different length', () => {
            const a = ['a'];
            const b = ['a', 'b'];

            expect(arraysEqual(a, b)).toBe(false);
        })

        test('two arrays with the same length but different elements will be false', () => {
            const a = ['a'];
            const b = ['b'];

            expect(arraysEqual(a, b)).toBe(false);
        })

        test('should return true for a matching array', () => {
            const a = ['a', 'b', 'c'];

            expect(arraysEqual(a, a)).toBe(true);
        })
    })

    describe('setsEqual', () => {
        test('2 sets with the same obj keys/values should be equal if they are also the same length', () => {
            const a: NodeType[] = [{ name: 'bar' }];
            
            expect(setsEqual(a, a)).toBe(true);
        });

        test('2 sets with different lengths should be false', () => {
            const a: NodeType[] = [{ name: 'bar' }];
            const b: NodeType[] = [{ name: 'bar' }, { name: 'foo'}];

            expect(setsEqual(a, b)).toBe(false);
        })

        test('2 sets with different property values should be false', () => {
            const a: NodeType[] = [{ name: 'bar' }];
            const b: NodeType[] = [{ name: 'foo' }];

            expect(setsEqual(a, b)).toBe(false);
        })
        test('2 sets should match with name casing being insensitive', () => {
            const a: NodeType[] = [{ name: 'bar' }];
            const b: NodeType[] = [{ name: 'BaR' }];
            
            expect(setsEqual(a, b)).toBe(true);
        })
    });
})