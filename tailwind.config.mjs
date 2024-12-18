import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        merriweather: ['Merriweather Sans', 'serif']
      },
      fontSize: {
        18: '18px',
        40: '40px',
        24: '24px'
      },
      fontWeight: {
        regular: 400,
        semibold: 600,
        bold: 700
      },
      colors: {
        background: '#F5F5F5',
        blue: {
          primary: '#1A3D5D'
        },
        gray: {
          primary: '#383838',
          secondary: '#4F4F4F'
        }
      },
      maxWidth: {
        '5/6': '83.333333%'
      }
    }
  },
  plugins: [nextui()]
}
