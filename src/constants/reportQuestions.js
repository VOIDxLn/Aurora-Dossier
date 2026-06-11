export const REPORT_FIELDS = ['titulo', 'actividad', 'responsable', 'fecha', 'detalles'];

export const REPORT_QUESTIONS = [
    { campo: 'titulo',      pregunta: 'Para comenzar, dame un titulo para este informe.' },
    { campo: 'actividad',   pregunta: 'Describe brevemente la actividad o evento a documentar.' },
    { campo: 'responsable', pregunta: 'Quien realizo la actividad? (nombre o cargo)' },
    { campo: 'fecha',       pregunta: 'Selecciona la fecha del evento:', esFecha: true },
    { campo: 'detalles',    pregunta: 'Agrega los detalles, observaciones o resultados importantes.' },
];

export const EMPTY_REPORT_DATA = {
    titulo:      '',
    actividad:   '',
    responsable: '',
    fecha:       '',
    detalles:    '',
};
