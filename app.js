// Estado de la aplicación
let currentView = 'home';
let editingId = null;
let allData = {
    carreras: [],
    estudiantes: [],
    cuartos: [],
    plantas: [],
    edificios: [],
    cuartelerias: [],
    evaluaciones: [],
    medios: [],
    sanciones: []
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    displayUserName();
    await loadAllData();
    navigateTo('home');
});

// Autenticación
async function checkAuth() {
    if (!api.checkAuth()) {
        window.location.href = 'login.html';
    }
}

function displayUserName() {
    const user = localStorage.getItem('pb_user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            const displayName = userData.email || userData.username || 'Usuario';
            document.getElementById('userName').textContent = displayName;
        } catch (error) {
            console.error('Error parsing user data:', error);
            document.getElementById('userName').textContent = 'Usuario';
        }
    }
}

function logout() {
    api.logout();
    window.location.href = 'login.html';
}

// Cargar todos los datos desde PocketBase
async function loadAllData() {
    try {
        const [carreras, estudiantes, cuartos, plantas, edificios, cuartelerias, evaluaciones, medios, sanciones, residencias] =
            await Promise.all([
                api.getList('carreras'),
                api.getList('estudiantes'),
                api.getList('cuartos'),
                api.getList('plantas'),
                api.getList('edificios'),
                api.getList('cuartelerias'),
                api.getList('evaluacions'),
                api.getList('mediosbasicos'),
                api.getList('sancion_disciplinarias'),
                api.getList('residencias') 
            ]);

        allData.carreras = carreras.items || [];
        allData.estudiantes = estudiantes.items || [];
        allData.cuartos = cuartos.items || [];
        allData.plantas = plantas.items || [];
        allData.edificios = edificios.items || [];
        allData.cuartelerias = cuartelerias.items || [];
        allData.evaluaciones = evaluaciones.items || [];
        allData.medios = medios.items || [];
        allData.sanciones = sanciones.items || [];
        allData.residencias = residencias.items || []; 
        

        console.log('Datos cargados desde PocketBase:', allData);
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

// Navegación
function navigateTo(view) {
    currentView = view;
    editingId = null;

    // Marcar nav activo
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-gray-800', 'text-white');
    });

    const activeLink = document.querySelector(`a[href="#/${view}"]`);
    if (activeLink) {
        activeLink.classList.add('bg-gray-800', 'text-white');
    }

    // Cargar vista
    switch (view) {
        case 'home':
            loadHome();
            break;
        case 'carreras':
            loadCarreras();
            break;
        case 'estudiantes':
            loadEstudiantes();
            break;
        case 'cuartos':
            loadCuartos();
            break;
        case 'edificios':
            loadEdificios();
            break;
        case 'cuartelerias':
            loadCuartelerias();
            break;
        case 'evaluaciones':
            loadEvaluaciones();
            break;
        case 'medios':
            loadMedios();
            break;
        case 'sanciones':
            loadSanciones();
            break;
    }
}

