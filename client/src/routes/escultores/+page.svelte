<script>
  import { onMount } from "svelte";
  import axios from "axios";

  let searchQuery = ""; // Valor de la búsqueda
  let criterio = "promedio"; // Criterio de ordenamiento
  let orden = "DESC"; // Ordenamiento ascendente o descendente
  /**
   * @type {any[]}
   */
  let cards = []; // Resultado de las esculturas
  let animate = false; // Control de animación
  let currentPage = 1; // Página actual
  let itemsPerPage = 20; // Cantidad de cartas por página
  let totalPages = 0; // Total de páginas
  
  // Función para realizar la búsqueda
  async function fetchEscultores(query = "", criterio = "promedio", orden = "DESC") {
    mostrandoCarga = true;
    try {
      const res = await axios.get(`http://2024-06-tpi-production.up.railway.app/api/escultores`, {
        params: {
          search: query,
          sortBy: criterio,
          order: orden
        }
      });
      cards = res.data;
      currentPage = 1;
      totalPages = Math.ceil(cards.length / itemsPerPage);

      // Reinicia y activa la animación para las nuevas tarjetas
      animate = false;
      setTimeout(() => {
        animate = true;
      }, 0);
    } catch (error) {
      console.log(error);
    }
    mostrandoCarga = false;
  }

  // Ejecutar la consulta inicial cuando se monta la página
  onMount(() => {
    fetchEscultores(); // Sin query al principio
  });

  // Calcula las cartas a mostrar en la página actual
  $: displayedCards = cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Cambia de página
  /**
   * @param {number} page
   */
  function changePage(page) {
    currentPage = page;
    window.scrollTo(0, 0); // Desplaza hacia arriba
    animate = false; // Reinicia la animación
    setTimeout(() => {
      animate = true;
    }, 0);
  }

  export let mostrandoCarga = false;
</script>

<!-- Mostrar el ícono de carga solo cuando mostrandoCarga es true -->
{#if mostrandoCarga}
    <div class="loading-icon"></div>
{/if}

<div class="search-container">
  <input
    type="text"
    class="search-input"
    bind:value="{searchQuery}"
    placeholder="Buscar artista..."
  />

  <!-- Lista desplegable para el criterio de orden -->
  <select class="search-select" bind:value="{criterio}">
    <option value="promedio">Mejores artistas</option>
    <option value="nombre">Nombre</option>
  </select>

  <!-- Lista desplegable para el orden ascendente/descendente -->
  <select class="search-select" bind:value="{orden}">
    <option value="DESC">Descendente</option>
    <option value="ASC">Ascendente</option>
  </select>

  <button class="search-button" on:click="{() => fetchEscultores(searchQuery, criterio, orden)}">Buscar</button>
</div>

<!-- Contenedor de las cards -->
<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 auto-rows-auto">
  {#each displayedCards as card}
    <div class="block rounded-lg bg-white shadow-secondary-1 m-2.5 border-2 border-gray-300 rounded-md {animate ? 'animate' : ''}">
      <div class="relative overflow-hidden bg-cover bg-no-repeat">
        <a href={`/escultores/${encodeURIComponent(card.escultorPantalla)}`}>
          <img
            src={card.escultorFoto}
            class="w-40 rounded-full mx-auto pt-2"
            alt="Avatar" />
          <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
        </a>    
      </div>
      <div class="p-6 text-surface dark:text-white">
        <h5 class="mb-2 text-xl font-medium leading-tight text-black">
          {card.escultorName}
        </h5>
        <p class="mb-4 text-base text-left text-black">{card.content}</p>
        <div class="stars">
            {#each Array(5) as _, index}
                {#if index < Math.floor(card.promedio)} <!-- Estrella completa -->
                    <span class="star filled">★</span>
                {:else if index < card.promedio} <!-- Media estrella -->
                    <span class="star half-filled">★</span>
                {:else} <!-- Estrella vacía -->
                    <span class="star">★</span>
                {/if}
            {/each}
        </div>
        <!-- Nuevo bloque para el contacto -->
        <p class="text-sm text-left text-gray-600">
          Contacto: <a href="mailto:{card.contactoEmail}" class="text-blue-600 hover:underline">{card.contactoEmail}</a>
        </p>
      </div>
    </div>
  {/each}
</div>

<!-- Controles de paginación -->
<div class="pagination">
  {#each Array(totalPages) as _, index}
    <button class="page-button" on:click="{() => changePage(index + 1)}">
      {index + 1}
    </button>
  {/each}
</div>

<style>
    .stars {
        margin-top: 8px; /* Espaciado superior */
    }

    .star {
        font-size: 20px; /* Tamaño de las estrellas */
        color: lightgray; /* Color por defecto de las estrellas */
        margin-right: 2px; /* Espaciado entre las estrellas */
        transition: color 0.3s; /* Transición para el color */
    }

    .star.filled {
        color: gold; /* Color de las estrellas llenas */
    }

    .star.half-filled {
        background: linear-gradient(90deg, gold 50%, lightgray 50%); /* Gradiente para media estrella */
        background-clip: text;
        -webkit-background-clip: text; /* Clip para texto en navegadores WebKit */
        color: transparent; /* Oculta el color base */
        display: inline-block; /* Necesario para el fondo */
        width: 20px; /* Ancho para media estrella */
        text-align: center; /* Centra el texto */
    }
  /* Estilos para el ícono de carga */
    .loading-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      border: 6px solid #f3f3f3;
      border-top: 6px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      z-index: 1000;
    }

    /* Animación de giro */
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate {
    animation: fadeIn 0.5s ease forwards;
  }

  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  .search-input {
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 16px;
    width: 250px;
    transition: border-color 0.3s;
  }

  .search-input:focus {
    border-color: #000000;
    outline: none;
  }

  .search-button {
        padding: 10px 15px; /* Espaciado interno */
        background-color: #000000; /* Color de fondo del botón */
        color: white; /* Color del texto */
        border: none; /* Sin borde */
        border-radius: 5px; /* Esquinas redondeadas */
        cursor: pointer; /* Cambia el cursor al pasar el mouse */
        font-size: 16px; /* Tamaño de la fuente */
        transition: background-color 0.3s; /* Transición para el color de fondo */
    }

    .search-button:hover {
        background-color: #525252; /* Color de fondo al pasar el mouse */
    }

  .search-select {
    padding: 10px 15px;
    background-color: #f4f4f4;
    border: 2px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 16px;
    transition: border-color 0.3s;
    cursor: pointer;
  }

  .search-select:hover {
    border-color: #86512c;
  }

  .search-select:focus {
    outline: none;
    border-color: #86512c;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .page-button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0 5px;
    cursor: pointer;
    background-color: #f4f4f4;
    transition: background-color 0.3s;
  }

  .page-button:hover {
    background-color: #d1d1d1;
  }
</style>
