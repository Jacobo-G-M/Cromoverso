# Cromoverso

> Plataforma web interactiva para coleccionar, explorar y gestionar cromos digitales de héroes, aliados y villanos a lo largo de seis mundos fantásticos. (Proyecto académico)

---

## Descripción del Proyecto

**Cromoverso** es una aplicación web desarrollada con **React 19** y **Vite**. El proyecto implementa un catálogo interactivo de cromos coleccionables consumiendo una API REST asíncrona, incorporando filtrado dinámico bidireccional sincronizado con la URL, soporte multiidioma dinámico y una experiencia de usuario totalmente responsiva adaptada para móviles, tablets y escritorio.

---

## Tecnologías Utilizadas

* **React 19**: Biblioteca principal para la interfaz de usuario basada en Componentes Funcionales y Hooks modernos (`useState`, `useEffect`, `useRef`, `useId`).
* **Vite 8**: Entorno de desarrollo ultrarrápido y empaquetador para producción.
* **CSS Modules & Design Tokens**: Estilos encapsulados por componente combinados con un sistema centralizado de variables CSS (`src/styles/tokens.css`) que define paletas temáticas por mundo, sombras estilo pop-art, radios y tipografías.
* **Tipografías**: *Unbounded* (titulares y números) y *Rubik* (cuerpo y notas), importadas como fuentes locales optimizadas.
* **Vite Plugin SVGR**: Transformación de recursos SVG vectoriales a componentes React interactivos.
* **API REST**: Backend asíncrono para el catálogo de mundos y textos localizados (`https://yanethm-cromoverso-api.fly.dev/api/v1`).

---

## Instalación y Ejecución

### Prerrequisitos
* **Node.js** (versión 18.0 o superior recomendada)
* **npm** o gestor de paquetes equivalente

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jacobo-G-M/Cromoverso.git
cd Cromoverso
```

### 2. Instalar dependencias
```bash
npm i
```

### 3. Configurar variables de entorno
En el repositorio viene el archivo .env.example, así que simplemente cambia su nombre a .env
```bash
cp .env.example .env
```

### 4. Iniciar el servidor de desarrollo
```bash
npm run dev
```
Abre en tu navegador la URL indicada (usualmente `http://localhost:5173`).

---