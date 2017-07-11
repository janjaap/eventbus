delete require.cache[require.resolve('../middleware.js')]
const Middleware = require('../middleware.js');

const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const expect = chai.expect;

chai.use(sinonChai);

const mwm = new Middleware.Manager();

describe('MiddlewareManager', () => {
    describe('Instance', () => {
        it("has a method 'use'", () => {
            expect(mwm.use).to.be.a('function');
        });

        it("has a static method 'compose'", () => {
            expect(Middleware.Manager.compose).to.be.a('function');
        });

        it("has a static method 'getClassMethodNames'", () => {
            expect(Middleware.Manager.getClassMethodNames).to.be.a('function');
        });

        it("'getClassMethodNames' doesn't return constructor nor static methods", () => {
            class A {
                constructor() {
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

            const methodNames = Middleware.Manager.getClassMethodNames(new A());
            expect(methodNames).to.deep.equal(['getName', 'setName']);
        });

        it('compose method returns composed functions right to left', () => {
            const divide = a => a / 2;
            const subtract = b => b - 1;
            const multiply = c => c * 2;
            const add = d => d + 1;
            const x = 0;

            const composedFunctions = Middleware.Manager.compose([divide, subtract, multiply, add]);
            const compositionRTLResult = divide(subtract(multiply(add(x))));
            const compositionLTRResult = add(multiply(subtract(divide(x))));

            assert.strictEqual(composedFunctions(x), compositionRTLResult);
            assert.notStrictEqual(composedFunctions(x), compositionLTRResult);
        });
    });

    describe('Use', () => {
        class Target {
            constructor() {
                this.someProperty = '';
            }

            setOwnProp(prop) {
                this.someProperty = prop;
            }
        }

        class Mware1 {
            setOwnProp() {
                return next => (prop) => {
                    const newProp = `${prop}_first`;
                    return next(newProp);
                };
            }
        }

        class Mware2 {
            setOwnProp() {
                return next => (prop) => {
                    const newProp = `${prop}_second`;
                    return next(newProp);
                };
            }
        }

        const target = new Target();

        it('replaces target method with composed middleware functions', () => {
            mwm.use(target, new Mware2(), new Mware1());
            target.setOwnProp('some_string');
            assert.strictEqual(target.someProperty, 'some_string_first_second');
        });

        it('middleware methods have access to target object', () => {
            const mWare1 = new Mware1();
            const mWare2 = new Mware2();
            const spy1 = sinon.spy(mWare1, 'setOwnProp');
            const spy2 = sinon.spy(mWare2, 'setOwnProp');

            mwm.use(target, mWare2, mWare1);
            target.setOwnProp('some_string');

            expect(mWare1.setOwnProp).to.have.been.calledWith(target);
            expect(mWare2.setOwnProp).to.have.been.calledWith(target);
        });
    });
});
