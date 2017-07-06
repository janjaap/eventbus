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
    });
});
