import { NextRouter } from 'next/router'
import { motion } from 'framer-motion'
import { PageTransition } from 'next-page-transitions'

const transitionStyles = {
	enter: {
		opacity: 0.3,
	},
	enterActive: {
		opacity: 1,
		transition: {
			duration: 1,
		},
	},
	exit: {
		opacity: 0.3,
		transition: {
			duration: 1,
		},
	},
}

const TransitionWrapper = ({
	children,
	router,
}: Wrapper & { router: NextRouter }) => {
	return (
		<PageTransition
			timeout={100}
			classNames="page-transition"
			monkeyPatchScrolling
			loadingDelay={100}
			loadingTimeout={{
				enter: 500,
				exit: 0,
			}}
			loadingClassNames="loading-indicator"
		>
			<motion.div
				key={router.route}
				initial="enter"
				animate="enterActive"
				exit="exit"
				variants={transitionStyles}
			>
				{children}
			</motion.div>
		</PageTransition>
	)
}

export default TransitionWrapper
