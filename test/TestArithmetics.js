const Curve = artifacts.require("Curve.sol");
const CurveFactory = artifacts.require("GenericCurveFactory.sol");
const util = require("util");
const BN = require("bn.js");
const ethUtil = require("ethereumjs-util");
const assert = require("assert");
const t = require('truffle-test-utils');
const async = require("async");
t.init();
var ZERO = new BN(0);
var operator;
const EC = require("elliptic").ec;
const ec = new EC('curve');

// const curveP = new BigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F");
// const curveN = new BigNumber("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
let curves = [
    require('./data/curve'),
];

curves.forEach(function (data) {
    contract('Crypto', function (accounts) {
        let curve;
        let curveFactory;
        operator = accounts[0];

        describe(data.name + ' Arith', function () {

            beforeEach(async () => {
                curveFactory = await CurveFactory.new({from: operator});
                curve = await createCurve();
            });

            async function createCurve() {
                const c = await curveFactory.createCurve(
                    [data.fieldSize],
                    [data.groupOrder],
                    [data.lowSmax],
                    [data.cofactor],
                    [data.Gx, data.Gy],
                    [data.A],
                    [data.B],
                    {from: operator}
                );

                const newCurve = c.logs[0].args.newCurve;
                const crv = Curve.at(newCurve);
                const pp = await crv.pp();
                assert(pp.toString(10) === fieldSize.toString(10));
                return crv
            }

            describe('#add()', function () {

                it('should add a set of points successfully', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        let result = await curve._add(randPoint, data.testdata.randomPoints[idx - 1]);
                        result = await curve.toAffine(result);
                        const expected = data.testdata.sums[idx - 1];
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                    }
                });

                it('should successfully add points with the point at identity.', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        const result = await curve._add(randPoint, [ZERO, ZERO, ZERO]);
                        const expected = randPoint;
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                        assert(result[2].eq(expected[2]));
                    }
                });

                it('should successfully add the point at infinity with a point.', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        const result = await curve._add([ZERO, ZERO, ZERO], randPoint);
                        const expected = randPoint;
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                        assert(result[2].eq(expected[2]));
                    }
                });

                it('should verify that addition is commutative for a set of points', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        let result = await curve._add(randPoint, data.testdata.randomPoints[idx - 1]);
                        result = await curve.toAffine(result);
                        let result2 = await curve._add(data.testdata.randomPoints[idx - 1], randPoint);
                        result2 = await curve.toAffine(result2);
                        assert(result[0].eq(result2[0]));
                        assert(result[1].eq(result2[1]));
                    }
                });

            });

            describe('#addMixed()', function () {

                it('should add a set of points successfully', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        const P2 = data.testdata.randomPoints[idx - 1];
                        let result = await curve._addMixed(randPoint, [P2[0], P2[1]]);
                        result = await curve.toAffine(result);
                        const expected = data.testdata.sums[idx - 1];
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                    }
                });

                it('should successfully add points with the point at identity.', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        const result = await curve._addMixed(randPoint, [ZERO, ZERO]);
                        const expected = randPoint;
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                    }
                });

                it('should successfully add the point at infinity with a point.', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        const P2 = data.testdata.randomPoints[idx];
                        const result = await curve._addMixed([ZERO, ZERO, ZERO], [P2[0], P2[1]]);
                        const expected = randPoint;
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                    }
                });

                it('should verify that addition is commutative for a set of points', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        let P2 = data.testdata.randomPoints[idx - 1];
                        let result = await curve._addMixed(randPoint, [P2[0], P2[1]]);
                        result = await curve.toAffine(result);
                        P2 = data.testdata.randomPoints[idx];
                        let result2 = await curve._addMixed(data.testdata.randomPoints[idx - 1], [P2[0], P2[1]]);
                        result2 = await curve.toAffine(result2);
                        assert(result[0].eq(result2[0]));
                        assert(result[1].eq(result2[1]));
                    }
                });

            });

            describe('#double()', function () {

                it('should double a set of points successfully', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        let result = await curve._double(randPoint);
                        result = await curve.toAffine(result);
                        const expected = data.testdata.doubles[idx];
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                    }
                });

                it('should verify that doubling is the same as addition with itself for a set of points', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const randPoint = data.testdata.randomPoints[idx];
                        let result = await curve._double(randPoint);
                        result = await curve.toAffine(result);
                        let result2 = await curve._add(randPoint, randPoint);
                        result2 = await curve.toAffine(result2);
                        assert(result[0].eq(result2[0]));
                        assert(result[1].eq(result2[1]));
                    }
                });

                it('should verify that doubling the point at infinity yields the point at infinity', async () => {
                    const result = await curve._double([ZERO, ZERO, ZERO]);
                    const infinityPoint = await curve.getPointOfInfinity();
                    assert(result[0].eq(infinityPoint[0]));
                    assert(result[1].eq(infinityPoint[1]));
                    assert(result[2].eq(infinityPoint[2]));
                });

            });

            describe('#mul()', function () {

                it('should multiply a set of points with random integers successfully', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const scalar = data.testdata.randomInts[idx];
                        const randPoint = data.testdata.randomPoints[idx];
                        let result = await curve._mul(scalar, randPoint);
                        result = await curve.toAffine(result);
                        const expected = data.testdata.products[idx];
                        assert(result[0].eq(expected[0]));
                        assert(result[1].eq(expected[1]));
                    }
                });

                it('should verify that multiplying by 2 is the same as addition with itself', async () => {
                    for (let idx = 0; idx < data.testdata.randomPoints.length; idx++) {
                        if (idx === 0) {
                            continue;
                        }
                        const scalar = new BN(2);
                        const randPoint = data.testdata.randomPoints[idx];
                        let result = await curve._mul([scalar], randPoint);
                        result = await curve.toAffine(result);
                        let result2 = await curve._add(randPoint, randPoint);
                        result2 = await curve.toAffine(result2);
                        assert(result[0].eq(result2[0]));
                        assert(result[1].eq(result2[1]));
                    }
                });

                it('should verify that multiplying a point with 0 yields the point at infinity', async () => {
                    var P = data.testdata.randomPoints[0];
                    const result = await curve._mul(0, P);
                    const infinityPoint = await curve.getPointOfInfinity();
                    assert(result[0].eq(infinityPoint[0]));
                    assert(result[1].eq(infinityPoint[1]));
                    assert(result[2].eq(infinityPoint[2]));
                });

            });

        });

    });
});

