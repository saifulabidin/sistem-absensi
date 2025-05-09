module.exports = {
	content: ['src/**/*.*', 'public/**/*.*'],
	theme: {
		extend: {
			colors: {
				theme: '#00b274',
				black: {
					100: '#f2f2f2',
					200: '#dbdbdb',
					300: '#bfbfbf',
					400: '#a5a5a5',
					500: '#909090',
					600: '#787878',
					700: '#585858',
					800: '#303030',
					900: '#121212',
				},
			},
			scale: {
				flip: '-1',
			},
			spacing: {
				'270': '270px',
				'minus-270': '-270px',
				'minus-320': '-320px',
			},
			width: {
				'270': '270px',
			},
			margin: {
				'minus-270': '-270px',
				'minus-320': '-320px',
			},
			minHeight: {
				'100vh': '100vh',
			},
			borderWidth: {
				3: '3px',
			},
			boxShadow: {
				theme: '0 0 15px 0 rgba(0, 178, 116, 0.01)',
			},
		},
		screens: {
			xs: '375px',
			sm: '600px',
			md: '768px',
			lg: '1024px',
			xl: '1200px',
		},
		maxWidth: {
			...[...Array(1201)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
			xs: '375px',
			sm: '600px',
			md: '768px',
			lg: '1024px',
			xl: '1200px',
			none: 'none',
		},
		minWidth: {
			...[...Array(1201)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
			xs: '375px',
			sm: '600px',
			md: '768px',
			lg: '1024px',
			xl: '1100px',
			none: 'none',
		},
		maxHeight: {
			...[...Array(1201)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
		},
		borderRadius: {
			...[...Array(32)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			'100vh': '100vh',
		},
		fontSize: {
			...[...Array(101)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}vw`] = `${i}vw`
				return m
			}, {}),
		},
		padding: {
			...[...Array(513)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
			...[...Array(5)].reduce((m, _, i) => {
				m[`${i}em`] = `${i}em`
				return m
			}, {}),
		},
		margin: {
			...[...Array(513)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(513)].reduce((m, _, i) => {
				m[`minus-${i}`] = `-${i}px`
				return m
			}, {}),
			auto: 'auto',
		},
		width: {
			...[...Array(1001)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}vw`] = `${i}vw`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
			fit: 'fit-content',
		},
		height: {
			...[...Array(1001)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}vh`] = `${i}vh`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
			fit: 'fit-content',
		},
		lineHeight: {
			...[...Array(101)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			'1em': '1em',
		},
		zIndex: {
			...[...Array(10001)].reduce((m, _, i) => {
				m[i] = `${i}`
				return m
			}, {}),
			'minus-1': '-1',
			auto: 'auto',
		},
		translate: {
			...[...Array(1001)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(1001)].reduce((m, _, i) => {
				m[`minus-${i}`] = `-${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`minus-${i}p`] = `-${i}%`
				return m
			}, {}),
		},
		inset: {
			...[...Array(1001)].reduce((m, _, i) => {
				m[i] = `${i}px`
				return m
			}, {}),
			...[...Array(1001)].reduce((m, _, i) => {
				m[`minus-${i}`] = `-${i}px`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`${i}p`] = `${i}%`
				return m
			}, {}),
			...[...Array(101)].reduce((m, _, i) => {
				m[`minus-${i}p`] = `-${i}%`
				return m
			}, {}),
			auto: 'auto',
		},
	},
	plugins: [],
}
