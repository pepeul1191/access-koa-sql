import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

document.addEventListener('DOMContentLoaded', function() {
  const flashAlerts = document.querySelectorAll('.alert.alert-dismissible');
  
  flashAlerts.forEach(alert => {
    const timeout = 10000; // 10 segundos
    
    setTimeout(() => {
      // Añadir animación de salida
      alert.style.transition = 'opacity 0.5s ease';
      alert.style.opacity = '0';
      
      // Remover del DOM después de la animación
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 500);
    }, timeout);
  });
});