function addJacobian(point1, point2, modulus) {
    const red = BN.red(modulus);
    const P = point1
    .map(el => {
        return new BN(el.substr(2), 16)
    })
    .map(el => {return el.toRed(red)})
    const Q = point2
    .map(el => {
        return new BN(el.substr(2), 16)
    })
    .map(el => {return el.toRed(red)})
    const zs = [0,0,0,0];
    zs[0] = P[2].redMul(P[2])
    zs[1] = P[2].redMul(zs[0])
    zs[2] = Q[2].redMul(Q[2])
    zs[3] = Q[2].redMul(zs[2])
    const us = [0,0,0,0];
    us[0] = P[0].redMul(zs[2])
    us[1] = P[1].redMul(zs[3])
    us[2] = Q[0].redMul(zs[0])
    us[3] = Q[1].redMul(zs[1])
    if (us[0].cmp(us[2]) === 0) {
        if (us[1].cmp(us[3]) !== 0)
            return;
        else {
            return;
        }
    }
    const H = us[2].redSub(us[0])
    const R = us[3].redSub(us[1])
    let TWO = new BN(2)
    TWO = TWO.toRed(red);
    const X3 = R.redMul(R).redSub( H.redMul(H).redMul(H)).redSub( TWO.redMul(us[0]).redMul(H).redMul(H) )
    const Y3 = R.redMul( us[0].redMul(H).redMul(H).redSub(X3) ).redSub( (us[1].redMul(H).redMul(H).redMul(H)) )
    const Z3 = H.redMul(P[2]).redMul(Q[2])
    const RES = [X3, Y3, Z3];
    return RES.map(el => {return el.fromRed()})
}