import { useState, useMemo, type FormEvent, type ChangeEvent } from 'react';
import './App.css';
import type { Dish } from './Types';
import initialDishes from './dishes.json';

interface SummaryProps {
  count: number;
}

const Summary = ({ count }: SummaryProps) => {
  return (
    <div className="summary-box">
      Wyświetlane potrawy: {count}
    </div>
  );
};

interface AddDishFormProps {
  onAdd: (dish: Dish) => void;
  onCancel: () => void;
}

const AddDishForm = ({ onAdd, onCancel }: AddDishFormProps) => {
  const [formData, setFormData] = useState<Omit<Dish, 'id'>>({
    name: '',
    type: 'Danie główne',
    cuisine: '',
    diet: 'Mięsna',
    calories: 0,
    ingredients: ''
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.cuisine.trim()) {
      setError("Nazwa i kuchnia są wymagane.");
      return;
    }
    if (Number(formData.calories) <= 0) {
      setError("Kaloryczność musi być większa od 0.");
      return;
    }

    const newDish: Dish = {
      ...formData,
      id: Date.now(),
      calories: Number(formData.calories)
    };

    onAdd(newDish);
  };

  return (
    <div className="panel">
      <h2>Dodaj nową potrawę</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nazwa potrawy" value={formData.name} onChange={handleChange} />
        
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Zupa">Zupa</option>
          <option value="Danie główne">Danie główne</option>
          <option value="Przekąska">Przekąska</option>
        </select>

        <input name="cuisine" placeholder="Kuchnia (np. Włoska)" value={formData.cuisine} onChange={handleChange} />
        
        <select name="diet" value={formData.diet} onChange={handleChange}>
          <option value="Mięsna">Mięsna</option>
          <option value="Wegańska">Wegańska</option>
          <option value="Wegetariańska">Wegetariańska</option>
        </select>

        <input type="number" name="calories" placeholder="Kcal (100g)" value={formData.calories} onChange={handleChange} />
        <textarea name="ingredients" placeholder="Składniki (oddzielone przecinkami)" value={formData.ingredients} onChange={handleChange} />

        <div className="actions">
          <button type="submit" className="btn-primary">Zapisz</button>
          <button type="button" onClick={onCancel} className="btn-delete" style={{background:'#ccc'}}>Anuluj</button>
        </div>
      </form>
    </div>
  );
};

interface DishDetailsProps {
  dish: Dish;
  onBack: () => void;
}

const DishDetails = ({ dish, onBack }: DishDetailsProps) => {
  return (
    <div className="panel">
      <button onClick={onBack} className="btn-primary" style={{marginBottom: '20px'}}> &larr; Powrót</button>
      <h2>{dish.name}</h2>
      <p><strong>Typ:</strong> {dish.type}</p>
      <p><strong>Kuchnia:</strong> {dish.cuisine}</p>
      <p><strong>Dieta:</strong> {dish.diet}</p>
      <p><strong>Kalorie:</strong> {dish.calories} kcal / 100g</p>
      <p><strong>Składniki:</strong> {dish.ingredients}</p>
    </div>
  );
};

function App() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'details'>('list');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');

  const displayedDishes = useMemo(() => {
    return dishes.filter(dish => 
      dish.cuisine.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [dishes, filterQuery]);

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      if (favorites.length >= 4) {
        alert("Możesz mieć maksymalnie 4 ulubione potrawy!");
        return;
      }
      setFavorites([...favorites, id]);
    }
  };

  const deleteDish = (id: number) => {
    if(confirm("Czy na pewno chcesz usunąć tę potrawę?")) {
      setDishes(dishes.filter(d => d.id !== id));
      setFavorites(favorites.filter(favId => favId !== id));
    }
  };

  const handleAddDish = (newDish: Dish) => {
    setDishes([...dishes, newDish]);
    setCurrentView('list');
  };

  const handleShowDetails = (dish: Dish) => {
    setSelectedDish(dish);
    setCurrentView('details');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Manager Potraw</h1>
        <Summary count={displayedDishes.length} />
      </header>

      {currentView === 'list' && (
        <>
          <div className="controls">
            <input 
              className="search-input"
              type="text" 
              placeholder="Filtruj po kuchni (np. Polska)..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            <button className="btn-primary" onClick={() => setCurrentView('add')}>
              + Dodaj Potrawę
            </button>
          </div>

          <div className="dish-list">
            {displayedDishes.map(dish => (
              <div key={dish.id} className={`dish-card ${favorites.includes(dish.id) ? 'favorite' : ''}`}>
                <div className="dish-info" onClick={() => handleShowDetails(dish)}>
                  <h3>{dish.name}</h3>
                  <small>{dish.cuisine} | {dish.type}</small>
                </div>
                <div className="actions">
                  <button 
                    onClick={() => toggleFavorite(dish.id)} 
                    className={`btn-fav ${favorites.includes(dish.id) ? 'active' : ''}`}
                    title="Dodaj do ulubionych"
                  >
                    ★
                  </button>
                  <button onClick={() => deleteDish(dish.id)} className="btn-delete">
                    Usuń
                  </button>
                </div>
              </div>
            ))}
            {displayedDishes.length === 0 && <p>Brak potraw spełniających kryteria.</p>}
          </div>
        </>
      )}

      {currentView === 'add' && (
        <AddDishForm onAdd={handleAddDish} onCancel={() => setCurrentView('list')} />
      )}

      {currentView === 'details' && selectedDish && (
        <DishDetails dish={selectedDish} onBack={() => setCurrentView('list')} />
      )}
    </div>
  );
}

export default App;