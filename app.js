
/* ESTADO DE LA APLICACION */
let tareas = [
    {
        id: 1,
        titulo: 'Aprender la sintaxis de ES6',
        prioridad: 'Alta',
        completada: true
    },
    {
        id: 2,
        titulo: 'Dominar la asincronía y Fetch',
        prioridad: 'Media',
        completada: false
    },
    {
        id: 3,
        titulo: 'Migrar el proyecto a Angular',
        prioridad: 'Baja',
        completada: false
    }
];

let filtroActual = 'Todas';

/* SELECTORES DEL DOM */
const formulario = document.querySelector('#form-tareas');
const inputTitulo = document.querySelector('#input-titulo');
const selectPrioridad = document.querySelector('#select-prioridad');
const listaContenedor = document.querySelector('#lista-tareas');
const loadingState = document.querySelector('#loading-state');
const botonesFiltro = document.querySelectorAll('.btn-filtro');

/* CARGA ASÍNCRONA SIMULADA */
async function inicializarApp() {
    try {
        // Simulamos una petición a un servidor que tarda 1,5 segundos
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Ocultamos el mensaje de carga
        loadingState.hidden = true;

        // Mostramos las tareas
        pintarTareas();
    } catch (error) {
        loadingState.textContent = 'Error al cargar las tareas.';
        console.error('Error al inicializar la aplicación:', error);
    }
}

/* RENDERIZADO DE LAS TAREAS MEDIANTE NODOS */
function pintarTareas() {
    // Eliminamos los nodos anteriores sin utilizar innerHTML.
    while (listaContenedor.firstChild) {
        listaContenedor.removeChild(listaContenedor.firstChild);
    }

    // Filtramos las tareas según el filtro seleccionado
    const tareasFiltradas = tareas.filter(tarea => {
        if (filtroActual === 'Pendientes') {
            return !tarea.completada;
        }

        if (filtroActual === 'Completadas') {
            return tarea.completada;
        }

        return true;
    });

    // Creamos un elemento li por cada tarea.
    tareasFiltradas.forEach(tarea => {
        const li = document.createElement('li');
        li.classList.add('item-tarea', tarea.prioridad);

        // Creamos el texto de la tarea
        const texto = document.createElement('span');
        texto.appendChild(
            document.createTextNode(tarea.titulo)
        );

        // Mostramos visualmente las tareas completadas
        if (tarea.completada) {
            texto.classList.add('completada');
        }

        // Creamos un texto con la prioridad.
        const prioridad = document.createElement('span');
        prioridad.appendChild(
            document.createTextNode(`Prioridad: ${tarea.prioridad}`)
        );

        // Creamos el botón para cambiar el estado
        const botonEstado = document.createElement('button');
        botonEstado.type = 'button';
        botonEstado.appendChild(
            document.createTextNode(
                tarea.completada ? 'Reabrir' : 'Completar'
            )
        );

        // Evento para completar o reabrir una tarea
        botonEstado.addEventListener('click', () => {
            tareas = tareas.map(t => {
                if (t.id === tarea.id) {
                    return {
                        ...t,
                        completada: !t.completada
                    };
                }

                return t;
            });

            pintarTareas();
        });

        // Añadimos los nodos al li
        li.appendChild(texto);
        li.appendChild(prioridad);
        li.appendChild(botonEstado);

        // Añadimos el li a la lista.
        listaContenedor.appendChild(li);
    });

    // Mensaje si no hay tareas que mostrar
    if (tareasFiltradas.length === 0) {
        const mensaje = document.createElement('li');
        mensaje.appendChild(
            document.createTextNode('No hay tareas para mostrar.')
        );

        listaContenedor.appendChild(mensaje);
    }
}

/* EVENTO DEL FORMULARIO */
formulario.addEventListener('submit', event => {
    event.preventDefault();

    // Capturamos y validamos los valores.
    const titulo = inputTitulo.value.trim();
    const prioridad = selectPrioridad.value;

    if (titulo === '') {
        inputTitulo.focus();
        return;
    }

    // Creamos una tarea nueva
    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo,
        prioridad: prioridad,
        completada: false
    };

    // Actualizamos el estado de forma inmutable
    tareas = [...tareas, nuevaTarea];

    // Actualizamos la pantalla y limpiamos el formulario.
    pintarTareas();
    formulario.reset();
    inputTitulo.focus();
});

/*  EVENTOS DE LOS FILTROS */
botonesFiltro.forEach(boton => {
    boton.addEventListener('click', event => {
        // Actualizamos el botón activo.
        const botonActivo = document.querySelector('.btn-filtro.active');

        if (botonActivo) {
            botonActivo.classList.remove('active');
        }

        event.currentTarget.classList.add('active');

        // Actualizamos el filtro y repintamos
        filtroActual = event.currentTarget.dataset.filtro;
        pintarTareas();
    });
});

/* ARRANQUE DE LA APLICACIÓN */
inicializarApp();
