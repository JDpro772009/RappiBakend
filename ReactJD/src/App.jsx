
// // // 1. **Consumir la API de agentes de Valorant:**
// // //    - Usa `fetch` para obtener los datos de la API de Valorant y muestra todos los agentes en la interfaz.
// // //    https://valorant-api.com/v1/agents?isPlarayable=true
// // // 2. **Filtro por texto y por rol:**
// // //    - Implementa un campo de búsqueda por texto que permita filtrar los agentes por su nombre.
// // //    - Añade un filtro por rol que permita ver solo los agentes de un rol específico.
// // // Nota. Los filtros deben trabajar en conjunto.
// // // 3. **Agregar agentes al equipo:**
// // //    - Crea una funcionalidad que permita agregar agentes a un equipo con un límite máximo de 5 agentes. Debes mostrar un mensaje al usuario cuando este limite se ha alcanzado. 
// // // 4. **Modal para ver los agentes del equipo:**
// // //    - Implementa un modal que muestre los agentes seleccionados para el equipo.
// // // 5. **Mensajes:**
// // //    - Muestra un mensaje de "No se encontraron agentes que coincidan con la búsqueda" si los filtros no devuelven ningún resultado.
// // //    - Muestra un mensaje de "Cargando..." mientras se espera la respuesta de la API.
// // // ### **Bonus:**
// // // 6. **Paginación:**
// // //    - Implementa un sistema de paginación que muestre un máximo de 6 agentes por página. Debe coexistir con las funcionalidades anteriores.

import './App.css'
import { useEffect, useState } from "react";

function App() {
  const [texto, setTexto] = useState("");

  const [cartaAgregada, setCartaAgregada] = useState({});

  const [agentesValorant, setAgentesValorant] = useState([]);
  const [checkBox, setCheckBox] = useState(false);
  const [select, setSelect] = useState([]);
  let equipoLocal=JSON.parse(localStorage.getItem("equipo")||"[]")
  
  console.log(equipoLocal);
  
  
  const [cartaEquipo, setCartaEquipo] = useState(equipoLocal);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto,setModalAbierto]=useState(true)

  useEffect(() => {
    setCargando(true);
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then((val) => val.json())
      .then((data) => {
        setAgentesValorant(data.data || []);
        setCargando(false);
      });
  }, []);

  function cambioTexto(valor) {
    setTexto(valor);
  }

  function cambioCheck(valor, categ) {
    if (valor) {
      setSelect([...select, categ]);
    } else {
      setSelect(select.filter(c => c !== categ));
    }
    setCheckBox(valor);
  }

  function agregarAlEquipo(carta) {
    console.log(cartaEquipo);
    
    if (cartaEquipo.length < 5) {
      if (!cartaEquipo.some(agente => agente.uuid === carta.uuid)) {
        const nuevoEquipo = [...cartaEquipo, carta];
        setCartaEquipo(nuevoEquipo);
        localStorage.setItem("equipo", JSON.stringify(nuevoEquipo));

        setCartaAgregada(prev => ({ ...prev, [carta.uuid]: true }));
      }
    } else {
      alert("No puedes colocar mas de 5 agentes en tu equipo");
    }
  }
    
  

  function eliminarDelEquipo(carta) {
    setCartaEquipo([]);
    localStorage.removeItem("equipo");
    
  }
  return (
    <>
      <h1 className='text-3xl'>Agentes <span className='text-red-600'>Valorant</span></h1>
      <nav>
        <BarraBusqueda texto={texto} cambioTexto={cambioTexto} datos={agentesValorant} cambioCheck={cambioCheck}></BarraBusqueda>
      </nav>

      {cargando ? (
        <p className='cargando'>Cargando...</p>
      ) : (
        <ColocarCards
          Datos={agentesValorant}
          texto={texto}
          checkBox={checkBox}
          select={select}
          agregarAlEquipo={agregarAlEquipo}
          cartaAgregada={{cartaAgregada}}
        />
      )}

      <CajaEquipo equipo={cartaEquipo} eliminarDelEquipo={eliminarDelEquipo} setModalAbierto={setModalAbierto} modalAbierto={modalAbierto}/>

     
    
    </>
  );
}
function CajaEquipo({ equipo, eliminarDelEquipo, setModalAbierto, modalAbierto }) {
  
  let clases = modalAbierto ? "cajaEquipo abierto" : "cajaEquipo";
  
  return (
    <>
      <div className={clases}>
        <div className='cajaEl'>
          <p className='tituloEquipo'>Equipo</p>
          <button className='eliminarEquipo' onClick={() => eliminarDelEquipo(equipo)}>🗑️</button>
        </div>
        
        <div className='personajes'>
          {equipo.length == 0 ? ( 
            <p className='text-gray-200'>No hay agentes en el equipo.</p>
          ) : (
            equipo.map((agente) => (
              <div className='carta' key={agente.uuid}>
                <img src={agente.displayIcon} alt={agente.displayName} />
                <h1 className='text-gray-200'>{agente.displayName}</h1>
              </div>
            ))
          )}
        </div>
        <button className='desplazar' onClick={() => setModalAbierto(!modalAbierto)}>⮞</button>
      </div>
    </>
  );
}

function ColocarCards({ Datos, texto, checkBox, select, agregarAlEquipo,cartaAgregada }) {
  let datosFilt = Datos.filter((e) => {
    let filtradoPorNombre = e.displayName.toLowerCase().includes(texto.toLowerCase());
    let filtradoPorRol = select.length === 0 || select.includes(e.role?.displayName);
    return filtradoPorNombre && filtradoPorRol;
  });

  return (
    <div className='caja'>
      {datosFilt.length>0?datosFilt.map((c) => (
        <Cartas key={c.uuid} titulo={c.displayName} imagen={c.displayIcon} agregarAlEquipo={agregarAlEquipo} cart={c} cartaAgregada={cartaAgregada}></Cartas>
      )):<h1 className='cargando'>No se encontraron resultados...</h1>}
    </div>
  );
}

function BarraBusqueda({ texto, cambioTexto, datos, cambioCheck }) {
  let arrCatg = [];
  datos.forEach((e) => {
    if (e.role != null) {
      arrCatg.includes(e.role.displayName) || arrCatg.push(e.role.displayName);
    }
  });

  return (
    <>
      <div className='container'>
        <input type="text" placeholder='Busca algunos agentes...' value={texto} onChange={(e) => cambioTexto(e.target.value)} />
        <button>🔎</button>
      </div>
      <h6>Categorias:</h6>
      <div className='cajaCategorias'>
        {arrCatg.map((c) => (
          <CrearCheck key={c} categoria={c} cambioCheck={cambioCheck}></CrearCheck>
        ))}
      </div>
    </>
  );
}

function CrearCheck({ categoria, cambioCheck }) {
  return (
    <>
      <div className='categoria'>
        <label htmlFor={categoria}>{categoria}</label>
        <input type="checkbox" id={categoria} onChange={(e) => cambioCheck(e.target.checked, categoria)} />
      </div>
    </>
  );
}

function Cartas({ titulo, imagen, agregarAlEquipo, cart, cartaAgregada }) {
  const bordeClase = cartaAgregada[cart.uuid] ? 'borde-verde' : '';
  return (
    <>
      <div className={`carta ${bordeClase}`}>
        <div className='equipo' onClick={() => agregarAlEquipo(cart)}>+
        <p className='equipoText'>Agregar al Equipo</p></div>
        <img src={imagen} alt={titulo} />
        <h1>{titulo}</h1>
      </div>
    </>
  );
}
export default App;
