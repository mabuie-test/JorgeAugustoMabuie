// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {

  // Smooth scroll para links do menu
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = this.getAttribute('href');
      if (!target || target === '#') return;
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Util: criar botão
  function makeBtn(text, cls = 'btn btn-sm btn-outline-primary', attrs = {}) {
    const a = document.createElement('a');
    a.className = cls;
    a.textContent = text;
    Object.keys(attrs).forEach(k => a.setAttribute(k, attrs[k]));
    return a;
  }

  // Carregar projects (Portfólio)
  (async function loadProjects(){
    const container = document.getElementById('projects');
    if (!container) return;
    try {
      const res = await fetch('/api/projects');
      const projects = res.ok ? await res.json() : [];
      if (!projects || projects.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">Ainda não há projectos. <a href="#contact">Solicite um serviço</a> ou aguarde actualizações.</div></div>`;
        return;
      }
      projects.forEach(p => {
        const col = document.createElement('div'); col.className='col-md-4';
        const img = (p.images && p.images[0]) ? p.images[0] : '/assets/project1.jpg';
        col.innerHTML = `
          <div class="card h-100">
            <img src="${img}" class="card-img-top" alt="${p.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.title}</h5>
              <p class="card-text">${(p.description||'').slice(0,140)}</p>
              <div class="mt-auto"></div>
            </div>
          </div>`;
        // actions
        const actions = col.querySelector('.mt-auto');
        if (p.link && p.link.length) {
          actions.appendChild(makeBtn('Ver projeto', 'btn btn-primary btn-sm me-2', { href: p.link, target: '_blank', rel: 'noopener' }));
        } else {
          // link interno (project page) - fallback
          actions.appendChild(makeBtn('Ver projecto', 'btn btn-primary btn-sm me-2', { href: `/project.html?id=${p._id}` }));
        }
        actions.appendChild(makeBtn('Solicitar', 'btn btn-outline-secondary btn-sm', { href: '#contact' }));
        container.appendChild(col);
      });
    } catch (err) {
      console.error('Erro ao carregar projectos', err);
      container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Erro ao carregar projectos.</div></div>`;
    }
  })();

  // Carregar publications (Publicações)
  (async function loadPublications(){
    const container = document.getElementById('publicationsList');
    if (!container) return;
    try {
      const res = await fetch('/api/publications');
      const items = res.ok ? await res.json() : [];
      if (!items || items.length === 0) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-info">Ainda não há publicações. <a href="#contact">Contacte-me</a> para mais informações.</div></div>`;
        return;
      }
      items.forEach(it => {
        const col = document.createElement('div'); col.className='col-md-6';
        col.innerHTML = `
          <div class="card h-100">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${it.title}</h5>
              <p class="card-text">${(it.summary||'').slice(0,180)}</p>
              <p class="small text-muted mb-2">${new Date(it.publishedAt||it.createdAt).toLocaleDateString()} • ${it.author||'Autor não definido'}</p>
              <div class="mt-auto"></div>
            </div>
          </div>`;
        const actions = col.querySelector('.mt-auto');
        actions.appendChild(makeBtn('Ler mais', 'btn btn-outline-primary btn-sm me-2', { href: `/publication.html?slug=${it.slug}` }));
        actions.appendChild(makeBtn('Download anexos', 'btn btn-sm btn-outline-secondary', { href: `/publication.html?slug=${it.slug}#attachments` }));
        container.appendChild(col);
      });
    } catch (err) {
      console.error('Erro ao carregar publicações', err);
      container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Erro ao carregar publicações.</div></div>`;
    }
  })();

  // Carregar serviços (se tiveres lista dinâmica — senão garantimos botões)
  (function showServices(){
    const container = document.getElementById('servicesList');
    if (!container) {
      // se não houver container, garante link no bloco de serviços
      const servicesBlock = document.getElementById('services');
      if (servicesBlock) {
        const btn = makeBtn('Solicitar Orçamento', 'btn btn-primary', { href: '#contact' });
        servicesBlock.appendChild(btn);
      }
      return;
    }
    // exemplo de serviços (se não houver backend para serviços)
    const services = [
      { title: 'Consultoria científica', desc: 'Apoio na execução de trabalhos científicos e monografias.' },
      { title: 'Desenvolvimento web', desc: 'Sites, apps e integrações.' },
      { title: 'Projetos eléctricos', desc: 'Instalações, planeamento e consultoria técnica.' }
    ];
    services.forEach(s => {
      const col = document.createElement('div'); col.className='col-md-4';
      col.innerHTML = `<div class="card h-100"><div class="card-body d-flex flex-column"><h5 class="card-title">${s.title}</h5><p class="card-text">${s.desc}</p><div class="mt-auto"></div></div></div>`;
      const actions = col.querySelector('.mt-auto');
      actions.appendChild(makeBtn('Solicitar', 'btn btn-primary btn-sm', { href: '#contact' }));
      container.appendChild(col);
    });
  })();

  // Contact form (envia pedido de serviço)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const feedback = document.getElementById('feedback');

      try {
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, serviceType: 'Contact', message })
        });
        const data = await res.json();
        if (res.ok) {
          feedback.textContent = 'Mensagem enviada! Obrigado.';
          feedback.className = 'text-success';
          contactForm.reset();
        } else {
          feedback.textContent = data.error || 'Erro ao enviar';
          feedback.className = 'text-danger';
        }
      } catch (err) {
        console.error(err);
        feedback.textContent = 'Erro no servidor';
        feedback.className = 'text-danger';
      }
    });
  }

}); // DOMContentLoaded
