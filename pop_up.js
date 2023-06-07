const openPopUp = document.getElementById('open_pop_up');
const closePopUp = document.getElementById('pop_up_close');
const popUp = document.getElementById('pop_up');
const openPopUp_reg = document.getElementById('open_pop_up');
const closePopUp_reg = document.getElementById('pop_up_register_close');
const popUp_reg = document.getElementById('registerPopUp');
const btn_reg_confirm = document.getElementById('reg_btn_confirm')

openPopUp.addEventListener('click', (e) => {
    e.preventDefault();
    popUp.classList.add('active');
});

closePopUp.addEventListener('click', () => {
    popUp.classList.remove('active');
});

openPopUp_reg.addEventListener('click', (e) => {
    e.preventDefault();
    popUp_reg.classList.add('active');
});

closePopUp_reg.addEventListener('click', () => {
    popUp_reg.classList.remove('active');
});

document.getElementById('registerLink').addEventListener('click', function(event) {
    event.preventDefault(); 
  
    popUp.style.display = 'none';
  
    popUp_reg.style.display = 'block';

  });

  btn_reg_confirm.addEventListener('click', function(event) {
    event.preventDefault(); 

    popUp_reg.style.display = 'none';

    window.location.reload();
  });  