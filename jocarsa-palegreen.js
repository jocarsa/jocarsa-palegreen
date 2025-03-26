(function() {
  // Esperamos a que el DOM se cargue completamente
  document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos todos los inputs con la clase 'jocarsa-palegreen-signature'
    var inputs = document.querySelectorAll('input.jocarsa-palegreen-signature');
    inputs.forEach(function(originalInput) {
      // Creamos el contenedor
      var container = document.createElement('div');
      container.className = 'jocarsa-palegreen-signature-container';

      // Creamos el canvas para la firma
      var canvas = document.createElement('canvas');
      canvas.className = 'jocarsa-palegreen-signature-canvas';
      // Dimensiones por defecto (se pueden ajustar o parametrizar)
      canvas.width = 300;
      canvas.height = 150;

      // Creamos un input oculto para almacenar la firma en base64
      var hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      // Transferimos algunos atributos del input original (por ejemplo, name e id)
      if(originalInput.hasAttribute('name')) {
        hiddenInput.name = originalInput.getAttribute('name');
      }
      if(originalInput.hasAttribute('id')) {
        hiddenInput.id = originalInput.getAttribute('id');
      }

      // Agregamos canvas e input oculto al contenedor
      container.appendChild(canvas);
      container.appendChild(hiddenInput);

      // Reemplazamos el input original por el contenedor
      originalInput.parentNode.replaceChild(container, originalInput);

      // Configuración del canvas para capturar la firma
      var ctx = canvas.getContext('2d');
      var isDrawing = false;
      var lastX = 0;
      var lastY = 0;

      // Función para iniciar el trazo
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

      // Función para trazar según el movimiento
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
        // Dibujamos una línea desde el último punto hasta el actual
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
        // Actualizamos las coordenadas
        lastX = currentX;
        lastY = currentY;
        // Actualizamos el input oculto con el contenido del canvas en base64
        hiddenInput.value = canvas.toDataURL('image/png');
        e.preventDefault();
      }

      // Función para finalizar el trazo
      function stopDrawing(e) {
        isDrawing = false;
        e.preventDefault();
      }

      // Eventos para dispositivos con mouse
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);

      // Eventos para dispositivos táctiles
      canvas.addEventListener('touchstart', startDrawing);
      canvas.addEventListener('touchmove', draw);
      canvas.addEventListener('touchend', stopDrawing);
      canvas.addEventListener('touchcancel', stopDrawing);
    });
  });
})();

