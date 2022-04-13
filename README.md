# security-authentication

En este proyecto se maneja el flujo de inicio de sesión ya sea para registrar un nuevo usuario o acceder con uno existente.
Se toma en cuenta las medidas seguridad para mantener la integridad de los datos almacenados aplicando conceptos como encriptación, hashing passwords y más. 

![alt text](https://github.com/Eligio16/security-authentication/blob/main/views/docs-img/Screenshot%202022-04-08%20150846.png)

Se utiliza el método GET para el direccionamiento, y se reutiliza la interfaz mediante plantillas de EJS (EJS Templating).

Para la base de datos se utiliza MongoDB y se establece una conexión local. Contiene un esquema para almacenar los usuarios. Una vez almacenados se ven de la siguiente manera:

![alt text](https://github.com/Eligio16/security-authentication/blob/main/views/docs-img/Screenshot%202022-04-08%20150521.png)

Level 1: Los datos son almacenados en texto plano en la base de datos como username y password. Nivel de seguridad: Muy baja.

Level 2: Las contraseñas ahora son encryptadas mediante la dependencia de "mongoose encryption". El cifrado se realiza mediante AES-256-CBC con un vector de inicialización único y aleatorio para cada operación. La autenticación se realiza mediante HMAC-SHA-512. 

![alt text](https://github.com/Eligio16/security-authentication/blob/main/views/docs-img/Screenshot%202022-04-08%20195041.png)

Level 2.1: usando variables de entorno "dotenv" para mantener las contraseñas segura en archivos externos.

Level 3: se añade funciones hash usando npm MD5 para almacenar las contraseñas encriptadas en la base de datos.

Level 4: se añade "Salt rounds" para incrementar aun más el nivel de seguridad. Se utiliza el paquete bcrypt de npm que hace mucho más potente la seguridad del hash.

Level 5: Se actualizan los métodos de almacenamiento implementando coockies y autenticación. Para esto se utilizan los paquetes npm "express session", "passport", "passport-local-mongoose".
Passport es un middleware de autenticación para Node.js. Está diseñado para servir a un propósito singular: autenticar solicitudes. Como ventajas ofrece una fácil integración y una variedad de formas de inicio de sesión, además de cifrados robustos como se puede ver en la siguiente imagen.

![alt text](https://github.com/Eligio16/security-authentication/blob/main/views/docs-img/Screenshot%202022-04-13%20153509.png)
