/**
 * content.js — ÚNICA fuente de verdad de todos los textos de la invitación.
 *
 * REGLA: ningún texto se escribe directamente en el HTML ni en otros JS.
 * Si cambia la hora, el lugar o cualquier mensaje, se edita AQUÍ.
 */

export const EVENT = {
  babyName: 'Juan Manuel',
  parentsNames: 'Cristian & Luisa',
  parentsFullNames: 'Cristian Cerón & Luisa Ordóñez',

  // Fecha/hora del evento en timestamp ABSOLUTO (no tocar el offset -05:00)
  dateISO: '2026-08-15T16:00:00-05:00',
  dateText: 'Sábado 15 de agosto de 2026',
  timeText: '4:00 p.m.',

  venue: 'Salón Social Balcones del Este',
  address: 'Cra 2 #22B-123',
  city: 'Pasto, Nariño',

  // Consulta para el botón "Cómo llegar" y el iframe del mapa (Fase 1/3)
  mapsQuery:
    'Salón Social Balcones del Este, Cra 2 #22B-123, Pasto, Nariño, Colombia',

  // Ruta del archivo de música (archivo propio del cliente, optimizado a AAC)
  audioSrc: 'assets/audio/musica.m4a',
};

export const TEXTS = {
  // 0. Bienvenida (overlay)
  welcome: {
    eyebrow: 'Abre esta historia',
    title: 'Una sorpresa muy especial te espera',
    button: 'Ver invitación',
  },

  // 1. Hero
  hero: {
    chapter: 'Capítulo I',
    kicker: 'Estás invitado al Baby Shower de',
    scrollHint: 'Desliza la historia',
  },

  // 2. Mensaje emotivo
  message: {
    chapter: 'Capítulo II',
    title: 'Un mensaje con el corazón',
    text: 'Un pequeño milagro está por llegar y queremos celebrarlo contigo. Con mucha ilusión te invitamos a compartir la alegría de la llegada de nuestro bebé.',
    signature: 'Cristian & Luisa',
  },

  // 3. Detalles
  details: {
    chapter: 'Capítulo III',
    title: 'Detalles del evento',
    lead: 'Todo lo que necesitas saber para acompañarnos',
    dateLabel: 'Fecha',
    timeLabel: 'Hora',
    venueLabel: 'Lugar',
  },

  // 4. Cuenta regresiva
  countdown: {
    chapter: 'Capítulo IV',
    title: 'La espera más dulce',
    lead: 'Cada segundo nos acerca al gran día',
    days: 'Días',
    hours: 'Horas',
    minutes: 'Minutos',
    seconds: 'Segundos',
    eventDayMessage: '¡Hoy es el gran día!',
  },

  // 5. Ubicación
  location: {
    chapter: 'Capítulo V',
    title: '¿Dónde te esperamos?',
    mapsButton: 'Cómo llegar',
  },

  // 6. RSVP
  rsvp: {
    chapter: 'Capítulo VI',
    title: 'Confírmanos tu asistencia',
    subtitle: 'Nos encantaría contar contigo en esta historia',
    nameLabel: 'Tu nombre',
    namePlaceholder: 'Escribe tu nombre',
    attendingQuestion: '¿Asistirás?',
    yesOption: 'Sí, ahí estaré',
    noOption: 'No podré',
    submitButton: 'Enviar respuesta',
    sendingButton: 'Enviando…',
    successTitle: '¡Gracias!',
    successMessage: 'Tu respuesta fue enviada con amor.',
    errorMessage: 'Hubo un problema al enviar. Por favor intenta de nuevo.',
  },

  // 7. Cierre
  closing: {
    chapter: 'Epílogo',
    message: '¡Te esperamos con los brazos abiertos!',
    signature: 'Con amor, Cristian & Luisa',
    footer: 'Baby Shower de Juan Manuel · 15.08.2026',
  },
};
