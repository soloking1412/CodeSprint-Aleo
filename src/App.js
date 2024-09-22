import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";

const App = () => {
  const { connected, publicKey } = useWallet();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [proposalId, setProposalId] = useState("");
  const [owner, setOwner] = useState("");
  const [nonce, setNonce] = useState("");
  const [message, setMessage] = useState("");
  const [proposals, setProposals] = useState([]);

  const apiUrl = 'http://localhost:3000'; // Your backend URL

  // Fetch all proposals on page load
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch(`${apiUrl}/proposals`);
      const data = await response.json();
      setProposals(data.proposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  // Propose a new ballot
  const propose = async () => {
    try {
      const response = await fetch(`${apiUrl}/propose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();
      setMessage(result.message);
      fetchProposals(); // Refresh proposal list after new proposal
    } catch (error) {
      console.error("Error proposing:", error);
    }
  };

  // Issue a ticket for the proposal
  const issueTicket = async (proposalId, owner) => {
    try {
      const response = await fetch(`${apiUrl}/issueTicket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, owner }),
      });
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error("Error issuing ticket:", error);
    }
  };

  // Cast a vote (yes/no)
  const vote = async (proposalId, voteType, owner, nonce) => {
    try {
      const response = await fetch(`${apiUrl}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pid: proposalId, owner, nonce, voteType }),
      });
      const result = await response.json();
      setMessage(result.message);
      fetchProposals(); // Refresh proposal list after voting
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <WalletMultiButton /> {/* Button to open wallet modal */}
      </div>
      <div className="container max-w-lg mx-auto p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Aleo Voting System</h1>

        {/* Propose Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Propose a New Ballot</h2>
          <input
            type="text"
            className="w-full p-2 border mb-4"
            placeholder="Proposal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 border mb-4"
            placeholder="Proposal Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={propose}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Propose
          </button>
        </div>

        {/* Proposals List Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">All Proposals</h2>
          {proposals.length === 0 ? (
            <p className="text-center">No proposals available.</p>
          ) : (
            proposals.map((proposal, index) => (
              <div key={index} className="border p-4 mb-4 rounded-md bg-gray-50">
                <h3 className="font-semibold">Proposal {index + 1}</h3>
                <p><strong>Title:</strong> {proposal.title}</p>
                <p><strong>Content:</strong> {proposal.content}</p>
                <p><strong>Votes Yes:</strong> {proposal.votesYes}</p>
                <p><strong>Votes No:</strong> {proposal.votesNo}</p>

                {/* Issue Ticket Button */}
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full p-2 border mb-2"
                    placeholder="Your Wallet Address"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  />
                  <button
                    onClick={() => issueTicket(proposal.id, owner)}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    Issue Ticket
                  </button>
                </div>

                {/* Vote Section */}
                <div className="mt-4">
                  <input
                    type="text"
                    className="w-full p-2 border mb-2"
                    placeholder="Nonce (Public)"
                    value={nonce}
                    onChange={(e) => setNonce(e.target.value)}
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={() => vote(proposal.id, "yes", owner, nonce)}
                      className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                    >
                      Vote Yes
                    </button>
                    <button
                      onClick={() => vote(proposal.id, "no", owner, nonce)}
                      className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
                    >
                      Vote No
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-6 p-4 bg-gray-200 text-center rounded-md">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
