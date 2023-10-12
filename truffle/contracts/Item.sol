pragma solidity ^0.6.0;

import "./ItemManager.sol";

contract Item{
    uint public priceInWei;
    uint public pricePaid;
    uint public index;

    ItemManager parentContract;

    constructor(ItemManager _parentContract, uint _priceInWei, uint _index) public {
        priceInWei = _priceInWei;
        index = _index;
        parentContract = _parentContract;
    }

    receive() external payable{
        require(pricePaid==0, "Item is paid already");
        require(priceInWei==msg.value, "We don't support partial payments");
        pricePaid += msg.value;
        (bool success,)=address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment"));
        require(success, "The contract wasn't successful, cancelling");
    }

    fallback() external{

    }
        
}