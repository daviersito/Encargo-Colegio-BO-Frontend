#  Sistema de Gestión Escolar - Frontend (BO)

Este repositorio contiene la aplicación frontend para el Sistema de Gestión Escolar (BackOffice). Está construido utilizando *React* y *Vite*, ofreciendo una interfaz rápida y moderna para la administración del colegio.

---

##  Tecnologías Utilizadas

- *React 18*
- *Vite* (Entorno de desarrollo y build)
- *React Router Dom* (Enrutamiento)
- *Bootstrap 5* (Estilos y componentes UI)
- *JWT Decode* (Manejo de tokens de autenticación)

---

##  Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado en tu sistema:

- [Node.js](https://nodejs.org/es/) (Se recomienda la versión 16.0 o superior)
- [NPM](https://www.npmjs.com/) (Viene instalado por defecto con Node.js)

---

##  Instrucciones de Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo local:

### 1. Descargar / Clonar el repositorio
Si clonaste el proyecto usando Git, asegúrate de estar dentro del directorio:
bash
cd front


### 2. Instalar las dependencias
Instala todos los paquetes necesarios definidos en el archivo package.json. Ejecuta en tu terminal:
bash
npm install


### 3. Ejecutar el servidor de desarrollo
Inicia la aplicación en modo desarrollo. Vite levantará un servidor local muy rápido:
bash
npm run dev


### 4. Acceder a la aplicación
Abre tu navegador web y visita la dirección que aparezca en la terminal, típicamente es:
text
http://localhost:5173/


---

##  Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los comandos configurados:

- npm run dev: Inicia el servidor de desarrollo local.
- npm run build: Construye la aplicación optimizada para producción dentro de la carpeta dist.
- npm run preview: Levanta un servidor local con la aplicación ya construida (útil para verificar cómo quedó el build final).
- npm run lint: Analiza el código en busca de posibles errores de sintaxis o estilo usando ESLint.

---

## Estructura Principal del Proyecto

text
 front
 ┣  src              # Código fuente de React (Componentes, Vistas, etc.)
 ┣  styles           # Hojas de estilo y CSS
 ┣  utils            # Funciones de utilidad y validadores
 ┣  index.html       # Archivo HTML principal
 ┣  package.json     # Declaración de dependencias y scripts
 ┗  vite.config.js   # Configuración base de Vite
