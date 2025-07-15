import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#f3f4f6',
            a: {
              color: '#ec4899',
              '&:hover': {
                color: '#f472b6',
              },
            },
            h1: {
              color: '#ec4899',
            },
            h2: {
              color: '#ec4899',
            },
            h3: {
              color: '#ec4899',
            },
            h4: {
              color: '#ec4899',
            },
            strong: {
              color: '#f9a8d4',
            },
            blockquote: {
              color: '#f9a8d4',
              borderLeftColor: '#be185d',
            },
            hr: {
              borderColor: '#6b7280',
            },
            ul: {
              li: {
                '&::marker': {
                  color: '#be185d',
                },
              },
            },
            ol: {
              li: {
                '&::marker': {
                  color: '#be185d',
                },
              },
            },
            code: {
              color: '#f9a8d4',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              padding: '0.25rem',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
