document.getElementById('bookingForm')?.addEventListener('submit', function(e){
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if(name && date && time){
        const phoneNumber = "5599999999999"; // coloque seu número
        const message = `Olá! Tenho um novo agendamento:\nNome: ${name}\nData: ${date}\nHora: ${time}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
        document.getElementById('bookingForm').reset();
        alert('Agendamento enviado com sucesso!');
    } else {
        alert('Preencha todos os campos!');
    }
});
