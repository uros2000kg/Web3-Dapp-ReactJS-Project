import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';
import ComplaintBookContract from './AppABI.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);
        }
      } catch (error) {
        console.error('Greška prilikom inicijalizacije Web3', error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const initContract = async () => {
      try {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ComplaintBookContract.networks[networkId];
        const instance = new web3.eth.Contract(
          ComplaintBookContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);
      } catch (error) {
        console.error('Greška prilikom inicijalizacije pametnog ugovora', error);
      }
    };

    if (web3) {
      initContract();
    }
  }, [web3]);

  const handleComplaintChange = (event) => {
    setComplaintText(event.target.value);
  };

  const handleSubmitComplaint = async () => {
    try {
      if (!contract) {
        console.error('Pametni ugovor nije inicijaliziran.');
        return;
      }

      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      await contract.methods.submitComplaint(complaintText).send({ from: currentAccount });

      await fetchComplaints();
    } catch (error) {
      console.error('Greška prilikom podnošenja žalbe', error);
    }
  };

  const fetchComplaints = async () => {
    try {
      if (!contract) {
        console.error('Pametni ugovor nije inicijaliziran.');
        return;
      }

      const complaintCount = await contract.methods.complaintCount().call();

      const complaintsArray = [];
      for (let i = 0; i < complaintCount; i++) {
        const complaint = await contract.methods.complaints(i).call();
        complaintsArray.push(complaint);
      }

      setComplaints(complaintsArray);
    } catch (error) {
      console.error('Greška prilikom dohvata žalbi', error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchComplaints();
    }
  }, [contract]);

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  return (
    <div className="App">
      <div className="table-container">
        <h2>Iskustva ostalih:</h2>
        <table className="complaint-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Komentar</th>
              <th>Datum i vreme</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.submitter}</td>
                <td>{complaint.text}</td>
                <td>{formatDate(complaint.submissionTime.toString())}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="complaint-input">
        <h2>Unesite komentar:</h2>
        <textarea
          value={complaintText}
          onChange={handleComplaintChange}
          placeholder="Unesite komentar..."
          className="complaint-textarea"
        />
        <br />
        <button
          onClick={handleSubmitComplaint}
          className="submit-button"
        >
          Ostavi komentar
        </button>
      </div>
    </div>
  );
}

export default App;
