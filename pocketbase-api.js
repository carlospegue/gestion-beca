// Configuración de PocketBase
// Detecta automáticamente si estamos en localhost o en producción
const PB_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8090' 
    : window.location.origin;

let pb = null;
let authToken = null;
let currentUser = null;

// Inicializar PocketBase
async function initPocketBase() {
    try {
        // Cargar la librería de PocketBase
        const script = document.createElement('script');
        script.src = PB_URL + '/api/files/pocketbase.js';
        script.onload = () => {
            pb = new PocketBase(PB_URL);
            console.log('PocketBase inicializado');
            checkAuthStatus();
        };
        script.onerror = () => {
            console.warn('No se pudo cargar la librería de PocketBase, usando metodo alternativo');
            // Usar fetch API como alternativa
            pb = null;
        };
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error inicializando PocketBase:', error);
    }
}

// Usar fetch API para las peticiones
async function apiCall(method, endpoint, data = null) {
    const url = `${PB_URL}/api/collections/${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (authToken) {
        options.headers['Authorization'] = authToken;
    }

    if (data && (method === 'POST' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error en la petición');
        }
        
        return result;
    } catch (error) {
        console.error(`Error en ${method} ${endpoint}:`, error);
        throw error;
    }
}

// AUTENTICACIÓN
async function loginPocketBase(email, password) {
    try {
        const response = await fetch(`${PB_URL}/api/collections/users/auth-with-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identity: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en la autenticación');
        }

        authToken = data.token;
        currentUser = data.record;
        localStorage.setItem('pb_auth', authToken);
        localStorage.setItem('pb_user', JSON.stringify(currentUser));
        
        return { success: true, data: currentUser };
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, error: error.message };
    }
}

async function logoutPocketBase() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('pb_auth');
    localStorage.removeItem('pb_user');
}

function checkAuthStatus() {
    const savedToken = localStorage.getItem('pb_auth');
    const savedUser = localStorage.getItem('pb_user');
    
    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        return true;
    }
    return false;
}

// OPERACIONES CRUD

// GET - Listar todos los registros
async function getList(collection, options = {}) {
    try {
        let url = `${PB_URL}/api/collections/${collection}/records`;
        
        const params = new URLSearchParams();
        if (options.expand) params.append('expand', options.expand);
        if (options.filter) params.append('filter', options.filter);
        if (options.sort) params.append('sort', options.sort);
        if (options.perPage) params.append('perPage', options.perPage);
        if (options.page) params.append('page', options.page);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url, {
            headers: authToken ? { 'Authorization': authToken } : {}
        });

        if (!response.ok) throw new Error('Error al obtener lista');
        return await response.json();
    } catch (error) {
        console.error(`Error obteniendo ${collection}:`, error);
        return { items: [], totalItems: 0 };
    }
}

// GET - Un registro por ID
async function getRecord(collection, id) {
    try {
        const response = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}?expand=*`, {
            headers: authToken ? { 'Authorization': authToken } : {}
        });

        if (!response.ok) throw new Error('Error al obtener registro');
        return await response.json();
    } catch (error) {
        console.error(`Error obteniendo ${collection}/${id}:`, error);
        return null;
    }
}

// CREATE - Crear nuevo registro
async function createRecord(collection, data) {
    try {
        const response = await fetch(`${PB_URL}/api/collections/${collection}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken || ''
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al crear');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error creando en ${collection}:`, error);
        throw error;
    }
}

// UPDATE - Actualizar registro
async function updateRecord(collection, id, data) {
    try {
        const response = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken || ''
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar');
        }
        return await response.json();
    } catch (error) {
        console.error(`Error actualizando ${collection}/${id}:`, error);
        throw error;
    }
}

// DELETE - Eliminar registro
async function deleteRecord(collection, id) {
    try {
        const response = await fetch(`${PB_URL}/api/collections/${collection}/records/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': authToken || ''
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al eliminar');
        }
        return true;
    } catch (error) {
        console.error(`Error eliminando ${collection}/${id}:`, error);
        throw error;
    }
}

// Exportar para uso global
window.api = {
    init: initPocketBase,
    login: loginPocketBase,
    logout: logoutPocketBase,
    checkAuth: checkAuthStatus,
    getList,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord
};
