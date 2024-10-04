# RappiBakend
// import './App.css'

// function App() {


//   return (
//     <>
//       <h1>Hola</h1>
//       <h4>Soun un h4 en react</h4>
//       <Color></Color>
//       {/*estos son props. lo guarda en un objeto el cual recibira el parametro de la funcion, este debe tener dependiendo de la situacion
//       un prop llamado key para qcuando se este trabajando una pagina la cual realiza varios ciclos haiendo lo mismo ya asi sea, creando cartas, recorrer una API 
//       etc, lo idenifique, y cuando queramos renderizar una carta en especifico React identifica la key y hace que
//        no se renderize todo el componente o la pagina, solo el objeto con la key asignada */}
//       <Aparecer key={"n1"} nombre="Jose" edad="15"></Aparecer> 
//     </>
//   )
// }
// //Creando un componente
// function CambiarColor(){
//   console.log("Presionaste el boton")
// }
// function Color(){
 
//   return (
//     <>
//     <h2>mira la consola si presionas el boton</h2>
//     <button className='bg-slate-700' onClick={CambiarColor}>Cambiar</button>
//     </>
//   )
// }

// let palabra = "Hola"

// function Palb(){
//   return (
//     <>
//     <h2> {palabra} jose</h2>
//     </>

//   )
// }
// function Aparecer(props){
//   return(
// <>
//     {/* <Palb></Palb>
//     <button className='boton' onClick={()=>{
//       palabra=="Hola"?palabra="Adios":palabra="Hola"
//       console.log(palabra);
//       }  }>Cambiar2</button> */}

//       <h3>hola {props.nombre} tienes {props.edad} años verdad?</h3>
//     </>)
// }
// export default App
import { useState } from "react";
import "./App.css";

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductTable({ products, filterText, isChecked }) {
  let productsByCategory = {};

  
  let productsFiltered = products.slice();
  productsFiltered = productsFiltered.filter((p) => {
    let includesText =
      p.name.toLowerCase().includes(filterText.toLowerCase()) || 
      p.category.toLowerCase().includes(filterText.toLowerCase());
    let isInStock = isChecked ? p.stocked : p;
    return includesText && isInStock;
  });
  products = productsFiltered;

  products.forEach((p) => {
    const category = p.category;

    if (!productsByCategory[category])
      productsByCategory[category] = [
        <ProductCategoryRow key={category} category={category} />,
      ];

    productsByCategory[category].push(<ProductRow key={p.name} product={p} />);
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>{Object.values(productsByCategory)}</tbody>
    </table>
  );
}

function SearchBar({filterText, isChecked,  handleSearchOnChange,  handleCheckOnChange,}) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearchOnChange(e.target.value)}
        value={filterText}
      />
      <label>
        <input
          type="checkbox"
          onChange={(e) => handleCheckOnChange(e.target.checked)}
          checked={isChecked}
        />
        Mostrar solo productos en stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState(""); //Use state nos permite hacer renderizaciones directas en el DOM, 
  //se necesita la variable a cambiar y una funcion que nos permita renderizar la variable directamente
  const [isChecked, setIsChecked] = useState(false);

  
  function handleSearchOnChange(value) {
    setFilterText(value);//aqui es como dijeramos filterText=value
    //setFilterText((c)=>c=value) otra forma de guia de como hacerlo tambien

    console.log(filterText);

  }

  function handleCheckOnChange(value) {    
    setIsChecked(value);
  }

  return (
    <div>
      <SearchBar
        filterText={filterText}
        isChecked={isChecked}
        handleSearchOnChange={handleSearchOnChange}
        handleCheckOnChange={handleCheckOnChange}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        isChecked={isChecked}
      />
    </div>
  );
}

const PRODUCTS = [
  { category: "Frutas", price: "$1", stocked: true, name: "Manzana" },
  { category: "Frutas", price: "$1", stocked: true, name: "Fruta del dragón" },
  { category: "Frutas", price: "$2", stocked: false, name: "Maracuyá" },
  { category: "Verduras", price: "$2", stocked: true, name: "Espinaca" },
  { category: "Verduras", price: "$4", stocked: false, name: "Calabaza" },
  { category: "Verduras", price: "$1", stocked: true, name: "Guisantes" },
];

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <FilterableProductTable products={PRODUCTS} />
    </>
  );
}