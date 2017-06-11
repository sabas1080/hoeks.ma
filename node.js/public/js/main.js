var socket = io.connect('http://localhost:8080',{'forceNew': true});

socket.on('menu', function(data){
  console.log(data);
  render(data);
});

var html='';
function render(data) {
  html+=`
    <form class="box" idmen="id${data.id}">
        <img src="${data.imagen}" style="width:100%">
        <div class="container">
          <h4><b>${data.nombre}</b></h4>
          <p>${data.precio}$
            <input class="invs" type="text" id="id${data.id}" value="${data.id}">
            <input class="invs" type="text" id="nombre${data.id}" value="${data.nombre}">
            <input class="invs" type="text" id="precio${data.id}" value="${data.precio}">
            <button onclick="return addCuenta(this,${data.id})"type="submit" name="button">Enviar</button>
          </p>
        </div>
    </form>
    `;
    document.getElementById('appmenu').innerHTML=html;
};
///////////////////////////////////////////////////////////////////////////7
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.mesa-btn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
