# La cueva Wumpus

Un juego de exploración y deducción en Angular, en español y que se ejecuta solo en el navegador. Configura una cueva cuadrada y ortogonal, sigue las pistas, recoge el oro y regresa a la entrada. Cada disposición generada al azar incluye una ruta segura hasta el oro.

## Requisitos previos

- Node.js 20.19+ (o la versión de Node compatible con Angular CLI 22)
- npm 10+
- Chrome o Chromium para ejecutar las pruebas de Karma en el navegador

## Instalar y ejecutar

```bash
npm install
npm start
```

Abre [http://localhost:4200/setup](http://localhost:4200/setup) para configurar una partida. La ruta `/play` está disponible cuando se inicia una partida. La aplicación se ejecuta por completo en el navegador; no requiere cuenta, servidor ni datos guardados.

## Cómo jugar

Elige un tamaño de tablero de al menos 2, una cantidad de pozos entre 0 y `tamaño² - 3`, y una cantidad de flechas no negativa. Comienzas en la esquina superior izquierda mirando hacia abajo. Usa las flechas del teclado para moverte una casilla en esa dirección, la tecla **Espacio** para disparar, **Enter** para salir, o los controles en pantalla. El panel «Casilla actual» muestra los mensajes de la casilla donde está el cazador, separado de la bitácora completa de eventos. Si chocas con una pared, te quedas en el mismo lugar. Un disparo viaja en línea recta hasta el borde del tablero. Recoge el oro, vuelve a la salida y usa **Salir** para ganar. El mapa no revela los peligros sin explorar, salvo que uses el botón de mostrar elementos; al terminar la partida se muestra la disposición completa.

## Pruebas y compilación

Ejecuta las pruebas unitarias de Karma/Jasmine en Chrome Headless:

```bash
npm test
```

Crea una compilación de producción:

```bash
npm run build
```

Para desarrollo local con recompilación automática, ejecuta `npm run watch`.

Revisa la calidad del código antes de abrir un PR:

```bash
npm run lint
npm run format:check
```

Usa `npm run format` para aplicar el formato de Prettier.

## Estructura del proyecto

- `src/app/core/` — reglas del juego, generación aleatoria de tableros con ruta segura, percepciones, transiciones de estado y la sesión de juego en memoria.
- `src/app/features/setup/` y `src/app/features/play/` — páginas de configuración y de juego, con sus formularios y plantillas.
- `src/app/shared/components/` — componentes reutilizables: mapa, controles, estado y bitácora.
- `src/app/**/*.spec.ts` — pruebas unitarias y de interfaz ejecutadas con Karma/Jasmine.
