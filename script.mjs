// Datos simulados para los municipios
console.log("salu3")

const municipalityData = {
    "La Unión": {
        hectareasSembradas: 1204.3,
        hectareasSinCultivar: 302.5,
        hectareasCana: 805.7,
        hectareasCafe: 398.6
    },
    "Funes": {
        hectareasSembradas: 892.4,
        hectareasSinCultivar: 245.8,
        hectareasCana: 567.3,
        hectareasCafe: 324.1
    },
    "Córdoba": {
        hectareasSembradas: 1567.2,
        hectareasSinCultivar: 423.9,
        hectareasCana: 978.4,
        hectareasCafe: 588.8
    }
};

// Función para generar datos aleatorios para municipios sin datos
function generateRandomData() {
    return {
        hectareasSembradas: (Math.random() * 1500 + 500).toFixed(1),
        hectareasSinCultivar: (Math.random() * 400 + 100).toFixed(1),
        hectareasCana: (Math.random() * 1000 + 300).toFixed(1),
        hectareasCafe: (Math.random() * 600 + 200).toFixed(1)
    };
}

// Función para obtener los nombres de los municipios del SVG
function getMunicipalityNames() {
    // Selecciona todos los elementos <a> dentro del SVG
    const enlaces = document.querySelectorAll('#map-box svg a'); 
    // Crea un array para almacenar los nombres
    let nombres = [];
    // Itera sobre los enlaces y agrega los valores de xlink:title al array
    enlaces.forEach(enlace => {
        const nombre = enlace.getAttribute('xlink:title');
        nombres.push(nombre);
    });
    // Devuelve el array de nombres
    return nombres;
//    const municipalities = document.querySelectorAll('[xlink\\:title]');
//    return Array.from(municipalities).map(m => m.getAttribute('xlink:title'));
}



// Función para mostrar los datos del municipio
function displayMunicipalityData(municipalityName) {
    const dataContainer = document.getElementById('dataContent');
    const data = municipalityData[municipalityName] || generateRandomData();
    
    dataContainer.innerHTML = `
        <h2>${municipalityName}</h2>
        <div class="data-item">
            <span>Hectáreas Sembradas:</span> ${data.hectareasSembradas}
        </div>
        <div class="data-item">
            <span>Hectáreas Sin Cultivar:</span> ${data.hectareasSinCultivar}
        </div>
        <div class="data-item">
            <span>Hectáreas de Caña:</span> ${data.hectareasCana}
        </div>
        <div class="data-item">
            <span>Hectáreas de Café:</span> ${data.hectareasCafe}
        </div>
    `;
}

// Función para manejar el autocompletado
function setupAutocomplete() {
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocompleteList');
    const municipalities = getMunicipalityNames();

    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        autocompleteList.innerHTML = '';
        
        if (!value) {
            autocompleteList.style.display = 'none';
            return;
        }

        const matches = municipalities.filter(name => 
            name.toLowerCase().includes(value)
        );

        if (matches.length > 0) {
            autocompleteList.style.display = 'block';
            matches.forEach(name => {
                const div = document.createElement('div');
                div.textContent = name;
                div.addEventListener('click', () => {
                    searchInput.value = name;
                    autocompleteList.style.display = 'none';
                    displayMunicipalityData(name);
                    highlightMunicipality(name);
                });
                autocompleteList.appendChild(div);
            });
        } else {
            autocompleteList.style.display = 'none';
        }
    });

    // Cerrar la lista de autocompletado cuando se hace clic fuera
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            autocompleteList.style.display = 'none';
        }
    });
}

// Función para resaltar el municipio seleccionado
function highlightMunicipality(name) {
    let poligonoSeleccionado = null;
    // Selecciona todos los elementos <a> dentro del SVG
    const enlaces = document.querySelectorAll('#map-box svg a');
    
    // Itera sobre los enlaces para encontrar el que tiene el nombre especificado
    enlaces.forEach(enlace => {
        const titulo = enlace.getAttribute('xlink:title');
        const poligono = enlace.querySelector('polygon, path'); // Selecciona el polígono o el path dentro del enlace

        if (titulo === name) {
            // Cambia el color del polígono seleccionado
            poligono.setAttribute('fill', '#503bff'); // Cambia a rojo o el color que prefieras
        } else {
            poligono.setAttribute('fill', '#500b96'); // Cambia
        }
    });
}

// Configurar los eventos de clic en el mapa
function setupMapInteractions() {
    // Agregar target="_blank" a todos los enlaces
    document.querySelectorAll('#map-box svg a').forEach(link => {
        link.setAttribute('target', '_blank');
        
        // Agregar el evento de clic
        link.addEventListener('click', function(e) {
            // Prevenir la navegación si se hace clic en el path o polygon
            if (e.target.tagName.toLowerCase() === 'path' || 
                e.target.tagName.toLowerCase() === 'polygon') {
                e.preventDefault();
                const name = this.getAttribute('xlink:title');
                document.getElementById('searchInput').value = name;
                displayMunicipalityData(name);
                highlightMunicipality(name);
            }
            // Si se hace clic en el enlace directamente, se abrirá en una nueva pestaña
        });
    });
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    setupAutocomplete();
    setupMapInteractions();
});