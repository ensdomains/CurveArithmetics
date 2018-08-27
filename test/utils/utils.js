const Curve = artifacts.require("Curve.sol");

createCurve = async function (curveFactory, data, operator) {
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
    return Curve.at(newCurve);
};

module.exports = {
    createCurve: createCurve
};
