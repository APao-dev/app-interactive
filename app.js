
require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const {inquirerMenu, 
       pausa,
       leerInput,
       listadoTareasBorrar, 
       confirmar,
       mostrarListadoCheckList
} = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');


console.clear();

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB) {
        // Establecer las tareas
        // TODO: cargarTareas
        tareas.cargarTareasFromArray(tareasDB);
    }


    do {
        // Imprime el menú
        opt = await inquirerMenu();
     
        switch (opt) {
            case '1':
                // crear opción
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea(desc);

            break;

            case '2':
                tareas.listadoCompleto();

            break; 
            case '3':  //listar completadas
                tareas.listarPendientesCompletadas(true);

            break; 
            case '4': //listar pendientes
                tareas.listarPendientesCompletadas(false);

            break; 

            case '5': //listar pendientes
                const ids = await mostrarListadoCheckList(tareas.listadoArr);
                tareas.toggleCompletadas(ids);

            break;   
            
            case '6': //Borrar
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if ( id !== '0') {
                    const ok = await confirmar('Está seguro que quiere borrar?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                

            break;  
           
        }

        guardarDB(tareas.listadoArr);
        


        await pausa();

    } while(opt !== '0');

    
    // pausa();


}

main();