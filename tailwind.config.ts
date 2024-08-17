import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import colors from './src/configs/colors'

export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: `rgba(${colors.primary['100']}, <alpha-value>)`,
          200: `rgba(${colors.primary['200']}, <alpha-value>)`,
          300: `rgba(${colors.primary['300']}, <alpha-value>)`,
          400: `rgba(${colors.primary['400']}, <alpha-value>)`,
          500: `rgba(${colors.primary['500']}, <alpha-value>)`,
          600: `rgba(${colors.primary['600']}, <alpha-value>)`,
          700: `rgba(${colors.primary['700']}, <alpha-value>)`,
          DEFAULT: `rgba(${colors.primary.default}, <alpha-value>)`
        },

        success: {
          100: `rgba(${colors.success['100']}, <alpha-value>)`,
          200: `rgba(${colors.success['200']}, <alpha-value>)`,
          300: `rgba(${colors.success['300']}, <alpha-value>)`,
          400: `rgba(${colors.success['400']}, <alpha-value>)`,
          500: `rgba(${colors.success['500']}, <alpha-value>)`,
          DEFAULT: `rgba(${colors.success.default}, <alpha-value>)`
        },

        danger: {
          100: `rgba(${colors.danger['100']}, <alpha-value>)`,
          200: `rgba(${colors.danger['200']}, <alpha-value>)`,
          300: `rgba(${colors.danger['300']}, <alpha-value>)`,
          400: `rgba(${colors.danger['400']}, <alpha-value>)`,
          500: `rgba(${colors.danger['500']}, <alpha-value>)`,
          DEFAULT: `rgba(${colors.danger.default}, <alpha-value>)`
        },

        warning: {
          100: `rgba(${colors.warning['100']}, <alpha-value>)`,
          200: `rgba(${colors.warning['200']}, <alpha-value>)`,
          300: `rgba(${colors.warning['300']}, <alpha-value>)`,
          400: `rgba(${colors.warning['400']}, <alpha-value>)`,
          500: `rgba(${colors.warning['500']}, <alpha-value>)`,
          DEFAULT: `rgba(${colors.warning.default}, <alpha-value>)`
        },

        info: {
          100: `rgba(${colors.info['100']}, <alpha-value>)`,
          200: `rgba(${colors.info['200']}, <alpha-value>)`,
          300: `rgba(${colors.info['300']}, <alpha-value>)`,
          400: `rgba(${colors.info['400']}, <alpha-value>)`,
          500: `rgba(${colors.info['500']}, <alpha-value>)`,
          DEFAULT: `rgba(${colors.info.default}, <alpha-value>)`
        },

        gray: {
          100: `rgba(${colors.gray['100']}, <alpha-value>)`,
          200: `rgba(${colors.gray['200']}, <alpha-value>)`,
          300: `rgba(${colors.gray['300']}, <alpha-value>)`,
          400: `rgba(${colors.gray['400']}, <alpha-value>)`,
          500: `rgba(${colors.gray['500']}, <alpha-value>)`,
          600: `rgba(${colors.gray['600']}, <alpha-value>)`,
          700: `rgba(${colors.gray['700']}, <alpha-value>)`,
          800: `rgba(${colors.gray['800']}, <alpha-value>)`,
          900: `rgba(${colors.gray['900']}, <alpha-value>)`,
          950: `rgba(${colors.gray['950']}, <alpha-value>)`
        }
      },
      textColor: {
        heading: `rgba(${colors.gray['900']}, <alpha-value>)`,
        default: `rgba(${colors.gray['800']}, <alpha-value>)`,
        regular: `rgba(${colors.gray['700']}, <alpha-value>)`,
        description: `rgba(${colors.gray['600']}, <alpha-value>)`,
        disable: `rgba(${colors.gray['500']}, <alpha-value>)`,
        invert: `rgba(${colors.white}, <alpha-value>)`,
        inactive: `rgba(${colors.gray['500']}, <alpha-value>)`,
        focus: `rgba(${colors.gray['700']}, <alpha-value>)`,

        // Form
        label: `rgba(${colors.gray['700']}, <alpha-value>)`,
        helper: `rgba(${colors.gray['600']}, <alpha-value>)`,
        filled: `rgba(${colors.gray['800']}, <alpha-value>)`,
        placeholder: `rgba(${colors.gray['500']}, <alpha-value>)`
      },
      backgroundColor: {
        light: `rgba(${colors.gray['100']}, <alpha-value>)`,
        dark: `rgba(${colors.gray['800']}, <alpha-value>)`,
        hover: `rgba(${colors.gray['200']}, <alpha-value>)`,
        default: `rgba(${colors.white}, <alpha-value>)`
      },
      borderColor: {
        default: `rgba(${colors.gray['300']}, <alpha-value>)`,
        regular: `rgba(${colors.gray['400']}, <alpha-value>)`,
        light: `rgba(${colors.gray['300']}, <alpha-value>)`,
        dark: `rgba(${colors.gray['700']}, <alpha-value>)`
      },
      fontSize: {
        'caption-small': ['12px', '18px'],
        caption: ['14px', '21px'],
        body: ['16px', '24px'],
        'body-medium': ['16px', '24px'],
        h6: ['16px', '24px'],
        h5: ['18px', '26px'],
        h4: ['20px', '28px'],
        h3: ['24px', '32px'],
        h2: ['34px', '42px'],
        h1: ['46px', '54px']
      },
      borderRadius: {
        sm: '3px',
        md: '8px',
        lg: '20px',
        xl: '40px'
      },
      boxShadow: {
        1: '0px 2px 4px 0px rgba(0, 0, 0, 0.10)',
        2: '0px 4px 10px 0px rgba(0, 0, 0, 0.10)',
        3: '0px 8px 16px 0px rgba(0, 0, 0, 0.15)',
        4: '0px 16px 48px 0px rgba(0, 0, 0, 0.17)'
      }
    }
  },
  plugins: [animate]
} satisfies Config
