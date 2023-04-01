/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        modal:
          'rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0',
        button:
          'rgba(0, 0, 0, .2) 0 3px 5px -1px,rgba(0, 0, 0, .14) 0 6px 10px 0,rgba(0, 0, 0, .12) 0 1px 18px 0',
        'button-hover':
          '0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%)',
      },
      colors: {
        'task-1': '#1f8fdc',
        'task-1-hover': '#1f6fa8',
        'task-2': '#20ace6',
        'task-2-hover': '#2686ad',
        'task-3': '#42cdc2',
        'task-3-hover': '#3c978f',
        'task-4': '#fdbb01',
        'task-4-hover': '#e7ac0c',
      },
    },
  },
};
