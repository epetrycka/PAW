import { useState } from 'react';
import './App.css';

type DebtMap = { [creditorId: number]: number };

interface Friend {
  id: number;
  name: string;
  avatar: string;
  debts: DebtMap; 
}

interface Pizza {
  id: string;
  name: string;
  price: number;
}

const AVAILABLE_PIZZAS: Pizza[] = [
  { id: 'p1', name: 'Margherita', price: 30 },
  { id: 'p2', name: 'Capriciosa', price: 40 },
  { id: 'p3', name: 'Hawajska', price: 42 },
  { id: 'p4', name: 'Wiejska', price: 45 },
];

function App() {
  const [friends, setFriends] = useState<Friend[]>([
    { id: 1, name: 'Tomek', avatar: 'https://i.pravatar.cc/150?u=1', debts: { 2: 10 } }, 
    { id: 2, name: 'Ania', avatar: 'https://i.pravatar.cc/150?u=2', debts: {} },
    { id: 3, name: 'Marek', avatar: 'https://i.pravatar.cc/150?u=3', debts: { 1: 5 } },
  ]);

  const [newFriendName, setNewFriendName] = useState('');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [participants, setParticipants] = useState<number[]>([]);
  const [payments, setPayments] = useState<{ [key: number]: number }>({});


  const totalPaid = Object.values(payments).reduce((sum, val) => sum + val, 0);
  const missingAmount = selectedPizza ? selectedPizza.price - totalPaid : 0;
  const isReadyToSettle = selectedPizza && participants.length > 0 && missingAmount <= 0.01;

  const getName = (id: number) => friends.find(f => f.id === id)?.name || 'Nieznajomy';


  const addFriend = () => {
    if (!newFriendName.trim()) return;
    const newFriend: Friend = {
      id: Date.now(),
      name: newFriendName,
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      debts: {}
    };
    setFriends([...friends, newFriend]);
    setNewFriendName('');
  };

  const toggleParticipant = (id: number) => {
    if (participants.includes(id)) {
      setParticipants(participants.filter(p => p !== id));
      const newPayments = { ...payments };
      delete newPayments[id];
      setPayments(newPayments);
    } else {
      setParticipants([...participants, id]);
      setPayments({ ...payments, [id]: 0 });
    }
  };

  const handlePaymentChange = (id: number, amount: string) => {
    const value = amount === '' ? 0 : parseFloat(amount);
    setPayments({ ...payments, [id]: isNaN(value) ? 0 : value });
  };

  const settleBill = () => {
    if (!isReadyToSettle || !selectedPizza) return;

    const costPerPerson = selectedPizza.price / participants.length;

    let currentDebtors: { id: number, amount: number }[] = [];
    let currentCreditors: { id: number, amount: number }[] = [];

    participants.forEach(id => {
      const paid = payments[id] || 0;
      const balance = paid - costPerPerson;

      if (balance < -0.01) {
        currentDebtors.push({ id, amount: Math.abs(balance) });
      } else if (balance > 0.01) {
        currentCreditors.push({ id, amount: balance });
      }
    });

    const updatedFriends = [...friends];

    let debtorIdx = 0;
    let creditorIdx = 0;

    while (debtorIdx < currentDebtors.length && creditorIdx < currentCreditors.length) {
      const debtor = currentDebtors[debtorIdx];
      const creditor = currentCreditors[creditorIdx];

      const amountToSettle = Math.min(debtor.amount, creditor.amount);

      const friendIndex = updatedFriends.findIndex(f => f.id === debtor.id);
      if (friendIndex !== -1) {
        const friend = updatedFriends[friendIndex];
        const newDebts = { ...friend.debts };
        
        
        
        const currentDebt = newDebts[creditor.id] || 0;
        newDebts[creditor.id] = currentDebt + amountToSettle;
        
        updatedFriends[friendIndex] = { ...friend, debts: newDebts };
      }

      debtor.amount -= amountToSettle;
      creditor.amount -= amountToSettle;

      if (debtor.amount < 0.01) debtorIdx++;
      if (creditor.amount < 0.01) creditorIdx++;
    }

    setFriends(updatedFriends);
    setParticipants([]);
    setPayments({});
    setSelectedPizza(null);
    alert("Rozliczono! Długi zostały dopisane do listy.");
  };

  return (
    <div className="app-container">
      <h1>Pizza Splitter</h1>
      
      <div className="split-view">
        
        <div className="left-panel">
          <h2>Znajomi i Rozliczenia</h2>
          <div className="friends-list">
            {friends.map(friend => {
              const owedToMe = friends
                .filter(f => f.debts[friend.id] && f.debts[friend.id] > 0.01)
                .map(f => ({ name: f.name, amount: f.debts[friend.id] }));

              const myDebts = Object.entries(friend.debts)
                .filter(([_, amount]) => amount > 0.01)
                .map(([creditorId, amount]) => ({
                  name: getName(Number(creditorId)),
                  amount: amount
                }));

              return (
                <div key={friend.id} className="friend-card">
                  <div className="friend-info">
                    <img src={friend.avatar} alt="avatar" className="avatar" />
                    <div style={{width: '100%'}}>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                         <strong>{friend.name}</strong>
                      </div>

                      {myDebts.length > 0 && (
                        <div className="debt-list negative">
                          <small>Winien:</small>
                          {myDebts.map((d, i) => (
                            <div key={i}>- {d.amount.toFixed(2)} zł dla {d.name}</div>
                          ))}
                        </div>
                      )}

                      {owedToMe.length > 0 && (
                        <div className="debt-list positive">
                          <small>Ma odzyskać:</small>
                          {owedToMe.map((d, i) => (
                            <div key={i}>+ {d.amount.toFixed(2)} zł od {d.name}</div>
                          ))}
                        </div>
                      )}
                      
                      {myDebts.length === 0 && owedToMe.length === 0 && (
                        <small style={{color: '#999'}}>Czyste konto</small>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className="btn-add-order"
                    onClick={() => toggleParticipant(friend.id)}
                    disabled={participants.includes(friend.id)}
                  >
                    {participants.includes(friend.id) ? 'V' : '+'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="add-friend-form">
            <input 
              type="text" 
              placeholder="Imię..." 
              value={newFriendName}
              onChange={e => setNewFriendName(e.target.value)}
            />
            <button onClick={addFriend} className="btn-add-friend">+</button>
          </div>
        </div>

        <div className="right-panel">
          <h2>Nowe Zamówienie</h2>

          <h3>1. Wybierz pizzę</h3>
          <div className="pizza-selector">
            {AVAILABLE_PIZZAS.map(pizza => (
              <div 
                key={pizza.id} 
                className={`pizza-option ${selectedPizza?.id === pizza.id ? 'selected' : ''}`}
                onClick={() => setSelectedPizza(pizza)}
              >
                <strong>{pizza.name}</strong>
                <div>{pizza.price} zł</div>
              </div>
            ))}
          </div>

          <h3>2. Składka</h3>
          <div className="payment-list">
            {participants.map(id => {
              const friend = friends.find(f => f.id === id);
              if (!friend) return null;

              const costPerPerson = selectedPizza ? (selectedPizza.price / participants.length) : 0;

              return (
                <div key={id} className="payment-row">
                  <div className="friend-info">
                    <img src={friend.avatar} className="avatar" style={{width:'30px', height:'30px'}} />
                    <span>{friend.name}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{fontSize: '0.8rem', color: '#666', marginRight: '10px'}}>
                       Należność: {costPerPerson.toFixed(2)} zł
                    </span>

                    <input 
                      type="number" 
                      className="payment-input" 
                      placeholder="0"
                      min="0"
                      value={payments[id] === 0 ? '' : payments[id]} 
                      onChange={(e) => handlePaymentChange(id, e.target.value)}
                    /> zł
                  </div>
                </div>
              );
            })}
          </div>

          {selectedPizza && (
            <div className="summary-section">
               <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span>Cena: <strong>{selectedPizza.price} zł</strong></span>
                  <span style={{color: missingAmount > 0 ? 'red' : 'green'}}>
                    Brakuje: <strong>{missingAmount > 0 ? missingAmount.toFixed(2) : '0.00'} zł</strong>
                  </span>
               </div>
            </div>
          )}

          <button 
            className="btn-primary" 
            onClick={settleBill}
            disabled={!isReadyToSettle}
            style={{ opacity: isReadyToSettle ? 1 : 0.5 }}
          >
            Rozlicz i dopisz długi
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;