$(document).ready(function() {
    const productosSeleccionados = [];
    let productos = [];

$.getJSON('/api/productos', function(data) {
    productos = data;
    const container = $('#comprar-container');
    let cardsCreated = 0;

    $.each(data, function(index, producto) {
        if (cardsCreated % 2 === 0) {
            const rowContainer = $('<div>').addClass('row-container');
            container.append(rowContainer);
        }

        const card = $('<div>').addClass('card').addClass('w-auto'); // Agregar la clase w-auto para ancho automático
        card.html(`
            <img src="${producto.imagenUrl}" class="card-img-top" alt="${producto.nombre}">
            <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion}</p>
            </div>
        `);

        const button = $('<button>').addClass('btn btn-primary');
        button.text('Agregar al carrito');
        button.data('productId', producto.id);

        button.on('click', function() {
            productosSeleccionados.push(producto.id);
            console.log('Producto agregado al carrito:', producto.id);
            $(this).prop('disabled', true);
        });

        card.append(button);
        container.children('.row-container:last').append(card);
        cardsCreated++;
    });
});


    $('#shoopButton').on('click', function() {
        const carritoContainer = $('#carrito-container');
        carritoContainer.empty();

        $.each(productos, function(index, producto) {
            if (productosSeleccionados.includes(producto.id)) {
                const productoElement = $(`
                    <div class="producto-carrito mb-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h5>${producto.nombre}</h5>
                            <p>Precio: ${producto.precio}</p>
                            <input type="number" class="form-control cantidad-producto" data-producto-id="${producto.id}" value="1" min="1">
                        </div>
                        <button class="btn btn-danger eliminar-producto" data-producto-id="${producto.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `);

                carritoContainer.append(productoElement);
            }
        });

        calcularTotal();

        $('.cantidad-producto').on('input', function() {
            calcularTotal();
        });

        $('.eliminar-producto').on('click', function() {
            const productoId = $(this).data('producto-id');
            eliminarProductoDelCarrito(productoId);
            $(this).closest('.producto-carrito').remove();
            calcularTotal();
            // Habilitar el botón correspondiente al producto eliminado
            $(`.btn[data-producto-id="${productoId}"]`).prop('disabled', false);
        });
    });

    function calcularTotal() {
        let totalPrecio = 0;
        $('.cantidad-producto').each(function() {
            const productoId = $(this).data('producto-id');
            const cantidad = $(this).val();
            const producto = productos.find(p => p.id === productoId);
            const precioNumerico = parseFloat(producto.precio.replace(',', ''));
            totalPrecio += precioNumerico * cantidad;
        });

        $('#total-precio').text(totalPrecio);
    }

    $('#modalFacturaClose').on('click', function() {
        location.reload();
    });

    $('#modalCancelar').on('click', function() {
        location.reload();
    });

    function eliminarProductoDelCarrito(productoId) {
        const index = productosSeleccionados.indexOf(productoId);
        if (index !== -1) {
            productosSeleccionados.splice(index, 1);
        }

        // Reactivar el botón correspondiente
        $(`.btn[data-producto-id="${productoId}"]`).prop('disabled', false);
    }

    $('#pay-button').on('click', function() {
        $('#payment-form').show();
        $(this).hide();
        $('#confirm-payment').show();
    });

    $('#confirm-payment').on('click', function() {
        if (validarFormularioPago()) {
            alert('Pago realizado con éxito.');
            $('#staticBackdrop').modal('hide');
            $('#facturaModal').modal('show');
            guardarFactura();
            mostrarFactura();
        }
    });

    function validarFormularioPago() {
        let valid = true;
        const cardNumber = $('#card-number').val();
        const cardExpiry = $('#card-expiry').val();
        const cardCvc = $('#card-cvc').val();

        // Validación del número de tarjeta (simplificada)
        if (cardNumber.length < 16) {
            $('#card-number').addClass('is-invalid');
            valid = false;
        } else {
            $('#card-number').removeClass('is-invalid');
        }

        // Validación de la fecha de expiración (simplificada)
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            $('#card-expiry').addClass('is-invalid');
            valid = false;
        } else {
            $('#card-expiry').removeClass('is-invalid');
        }

        // Validación simple de la dirección
        var address = $('#address').val();
        if (address.trim() === '') {
            $('#address').addClass('is-invalid');
            valid = false;
        } else {
            $('#address').removeClass('is-invalid');
        }

        // Validación del CVC (simplificada)
        if (cardCvc.length < 3) {
            $('#card-cvc').addClass('is-invalid');
            valid = false;
        } else {
            $('#card-cvc').removeClass('is-invalid');
        }

        return valid;
    }

    function guardarFactura() {
        const factura = {
            direccion: $('#address').val(),
            total: parseFloat($('#total-precio').text()),
            detalles: []
        };

        productosSeleccionados.forEach(productoId => {
            const cantidad = obtenerCantidadProducto(productoId);
            const producto = productos.find(p => p.id === productoId);
            const detalle = {
                nombreProducto: producto.nombre,
                cantidad: cantidad,
                precioUnitario:                 parseFloat(producto.precio.replace(',', '')),
                                                precioTotal: cantidad * parseFloat(producto.precio.replace(',', ''))
                                            };
                                            factura.detalles.push(detalle);
                                        });

                                        $.ajax({
                                            type: 'POST',
                                            url: '/api/facturas/guardar',
                                            contentType: 'application/json',
                                            data: JSON.stringify(factura),
                                            success: function(response) {
                                                console.log('Factura guardada:', response);
                                            },
                                            error: function(xhr, status, error) {
                                                console.error('Error al guardar la factura:', error);
                                            }
                                        });
                                    }

                                    function mostrarFactura() {
                                        const facturaContainer = $('#factura-container');
                                        facturaContainer.empty(); // Vacía el contenido anterior de la factura

                                        let totalGeneral = 0; // Variable para calcular el total general de la factura

                                        productosSeleccionados.forEach(productoId => {
                                            const producto = productos.find(p => p.id === productoId);
                                            const cantidad = obtenerCantidadProducto(productoId);
                                            const precioNumerico = parseFloat(producto.precio.replace(',', ''));
                                            const totalProducto = cantidad * precioNumerico;

                                            const filaProducto = `
                                                <tr>
                                                    <td>${producto.nombre}</td>
                                                    <td>${cantidad}</td>
                                                    <td>$${precioNumerico.toFixed(2)}</td>
                                                    <td>$${totalProducto.toFixed(2)}</td>
                                                </tr>
                                            `;

                                            facturaContainer.append(filaProducto);

                                            totalGeneral += totalProducto;
                                        });

                                        const totalGeneralHTML = `<h5>Total: $${totalGeneral.toFixed(2)}</h5>`;
                                        const address = $('#address').val();
                                        const direccionHTML = `<h5>Dirección: ${address}</h5>`;

                                        facturaContainer.append(totalGeneralHTML);
                                        facturaContainer.append(direccionHTML);

                                        $('#facturaModal').modal('show');
                                    }

                                    function obtenerCantidadProducto(productoId) {
                                        return parseInt($(`input[data-producto-id="${productoId}"]`).val());
                                    }

                                    // Función para capturar y descargar la pantalla
                                    $("#btnDescargar").click(function() {
                                        html2canvas(document.getElementById('facturaModal')).then(function(canvas) {
                                            var imgData = canvas.toDataURL('image/png');

                                            var link = document.createElement('a');
                                            link.download = 'captura.png';
                                            link.href = imgData;
                                            link.click();
                                        });
                                    });
                                });

