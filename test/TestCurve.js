const CurveFactory = artifacts.require("GenericCurveFactory.sol");
const BN = require("bn.js");
const assert = require("assert");
const utils = require("./utils/utils");

let curves = [
    require('./data/prime256v1'),
    require('./data/secp256k1'),
];

curves.forEach(function (data) {
    contract('Curve with ' + data.name, async (accounts) => {
        let curve;

        const operator = accounts[0];

        beforeEach(async () => {
            let curveFactory = await CurveFactory.new({from: operator});
            curve = await utils.createCurve(curveFactory, data, operator);
        });

        // it('should detect that the given points are on the curve', async () => {
        //     try {
        //         for (const point of data.testdata.randomPoints) {
        //             const result = await curve.onCurve(point);
        //             assert(result);
        //         }
        //     } catch (e) {
        //         console.log(e);
        //         throw e;
        //     }
        // });
        //
        // it('should detect that the given points are not on the curve', async () => {
        //     for (const point of data.testdata.randomPoints) {
        //         try {
        //             const result = await curve.onCurve([point[0], point[0]]);
        //             assert(!result);
        //         }
        //         catch (e) {
        //             console.log(e);
        //             throw e
        //         }
        //     }
        // });
        //
        // it('should detect that the given points are valid public keys', async () => {
        //     try {
        //         for (const point of data.testdata.randomPoints) {
        //             const result = await curve.isPubKey(point);
        //             assert(result);
        //         }
        //     } catch (e) {
        //         console.log(e);
        //         throw e;
        //     }
        // });
        //
        // it('should detect that the given points are not valid public keys', async () => {
        //     for (const point of data.testdata.randomPoints) {
        //         try {
        //             const result = await curve.isPubKey([point[0], point[0]]);
        //             assert(!result);
        //         }
        //         catch (e) {
        //             console.log(e);
        //             throw e
        //         }
        //     }
        // });

        // it('should detect that the given signatures are valid', async () => {
        //     // return
        //     const message = data.testdata.message;
        //     try {
        //         for (const idx in data.testdata.keypairs) {
        //             const keypair = data.testdata.keypairs[idx];
        //             const signature = data.testdata.signatures[idx];
        //             const result = await curve.validateSignature(message, signature, keypair.pub);
        //             assert(result);
        //         }
        //     } catch (e) {
        //         console.log(e);
        //         throw e;
        //     }
        // });

        // it('should detect that the public key does not correspond to the given signature', async () => {
        //     // return
        //     const message = data.testdata.message;
        //     try {
        //         for (const idx in data.testdata.keypairs) {
        //             const keypair = data.testdata.keypairs[idx];
        //             const signature = data.testdata.signatures[data.testdata.length - idx];
        //             const result = await curve.validateSignature(message, signature, keypair.pub);
        //             assert(!result);
        //         }
        //     } catch (e) {
        //         console.log(e);
        //         throw e;
        //     }
        // });

        it('should detect that the given signatures and pubkeys are wrong for the given message', async () => {
            // return
            const message = "0x1234123412341234123412341234123412341234123412341234123412341234";
            try {
                for (const idx in data.testdata.keypairs) {
                    const keypair = data.testdata.keypairs[idx];
                    const signature = data.testdata.signatures[idx];
                    const result = await curve.validateSignature(message, signature, keypair.pub);
                    assert(!result);
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });

        it('should compress a set of points successfully', async () => {
            try {
                for (const keypair of data.testdata.keypairs) {
                    const result = await curve.compress(keypair.pub);
                    const x = new BN(keypair.pub[0].substring(2), 16);
                    const yBit = (new BN(keypair.pub[1].substring(2), 16)).mod(new BN(2));
                    assert(yBit.eq(new BN(result[0].toString(10))));
                    assert(x.eq(new BN(result[1].toString(10))));
                }
            } catch (e) {
                console.log(e);
                throw e;
            }
        });

        // it('should decompress a set of points successfully', async () => {
        //     try {
        //         for (const keypair of data.testdata.keypairs) {
        //             const x = new BN(keypair.pub[0].substring(2), 16);
        //             const y = new BN(keypair.pub[1].substring(2), 16);
        //             const yBit = y.mod(new BN(2));
        //             const result = await curve.decompress([yBit], [x]);
        //             assert(x.eq(new BN(result[0].toString(10))));
        //             assert(y.eq(new BN(result[1].toString(10))));
        //         }
        //     } catch (e) {
        //         console.log(e);
        //         throw e;
        //     }
        // });
    })
});
