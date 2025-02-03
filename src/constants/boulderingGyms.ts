const BOULDERING_GYMS = {
  gneis: {
    name: 'Gneis Lilleaker',
    grades: [
      'white',
      'green',
      'blue',
      'yellow',
      'orange',
      'red',
      'black',
      'comp',
    ],
  },
  skullerud: {
    name: 'Oslo Klatresenter (Skullerud)',
    grades: [
      'white',
      'green',
      'blue',
      'yellow',
      'red',
      'purple',
      'black',
      'slab of the week',
    ],
  },
  lokka: {
    name: 'Klatreverket Løkka',
    grades: [
      'white',
      'green',
      'blue',
      'yellow',
      'red',
      'black',
      'silver',
      'slab of the month',
    ],
  },
} as const;

export default BOULDERING_GYMS;
