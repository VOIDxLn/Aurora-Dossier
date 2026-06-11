# Pull Request Summary: Fix para FK de Informes y Autocreación de Perfiles

Este pull request contiene la solución definitiva a los errores de violación de clave foránea (`informes_user_id_fkey`) que ocurrían al intentar guardar informes de usuarios antiguos o nuevos que no contaban con un perfil (`profiles`) previamente creado en la base de datos.

> [!NOTE]
> **Estado de la sesión:** Nos hemos quedado sin tokens/cuota por el día de hoy, pero todo el trabajo del fix ha sido implementado, testeado y está listo para ser revisado y fusionado a `main`.

---

## Cambios Implementados

### 1. Robustez en la resolución y creación de perfiles (`profiles`)
Anteriormente, al guardar un informe (`reportService.save`), si el usuario no tenía un perfil en la tabla `profiles`, se intentaba crear uno (`upsertProfile`). Sin embargo:
- Si el empleado era antiguo y tenía su `auth_uid` en `NULL` en la tabla `empleados`, buscarlo por UID no retornaba nada.
- Si se intentaba crear el perfil, fallaba la restricción de base de datos `not-null` en la columna `email` de la tabla `profiles`.

**Solución:**
- Se implementó una **estrategia de fallback**: si no se encuentra el empleado por su `auth_uid`, se le busca en la base de datos por su `email` registrado en la sesión de Auth de Supabase.
- Se actualizó el método `upsertProfile` en `profileRepository` para aceptar y mandar la columna `email` requerida por el esquema.
- Se propagó este cambio a todos los puntos donde se llama a `ensureProfile` (`UserContext.js`, `CrearUsuario/index.js`, `profileService.js` y `reportService.js`).
- Se añadieron logs diagnósticos detallados en `reportService.js` para monitorear cada paso de la búsqueda/inserción del perfil.

### 2. Archivos Modificados
* **[profileRepository.js](file:///c:/Users/diego/OneDrive/Documentos/Aurora-Dossier/src/repositories/profileRepository.js)**: Modificado `upsertProfile` para aceptar y opcionalmente mapear el parámetro `email`.
* **[profileService.js](file:///c:/Users/diego/OneDrive/Documentos/Aurora-Dossier/src/services/profileService.js)**: Firma de `ensureProfile` actualizada para recibir y pasar el `email`.
* **[UserContext.js](file:///c:/Users/diego/OneDrive/Documentos/Aurora-Dossier/src/context/UserContext.js)**: Llama a `ensureProfile` pasando el email de manera asíncrona ("fire-and-forget") con captura de warnings para mejorar la UX.
* **[CrearUsuario/index.js](file:///c:/Users/diego/OneDrive/Documentos/Aurora-Dossier/src/screens/CrearUsuario/index.js)**: Llama a `ensureProfile` pasando el email al momento de dar de alta nuevos usuarios.
* **[reportService.js](file:///c:/Users/diego/OneDrive/Documentos/Aurora-Dossier/src/services/reportService.js)**: Implementación de la lógica autosanante de perfiles con fallback por email y validación detallada de errores.

---

## Verificación

1. **Auto-reparación de perfiles (Antiguos y Nuevos):**
   - Al iniciar sesión con un usuario antiguo (con `auth_uid` inicial en `NULL`) o cualquier usuario sin fila en `profiles`.
   - Al intentar crear y guardar un informe en la pantalla de chat, el sistema ahora detecta la ausencia de perfil, localiza al empleado usando su email de Auth, crea el perfil correspondiente en `profiles` (llenando la columna `email` obligatoria) y finalmente guarda el informe de manera exitosa.
2. **Logs Limpios:**
   - La consola del Metro bundler muestra logs del flujo de resolución de perfiles y confirma cuando se ha creado exitosamente.

---

## Instrucciones para el Pull Request a `main`

1. **Revisar cambios y diffs:**
   Asegúrate de que los cambios de este branch (`fix/fk-informes-user-id`) se integren correctamente.
2. **Fusione el branch:**
   Una vez aprobado, fusiona `fix/fk-informes-user-id` a la rama `main` en GitHub o de manera local:
   ```bash
   git checkout main
   git merge fix/fk-informes-user-id
   git push origin main
   ```
