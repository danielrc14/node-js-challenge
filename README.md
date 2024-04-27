# PINFLAG NODE JS CHALLENGE

Supuestos y cosas a considerar:
- Todo, a excepción de este documento, está en inglés.
- Para el primer endpoint, se asume que N se entrega como query param, y en caso de no estar presente, se reemplaza por 20 como valor por defecto.
- Para el tercer endpoint, se asume que el nombre entregado no debe ser necesariamente igual al nombre de algún personaje, se permite ingresar parte del nombre, y sin considerar mayúsculas o minúsculas al buscar.
- El código base no fue cambiado, excepto por cosas específicas, y se siguió la misma convención de nombres de archivo, estructura, etc.
- Para testear se usó Jest y Supertest. Jest para realizar las pruebas unitarias, y Supertest para hacer requests a la api dentro de las pruebas. Para correr los tests y ver el coverage, se puede usar el comando `npm test`.
- Para documentar se usó Swagger, y la documentación puede ser visualizada en `/docs` dentro de la aplicación.