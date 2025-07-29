document.querySelectorAll('.list a').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    if (href && href !== '#') {
      e.preventDefault(); // Impede redirecionamento imediato

      // Exibe o loader
      const loader = document.getElementById('loader');
      if (loader) {
        loader.classList.remove('hidden');
      }

      // Aguarda 2.5s e redireciona
      setTimeout(() => {
        window.location.href = href;
      }, 2500);
    }
  });
});