// Utilidades
function setPageTitle(title, subtitle = '') {
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('pageSubtitle').textContent = subtitle;
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');

    notification.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');

    if (type === 'success') {
        notification.classList.add('bg-green-100', 'text-green-800');
    } else {
        notification.classList.add('bg-red-100', 'text-red-800');
    }

    text.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function showForm(formType) {
    const formId = {
        'carreras': 'carreraForm',
        'estudiantes': 'estudianteForm',
        'cuartos': 'cuartoForm',
        'edificios': 'edificioForm',
        'cuartelerias': 'cuarteleriaForm',
        'evaluaciones': 'evaluacionForm',
        'medios': 'mediosForm',
        'sanciones': 'sancionesForm'
    }[formType];

    if (formId) {
        document.getElementById(formId).classList.remove('hidden');
    }
}

function hideForm(formType) {
    const formId = {
        'carreras': 'carreraForm',
        'estudiantes': 'estudianteForm',
        'cuartos': 'cuartoForm',
        'edificios': 'edificioForm',
        'cuartelerias': 'cuarteleriaForm',
        'evaluaciones': 'evaluacionForm',
        'medios': 'mediosForm',
        'sanciones': 'sancionesForm'
    }[formType];

    if (formId) {
        document.getElementById(formId).classList.add('hidden');
    }
    editingId = null;
}


// HOME
function loadHome() {
    setPageTitle('Panel de Control', 'Resumen del sistema');

    //  ESTADÍSTICAS 

    
    const totalCuarteleriasRealizadas = allData.cuartelerias.filter(c => c.realizada === true || c.realizada === "true").length;
    const promedioCuartelerias = allData.estudiantes.length > 0 
        ? (totalCuarteleriasRealizadas / allData.estudiantes.length).toFixed(1) 
        : 0;

    
    const capacidadTotal = allData.cuartos.reduce((acc, c) => acc + (c.capacidad || 0), 0);
    const estudiantesEnCuartos = allData.cuartos.reduce((acc, c) => acc + (c.cantidad_estudiantes || 0), 0);
    const porcientoOcupacion = capacidadTotal > 0 
        ? ((estudiantesEnCuartos / capacidadTotal) * 100).toFixed(1) 
        : 0;

    
    
const aprobadas = allData.evaluaciones.filter(e => e.calificacion === true || e.calificacion === "true").length;

const porcientoAprobadas = allData.evaluaciones.length > 0 
    ? ((aprobadas / allData.evaluaciones.length) * 100).toFixed(1) 
    : 0;

    
    const mediosBuenos = allData.medios.filter(m => m.estado === 'Bueno').length;
    const porcientoCalidadMedios = allData.medios.length > 0 
        ? ((mediosBuenos / allData.medios.length) * 100).toFixed(1) 
        : 0;

    const stats = {
        estudiantes: allData.estudiantes.length,
        cuartos: allData.cuartos.length,
        cuartelerias: allData.cuartelerias.length
    };

    document.getElementById('content').innerHTML = `
        <div class="space-y-6">
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input type="text" 
                        id="globalSearch" 
                        onkeyup="handleGlobalSearch(this.value)"
                        placeholder="Buscar estudiante, carrera, motivo de sanción o edificio..." 
                        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                </div>
                <div id="searchResults" class="hidden mt-4 space-y-2 border-t pt-4"></div>
            </div>

            <div id="homeDefaultContent" class="space-y-6">
                <h3 class="text-lg font-medium text-gray-900">Indicadores de Gestión de Beca</h3>
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="bg-blue-50 rounded-lg p-5 border border-blue-100">
                        <p class="text-sm font-medium text-blue-600">Promedio Cuartelerías</p>
                        <p class="text-2xl font-bold text-blue-900">${promedioCuartelerias}</p>
                        <p class="text-xs text-blue-500">por estudiante</p>
                    </div>
                    <div class="bg-green-50 rounded-lg p-5 border border-green-100">
                        <p class="text-sm font-medium text-green-600">Ocupación Total</p>
                        <p class="text-2xl font-bold text-green-900">${porcientoOcupacion}%</p>
                        <p class="text-xs text-green-500">${estudiantesEnCuartos} de ${capacidadTotal} camas</p>
                    </div>
                    <div class="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                        <p class="text-sm font-medium text-indigo-600">Eficiencia Limpieza</p>
                        <p class="text-2xl font-bold text-indigo-900">${porcientoAprobadas}%</p>
                        <p class="text-xs text-indigo-500">evaluaciones aprobadas</p>
                    </div>
                    <div class="bg-purple-50 rounded-lg p-5 border border-purple-100">
                        <p class="text-sm font-medium text-purple-600">Calidad de Medios</p>
                        <p class="text-2xl font-bold text-purple-900">${porcientoCalidadMedios}%</p>
                        <p class="text-xs text-purple-500">estado óptimo ("Bueno")</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500">Estudiantes Registrados</dt>
                                    <dd class="text-lg font-medium text-gray-900">${stats.estudiantes}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500">Total de Cuartos</dt>
                                    <dd class="text-lg font-medium text-gray-900">${stats.cuartos}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500">Registros Cuartelería</dt>
                                    <dd class="text-lg font-medium text-gray-900">${stats.cuartelerias}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Accesos Rápidos</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button onclick="navigateTo('estudiantes')" class="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-left">
                            <h4 class="font-semibold text-blue-900">Gestionar Estudiantes</h4>
                            <p class="text-sm text-blue-700">Total: ${stats.estudiantes}</p>
                        </button>
                        <button onclick="navigateTo('cuartos')" class="p-4 border border-green-200 rounded-lg hover:bg-green-50 text-left">
                            <h4 class="font-semibold text-green-900">Ver Cuartos</h4>
                            <p class="text-sm text-green-700">Total: ${stats.cuartos}</p>
                        </button>
                        <button onclick="navigateTo('cuartelerias')" class="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 text-left">
                            <h4 class="font-semibold text-yellow-900">Ver Cuartelerías</h4>
                            <p class="text-sm text-yellow-700">Total: ${stats.cuartelerias}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
// CARRERAS
function loadCarreras() {
    setPageTitle('Carreras', 'Gestión de carreras');

    const html = `
        <div>
            <div class="mb-6 flex justify-between items-center">
                <button onclick="showForm('carreras')" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-blue-700">
                    Nueva Carrera
                </button>
            </div>

            <div id="carreraForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nueva'} Carrera</h3>
                <form onsubmit="saveCarrera(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre </label>
                            <input type="text" onkeypress="return /^[A-Za-z ]$/.test(event.key)" id="carrera_nombre" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Facultad </label>
                            <input type="text" onkeypress="return /^[A-Za-z ]$/.test(event.key)" id="carrera_facultad" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('carreras')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facultad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.carreras.map(c => `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${c.nombre}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${c.facultad}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onclick="editCarrera('${c.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                        <button onclick="deleteCarrera('${c.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${allData.carreras.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay carreras</div>' : ''}
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

async function editCarrera(id) {
    editingId = id;
    const carrera = allData.carreras.find(c => c.id === id);
    if (carrera) {
        document.getElementById('carrera_nombre').value = carrera.nombre;
        document.getElementById('carrera_facultad').value = carrera.facultad;
        showForm('carreras');
    }
}

async function saveCarrera(e) {
    e.preventDefault();
    const data = {
        nombre: document.getElementById('carrera_nombre').value,
        facultad: document.getElementById('carrera_facultad').value
    };

    try {
        if (editingId) {
            await api.updateRecord('carreras', editingId, data);
            showNotification('Carrera actualizada');
        } else {
            await api.createRecord('carreras', data);
            showNotification('Carrera creada');
        }
        hideForm('carreras');
        await loadAllData();
        loadCarreras();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteCarrera(id) {
    if (confirm('¿Eliminar esta carrera?')) {
        try {
            await api.deleteRecord('carreras', id);
            showNotification('Carrera eliminada');
            await loadAllData();
            loadCarreras();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// ESTUDIANTES
function loadEstudiantes() {
    setPageTitle('Estudiantes', 'Gestión de estudiantes');

    const html = `
        <div>
            <div class="mb-6">
                <button onclick="showForm('estudiantes')" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Nuevo Estudiante
                </button>
            </div>

            <div id="estudianteForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nuevo'} Estudiante</h3>
                <form onsubmit="saveEstudiante(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre </label>
                            <input type="text" onkeypress="return /^[A-Za-z ]$/.test(event.key)" id="est_nombre" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos </label>
                            <input type="text" onkeypress="return /^[A-Za-z ]$/.test(event.key)" id="est_apellidos" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">CI </label>
                            <input type="text" minlength="11" maxlength="11" id ="est_ci" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sexo </label>
                            <select id="est_sexo" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Carrera </label>
                            <select id="est_carrera" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.carreras.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cuarto</label>
                            <select id="est_cuarto" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Ninguno</option>
                                ${allData.cuartos.map(c => `<option value="${c.id}">Cuarto ${c.numero}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="text" pattern="[0-9]+" id="est_telefono" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                            <input type="text" id="est_direccion" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('estudiantes')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CI</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuarto</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.estudiantes.map(e => {
        const carrera = allData.carreras.find(c => c.id === e.id_carrera);
        const cuarto = allData.cuartos.find(c => c.id === e.id_cuarto);
        return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900">${e.nombre} ${e.apellidos}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${e.ci}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${carrera?.nombre || '-'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${cuarto ? 'Cuarto ' + cuarto.numero : '-'}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <button onclick="editEstudiante('${e.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button onclick="deleteEstudiante('${e.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                    ${allData.estudiantes.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay estudiantes</div>' : ''}
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

async function editEstudiante(id) {
    editingId = id;
    const est = allData.estudiantes.find(e => e.id === id);
    if (est) {
        document.getElementById('est_nombre').value = est.nombre;
        document.getElementById('est_apellidos').value = est.apellidos;
        document.getElementById('est_ci').value = est.ci;
        document.getElementById('est_sexo').value = est.sexo;
        document.getElementById('est_carrera').value = est.id_carrera;
        document.getElementById('est_cuarto').value = est.id_cuarto || '';
        document.getElementById('est_telefono').value = est.telefono || '';
        document.getElementById('est_direccion').value = est.direccion || '';
        showForm('estudiantes');
    }
}

async function saveEstudiante(e) {
    e.preventDefault();
    const data = {
        nombre: document.getElementById('est_nombre').value,
        apellidos: document.getElementById('est_apellidos').value,
        ci: document.getElementById('est_ci').value,
        sexo: document.getElementById('est_sexo').value,
        id_carrera: document.getElementById('est_carrera').value,
        id_cuarto: document.getElementById('est_cuarto').value || null,
        telefono: document.getElementById('est_telefono').value,
        direccion: document.getElementById('est_direccion').value
    };

    try {
        if (editingId) {
            await api.updateRecord('estudiantes', editingId, data);
            showNotification('Estudiante actualizado');
        } else {
            await api.createRecord('estudiantes', data);
            showNotification('Estudiante creado');
        }
        hideForm('estudiantes');
        await loadAllData();
        loadEstudiantes();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteEstudiante(id) {
    if (confirm('¿Eliminar este estudiante?')) {
        try {
            await api.deleteRecord('estudiantes', id);
            showNotification('Estudiante eliminado');
            await loadAllData();
            loadEstudiantes();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// CUARTOS
function loadCuartos() {
    setPageTitle('Cuartos', 'Gestión de cuartos');

    const html = `
        <div>
            <div class="mb-6">
                <button onclick="showForm('cuartos')" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Nuevo Cuarto
                </button>
            </div>

            <div id="cuartoForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nuevo'} Cuarto</h3>
                <form onsubmit="saveCuarto(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número </label>
                            <input type="number" min="1"id="cuarto_numero" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Planta </label>
                            <select id="cuarto_planta" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.plantas.map(p => `<option value="${p.id}">Planta ${p.numero_planta}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad </label>
                            <input type="number" min="1" id="cuarto_capacidad" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad Estudiantes</label>
                            <input type="number" min="0" id="cuarto_cantidad" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('cuartos')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planta</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacidad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiantes</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.cuartos.map(c => {
        const planta = allData.plantas.find(p => p.id === c.id_planta);
        return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900">${c.numero}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">Planta ${planta?.numero_planta || '-'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${c.capacidad}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${c.cantidad_estudiantes}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <button onclick="editCuarto('${c.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button onclick="deleteCuarto('${c.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                    ${allData.cuartos.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay cuartos</div>' : ''}
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

async function editCuarto(id) {
    editingId = id;
    const cuarto = allData.cuartos.find(c => c.id === id);
    if (cuarto) {
        document.getElementById('cuarto_numero').value = cuarto.numero;
        document.getElementById('cuarto_planta').value = cuarto.id_planta;
        document.getElementById('cuarto_capacidad').value = cuarto.capacidad;
        document.getElementById('cuarto_cantidad').value = cuarto.cantidad_estudiantes;
        showForm('cuartos');
    }
}

async function saveCuarto(e) {
    e.preventDefault();
    const data = {
        numero: parseInt(document.getElementById('cuarto_numero').value),
        id_planta: document.getElementById('cuarto_planta').value,
        capacidad: parseInt(document.getElementById('cuarto_capacidad').value),
        cantidad_estudiantes: parseInt(document.getElementById('cuarto_cantidad').value)
    };

    try {
        if (editingId) {
            await api.updateRecord('cuartos', editingId, data);
            showNotification('Cuarto actualizado');
        } else {
            await api.createRecord('cuartos', data);
            showNotification('Cuarto creado');
        }
        hideForm('cuartos');
        await loadAllData();
        loadCuartos();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteCuarto(id) {
    if (confirm('¿Eliminar este cuarto?')) {
        try {
            await api.deleteRecord('cuartos', id);
            showNotification('Cuarto eliminado');
            await loadAllData();
            loadCuartos();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

function loadEdificios() {
    setPageTitle('Edificios', 'Gestión de edificios');

    const html = `
        <div>
            <div class="mb-6">
                <button onclick="showForm('edificios')" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Nuevo Edificio
                </button>
            </div>

            <div id="edificioForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nuevo'} Edificio</h3>
                <form onsubmit="saveEdificio(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número Bloque </label>
                            <input type="text" pattern="[0-9]+" id="edif_numero" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Residencia </label>
                            <select id="edif_residencia" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.residencias.map(r => `<option value="${r.id}">${r.direccion}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('edificios')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número Bloque</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Residencia (Dirección)</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${allData.edificios.map(e => {
        
        
        const idBuscado = e.id_residencia || e.residencia;
        const resencontrada = allData.residencias.find(r => r.id === idBuscado);

        const nombreAMostrar = resencontrada ? resencontrada.direccion : `ID no vinculado (${idBuscado})`;

        return `
                                <tr>
                                    <td class="px-6 py-4 text-sm text-gray-900">${e.numero_bloque}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900">${nombreAMostrar}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <button onclick="editEdificio('${e.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                        <button onclick="deleteEdificio('${e.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                    </td>
                                </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

async function editEdificio(id) {
    editingId = id;
    const edif = allData.edificios.find(e => e.id === id);
    if (edif) {
        document.getElementById('edif_numero').value = edif.numero_bloque;
        document.getElementById('edif_residencia').value = edif.id_residencia;
        showForm('edificios');
    }
}

async function saveEdificio(e) {
    e.preventDefault();
    const data = {
        numero_bloque: document.getElementById('edif_numero').value,
        id_residencia: document.getElementById('edif_residencia').value
    };

    try {
        if (editingId) {
            await api.updateRecord('edificios', editingId, data);
            showNotification('Edificio actualizado');
        } else {
            await api.createRecord('edificios', data);
            showNotification('Edificio creado');
        }
        hideForm('edificios');
        await loadAllData();
        loadEdificios();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteEdificio(id) {
    if (confirm('¿Eliminar este edificio?')) {
        try {
            await api.deleteRecord('edificios', id);
            showNotification('Edificio eliminado');
            await loadAllData();
            loadEdificios();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// CUARTELERÍAS
function loadCuartelerias() {
    setPageTitle('Cuartelerías', 'Gestión de cuartelerías');

    const html = `
        <div>
            <div class="mb-6">
                <button onclick="showForm('cuartelerias')" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Nueva Cuartelería
                </button>
            </div>

            <div id="cuarteleriaForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nueva'} Cuartelería</h3>
                <form onsubmit="saveCuarteleria(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante </label>
                            <select id="cuar_estudiante" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.estudiantes.map(e => `<option value="${e.id}">${e.nombre} ${e.apellidos || ''}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha </label>
                            <input type="date" id="cuar_fecha" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Realizada</label>
                            <select id="cuar_realizada" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="false">No</option>
                                <option value="true">Sí</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Especial</label>
                            <select id="cuar_especial" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="false">No</option>
                                <option value="true">Sí</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Justificación</label>
                        <textarea id="cuar_justificacion" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('cuartelerias')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Realizada</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especial</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.cuartelerias.map(c => {
        const estudiante = allData.estudiantes.find(e => e.id === c.id_estudiante);

        
        const fechaFormateada = c.fecha ? new Date(c.fecha).toLocaleDateString() : '-';

        
        const badgeRealizada = c.realizada
            ? '<span class="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">Sí</span>'
            : '<span class="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">No</span>';

        const badgeEspecial = c.especial
            ? '<span class="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Sí</span>'
            : '<span class="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">No</span>';

        return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900 font-medium">${estudiante?.nombre || 'No asignado'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${fechaFormateada}</td>
                                        <td class="px-6 py-4 text-sm">${badgeRealizada}</td>
                                        <td class="px-6 py-4 text-sm">${badgeEspecial}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <button onclick="editCuarteleria('${c.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button onclick="deleteCuarteleria('${c.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                    ${allData.cuartelerias.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay cuartelerías</div>' : ''}
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

async function editCuarteleria(id) {
    editingId = id;
    const cuar = allData.cuartelerias.find(c => c.id === id);
    if (cuar) {
        document.getElementById('cuar_estudiante').value = cuar.id_estudiante;
        document.getElementById('cuar_fecha').value = cuar.fecha;
        document.getElementById('cuar_realizada').value = cuar.realizada;
        document.getElementById('cuar_especial').value = cuar.especial;
        document.getElementById('cuar_justificacion').value = cuar.justificacion || '';
        showForm('cuartelerias');
    }
}

async function saveCuarteleria(e) {
    e.preventDefault();
    const data = {
        id_estudiante: document.getElementById('cuar_estudiante').value,
        fecha: document.getElementById('cuar_fecha').value,
        realizada: document.getElementById('cuar_realizada').value === 'true',
        especial: document.getElementById('cuar_especial').value === 'true',
        justificacion: document.getElementById('cuar_justificacion').value
    };

    try {
        if (editingId) {
            await api.updateRecord('cuartelerias', editingId, data);
            showNotification('Cuartelería actualizada');
        } else {
            await api.createRecord('cuartelerias', data);
            showNotification('Cuartelería creada');
        }
        hideForm('cuartelerias');
        await loadAllData();
        loadCuartelerias();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteCuarteleria(id) {
    if (confirm('¿Eliminar esta cuartelería?')) {
        try {
            await api.deleteRecord('cuartelerias', id);
            showNotification('Cuartelería eliminada');
            await loadAllData();
            loadCuartelerias();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// EVALUACIONES
function loadEvaluaciones() {
    setPageTitle('Evaluaciones', 'Gestión de evaluaciones');

    const html = `
        <div>
            <div class="mb-6">
                <button onclick="showForm('evaluaciones')" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Nueva Evaluación
                </button>
            </div>

            <div id="evaluacionForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nueva'} Evaluación</h3>
                <form onsubmit="saveEvaluacion(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante </label>
                            <select id="eval_estudiante" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.estudiantes.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha </label>
                            <input type="date" id="eval_fecha" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                            <select id="eval_calificacion" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="true">Aprobado</option>
                                <option value="false">Reprobado</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Semestre </label>
                            <input type="text"  id="eval_semestre" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Observación</label>
                        <textarea id="eval_observacion" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('evaluaciones')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semestre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.evaluaciones.map(ev => {
        
        const estudiante = allData.estudiantes.find(e => e.id === ev.id_estudiantes);

        
        const fechaFormateada = ev.fecha ? new Date(ev.fecha).toLocaleDateString() : 'Sense data';

        const esAprobado = ev.calificacion === true || ev.calificacion === "true";

        return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900 font-medium">${estudiante?.nombre || 'No assignat'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${fechaFormateada}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <span class="px-2 py-1 rounded-full text-xs font-bold ${esAprobado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                ${esAprobado ? 'Aprobado' : 'Reprobado'}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${ev.semestre || '-'}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <button onclick="editEvaluacion('${ev.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button onclick="deleteEvaluacion('${ev.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

async function editEvaluacion(id) {
    editingId = id;
    const eval_ = allData.evaluaciones.find(e => e.id === id);
    if (eval_) {
        document.getElementById('eval_estudiante').value = eval_.id_estudiante;
        document.getElementById('eval_fecha').value = eval_.Fecha;
        document.getElementById('eval_calificacion').value = eval_.Calificacion;
        document.getElementById('eval_semestre').value = eval_.Semestre;
        document.getElementById('eval_observacion').value = eval_.Observacion || '';
        showForm('evaluaciones');
    }
}

async function saveEvaluacion(e) {
    e.preventDefault();

    
    const data = {
        id_estudiantes: document.getElementById('eval_estudiante').value,
        fecha: document.getElementById('eval_fecha').value,
        calificacion: document.getElementById('eval_calificacion').value === 'true',
        semestre: document.getElementById('eval_semestre').value,
        observacion: document.getElementById('eval_observacion').value
    };

    console.log("Datos a enviar a PocketBase:", data); // Para que verifiques en consola antes de enviar

    try {
        if (editingId) {
            await api.updateRecord('evaluacions', editingId, data);
            showNotification('Evaluación actualizada');
        } else {
            await api.createRecord('evaluacions', data);
            showNotification('Evaluación creada');
        }
        hideForm('evaluaciones');
        await loadAllData();
        loadEvaluaciones();
    } catch (error) {
        showNotification('Error al guardar: ' + error.message, 'error');
    }
}

async function deleteEvaluacion(id) {
    if (confirm('¿Eliminar esta evaluación?')) {
        try {
            await api.deleteRecord('evaluacions', id);
            showNotification('Evaluación eliminada');
            await loadAllData();
            loadEvaluaciones();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// MEDIOS BÁSICOS
function loadMedios() {
    setPageTitle('Medios Básicos', 'Gestión de medios básicos');

    const html = `
        <div>
            <div class="mb-6">
                <button onclick="showForm('medios')" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Nuevo Medio
                </button>
            </div>

            <div id="mediosForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nuevo'} Medio Básico</h3>
                <form onsubmit="saveMedio(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número Inventario </label>
                            <input type="text" pattern="[0-9]+" id="medio_numero" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo </label>
                            <input type="text" onkeypress="return /^[A-Za-z ]$/.test(event.key)" id="medio_tipo" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estado </label>
                            <select id="medio_estado" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                <option value="Bueno">Bueno</option>
                                <option value="Regular">Regular</option>
                                <option value="Malo">Malo</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cuarto </label>
                            <select id="medio_cuarto" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.cuartos.map(c => `<option value="${c.id}">Cuarto ${c.numero}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('medios')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuarto</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.medios.map(m => {
        const cuarto = allData.cuartos.find(c => c.id === m.id_cuarto);
        return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900">${m.numero_inventario}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${m.tipo}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${m.estado}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${cuarto?.numero || '-'}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <button onclick="editMedio('${m.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button onclick="deleteMedio('${m.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                    ${allData.medios.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay medios</div>' : ''}
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

async function editMedio(id) {
    editingId = id;
    const medio = allData.medios.find(m => m.id === id);
    if (medio) {
        document.getElementById('medio_numero').value = medio.numero_inventario;
        document.getElementById('medio_tipo').value = medio.tipo;
        document.getElementById('medio_estado').value = medio.estado;
        document.getElementById('medio_cuarto').value = medio.id_cuarto;
        showForm('medios');
    }
}

async function saveMedio(e) {
    e.preventDefault();
    const data = {
        numero_inventario: document.getElementById('medio_numero').value,
        tipo: document.getElementById('medio_tipo').value,
        estado: document.getElementById('medio_estado').value,
        id_cuarto: document.getElementById('medio_cuarto').value
    };

    try {
        if (editingId) {
            await api.updateRecord('mediosbasicos', editingId, data);
            showNotification('Medio actualizado');
        } else {
            await api.createRecord('mediosbasicos', data);
            showNotification('Medio creado');
        }
        hideForm('medios');
        await loadAllData();
        loadMedios();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteMedio(id) {
    if (confirm('¿Eliminar este medio?')) {
        try {
            await api.deleteRecord('mediosbasicos', id);
            showNotification('Medio eliminado');
            await loadAllData();
            loadMedios();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// SANCIONES
function loadSanciones() {
    setPageTitle('Sanciones Disciplinarias', 'Gestión de sanciones');

    const html = `
        <div>
            <div class="mb-6">
                <button onclick="showForm('sanciones')" class="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Nueva Sanción
                </button>
            </div>

            <div id="sancionesForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nueva'} Sanción</h3>
                <form onsubmit="saveSancion(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante </label>
                            <select id="sanc_estudiante" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.estudiantes.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha </label>
                            <input type="date" id="sanc_fecha" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo </label>
                            <input type="text" onkeypress="return /^[A-Za-z ]$/.test(event.key)" id="sanc_motivo" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>                  
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea id="sanc_descripcion" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('sanciones')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.sanciones.map(s => {
        
        const estudiante = allData.estudiantes.find(e => e.id === s.id_estudiante || e.id === s.id_estudiantes);

        
        const fechaFormateada = s.fecha ? new Date(s.fecha).toLocaleDateString() : (s.Fecha ? new Date(s.Fecha).toLocaleDateString() : '-');

        
        const motivoTexto = s.motivo || s.Motivo || '-';

        return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900 font-medium">${estudiante?.nombre || 'No asignado'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${fechaFormateada}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${motivoTexto}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <button onclick="editSancion('${s.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button onclick="deleteSancion('${s.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                    ${allData.sanciones.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay sanciones</div>' : ''}
                </div>
            </div>
        </div>
    `;
    document.getElementById('content').innerHTML = html;
}

function editSancion(id) {
    const sanc = allData.sanciones.find(s => s.id === id);
    if (sanc) {
        editingId = id;
        document.getElementById('sanc_estudiante').value = sanc.id_estudiante || sanc.id_estudiantes;
        document.getElementById('sanc_fecha').value = (sanc.fecha || sanc.Fecha || '').split(' ')[0]; 
        document.getElementById('sanc_motivo').value = sanc.motivo || sanc.Motivo || '';
        document.getElementById('sanc_descripcion').value = sanc.descripcion || sanc.Descripcion || '';
        showForm('sanciones');
    }
}

async function saveSancion(e) {
    e.preventDefault();
    const data = {
        id_estudiante: document.getElementById('sanc_estudiante').value,
        fecha: document.getElementById('sanc_fecha').value,   
        motivo: document.getElementById('sanc_motivo').value, 
        descripcion: document.getElementById('sanc_descripcion').value 
    };

    try {
        if (editingId) {
            await api.updateRecord('sancion_disciplinarias', editingId, data);
            showNotification('Sanción actualizada');
        } else {
            await api.createRecord('sancion_disciplinarias', data);
            showNotification('Sanción creada');
        }
        hideForm('sanciones');
        await loadAllData();
        loadSanciones();
    } catch (error) {
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteSancion(id) {
    if (confirm('¿Eliminar esta sanción?')) {
        try {
            await api.deleteRecord('sancion_disciplinarias', id);
            showNotification('Sanción eliminada');
            await loadAllData();
            loadSanciones();
        } catch (error) {
            showNotification('Error: ' + error.message, 'error');
        }
    }
}



// Función de búsqueda 
function handleGlobalSearch(query) {
    const resultsDiv = document.getElementById('searchResults');
    const defaultContent = document.getElementById('homeDefaultContent');



    
    query = query.toLowerCase();
    resultsDiv.classList.remove('hidden');
    defaultContent.classList.add('hidden');

    let html = '<h3 class="text-sm font-bold text-gray-500 uppercase mb-3">Resultados de búsqueda:</h3>';
    let foundCount = 0;

    
    const est = allData.estudiantes.filter(e =>
        e.nombre.toLowerCase().includes(query) || (e.apellidos && e.apellidos.toLowerCase().includes(query))
    );
    
    const sanc = allData.sanciones.filter(s =>
        (s.motivo || s.Motivo || "").toLowerCase().includes(query)
    );

    const carr = allData.carreras.filter(c =>
        c.nombre.toLowerCase().includes(query)
    );

    
    if (est.length > 0) {
        foundCount += est.length;
        html += `<div class="mb-4"><p class="text-xs font-bold text-blue-600">ESTUDIANTES</p>`;
        est.forEach(e => {
            html += `
                <div onclick="navigateTo('estudiantes')" class="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer border-b">
                    <span class="text-sm text-gray-800">${e.nombre} ${e.apellidos || ''}</span>
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Ver perfil</span>
                </div>`;
        });
        html += `</div>`;
    }

    if (sanc.length > 0) {
        foundCount += sanc.length;
        html += `<div class="mb-4"><p class="text-xs font-bold text-red-600">SANCIONES</p>`;
        sanc.forEach(s => {
            html += `
                <div onclick="navigateTo('sanciones')" class="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer border-b">
                    <span class="text-sm text-gray-800">${s.motivo || s.Motivo}</span>
                    <span class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Ver detalle</span>
                </div>`;
        });
        html += `</div>`;
    }

    if (carr.length > 0) {
        foundCount += carr.length;
        html += `<div class="mb-4"><p class="text-xs font-bold text-green-600">CARRERAS</p>`;
        carr.forEach(c => {
            html += `
                <div onclick="navigateTo('carreras')" class="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer border-b">
                    <span class="text-sm text-gray-800">${c.nombre}</span>
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Gestionar</span>
                </div>`;
        });
        html += `</div>`;
    }

    if (foundCount === 0) {
        html += `<p class="text-sm text-gray-500 italic">No se encontraron coincidencias para "${query}"</p>`;
    }

    resultsDiv.innerHTML = html;
}
