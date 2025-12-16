import './ColorSelector.css'

interface ColorSelectorProps {
    allColors: Array<string>;
    handleChildColor?: (color: string) => void;
}

function ColorSelector({ allColors, handleChildColor } : ColorSelectorProps) {
    return (
        <div className="color-selector">
            <p>Dostępne kolory</p>
            <p className="colors-list">
                {allColors.map((color) => {
                    return (
                        <div>
                            <input type="radio" id={color} name="colors"
                            value={color} onChange={ () =>{
                                if (handleChildColor) {
                                    handleChildColor(color);
                                }
                            }}/> 
                            <label htmlFor={color}>{color}</label>
                        </div>
                    );
                })}
            </p>
        </div>
    )
}

export default ColorSelector