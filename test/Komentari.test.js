const { expect } = require("chai");

describe("Testovi", function () {
  let contract;
  let accounts;

  before(async function () {
    const Contract = await ethers.getContractFactory("ComplaintBook");
    contract = await Contract.deploy();
    await contract.deployed();

    accounts = await ethers.getSigners();
  });

  it("Inicijalizacija pametnog ugovora", async function () {
    
    expect(contract.address).to.not.equal(0);
  });

  it("Podneti zalbu", async function () {
    const complaintText = "Ovo je testna zalba";

    await contract.connect(accounts[0]).submitComplaint(complaintText);

    const complaintCount = await contract.complaintCount();

    expect(complaintCount).to.equal(1);
  });

  it("Ispisivanje zalbe", async function () {
    
    const complaintCount = await contract.complaintCount();

    const complaints = [];
    for (let i = 0; i < complaintCount; i++) {
      const complaint = await contract.complaints(i);
      complaints.push(complaint);
    }

    expect(complaints.length).to.equal(complaintCount);
  });
});
