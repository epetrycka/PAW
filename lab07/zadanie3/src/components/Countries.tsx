import "./Countries.css"
import { useState } from 'react'

type CountriesListProps = {
    countries: string[];
    onDelete: (index: number) => void;
}

function CountriesList ({countries, onDelete} : CountriesListProps) {
    if (countries.length > 0) {
        return (
            <>
                {countries.map((country, index) => {
                    let extraClass = "";

                    if (index % 2 === 0 && country.toLocaleLowerCase().includes("a") && country.toLocaleLowerCase().includes("r")) {
                        extraClass = "blue";
                    } 
                    else if (index % 2 === 0 && !country.toLocaleLowerCase().includes("a") && !country.toLocaleLowerCase().includes("r")) {
                        extraClass = "yellow";
                    } 
                    else if (index % 2 !== 0 && country.length > 6) {
                        extraClass = "orange";
                    } 
                    else if (index % 2 !== 0 && country.length < 6) {
                        extraClass = "gray";
                    }

                    return (
                        <div className={`country ${extraClass}`} key={index}>
                            <p>{index}. <a  href={`https://pl.wikipedia.org/wiki/${country}`} 
                                            style={{color: "inherit", textDecoration: "none"}}
                                            target="_blank"
                                            rel="noopener noreferrer">
                            {country}</a></p>
                            <button id="delete" onClick={() => onDelete(index)}>usuń</button>
                        </div>
                    )
                })}
            </>
        )
    }
    else {
        return (
            <div>
                <p>Nie dodano jeszcze żadnych krajów - zacznij dodawać nowe!</p>
            </div>
        )
    }
}

function Countries () {
    const [countries, setCountries] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    function handleDeleteCountry (indexToDelete: number) {
        let modifiedCountries = countries.filter((_, index) => index !== indexToDelete);
        setCountries(modifiedCountries);
    }

    function handleAddCountry() {
        if (inputValue === "") {
            return;
        }

        setCountries([...countries, inputValue]);
        setInputValue('');
    }

    return (
        <>
            <div className="favorite">
                <h2>moje ulubione kraje</h2>
                <hr/>
                <div className="add-country">
                    <input type="text" id="entry"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nazwa kraju"/>
                    <button id="add" 
                        onClick={handleAddCountry}>dodaj kraj</button>
                </div>
                <div className="countries-list">
                    <CountriesList countries={countries} onDelete={handleDeleteCountry}/>
                </div>
            </div>
        </>
    )
}

export default Countries