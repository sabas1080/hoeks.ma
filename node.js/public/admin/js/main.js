var socket = io.connect('http://localhost:8080', {
    'forceNew': true
});

socket.on('menu', function(data) {
    console.log(data);
    rendercuenta(data);
});

var cuenta = [`
<th>Id</th>
<th>Nombre</th>
<th>Descripcion</th>
<th>Precio</th>
<th>imagen</th>
<th>Imagen Previo</th>
<th></th>
`];
var i = 1;

function rendercuenta(a) {
    cuenta[i] = ` <tr>
              <td>${a.id}</td>
              <td>${a.nombre}</td>
              <td>${a.descripcion}</td>
              <td>${a.precio}</td>
              <td>${a.imagen}</td>
              <td><img src="${a.imagen}" ></td>
              <td>
                <button class="actualibtn" type="button" onclick="eliminar(${i})" name="button">Editar</button>
                <button class="elimiarbtn" type="button" onclick="eliminar(${i})" name="button">Eliminar</button>
              </td>
            </tr>
            `;
    imprimir();
    i++;
}

function eliminar(o) {
    cuenta[o] = '';
    imprimir();
}

function imprimir() {
    var temp = '';
    for (var t = 0; t < cuenta.length; t++) {
        temp += cuenta[t];
    }
    document.getElementById('cuenta').innerHTML = temp;
}
