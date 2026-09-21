// Single source of truth for every patient case, shared by every widget that
// shows one: the homepage stories carousel, the raboty/index.html card grid
// and hero-photo crossfade, and the "pm" popup gallery on both pages. Before
// this file existed, a single patient's cover photo had to be changed by
// hand in four separate places (this used to live as its own copy of this
// exact object, once each, in index.html and raboty/index.html) — one typo
// or missed spot and a stale photo would sit on the site until someone
// happened to notice. `cover` is the base filename (no extension) used
// wherever a single representative thumbnail is needed; `photos`/`labels`
// are the full case gallery shown in the popup.
window.PATIENTS = {
  darya: {
    name: 'Дарья', tag: 'Керамические виниры',
    desc: '8 виниров, подготовка эмали и фиксация по индивидуальным слепкам.',
    url: '/raboty/patient-1.html',
    cover: 'darya-portrait2',
    photos: ['/img/patients/darya-portrait.webp','/img/patients/darya-portrait2.webp','/img/patients/darya-portrait3.webp','/img/patients/darya-before.webp','/img/patients/darya-before2.webp','/img/patients/darya-before3.webp','/img/patients/darya-before4.webp','/img/patients/darya-after.webp','/img/patients/darya-after2.webp','/img/patients/darya-after3.webp','/img/patients/darya-after4.webp'],
    labels: ['Портрет, до','Портрет','Портрет','До','До','До','До','После','После, ракурс 2','После, ракурс 3','После, ракурс 4']
  },
  uriy: {
    name: 'Юрий', tag: 'Имплантационное лечение',
    desc: 'Диагностика, установка имплантов, протезирование.',
    url: '/raboty/patient-2.html',
    cover: 'uriy-portrait',
    photos: ['/img/patients/uriy-portrait.webp','/img/patients/uriy-before.webp','/img/patients/uriy-after.webp'],
    labels: ['Портрет','До','После']
  },
  yuliya: {
    name: 'Юлия', tag: 'Керамические виниры',
    desc: 'Подготовка эмали, изготовление виниров по индивидуальным слепкам, фиксация.',
    url: '/raboty/patient-3.html',
    cover: 'yuliya-portrait',
    photos: ['/img/patients/yuliya-portrait.webp','/img/patients/yuliya-before.webp','/img/patients/yuliya-before2.webp','/img/patients/yuliya-before3.webp','/img/patients/yuliya-after.webp','/img/patients/yuliya-after2.webp','/img/patients/yuliya-after3.webp','/img/patients/yuliya-after4.webp'],
    labels: ['Портрет','До','До','До','После','После, ракурс 2','После, ракурс 3','После, ракурс 4']
  },
  kristina: {
    name: 'Кристина', tag: 'Керамические виниры',
    desc: 'Подготовка эмали, изготовление виниров по индивидуальным слепкам, фиксация.',
    url: '/raboty/patient-4.html',
    cover: 'kristina-after',
    photos: ['/img/patients/kristina-after.webp'],
    labels: ['После']
  },
  irina: {
    name: 'Ирина', tag: 'Керамические виниры и коронки',
    desc: 'Подготовка зубов, изготовление виниров и коронок по индивидуальным слепкам, фиксация.',
    url: '/raboty/patient-5.html',
    cover: 'irina-portrait',
    photos: ['/img/patients/irina-portrait.webp','/img/patients/irina-before.webp','/img/patients/irina-after.webp','/img/patients/irina-after2.webp','/img/patients/irina-after3.webp','/img/patients/irina-after4.webp','/img/patients/irina-after5.webp'],
    labels: ['Портрет','До','После','После, ракурс 2','После, ракурс 3','После, ракурс 4','После, ракурс 5']
  },
  oksana: {
    name: 'Оксана', tag: 'Имплантационное лечение',
    desc: 'Диагностика, установка имплантов, протезирование.',
    url: '/raboty/patient-6.html',
    cover: 'oksana-portrait',
    photos: ['/img/patients/oksana-portrait.webp','/img/patients/oksana-after.webp','/img/patients/oksana-after2.webp'],
    labels: ['Портрет','После','После, рентген']
  },
  'olga-v': {
    name: 'Ольга', tag: 'Керамические виниры',
    desc: 'Подготовка эмали, изготовление виниров по индивидуальным слепкам, фиксация.',
    url: '/raboty/patient-7.html',
    cover: 'olga-v-portrait',
    photos: ['/img/patients/olga-v-portrait.webp','/img/patients/olga-v-before.webp','/img/patients/olga-v-after.webp'],
    labels: ['Портрет','До','После']
  },
  natalya: {
    name: 'Наталья', tag: 'Имплантационное лечение',
    desc: 'Диагностика по КТ/рентгену, установка имплантов, протезирование.',
    url: '/raboty/patient-8.html',
    cover: 'natalya-portrait',
    photos: ['/img/patients/natalya-portrait.webp','/img/patients/natalya-after.webp'],
    labels: ['Портрет','После']
  },
  'olga-i': {
    name: 'Ольга', tag: 'Имплантационное лечение',
    desc: 'Диагностика, установка имплантов, протезирование.',
    url: '/raboty/patient-9.html',
    cover: 'olga-i-portrait',
    photos: ['/img/patients/olga-i-portrait.webp','/img/patients/olga-i-before.webp','/img/patients/olga-i-before2.webp','/img/patients/olga-i-before3.webp','/img/patients/olga-i-after.webp','/img/patients/olga-i-after2.webp','/img/patients/olga-i-after3.webp','/img/patients/olga-i-after4.webp'],
    labels: ['Портрет','До','До','До','После','После, ракурс 2','После, ракурс 3','После, ракурс 4']
  },
  mikhail: {
    name: 'Михаил', tag: 'Керамические реставрации',
    desc: 'Установка 28 керамических реставраций.',
    url: '/raboty/patient-10.html',
    cover: 'mikhail-after',
    photos: ['/img/patients/mikhail-before.webp','/img/patients/mikhail-before2.webp','/img/patients/mikhail-before3.webp','/img/patients/mikhail-after.webp','/img/patients/mikhail-after2.webp','/img/patients/mikhail-after3.webp'],
    labels: ['До','До','До','После','После, ракурс 2','После, ракурс 3']
  }
};
