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
        const [carreras, estudiantes, cuartos, plantas, edificios, cuartelerias, evaluaciones, medios, sanciones] = 
            await Promise.all([
                api.getList('carreras'),
                api.getList('estudiantes'),
                api.getList('cuartos'),
                api.getList('plantas'),
                api.getList('edificios'),
                api.getList('cuartelerias'),
                api.getList('evaluacions'),
                api.getList('mediosbasicos'),
                api.getList('sancion_disciplinarias')
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

        console.log('Datos cargados desde PocketBase:', allData);
    } catch (error) {
        console.error('Error cargando datos:', error);
        showNotification('Error al cargar datos del servidor', 'error');
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
    switch(view) {
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
    setPageTitle('Dashboard', 'Resumen del sistema');
    
    const stats = {
        estudiantes: allData.estudiantes.length,
        cuartos: allData.cuartos.length,
        cuartelerias: allData.cuartelerias.length
    };

    document.getElementById('content').innerHTML = `
        <div>
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 bg-blue-500 rounded-md p-3">
                            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500">Estudiantes</dt>
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
                                <dt class="text-sm font-medium text-gray-500">Cuartos</dt>
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
                                <dt class="text-sm font-medium text-gray-500">Cuartelerías</dt>
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
    `;
}

// CARRERAS
function loadCarreras() {
    setPageTitle('Carreras', 'Gestión de carreras');
    
    const html = `
        <div>
            <div class="mb-6 flex justify-between items-center">
                <button onclick="showForm('carreras')" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Nueva Carrera
                </button>
            </div>

            <div id="carreraForm" class="bg-white rounded-lg shadow p-6 mb-6 hidden">
                <h3 class="text-lg font-medium text-gray-900 mb-4">${editingId ? 'Editar' : 'Nueva'} Carrera</h3>
                <form onsubmit="saveCarrera(event)" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <input type="text" id="carrera_nombre" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Facultad *</label>
                            <input type="text" id="carrera_facultad" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <input type="text" id="est_nombre" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Apellidos *</label>
                            <input type="text" id="est_apellidos" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">CI *</label>
                            <input type="text" id="est_ci" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                            <select id="est_sexo" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Carrera *</label>
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
                            <input type="tel" id="est_telefono" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                            <input type="number" id="cuarto_numero" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Planta *</label>
                            <select id="cuarto_planta" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.plantas.map(p => `<option value="${p.id}">Planta ${p.numero_planta}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad *</label>
                            <input type="number" id="cuarto_capacidad" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad Estudiantes</label>
                            <input type="number" id="cuarto_cantidad" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
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

// EDIFICIOS
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número Bloque *</label>
                            <input type="text" id="edif_numero" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Residencia</label>
                            <input type="text" id="edif_residencia" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div class="flex justify-end gap-3">
                        <button type="button" onclick="hideForm('edificios')" class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md">Cancelar</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número Bloque</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Residencia</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${allData.edificios.map(e => `
                                <tr>
                                    <td class="px-6 py-4 text-sm text-gray-900">${e.numero_bloque}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900">${e.id_residencia || '-'}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <button onclick="editEdificio('${e.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                        <button onclick="deleteEdificio('${e.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${allData.edificios.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay edificios</div>' : ''}
                </div>
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante *</label>
                            <select id="cuar_estudiante" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.estudiantes.map(e => `<option value="${e.id}">${e.nombre} ${e.apellidos}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
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
                                return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900">${estudiante?.nombre || '-'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${c.fecha}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${c.realizada ? 'Sí' : 'No'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${c.especial ? 'Sí' : 'No'}</td>
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante *</label>
                            <select id="eval_estudiante" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.estudiantes.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Semestre *</label>
                            <input type="text" id="eval_semestre" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
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
                                const estudiante = allData.estudiantes.find(e => e.id === ev.id_estudiante);
                                return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900">${estudiante?.nombre || '-'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${ev.Fecha}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${ev.Calificacion ? 'Aprobado' : 'Reprobado'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${ev.Semestre}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <button onclick="editEvaluacion('${ev.id}')" class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                                            <button onclick="deleteEvaluacion('${ev.id}')" class="text-red-600 hover:text-red-800">Eliminar</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    ${allData.evaluaciones.length === 0 ? '<div class="text-center py-8 text-gray-500">No hay evaluaciones</div>' : ''}
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
        id_estudiante: document.getElementById('eval_estudiante').value,
        Fecha: document.getElementById('eval_fecha').value,
        Calificacion: document.getElementById('eval_calificacion').value === 'true',
        Semestre: document.getElementById('eval_semestre').value,
        Observacion: document.getElementById('eval_observacion').value
    };
    
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
        showNotification('Error: ' + error.message, 'error');
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Número Inventario *</label>
                            <input type="text" id="medio_numero" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                            <input type="text" id="medio_tipo" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                            <select id="medio_estado" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                <option value="Bueno">Bueno</option>
                                <option value="Regular">Regular</option>
                                <option value="Malo">Malo</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Cuarto *</label>
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
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante *</label>
                            <select id="sanc_estudiante" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                <option value="">Seleccione...</option>
                                ${allData.estudiantes.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                            <input type="date" id="sanc_fecha" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
                            <input type="text" id="sanc_motivo" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
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
                                const estudiante = allData.estudiantes.find(e => e.id === s.id_estudiante);
                                return `
                                    <tr>
                                        <td class="px-6 py-4 text-sm text-gray-900">${estudiante?.nombre || '-'}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${s.Fecha}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900">${s.Motivo}</td>
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

async function editSancion(id) {
    editingId = id;
    const sanc = allData.sanciones.find(s => s.id === id);
    if (sanc) {
        document.getElementById('sanc_estudiante').value = sanc.id_estudiante;
        document.getElementById('sanc_fecha').value = sanc.Fecha;
        document.getElementById('sanc_motivo').value = sanc.Motivo;
        document.getElementById('sanc_descripcion').value = sanc.Descripcion || '';
        showForm('sanciones');
    }
}

async function saveSancion(e) {
    e.preventDefault();
    const data = {
        id_estudiante: document.getElementById('sanc_estudiante').value,
        Fecha: document.getElementById('sanc_fecha').value,
        Motivo: document.getElementById('sanc_motivo').value,
        Descripcion: document.getElementById('sanc_descripcion').value
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
