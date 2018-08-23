const CurveFactory = artifacts.require("GenericCurveFactory.sol");
const BN = require("bn.js");
const assert = require("assert");
var ZERO = new BN(0);
const utils = require("./utils/utils");

async function createCurve(curveFactory, data, operator) {
    const curve = await utils.createCurve(curveFactory, data, operator);
    const pp = await curve.pp();
    assert(pp.toString(10) === data.fieldSize.toString(10));
    return curve
}

let curves = [
    require('./data/secp256k1'),
];

curves.forEach(function (data) {
    contract('Crypto', function (accounts) {
        let operator = accounts[0];
        let curve;

        describe(data.name + ' Arith', function () {
            before(async () => {
                let curveFactory = await CurveFactory.new({from: operator});
                curve = await createCurve(curveFactory, data, operator);
            });

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