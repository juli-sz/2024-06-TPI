<script>
  import { onMount } from 'svelte';

let userRole;
let accesoPermitido = false; // Variable para controlar el acceso

onMount(() => {
  userRole = localStorage.getItem('role');

  // Verifica si el usuario tiene el rol adecuado
  if (userRole === 'admin') {
    accesoPermitido = true; // Permite el acceso si es administrador
  } else {
    alert('Acceso denegado. Redirigiendo a la página principal.');
    window.location.href = '/inicio';
  }
});
  import axios from 'axios';

  let nombre = '';
  let apellido = '';
  let dni = '';
  let biografia = '';
  let telefono = '';
  let email = '';
  let imagenPerfil = null;
  let mensaje = '';
  let mostrandoCarga = false;

  // Función para manejar el cambio de archivo
  function handleFileChange(event) {
    imagenPerfil = event.target.files[0];
  }

  // Función para enviar el formulario al backend
  async function enviarFormulario() {
    mostrandoCarga = true;
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('apellido', apellido);
      formData.append('dni', dni);
      formData.append('biografia', biografia);
      formData.append('telefono', telefono);
      formData.append('email', email);
      formData.append('imagenPerfil', imagenPerfil);

      const res = await axios.post('http://2024-06-tpi-production.up.railway.app/api/artistaNuevo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      mensaje = res.data.mensaje || 'Escultor registrado con éxito';
    } catch (error) {
      console.error(error);
      mensaje = 'Error al registrar el escultor. Por favor, intenta de nuevo.';
    } finally {
      mostrandoCarga = false;
    }
  }
</script>
{#if accesoPermitido}

  <!-- Mostrar el ícono de carga mientras se realiza la solicitud -->
  {#if mostrandoCarga}
    <div class="loading-icon"></div>
  {/if}

  <section>
    <h1>Registrar Escultor</h1>
    <form on:submit|preventDefault={enviarFormulario} class="formulario">
      <div class="campo">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" bind:value={nombre} required />
      </div>

      <div class="campo">
        <label for="apellido">Apellido</label>
        <input type="text" id="apellido" bind:value={apellido} required />
      </div>

      <div class="campo">
        <label for="dni">DNI</label>
        <input type="text" id="dni" bind:value={dni} required />
      </div>

      <div class="campo">
        <label for="biografia">Biografía</label>
        <textarea id="biografia" bind:value={biografia} rows="4" required></textarea>
      </div>

      <div class="campo">
        <label for="telefono">Número de Teléfono</label>
        <input type="tel" id="telefono" bind:value={telefono} required />
      </div>

      <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} required />
      </div>

      <div class="campo">
        <label for="imagenPerfil">Imagen de Perfil</label>
        <input type="file" id="imagenPerfil" accept="image/*" on:change={handleFileChange} required />
      </div>

      <button type="submit">Registrar Escultor</button>
    </form>

    <!-- Mostrar el mensaje de éxito o error -->
    {#if mensaje}
      <p class="mensaje">{mensaje}</p>
    {/if}
  </section>
{/if}

<style>
  section {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .formulario {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .campo {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, textarea, button {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }

  .mensaje {
    text-align: center;
    font-size: 16px;
    color: green;
  }

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
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
