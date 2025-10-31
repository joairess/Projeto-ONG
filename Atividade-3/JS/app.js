document.addEventListener('DOMContentLoaded', () => {


    const appRoot = document.getElementById('app-root');
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');


    const routes = {
        'inicio': 'pages/inicio.html',
        'projetos': 'pages/projetos.html',
        'cadastro': 'pages/cadastro.html',
        'contato': null 
    };


    async function loadPage(page) {

        if (page === 'contato') {
            document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const path = routes[page];
        if (!path) {
            console.error(`Rota não encontrada: ${page}`);
            loadPage('inicio'); 
            return;
        }

        try {

            const response = await fetch(path);
            if (!response.ok) throw new Error('Falha ao carregar a página.');
            
            const html = await response.text();
            

            appRoot.innerHTML = html;
            

            executePageScripts(page);
            

            updateActiveLink(page);
            

            if (navMenu.classList.contains('is-active')) {
                navMenu.classList.remove('is-active');
                navToggle.classList.remove('is-active');
            }

        } catch (error) {
            console.error('Erro ao carregar página:', error);
            appRoot.innerHTML = '<div class="container"><p>Erro ao carregar o conteúdo. Tente novamente.</p></div>';
        }
    }


    function updateActiveLink(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }


    function handleNavClick(event) {

        const targetLink = event.target.closest('.nav-link');
        
        if (targetLink) {
            event.preventDefault(); 
            const page = targetLink.dataset.page;
            

            if (page !== 'contato') {
                window.location.hash = page;
            } else {
                loadPage('contato'); 
            }
        }
    }


    function handleHashChange() {

        const page = window.location.hash.substring(1) || 'inicio';
        
        if (routes[page] !== undefined) {
            loadPage(page);
        } else {
            loadPage('inicio'); 
        }
    }


    function executePageScripts(page) {
        if (page === 'cadastro') {

            initCadastroPage();
        }
    }


    function initCadastroPage() {
        const form = document.getElementById('cadastro-form');
        if (!form) return; 


        try {
            IMask(document.getElementById('cep'), { mask: '00000-000' });
            IMask(document.getElementById('cpf'), { mask: '000.000.000-00' });
            IMask(document.getElementById('telefone'), {
                mask: [
                    { mask: '(00) 0000-0000' },
                    { mask: '(00) 00000-0000' }
                ]
            });
        } catch (e) {
            console.warn("IMask.js não foi carregado ou falhou.", e);
        }


        form.addEventListener('submit', function(event) {

            event.preventDefault();

            if (validateForm(form)) {

                alert('Formulário enviado com sucesso! (Simulação)');
                form.reset();
                form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
            } else {

                alert('Por favor, corrija os erros no formulário.');
            }
        });
    }


    function validateForm(form) {
        let isFormValid = true;
        const inputs = form.querySelectorAll('[required]'); 

        inputs.forEach(input => {

            input.classList.remove('is-valid', 'is-invalid');


            if (input.checkValidity()) {
                input.classList.add('is-valid');
            } else {
                input.classList.add('is-invalid');
                isFormValid = false; 
            }
        });

        return isFormValid;
    }



    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('is-active');
        navToggle.classList.toggle('is-active');
    });


    document.querySelector('.main-header').addEventListener('click', handleNavClick);
    

    window.addEventListener('hashchange', handleHashChange);


    handleHashChange();
});