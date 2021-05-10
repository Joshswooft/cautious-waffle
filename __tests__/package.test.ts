import { NodeType, Package } from "../src/package";

describe('Package', () => {
    test('should create an empty package', () => {
        const p = new Package();
        expect(p.getNodes().length).toBe(0);
    });

    test('should return list of selected packages', () => {
        const p = new Package();

        const A = {name: 'A', selected: true}
        const B = {name: 'B', selected: false}
        const C = {name: 'C', selected: true}

        p.insert(A);
        p.insert(B);
        p.insert(C);

        p.addEdge(B.name, A.name);
        p.addEdge(A.name, C.name);

        expect(p.StringSlice()).toMatchObject(['A', 'C']);

    });

    test('adding 2 packages with the same name should fail', () => {
        const p = new Package();
        const testPackage: NodeType = { name: 'test' };
        p.insert(testPackage);
        expect(() => p.insert(testPackage)).toThrow();
    })

    test('should set a new package', () => {
        const p = new Package();

        p.Toggle({ name: "test"});

        expect(p.StringSlice()).toMatchObject(['test']);
    });

    test('should unset a package', () => {
        const p = new Package();
        const name = "test";

        p.Toggle({ name });
        p.Toggle({name })

        expect(p.getNodes().length).toBe(1);
        expect(p.StringSlice()).toMatchObject([]);
    });

    test('should set selected to true for an existing un-selected package', () => {
        const p = new Package();
        const name = "test";

        p.insert({name, selected: false});
        p.Toggle({ name });

        expect(p.getNodes().length).toBe(1);
        expect(p.StringSlice()).toMatchObject([name]);

    });
})