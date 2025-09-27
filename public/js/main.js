
(async function(){
  // load projects
  try{
    const r = await fetch('/api/projects');
    const projects = await r.json();
    const container = document.getElementById('projects');
    if (projects && projects.length) {
      projects.forEach(p => {
        const col = document.createElement('div'); col.className='col-md-4';
        col.innerHTML = `<div class="card h-100"><img src="${p.images && p.images[0]||'/assets/project1.jpg'}" class="card-img-top"><div class="card-body"><h5 class="card-title">${p.title}</h5><p class="card-text">${p.description||''}</p></div></div>`;
        container.appendChild(col);
      });
    }
  }catch(e){console.error(e)}

  // load publications
  try{
    const r = await fetch('/api/publications');
    const items = await r.json();
    const c = document.getElementById('publicationsList');
    items.forEach(it => {
      const col = document.createElement('div'); col.className='col-md-6';
      col.innerHTML = `<div class="card"><div class="card-body"><h5>${it.title}</h5><p>${it.summary||''}</p><p><small>${new Date(it.publishedAt||it.createdAt).toLocaleDateString()}</small></p><a href="/publication.html?slug=${it.slug}" class="btn btn-sm btn-outline-primary">Ler mais</a></div></div>`;
      c.appendChild(col);
    });
  }catch(e){console.error(e)}

  // contact form
  document.getElementById('contactForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const res = await fetch('/api/requests', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,serviceType:'Contact',message})});
    const data = await res.json();
    document.getElementById('feedback').textContent = data.ok ? 'Enviado!' : (data.error||'Erro');
    if (data.ok) document.getElementById('contactForm').reset();
  });
})();
