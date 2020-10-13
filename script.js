//Config colors
const fontColorConfig = {
  colors: [
    {
      color: '#444',
      label: 'Black'
    },
    {
      color: '#ff0000',
      label: 'Red'
    },
    {
      color: '#504fe4',
      label: 'BeeBlue'
    },
    {
      color: '#01d48f',
      label: 'BeeGreen'
    },
    {
      color: '#ff4283',
      label: 'BeePink'
    },
    {
      color: '#ffc600',
      label: 'BeeYellow'
    },
    {
      color: '#23aad1',
      label: 'Classe/Groupe'
    },
    {
      color: '#fa6400',
      label: 'Matière'
    },
  ],
  columns: 4,
  documentColors: 8
};

ClassicEditor
  .create(document.querySelector('#editor'), {
    fontColor: fontColorConfig,
  });