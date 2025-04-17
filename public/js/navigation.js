document.addEventListener('DOMContentLoaded', () => {
  const pageSequence = [
    '/', '/datos-iniciales', '/objetivos-saberes', '/competencias',
    '/actividades', '/evaluacion', '/revision-final'
  ];
  const STORAGE_KEY = 'situacionAprendizajeData';

  function loadSAData() {
    const data = sessionStorage.getItem(STORAGE_KEY);
    const defaults = {
        curso: '', materia: '', contexto: '', objetivos: '',
        saberes: [], competencias_clave: [], competencias_especificas: [],
        metodologia: '', actividades: '',
        evaluacion_criterios: [], // Nuevo array
        evaluacion_instrumentos: '' // Nuevo campo
    };
    const loadedData = data ? JSON.parse(data) : {};
    const validatedData = { ...defaults, ...loadedData };
    for (const key of ['saberes', 'competencias_clave', 'competencias_especificas', 'evaluacion_criterios']) {
        if (!Array.isArray(validatedData[key])) {
            validatedData[key] = defaults[key];
        }
    }
    return validatedData;
  }

  function saveSAData(data) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  let saData = loadSAData();

  function populateForm() {
      // Datos Iniciales
      const cursoInput = document.getElementById('curso');
      const materiaInput = document.getElementById('materia');
      const contextoTextarea = document.getElementById('contexto');
      if (cursoInput && saData.curso) cursoInput.value = saData.curso;
      if (materiaInput && saData.materia) materiaInput.value = saData.materia;
      if (contextoTextarea && saData.contexto) contextoTextarea.value = saData.contexto;

      // Objetivos y Saberes
      const objetivosTextarea = document.getElementById('objetivos');
      if (objetivosTextarea && saData.objetivos) objetivosTextarea.value = saData.objetivos;
      const saberesHiddenInput = document.getElementById('saberes');
       if (saberesHiddenInput && Array.isArray(saData.saberes)) {
           saberesHiddenInput.value = JSON.stringify(saData.saberes);
           // Lógica futura para mostrar saberes
       }

      // Competencias
      const checkboxesClave = document.querySelectorAll('input[name="competencia_clave"][type="checkbox"]');
      checkboxesClave.forEach(checkbox => { checkbox.checked = saData.competencias_clave.includes(checkbox.value); });
      const checkboxesEspecificas = document.querySelectorAll('input[name="competencia_especifica"][type="checkbox"]');
      checkboxesEspecificas.forEach(checkbox => { checkbox.checked = saData.competencias_especificas.includes(checkbox.value); });

      // Actividades y Metodología
      const metodologiaSelect = document.getElementById('metodologia');
      const actividadesTextarea = document.getElementById('actividades');
      if (metodologiaSelect && saData.metodologia) metodologiaSelect.value = saData.metodologia;
      if (actividadesTextarea && saData.actividades) actividadesTextarea.value = saData.actividades;

      // Evaluación
      const evaluacionInstrumentosTextarea = document.getElementById('evaluacion_instrumentos');
      if (evaluacionInstrumentosTextarea && saData.evaluacion_instrumentos) {
          evaluacionInstrumentosTextarea.value = saData.evaluacion_instrumentos;
      }
      const criteriosHiddenInput = document.getElementById('evaluacion_criterios');
       if (criteriosHiddenInput && Array.isArray(saData.evaluacion_criterios)) {
           criteriosHiddenInput.value = JSON.stringify(saData.evaluacion_criterios);
           // Lógica futura para mostrar criterios
       }
  }

  populateForm();

  // Listener genérico para actualizar saData y guardar en sessionStorage
  function handleFormInput(event) {
      const { name, value, type, checked } = event.target;
      if (name) {
          if (type === 'checkbox') {
              let targetArray = null;
              // Identificar a qué array pertenece el checkbox
              if (name === 'competencia_clave') targetArray = saData.competencias_clave;
              else if (name === 'competencia_especifica') targetArray = saData.competencias_especificas;
              // else if (name === 'saber_basico') targetArray = saData.saberes; // Ejemplo futuro
              // else if (name === 'criterio_evaluacion') targetArray = saData.evaluacion_criterios; // Ejemplo futuro

              if (targetArray) {
                  if (checked) {
                      if (!targetArray.includes(value)) targetArray.push(value);
                  } else {
                      const index = targetArray.indexOf(value);
                      if (index > -1) targetArray.splice(index, 1);
                  }
              } else { console.warn('Checkbox sin array de destino:', name); }
          } else {
              // Inputs normales (text, textarea, select-one)
              saData[name] = value;
          }
          // console.log('Datos actualizados:', saData);
          saveSAData(saData);
      }
  }

  // Aplicar listener a los formularios existentes
  const formDatosIniciales = document.getElementById('form-datos-iniciales');
  if (formDatosIniciales) formDatosIniciales.addEventListener('input', handleFormInput);

  const formObjetivosSaberes = document.getElementById('form-objetivos-saberes');
  if (formObjetivosSaberes) formObjetivosSaberes.addEventListener('input', handleFormInput);

  const formCompetencias = document.getElementById('form-competencias');
  if (formCompetencias) formCompetencias.addEventListener('change', handleFormInput);

  const formActividades = document.getElementById('form-actividades');
  if (formActividades) formActividades.addEventListener('input', handleFormInput);

  const formEvaluacion = document.getElementById('form-evaluacion');
  if (formEvaluacion) formEvaluacion.addEventListener('input', handleFormInput); // 'input' para textarea


  // --- Navegación (sin cambios) ---
  const currentPagePath = window.location.pathname;
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (!btnPrev || !btnNext) { return; }
  const currentIndex = pageSequence.indexOf(currentPagePath);

  // Botón Anterior
  if (currentIndex <= 0) {
    btnPrev.disabled = true;
    btnPrev.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    btnPrev.disabled = false;
    btnPrev.classList.remove('opacity-50', 'cursor-not-allowed');
    btnPrev.addEventListener('click', () => { window.location.href = pageSequence[currentIndex - 1]; });
  }

  // Botón Siguiente / Comenzar / Exportar
  if (currentIndex === -1 || currentIndex >= pageSequence.length - 1) {
    if (currentPagePath === '/revision-final') {
        btnNext.textContent = 'Exportar (Final)';
        btnNext.classList.remove('bg-blue-600', 'hover:bg-blue-700');
        btnNext.classList.add('bg-green-600', 'hover:bg-green-700');
        btnNext.addEventListener('click', () => { alert('Funcionalidad de Exportar no implementada todavía.'); });
    } else if (currentPagePath === '/') {
        btnNext.textContent = 'Comenzar';
         btnNext.addEventListener('click', () => { window.location.href = pageSequence[currentIndex + 1]; });
    } else {
        btnNext.disabled = true;
        btnNext.classList.add('opacity-50', 'cursor-not-allowed');
        btnNext.textContent = 'Siguiente';
    }
  } else {
    btnNext.disabled = false;
    btnNext.classList.remove('opacity-50', 'cursor-not-allowed');
    btnNext.textContent = 'Siguiente';
    btnNext.addEventListener('click', () => { window.location.href = pageSequence[currentIndex + 1]; });
  }
});
