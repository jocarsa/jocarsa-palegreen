(function() {
  document.addEventListener('DOMContentLoaded', function() {

    /* ===== Campo de Firma ===== */
    var signatureInputs = document.querySelectorAll('input.jocarsa-palegreen-signature');
    signatureInputs.forEach(function(originalInput) {
      // Crear contenedor y elementos
      var container = document.createElement('div');
      container.className = 'jocarsa-palegreen-signature-container';

      var canvas = document.createElement('canvas');
      canvas.className = 'jocarsa-palegreen-signature-canvas';
      canvas.width = 300;
      canvas.height = 150;

      var hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      if(originalInput.hasAttribute('name')) {
        hiddenInput.name = originalInput.getAttribute('name');
      }
      if(originalInput.hasAttribute('id')) {
        hiddenInput.id = originalInput.getAttribute('id');
      }

      container.appendChild(canvas);
      container.appendChild(hiddenInput);
      originalInput.parentNode.replaceChild(container, originalInput);

      var ctx = canvas.getContext('2d');
      var isDrawing = false, lastX = 0, lastY = 0;

      function startDrawing(e) {
        isDrawing = true;
        var rect = canvas.getBoundingClientRect();
        if(e.touches && e.touches.length > 0) {
          lastX = e.touches[0].clientX - rect.left;
          lastY = e.touches[0].clientY - rect.top;
        } else {
          lastX = e.clientX - rect.left;
          lastY = e.clientY - rect.top;
        }
        e.preventDefault();
      }
      function draw(e) {
        if(!isDrawing) return;
        var rect = canvas.getBoundingClientRect();
        var currentX, currentY;
        if(e.touches && e.touches.length > 0) {
          currentX = e.touches[0].clientX - rect.left;
          currentY = e.touches[0].clientY - rect.top;
        } else {
          currentX = e.clientX - rect.left;
          currentY = e.clientY - rect.top;
        }
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        lastX = currentX;
        lastY = currentY;
        hiddenInput.value = canvas.toDataURL('image/png');
        e.preventDefault();
      }
      function stopDrawing(e) {
        isDrawing = false;
        e.preventDefault();
      }
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
      canvas.addEventListener('touchstart', startDrawing);
      canvas.addEventListener('touchmove', draw);
      canvas.addEventListener('touchend', stopDrawing);
      canvas.addEventListener('touchcancel', stopDrawing);
    });

    /* ===== Campo de Coordenadas Geográficas ===== */
    // Creamos un modal global para el selector de coordenadas
    var geoModal = document.createElement('div');
    geoModal.className = 'jocarsa-palegreen-modal';
    geoModal.style.display = 'none';

    var modalContent = document.createElement('div');
    modalContent.className = 'jocarsa-palegreen-modal-content';

    var closeButton = document.createElement('span');
    closeButton.className = 'jocarsa-palegreen-modal-close';
    closeButton.innerHTML = '&times;';
    modalContent.appendChild(closeButton);

    var iframe = document.createElement('iframe');
    iframe.className = 'jocarsa-palegreen-map-iframe';
    iframe.src = 'map-selector.html';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    modalContent.appendChild(iframe);

    geoModal.appendChild(modalContent);
    document.body.appendChild(geoModal);

    var activeGeoHiddenInput = null, activeGeoDisplay = null;

    var geoInputs = document.querySelectorAll('input.jocarsa-palegreen-geocoords');
    geoInputs.forEach(function(originalInput) {
      // Crear contenedor y elementos
      var container = document.createElement('div');
      container.className = 'jocarsa-palegreen-geocoords-container';

      var button = document.createElement('button');
      button.type = 'button';
      button.innerText = 'Seleccionar Coordenadas';

      var display = document.createElement('span');
      display.className = 'jocarsa-palegreen-geocoords-display';
      display.innerText = 'Ninguna coordenada seleccionada';

      var hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      if(originalInput.hasAttribute('name')) {
        hiddenInput.name = originalInput.getAttribute('name');
      }
      if(originalInput.hasAttribute('id')) {
        hiddenInput.id = originalInput.getAttribute('id');
      }

      container.appendChild(button);
      container.appendChild(display);
      container.appendChild(hiddenInput);
      originalInput.parentNode.replaceChild(container, originalInput);

      button.addEventListener('click', function() {
        activeGeoHiddenInput = hiddenInput;
        activeGeoDisplay = display;
        geoModal.style.display = 'block';
      });
    });

    closeButton.addEventListener('click', function() {
      geoModal.style.display = 'none';
    });

    // Se espera el mensaje desde map-selector.html con las coordenadas
    window.addEventListener('message', function(event) {
      if(event.data && event.data.lat && event.data.lng) {
        if(activeGeoDisplay && activeGeoHiddenInput) {
          activeGeoDisplay.innerText = 'Lat: ' + event.data.lat + ', Lng: ' + event.data.lng;
          activeGeoHiddenInput.value = event.data.lat + ',' + event.data.lng;
        }
        geoModal.style.display = 'none';
      }
    });

  });
})();

