import Middleware from './';

class A extends Middleware {
    constructor(...args) {
        super(...args);
        this.name = 'A';
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    static get time() {
        return new Date();
    }
}

const classA = new A();

describe('Middleware', () => {
    describe('Instance', () => {
        it("'getClassMethodNames' doesn't return constructor nor static methods", () => {
            const methodNames = classA.getClassMethodNames();

            expect(methodNames).toEqual(['getName', 'setName']);
        });
    });
});
