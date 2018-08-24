pragma solidity ^0.4.23;

interface CurveInterface {
    function getOrder() external view returns(uint order);
    function validateSignature(bytes32 message, uint[2] rs, uint[2] Q) external view returns (bool);
    function computePublicKey(uint priv) external view returns(uint[2] Q);
}