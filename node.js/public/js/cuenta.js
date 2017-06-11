function addCuenta(e,is) {

  var message = {
      id: document.getElementById('id'+is).value,
      nombre: document.getElementById('nombre'+is).value,
      precio: document.getElementById('precio'+is).value
    };
console.log(e);
console.log(message);
rendercuenta(message);
return false;
};
var cuenta=[`
<th>Id</th>
<th>Nombre</th>
<th>Precio</th>
<th></th>
`];
var i=1;
function rendercuenta(a) {
  cuenta[i]=` <tr>
              <td>${a.id}</td>
              <td>${a.nombre}</td>
              <td>${a.precio}</td>
              <td><button type="button" onclick="eliminar(${i})" name="button">X</button></td>
            </tr>
            `;
            imprimir();
i++;
}

function eliminar(o) {
cuenta[o]='';
imprimir();
}

function imprimir() {
  var temp='';
  for (var t = 0; t < cuenta.length; t++) {
    temp+=cuenta[t];
  }
document.getElementById('cuenta').innerHTML=temp;
}
