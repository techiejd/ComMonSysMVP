const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());

    communityName = "Poblado";
    coinName = "Poblado Coin";
    coinSymbol = "PC";
    registryName = "Poblado Registry";
    registrySymbol = "PR";
    votesName = "Poblado Votes";
    votesSymbol = "PV";
    votesVersion = "v0.1.0";

    amountOfEtherPerPerson = 200000;
    numPeople = 21;
    const sendValue = ethers.utils.parseEther(amountOfEtherPerPerson.toString()).mul(21);

    CommunityCoinFactory = await ethers.getContractFactory("CommunityCoin");
    communityCoin = await CommunityCoinFactory.deploy(coinName, coinSymbol);
    console.log("CommunityCoin address:", communityCoin.address);

    CommunityRegistryFactory = await ethers.getContractFactory("CommunityRegistry");
    communityRegistry = await CommunityRegistryFactory.deploy(registryName, registrySymbol);
    console.log("CommunityRegistry address:", communityRegistry.address);

    CommunityVotesFactory = await ethers.getContractFactory("CommunityVotes");
    communityVotes = await CommunityVotesFactory.deploy(votesName, votesSymbol, votesVersion);
    console.log("CommunityVotes address:", communityVotes.address);

    CommunityOnboardingFactory = await ethers.getContractFactory("CommunityOnboarding");
    communityOnboarding = await CommunityOnboardingFactory.deploy(communityName, communityCoin.address, communityRegistry.address, communityVotes.address, {value: sendValue});
    console.log("CommunityOnboarding address:", communityOnboarding.address);

    await communityOnboarding.deployed();

    
    await communityCoin.grantRole(communityCoin.callStatic.CONVERTER_ROLE(), communityOnboarding.address);
    await communityRegistry.grantRole(communityRegistry.callStatic.REGISTERER_ROLE(), communityOnboarding.address);
    await communityVotes.grantRole(communityVotes.callStatic.GRANTER_ROLE(), communityOnboarding.address);
    
    console.log("CommunityOnboarding has received all necessary roles");

    
    communityOnboarding.grantRole(
      communityOnboarding.callStatic.ONBOARDER_ROLE(), process.env.ONBOARDER);
    console.log("Onboarder granted powers to onboard.");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });