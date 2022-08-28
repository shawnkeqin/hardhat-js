//get funds from users
//withdraw funds
//set set a minimum funding value in usd


pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error NotOwner();

contract FundMe {

    uint256 public minimumUsd = 50; 
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders; 

    address public i_owner; //immutable
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18; 

    constructor() {
        i_owner = msg.sender; 
    }

    function fund() public payable{
    
        require(msg.value.getConversionRate() >= MINIMUM_USD, "You need to spend more ETH!");
        addressToAmountFunded[msg.sender] += msg.value; 
        funders.push(msg.sender); 

    }

    function getVersion() public view returns(uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface();
        return priceFeed.version();
    }

    
    modifier onlyOwner {
        if (msg.sender != i_owner) revert NotOwner();
        _; 
    }


    function withdraw(){
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;

        }
        funders = new address[](0);

        //transfer
        // payable(msg.sender).transfer(address(this).balance); 

        //send 
        // bool sendSuccess = payable(msg.sender).send(address(this).balance); 
        // require(sendSuccess, "send failed"); 

        //call 
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed"); 

    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}
