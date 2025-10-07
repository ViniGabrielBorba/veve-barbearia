const menuToggle = document.getElementById("menu-toggle");
const navbar = document.querySelector(".navbar");

menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active"); // abre/fecha menu lateral
    menuToggle.classList.toggle("open"); // anima o X
});


// AGENDAMENTO WHATSAPP
document.getElementById('bookingForm')?.addEventListener('submit', function(e){
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    if(nome && telefone && servico && data && hora){
        const phoneNumber = "5581987378298"; // número sem sinais
        const message = `Olá! Tenho um novo agendamento:%0ANome: ${nome}%0ATelefone: ${telefone}%0AServiço: ${servico}%0AData: ${data}%0AHora: ${hora}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappUrl, '_blank');
        this.reset();
        alert('Agendamento enviado com sucesso!');
    } else {
        alert('Preencha todos os campos!');
    }
});
