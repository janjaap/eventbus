import MiddlewareRegistry from './';
import Middleware from '../Middleware';

class A extends Middleware {
    preProcess() {
        return next => (...args) => {
            const result = next(...args);
            this.doSomethingBefore(...args);

            return result;
        };
    }

    postProcess() {
        return next => (...args) => {
            const result = next(...args);
            this.doSomethingAfter(...args);

            return result;
        };
    }
}

class B extends Middleware {
    noProcess() {
        return next => (...args) => {
            const result = next(...args);
            this.doNothing(...args);

            return result;
        };
    }

    postProcess() {
        return next => (...args) => {
            const result = next(...args);
            this.doSomethingAfter(...args);

            return result;
        };
    }
}

class C {
    noProcess() {
        return next => (...args) => {
            const result = next(...args);
            this.doNothing(...args);

            return result;
        };
    }
}

const classA = new A();
const classB = new B();
const classC = new C();

describe('MiddlewareRegistry', () => {
    describe('Instance', () => {
        it('compose method returns composed functions right to left', () => {
            const divide = a => a / 2;
            const subtract = b => b - 1;
            const multiply = c => c * 2;
            const add = d => d + 1;
            const x = 0;

            const composedFunctions = MiddlewareRegistry.compose([divide, subtract, multiply, add]);
            const compositionRTL = divide(subtract(multiply(add(x))));
            const compositionLTR = add(multiply(subtract(divide(x))));

            expect(composedFunctions(x)).toBe(compositionRTL);
            expect(composedFunctions(x)).not.toBe(compositionLTR);
        });
    });

    describe('Registry', () => {
        it('stores middleware methods for reference', () => {
            const mwareRegistry = new MiddlewareRegistry([classA, classB]);
            expect(mwareRegistry.middlewares.A).not.toBeUndefined();
            expect(mwareRegistry.middlewares.B).not.toBeUndefined();
            expect(Object.getPrototypeOf(mwareRegistry.middlewares.A)).toEqual(Object.getPrototypeOf({}));
            expect(Object.getPrototypeOf(mwareRegistry.middlewares.B)).toEqual(Object.getPrototypeOf({}));

            expect(Object.keys(mwareRegistry.middlewares.A)).toEqual(['preProcess', 'postProcess']);
            expect(Object.keys(mwareRegistry.middlewares.B)).toEqual(['noProcess', 'postProcess']);

            expect(Object.getPrototypeOf(mwareRegistry.middlewares.A.preProcess)).toEqual(Object.getPrototypeOf([]));
            expect(Object.getPrototypeOf(mwareRegistry.middlewares.A.postProcess)).toEqual(Object.getPrototypeOf([]));
            expect(Object.getPrototypeOf(mwareRegistry.middlewares.B.noProcess)).toEqual(Object.getPrototypeOf([]));
        });

        it('returns list of middleware functions', () => {
            const mwareRegistry = new MiddlewareRegistry([classB, classA]);
            expect(mwareRegistry.getMiddlewares('postProcess')).toEqual([
                mwareRegistry.middlewares.B.postProcess[0], mwareRegistry.middlewares.A.postProcess[0],
            ]);
        });

        it('throws when wrong instance is passed', () => {
            const mwareRegistry = new MiddlewareRegistry();

            expect(() => {
                mwareRegistry.addMiddleware(classC);
            }).toThrow();
        });
    });
});
