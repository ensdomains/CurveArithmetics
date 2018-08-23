pragma solidity ^0.4.23;

import {Curve} from "./Curve.sol";
/**
* @title Curve factory
*
* Factory to create curve arithmetics contracts.
*
* Takes curve parameters and produces a new contract.
*
* @author Alexander Vlasov (alex.m.vlasov@gmail.com).
*/

contract GenericCurveFactory {

    address[] public knownCurves;

    event CurveCreated(address indexed newCurve);

    function createCurve(
        uint256 fieldSize,
        uint256 groupOrder,
        uint256 lowSmax,
        uint256 cofactor,
        uint256[2] generator,
        uint256 a,
        uint256 b
    ) public returns (Curve) {
        Curve _curve = new Curve(fieldSize, groupOrder, lowSmax, cofactor, generator, a, b);
        knownCurves.push(_curve);
        emit CurveCreated(_curve);
        return _curve;
    }
}
