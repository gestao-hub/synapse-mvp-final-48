import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				midnight: '#000131',        /* Midnight Blue da paleta */
				'midnight-blue': '#000131',
				'electric-purple': '#8601F8', /* Electric Purple da paleta */
				'force-black': '#0C0C0D',    /* Deep Black da paleta */
				purple: '#8601F8',           /* Electric Purple */
				spring: '#00FF99',           /* Spring Green da paleta */
				deep: '#0C0C0D',            /* Deep Black */
				white: '#FFFFFF',           /* Pure White da paleta */
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: '16px',
				'2xl': '20px'
			},
			boxShadow: {
				soft: '0 10px 30px rgba(0,0,0,.12)'
			},
			backgroundImage: {
				'brand-bg': 'linear-gradient(180deg,#000131 0%,#0C0C0D 100%)',  /* Midnight Blue to Deep Black */
				'synapse-gradient': 'linear-gradient(90deg,#8601F8 0%,#00FF99 100%)', /* Electric Purple to Spring Green */
				'brand-gradient': 'linear-gradient(to right, #8601F8, #00FF99)',      /* Electric Purple to Spring Green */
				'brand-text': 'linear-gradient(to right, #8601F8, #00FF99)',         /* Electric Purple to Spring Green */
				'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
			},
			fontFamily: {
				cal: ['"Cal Sans"','Inter','system-ui','sans-serif'],
				axi: ['"Axiforma"','Inter','system-ui','sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-10px) rotate(180deg)' }
				},
				'orbit': {
					'0%': { transform: 'rotate(0deg) translateX(50px) rotate(0deg)' },
					'100%': { transform: 'rotate(360deg) translateX(50px) rotate(-360deg)' }
				},
				'wave-pulse': {
					'0%, 100%': { transform: 'scaleX(0.8) scaleY(1)', opacity: '0.5' },
					'50%': { transform: 'scaleX(1.2) scaleY(0.8)', opacity: '0.8' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(134, 1, 248, 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px rgba(134, 1, 248, 0.6), 0 0 60px rgba(0, 255, 153, 0.3)',
						transform: 'scale(1.05)'
					}
				},
				'ripple': {
					'0%': { transform: 'scale(0.8)', opacity: '1' },
					'100%': { transform: 'scale(2)', opacity: '0' }
				},
				'particle-dance': {
					'0%': { transform: 'translateX(0) translateY(0) scale(1)' },
					'25%': { transform: 'translateX(10px) translateY(-5px) scale(1.2)' },
					'50%': { transform: 'translateX(-5px) translateY(-10px) scale(0.8)' },
					'75%': { transform: 'translateX(-10px) translateY(5px) scale(1.1)' },
					'100%': { transform: 'translateX(0) translateY(0) scale(1)' }
				},
				'brain-pulse': {
					'0%': { 
						transform: 'scale(0.8)', 
						opacity: '0.3',
						filter: 'brightness(1)'
					},
					'50%': { 
						transform: 'scale(1.1)', 
						opacity: '0.8',
						filter: 'brightness(1.5)'
					},
					'100%': { 
						transform: 'scale(0.8)', 
						opacity: '0.3',
						filter: 'brightness(1)'
					}
				},
				'neural-fire': {
					'0%': { 
						transform: 'scale(0) translateX(0%)', 
						opacity: '0',
						boxShadow: '0 0 0px rgba(134, 1, 248, 0)'
					},
					'20%': { 
						transform: 'scale(1) translateX(20%)', 
						opacity: '1',
						boxShadow: '0 0 15px rgba(134, 1, 248, 0.8)'
					},
					'60%': { 
						transform: 'scale(0.8) translateX(60%)', 
						opacity: '0.7',
						boxShadow: '0 0 20px rgba(0, 255, 153, 0.6)'
					},
					'100%': { 
						transform: 'scale(0) translateX(100%)', 
						opacity: '0',
						boxShadow: '0 0 0px rgba(0, 255, 153, 0)'
					}
				},
				'tracer-line': {
					'0%': { 
						strokeDasharray: '0 100',
						opacity: '0'
					},
					'30%': { 
						strokeDasharray: '30 100',
						opacity: '1'
					},
					'70%': { 
						strokeDasharray: '100 100',
						opacity: '0.8'
					},
					'100%': { 
						strokeDasharray: '100 100',
						opacity: '0'
					}
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'energy-flow': {
					'0%': { 
						transform: 'translateX(-100%) scale(0.8)',
						opacity: '0'
					},
					'50%': {
						transform: 'translateX(0%) scale(1)',
						opacity: '1'
					},
					'100%': { 
						transform: 'translateX(100%) scale(0.8)',
						opacity: '0'
					}
				},
				'particle-float': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)',
						opacity: '0.5'
					},
					'50%': { 
						transform: 'translateY(-20px) rotate(180deg)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'orbit': 'orbit 8s linear infinite',
				'wave-pulse': 'wave-pulse 2s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'ripple': 'ripple 2s ease-out infinite',
				'particle-dance': 'particle-dance 6s ease-in-out infinite',
				'brain-pulse': 'brain-pulse 3s ease-in-out infinite',
				'neural-fire': 'neural-fire 2s ease-out infinite',
				'tracer-line': 'tracer-line 2.5s ease-out infinite',
				'shimmer': 'shimmer 2s infinite ease-in-out',
				'energy-flow': 'energy-flow 3s infinite linear',
				'particle-float': 'particle-float 4s infinite ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;